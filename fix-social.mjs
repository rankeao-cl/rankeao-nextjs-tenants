import fs from 'fs';
const file = 'app/panel/(protected)/tienda/components/SocialLinksConfig.tsx';
let content = fs.readFileSync(file, 'utf8');

const newRender = `  const inputClass = "flex h-10 w-full rounded-xl border border-[var(--c-gray-200)] bg-white px-3 py-2 text-sm text-[var(--c-gray-800)] placeholder:text-[var(--c-gray-400)] focus:outline-none focus:border-[var(--c-navy-400)] transition-colors";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <Card className="bg-white border border-[var(--c-gray-200)] shadow-sm overflow-hidden rounded-2xl">
        <div className="border-b border-[var(--c-gray-100)] px-6 py-5 bg-[var(--c-gray-50)]/50">
          <h3 className="text-lg font-semibold text-[var(--c-gray-800)] tracking-tight">Redes Sociales</h3>
          <p className="text-[var(--c-gray-500)] text-sm mt-1">
            Administra los enlaces a tus perfiles sociales para dirigir tráfico desde tu tienda.
          </p>
        </div>

        <CardContent className="p-6">
          <div className="space-y-4">
            {PLATFORMS.map((platform) => {
              const linkData = getLinkForPlatform(platform.id);
              const hasUrl = !!linkData.url;
              return (
                <div
                  key={platform.id}
                  className={\`flex flex-col sm:flex-row gap-4 items-start sm:items-center p-3.5 rounded-2xl border transition-all \${
                    hasUrl ? 'border-[var(--c-gray-300)] bg-[var(--c-gray-50)]' : 'border-[var(--c-gray-100)] bg-white hover:border-[var(--c-gray-200)]'
                  }\`}
                >
                  <div className="flex items-center gap-3 w-40 shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: platform.color }}
                    >
                      {platform.icon}
                    </div>
                    <Label className="text-sm font-semibold text-[var(--c-gray-800)]">{platform.name}</Label>
                  </div>
                  
                  <div className="flex-1 w-full min-w-0 flex items-center bg-white rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--c-navy-300)] focus-within:border-[var(--c-navy-400)] transition-shadow border border-[var(--c-gray-200)]">
                    <Input
                      type="url"
                      placeholder={\`https://\${platform.id}.com/tu-usuario\`}
                      value={linkData.url}
                      onChange={(e) => handleUrlChange(platform.id, e.target.value)}
                      className="border-none shadow-none h-11 focus-visible:ring-0 focus:outline-none bg-transparent w-full px-3"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0 bg-white sm:bg-transparent px-3 sm:px-0 py-1.5 sm:py-0 rounded-lg sm:rounded-none border sm:border-0 border-[var(--c-gray-200)]">
                    <Switch checked={linkData.is_active as boolean}
                      onCheckedChange={(isSelected: boolean) => handleToggleActive(platform.id, isSelected)}
                      disabled={!linkData.url} />
                    <span className={\`text-[13px] font-semibold tracking-wide uppercase \${linkData.is_active ? "text-emerald-600" : "text-[var(--c-gray-400)]"}\`}>
                      {linkData.is_active ? "Visible" : "Oculto"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-2 pb-6">
        <Button size="lg" onClick={handleSave} disabled={saving} className="bg-[var(--c-navy-600)] hover:bg-[var(--c-navy-700)] text-white shadow-md rounded-xl px-10 h-11 w-full sm:w-auto font-medium transition-all">
          {saving ? "Guardando..." : "Guardar Redes Sociales"}
        </Button>
      </div>
    </div>
  );
}
`;

content = content.replace(/const groupClass = .*?return \(/s, newRender.substring(0, newRender.indexOf('return (')) + 'return (');
content = content.replace(/<Card className="bg-\[#ffffff\] border border-\[var\(--c-gray-200\)\] p-6">.*?<\/Card>\n  \);\n}/s, newRender.substring(newRender.indexOf('<div className="space-y-8 animate-in')));

fs.writeFileSync(file, content);
console.log('Fixed social links');
