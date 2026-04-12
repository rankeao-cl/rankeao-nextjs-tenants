"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getApiBaseUrl } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getErrorMessage } from "@/lib/utils/error-message";

// Modular Components
import { ExplorerHeader } from "./components/ExplorerHeader";
import { OperationSidebar } from "./components/OperationSidebar";
import { RequestPanel } from "./components/RequestPanel";
import { ResponsePanel } from "./components/ResponsePanel";

type ExplorerOperation = {
  operationId: string;
  method: string;
  path: string;
  summary: string;
  requiresAuth: boolean;
  queryParams: string[];
  pathParams: string[];
  tag?: string;
  hasRequestBody: boolean;
};

type ExplorerResponse = {
  status: number;
  ok: boolean;
  url: string;
  durationMs: number;
  headers: Record<string, string>;
  body: string;
};

function prettyJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export default function PanelApiExplorerPage() {
  const [operations, setOperations] = useState<ExplorerOperation[]>([]);
  const [loadingOperations, setLoadingOperations] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOperationId, setSelectedOperationId] = useState("");
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [sendAuth, setSendAuth] = useState(true);
  const [bodyText, setBodyText] = useState("{}");
  const [running, setRunning] = useState(false);
  const [response, setResponse] = useState<ExplorerResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoadingOperations(true);
      try {
        const res = await fetch("/api/panel/openapi", { cache: "no-store" });
        const payload = (await res.json()) as {
          operations?: ExplorerOperation[];
          error?: string;
        };
        if (!res.ok || !payload.operations) {
          throw new Error(payload.error || `Error ${res.status}`);
        }
        setOperations(payload.operations);
        if (payload.operations.length > 0) {
          setSelectedOperationId(payload.operations[0].operationId);
        }
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "No se pudo cargar panel-api.yaml"));
      } finally {
        setLoadingOperations(false);
      }
    };
    void load();
  }, []);

  const filteredOperations = useMemo(() => {
    const q = search.toLowerCase();
    return operations.filter((op) =>
      op.operationId.toLowerCase().includes(q) ||
      op.path.toLowerCase().includes(q) ||
      op.method.toLowerCase().includes(q) ||
      String(op.tag || "").toLowerCase().includes(q)
    );
  }, [operations, search]);

  const selectedOperation = useMemo(() =>
    operations.find((op) => op.operationId === selectedOperationId) || null,
    [operations, selectedOperationId]
  );

  useEffect(() => {
    if (!selectedOperation) return;
    const nextPath: Record<string, string> = {};
    const nextQuery: Record<string, string> = {};
    selectedOperation.pathParams.forEach((p) => { nextPath[p] = ""; });
    selectedOperation.queryParams.forEach((p) => { nextQuery[p] = ""; });
    setPathParams(nextPath);
    setQueryParams(nextQuery);
    setSendAuth(selectedOperation.requiresAuth);
    setBodyText(selectedOperation.hasRequestBody ? "{}" : "");
    setResponse(null);
  }, [selectedOperationId, selectedOperation]);

  const executeOperation = async () => {
    if (!selectedOperation) return;
    let endpointPath = selectedOperation.path;

    for (const param of selectedOperation.pathParams) {
      const value = pathParams[param]?.trim();
      if (!value) {
        toast.error(`Falta path param: ${param}`);
        return;
      }
      endpointPath = endpointPath.replace(`{${param}}`, encodeURIComponent(value));
    }

    const baseUrl = getApiBaseUrl();
    const query = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      const trimmed = value.trim();
      if (trimmed) query.set(key, trimmed);
    });
    const queryString = query.toString();
    const requestUrl = `${baseUrl}${endpointPath}${queryString ? `?${queryString}` : ""}`;

    const headers: Record<string, string> = {};
    const upperMethod = selectedOperation.method.toUpperCase();

    if (sendAuth) {
      const token = useAuthStore.getState().accessToken;
      if (!token) {
        toast.error("No hay token panel para enviar Authorization");
        return;
      }
      headers.Authorization = `Bearer ${token}`;
    }

    let body: string | undefined;
    const canSendBody = !["GET", "HEAD"].includes(upperMethod);
    if (canSendBody && bodyText.trim()) {
      try {
        const parsed = JSON.parse(bodyText);
        body = JSON.stringify(parsed);
        headers["Content-Type"] = "application/json";
      } catch {
        toast.error("Body JSON inválido");
        return;
      }
    }

    setRunning(true);
    const startedAt = performance.now();

    try {
      const res = await fetch(requestUrl, { method: upperMethod, headers, body });
      const rawText = await res.text();
      let outputBody = rawText;
      if (rawText.trim()) {
        try {
          const parsed = JSON.parse(rawText) as unknown;
          outputBody = prettyJson(parsed);
        } catch {
          outputBody = rawText;
        }
      }
      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => { responseHeaders[key] = value; });
      setResponse({
        status: res.status,
        ok: res.ok,
        url: requestUrl,
        durationMs: Number((performance.now() - startedAt).toFixed(1)),
        headers: responseHeaders,
        body: outputBody || "(sin contenido)",
      });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Error de red al ejecutar la operación"));
      setResponse({
        status: 0,
        ok: false,
        url: requestUrl,
        durationMs: Number((performance.now() - startedAt).toFixed(1)),
        headers: {},
        body: getErrorMessage(error),
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-10 max-w-[1700px] mx-auto pb-10 px-4 sm:px-0 h-[calc(100vh-120px)] flex flex-col">
      <ExplorerHeader />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 flex-1 overflow-hidden min-h-0">
        {/* Sidebar: Operations List */}
        <div className="xl:col-span-1 h-full min-h-0">
           <OperationSidebar 
              operations={filteredOperations}
              isLoading={loadingOperations}
              search={search}
              onSearchChange={setSearch}
              selectedId={selectedOperationId}
              onSelect={setSelectedOperationId}
           />
        </div>

        {/* Main Workspace: Request & Response */}
        <div className="xl:col-span-3 h-full overflow-y-auto pr-2 custom-scrollbar space-y-8 min-h-0">
           {selectedOperation ? (
              <>
                 <RequestPanel 
                    operation={selectedOperation}
                    pathParams={pathParams}
                    setPathParams={setPathParams}
                    queryParams={queryParams}
                    setQueryParams={setQueryParams}
                    bodyText={bodyText}
                    setBodyText={setBodyText}
                    sendAuth={sendAuth}
                    setSendAuth={setSendAuth}
                    onExecute={executeOperation}
                    isRunning={running}
                 />
                 
                 <ResponsePanel response={response} />
              </>
           ) : (
              <div className="h-full flex items-center justify-center bg-[var(--surface)]/30 rounded-[32px] border-2 border-dashed border-[var(--surface)]">
                 <p className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-widest text-center">
                    Selecciona una operación del panel lateral<br />para comenzar el debuzzing
                 </p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
