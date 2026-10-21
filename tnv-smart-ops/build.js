// Gộp src/* thành 1 file HTML tự chứa (không phụ thuộc mạng) -> dist/TNV_Smart_Ops_Prototype.html
const fs = require('fs'), path = require('path');
const src = f => fs.readFileSync(path.join(__dirname, 'src', f), 'utf8');
const js = ['core.js','web.js','resident.js','ops.js','flows.js'].map(src).join('\n');
const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>TNV Smart Ops · Prototype</title>
<meta name="theme-color" content="#12324A">
<style>
${src('style.css')}
</style></head>
<body><div id="root"></div>
<script>
${js}
</script></body></html>`;
fs.mkdirSync(path.join(__dirname, 'dist'), { recursive: true });
const out = path.join(__dirname, 'dist', 'TNV_Smart_Ops_Prototype.html');
fs.writeFileSync(out, html);
console.log('OK', out, (html.length / 1024).toFixed(0) + ' KB');
