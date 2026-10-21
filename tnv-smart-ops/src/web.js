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
const ROLE_AV = { 'CĐT':'CĐT','BQL':'BQL','Bảo vệ':'BV','Kỹ thuật':'KT' };
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
/* Số chú thích cam (khớp với “Best practice áp dụng”), chỉ hiện khi mở Ghi chú UX */
function mk(n){ return S.ux ? '<span class="mk">'+n+'</span>' : ''; }

function webShell(sub, title, meta, body){
  const allowed = ROLES[S.role];
  const nav = NAV.filter(n => allowed.indexOf(n[0]) > -1).map(n =>
    '<a class="'+(n[0] === sub ? 'on' : '')+'" href="#/web/'+n[0]+'">'+ic(n[3], 17)+'<span>'+t(n[1], n[2])+'</span></a>').join('');
  return '<div class="web'+(S.ux ? ' ux' : '')+'"><aside class="side"><div class="logo">TNV · Smart Ops</div>'+nav+
    '<div class="ft">Claude · Gemini qua cổng AI Gimasys</div></aside><div class="main">' +
    '<div class="hdr"><h1>'+title+'</h1><span class="meta">'+(meta || '')+'</span><span class="sp"></span>' +
    '<div class="lang"><button class="'+(S.lang === 'vi' ? 'on' : '')+'" data-a="lang" data-v="vi">VI</button><span>|</span><button class="'+(S.lang === 'en' ? 'on' : '')+'" data-a="lang" data-v="en">EN</button></div>' +
    '<div class="role"><select data-c="role" aria-label="Vai trò">'+Object.keys(ROLES).map(r => '<option '+(r === S.role ? 'selected' : '')+'>'+r+'</option>').join('')+'</select><div class="av">'+esc(ROLE_AV[S.role])+'</div></div></div>' +
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
const TQ_SHORT = { 1:'Rò rỉ nước tầng 3 – nhánh căn 3B', 2:'Bơm tăng áp 02 khởi động dày', 3:'Trạm sạc 03 hầm B2 mất kết nối', 4:'Lọc gió FAF-02 cần vệ sinh' };
PAGES['tong-quan'] = {
  title:'Tổng quan tòa nhà', en:'Building overview', meta:() => t('Tháng 10/2026','October 2026')+' ▾',
  body(){
    const c = alertCounts(), list = visibleAlerts().filter(a => a.lv !== 'tin' && (S.role === 'CĐT' ? true : a.lv !== 'tb' || a.id === 4)).slice(0, 4);
    const kpi = (l, v, u, d, tone, icn) => '<div class="kpi"><span class="kic">'+ic(icn, 16)+'</span><div class="l">'+l+'</div><div class="v">'+v+(u ? '<small>'+u+'</small>' : '')+'</div><div class="d '+(tone || '')+'">'+d+'</div></div>';
    const occ = [['Nhà hàng B1',86,150],['Rooftop',108,120],['Sảnh T1',12,60]];
    const gain = [['drop','−22% '+t('nước tưới','irrigation water'),'so lịch tưới cố định'],['fan','−310 kWh '+t('quạt hầm','garage fans'),'chạy theo CO và lượt xe'],['check','1 '+t('rò rỉ phát hiện sớm','leak caught early'),'ước tính tránh mất 3,5 m³']];
    return '<div class="g5 rel">'+mk(1) +
      kpi(t('Điện năng tháng','Electricity (month)'), '48,2', 'MWh', '▼ 6% '+t('so dự báo','vs forecast'), '', 'bolt') +
      kpi(t('Nước tháng','Water (month)'), '1.240', 'm³', '▼ 3% '+t('so T9','vs Sep'), '', 'drop') +
      kpi(t('Chi phí vận hành','Operating cost'), '312', 'tr đ', '▼ 4% '+t('so kế hoạch','vs plan'), '', 'bars') +
      kpi(t('Cảnh báo đang mở','Open alerts'), S.alerts.length, '', c.khan+' '+t('khẩn','urgent')+' · '+c.cao+' '+t('cao','high'), 'red', 'bell') +
      kpi(t('Thiết bị sẵn sàng','Equipment ready'), '98,6%', '', '2 '+t('thiết bị cần kiểm tra','need checking'), 'org', 'wrench') + '</div>' +
      '<div class="g2"><div class="card">'+mk(2)+'<h3>'+t('Điện năng theo ngày: thực tế và dự báo AI (MWh)','Daily electricity: actual vs AI forecast (MWh)')+'</h3>' +
      lineChart({ series:[{d:DAYS_F,c:'#B9C3CC',w:2},{d:DAYS_A,c:'#1B7F79',w:2.6,area:true}], min:1.5, max:3.1, yfmt:v => fmt(v,1), xl:i => (i+1), xevery:3, vline:19, vlabel:'hôm nay', label:'Điện năng theo ngày' }) +
      '<div class="leg" style="margin-top:6px"><span><i style="background:#1B7F79"></i>'+t('Thực tế','Actual')+'</span><span><i style="background:#B9C3CC"></i>'+t('Dự báo AI','AI forecast')+'</span></div></div>' +
      '<div class="card">'+mk(3)+'<h3>'+t('Cảnh báo cần quyết định','Alerts needing a decision')+'<a class="hlink" href="#/web/canh-bao">'+t('Tất cả','All')+' →</a></h3>' +
      list.map(a => '<div class="arow" data-a="alertOpen" data-id="'+a.id+'">'+lvChip(a.lv)+'<span class="grow">'+(TQ_SHORT[a.id] || a.desc)+'</span><span class="mut sm">'+a.time+'</span></div>').join('') + '</div></div>' +
      '<div class="g3w"><div class="card"><h3>'+t('Điện theo khu vực (MWh)','Electricity by area (MWh)')+'</h3>' +
      hbars([{l:'Căn hộ',v:14.1},{l:'Nhà hàng B1',v:10.8},{l:'Thương mại',v:7.9},{l:'Hầm, kỹ thuật',v:6.4},{l:'Rooftop',v:5.2},{l:'Chung',v:3.8}], {fmt:v => fmt(v,1), color:'var(--teal)'}) + '</div>' +
      '<div class="card"><h3>'+t('Khách đang có mặt','Current occupancy')+'</h3>' +
      occ.map(r => { const hi = r[1]/r[2] >= .9; return '<div class="occ"><div class="row sm"><span class="grow">'+r[0]+'</span><b>'+r[1]+' / '+r[2]+'</b></div><div class="bar '+(hi ? 'warn' : 'teal')+'"><i style="width:'+(r[1]/r[2]*100)+'%"></i></div></div>'; }).join('') + '</div>' +
      '<div class="card">'+mk(4)+'<h3>'+t('Hiệu quả AI tháng này','AI impact this month')+'</h3>' +
      gain.map(g => '<div class="gain">'+ic(g[0], 18, 2.2)+'<div><b>'+g[1]+'</b><span>'+g[2]+'</span></div></div>').join('') + '</div></div>';
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
const LEAK_X = ['00:00','00:30','01:00','01:30','02:00','02:30','03:00'];
function flowSeries(){ // lưu lượng 00:00–03:00 (m³/h) mỗi 30 phút
  const d = [.05,.04,.03,.04,.05,.82,.8];
  if (S.valve === 'closed') d[6] = 0; // đóng van lúc 02:41
  return d;
}
PAGES['canh-bao'] = {
  title:'Trung tâm cảnh báo', en:'Alert center', meta:() => 'Ca đêm · Bảo vệ: Tuấn · KT: Hùng',
  body(){
    const c = alertCounts(), vis = visibleAlerts(), f = S.alertFilter;
    const list = f === 'all' ? vis : vis.filter(a => a.lv === f);
    const sel = S.alerts.filter(a => a.id === S.alertSel)[0] || list[0];
    const tabs = [['all','Tất cả'],['khan','Khẩn'],['cao','Cao'],['tb','TB'],['tin','Tin']].map(x => '<button class="lvp '+x[0]+(f === 'all' || f === x[0] ? ' on' : '')+(f === x[0] ? ' cur' : '')+'" data-a="alertFilter" data-v="'+x[0]+'">'+x[1]+' '+(S.role === 'CĐT' && (x[0] === 'tb' || x[0] === 'tin') ? 0 : c[x[0]])+'</button>').join('');
    const rows = list.map(a => '<tr class="click '+(a.lv === 'khan' ? 'k' : '')+' '+(sel && a.id === sel.id ? 'sel' : '')+'" data-a="alertSelect" data-id="'+a.id+'"><td>'+lvChip(a.lv)+'</td><td>'+a.time+'</td><td class="mut">'+a.loc+'</td><td class="'+(a.lv === 'khan' ? 'b' : '')+'">'+a.desc+'</td><td class="'+(a.st === 'Chưa xác nhận' ? 'stnew' : 'mut')+'">'+a.st+'</td></tr>').join('');
    return '<div class="acgrid"><div class="col" style="gap:12px"><div class="lvtabs rel">'+mk(2)+tabs+'</div><div class="card tblcard">'+mk(1)+'<table class="tbl"><thead><tr><th>Mức</th><th>Giờ</th><th>Vị trí</th><th>Mô tả</th><th>Trạng thái</th></tr></thead><tbody>'+rows+'</tbody></table>'+(list.length ? '' : '<p class="mut sm" style="padding:12px 10px">Không có cảnh báo ở mức này.</p>')+'</div></div>'+(sel ? alertDetail(sel) : '<div></div>')+'</div>';
  }
};
function alertDetail(a){
  const canAct = S.role === 'BQL' || S.role === 'Kỹ thuật';
  if (a.id === 1){
    const closed = S.valve === 'closed', fl = flowSeries(), col = closed ? '#2E9E5B' : '#D64545';
    return '<div class="card detail"><div class="row">'+lvChip('khan')+'<b class="dt">Rò rỉ nước · Tầng 3, nhánh căn 3B</b></div>' +
      '<div class="mut sm" style="margin:4px 0 8px">Đồng hồ FM-T3-02 · cảm biến rò LS-T3-02 · 02:31</div>' +
      lineChart({ series:[{d:fl.map(() => .06),c:'#B9C3CC',w:1.8},{d:fl,c:col,w:2.4,area:true}], w:430, h:150, pr:22, min:0, max:1, yfmt:v => fmt(v,1), xl:i => LEAK_X[i], xevery:1, label:'Lưu lượng đêm' }) +
      '<div class="leg"><span><i style="background:'+col+'"></i>Lưu lượng m³/h</span><span><i style="background:#B9C3CC"></i>Mức nền ban đêm</span></div>' +
      (closed
        ? '<div class="note" style="margin-top:12px;background:var(--green-t)"><b style="color:var(--green-d)">✓ Đã đóng van V-T3-02 lúc 02:41</b><br>Người duyệt: '+(S.valveBy || S.role)+' · phản hồi van: ĐÓNG · lưu lượng về 0 · nhật ký lệnh #L-2031 (giá trị cũ MỞ → mới ĐÓNG)</div>'
        : S.valve === 'rejected' ? '<div class="warnbox" style="margin-top:12px">Đề xuất đã bị từ chối. Cảnh báo vẫn mở, cần xử lý thủ công.</div>'
        : '<div class="aibox rel">'+mk(3)+'<div class="aih">'+ic('spark', 16)+'AI đề xuất</div>Đóng van điện từ V-T3-02 (khu căn 3B). <b>Căn cứ:</b> cảm biến rò xác nhận; lưu lượng gấp 14 lần mức nền ban đêm trong 30 phút. Không ảnh hưởng nước chữa cháy.<div class="mut xs" style="margin-top:6px">Mức can thiệp: ghi có giới hạn · ưu tiên BACnet 12 · có nhật ký</div></div>') +
      (S.valve === 'open' && canAct ? '<div class="acts rel">'+mk(4)+'<button class="btn red block" data-a="valveOk">Phê duyệt đóng van</button><div class="btn2"><button class="btn" data-a="alertTicket" data-id="1">Tạo phiếu việc</button><button class="btn ghost" data-a="valveNo">Từ chối</button></div></div>' : '') +
      (S.valve === 'open' && !canAct ? '<div class="mut sm" style="margin-top:12px">Vai trò “'+S.role+'” chỉ xem. Duyệt lệnh dành cho BQL / Kỹ thuật.</div>' : '') +
      '<div class="mut sm" style="margin-top:10px">Đã gửi tới: app BQL, KT trực'+(S.alerts[0].st.indexOf('Phiếu') === 0 ? ' · '+S.alerts[0].st : '')+'</div></div>';
  }
  const d = AI_DETAIL[a.id];
  const main = d.btn && canAct ? (d.btn[1] === 'go' ? '<button class="btn primary block" data-a="go" data-to="'+d.btn[2]+'">'+d.btn[0]+'</button>' : '<button class="btn primary block" data-a="alertTicket" data-id="'+a.id+'">'+d.btn[0]+'</button>') : '';
  const ack = a.st === 'Chưa xác nhận' || a.st === 'KT Hùng' ? '<button class="btn ghost block" data-a="alertAck" data-id="'+a.id+'">Xác nhận đã xem</button>' : '';
  return '<div class="card detail"><div class="row">'+lvChip(a.lv)+'<b class="dt">'+d.t+'</b></div><div class="mut sm" style="margin:4px 0 10px">'+d.s+'</div><div class="aibox"><div class="aih">'+ic('spark', 16)+'AI giải thích</div>'+d.ai+'</div>' +
    (main || ack ? '<div class="acts col">'+main+ack+'</div>' : '')+'</div>';
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
const FLOOR_NIGHT = [['B1',.04],['T1',.03],['Lửng',.02],['T2',.05],['T3',.81],['T4',.06],['T5',.04],['Tum',.02]];
function nightFlowChart(h){ return barChart({data:FLOOR_NIGHT.map(x => ({l:x[0],v:x[1],hi:x[0] === 'T3'})), h:h, max:1, yfmt:v => fmt(v,1), vfmt:v => fmt(v,2), color:'#B9C3CC', hiColor:'#D64545', label:'Lưu lượng ban đêm theo tầng'}); }
PAGES['nang-luong'] = {
  title:'Năng lượng & nước', en:'Energy & water', meta:() => t('Hôm nay 20/10/2026','Today 20/10/2026'),
  body(){
    const tabs = [['dien','Điện'],['nuoc','Nước'],['hoadon','Hóa đơn'],['xanh','Công trình xanh']].map(x => '<button class="'+(S.energyTab === x[0] ? 'on' : '')+'" data-a="enTab" data-v="'+x[0]+'">'+x[1]+'</button>').join('');
    let b = '';
    if (S.energyTab === 'dien'){
      const top = APTS.slice().sort((a, b) => b.kwh - a.kwh).slice(0, 6);
      const odd = [['cao','TĐ-SPA chạy 02:00–05:00','4,2 kWh (nền 0,6)'],['tb','Lộ đèn hầm B1-04','Bật ngoài lịch 3 đêm'],['tin','Căn 2C tăng 38%','So cùng kỳ, đã báo cư dân']];
      b = '<div class="en1"><div class="card">'+mk(1)+'<h3>Phụ tải hôm nay theo giờ (kW): thực tế và dự báo</h3>' +
        lineChart({ series:[{d:HOUR_F,c:'#B9C3CC',w:2},{d:HOUR_A,c:'#1B7F79',w:2.6,area:true}], min:0, max:150, yfmt:v => Math.round(v), xl:i => String(i*2).padStart(2,'0')+'h', xevery:1, label:'Phụ tải theo giờ' }) +
        '<div class="leg" style="margin-top:6px"><span><i style="background:#1B7F79"></i>Thực tế</span><span><i style="background:#B9C3CC"></i>Dự báo AI</span></div></div>' +
        '<div class="card"><h3>Căn hộ dùng điện nhiều nhất (kWh)</h3>'+hbars(top.map(x => ({l:'Căn '+x.id,v:x.kwh})), {fmt:v => fmt(v), color:'var(--navy)'})+'</div></div>' +
        '<div class="en2"><div class="card">'+mk(2)+'<h3>Tiêu thụ bất thường (AI)</h3>' +
        odd.map(r => '<div class="odd"><i class="'+r[0]+'"></i><div><b>'+r[1]+'</b><span>'+r[2]+'</span></div></div>').join('') + '</div>' +
        '<div class="card">'+mk(3)+'<h3>Lưu lượng ban đêm 1–4h (m³/h)</h3>'+nightFlowChart(170)+'</div>' +
        '<div class="card">'+mk(4)+'<h3>Cân bằng tổng – nhánh</h3><div class="bal"><span>Đồng hồ tổng</span><b>41,2 m³</b></div><div class="bal"><span>Tổng nhánh</span><b>38,9 m³</b></div><span class="dev">Lệch 5,6% ▲</span><div class="mut xs" style="margin-top:6px">Ngưỡng 5% · kiểm tra nhánh T3 (căn 3B)</div></div></div>';
    } else if (S.energyTab === 'nuoc'){
      b = '<div class="g2"><div class="card"><h3>Lưu lượng ban đêm 1–4h (m³/h)</h3>'+nightFlowChart(210)+'<p class="mut sm" style="margin-top:6px">Tầng 3 nổi bật giữa nền xám: lưu lượng liên tục 0,81 m³/h trong khi các tầng khác dưới 0,06.</p></div>' +
        '<div class="card"><h3>Cân bằng tổng – nhánh</h3><div class="col" style="gap:12px"><div class="row"><span class="grow mut">Đồng hồ tổng</span><b style="font-size:20px">41,2 m³</b></div><div class="row"><span class="grow mut">Tổng nhánh</span><b style="font-size:20px">38,9 m³</b></div><div class="row"><span class="grow mut">Lệch</span><span class="dev">5,6% ▲ vượt ngưỡng 5%</span></div><div class="warnbox">Gợi ý: kiểm tra đoạn ống nhánh tầng 3 (khu căn 3B), trùng vị trí cảnh báo rò rỉ lúc 02:31.</div></div></div></div>' +
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
/* Tọa độ theo sơ đồ slide 8 (khung 390 × 400) */
const DEVS = {
  'SH-01':{x:34,y:67,n:'Bơm sinh hoạt 01'},'SH-02':{x:88,y:67,n:'Bơm sinh hoạt 02'},'BTA-02':{x:34,y:99,n:'Bơm tăng áp 02',bad:'cao'},
  'MF':{x:180,y:72,n:'Máy phát'},'MBA':{x:305,y:72,n:'Trạm biến áp'},
  'QH-01':{x:75,y:209,n:'Quạt hầm 01'},'QH-02':{x:295,y:209,n:'Quạt hầm 02'},'CO':{x:199,y:182,n:'Cảm biến CO'},
  'TĐ':{x:55,y:369,n:'Tủ điện B2'},'EV-03':{x:315,y:365,n:'Sạc xe điện 03',bad:'cao'}
};
function floorMap(){
  const rm = (x, y, w, h, l) => '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#EEF1F4" stroke="#B9C3CC"/><text x="'+(x+6)+'" y="'+(y+14)+'" font-size="9" fill="#6B7785">'+l+'</text>';
  let s = '<rect x=".5" y=".5" width="389" height="399" fill="#fff" stroke="#9AA6B2"/>' +
    rm(8,8,125,110,'Trạm bơm')+rm(138,8,115,110,'Máy phát')+rm(258,8,124,110,'Trạm biến áp')+rm(8,122,374,183,'Hầm xe B2')+
    rm(8,310,125,82,'Phòng bảo vệ')+rm(138,310,125,82,'Rack trung tâm')+rm(267,310,115,82,'Sạc xe điện');
  Object.keys(DEVS).forEach(k => {
    const d = DEVS[k], bad = !!d.bad, sel = S.devSel === k;
    s += '<g data-a="devSel" data-id="'+k+'" style="cursor:pointer" role="button" aria-label="'+d.n+(bad ? ' – cần chú ý' : '')+'">' +
      (sel ? '<circle cx="'+d.x+'" cy="'+d.y+'" r="12.5" fill="none" stroke="#1B7F79" stroke-width="2.2"/>' : '') +
      '<circle cx="'+d.x+'" cy="'+d.y+'" r="8.5" fill="'+(bad ? '#E8833A' : '#B9C3CC')+'" stroke="#fff" stroke-width="1.5"/>' +
      '<text x="'+(d.x+15)+'" y="'+(d.y+3)+'" font-size="9" font-weight="'+(bad ? 700 : 400)+'" fill="#1A2330">'+k+'</text></g>';
  });
  return '<svg viewBox="0 0 390 400" width="100%" role="img" aria-label="Sơ đồ hầm B2">'+s+'</svg>';
}
PAGES['thiet-bi'] = {
  title:'Thiết bị & bảo trì', en:'Equipment & maintenance', meta:() => 'Tầng: Hầm B2 ▾',
  body(){
    const health = [['Bơm tăng áp 02',61,'cao','Khởi động 3× mức nền; kiểm tra van một chiều'],['Quạt cấp FAF-02',74,'tb','Chênh áp lọc tăng 40% trong 3 tuần'],['Bơm sinh hoạt 01',92,'ok','Bình thường · 2.140 giờ chạy'],['Bơm sinh hoạt 02',88,'ok','Bình thường · luân phiên tối nay'],['Máy phát',95,'ok','Lần chạy thử gần nhất 14/10']];
    const d = DEVS[S.devSel];
    const A01 = [22,24,21,23,25,20,19], A02 = [23,31,44,52,61,66,70];
    return '<div class="tbgrid"><div class="card">'+mk(1)+'<h3>Sơ đồ hầm B2 (chỉ thiết bị bất thường có màu)</h3>'+floorMap()+
      '<div class="note" style="margin-top:10px"><b>'+S.devSel+' · '+d.n+'</b> — '+(d.bad ? (S.devSel === 'BTA-02' ? 'Điểm sức khỏe 61/100, khởi động 70 lần/ngày.' : 'Mất kết nối OCPP từ 10:05.') : 'Hoạt động bình thường.')+'</div></div>' +
      '<div class="col" style="gap:16px"><div class="card">'+mk(2)+'<h3>Chỉ số sức khỏe thiết bị (0–100)</h3>'+health.map(h => '<div class="hl '+h[2]+'"><b class="nm">'+h[0]+'</b><div class="bar"><i style="width:'+h[1]+'%"></i></div><b class="sc">'+h[1]+'</b><div class="why">'+h[3]+'</div></div>').join('')+'</div>' +
      '<div class="tb2"><div class="card">'+mk(3)+'<h3>Lần khởi động/ngày</h3>'+barChart({data:['T2','T3','T4','T5','T6','T7','CN'].map((l, i) => ({l:l, vs:[A01[i], A02[i]]})), colors:['#B9C3CC','#E8833A'], w:240, h:180, yfmt:v => Math.round(v), labels:true, label:'Số lần khởi động bơm tăng áp 01 và 02'})+
      '<div class="leg"><span><i style="background:#B9C3CC"></i>BTA-01</span><span><i style="background:#E8833A"></i>BTA-02</span></div></div>' +
      '<div class="card sugg2">'+mk(4)+'<h3>Đề xuất bảo trì</h3><p class="what">Kiểm tra van một chiều bơm tăng áp 02 trong 7 ngày</p><p class="mut sm">Nếu bỏ qua: bơm chạy liên tục, nguy cơ cháy động cơ</p>' +
      (S.ticketMade ? '<div class="note" style="margin-top:10px;background:var(--green-t)"><b style="color:var(--green-d)">✓ Đã tạo phiếu #1047</b> · hạn 27/10 · giao KT Hùng. Mở <a href="#/vanhanh/viec">app vận hành → Việc của tôi</a>.</div>' : '<button class="btn primary block" style="margin-top:12px" data-a="mkTicket">Tạo phiếu việc</button>') + '</div></div></div></div>';
  }
};
ACT.devSel = d => { S.devSel = d.id; render(); };
ACT.mkTicket = () => { S.ticketMade = true; addTicket({id:1047,lv:'cao',title:'Kiểm tra van một chiều BTA-02',loc:'Trạm bơm B2',due:'hạn 27/10',st:'new'}); toast('Đã tạo phiếu #1047 · giao KT Hùng'); render(); };

/* ---------- An ninh & vào ra ---------- */
function secCard(){
  const q = S.sec, st = q.stage;
  if (st === 'idle') return '<div class="card">'+mk(1)+'<h3>Sự kiện camera AI</h3><div class="mut">Chưa có sự kiện. Camera AI đang giám sát 83 camera; mọi sự kiện sẽ được đối chiếu với nhật ký vào ra.</div></div>';
  const img = '<div class="camimg ev">'+personSvg(!q.reveal, 58, 74)+'<span class="box"></span><span class="lbl">NGƯỜI · 0,94</span><span class="ts">CAM-B2-17 · '+q.at+'</span><span class="ts r">phát hiện sau '+fmt(q.secs,1)+' s</span>' +
    '<button class="rv" data-a="secReveal" title="Ảnh làm mờ mặc định; mở xem được ghi nhật ký">'+ic('eye',13)+' '+(q.reveal ? 'Làm mờ lại' : 'Xem ảnh gốc')+'</button></div>';
  let body = '';
  if (st === 'detected' || st === 'accepted'){
    body = img + '<div class="row" style="margin-top:10px">'+lvChip('cao')+'<b class="dt">Có người ở khu kỹ thuật Z10 ngoài giờ</b></div>' +
      '<div class="mut sm" style="margin-top:4px">Không có lượt quét vào ra hợp lệ trong 10 phút trước</div>' +
      (st === 'accepted' ? '<div class="note" style="margin-top:10px"><b>'+q.owner+' ('+(q.ownerRole || 'Bảo vệ')+') đang xử lý</b> · nhận lúc 23:48</div>' : '') +
      (q.esc && st === 'detected' ? '<div class="warnbox" style="margin-top:10px">Không ai nhận sau 3 phút → <b>đã leo thang Trưởng BQL</b> (anh Dũng) qua app + SMS.</div>' : '') +
      '<div class="secacts">'+(st === 'detected' ? '<button class="btn primary" data-a="secCall">Gọi bảo vệ</button>' : '')+'<button class="btn" data-a="secVerify">Đã xác minh</button><button class="btn ghost" data-a="secFalse">Báo giả</button></div>';
  } else if (st === 'closed'){
    body = '<div class="row" style="margin-bottom:8px"><span class="chip ok">ĐÃ ĐÓNG</span><b class="dt">Khu kỹ thuật Z10 · 23:47</b></div><div class="note" style="background:var(--green-t)">Đã xác minh: nhân viên kỹ thuật trực (Hùng) · đóng lúc 23:52 · '+(q.owner || 'Tuấn')+' xử lý. Sự kiện đã đưa vào <a href="#/web/tro-ly">tóm tắt ca</a>.</div>';
  } else {
    body = '<div class="row" style="margin-bottom:8px"><span class="chip neutral">BÁO GIẢ</span><b class="dt">Khu kỹ thuật Z10 · 23:47</b></div><div class="note">Đã đánh dấu báo giả để hiệu chỉnh vùng phát hiện camera CAM-B2-17. Không tạo cảnh báo mới.</div>';
  }
  return '<div class="card">'+mk(1)+'<h3>Sự kiện camera AI</h3>'+body+'</div>';
}
PAGES['an-ninh'] = {
  title:'An ninh & vào ra', en:'Security & access', meta:() => 'Ca đêm · 23:47',
  body(){
    const R = S.rooftop, rt = R.hold;
    const log = [['18:02','Cư dân · 4B','Khuôn mặt','Sảnh thang B2 → tầng 4'],['18:05','Khách của 2C','QR mời','Sảnh T1 → tầng 2'],['18:07','30A-•••.12','Biển số','Barie vào hầm'],['18:31','NV nhà hàng','Khuôn mặt + ca','Cửa hậu cần B1'],['18:40','Không xác định','Thẻ','Cửa kỹ thuật Z10'],['19:15','Khách bar','Không định danh','Thang công cộng → tum']];
    const cell = v => '<span class="cell '+(v === '✕' ? 'x' : /^QR/.test(v) ? 'q' : v === 'G' ? 'g' : /^M/.test(v) ? 'm' : '')+'">'+v+'</span>';
    const mat = [['Cư dân','M','M','M*','T','G','✕'],['Khách cư dân','QR','QR','QR*','T','G','✕'],['Khách nhà hàng','T','G','✕','G','G','✕'],['BQL, kỹ thuật','M','M','M','M','M','M']];
    const cap = (n, v, m) => { const p = Math.round(v / m * 100), hi = p >= 90; return '<div class="cap"><div class="row"><b class="grow">'+n+'</b><b class="'+(hi ? 'hi' : '')+'">'+p+'%</b></div><div class="bar '+(hi ? 'warn' : 'teal')+'"><i style="width:'+p+'%"></i></div><div class="mut xs">'+v+' / '+m+' người</div></div>'; };
    return '<div class="an1">'+secCard()+
      '<div class="card">'+mk(2)+'<h3>Nhật ký vào ra</h3><table class="tbl log"><thead><tr><th>Giờ</th><th>Người</th><th>Cách xác thực</th><th>Điểm vào</th><th></th></tr></thead><tbody>'+log.map(l => { const bad = l[1] === 'Không xác định'; return '<tr><td>'+l[0]+'</td><td class="b">'+l[1]+'</td><td class="mut">'+l[2]+'</td><td>'+l[3]+'</td><td class="okc '+(bad ? 'no' : '')+'" title="'+(bad ? 'Không hợp lệ · cần xem' : 'Hợp lệ')+'">'+ic(bad ? 'x' : 'check', 15, 2.6)+'</td></tr>'; }).join('')+'</tbody></table><p class="mut xs" style="margin-top:8px">Không hiện ảnh khuôn mặt · biển số che một phần</p></div></div>' +
      '<div class="an2"><div class="card">'+mk(3)+'<h3>Ma trận quyền (rút gọn) · chỉnh trên phần mềm</h3><table class="tbl mat"><thead><tr><th></th><th>Z1 Sảnh</th><th>Z2 Hầm</th><th>Z3 Căn hộ</th><th>Z8 Nhà hàng</th><th>Z7 Rooftop</th><th>Z10 KT</th></tr></thead><tbody>'+mat.map(r => '<tr><td><b>'+r[0]+'</b></td>'+r.slice(1).map(v => '<td>'+cell(v)+'</td>').join('')+'</tr>').join('')+'</tbody></table><p class="mut xs" style="margin-top:8px">M: khuôn mặt · QR: mã mời · G: trong giờ · T: tự do · *: chỉ tầng được phép · ✕: không được vào</p>' +
      '<div class="param"><span>Giờ mở rooftop</span><input type="time" data-bind="rooftop.from" value="'+R.from+'"><span>đến</span><input type="time" data-bind="rooftop.to" value="'+(R.to === '24:00' ? '23:59' : R.to)+'"><button class="btn primary sm" data-a="rooftopSave">Áp dụng</button><span class="mut xs">Đồng bộ xuống vào ra và thang máy, có nhật ký</span></div></div>' +
      '<div class="card">'+mk(4)+'<h3>Sức chứa theo khu</h3>'+cap('Rooftop', 108, 120)+cap('Nhà hàng B1', 86, 150) +
      '<p class="capnote">Rooftop ≥ 90%: đã báo quầy bar, '+(rt ? 'tạm dừng cho thang lên tum' : 'thang lên tum đã được mở lại thủ công')+'</p><button class="lnk" data-a="rooftopHold">'+(rt ? 'Mở lại thang lên tum' : 'Tạm dừng thang lên tum')+'</button></div></div>';
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
function shiftSections(){
  const leak = S.valve === 'closed' ? 'Rò rỉ tầng 3 (đã đóng van 02:41)' : S.valve === 'rejected' ? 'Rò rỉ tầng 3 (BQL từ chối đóng van, đang xử lý thủ công)' : 'Rò rỉ tầng 3 (chưa xử lý)';
  const sec = { closed:'người ở khu kỹ thuật (đã xác minh: KT trực)', 'false':'người ở khu kỹ thuật (báo giả, đã đánh dấu hiệu chỉnh)', accepted:'người ở khu kỹ thuật ('+(S.sec.owner || 'Tuấn')+' đang xử lý)', detected:'người ở khu kỹ thuật (chưa ai nhận)', idle:'không có sự kiện an ninh' }[S.sec.stage];
  return [
    ['3 sự kiện', leak+'; trạm sạc 03 mất kết nối; '+sec],
    ['2 việc tồn', 'Phiếu #1043 vệ sinh lọc FAF-02; kiểm tra van một chiều bơm tăng áp 02'+(S.ticketMade ? ' (phiếu #1047)' : '')],
    ['Lưu ý ca ngày', 'Thợ sửa ống căn 3B cần QR vào khu kỹ thuật từ 08:30'],
    ['Số liệu', 'Điện đêm 412 kWh (dự báo 405); nước đêm bình thường trừ tầng 3']
  ];
}
function shiftSummary(){
  return '<b>Tóm tắt ca đêm 19–20/10 (AI soạn)</b><table style="margin-top:8px"><tbody>'+shiftSections().map(r => '<tr><th>'+r[0]+'</th><td>'+r[1]+'</td></tr>').join('')+'</tbody></table>Xác nhận bàn giao ở khung bên phải.';
}
function answer(q){
  const s = q.toLowerCase();
  if (/hóa đơn|thanh toán|tiền điện|nhiều nhất|căn nào/.test(s) && S.role === 'Bảo vệ')
    return { h:'Vai trò <b>Bảo vệ</b> không có quyền xem dữ liệu hóa đơn và tiêu thụ theo căn hộ. Mình có thể trả lời về cảnh báo an ninh, vào ra và tóm tắt ca.', src:'Phân quyền theo vai trò · không truy vấn dữ liệu' };
  if (/bơm/.test(s)) return { h:'<b>Có 1 bơm cần chú ý:</b><br><b>Bơm tăng áp 02 (B2)</b> khởi động 70 lần hôm qua, gấp 3 lần mức bình thường, nhiều khả năng do van một chiều. '+(S.ticketMade ? 'Đã có phiếu việc #1047.' : 'Đã có đề xuất bảo trì, chưa có phiếu việc.')+'<br>Các bơm còn lại hoạt động bình thường.', src:'BMS Azbil · BTA-02 RUN, START_COUNT · cập nhật 10:15' };
  if (/điện|căn/.test(s)) return { h:'<b>Ba căn dùng nhiều nhất tháng 10 (đến 19/10):</b><table><tr><th>Căn</th><th>kWh</th><th>So T9</th></tr><tr><td><b>5A</b></td><td>1.284</td><td>+4%</td></tr><tr><td><b>4B</b></td><td>1.190</td><td>−2%</td></tr><tr><td><b>3C</b></td><td>1.105</td><td>+11%</td></tr></table>Căn 3C tăng 11% chủ yếu từ 22:00–02:00. Xem chi tiết ở <a href="#/web/nang-luong">trang Năng lượng</a>.', src:'đồng hồ PM-CH-3C, PM-CH-4B, PM-CH-5A · cập nhật 10:15' };
  if (/tóm tắt|ca đêm|giao ca/.test(s)) return { h:shiftSummary(), src:'Nhật ký cảnh báo, phiếu việc, historian · soạn lúc 06:00' };
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
  title:'Trợ lý AI', en:'AI assistant',
  meta:() => 'Mô hình: <select class="msel" data-c="model" aria-label="Mô hình"><option '+(S.model === 'Claude' ? 'selected' : '')+'>Claude</option><option '+(S.model === 'Gemini' ? 'selected' : '')+'>Gemini</option></select> · Chỉ đọc',
  body(){
    seedChat();
    const tbl = S.chat.findIndex(m => m.r === 'a' && m.h.indexOf('<table') > -1);
    const msgs = S.chat.map((m, i) => m.r === 'u' ? '<div class="msg u">'+esc(m.h)+'</div>'
      : '<div class="msg a">'+(i === tbl ? mk(2) : '')+'<span class="aic">'+ic('spark', 15)+'</span><div class="mb">'+m.h+'<div class="src">Nguồn: '+m.src+' · mô hình '+S.model+'</div></div></div>').join('') +
      (S.busy ? '<div class="msg a typing"><span></span><span></span><span></span></div>' : '');
    return '<div class="tlgrid"><div class="card chatc">'+mk(1) +
      '<div class="chat" data-sk="chat" data-scrollend>'+msgs+'</div>' +
      '<div class="sugg rel" style="margin:14px 0 10px">'+mk(3)+'<button data-a="ask" data-q="Tóm tắt ca đêm">Tóm tắt ca đêm</button><button data-a="ask" data-q="Cảnh báo tuần này">Cảnh báo tuần này</button><button data-a="ask" data-q="Lịch bảo trì tuần tới">Lịch bảo trì tuần tới</button></div>' +
      '<div class="askbox"><input id="askin" placeholder="Hỏi về thiết bị, cảnh báo, điện nước…" data-enter="askInput" autocomplete="off"><button class="send" data-a="askInput" aria-label="Gửi">'+ic('send', 17)+'</button></div></div>' +
      '<div class="card shiftc">'+mk(4)+'<h3>Tóm tắt ca đêm 19–20/10 (AI soạn)</h3>'+shiftSections().map(r => '<div class="ss"><b>'+r[0]+'</b><p>'+r[1]+'</p></div>').join('') +
      (S.handover ? '<div class="chip ok" style="margin-top:auto">Đã bàn giao · '+S.role+' xác nhận · lưu nhật ký vận hành</div>' : '<button class="btn primary block" style="margin-top:auto" data-a="handover">Xác nhận bàn giao ca</button>') + '</div></div>';
  }
};
ACT.model = (d, el) => { S.model = el.value; render(); };
function doAsk(q){
  if (!q.trim() || S.busy) return;
  S.chat.push({r:'u',h:q}); S.busy = true; render();
  setTimeout(() => { const a = answer(q); S.chat.push({r:'a',h:a.h,src:a.src}); S.busy = false; render(); }, 750);
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
