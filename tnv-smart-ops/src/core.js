/* ===== TNV Smart Ops – lõi: trạng thái, tiện ích, biểu đồ, router ===== */
'use strict';

/* ---------- Tiện ích ---------- */
const VIEWS = {};      // route -> function(sub) => html
const ACT = {};        // data-a -> handler
let S = null;          // trạng thái dùng chung giữa web, app cư dân, app vận hành

function t(vi, en){ return (S.lang === 'en' && en != null) ? en : vi; }
function fmt(n, d){ // 1234.5 -> 1.234,5
  const s = (d == null ? String(n) : Number(n).toFixed(d)).split('.');
  s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return s.join(',');
}
function esc(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function toast(msg){
  let el = document.getElementById('toast'); if (el) el.remove();
  el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.textContent = msg;
  document.body.appendChild(el); setTimeout(() => el.remove(), 2600);
}
function getPath(o, p){ return p.split('.').reduce((a, k) => a == null ? a : a[k], o); }
function setPath(o, p, v){ const ks = p.split('.'); const l = ks.pop(); ks.reduce((a, k) => a[k], o)[l] = v; }

/* ---------- Biểu tượng (stroke 24x24) ---------- */
const ICONS = {
  home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  wrench:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  file:'<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
  cog:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  qr:'<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h3v3h-3zM20 14v3M14 20h3M20 20h0"/>',
  door:'<path d="M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M3 21h18"/><circle cx="12.5" cy="12" r=".8"/>',
  receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  msg:'<path d="M4 5h16v11H9l-5 4z"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  car:'<path d="M5 16V11l2-5h10l2 5v5M3 16h18v3H3zM7 13h0M17 13h0"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.6 3-6 7-6s7 2.4 7 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.4.6 4 2.4 4 6"/>',
  check:'<path d="M4 12l5 5L20 6"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  camera:'<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13" r="4"/>',
  phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/>',
  back:'<path d="M15 5l-7 7 7 7"/>',
  x:'<path d="M5 5l14 14M19 5L5 19"/>',
  building:'<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  clip:'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h1M3 12h1M3 18h1"/>',
  scan:'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/>',
  drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  send:'<path d="M3 11l18-8-8 18-2-8z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h0"/>',
  play:'<path d="M7 4l13 8-13 8z"/>',
  bars:'<path d="M6 20v-6M12 20V5M18 20v-9"/>',
  fan:'<circle cx="12" cy="12" r="2"/><path d="M12 10c0-4 1-7 4-7s3 4-2 7M14 12c4 0 7 1 7 4s-4 3-7-2M12 14c0 4-1 7-4 7s-3-4 2-7M10 12c-4 0-7-1-7-4s4-3 7 2"/>',
  userplus:'<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4.4 3.1-7 7-7s7 2.6 7 7M19 8v6M16 11h6"/>',
  key:'<circle cx="8" cy="15" r="4.5"/><path d="M11.2 11.8L20 3M16 7l3 3M14 9l2 2"/>',
  pen:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  checkc:'<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
  logout:'<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 8l-4 4 4 4M6 12h10"/>'
};
function ic(n, s, sw){ return '<svg width="'+(s||20)+'" height="'+(s||20)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(sw||1.8)+'" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[n]||'')+'</svg>'; }

function shortDesc(a){ return ({1:'Rò rỉ nước tầng 3 – nhánh căn 3B'})[a.id] || a.desc; }
/* ---------- Chip mức cảnh báo (luôn có chữ, không chỉ màu) ---------- */
const LV = { khan:['KHẨN','Khẩn'], cao:['CAO','Cao'], tb:['TB','Trung bình'], tin:['TIN','Thông tin'] };
function lvChip(l, full){ return '<span class="chip '+l+'">'+(full ? LV[l][1] : LV[l][0])+'</span>'; }

/* ---------- Biểu đồ SVG ---------- */
/* series: [{d:[...], c:'#..', dash:true, w:2, area:true}] ; null = đứt đoạn */
function lineChart(o){
  const W = o.w || 560, H = o.h || 220, pl = 40, pr = o.pr || 12, pt = 10, pb = 26;
  const n = Math.max.apply(null, o.series.map(s => s.d.length));
  const all = [].concat.apply([], o.series.map(s => s.d.filter(v => v != null)));
  let lo = o.min != null ? o.min : Math.floor(Math.min.apply(null, all) * 0.9);
  let hi = o.max != null ? o.max : Math.ceil(Math.max.apply(null, all) * 1.08);
  const X = i => pl + (W - pl - pr) * (n === 1 ? 0 : i / (n - 1));
  const Y = v => pt + (H - pt - pb) * (1 - (v - lo) / (hi - lo));
  let g = '';
  for (let k = 0; k <= 3; k++){
    const v = lo + (hi - lo) * k / 3, y = Y(v);
    g += '<line x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y+'" y2="'+y+'" stroke="#e6ebf0"/><text x="'+(pl-6)+'" y="'+(y+4)+'" text-anchor="end" font-size="11" fill="#6B7785">'+(o.yfmt ? o.yfmt(v) : Math.round(v*10)/10)+'</text>';
  }
  const step = o.xevery || Math.ceil(n / 8);
  for (let i = 0; i < n; i += step){
    g += '<text x="'+X(i)+'" y="'+(H-8)+'" text-anchor="middle" font-size="11" fill="#6B7785">'+(o.xl ? o.xl(i) : i+1)+'</text>';
  }
  let body = '';
  o.series.forEach(s => {
    let d = '', started = false, first = null, last = null;
    s.d.forEach((v, i) => { if (v == null){ started = false; return; } d += (started ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1) + ' '; started = true; if (first == null) first = i; last = i; });
    if (s.area) body += '<path d="'+d+' L'+X(last)+' '+Y(lo)+' L'+X(first)+' '+Y(lo)+'Z" fill="'+s.c+'" opacity=".10"/>';
    body += '<path d="'+d+'" fill="none" stroke="'+s.c+'" stroke-width="'+(s.w||2.2)+'" '+(s.dash ? 'stroke-dasharray="5 4"' : '')+' stroke-linejoin="round" stroke-linecap="round"/>';
    if (s.dots) s.d.forEach((v, i) => { if (v != null && s.dots.indexOf(i) > -1) body += '<circle cx="'+X(i)+'" cy="'+Y(v)+'" r="4.5" fill="#fff" stroke="'+s.c+'" stroke-width="2.4"/>'; });
  });
  if (o.vline != null) body += '<line x1="'+X(o.vline)+'" x2="'+X(o.vline)+'" y1="'+pt+'" y2="'+(H-pb)+'" stroke="#8A96A3" stroke-dasharray="2 3"/><text x="'+(X(o.vline)+4)+'" y="'+(pt+10)+'" font-size="10" fill="#6B7785">'+(o.vlabel||'')+'</text>';
  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-height:'+H+'px" role="img" aria-label="'+esc(o.label||'biểu đồ')+'">'+g+body+'</svg>';
}
/* bars: [{l, v, hi}] – nền xám, chỉ tô màu cột bất thường (nguyên tắc "xám trước, màu sau") */
function barChart(o){
  const W = o.w || 520, H = o.h || 200, pl = 34, pb = 26, pt = 16;
  const mx = o.max || Math.max.apply(null, o.data.map(d => d.vs ? Math.max.apply(null, d.vs) : d.v)) * 1.15;
  const bw = (W - pl - 8) / o.data.length;
  let s = '';
  for (let k = 0; k <= 2; k++){ const y = pt + (H - pt - pb) * (1 - k / 2); s += '<line x1="'+pl+'" x2="'+(W-6)+'" y1="'+y+'" y2="'+y+'" stroke="#e6ebf0"/><text x="'+(pl-5)+'" y="'+(y+4)+'" text-anchor="end" font-size="11" fill="#6B7785">'+(o.yfmt ? o.yfmt(mx*k/2) : Math.round(mx*k/2*10)/10)+'</text>'; }
  o.data.forEach((d, i) => {
    if (d.vs){ // nhóm cột: o.colors[k] cho chuỗi k
      const gw = bw * .72 / d.vs.length;
      d.vs.forEach((v, k) => { const h = (H - pt - pb) * v / mx, x = pl + i * bw + bw * .14 + k * gw, y = H - pb - h;
        s += '<rect x="'+x+'" y="'+y+'" width="'+(gw - 2)+'" height="'+h+'" rx="2" fill="'+o.colors[k]+'"/>';
        if (o.labels && k === d.vs.length - 1) s += '<text x="'+(x+gw/2-1)+'" y="'+(y-4)+'" text-anchor="middle" font-size="10" font-weight="700" fill="#1A2330">'+v+'</text>'; });
      s += '<text x="'+(pl + i * bw + bw / 2)+'" y="'+(H-8)+'" text-anchor="middle" font-size="11" fill="#6B7785">'+d.l+'</text>';
      return;
    }
    const h = (H - pt - pb) * d.v / mx, x = pl + i * bw + bw * .18, w = bw * .64, y = H - pb - h;
    s += '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3" fill="'+(d.hi ? (o.hiColor || '#E8833A') : (o.color || '#C5CED7'))+'"/>';
    s += '<text x="'+(x+w/2)+'" y="'+(H-8)+'" text-anchor="middle" font-size="11" fill="#6B7785">'+d.l+'</text>';
    if (d.hi || o.labels) s += '<text x="'+(x+w/2)+'" y="'+(y-4)+'" text-anchor="middle" font-size="11" font-weight="700" fill="#1A2330">'+(o.vfmt ? o.vfmt(d.v) : d.v)+'</text>';
  });
  if (o.base != null){ const y = H - pb - (H - pt - pb) * o.base / mx; s += '<line x1="'+pl+'" x2="'+(W-6)+'" y1="'+y+'" y2="'+y+'" stroke="#1B7F79" stroke-dasharray="5 4"/><text x="'+(pl+4)+'" y="'+(y-4)+'" text-anchor="start" font-size="10" fill="#1B7F79">'+(o.baseLabel||'mức nền')+'</text>'; }
  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" style="max-height:'+H+'px" role="img" aria-label="'+esc(o.label||'biểu đồ cột')+'">'+s+'</svg>';
}
function hbars(rows, o){
  o = o || {}; const mx = o.max || Math.max.apply(null, rows.map(r => r.v));
  return rows.map(r => '<div style="margin-bottom:10px"><div class="row sm" style="margin-bottom:3px"><span class="grow">'+r.l+'</span><b>'+(o.fmt ? o.fmt(r.v) : r.v)+'</b></div><div class="bar '+(r.warn ? 'warn' : '')+'"><i style="width:'+Math.min(100, r.v / mx * 100)+'%'+(o.color ? ';background:'+o.color : '')+'"></i></div></div>').join('');
}
/* QR minh họa (không phải mã thật): lưới 25x25 sinh từ hạt giống */
function qrSvg(seed, size){
  const N = 25; let h = 2166136261; for (let i = 0; i < seed.length; i++){ h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 1000) / 1000; };
  const fin = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
  let r = '';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){
    if (fin(x, y)) continue;
    if (rnd() > .52) r += '<rect x="'+x+'" y="'+y+'" width="1" height="1"/>';
  }
  const f = (ox, oy) => '<rect x="'+ox+'" y="'+oy+'" width="7" height="7"/><rect x="'+(ox+1)+'" y="'+(oy+1)+'" width="5" height="5" fill="#fff"/><rect x="'+(ox+2)+'" y="'+(oy+2)+'" width="3" height="3"/>';
  return '<svg width="'+size+'" height="'+size+'" viewBox="-1 -1 '+(N+2)+' '+(N+2)+'" fill="#12324A" shape-rendering="crispEdges" role="img" aria-label="Mã QR minh họa"><rect x="-1" y="-1" width="'+(N+2)+'" height="'+(N+2)+'" fill="#fff"/>'+r+f(0,0)+f(N-7,0)+f(0,N-7)+'</svg>';
}
/* Hình người mờ (ảnh khuôn mặt làm mờ mặc định) */
function personSvg(blur, w, h){
  return '<svg width="'+(w||80)+'" height="'+(h||100)+'" viewBox="0 0 80 100" class="'+(blur ? 'blur' : '')+'"><circle cx="40" cy="30" r="17" fill="#9fb2c3"/><path d="M8 100c0-24 14-38 32-38s32 14 32 38z" fill="#7f95a9"/></svg>';
}

/* ---------- Dữ liệu minh họa ---------- */
const APTS = (function(){
  const raw = [['2A',940,14,0],['2B',540,11,-3],['2C',735,16,38],['2D',498,9,1],['3A',702,13,2],['3B',655,21,6],['3C',1105,17,11],['3D',590,12,-1],
    ['4A',820,15,3],['4B',1190,18,-2],['4C',640,10,0],['4D',905,14,4],['5A',1284,22,4],['5B',760,13,-4],['5C',860,16,5],['5D',980,11,-2]];
  return raw.map(r => ({ id:r[0], kwh:r[1], m3:r[2], dv:r[3], e:Math.round(r[1]*2697.5/1000)*1000, w:r[2]*27500 }));
})();
const DAYS_F = (function(){ // dự báo 31 ngày (MWh), 20 ngày đầu cộng = 51,3
  const raw = []; for (let d = 0; d < 31; d++){ const wk = (d + 3) % 7; raw.push(2.45 + (wk >= 5 ? .22 : 0) + .1 * Math.sin(d / 2.3)); }
  const k = 51.3 / raw.slice(0, 20).reduce((a, b) => a + b, 0); return raw.map(v => +(v * k).toFixed(2));
})();
const DAYS_A = (function(){ // thực tế 20 ngày, cộng = 48,2
  const raw = DAYS_F.slice(0, 20).map((v, i) => v * (0.94 + 0.03 * Math.sin(i * 1.7)));
  const k = 48.2 / raw.reduce((a, b) => a + b, 0); return raw.map(v => +(v * k).toFixed(2));
})();
const HOUR_F = [36,33,32,44,80,94,101,100,95,121,112,64]; // mỗi 2 giờ, 00h–22h (kW)
const HOUR_A = [38,34,33,45,82,96,104,99,92,118,110,62];

function initState(){
  return {
    lang:'vi', role:'BQL', ux:false,
    /* Trung tâm cảnh báo (slide 6) */
    alertFilter:'all', alertSel:1, valve:'open', valveLog:null, valveBy:null,
    alerts:[
      {id:1,lv:'khan',time:'02:31',loc:'T3 · 3B',desc:'Rò rỉ + lưu lượng liên tục 0,8 m³/h',st:'Chưa xác nhận'},
      {id:2,lv:'cao',time:'09:30',loc:'B2 · bơm',desc:'Bơm tăng áp 02 khởi động 3× bình thường',st:'KT Hùng'},
      {id:3,lv:'cao',time:'10:05',loc:'B2 · sạc',desc:'Trạm sạc 03 mất kết nối',st:'Đã xác nhận'},
      {id:4,lv:'tb',time:'11:12',loc:'Mái',desc:'Chênh áp lọc FAF-02 cao',st:'Phiếu #1043'},
      {id:5,lv:'tb',time:'14:20',loc:'B1',desc:'CO2 nhà hàng 1.150 ppm',st:'Tự hết'},
      {id:6,lv:'tb',time:'17:45',loc:'T1',desc:'Đèn sảnh bật ngoài lịch',st:'Đã xác nhận'},
      {id:7,lv:'tin',time:'18:00',loc:'Tum',desc:'Rooftop mở cửa, đổi quyền thang',st:'Tự động'}
    ],
    energyTab:'dien',
    devSel:'BTA-02', ticketMade:false,
    sec:{ stage:'detected', owner:null, at:'23:47:12', secs:8.4, live:false, reveal:false, esc:false },
    rooftop:{ open:true, from:'17:00', to:'24:00', hold:true },
    model:'Claude', chat:[], busy:false, handover:false,
    /* App cư dân (slide 11-12) */
    res:{ screen:'home', invite:null, push:null, sheet:null, paid:false, hist:[], err:null, billMonth:'T10',
          form:{ name:'Nguyễn Lan', phone:'0912 345 678', day:'0', slot:'15:00 – 18:00', car:true, bike:false, plate:'30G-123.45' },
          profile:{ name:'Minh', phone:'0987 654 321', email:'minh.4b@gmail.com' }, edit:null,
          face:{ consent:false, state:'idle' } },
    k2:{ reader:null, bell:null, log:[] },
    k8:{ log:[] },
    /* App vận hành (slide 13) */
    ops:{ screen:'canh-bao', sheet:null, sel:null, selAlert:null, scanned:false, live:false, user:'baove',
          ai:{ st:'pending', deadline: Date.now() + 10*60*1000, reason:null },
          tickets:[
            {id:1043,lv:'tb',title:'Vệ sinh lọc FAF-02',loc:'Tầng mái',due:'hạn 22/10',st:'new'},
            {id:1039,lv:'tb',title:'Thay pin đồng hồ nước T5',loc:'Hành lang T5',due:'đang làm',st:'doing'},
            {id:1031,lv:'tin',title:'Kiểm tra trạm sạc 03',loc:'Hầm B2',due:'chờ nhà thầu',st:'wait'}
          ] }
  };
}

/* ---------- Nhật ký sự kiện nền tảng ---------- */
function logEvt(list, tm, who, msg){ list.push({ tm:tm, who:who, msg:msg }); }
function logHtml(list){ return list.length ? list.slice().reverse().map(l => '<div class="logline">'+l.tm+' · <b>'+esc(l.who)+'</b> '+esc(l.msg)+'</div>').join('') : '<div class="mut sm">Chưa có sự kiện.</div>'; }

/* ---------- Router + render ---------- */
const TABS = [['','Trang chủ'],['web','Web vận hành'],['cudan','App cư dân'],['vanhanh','App vận hành'],['k2','Luồng K2 · Khách'],['k8','Luồng K8 · Người lạ'],['design','Hệ thống thiết kế']];
function route(){ const p = (location.hash || '#/').replace(/^#\/?/, '').split('/'); return { v:p[0] || '', sub:p[1] || '' }; }
function go(h){ if (location.hash === '#/' + h) render(); else location.hash = '#/' + h; }

function topbar(r){
  return '<header id="topbar"><div class="brand">TNV <span>Smart Ops</span> · Prototype</div><nav>' +
    TABS.map(x => '<a class="'+(r.v === x[0] ? 'on' : '')+'" href="#/'+x[0]+'">'+x[1]+'</a>').join('') +
    '</nav><span class="tag">Dữ liệu minh họa · Gimasys · 20/10/2026</span><button class="rs" data-a="reset" title="Đưa toàn bộ dữ liệu về trạng thái ban đầu">↺<span class="lbl"> Làm mới demo</span></button></header>';
}
function render(){
  const r = route(), root = document.getElementById('root');
  const keep = {}; root.querySelectorAll('[data-sk]').forEach(e => keep[e.dataset.sk] = e.scrollTop);
  const wy = window.scrollY;
  const fn = VIEWS[r.v] || VIEWS[''];
  root.innerHTML = topbar(r) + '<div id="app">' + fn(r.sub) + '</div>';
  root.querySelectorAll('[data-sk]').forEach(e => { if (keep[e.dataset.sk] != null) e.scrollTop = keep[e.dataset.sk]; });
  window.scrollTo(0, wy);
  root.querySelectorAll('[data-scrollend]').forEach(e => e.scrollTop = e.scrollHeight);
  document.title = 'TNV Smart Ops · Prototype';
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const f = ACT[el.dataset.a]; if (f){ e.preventDefault(); f(el.dataset, el, e); }
});
document.addEventListener('change', e => {
  const el = e.target.closest('[data-c]'); if (el && ACT[el.dataset.c]) ACT[el.dataset.c](el.dataset, el, e);
});
document.addEventListener('input', e => {
  const el = e.target.closest('[data-bind]'); if (el) setPath(S, el.dataset.bind, el.type === 'checkbox' ? el.checked : el.value);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter'){ const el = e.target.closest('[data-enter]'); if (el && ACT[el.dataset.enter]){ e.preventDefault(); ACT[el.dataset.enter](el.dataset, el, e); } }
});
window.addEventListener('hashchange', () => { S.ux = false; render(); });
ACT.reset = () => { S = initState(); render(); toast('Đã đưa dữ liệu demo về ban đầu'); };
ACT.go = d => go(d.to);
ACT.ux = () => { S.ux = !S.ux; render(); };
ACT.lang = d => { S.lang = d.v; render(); };

/* Đếm ngược (duyệt lệnh AI hết hạn sau 10 phút) */
setInterval(() => {
  document.querySelectorAll('[data-cd]').forEach(el => {
    const ms = +el.dataset.cd - Date.now();
    if (ms <= 0){ if (S.ops.ai.st === 'pending'){ S.ops.ai.st = 'expired'; render(); } return; }
    const m = Math.floor(ms / 60000), s = Math.floor(ms / 1000) % 60;
    el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  });
}, 1000);

/* Khung điện thoại dùng chung */
function phone(inner, o){
  o = o || {};
  return '<div class="phone"><div class="notch"></div><div class="screen">' +
    '<div class="sbar"><span>9:41</span><span>5G ▮▮▮</span></div>' + inner + '</div></div>';
}
function uxDrawer(title, items){
  if (!S.ux) return '<button class="uxbtn" data-a="ux">💡 Ghi chú UX</button>';
  return '<aside class="uxdrawer"><div class="row"><h3 class="grow">Best practice áp dụng</h3><button class="btn ghost sm" data-a="ux">Đóng ✕</button></div><div class="mut sm">'+esc(title)+'</div>' +
    items.map((x, i) => '<div class="bp"><div class="n">'+(i+1)+'</div><div><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></div></div>').join('') + '</aside><button class="uxbtn hide"></button>';
}
function notesCard(items){
  return '<div class="card"><h3>Best practice áp dụng</h3>' + items.map((x, i) => '<div class="bp" style="margin-top:'+(i ? 14 : 0)+'px"><div class="n">'+(i+1)+'</div><div><b>'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></div></div>').join('') + '</div>';
}

window.addEventListener('DOMContentLoaded', () => { S = initState(); render(); });
