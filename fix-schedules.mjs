import fs from 'fs';
const file = 'app/panel/(protected)/tienda/components/SchedulesConfig.tsx';
let content = fs.readFileSync(file, 'utf8');

const newRender = `  const inputClass = "w-full bg-transparent focus:outline-none focus:ring-0 text-[var(--c-gray-800)] font-medium p-0 h-10 w-24 text-center border-0 bg-transparent min-w-[70px]";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card className="bg-white border border-[var(--c-gray-200)] shadow-sm overflow-hidden rounded-2xl">
        <div className="border-b border-[var(--c-gray-100)] px-6 py-5 bg-[var(--c-gray-50)]/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[var(--c-gray-800)] tracking-tight">Horarios de Atención</h3>
            <p className="text-[var(--c-gray-500)] text-sm mt-1">Configura los días y horarios en los que tu tienda está operativa.</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2 shrink-0 bg-white border-[var(--c-gray-200)] text-[var(--c-gray-700)] hover:bg-[var(--c-gray-50)] hover:text-[var(--c-gray-900)] h-9 rounded-xl shadow-sm transition-all"
            onClick={() => {
              const firstOpen = schedules.find((s) => !s.is_closed);
              if (!firstOpen) {
                toast.error("No hay ningún día abierto para copiar");
                return;
              }
              setSchedules((prev) =>
                prev.map((s) => ({
                  ...s,
                  opens_at: firstOpen.opens_at,
                  closes_at: firstOpen.closes_at,
                  is_closed: false,
                }))
              );
              toast.success(\`Horario de \${DAY_LABELS[firstOpen.day_of_week]} aplicado a todos los días\`);
            }}
          >
            <Copy className="w-4 h-4" />
            Aplicar a todos
          </Button>
        </div>
        
        <CardContent className="p-6">
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <div 
                key={schedule.day_of_week} 
                className={\`flex flex-col sm:flex-row gap-4 items-start sm:items-center px-4 py-3 rounded-2xl border transition-all \${
                  schedule.is_closed 
                    ? 'border-[var(--c-gray-100)] bg-[var(--c-gray-50)]/50 opacity-80' 
                    : 'border-[var(--c-gray-200)] bg-white hover:border-[var(--c-gray-300)] shadow-sm'
                }\`}
              >
                <div className="w-[120px] flex-shrink-0">
                  <Label className={\`text-[15px] font-semibold \${schedule.is_closed ? 'text-[var(--c-gray-500)]' : 'text-[var(--c-gray-800)]'}\`}>
                    {DAY_LABELS[schedule.day_of_week]}
                  </Label>
                </div>
                
                <div className="flex items-center gap-4 flex-1">
                  {schedule.is_closed ? (
                    <div className="text-[13px] font-medium text-[var(--c-gray-400)] px-4 py-2 flex-1">Cerrado por descanso</div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-[var(--c-gray-50)] rounded-xl border border-[var(--c-gray-200)] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--c-navy-100)] focus-within:border-[var(--c-navy-300)] transition-shadow">
                        <input
                          type="time"
                          value={schedule.opens_at.slice(0, 5)}
                          onChange={(e) => handleChange(schedule.day_of_week, "opens_at", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <span className="text-[var(--c-gray-400)] font-medium block w-3 text-center">-</span>
                      <div className="flex items-center bg-[var(--c-gray-50)] rounded-xl border border-[var(--c-gray-200)] overflow-hidden focus-within:ring-2 focus-within:ring-[var(--c-navy-100)] focus-within:border-[var(--c-navy-300)] transition-shadow">
                        <input
                          type="time"
                          value={schedule.closes_at.slice(0, 5)}
                          onChange={(e) => handleChange(schedule.day_of_week, "closes_at", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0 bg-white sm:bg-transparent px-3 sm:px-0 py-1.5 sm:py-0 rounded-lg sm:rounded-none border sm:border-0 border-[var(--c-gray-200)]">
                  <Switch checked={!schedule.is_closed}
                    onCheckedChange={(isOpen: boolean) => handleChange(schedule.day_of_week, "is_closed", !isOpen)} />
                  <span className={\`text-[13px] font-semibold tracking-wide uppercase w-16 \${!schedule.is_closed ? "text-[var(--c-navy-600)]" : "text-[var(--c-gray-400)]"}\`}>
                    {!schedule.is_closed ? "Abierto" : "Cerrado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2 pb-6">
        <Button size="lg" onClick={handleSave} disabled={saving} className="bg-[var(--c-navy-600)] hover:bg-[var(--c-navy-700)] text-white shadow-md rounded-xl px-10 h-11 w-full sm:w-auto font-medium transition-all">
          {saving ? "Guardando..." : "Guardar Horarios"}
        </Button>
      </div>
    </div>
  );
}
`;

content = content.replace(/  const inputClass = .*?return \(/s, newRender.substring(0, newRender.indexOf('return (')) + 'return (');
content = content.replace(/<Card className="bg-\[#ffffff\] border border-\[var\(--c-gray-200\)\] p-6">.*?<\/Card>\n  \);\n}/s, newRender.substring(newRender.indexOf('<div className="space-y-8 animate-in')));

fs.writeFileSync(file, content);
console.log('Fixed schedules config');
