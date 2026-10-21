/* ===== Trang chủ, luồng K2 / K8, hệ thống thiết kế ===== */
VIEWS[''] = function(){
  const card = (ico, title, desc, items, to) => '<div class="pcard" data-a="go" data-to="'+to+'"><div class="ic">'+ic(ico, 24)+'</div><h3>'+title+'</h3><p>'+desc+'</p><ul>'+items.map(i => '<li>'+i+'</li>').join('')+'</ul><span class="btn primary" style="align-self:flex-start;margin-top:auto">Mở →</span></div>';
  const per = [
    ['Chủ đầu tư','“Tòa nhà vận hành tốt không, chi phí đang thế nào?”','Dashboard web → Tổng quan','CĐT','web/tong-quan'],
    ['Trưởng ban quản lý','“Việc gì cần tôi quyết định ngay?”','Web → Cảnh báo · duyệt lệnh AI','BQL','web/canh-bao'],
    ['Bảo vệ','“Có ai ở nơi không được phép không?”','Luồng K8 · An ninh & vào ra','Bảo vệ','k8'],
    ['Kỹ thuật','“Thiết bị nào sắp hỏng, tôi sửa gì trước?”','App vận hành → Phiếu việc','Kỹ thuật','vanhanh/viec'],
    ['Cư dân 16 căn hộ','“Khách tôi vào được chưa, tháng này hết bao nhiêu tiền?”','Luồng K2 · Mời khách · Hóa đơn','BQL','k2'],
    ['Khách thuê thương mại','“Nhân viên tôi vào đúng giờ, hóa đơn khu thuê?”','App cư dân (tài khoản doanh nghiệp)','BQL','cudan/hoadon']
  ];
  return '<div class="land"><div class="row"><span class="chip work">Dự thảo 20/10/2026 · Tài liệu kèm hồ sơ đề xuất giải pháp</span></div>' +
    '<h1 style="margin-top:12px">Tô Ngọc Vân Building · Smart Ops</h1><p class="lead">Prototype UX/UI tòa nhà thông minh tích hợp AI trên nền BMS. Ba sản phẩm dùng chung một nền tảng dữ liệu và phân quyền. Toàn bộ số liệu là dữ liệu minh họa, thao tác được ngay, không cần mạng.</p>' +
    '<h2>Ba sản phẩm (★ = có trong bộ prototype)</h2><div class="cards3">' +
    card('building','Web vận hành & dashboard','BQL, bảo vệ, kỹ thuật, CĐT · màn hình lớn',['Tổng quan (CĐT)','Trung tâm cảnh báo, duyệt lệnh AI','Năng lượng & nước','Thiết bị & bảo trì dự đoán','An ninh & vào ra','Trợ lý AI tiếng Việt'],'web/tong-quan') +
    card('user','App cư dân','Cư dân, khách thuê · iOS, Android, song ngữ',['Trang chủ','Mời khách bằng QR','Thông báo khách đến','Hóa đơn điện, nước, sạc xe','Đăng ký khuôn mặt (đồng ý)'],'cudan/home') +
    card('shield','App vận hành','BQL, bảo vệ, kỹ thuật · điện thoại',['Cảnh báo kèm hình','Duyệt lệnh AI đề xuất','Phiếu công việc, quét QR thiết bị'],'vanhanh/canh-bao') + '</div>' +
    '<h2>Hai luồng xuyên suốt nhiều màn hình</h2><div class="cards2">' +
    '<div class="pcard flow" data-a="go" data-to="k2"><div class="ic">'+ic('qr', 24)+'</div><div class="grow"><h3>K2 · Khách của cư dân</h3><p>Mời khách → QR → quét tại sảnh → ảnh khách → thang chỉ mở tầng 4 → mã tự hết hạn. Có ngoại lệ.</p></div><span class="btn primary">Chạy →</span></div>' +
    '<div class="pcard flow" data-a="go" data-to="k8"><div class="ic">'+ic('camera', 24)+'</div><div class="grow"><h3>K8 · Người lạ, đi sai khu</h3><p>Camera AI → đối chiếu vào ra → cảnh báo ≤ 10 giây → bảo vệ nhận → xác minh → tóm tắt ca.</p></div><span class="btn primary">Chạy →</span></div></div>' +
    '<h2>Sáu nhóm người dùng, mỗi nhóm một câu hỏi cần trả lời trong 10 giây</h2><div class="persona">' +
    per.map(p => '<div class="p" data-a="persona" data-to="'+p[4]+'" data-role="'+p[3]+'"><b>'+p[0]+'</b><i>'+p[1]+'</i><span>'+p[2]+' →</span></div>').join('') + '</div>' +
    '<h2>Gợi ý trình tự demo (khoảng 10 phút)</h2><div class="card"><ol style="margin-left:20px;line-height:2;color:var(--ink2)">' +
    '<li><a href="#/web/tong-quan">Tổng quan CĐT</a>: 5 chỉ số, dự báo AI, hiệu quả AI (bấm “Ghi chú UX” để nói best practice).</li>' +
    '<li><a href="#/web/canh-bao">Trung tâm cảnh báo</a>: rò rỉ 02:31 → AI giải thích → <b>Phê duyệt đóng van</b>.</li>' +
    '<li><a href="#/k8">Luồng K8</a>: bấm “Mô phỏng”, bảo vệ nhận trên app, xác minh, rồi xem tóm tắt ca ở Trợ lý AI.</li>' +
    '<li><a href="#/k2">Luồng K2</a>: cư dân mời khách, khách quét QR, thang mở tầng 4. Thử ngoại lệ chuông cửa / QR hết hạn.</li>' +
    '<li><a href="#/web/tro-ly">Trợ lý AI</a>: hỏi “Bơm nào đang có vấn đề?”. Đổi vai trò sang Bảo vệ rồi hỏi về điện từng căn để thấy từ chối theo quyền.</li>' +
    '<li><a href="#/cudan/khuonmat">Đăng ký khuôn mặt</a> và <a href="#/design">hệ thống thiết kế</a>.</li></ol></div>' +
    '<p class="sub-foot">Tài liệu tham chiếu: Gimasys_Prototype_UXUI_TNV.pptx · Hồ sơ đề xuất giải pháp TNTM AI (dự thảo 0.1). Mọi tên, số liệu, mã thiết bị trong bản này là minh họa.</p></div>';
};
ACT.persona = d => { S.role = d.role; S.ops.user = { 'Bảo vệ':'baove', 'Kỹ thuật':'kythuat', 'BQL':'bql' }[d.role] || S.ops.user; go(d.to); };

/* ---------- K2 ---------- */
function k2Reset(){
  S.res.invite = null; S.res.screen = 'moi'; S.res.push = null; S.res.sheet = null; S.res.err = null;
  S.res.form = { name:'Nguyễn Lan', phone:'0912 345 678', day:'0', slot:'15:00 – 18:00', car:true, bike:false, plate:'30G-123.45' };
  S.k2 = { reader:null, bell:null, log:[], init:true };
}
function stepBar(steps){
  const firstOpen = steps.findIndex(s => !s[2]);
  return '<div class="stepbar">'+steps.map((s, i) => '<div class="step '+(s[2] ? 'done' : i === firstOpen ? 'cur' : '')+'"><span class="num">'+(i+1)+'</span><b>'+s[0]+'</b><span>'+s[1]+'</span></div>').join('')+'</div>';
}
VIEWS.k2 = function(){
  if (!S.k2.init) k2Reset();
  const iv = S.res.invite, k = S.k2;
  const off = iv && (iv.expired || iv.cancelled);
  const steps = [['Cư dân tạo lời mời','App cư dân',!!iv],['Khách nhận QR','Zalo / SMS',!!(iv && iv.sent)],['Quét QR tại sảnh','Đầu đọc sảnh T1',!!(iv && iv.scanned)],['Cư dân nhận ảnh khách','App cư dân',!!(iv && iv.scanned)],['Thang chỉ mở tầng 4','Thang máy',!!(iv && iv.scanned)],['Mã tự hết hạn','Nền tảng',!!off]];
  const canScan = iv && iv.sent && !iv.scanned && !off;
  const reader = k.reader === 'ok' ? '<div class="note" style="background:var(--green-t)"><b style="color:var(--green-d)">✓ Mời vào</b> · Nguyễn Lan · mở cửa sảnh T1, thang chỉ tới tầng 4'+(iv && (iv.car || iv.bike) ? ' / hầm B2' : '')+'</div>'
    : k.reader === 'denied' ? '<div class="redbox"><b style="color:var(--red-d)">✕ QR đã hết hạn</b><br>Màn hình đầu đọc: “Vui lòng liên hệ lễ tân”. Cửa không mở.</div>'
    : k.bell === 'opened' ? '<div class="note" style="background:var(--green-t)"><b style="color:var(--green-d)">✓ Cư dân mở cửa từ xa</b> sau khi xem hình khách qua chuông IP.</div>'
    : k.bell === 'rejected' ? '<div class="warnbox">Cư dân từ chối mở cửa. Khách được hướng dẫn liên hệ lễ tân.</div>'
    : k.bell === 'ringing' ? '<div class="warnbox"><b>🔔 Khách bấm chuông sảnh</b> · đang gọi tới màn hình căn 4B (xem điện thoại bên trái).</div>'
    : '<div class="mut">Đang chờ khách tới sảnh T1…</div>';
  const zalo = iv && iv.sent ? '<div class="zalo"><b>'+(iv.sent === 'Zalo' ? 'Zalo' : 'SMS')+' · từ căn 4B</b><br>Anh/chị được mời tới Tô Ngọc Vân Building, hiệu lực '+iv.slot+' hôm nay.<div style="margin-top:8px;display:grid;place-items:center">'+qrSvg(iv.id + iv.name + iv.slot, 110)+'</div></div>' : '<div class="mut">Chưa có tin nhắn. Bấm “Gửi qua Zalo” trên app cư dân.</div>';
  const floors = [5,4,3,2,1].map(f => '<div class="'+(iv && iv.scanned && !off && f === 4 ? 'on' : '')+'">'+f+'</div>').join('');
  return '<div class="flowwrap"><div class="row"><div class="grow"><h1 style="font-size:22px;color:var(--navy)">K2 · Khách của cư dân</h1><div class="mut sm">Thao tác thật trên điện thoại bên trái; các thiết bị hiện trường bên phải là mô phỏng.</div></div><button class="btn ghost" data-a="k2Reset">↺ Làm lại luồng</button></div>' +
    stepBar(steps) + '<div class="flowgrid">'+resPhone()+'<div class="sitepanel">' +
    '<div class="g2e"><div class="card"><h3>1 · Khách nhận mã</h3>'+zalo+'</div><div class="card"><h3>2 · Đầu đọc sảnh T1</h3>'+reader+'<div class="col" style="margin-top:12px">' +
      '<button class="btn primary" data-a="k2Scan" '+(canScan ? '' : 'disabled')+'>'+ic('scan', 16)+' Khách quét QR tại sảnh</button>' +
      '<button class="btn" data-a="k2Bell" '+(k.bell === 'ringing' || (iv && iv.scanned) ? 'disabled' : '')+'>Ngoại lệ: không có lời mời, khách bấm chuông</button>' +
      '<button class="btn" data-a="k2ScanOld" '+(off ? '' : 'disabled')+'>Ngoại lệ: khách quét QR đã hết hạn</button></div></div></div>' +
    '<div class="g2e"><div class="card"><h3>3 · Thang máy</h3><div class="row" style="align-items:flex-end"><div class="elev">'+floors+'</div><div class="mut sm" style="padding-left:6px">'+(iv && iv.scanned && !off ? 'Chỉ cho phép tầng 4 (khách mời căn 4B).' : off && iv && iv.scanned ? 'Quyền tạm đã bị thu hồi.' : 'Chưa cấp quyền tầng.')+'</div></div></div>' +
    '<div class="card"><h3>4 · Thời gian</h3><div class="mut sm" style="margin-bottom:10px">Khung giờ '+(iv ? iv.slot : '15:00 – 18:00')+'. Hết khung giờ, mã tự hết hạn và thu hồi quyền.</div><button class="btn" data-a="k2Expire" '+(iv && !off ? '' : 'disabled')+'>Tua tới 18:00: mã hết hạn</button></div></div>' +
    '<div class="card"><h3>Nhật ký nền tảng</h3>'+logHtml(S.k2.log)+'</div></div></div></div>';
};
ACT.k2Reset = () => { k2Reset(); render(); };
ACT.k2Scan = () => {
  const i = S.res.invite; i.scanned = true; i.at = '15:04'; S.k2.reader = 'ok'; S.k2.bell = null;
  logEvt(S.k2.log, '15:04', 'Đầu đọc sảnh T1', 'quét QR hợp lệ → mở cửa sảnh');
  logEvt(S.k2.log, '15:04', 'Nền tảng', 'đẩy quyền tạm xuống thang máy: chỉ tầng 4'+(i.car || i.bike ? ', hầm B2' : ''));
  logEvt(S.k2.log, '15:04', 'Nền tảng', 'gửi thông báo + ảnh khách tới app căn 4B');
  S.res.sheet = null; S.res.screen = 'den'; S.res.push = { title:'Khách '+i.name+' đã đến', text:'Quét QR tại sảnh T1 lúc 15:04 · thang đã mở tới tầng 4', to:'den' };
  render();
};
ACT.k2Bell = () => {
  S.k2.bell = 'ringing'; S.k2.reader = null; logEvt(S.k2.log, '15:06', 'Chuông sảnh', 'khách không có lời mời bấm chuông → gọi màn hình căn 4B');
  S.res.sheet = 'bell'; S.res.screen = 'home'; S.res.push = null; render();
};
ACT.k2ScanOld = () => { S.k2.reader = 'denied'; S.k2.bell = null; logEvt(S.k2.log, '18:12', 'Đầu đọc sảnh T1', 'QR hết hạn → từ chối, hướng dẫn liên hệ lễ tân'); render(); };
ACT.k2Expire = () => { const i = S.res.invite; i.expired = true; logEvt(S.k2.log, '18:00', 'Nền tảng', 'hết khung giờ → thu hồi QR '+i.id+' và quyền tạm thang máy'); S.res.screen = 'qr'; render(); };
ACT.resBellOpen = () => { S.k2.bell = 'opened'; S.res.sheet = null; logEvt(S.k2.log, '15:06', 'Cư dân 4B', 'mở cửa sảnh từ xa (ghi nhật ký)'); render(); };
ACT.resBellNo = () => { S.k2.bell = 'rejected'; S.res.sheet = null; logEvt(S.k2.log, '15:06', 'Cư dân 4B', 'từ chối mở cửa'); render(); };

/* ---------- K8 ---------- */
function k8Reset(){ S.sec = { stage:'idle', owner:null, at:'23:47:12', secs:7.9, live:false, reveal:false, esc:false }; S.k8 = { log:[], init:true }; S.ops.screen = 'canh-bao'; S.ops.sheet = null; S.ops.user = 'baove'; }
VIEWS.k8 = function(){
  if (!S.k8.init) k8Reset();
  const st = S.sec.stage, started = st !== 'idle', owned = st === 'accepted' || st === 'closed' || st === 'false', done = st === 'closed' || st === 'false';
  const steps = [['Camera AI phát hiện','Máy chủ AI tại chỗ',started],['Đối chiếu nhật ký vào ra','Nền tảng',started],['Cảnh báo kèm hình ≤ 10 s','Trung tâm cảnh báo',started],['Bảo vệ nhận xử lý','App vận hành',owned],['Xác minh, đóng sự kiện','App vận hành',done],['Vào tóm tắt ca','Trợ lý AI',done]];
  return '<div class="flowwrap"><div class="row"><div class="grow"><h1 style="font-size:22px;color:var(--navy)">K8 · Người lạ, đi sai khu</h1><div class="mut sm">Bên trái: màn hình web phòng bảo vệ B2. Bên phải: app vận hành của bảo vệ Tuấn. Hai bên dùng chung một sự kiện.</div></div><button class="btn ghost" data-a="k8Reset">↺ Làm lại luồng</button></div>' +
    stepBar(steps) + '<div class="flowgrid k8"><div class="sitepanel">' +
    '<div class="card"><h3>Điều khiển mô phỏng</h3><div class="row" style="flex-wrap:wrap"><button class="btn primary" data-a="k8Start" '+(started ? 'disabled' : '')+'>'+ic('play', 14)+' Camera AI phát hiện người ở Z10 (23:47)</button><button class="btn" data-a="k8Esc" '+(st === 'detected' && !S.sec.esc ? '' : 'disabled')+'>Ngoại lệ: 3 phút không ai nhận</button><a class="btn" href="#/web/tro-ly" '+(done ? '' : 'style="opacity:.45;pointer-events:none"')+'>Xem tóm tắt ca →</a></div></div>' +
    secCard() +
    '<div class="card"><h3>Nhật ký nền tảng</h3>'+logHtml(S.k8.log)+'</div></div>'+opsPhone()+'</div></div>';
};
ACT.k8Reset = () => { k8Reset(); render(); };
ACT.k8Start = () => {
  S.sec = { stage:'detected', owner:null, at:'23:47:12', secs:7.9, live:false, reveal:false, esc:false }; S.ops.screen = 'canh-bao';
  logEvt(S.k8.log, '23:47:12', 'CAM-B2-17', 'phát hiện NGƯỜI (0,94) tại khu kỹ thuật Z10');
  logEvt(S.k8.log, '23:47:13', 'Nền tảng', 'đối chiếu nhật ký vào ra: không có lượt quét hợp lệ trong 10 phút → bất thường');
  logEvt(S.k8.log, '23:47:20', 'Trung tâm cảnh báo', 'đẩy cảnh báo kèm hình tới màn hình B2 và app Tuấn, Hùng (7,9 giây)');
  render();
};
ACT.k8Esc = () => { S.sec.esc = true; logEvt(S.k8.log, '23:50', 'Nền tảng', 'không ai nhận sau 3 phút → leo thang Trưởng BQL qua app + SMS'); toast('Đã leo thang Trưởng BQL'); render(); };

/* ---------- Hệ thống thiết kế ---------- */
VIEWS.design = function(){
  const sw = (c, n, u) => '<div class="s"><div class="swatch" style="background:'+c+';border:1px solid var(--line)"></div><b>'+n+'</b><span>'+c+' · '+u+'</span></div>';
  const lv = (c, n, u) => '<div class="s"><div class="swatch" style="background:'+c+'"></div><b>'+n+'</b><span>'+u+'</span></div>';
  return '<div class="land"><h1>Hệ thống thiết kế: màu chỉ dành cho bất thường</h1><p class="lead">Theo ISA-101 (giao diện vận hành hiệu năng cao) và ISA-18.2 (quản lý cảnh báo); độ tương phản theo WCAG 2.1 AA. Font: Arial.</p>' +
    '<h2>Màu nền và thương hiệu</h2><div class="sw4">'+sw('#12324A','Navy','Điều hướng, tiêu đề')+sw('#1B7F79','Teal','Hành động chính')+sw('#F5F7F9','Xám nền','Nền làm việc')+sw('#6B7785','Xám chữ','Chữ phụ, nhãn')+sw('#D5DCE3','Đường kẻ','Viền, phân tách')+'</div>' +
    '<h2>Mức cảnh báo (chỉ dùng khi có bất thường)</h2><div class="sw4">'+lv('#D64545','Khẩn','Xử lý ngay · âm thanh')+lv('#E8833A','Cao','≤ 30 phút')+lv('#D9A21B','Trung bình','Trong ca')+lv('#3B82C4','Thông tin','Không cần xử lý')+lv('#2E9E5B','Bình thường','Chỉ dùng để xác nhận')+'</div>' +
    '<h2>Thành phần dùng chung</h2><div class="card"><div class="row" style="flex-wrap:wrap;gap:12px"><button class="btn primary">Phê duyệt</button><button class="btn">Từ chối</button>'+lvChip('khan')+lvChip('cao')+lvChip('tb')+lvChip('tin')+'<span class="chip work">ĐANG XỬ LÝ</span><div class="kpi" style="min-width:210px"><div class="l">Điện năng tháng</div><div class="v">48,2<small>MWh</small></div><div class="d">▼ 6% so dự báo</div></div></div></div>' +
    '<h2>Năm nguyên tắc UX</h2><div class="cards3">' +
    [['Xám trước, màu sau','Màn hình bình thường gần như xám; mắt người trực sẽ bắt ngay điểm có màu'],['Không chỉ dựa vào màu','Mức cảnh báo luôn có chữ và vị trí, người mù màu vẫn đọc được'],['AI đề xuất, người quyết','Mọi lệnh điều khiển hiện lý do, dữ liệu căn cứ và nút duyệt'],['Riêng tư theo thiết kế','Ảnh khuôn mặt làm mờ mặc định, chỉ vai trò được phép mới xem'],['Ưu tiên một tay trên điện thoại','Nút chính trong vùng ngón cái, cỡ chữ thân tối thiểu 16px']].map((p, i) => '<div class="card"><div class="bp" style="margin:0"><div class="n">'+(i+1)+'</div><div><b>'+p[0]+'</b><span>'+p[1]+'</span></div></div></div>').join('')+'</div></div>';
};
