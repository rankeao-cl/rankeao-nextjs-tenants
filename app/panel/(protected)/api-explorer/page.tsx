"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, Chip, Input, Skeleton, TextArea, TextField, Label } from "@heroui/react";
import { toast } from "@heroui/react";
import { getApiBaseUrl } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getErrorMessage } from "@/lib/utils/error-message";
import { Code2, Play, Search, Terminal } from "lucide-react";

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
        toast.danger(getErrorMessage(error, "No se pudo cargar panel-api.yaml"));
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
        toast.danger(`Falta path param: ${param}`);
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
        toast.danger("No hay token panel para enviar Authorization");
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
        toast.danger("Body JSON inválido");
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
      toast.danger(getErrorMessage(error, "Error de red al ejecutar la operación"));
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-heading)] text-gradient-brand">
          Panel API Explorer
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Lee `panel-api.yaml` y ejecuta operaciones por `operationId`.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="bg-[var(--surface)] border border-[var(--border)] xl:col-span-1">
          <Card.Content className="p-4 space-y-3">
            <TextField className="space-y-3 flex flex-col">
              <Label className="flex items-center gap-2">
                <Search className="h-4 w-4 text-[var(--foreground)]" />
                <span className="text-sm text-[var(--foreground)] font-medium">Operaciones</span>
              </Label>
              <Input
                placeholder="Buscar operationId, path, method..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearch(e.target.value)}
              />
            </TextField>

            {loadingOperations ? (
              <div className="space-y-3 py-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-[76px] w-full rounded-lg border border-[var(--border)] bg-[var(--surface-sunken)] p-3 flex flex-col gap-2">
                    <div className="flex justify-between items-center"><Skeleton className="h-4 w-32 rounded" /><Skeleton className="h-5 w-12 rounded" /></div>
                    <Skeleton className="h-3 w-48 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-h-[34rem] overflow-auto space-y-2 pr-1">
                {filteredOperations.map((op) => (
                  <Button
                    key={op.operationId}
                    type="button"
                    variant="tertiary"
                    onPress={() => setSelectedOperationId(op.operationId)}
                    className={`h-auto w-full justify-start rounded-lg border p-3 text-left transition-colors ${selectedOperationId === op.operationId
                      ? "border-[var(--accent)]/30 bg-[var(--accent)]/10"
                      : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]/20"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-[var(--foreground)]">{op.operationId}</p>
                      <Chip size="sm" variant="soft" color="default">{op.method}</Chip>
                    </div>
                    <p className="text-[11px] text-[var(--muted)] mt-1 break-all">{op.path}</p>
                    {op.tag ? <p className="text-[11px] text-[var(--field-placeholder)] mt-1">{op.tag}</p> : null}
                  </Button>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>

        <Card className="bg-[var(--surface)] border border-[var(--border)] xl:col-span-2">
          <Card.Content className="p-4 space-y-4">
            {!selectedOperation ? (
              <p className="text-sm text-[var(--muted)]">Selecciona una operación.</p>
            ) : (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-[var(--foreground)]" />
                    <p className="text-sm font-medium text-[var(--foreground)]">{selectedOperation.operationId}</p>
                    <Chip size="sm" variant="soft" color="default">{selectedOperation.method}</Chip>
                    {selectedOperation.requiresAuth ? (
                      <Chip size="sm" variant="soft" color="default">BearerAuth</Chip>
                    ) : null}
                  </div>
                  <p className="text-xs text-[var(--muted)] break-all">{selectedOperation.path}</p>
                  <p className="text-xs text-[var(--muted)]">{selectedOperation.summary}</p>
                </div>

                {selectedOperation.pathParams.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Path params</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedOperation.pathParams.map((param) => (
                        <TextField key={param} className="flex flex-col gap-1">
                          <Label className="text-xs text-[var(--muted)]">{param}</Label>
                          <Input
                            placeholder={param}
                            value={pathParams[param] || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPathParams((prev) => ({ ...prev, [param]: e.target.value }))}
                          />
                        </TextField>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOperation.queryParams.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Query params</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedOperation.queryParams.map((param) => (
                        <TextField key={param} className="flex flex-col gap-1">
                          <Label className="text-xs text-[var(--muted)]">{param}</Label>
                          <Input
                            placeholder={param}
                            value={queryParams[param] || ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setQueryParams((prev) => ({ ...prev, [param]: e.target.value }))}
                          />
                        </TextField>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOperation.hasRequestBody && (
                  <TextField className="space-y-2 flex flex-col">
                    <Label className="text-xs text-[var(--muted)] uppercase tracking-wide">Body JSON</Label>
                    <TextArea
                      value={bodyText}
                      onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setBodyText(e.target.value)}
                      rows={8}
                      className="font-mono text-xs"
                    />
                  </TextField>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant={sendAuth ? "primary" : "tertiary"}
                    onPress={() => setSendAuth((prev) => !prev)}
                  >
                    Authorization: {sendAuth ? "ON" : "OFF"}
                  </Button>
                  <Button size="sm" variant="primary" onPress={executeOperation} isPending={running}>
                    <Play className="h-3.5 w-3.5" /> Ejecutar
                  </Button>
                </div>
              </>
            )}
          </Card.Content>
        </Card>
      </div>

      <Card className="bg-[var(--surface)] border border-[var(--border)]">
        <Card.Content className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[var(--foreground)]" />
            <p className="text-sm font-medium text-[var(--foreground)]">Respuesta</p>
          </div>

          {response ? (
            <>
              <div className="flex flex-wrap gap-2 text-xs">
                <Chip size="sm" variant="soft" color="default">status {response.status}</Chip>
                <Chip size="sm" variant="soft" color={response.ok ? "success" : "danger"}>
                  {response.ok ? "ok" : "error"}
                </Chip>
                <Chip size="sm" variant="soft" color="default">{response.durationMs} ms</Chip>
              </div>
              <p className="text-[11px] text-[var(--muted)] break-all">{response.url}</p>
              <details className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
                <summary className="cursor-pointer text-xs text-[var(--muted)]">Headers</summary>
                <pre className="mt-2 text-xs text-[var(--muted)] overflow-auto">{prettyJson(response.headers)}</pre>
              </details>
              <pre className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--foreground)] overflow-auto max-h-[28rem] whitespace-pre-wrap">
                {response.body}
              </pre>
            </>
          ) : (
            <p className="text-sm text-[var(--muted)]">Aún no se ha ejecutado ninguna operación.</p>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
