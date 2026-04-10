import fs from 'fs';
const file = 'app/panel/(protected)/tienda/components/PaymentMethodsConfig.tsx';
let content = fs.readFileSync(file, 'utf8');

const newRender = `  const labelClass = "text-[var(--c-gray-700)] text-[13px] font-semibold mb-1.5 inline-block";
  const inputClass = "flex h-10 w-full rounded-xl border border-[var(--c-gray-200)] bg-white px-3 py-2 text-sm text-[var(--c-gray-800)] placeholder:text-[var(--c-gray-400)] focus:outline-none focus:border-[var(--c-navy-400)] transition-colors shadow-sm";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* MÉTODOS DE PAGO HEADER */}
      <div>
        <h3 className="text-xl font-bold text-[var(--c-gray-800)] tracking-tight">Métodos de Pago</h3>
        <p className="text-[var(--c-gray-500)] text-sm mt-1">
          Configura cómo quieres que tus clientes te paguen al finalizar el checkout.
        </p>
      </div>

      <Card className={\`bg-white border transition-all shadow-sm overflow-hidden rounded-2xl \${transferMethod?.is_active ? 'border-[var(--c-navy-300)] ring-1 ring-[var(--c-navy-300)]' : 'border-[var(--c-gray-200)]'}\`}>
        <div className={\`flex items-center justify-between px-6 py-5 border-b \${transferMethod?.is_active ? 'bg-[var(--c-navy-50)]/50 border-[var(--c-navy-100)]' : 'bg-[var(--c-gray-50)]/30 border-[var(--c-gray-100)]'}\`}>
          <div>
            <h3 className="text-base font-semibold text-[var(--c-gray-900)]">Transferencia Bancaria</h3>
            <p className="text-[var(--c-gray-500)] text-[13px] mt-0.5">El cliente te transfiere directamente a tu cuenta al finalizar el pedido.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-[var(--c-gray-200)] shadow-sm">
            <span className={\`text-xs font-semibold uppercase tracking-wider \${transferMethod?.is_active ? "text-[var(--c-navy-600)]" : "text-[var(--c-gray-400)]"}\`}>
              {transferMethod?.is_active ? "Activo" : "Inactivo"}
            </span>
            <Switch checked={!!transferMethod?.is_active}
              onCheckedChange={(val) => handleToggle("BANK_TRANSFER", val, transferMethod?.id)}
              disabled={saving !== null} />
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1">
              <Label className={labelClass}>Banco</Label>
              <Input value={transferConfig.bank || ""} onChange={(e) => setTransferConfig({ ...transferConfig, bank: e.target.value })} placeholder="Ej: Banco de Chile" className={inputClass} />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Tipo de Cuenta</Label>
              <Input value={transferConfig.account_type || ""} onChange={(e) => setTransferConfig({ ...transferConfig, account_type: e.target.value })} placeholder="Ej: Cuenta Corriente" className={inputClass} />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Número de Cuenta</Label>
              <Input value={transferConfig.account_number || ""} onChange={(e) => setTransferConfig({ ...transferConfig, account_number: e.target.value })} placeholder="Ej: 12345678" className={inputClass} />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>RUT / Identificación</Label>
              <Input value={transferConfig.rut || ""} onChange={(e) => setTransferConfig({ ...transferConfig, rut: e.target.value })} placeholder="Ej: 12.345.678-9" className={inputClass} />
            </div>
            <div className="md:col-span-2 space-y-1">
              <Label className={labelClass}>Correo Electrónico para Comprobantes</Label>
              <Input value={transferConfig.email || ""} onChange={(e) => setTransferConfig({ ...transferConfig, email: e.target.value })} placeholder="pagos@mitienda.cl" className={inputClass} />
            </div>
          </div>

          <div className="mt-8 flex justify-end pt-5 border-t border-[var(--c-gray-100)]">
            <Button
              size="default"
              className="bg-[var(--c-gray-800)] hover:bg-[var(--c-gray-900)] text-white shadow-sm rounded-xl px-6"
              onClick={() => handleSaveConfig("BANK_TRANSFER", transferConfig, transferMethod?.id)}
              disabled={saving !== null || !transferMethod?.is_active}
            >
              Guardar Datos de Transferencia
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className={\`bg-white border transition-all shadow-sm overflow-hidden rounded-2xl \${cashMethod?.is_active ? 'border-[var(--c-navy-300)] ring-1 ring-[var(--c-navy-300)]' : 'border-[var(--c-gray-200)]'}\`}>
        <div className={\`flex items-center justify-between px-6 py-5 border-b \${cashMethod?.is_active ? 'bg-[var(--c-navy-50)]/50 border-[var(--c-navy-100)]' : 'bg-[var(--c-gray-50)]/30 border-[var(--c-gray-100)]'}\`}>
          <div>
            <h3 className="text-base font-semibold text-[var(--c-gray-900)]">Pago Presencial / Efectivo</h3>
            <p className="text-[var(--c-gray-500)] text-[13px] mt-0.5">El cliente paga en persona al retirar o recibir su pedido.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-[var(--c-gray-200)] shadow-sm">
            <span className={\`text-xs font-semibold uppercase tracking-wider \${cashMethod?.is_active ? "text-[var(--c-navy-600)]" : "text-[var(--c-gray-400)]"}\`}>
              {cashMethod?.is_active ? "Activo" : "Inactivo"}
            </span>
            <Switch checked={!!cashMethod?.is_active}
              onCheckedChange={(val) => handleToggle("CASH", val, cashMethod?.id)}
              disabled={saving !== null} />
          </div>
        </div>

        <CardContent className="p-6">
          <div className="space-y-2">
            <Label className={labelClass}>Instrucciones Adicionales (Opcional)</Label>
            <Textarea
              value={cashConfig.instructions || ""}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCashConfig({ ...cashConfig, instructions: e.target.value })}
              placeholder="Ej: Solo aceptamos billetes chicos. Tienes 24 horas para retirar."
              rows={3}
              className={\`\${inputClass} h-auto resize-y\`}
            />
          </div>

          <div className="mt-8 flex justify-end pt-5 border-t border-[var(--c-gray-100)]">
            <Button
              size="default"
              className="bg-[var(--c-gray-800)] hover:bg-[var(--c-gray-900)] text-white shadow-sm rounded-xl px-6"
              onClick={() => handleSaveConfig("CASH", cashConfig, cashMethod?.id)}
              disabled={saving !== null || !cashMethod?.is_active}
            >
              Guardar Instrucciones
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`;

content = content.replace(/  const transferMethod = methods\.find\(\(m\) => m\.type === "BANK_TRANSFER"\);\n.*?return \(/s, `  const transferMethod = methods.find((m) => m.type === "BANK_TRANSFER");\n  const cashMethod = methods.find((m) => m.type === "CASH");\n\n  return (`);
content = content.replace(/<div className="space-y-6">\n      <Card className="bg-\[#ffffff\] border border-\[var\(--c-gray-200\)\] p-6">.*?<\/Card>\n    <\/div>\n  \);\n}/s, newRender.substring(newRender.indexOf('<div className="space-y-8 animate-in')));

fs.writeFileSync(file, content);
console.log('Fixed payments config');
