/* ===== Web vận hành + dashboard (slide 5–10) ===== */
const NAV = [
  ['tong-quan','Tổng quan','Overview','home'],['canh-bao','Cảnh báo','Alerts','bell'],['nang-luong','Điện & nước','Energy & water','bolt'],
  ['thiet-bi','Thiết bị','Equipment','wrench'],['an-ninh','An ninh & vào ra','Security & access','shield'],['tro-ly','Trợ lý AI','AI assistant','spark'],
  ['bao-cao','Báo cáo','Reports','file'],['cau-hinh','Cấu hình','Settings','cog']
];
const ROLES = {
  'CĐT':['tong-quan','canh-bao','nang-luong','bao-cao'],
  'BQL':NAV.map(n => n[0]),
  'Bảo vệ':['canh-bao','an-ninh','tro-ly'],
  'Kỹ thuật':['canh-bao','nang-luong','thiet-bi','tro-ly']
};
const ROLE_HOME = { 'CĐT':'tong-quan','BQL':'tong-quan','Bảo vệ':'an-ninh','Kỹ thuật':'thiet-bi' };
const NOTES = {
  'tong-quan':[['Năm chỉ số đầu trang','Trả lời “tòa nhà có ổn không” trong 5 giây, trước khi đọc chi tiết'],['Luôn có ngữ cảnh','Số liệu đặt cạnh dự báo AI hoặc kỳ trước; con số đứng một mình không nói lên điều gì'],['Chỉ hiện việc cần quyết','CĐT chỉ thấy cảnh báo Khẩn/Cao; bấm vào để xem chi tiết'],['Định lượng giá trị AI','Tiết kiệm nước, điện, sự cố tránh được: cơ sở đánh giá hiệu quả đầu tư']],
  'canh-bao':[['Nền xám, màu cho bất thường','Theo ISA-101: dòng khẩn nổi bật ngay giữa danh sách bình thường'],['4 mức ưu tiên, gom trùng','Theo ISA-18.2: một sự cố không sinh hàng chục cảnh báo rời'],['AI phải giải thích','Đề xuất kèm dữ liệu căn cứ và biểu đồ, người trực hiểu vì sao trước khi bấm'],['Một chạm, có nhật ký','Duyệt, từ chối hoặc tạo phiếu việc không phải gõ lại; mọi lệnh được ghi vết']],
  'nang-luong':[['Dự báo làm đường chuẩn','Đường xám là mức AI kỳ vọng; khoảng cách với thực tế mới là thông tin'],['Bất thường nói bằng lời','“Chạy ngoài giờ”, “tăng 38%” dễ hiểu hơn một biểu đồ cần tự đọc'],['Tô màu một cột duy nhất','Tầng 3 nổi bật giữa nền xám: thấy ngay chỗ rò lúc ban đêm'],['Khoanh vùng thất thoát','Lệch tổng – nhánh vượt ngưỡng thì gợi ý kiểm tra đoạn ống']],
  'thiet-bi':[['Sơ đồ xám, điểm bất thường có màu','Kỹ thuật thấy ngay vị trí cần đến, không phải đọc danh sách'],['Điểm sức khỏe kèm lý do','Mỗi con số có câu giải thích; AI không là “hộp đen”'],['Xu hướng hơn giá trị tức thời','Số lần khởi động tăng dần trong 7 ngày là dấu hiệu sớm của hỏng van'],['Đề xuất có hệ quả','Nói rõ việc cần làm, thời hạn và rủi ro nếu bỏ qua; một chạm tạo phiếu việc']],
  'an-ninh':[['Cảnh báo kèm hình, đối chiếu chéo','Camera AI so với nhật ký vào ra để giảm báo giả; mục tiêu ≤ 10 giây'],['Riêng tư mặc định','Nhật ký không hiện ảnh khuôn mặt; biển số che một phần; khách vãng lai không định danh'],['Quyền là tham số, không phải code','BQL đổi giờ mở rooftop, quyền cư dân ngay trên bảng'],['Sức chứa theo PCCC','Gần đầy thì báo quầy và khóa thang lên tầng tum tự động']],
  'tro-ly':[['Câu trả lời có nguồn','Mỗi câu trả lời ghi điểm dữ liệu và thời điểm; không có dữ liệu thì nói không biết'],['Trả lời bằng bảng khi cần','Số liệu so sánh trình bày như bảng nhỏ, kèm liên kết sang trang chi tiết'],['Gợi ý câu hỏi','Giúp người mới biết trợ lý làm được gì; phân quyền theo vai trò'],['Tóm tắt ca thay sổ giao ca','AI soạn, người trực xác nhận; lưu làm nhật ký vận hành']]
};

function alertCounts(){
  const a = S.alerts, c = { all:a.length }; ['khan','cao','tb','tin'].forEach(k => c[k] = a.filter(x => x.lv === k).length); return c;
}
function visibleAlerts(){ return S.role === 'CĐT' ? S.alerts.filter(a => a.lv === 'khan' || a.lv === 'cao') : S.alerts; }

function webShell(sub, title, meta, body){
  const allowed = ROLES[S.role], c = alertCounts();
  const nav = NAV.filter(n => allowed.indexOf(n[0]) > -1).map(n =>
    '<a class="'+(n[0] === sub ? 'on' : '')+'" href="#/web/'+n[0]+'">'+ic(n[3], 18)+'<span>'+t(n[1], n[2])+'</span>'+(n[0] === 'canh-bao' ? '<span class="bd">'+c.all+'</span>' : '')+'</a>').join('');
  return '<div class="web"><aside class="side"><div class="logo"><i>TNV</i>Smart Ops</div>'+nav+
    '<div class="ft">Claude · Gemini qua cổng AI Gimasys</div></aside><div class="main">' +
    '<div class="hdr"><h1>'+title+'</h1><span class="meta">'+(meta || '')+'</span><span class="sp"></span>' +
    '<div class="seg"><button class="'+(S.lang === 'vi' ? 'on' : '')+'" data-a="lang" data-v="vi">VI</button><button class="'+(S.lang === 'en' ? 'on' : '')+'" data-a="lang" data-v="en">EN</button></div>' +
    '<div class="role"><div class="av">'+esc(S.role.slice(0, 3))+'</div><select data-c="role" aria-label="Vai trò">'+Object.keys(ROLES).map(r => '<option '+(r === S.role ? 'selected' : '')+'>'+r+'</option>').join('')+'</select></div></div>' +
    '<div class="mnav">'+NAV.filter(n => allowed.indexOf(n[0]) > -1).map(n => '<a class="'+(n[0] === sub ? 'on' : '')+'" href="#/web/'+n[0]+'">'+t(n[1], n[2])+'</a>').join('')+'</div><div class="page">'+body+'</div></div></div>' + uxDrawer(title, NOTES[sub] || []);
}
ACT.role = (d, el) => { S.role = el.value; const a = ROLES[S.role]; const r = route(); if (r.v === 'web' && a.indexOf(r.sub) < 0) go('web/' + ROLE_HOME[S.role]); else render(); };

VIEWS.web = function(sub){
  const allowed = ROLES[S.role];
  if (!sub) sub = ROLE_HOME[S.role];
  const nm = NAV.filter(n => n[0] === sub)[0];
  if (!nm) sub = 'tong-quan';
  if (allowed.indexOf(sub) < 0){
    return webShell(sub, 'Không có quyền truy cập', '', '<div class="card" style="max-width:560px"><h3>Vai trò “'+S.role+'” không xem được mục này</h3><p class="mut">Phân quyền theo vai trò dùng chung cho web, app cư dân và app vận hành. Đổi vai trò ở góc phải trên để xem nội dung tương ứng.</p><p style="margin-top:12px"><a class="btn primary" href="#/web/'+ROLE_HOME[S.role]+'">Về trang của vai trò này</a></p></div>');
  }
  const P = PAGES[sub];
  return webShell(sub, t(P.title, P.en), P.meta ? P.meta() : '', P.body());
};

/* ---------- Tổng quan CĐT ---------- */
const PAGES = {};
PAGES['tong-quan'] = {
  title:'Tổng quan tòa nhà', en:'Building overview', meta:() => 'Tháng 10/2026 · cập nhật 10:15',
  body(){
    const c = alertCounts(), list = visibleAlerts().filter(a => a.lv !== 'tin' && (S.role === 'CĐT' ? true : a.lv !== 'tb' || a.id === 4)).slice(0, 4);
    const kpi = (l, v, d, w, u) => '<div class="kpi '+(w ? 'warn' : '')+'"><div class="l">'+l+'</div><div class="v">'+v+(u ? '<small>'+u+'</small>' : '')+'</div><div class="d">'+d+'</div></div>';
    const open = S.alerts.length;
    return '<div class="g5">' +
      kpi(t('Điện năng tháng','Electricity (month)'), '48,2', '▼ 6% '+t('so dự báo','vs forecast'), 0, 'MWh') +
      kpi(t('Nước tháng','Water (month)'), '1.240', '▼ 3% '+t('so T9','vs Sep'), 0, 'm³') +
      kpi(t('Chi phí vận hành','Operating cost'), '312', '▼ 4% '+t('so kế hoạch','vs plan'), 0, 'tr đ') +
      kpi(t('Cảnh báo đang mở','Open alerts'), open, c.khan+' '+t('khẩn','urgent')+' · '+c.cao+' '+t('cao','high'), 1) +
      kpi(t('Thiết bị sẵn sàng','Equipment ready'), '98,6%', '2 '+t('thiết bị cần kiểm tra','need checking'), 0) + '</div>' +
      '<div class="g2"><div class="card"><h3>'+t('Điện năng theo ngày: thực tế và dự báo AI (MWh)','Daily electricity: actual vs AI forecast (MWh)')+'</h3>' +
      lineChart({ series:[{d:DAYS_F,c:'#8A96A3',dash:true,w:2},{d:DAYS_A,c:'#1B7F79',w:2.6,area:true}], min:1.5, max:3.1, yfmt:v => fmt(v,1), xl:i => (i+1), xevery:3, vline:19, vlabel:'hôm nay', label:'Điện năng theo ngày' }) +
      '<div class="leg" style="margin-top:6px"><span><i style="background:#1B7F79"></i>'+t('Thực tế','Actual')+'</span><span><i style="background:#8A96A3"></i>'+t('Dự báo AI','AI forecast')+'</span></div></div>' +
      '<div class="card"><h3>'+t('Cảnh báo cần quyết định','Alerts needing a decision')+'</h3><div class="col" style="gap:0">' +
      list.map(a => '<div class="lrow" style="cursor:pointer" data-a="alertOpen" data-id="'+a.id+'">'+lvChip(a.lv)+'<span class="grow">'+shortDesc(a)+'</span><span class="mut sm">'+a.time+'</span></div>').join('') +
      '</div><p style="margin-top:10px"><a class="btn sm" href="#/web/canh-bao">Mở Trung tâm cảnh báo →</a></p></div></div>' +
      '<div class="g3"><div class="card"><h3>'+t('Điện theo khu vực (MWh)','Electricity by area (MWh)')+'</h3>' +
      hbars([{l:'Căn hộ tầng 2–5',v:17.4},{l:'Nhà hàng B1',v:8.9},{l:'Rooftop bar',v:6.2},{l:'Hầm & thông gió',v:5.6},{l:'Khu thương mại',v:5.3},{l:'Thang máy & bơm',v:4.8}], {fmt:v => fmt(v,1)}) + '</div>' +
      '<div class="card"><h3>'+t('Khách đang có mặt','Current occupancy')+'</h3>' +
      [['Nhà hàng B1',86,150],['Rooftop',108,120],['Sảnh T1',12,60]].map(r => '<div style="margin-bottom:12px"><div class="row sm"><span class="grow">'+r[0]+'</span><b>'+r[1]+' / '+r[2]+'</b>'+(r[1]/r[2] >= .9 ? '<span class="chip cao">'+Math.round(r[1]/r[2]*100)+'%</span>' : '')+'</div><div class="bar '+(r[1]/r[2] >= .9 ? 'warn' : '')+'" style="margin-top:4px"><i style="width:'+(r[1]/r[2]*100)+'%"></i></div></div>').join('') + '</div>' +
      '<div class="card"><h3>'+t('Hiệu quả AI tháng này','AI impact this month')+'</h3><div class="col"><div class="stat"><b>−22% '+t('nước tưới','irrigation water')+'</b><span>so lịch tưới cố định</span></div><div class="stat"><b>−310 kWh '+t('quạt hầm','garage fans')+'</b><span>chạy theo CO và lượt xe</span></div><div class="stat"><b>1 '+t('rò rỉ phát hiện sớm','leak caught early')+'</b><span>ước tính tránh mất 3,5 m³</span></div></div></div></div>';
  }
};
ACT.alertOpen = d => { S.alertSel = +d.id; go('web/canh-bao'); };

/* ---------- Trung tâm cảnh báo ---------- */
const AI_DETAIL = {
  2:{ t:'Bơm tăng áp BTA-02 khởi động dày', s:'Hầm B2 · trạm bơm · 09:30', ai:'Bơm khởi động 70 lần hôm qua, gấp 3 lần mức nền. Nhiều khả năng van một chiều không kín. Đã có đề xuất bảo trì ở trang Thiết bị.', btn:['Mở trang thiết bị','go','web/thiet-bi'] },
  3:{ t:'Trạm sạc xe điện 03 mất kết nối', s:'Hầm B2 · EV-03 · 10:05', ai:'Mất tín hiệu OCPP từ 10:05; hai trạm còn lại bình thường. Nên kiểm tra nguồn và đường mạng tại tủ sạc B2. Chưa ảnh hưởng an toàn.', btn:['Tạo phiếu việc','ticket',1031] },
  4:{ t:'Chênh áp lọc FAF-02 cao', s:'Tầng mái · quạt cấp FAF-02 · 11:12', ai:'Chênh áp lọc tăng 40% trong 3 tuần, lọc bẩn. Đã tạo phiếu #1043 (hạn 22/10).', btn:null },
  5:{ t:'CO2 nhà hàng B1 cao', s:'Nhà hàng B1 · cảm biến CO2 · 14:20', ai:'Đông khách (86 người). Quạt thông gió tự tăng tần số theo kịch bản K3, CO2 về dưới 800 ppm sau 18 phút. Tự hết, không cần xử lý.', btn:null },
  6:{ t:'Đèn sảnh bật ngoài lịch', s:'Sảnh T1 · lịch chiếu sáng · 17:45', ai:'Đèn bật lúc 17:45, sớm 15 phút so với lịch. Trùng với sự kiện đã đặt tại nhà hàng. Đã xác nhận.', btn:null },
  7:{ t:'Rooftop mở cửa, đổi quyền thang', s:'Tầng tum · lịch hoạt động · 18:00', ai:'Theo tham số “giờ mở rooftop 17:00–24:00”, hệ thống tự cho phép thang lên tầng tum. Thông tin, không cần xử lý.', btn:null }
};
function flowSeries(){ // lưu lượng 22:00–04:00 (m³/h) mỗi 30 phút
  const base = .057, hrs = []; for (let i = 0; i < 13; i++){ hrs.push(i < 8 ? base + (i % 3) * .004 : .8); }
  hrs[8] = .08; for (let i = 9; i < 13; i++) hrs[i] = .8;
  if (S.valve === 'closed') for (let i = 10; i < 13; i++) hrs[i] = .0; // sau 02:41
  return hrs;
}
PAGES['canh-bao'] = {
  title:'Trung tâm cảnh báo', en:'Alert center', meta:() => 'Ca đêm · Bảo vệ: Tuấn · KT: Hùng',
  body(){
    const c = alertCounts(), vis = visibleAlerts();
    const list = S.alertFilter === 'all' ? vis : vis.filter(a => a.lv === S.alertFilter);
    const sel = S.alerts.filter(a => a.id === S.alertSel)[0] || list[0];
    const tabs = [['all','Tất cả'],['khan','Khẩn'],['cao','Cao'],['tb','TB'],['tin','Tin']].map(x => '<button class="'+(S.alertFilter === x[0] ? 'on' : '')+'" data-a="alertFilter" data-v="'+x[0]+'">'+x[1]+'<span class="n">'+(S.role === 'CĐT' && (x[0] === 'tb' || x[0] === 'tin') ? 0 : c[x[0]])+'</span></button>').join('');
    const rows = list.map(a => '<tr class="click '+(a.lv === 'khan' ? 'k' : '')+' '+(a.id === sel.id ? 'sel' : '')+'" data-a="alertSelect" data-id="'+a.id+'"><td>'+lvChip(a.lv)+'</td><td>'+a.time+'</td><td>'+a.loc+'</td><td>'+a.desc+'</td><td class="'+(a.st === 'Chưa xác nhận' ? 'b' : 'mut')+'">'+a.st+'</td></tr>').join('');
    return '<div class="pill-tabs">'+tabs+'</div><div class="g2" style="grid-template-columns:1.35fr 1fr;align-items:start"><div class="card" style="padding:6px 6px 10px"><table class="tbl"><thead><tr><th>Mức</th><th>Giờ</th><th>Vị trí</th><th>Mô tả</th><th>Trạng thái</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+alertDetail(sel)+'</div>';
  }
};
function alertDetail(a){
  const canAct = S.role === 'BQL' || S.role === 'Kỹ thuật';
  if (a.id === 1){
    const closed = S.valve === 'closed';
    const fl = flowSeries();
    return '<div class="card" style="border-color:'+(closed ? 'var(--line)' : 'var(--red)')+';background:'+(closed ? '#fff' : '#fffafa')+'"><div class="row">'+lvChip('khan')+'<b style="color:var(--navy);font-size:16px">Rò rỉ nước · Tầng 3, nhánh căn 3B</b></div>' +
      '<div class="mut sm" style="margin:4px 0 10px">Đồng hồ FM-T3-02 · cảm biến rò LS-T3-02 · 02:31</div>' +
      lineChart({ series:[{d:fl,c:closed ? '#2E9E5B' : '#D64545',w:2.4,area:true},{d:fl.map(() => .057),c:'#8A96A3',dash:true,w:1.5}], w:430, h:150, min:0, max:1, yfmt:v => fmt(v,1), xl:i => { const m = 22*60 + i*30; return String(Math.floor(m/60)%24).padStart(2,'0')+':'+(m%60 ? '30' : '00'); }, xevery:2, label:'Lưu lượng đêm' }) +
      '<div class="leg"><span><i style="background:'+(closed ? '#2E9E5B' : '#D64545')+'"></i>Lưu lượng m³/h</span><span><i style="background:#8A96A3"></i>Mức nền ban đêm</span></div>' +
      (closed
        ? '<div class="note" style="margin-top:12px;background:var(--green-t)"><b style="color:var(--green-d)">✓ Đã đóng van V-T3-02 lúc 02:41</b><br>Người duyệt: '+(S.valveBy || S.role)+' · phản hồi van: ĐÓNG · lưu lượng về 0 · nhật ký lệnh #L-2031 (giá trị cũ MỞ → mới ĐÓNG)</div>'
        : S.valve === 'rejected' ? '<div class="warnbox" style="margin-top:12px">Đề xuất đã bị từ chối. Cảnh báo vẫn mở, cần xử lý thủ công.</div>'
        : '<div class="note" style="margin-top:12px"><b style="color:var(--navy)">AI đề xuất:</b> Đóng van điện từ V-T3-02 (khu căn 3B).<br><b>Căn cứ:</b> cảm biến rò xác nhận; lưu lượng gấp 14 lần mức nền ban đêm trong 30 phút. Không ảnh hưởng nước chữa cháy.<div class="mut sm" style="margin-top:6px">Mức can thiệp: ghi có giới hạn · ưu tiên BACnet 12 · có nhật ký</div></div>') +
      (S.valve === 'open' && canAct ? '<div class="row" style="margin-top:12px;flex-wrap:wrap"><button class="btn primary" data-a="valveOk">Phê duyệt đóng van</button><button class="btn" data-a="alertTicket" data-id="1">Tạo phiếu việc</button><button class="btn danger" data-a="valveNo">Từ chối</button></div>' : '') +
      (S.valve === 'open' && !canAct ? '<div class="mut sm" style="margin-top:12px">Vai trò “'+S.role+'” chỉ xem. Duyệt lệnh dành cho BQL / Kỹ thuật.</div>' : '') +
      '<div class="mut sm" style="margin-top:10px">Đã gửi tới: app BQL, KT trực'+(S.alerts[0].st.indexOf('Phiếu') === 0 ? ' · '+S.alerts[0].st : '')+'</div></div>';
  }
  const d = AI_DETAIL[a.id];
  return '<div class="card"><div class="row">'+lvChip(a.lv)+'<b style="color:var(--navy);font-size:16px">'+d.t+'</b></div><div class="mut sm" style="margin:4px 0 10px">'+d.s+'</div><div class="note"><b style="color:var(--navy)">AI giải thích:</b> '+d.ai+'</div>' +
    '<div class="row" style="margin-top:12px;flex-wrap:wrap">'+(d.btn && canAct ? (d.btn[1] === 'go' ? '<button class="btn primary" data-a="go" data-to="'+d.btn[2]+'">'+d.btn[0]+'</button>' : '<button class="btn primary" data-a="alertTicket" data-id="'+a.id+'">'+d.btn[0]+'</button>') : '')+
    (a.st === 'Chưa xác nhận' || a.st === 'KT Hùng' ? '<button class="btn" data-a="alertAck" data-id="'+a.id+'">Xác nhận đã xem</button>' : '')+'</div></div>';
}
ACT.alertFilter = d => { S.alertFilter = d.v; render(); };
ACT.alertSelect = d => { S.alertSel = +d.id; render(); };
ACT.alertAck = d => { const a = S.alerts.filter(x => x.id === +d.id)[0]; a.st = 'Đã xác nhận'; toast('Đã xác nhận · ghi nhật ký'); render(); };
/* d.by === 'ops': thao tác từ app vận hành, người thực hiện là người dùng đang đăng nhập trên điện thoại */
ACT.valveOk = d => { S.valve = 'closed'; S.valveBy = d.by === 'ops' ? opsWho() : S.role; S.alerts[0].st = 'Đã đóng van 02:41'; toast('Đã gửi lệnh đóng V-T3-02 · van phản hồi ĐÓNG'); render(); };
ACT.valveNo = d => { S.valve = 'rejected'; S.valveBy = d.by === 'ops' ? opsWho() : S.role; S.alerts[0].st = (d.by === 'ops' ? opsUser().role : 'BQL') + ' từ chối'; toast('Đã từ chối đề xuất · ghi nhật ký'); render(); };
function addTicket(tk){ if (!S.ops.tickets.some(x => x.id === tk.id)){ S.ops.tickets.unshift(tk); return true; } return false; }
ACT.alertTicket = d => {
  const a = S.alerts.filter(x => x.id === +d.id)[0];
  if (a.id === 1){ addTicket({id:1044,lv:'khan',title:'Rò rỉ nước nhánh căn 3B',loc:'Tầng 3',due:'ngay',st:'new'}); a.st = 'Phiếu #1044'; toast('Đã tạo phiếu #1044 · gửi app vận hành của KT Hùng'); }
  else { toast('Đã gắn phiếu #1031 đang có · hiển thị trong app vận hành'); }
  render();
};

/* ---------- Năng lượng & nước ---------- */
PAGES['nang-luong'] = {
  title:'Năng lượng & nước', en:'Energy & water', meta:() => 'Hôm nay 20/10/2026 · 47 đồng hồ điện, 28 đồng hồ nước qua BMS Azbil',
  body(){
    const tabs = [['dien','Điện'],['nuoc','Nước'],['hoadon','Hóa đơn'],['xanh','Công trình xanh']].map(x => '<button class="'+(S.energyTab === x[0] ? 'on' : '')+'" data-a="enTab" data-v="'+x[0]+'">'+x[1]+'</button>').join('');
    let b = '';
    if (S.energyTab === 'dien'){
      const top = APTS.slice().sort((a, b) => b.kwh - a.kwh).slice(0, 5);
      b = '<div class="g2"><div class="card"><h3>Phụ tải hôm nay theo giờ (kW): thực tế và dự báo</h3>' +
        lineChart({ series:[{d:HOUR_F,c:'#8A96A3',dash:true,w:2},{d:HOUR_A,c:'#1B7F79',w:2.6,area:true}], min:80, max:300, xl:i => String(i).padStart(2,'0')+'h', xevery:3, vline:10, vlabel:'10:00', label:'Phụ tải theo giờ' }) +
        '<div class="leg" style="margin-top:6px"><span><i style="background:#1B7F79"></i>Thực tế</span><span><i style="background:#8A96A3"></i>Dự báo AI</span></div></div>' +
        '<div class="card"><h3>Căn hộ dùng điện nhiều nhất (kWh)</h3>'+hbars(top.map(x => ({l:'Căn '+x.id,v:x.kwh})), {fmt:v => fmt(v)})+'</div></div>' +
        '<div class="card"><h3>Tiêu thụ bất thường (AI)</h3><div class="g3">' +
        [['TĐ-SPA chạy 02:00–05:00','4,2 kWh (nền 0,6) · chạy ngoài lịch hoạt động','Cao'],['Lộ đèn hầm B1-04','Bật ngoài lịch 3 đêm liên tiếp','TB'],['Căn 2C tăng 38%','So cùng kỳ, đã báo cư dân','TB']].map(r => '<div class="stat" style="background:#fff;border:1px solid var(--line)"><div class="row">'+lvChip(r[2] === 'Cao' ? 'cao' : 'tb')+'</div><b style="color:var(--ink);font-size:15px;margin-top:6px">'+r[0]+'</b><span>'+r[1]+'</span></div>').join('') + '</div></div>';
    } else if (S.energyTab === 'nuoc'){
      const fl = [['B2',.05],['B1',.08],['T1',.06],['T2',.09],['T3',.8],['T4',.07],['T5',.08],['Mái',.03]];
      b = '<div class="g2"><div class="card"><h3>Lưu lượng ban đêm 1–4h (m³/h)</h3>'+barChart({data:fl.map(x => ({l:x[0],v:x[1],hi:x[0] === 'T3'})), h:210, max:1, yfmt:v => fmt(v,1), vfmt:v => fmt(v,1), hiColor:'#D64545', label:'Lưu lượng ban đêm theo tầng'})+'<p class="mut sm" style="margin-top:6px">Tầng 3 nổi bật giữa nền xám: lưu lượng liên tục 0,8 m³/h trong khi mức nền khoảng 0,06.</p></div>' +
        '<div class="card"><h3>Cân bằng tổng – nhánh</h3><div class="col" style="gap:12px"><div class="row"><span class="grow mut">Đồng hồ tổng</span><b style="font-size:20px">41,2 m³</b></div><div class="row"><span class="grow mut">Tổng nhánh</span><b style="font-size:20px">38,9 m³</b></div><div class="row"><span class="grow mut">Lệch</span><span class="chip cao">5,6% ▲ vượt ngưỡng 5%</span></div><div class="warnbox">Gợi ý: kiểm tra đoạn ống nhánh tầng 3 (khu căn 3B), trùng vị trí cảnh báo rò rỉ lúc 02:31.</div></div></div></div>' +
        '<div class="g3"><div class="kpi"><div class="l">Nước tháng</div><div class="v">1.240<small>m³</small></div><div class="d">▼ 3% so T9</div></div><div class="kpi"><div class="l">Đồng hồ nước đang online</div><div class="v">28 / 28</div><div class="d">Báo pin: 1 đồng hồ T5 (phiếu #1039)</div></div><div class="kpi"><div class="l">Nước tưới (AI)</div><div class="v">−22%<small>so lịch cố định</small></div><div class="d">Độ ẩm bồn ≥ ngưỡng 94% thời gian</div></div></div>';
    } else if (S.energyTab === 'hoadon'){
      b = '<div class="card" style="padding:6px 6px 10px"><h3 style="padding:10px 10px 0">Hóa đơn điện, nước theo căn hộ · tháng 10/2026 (tạm tính đến 19/10)</h3><table class="tbl"><thead><tr><th>Căn</th><th class="tr">Điện (kWh)</th><th class="tr">Tiền điện (đ)</th><th class="tr">Nước (m³)</th><th class="tr">Tiền nước (đ)</th><th class="tr">So T9</th></tr></thead><tbody>' +
        APTS.map(a => '<tr><td><b>'+a.id+'</b></td><td class="tr">'+fmt(a.kwh)+'</td><td class="tr">'+fmt(a.e)+'</td><td class="tr">'+a.m3+'</td><td class="tr">'+fmt(a.w)+'</td><td class="tr">'+(Math.abs(a.dv) >= 10 ? '<span class="chip tb">'+(a.dv > 0 ? '+' : '')+a.dv+'%</span>' : '<span class="mut">'+(a.dv > 0 ? '+' : '')+a.dv+'%</span>')+'</td></tr>').join('') +
        '</tbody></table><p class="mut sm" style="padding:8px 10px">Số liệu hóa đơn khớp chỉ số đồng hồ 100% (KPI nghiệm thu). Bảng giá cấu hình được (bậc thang sinh hoạt, kinh doanh). Hóa đơn chính thức cần đồng hồ được kiểm định.</p></div>';
    } else {
      b = '<div class="g3">' +
        [['Cường độ năng lượng (EUI)','112 kWh/m²/năm','▼ 8% so mục tiêu thiết kế'],['Tiết kiệm nước tưới','−22%','so lịch tưới cố định'],['Chiếu sáng theo lịch','94%','đèn tuân thủ lịch hoạt động']].map(r => '<div class="kpi"><div class="l">'+r[0]+'</div><div class="v" style="font-size:22px">'+r[1]+'</div><div class="d">'+r[2]+'</div></div>').join('') +
        '</div><div class="card"><h3>Mẫu báo cáo công trình xanh</h3><p class="mut">CĐT chọn chứng chỉ (LEED / LOTUS / EDGE); Gimasys lập mẫu báo cáo từ dữ liệu điện, nước, CO2, thời tiết. Màn hình này là bản minh họa cho giai đoạn 3.</p></div>';
    }
    return '<div class="pill-tabs">'+tabs+'</div>'+b;
  }
};
ACT.enTab = d => { S.energyTab = d.v; render(); };

/* ---------- Thiết bị & bảo trì dự đoán ---------- */
const DEVS = {
  'SH-01':{x:448,y:72,n:'Bơm sinh hoạt 01'},'SH-02':{x:493,y:72,n:'Bơm sinh hoạt 02'},'BTA-01':{x:538,y:72,n:'Bơm tăng áp 01'},'BTA-02':{x:583,y:72,n:'Bơm tăng áp 02',bad:'cao'},
  'MF':{x:467,y:192,n:'Máy phát'},'MBA':{x:572,y:192,n:'Trạm biến áp'},
  'QH-01':{x:60,y:62,n:'Quạt hầm 01'},'QH-02':{x:340,y:62,n:'Quạt hầm 02'},'CO':{x:200,y:190,n:'Cảm biến CO'},
  'EV-01':{x:60,y:292,n:'Sạc xe điện 01'},'EV-02':{x:105,y:292,n:'Sạc xe điện 02'},'EV-03':{x:150,y:292,n:'Sạc xe điện 03',bad:'cao'},'TĐ':{x:350,y:292,n:'Tủ điện B2'}
};
function floorMap(){
  const rm = (x, y, w, h, l) => '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" fill="#EEF1F4" stroke="#D5DCE3"/><text x="'+(x+8)+'" y="'+(y+18)+'" font-size="11" font-weight="700" fill="#6B7785">'+l+'</text>';
  let s = rm(20,20,380,320,'Hầm xe B2')+rm(420,20,200,110,'Trạm bơm')+rm(420,140,95,90,'Máy phát')+rm(525,140,95,90,'Trạm biến áp')+rm(420,240,95,100,'Phòng bảo vệ')+rm(525,240,95,100,'Rack trung tâm')+
    '<text x="30" y="262" font-size="11" font-weight="700" fill="#6B7785">Sạc xe điện (EV)</text>';
  Object.keys(DEVS).forEach(k => {
    const d = DEVS[k], bad = !!d.bad, sel = S.devSel === k;
    s += '<g data-a="devSel" data-id="'+k+'" style="cursor:pointer" role="button" aria-label="'+d.n+(bad ? ' – cần chú ý' : '')+'">' +
      (bad ? '<circle cx="'+d.x+'" cy="'+d.y+'" r="21" fill="#E8833A" opacity=".18"/>' : '') +
      '<circle cx="'+d.x+'" cy="'+d.y+'" r="14" fill="'+(bad ? '#E8833A' : '#fff')+'" stroke="'+(sel ? '#1B7F79' : (bad ? '#E8833A' : '#A9B4BF'))+'" stroke-width="'+(sel ? 3.5 : 2)+'"/>' +
      '<text x="'+d.x+'" y="'+(d.y+4)+'" text-anchor="middle" font-size="12" font-weight="700" fill="'+(bad ? '#1A2330' : '#6B7785')+'">'+(bad ? '!' : '•')+'</text>' +
      '<text x="'+d.x+'" y="'+(d.y+30)+'" text-anchor="middle" font-size="11" font-weight="'+(bad ? 700 : 400)+'" fill="'+(bad ? '#9A4A0B' : '#6B7785')+'">'+k+'</text></g>';
  });
  return '<svg viewBox="0 0 640 360" width="100%" role="img" aria-label="Sơ đồ hầm B2">'+s+'</svg>';
}
PAGES['thiet-bi'] = {
  title:'Thiết bị & bảo trì', en:'Equipment & maintenance', meta:() => 'Tầng: Hầm B2 · trạng thái, giờ chạy, số lần khởi động, dòng điện, biến tần',
  body(){
    const health = [['Bơm tăng áp BTA-02',61,'cao','Khởi động 3× mức nền; kiểm tra van một chiều'],['Quạt cấp FAF-02',74,'tb','Chênh áp lọc tăng 40% trong 3 tuần'],['Bơm sinh hoạt SH-01',92,'ok','Bình thường · 2.140 giờ chạy'],['Bơm sinh hoạt SH-02',88,'ok','Bình thường · luân phiên tối nay'],['Máy phát MF',95,'ok','Lần chạy thử gần nhất 14/10']];
    const d = DEVS[S.devSel];
    return '<div class="g2"><div class="card"><h3>Sơ đồ hầm B2<small>chỉ thiết bị bất thường có màu · bấm vào thiết bị để xem</small></h3>'+floorMap()+
      '<div class="leg" style="margin-top:6px"><span><i style="background:#E8833A;height:8px;width:8px;border-radius:50%"></i>Cần chú ý (kèm dấu “!”)</span><span><i style="background:#A9B4BF;height:8px;width:8px;border-radius:50%"></i>Bình thường</span></div>' +
      '<div class="note" style="margin-top:10px"><b>'+S.devSel+' · '+d.n+'</b> — '+(d.bad ? (S.devSel === 'BTA-02' ? 'Điểm sức khỏe 61/100, khởi động 70 lần/ngày.' : 'Mất kết nối OCPP từ 10:05.') : 'Hoạt động bình thường.')+'</div></div>' +
      '<div class="card"><h3>Chỉ số sức khỏe thiết bị (0–100)</h3>'+health.map(h => '<div style="margin-bottom:13px"><div class="row sm"><b class="grow">'+h[0]+'</b>'+(h[2] === 'ok' ? '' : lvChip(h[2]))+'<b style="font-size:16px;width:30px;text-align:right">'+h[1]+'</b></div><div class="bar '+(h[2] === 'cao' ? 'warn' : '')+'" style="margin:4px 0"><i style="width:'+h[1]+'%;'+(h[2] === 'tb' ? 'background:#D9A21B' : '')+'"></i></div><div class="mut sm">'+h[3]+'</div></div>').join('')+'</div></div>' +
      '<div class="g2e"><div class="card"><h3>Lần khởi động/ngày · BTA-02 · 7 ngày gần nhất</h3>'+barChart({data:[22,24,23,35,48,61,70].map((v, i) => ({l:['T2','T3','T4','T5','T6','T7','CN'][i],v:v,hi:i === 6})), h:200, base:23, baseLabel:'mức nền 23', yfmt:v => Math.round(v), labels:true, label:'Số lần khởi động bơm'})+'<p class="mut sm">Xu hướng tăng dần trong 7 ngày là dấu hiệu sớm của hỏng van một chiều.</p></div>' +
      '<div class="card"><h3>Đề xuất bảo trì</h3><div class="note" style="margin-bottom:10px"><b style="color:var(--navy)">Kiểm tra van một chiều bơm tăng áp 02 trong 7 ngày</b></div><div class="warnbox">Nếu bỏ qua: bơm chạy liên tục, nguy cơ cháy động cơ.</div>' +
      (S.ticketMade ? '<div class="note" style="margin-top:12px;background:var(--green-t)"><b style="color:var(--green-d)">✓ Đã tạo phiếu #1047</b> · hạn 27/10 · giao KT Hùng. Mở <a href="#/vanhanh/viec">app vận hành → Việc của tôi</a> để xem.</div>' : '<p style="margin-top:12px"><button class="btn primary" data-a="mkTicket">Tạo phiếu việc</button></p>') + '</div></div>';
  }
};
ACT.devSel = d => { S.devSel = d.id; render(); };
ACT.mkTicket = () => { S.ticketMade = true; addTicket({id:1047,lv:'cao',title:'Kiểm tra van một chiều BTA-02',loc:'Trạm bơm B2',due:'hạn 27/10',st:'new'}); toast('Đã tạo phiếu #1047 · giao KT Hùng'); render(); };

/* ---------- An ninh & vào ra ---------- */
function secCard(compact){
  const q = S.sec, st = q.stage, canSee = S.role === 'BQL' || S.role === 'Bảo vệ';
  if (st === 'idle') return '<div class="card"><h3>Sự kiện camera AI</h3><div class="mut">Chưa có sự kiện. Camera AI đang giám sát 83 camera; mọi sự kiện sẽ được đối chiếu với nhật ký vào ra.</div></div>';
  const img = '<div class="camimg"><span class="ts">CAM-B2-17 · 20/10 '+q.at+'</span><div style="margin-top:14px">'+personSvg(!q.reveal, 70, 90)+'</div><span class="box" style="left:41%;top:26%;width:20%;height:62%"></span><span class="lbl" style="left:41%;top:20%">NGƯỜI · 0,94</span></div>';
  let body = '';
  if (st === 'detected' || st === 'accepted'){
    body = '<div class="row" style="margin-bottom:8px">'+lvChip('cao')+'<b style="color:var(--navy);font-size:15px">Có người ở khu kỹ thuật Z10 ngoài giờ</b></div>' +
      '<div class="mut sm" style="margin-bottom:10px">Không có lượt quét vào ra hợp lệ trong 10 phút trước · phát hiện sau '+fmt(q.secs,1)+' giây (mục tiêu ≤ 10 giây)</div>' + img +
      '<div class="row" style="margin-top:6px"><button class="btn ghost sm" data-a="secReveal">'+ic('eye',14)+' '+(q.reveal ? 'Làm mờ lại' : 'Xem ảnh gốc')+'</button><span class="mut xs">Ảnh làm mờ mặc định; mở xem được ghi nhật ký</span></div>' +
      (st === 'accepted' ? '<div class="note" style="margin:10px 0"><b>'+q.owner+' ('+(q.ownerRole || 'Bảo vệ')+') đang xử lý</b> · nhận lúc 23:48</div>' : '') +
      (q.esc && st === 'detected' ? '<div class="warnbox" style="margin:10px 0">Không ai nhận sau 3 phút → <b>đã leo thang Trưởng BQL</b> (anh Dũng) qua app + SMS.</div>' : '') +
      '<div class="row" style="margin-top:12px;flex-wrap:wrap">'+(st === 'detected' ? '<button class="btn primary" data-a="secCall">Gọi bảo vệ</button>' : '')+'<button class="btn" data-a="secVerify">Đã xác minh</button><button class="btn ghost" data-a="secFalse">Báo giả</button></div>';
  } else if (st === 'closed'){
    body = '<div class="row" style="margin-bottom:8px"><span class="chip ok">ĐÃ ĐÓNG</span><b style="color:var(--navy)">Khu kỹ thuật Z10 · 23:47</b></div><div class="note" style="background:var(--green-t)">Đã xác minh: nhân viên kỹ thuật trực (Hùng) · đóng lúc 23:52 · '+(q.owner || 'Tuấn')+' xử lý. Sự kiện đã đưa vào <a href="#/web/tro-ly">tóm tắt ca</a>.</div>';
  } else {
    body = '<div class="row" style="margin-bottom:8px"><span class="chip neutral">BÁO GIẢ</span><b style="color:var(--navy)">Khu kỹ thuật Z10 · 23:47</b></div><div class="note">Đã đánh dấu báo giả để hiệu chỉnh vùng phát hiện camera CAM-B2-17. Không tạo cảnh báo mới.</div>';
  }
  return '<div class="card" style="'+(st === 'detected' || st === 'accepted' ? 'border-color:var(--orange)' : '')+'"><h3>Sự kiện camera AI</h3>'+body+'</div>';
}
PAGES['an-ninh'] = {
  title:'An ninh & vào ra', en:'Security & access', meta:() => 'Ca đêm · 23:47 · Kịch bản K8 và phân luồng theo ma trận Z1–Z10',
  body(){
    const R = S.rooftop, rt = R.hold;
    const log = [['18:02','Cư dân · 4B','Khuôn mặt','Sảnh thang B2 → tầng 4'],['18:05','Khách của 2C','QR mời','Sảnh T1 → tầng 2'],['18:07','30A-•••.12','Biển số','Barie vào hầm'],['18:31','NV nhà hàng','Khuôn mặt + ca','Cửa hậu cần B1'],['18:40','Không xác định','Thẻ','Cửa kỹ thuật Z10'],['19:15','Khách bar','Không định danh','Thang công cộng → tum']];
    const cell = v => '<span class="cell '+(v === '✕' ? 'x' : /^QR/.test(v) ? 'q' : v === 'G' ? 'g' : /^M/.test(v) ? 'm' : '')+'">'+v+'</span>';
    const mat = [['Cư dân','M','M','M*','T','G','✕'],['Khách cư dân','QR','QR','QR*','T','G','✕'],['Khách nhà hàng','T','G','✕','G','G','✕'],['BQL, kỹ thuật','M','M','M','M','M','M']];
    return '<div class="g2e">'+secCard()+'<div class="col"><div class="card"><h3>Sức chứa theo khu</h3>' +
      '<div style="margin-bottom:12px"><div class="row sm"><span class="grow">Rooftop</span><b>108 / 120</b><span class="chip cao">90%</span></div><div class="bar warn" style="margin-top:4px"><i style="width:90%"></i></div></div>' +
      '<div><div class="row sm"><span class="grow">Nhà hàng B1</span><b>86 / 150</b><span class="chip ok">57%</span></div><div class="bar" style="margin-top:4px"><i style="width:57%"></i></div></div>' +
      '<div class="warnbox" style="margin-top:12px">Rooftop ≥ 90%: <b>đã báo quầy bar</b>, '+(rt ? 'tạm dừng cho thang lên tum.' : 'thang lên tum đã được mở lại thủ công.')+'<div style="margin-top:8px"><button class="btn sm" data-a="rooftopHold">'+(rt ? 'Mở lại thang lên tum' : 'Tạm dừng thang lên tum')+'</button></div></div></div>' +
      '<div class="card"><h3>Tham số vận hành<small>quyền là tham số, không phải code</small></h3><div class="row" style="flex-wrap:wrap"><span>Giờ mở rooftop</span><input type="time" data-bind="rooftop.from" value="'+R.from+'" style="border:1px solid var(--line);border-radius:6px;padding:5px"><span>đến</span><input type="time" data-bind="rooftop.to" value="'+(R.to === '24:00' ? '23:59' : R.to)+'" style="border:1px solid var(--line);border-radius:6px;padding:5px"><button class="btn primary sm" data-a="rooftopSave">Áp dụng</button></div><div class="mut xs" style="margin-top:6px">Đồng bộ xuống hệ vào ra và thang máy, có nhật ký thay đổi.</div></div></div></div>' +
      '<div class="card" style="padding:6px 6px 10px"><h3 style="padding:10px 10px 0">Nhật ký vào ra<small>không hiện ảnh khuôn mặt · biển số che một phần</small></h3><table class="tbl"><thead><tr><th>Giờ</th><th>Người</th><th>Cách xác thực</th><th>Điểm vào</th></tr></thead><tbody>'+log.map(l => '<tr class="'+(l[1] === 'Không xác định' ? '' : '')+'"><td>'+l[0]+'</td><td>'+(l[1] === 'Không xác định' ? '<b>'+l[1]+'</b> <span class="chip tb">cần xem</span>' : l[1])+'</td><td>'+l[2]+'</td><td>'+l[3]+'</td></tr>').join('')+'</tbody></table></div>' +
      '<div class="card"><h3>Ma trận quyền (rút gọn)<small>chỉnh trên phần mềm</small></h3><table class="tbl"><thead><tr><th></th><th>Z1 Sảnh</th><th>Z2 Hầm</th><th>Z3 Căn hộ</th><th>Z8 Nhà hàng</th><th>Z7 Rooftop</th><th>Z10 KT</th></tr></thead><tbody>'+mat.map(r => '<tr><td><b>'+r[0]+'</b></td>'+r.slice(1).map(v => '<td>'+cell(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table><p class="mut sm" style="margin-top:8px">M: khuôn mặt · QR: mã mời · G: trong giờ · T: tự do · *: chỉ tầng được phép · ✕: không được vào</p></div>';
  }
};
ACT.rooftopHold = () => { S.rooftop.hold = !S.rooftop.hold; render(); };
ACT.rooftopSave = () => { toast('Đã áp dụng giờ rooftop '+S.rooftop.from+'–'+S.rooftop.to+' · đồng bộ xuống vào ra/thang máy'); };
ACT.secReveal = d => {
  const ops = d.by === 'ops', role = ops ? opsUser().role : S.role;   // app vận hành xét quyền theo người đăng nhập trên điện thoại, không theo vai trò của web
  if (!(ops ? opsUser().photo : (S.role === 'BQL' || S.role === 'Bảo vệ'))){ toast('Vai trò “'+role+'” không được xem ảnh gốc'); return; }
  S.sec.reveal = !S.sec.reveal; if (S.sec.reveal) logEvt(S.k8.log, S.sec.at.slice(0, 5), ops ? opsWho() : S.role, 'xem ảnh gốc (ghi nhật ký)'); render();
};
ACT.secCall = () => { toast('Đã gọi bảo vệ Tuấn và KT Hùng'); logEvt(S.k8.log, '23:47', 'Nền tảng', 'gọi bảo vệ Tuấn, KT Hùng'); render(); };
ACT.secAccept = () => { const me = opsUser(); S.sec.stage = 'accepted'; S.sec.owner = me.name; S.sec.ownerRole = me.role; S.sec.esc = false; logEvt(S.k8.log, '23:48', opsWho(), 'nhận xử lý · các thiết bị khác thấy “'+me.name+' đang xử lý”'); render(); };
ACT.secVerify = d => { const by = d.by === 'ops' ? opsUser().name : (S.sec.owner || 'Tuấn'); S.sec.stage = 'closed'; S.sec.owner = S.sec.owner || by; logEvt(S.k8.log, '23:52', by, 'xác minh: nhân viên KT trực → đóng sự kiện, đưa vào tóm tắt ca'); render(); };
ACT.secFalse = d => { const by = d.by === 'ops' ? opsUser().name : (S.sec.owner || 'Bảo vệ'); S.sec.stage = 'false'; logEvt(S.k8.log, '23:51', by, 'báo giả → đánh dấu hiệu chỉnh vùng phát hiện CAM-B2-17'); render(); };

/* ---------- Trợ lý AI ---------- */
function shiftSummary(){
  const leak = S.valve === 'closed' ? 'Rò rỉ tầng 3 (đã đóng van 02:41)' : S.valve === 'rejected' ? 'Rò rỉ tầng 3 (BQL từ chối đóng van, đang xử lý thủ công)' : 'Rò rỉ tầng 3 (chưa xử lý)';
  const sec = { closed:'người ở khu kỹ thuật (đã xác minh: KT trực)', 'false':'người ở khu kỹ thuật (báo giả, đã đánh dấu hiệu chỉnh)', accepted:'người ở khu kỹ thuật ('+(S.sec.owner || 'Tuấn')+' đang xử lý)', detected:'người ở khu kỹ thuật (chưa ai nhận)', idle:'không có sự kiện an ninh' }[S.sec.stage];
  return '<b>Tóm tắt ca đêm 19–20/10 (AI soạn)</b><table style="margin-top:8px"><tbody>' +
    '<tr><th>3 sự kiện</th><td>'+leak+'; trạm sạc 03 mất kết nối; '+sec+'</td></tr>' +
    '<tr><th>2 việc tồn</th><td>Phiếu #1043 vệ sinh lọc FAF-02; kiểm tra van một chiều bơm tăng áp 02 ('+(S.ticketMade ? 'phiếu #1047' : 'chưa có phiếu')+')</td></tr>' +
    '<tr><th>Lưu ý ca ngày</th><td>Thợ sửa ống căn 3B cần QR vào khu kỹ thuật từ 08:30</td></tr>' +
    '<tr><th>Số liệu</th><td>Điện đêm 412 kWh (dự báo 405); nước đêm bình thường trừ tầng 3</td></tr></tbody></table>';
}
function answer(q){
  const s = q.toLowerCase(), M = S.model;
  if (/hóa đơn|thanh toán|tiền điện|nhiều nhất|căn nào/.test(s) && S.role === 'Bảo vệ')
    return { h:'Vai trò <b>Bảo vệ</b> không có quyền xem dữ liệu hóa đơn và tiêu thụ theo căn hộ. Mình có thể trả lời về cảnh báo an ninh, vào ra và tóm tắt ca.', src:'Phân quyền theo vai trò · không truy vấn dữ liệu' };
  if (/bơm/.test(s)) return { h:'Có 1 bơm cần chú ý:<br><b>Bơm tăng áp 02 (B2)</b> khởi động 70 lần hôm qua, gấp 3 lần mức bình thường, nhiều khả năng do van một chiều. '+(S.ticketMade ? 'Đã có phiếu việc #1047.' : 'Đã có đề xuất bảo trì, chưa có phiếu việc.')+'<br>Các bơm còn lại hoạt động bình thường.', src:'BMS Azbil · BTA-02 RUN, START_COUNT · cập nhật 10:15' };
  if (/điện|căn/.test(s)) return { h:'Ba căn dùng nhiều nhất tháng 10 (đến 19/10):<table><tr><th>Căn</th><th>kWh</th><th>So T9</th></tr><tr><td>5A</td><td>1.284</td><td>+4%</td></tr><tr><td>4B</td><td>1.190</td><td>−2%</td></tr><tr><td>3C</td><td>1.105</td><td>+11%</td></tr></table>Căn 3C tăng 11% chủ yếu từ 22:00–02:00. Xem chi tiết ở <a href="#/web/nang-luong">trang Năng lượng</a>.', src:'đồng hồ PM-CH-3C, PM-CH-4B, PM-CH-5A · cập nhật 10:15' };
  if (/tóm tắt|ca đêm|giao ca/.test(s)) return { h:shiftSummary(), src:'Nhật ký cảnh báo, phiếu việc, historian · soạn lúc 06:00', shift:true };
  if (/faf|chênh áp/.test(s)) return { h:'<b>Chênh áp lọc FAF-02 cao</b> nghĩa là lọc gió quạt cấp tầng mái đang bẩn, quạt phải làm việc nặng hơn. Mức chênh áp đã tăng 40% trong 3 tuần.<br>Xử lý: vệ sinh hoặc thay lọc (phiếu #1043, hạn 22/10); không cần dừng quạt.', src:'SOP-HVAC-07 · cảm biến DP-FAF-02 · cập nhật 11:12' };
  if (/cảnh báo/.test(s)) return { h:'Tuần này (14–20/10) có <b>19 cảnh báo</b>: 2 khẩn, 5 cao, 9 trung bình, 3 thông tin. 2 sự cố lặp lại: <b>bơm tăng áp 02</b> khởi động dày (4 lần) và <b>trạm sạc 03</b> mất kết nối (2 lần).', src:'Trung tâm cảnh báo · 14/10–20/10 · cập nhật 10:15' };
  if (/bảo trì|lịch/.test(s)) return { h:'Lịch bảo trì tuần tới:<table><tr><th>Ngày</th><th>Việc</th></tr><tr><td>22/10</td><td>Vệ sinh lọc FAF-02 (#1043)</td></tr><tr><td>22/10</td><td>Bảo trì thang máy số 2, 09:00–11:00</td></tr><tr><td>24/10</td><td>Chạy thử máy phát định kỳ</td></tr><tr><td>27/10</td><td>Kiểm tra van một chiều BTA-02 '+(S.ticketMade ? '(#1047)' : '(đề xuất, chưa có phiếu)')+'</td></tr></table>', src:'Lịch bảo trì, phiếu việc · cập nhật 10:15' };
  return { h:'Mình chưa có dữ liệu để trả lời câu này một cách chắc chắn, nên không đoán. Bạn có thể hỏi về thiết bị, cảnh báo, điện nước hoặc tóm tắt ca.', src:'Không tìm thấy điểm dữ liệu phù hợp' };
}
function seedChat(){
  if (S.chat.length) return;
  S.chat.push({r:'u',h:'Bơm nào đang có vấn đề?'}); const a1 = answer('bơm'); S.chat.push({r:'a',h:a1.h,src:a1.src});
  S.chat.push({r:'u',h:'Tháng này căn nào dùng điện nhiều nhất?'}); const a2 = answer('căn điện'); S.chat.push({r:'a',h:a2.h,src:a2.src});
}
PAGES['tro-ly'] = {
  title:'Trợ lý AI', en:'AI assistant', meta:() => 'Mô hình: '+S.model+' · Chỉ đọc, không điều khiển thiết bị',
  body(){
    seedChat();
    const msgs = S.chat.map(m => m.r === 'u' ? '<div class="msg u">'+esc(m.h)+'</div>' : '<div class="msg a">'+m.h+(m.shift && !S.handover ? '<div style="margin-top:10px"><button class="btn primary sm" data-a="handover">Xác nhận bàn giao ca</button></div>' : '')+(m.shift && S.handover ? '<div class="chip ok" style="margin-top:10px">Đã bàn giao · '+S.role+' xác nhận · lưu nhật ký vận hành</div>' : '')+'<div class="src">Nguồn: '+m.src+' · mô hình '+S.model+'</div></div>').join('') +
      (S.busy ? '<div class="msg a typing"><span></span><span></span><span></span></div>' : '');
    return '<div class="card" style="max-width:860px;width:100%;margin:0 auto"><div class="row" style="margin-bottom:12px"><b style="color:var(--navy)">Hỏi bằng tiếng Việt, trả lời từ dữ liệu thật</b><span class="sp"></span><select data-c="model" style="border:1px solid var(--line);border-radius:8px;padding:5px 8px"><option '+(S.model === 'Claude' ? 'selected' : '')+'>Claude</option><option '+(S.model === 'Gemini' ? 'selected' : '')+'>Gemini</option></select><span class="chip neutral">Chỉ đọc</span></div>' +
      '<div class="chat" data-sk="chat" data-scrollend>'+msgs+'</div>' +
      '<div class="sugg" style="margin:14px 0 10px"><button data-a="ask" data-q="Tóm tắt ca đêm">Tóm tắt ca đêm</button><button data-a="ask" data-q="Cảnh báo tuần này">Cảnh báo tuần này</button><button data-a="ask" data-q="Lịch bảo trì tuần tới">Lịch bảo trì tuần tới</button><button data-a="ask" data-q="Cảnh báo chênh áp lọc FAF-02 nghĩa là gì?">FAF-02 nghĩa là gì?</button></div>' +
      '<div class="askbox"><input id="askin" placeholder="Hỏi về thiết bị, cảnh báo, điện nước…" data-enter="askInput" autocomplete="off"><button class="btn primary" data-a="askInput">Gửi</button></div></div>';
  }
};
ACT.model = (d, el) => { S.model = el.value; render(); };
function doAsk(q){
  if (!q.trim() || S.busy) return;
  S.chat.push({r:'u',h:q}); S.busy = true; render();
  setTimeout(() => { const a = answer(q); S.chat.push({r:'a',h:a.h,src:a.src,shift:a.shift}); S.busy = false; render(); }, 750);
}
ACT.ask = d => doAsk(d.q);
ACT.askInput = () => { const i = document.getElementById('askin'); doAsk(i ? i.value : ''); };
ACT.handover = () => { S.handover = true; toast('Đã xác nhận bàn giao ca · lưu nhật ký vận hành'); render(); };

/* ---------- Báo cáo, Cấu hình (ngoài phạm vi prototype này) ---------- */
function later(title, items){
  return '<div class="card" style="max-width:640px"><span class="chip neutral">Giai đoạn prototype tương tác (Figma)</span><h3 style="margin-top:12px;font-size:16px">'+title+'</h3><ul style="margin:8px 0 0 18px;color:var(--ink2);line-height:1.8">'+items.map(i => '<li>'+i+'</li>').join('')+'</ul><p class="mut sm" style="margin-top:12px">Mục này không nằm trong bộ màn hình ★ của bản prototype (slide 3), sẽ bổ sung sau khi chốt phạm vi với CĐT.</p></div>';
}
PAGES['bao-cao'] = { title:'Báo cáo', en:'Reports', body:() => later('Báo cáo tháng do AI soạn sẵn để BQL chỉnh', ['Năng lượng, nước, chi phí vận hành, so sánh kỳ','Lượng khách nhà hàng, rooftop; tình trạng thiết bị','Báo cáo công trình xanh theo chứng chỉ CĐT chọn']) };
PAGES['cau-hinh'] = { title:'Cấu hình', en:'Settings', body:() => later('Cấu hình, phân quyền, tham số', ['Ma trận phân quyền Z1–Z10, nhóm người, giờ hoạt động','Danh sách trắng điểm ghi lệnh, dải giá trị, chế độ “chỉ đề xuất / tự động có xác nhận”','Bảng giá điện nước, ngưỡng cảnh báo, ma trận ưu tiên']) };
