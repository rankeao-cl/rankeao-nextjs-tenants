import fs from 'fs';
const file = 'app/panel/(protected)/inventory/page.tsx';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/key=\{alert.product_id \|\|[^}]+\}/, 'key={alert.product_id || String(index)}');
fs.writeFileSync(file, data);
