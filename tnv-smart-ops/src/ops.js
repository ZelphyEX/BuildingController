/* ===== App vận hành (slide 13) ===== */
const OPS_SCREENS = [['canh-bao','Cảnh báo kèm hình','Kịch bản K8 · bảo vệ Tuấn'],['duyet','Duyệt lệnh AI','Có căn cứ, giới hạn, hết hạn 10 phút'],['viec','Phiếu công việc','Việc của tôi · quét QR thiết bị']];
const OPS_NOTES = [
  ['Một người nhận, mọi người biết','Nút “Tôi nhận xử lý” tránh hai người cùng đi hoặc không ai đi'],
  ['Duyệt có thời hạn và giới hạn','Đề xuất hết hạn nếu không duyệt; dải giá trị và thiết bị bị loại trừ hiển thị rõ'],
  ['QR thiết bị nối hiện trường với dữ liệu','Kỹ thuật quét mã trên bơm, quạt để xem lịch sử, không phải tìm trên máy tính']
];
const LVORD = { khan:0, cao:1, tb:2, tin:3 };

/* Đăng nhập theo ca: mỗi vai trò thấy tab và quyền khác nhau (cùng quy tắc với web: duyệt lệnh dành cho BQL / Kỹ thuật) */
const OPS_USERS = {
  baove:   { name:'Tuấn', role:'Bảo vệ',     shift:'Ca đêm',     tabs:['canh-bao','viec'],         approve:false, photo:true  },
  kythuat: { name:'Hùng', role:'Kỹ thuật',   shift:'Ca đêm',     tabs:['canh-bao','duyet','viec'], approve:true,  photo:false },
  bql:     { name:'Dũng', role:'Trưởng BQL', shift:'Hành chính', tabs:['canh-bao','duyet','viec'], approve:true,  photo:true  }
};
function opsUser(){ return OPS_USERS[S.ops.user]; }
function opsWho(){ const u = opsUser(); return u.name + ' (' + u.role + ')'; }
function opsTickets(){ return S.ops.user === 'baove' ? [] : S.ops.tickets; }   // phiếu giao cho kỹ thuật; bảo vệ không có phiếu riêng
function opsFanLive(){ const a = S.ops.ai; return a.st === 'pending' && Date.now() <= a.deadline; }
function opsPending(){ return (S.valve === 'open' ? 1 : 0) + (opsFanLive() ? 1 : 0); }
/* phiếu đã gắn với cảnh báo (cùng mã với web) */
function alertTicketId(a){ const id = { 1:1044, 2:1047, 3:1031, 4:1043 }[a.id]; return id && S.ops.tickets.some(x => x.id === id) ? id : null; }

function opsNav(screen){ S.ops.sheet = null; if (route().v === 'vanhanh') go('vanhanh/' + screen); else { S.ops.screen = screen; render(); } }
function oHead(title, sub){
  const u = opsUser();
  return '<div style="margin-bottom:10px"><div class="ah" style="margin-bottom:2px"><div class="grow"><h2>'+title+'</h2></div><button class="uchip" data-a="opsSheet" data-v="user" aria-label="Đổi người dùng">'+u.name+' · '+u.role+' ▾</button></div>' +
    (sub ? '<div class="mut sm">'+sub+'</div>' : '') + '</div>';
}
function checks(list){ return list.map(x => '<div class="row" style="align-items:flex-start;margin:4px 0"><span style="color:var(--teal)">'+ic('check', 18)+'</span>'+x+'</div>').join(''); }

function opsAlertScreen(){
  const q = S.sec, st = q.stage, me = opsUser(), by = ' data-by="ops"';
  let card = '';
  if (st === 'idle'){
    card = '<div class="acard" style="text-align:center;padding:26px 14px"><div style="color:var(--green);display:grid;place-items:center;margin-bottom:8px">'+ic('check', 36)+'</div><b>Không có cảnh báo an ninh đang mở</b><div class="mut sm" style="margin-top:4px">Camera AI đang giám sát. Cảnh báo mới sẽ hiện ở đây kèm hình.</div></div>';
  } else if (st === 'detected' || st === 'accepted'){
    const photo = me.photo
      ? '<button class="btn ghost sm" data-a="secReveal"'+by+'>'+ic('eye', 14)+' '+(q.reveal ? 'Làm mờ' : 'Xem ảnh')+'</button>'
      : '<span class="mut xs">Vai trò '+me.role+' xem ảnh làm mờ; ảnh gốc dành cho Bảo vệ, Trưởng BQL</span>';
    const actions = '<div class="row2" style="margin-top:10px"><button class="abtn" style="margin:0" data-a="opsLive">Xem trực tiếp</button><button class="abtn ghost" style="margin:0" data-a="secFalse"'+by+'>Báo giả</button></div>';
    card = '<div class="acard" style="border:2px solid var(--orange)"><div class="row" style="margin-bottom:6px">'+lvChip('cao')+'<b style="color:var(--navy)">Khu kỹ thuật Z10 · 23:47</b></div>' +
      '<div class="b" style="font-size:18px;line-height:1.35">Có người ngoài giờ, không có lượt quét hợp lệ</div>' +
      '<div class="camimg" style="margin-top:10px;height:130px"><span class="ts">CAM-B2-17 · '+q.at+'</span><div style="margin-top:12px">'+personSvg(!q.reveal, 60, 80)+'</div><span class="box" style="left:42%;top:24%;width:19%;height:64%"></span></div>' +
      '<div class="mut sm" style="margin-top:6px">Camera CAM-B2-17 · cạnh tủ rack trung tâm</div><div class="row" style="margin-top:6px">'+photo+'</div>' +
      (st === 'detected'
        ? '<div style="margin-top:12px"><button class="abtn primary" data-a="secAccept">Tôi nhận xử lý</button>'+actions+'</div>'
        : '<div class="note" style="margin-top:12px"><b>'+q.owner+' đã nhận xử lý</b> lúc 23:48. Người khác trong ca thấy trạng thái này.</div><div style="margin-top:10px"><button class="abtn primary" data-a="secVerify"'+by+'>Đã xác minh, đóng sự kiện</button>'+actions+'</div>') +
      '<div class="mut sm" style="margin-top:10px">'+(st === 'accepted' ? 'Đã gửi: Tuấn (bảo vệ), Hùng (KT) · '+q.owner+' đã nhận' : q.esc ? 'Không ai nhận sau 3 phút → <b>đã leo thang Trưởng BQL (anh Dũng)</b>' : 'Đã gửi: Tuấn (bảo vệ), Hùng (KT) · chưa ai nhận')+'</div></div>';
  } else if (st === 'closed'){
    card = '<div class="acard" style="background:var(--green-t);border-color:#bfe3cc"><div class="row"><span class="chip ok">ĐÃ ĐÓNG</span><b>Khu kỹ thuật Z10 · 23:47</b></div><p style="margin-top:8px">Đã xác minh: nhân viên kỹ thuật trực. Sự kiện được đưa vào tóm tắt ca.</p></div>';
  } else {
    card = '<div class="acard"><div class="row"><span class="chip neutral">BÁO GIẢ</span><b>Khu kỹ thuật Z10 · 23:47</b></div><p style="margin-top:8px">Đã đánh dấu để hiệu chỉnh vùng phát hiện của CAM-B2-17.</p></div>';
  }
  const rows = S.alerts.map(a => '<div class="lrow" data-a="opsAlert" data-id="'+a.id+'" style="cursor:pointer">'+lvChip(a.lv)+'<div class="grow">'+shortDesc(a)+'<div class="mut xs">'+a.loc+' · '+a.time+' · '+(a.st === 'Chưa xác nhận' ? '<b style="color:var(--red-d)">'+a.st+'</b>' : a.st)+'</div></div>›</div>').join('');
  return '<div class="scroll" data-sk="ops">'+oHead('Cảnh báo','Màn hình ưu tiên một tay')+card+'<div class="acard" style="padding:12px 14px"><div class="mut sm" style="margin-bottom:2px">Cảnh báo trong ca ('+S.alerts.length+') · bấm để xem, nhận hoặc tạo phiếu</div>'+rows+'</div></div>';
}

function opsAiScreen(){
  const me = opsUser();
  if (!me.approve){
    return '<div class="scroll" data-sk="ops">'+oHead('Duyệt lệnh AI')+'<div class="acard" style="text-align:center;padding:26px 14px"><div style="color:var(--muted);display:grid;place-items:center;margin-bottom:8px">'+ic('lock', 34)+'</div><b>Chỉ Trưởng BQL hoặc Kỹ thuật được duyệt lệnh AI</b><div class="mut sm" style="margin:6px 0 14px">Vai trò '+me.role+' nhận và xử lý cảnh báo; lệnh điều khiển do người có thẩm quyền phê duyệt.</div><button class="abtn" data-a="opsSheet" data-v="user">Đổi người dùng</button></div></div>';
  }
  const a = S.ops.ai;
  const st = a.st === 'pending' && Date.now() > a.deadline ? 'expired' : a.st;
  const by = ' data-by="ops"';
  let cards = '';
  /* 1. Đề xuất đóng van rò rỉ (GĐ1, mục 5.1) – dùng chung trạng thái với web */
  if (S.valve === 'open'){
    const t = S.ops.tickets.some(x => x.id === 1044);
    cards += '<div class="acard" style="border:2px solid var(--red)"><div class="row">'+lvChip('khan')+'<span class="mut sm">AI đề xuất · rò rỉ nước · 02:31</span></div>' +
      '<div class="b" style="font-size:18px;color:var(--navy);margin:6px 0 10px;line-height:1.35">Đóng van điện từ V-T3-02 (khu căn 3B)</div><div class="b sm" style="margin-bottom:4px">Căn cứ</div>' +
      checks(['Cảm biến rò LS-T3-02 xác nhận rò rỉ','Lưu lượng gấp 14 lần mức nền ban đêm trong 30 phút','Không ảnh hưởng nước chữa cháy']) +
      '<div class="note" style="margin-top:10px"><b>Ghi có giới hạn · ưu tiên BACnet 12</b><br>Có nhật ký lệnh; van phản hồi trạng thái sau khi đóng</div>' +
      '<button class="abtn primary" style="margin-top:12px" data-a="valveOk"'+by+'>Phê duyệt đóng van</button>' +
      '<div class="row2" style="margin-top:10px"><button class="abtn danger" style="margin:0" data-a="valveNo"'+by+'>Từ chối</button>'+(t ? '<button class="abtn ghost" style="margin:0" disabled>Đã có phiếu #1044</button>' : '<button class="abtn" style="margin:0" data-a="alertTicket" data-id="1">Tạo phiếu</button>')+'</div>' +
      '<div class="mut sm" style="margin-top:10px;text-align:center">Cảnh báo Khẩn còn mở nên đề xuất không tự hết hạn</div></div>';
  }
  /* 2. Đề xuất thông gió hầm (mục 5.5, giai đoạn 2 – minh họa) */
  if (st === 'pending'){
    cards += '<div class="acard" style="border:2px solid var(--teal)"><div class="row"><span class="mut sm grow">AI đề xuất · thông gió hầm</span><span class="chip neutral">MINH HỌA GĐ2</span></div><div class="b" style="font-size:18px;color:var(--navy);margin:4px 0 10px;line-height:1.35">Bật quạt thông gió thường hầm B2 ở 40 Hz từ 06:45</div>' +
      '<div class="b sm" style="margin-bottom:4px">Căn cứ</div>'+checks(['CO hiện tại 18 ppm (ngưỡng 50)','Thứ Ba thường có 22 xe ra từ 07:00–07:30','Ước tính giữ CO dưới 35 ppm']) +
      '<div class="note" style="margin-top:10px"><b>Ghi có giới hạn · 20–50 Hz</b><br>Không áp dụng cho quạt sự cố SEAF/FAP</div>' +
      '<div class="row2" style="margin-top:12px"><button class="abtn primary" style="margin:0" data-a="aiOk">Phê duyệt</button><button class="abtn danger" style="margin:0" data-a="opsSheet" data-v="reject">Từ chối</button></div>' +
      '<div class="mut sm" style="margin-top:10px;text-align:center">Hết hạn sau <b data-cd="'+a.deadline+'">10:00</b> nếu không duyệt</div></div>';
  } else if (st === 'approved'){
    cards += '<div class="acard" style="background:var(--green-t);border-color:#bfe3cc"><div class="b" style="color:var(--green-d);font-size:18px">✓ Đã phê duyệt</div><p style="margin:6px 0">Bật quạt thường hầm B2 ở 40 Hz từ 06:45. Ghi vào BACnet ưu tiên 12; hết giờ cao điểm hệ thống tự trả quyền (relinquish) về BMS.</p><div class="mut sm">Nhật ký lệnh #L-2032 · 06:41 · '+esc(a.by || opsWho())+' duyệt</div></div>';
  } else if (st === 'rejected'){
    cards += '<div class="acard"><div class="b">Đã từ chối đề xuất thông gió</div><p class="mut" style="margin-top:4px">Lý do: '+esc(a.reason || '')+'. AI ghi nhận để hiệu chỉnh lần sau.</p><button class="abtn" style="margin-top:10px" data-a="aiAgain">Yêu cầu AI đề xuất lại</button></div>';
  } else {
    cards += '<div class="acard" style="background:#f0f2f4"><div class="b">Đề xuất thông gió đã hết hạn</div><p class="mut" style="margin:4px 0 10px">Không ai duyệt trong 10 phút nên lệnh không được gửi xuống BMS.</p><button class="abtn" data-a="aiAgain">Yêu cầu AI đề xuất lại</button></div>';
  }
  const hist = S.valve === 'closed'
    ? '<div class="lrow"><div class="i" style="background:var(--green-t);color:var(--green-d)">'+ic('check', 18)+'</div><div class="grow"><b>Đóng van V-T3-02</b><div class="mut xs">02:41 · '+esc(S.valveBy || 'BQL')+' duyệt</div></div></div>'
    : S.valve === 'rejected' ? '<div class="lrow"><div class="i">'+ic('x', 18)+'</div><div class="grow"><b>Từ chối đóng van V-T3-02</b><div class="mut xs">'+esc(S.valveBy || 'BQL')+' · cảnh báo vẫn mở, xử lý thủ công</div></div></div>' : '';
  const n = opsPending();
  return '<div class="scroll" data-sk="ops">'+oHead('Duyệt lệnh AI','Chờ duyệt ('+n+') · chế độ chỉ đề xuất')+cards+(hist ? '<div class="acard"><div class="mut sm">Đã xử lý</div>'+hist+'</div>' : '')+'</div>';
}

function opsTasksScreen(){
  const me = opsUser(), list = opsTickets();
  const tk = list.slice().sort((a, b) => (a.st === 'done') - (b.st === 'done') || LVORD[a.lv] - LVORD[b.lv]);
  const rows = tk.map(x => '<div class="lrow" data-a="opsTicket" data-id="'+x.id+'" style="cursor:pointer;'+(x.st === 'done' ? 'opacity:.5' : '')+'">'+lvChip(x.lv)+'<div class="grow"><b>#'+x.id+'</b> '+x.title+'<div class="mut sm">'+x.loc+' · '+(x.st === 'done' ? 'đã xong' : x.st === 'doing' && x.due !== 'đang làm' ? 'đang làm' : x.due)+'</div></div>›</div>').join('');
  const title = me.role === 'Trưởng BQL' ? 'Việc của đội' : 'Việc của tôi';
  const body = tk.length ? '<div class="acard" style="padding:4px 14px">'+rows+'</div>' : '<div class="acard" style="text-align:center;padding:22px 14px"><b>Chưa có phiếu giao cho bạn</b><div class="mut sm" style="margin-top:4px">Phiếu việc kỹ thuật hiện ở vai trò Kỹ thuật và Trưởng BQL. Bạn vẫn quét QR thiết bị để xem lịch sử.</div></div>';
  return '<div class="scroll" data-sk="ops">'+oHead(title, tk.filter(x => x.st !== 'done').length+' phiếu đang mở')+body +
    '<button class="abtn" data-a="opsSheet" data-v="scan">'+ic('scan', 22)+' Quét QR thiết bị</button><p class="mut sm" style="text-align:center;margin-top:8px">Quét mã trên thiết bị để mở lịch sử và phiếu liên quan</p></div>';
}

function opsSheet(){
  const k = S.ops.sheet; if (!k) return '';
  const wrap = h => '<div class="sheet" data-a="opsSheetClose" data-bg="1"><div>'+h+'</div></div>';
  const me = opsUser();
  if (k === 'user') return wrap('<h3>Đăng nhập theo ca</h3><p class="mut sm" style="margin-bottom:12px">Chọn người dùng để xem quyền của từng vai trò.</p>' +
    Object.keys(OPS_USERS).map(id => { const u = OPS_USERS[id]; return '<button class="urow '+(id === S.ops.user ? 'on' : '')+'" data-a="opsUser" data-u="'+id+'"><span class="av">'+u.name.charAt(0)+'</span><span class="grow"><b>'+u.name+' · '+u.role+'</b><br><span class="mut sm">'+u.shift+' · '+(u.approve ? 'nhận cảnh báo, duyệt lệnh AI' : 'nhận cảnh báo, không duyệt lệnh')+'</span></span>'+(id === S.ops.user ? ic('check', 22) : '')+'</button>'; }).join('') +
    '<p class="mut sm" style="margin:4px 0 12px">Bản thật: đăng nhập tài khoản được cấp, tự đổi theo ca.</p><button class="abtn ghost" data-a="opsSheetClose">Đóng</button>');
  if (k === 'alert'){
    const a = S.alerts.filter(x => x.id === S.ops.selAlert)[0]; if (!a) return '';
    const tid = alertTicketId(a);
    const ai = a.id === 1 ? 'Đồng hồ FM-T3-02 và cảm biến rò LS-T3-02 cùng báo bất thường; lưu lượng gấp 14 lần mức nền ban đêm.' : AI_DETAIL[a.id].ai;
    let b = '';
    if (a.st === 'Chưa xác nhận') b += '<button class="abtn primary" data-a="opsAlertAck" data-id="'+a.id+'">Tôi nhận xử lý</button>';
    else if (a.st === 'KT Hùng' && me.role === 'Kỹ thuật') b += '<button class="abtn primary" data-a="alertAck" data-id="'+a.id+'">Xác nhận đã xem</button>';
    if (a.id === 1 && S.valve === 'open') b += me.approve ? '<button class="abtn" data-a="opsAlertAi">Mở đề xuất của AI</button>' : '<div class="note" style="margin-top:10px">Đề xuất đóng van đang chờ Trưởng BQL hoặc Kỹ thuật duyệt.</div>';
    if (tid) b += '<button class="abtn" data-a="opsTicket" data-id="'+tid+'">Mở phiếu #'+tid+'</button>';
    else if (a.id === 1 || a.id === 2) b += '<button class="abtn" data-a="opsAlertTicket" data-id="'+a.id+'">Tạo phiếu việc</button>';
    return wrap('<div class="row" style="margin-bottom:6px">'+lvChip(a.lv)+'<span class="mut sm">'+a.loc+' · '+a.time+'</span></div><h3 style="font-size:19px;line-height:1.35">'+shortDesc(a)+'</h3><p style="margin-bottom:6px"><b>Trạng thái:</b> '+a.st+'</p><div class="note" style="margin-bottom:12px"><b>AI giải thích:</b> '+ai+'</div>'+b+'<button class="abtn ghost" data-a="opsSheetClose">Đóng</button>');
  }
  if (k === 'reject') return wrap('<h3>Lý do từ chối</h3>'+['CO thực tế thấp hơn dự báo','Đang có việc bảo trì quạt','Không phù hợp giờ này'].map(x => '<button class="abtn ghost" data-a="aiNo" data-r="'+x+'">'+x+'</button>').join(''));
  if (k === 'live') return wrap('<h3>CAM-B2-17 · trực tiếp</h3><div class="camimg" style="height:200px"><span class="ts"><span class="dot" style="background:var(--red);margin-right:5px;animation:bl 1s infinite"></span>LIVE '+S.sec.at.slice(0, 5)+'</span><div style="margin-top:20px">'+personSvg(!S.sec.reveal, 70, 90)+'</div></div><p class="mut sm" style="margin:10px 0">Hình làm mờ mặc định; chỉ vai trò được phép mới xem rõ.</p><button class="abtn ghost" data-a="opsSheetClose">Đóng</button>');
  if (k === 'scan') return wrap('<h3>Quét QR thiết bị</h3><div class="camimg" style="height:170px"><div style="width:110px;height:110px;border:3px solid var(--teal);border-radius:14px;display:grid;place-items:center;position:relative;overflow:hidden"><div style="opacity:.6">'+qrSvg('BTA-02', 80)+'</div></div></div><button class="abtn primary" style="margin-top:14px" data-a="opsScanOk">Giả lập: đã quét tem BTA-02</button><button class="abtn ghost" data-a="opsSheetClose">Hủy</button>');
  if (k === 'device') return wrap('<h3>Bơm tăng áp 02 · BTA-02</h3><div class="row" style="margin-bottom:10px">'+lvChip('cao')+'<span>Sức khỏe 61/100</span></div><div class="note" style="margin-bottom:10px">Khởi động 70 lần hôm qua (nền 23). Nghi van một chiều không kín.</div><b>Lịch sử gần đây</b>'+[['14/10','Chạy thử, bình thường'],['08/10','Thay gioăng bích đẩy'],['02/09','Bảo dưỡng định kỳ']].map(x => '<div class="lrow"><div class="grow">'+x[1]+'</div><span class="mut sm">'+x[0]+'</span></div>').join('')+'<div style="margin-top:8px"><b>Phiếu liên quan</b></div>'+(S.ticketMade ? '<div class="lrow" data-a="opsTicket" data-id="1047" style="cursor:pointer"><span class="chip cao">CAO</span><div class="grow"><b>#1047</b> Kiểm tra van một chiều</div>›</div>' : '<div class="mut" style="padding:8px 0">Chưa có phiếu liên quan.</div><button class="abtn primary" data-a="mkTicket">Tạo phiếu việc</button>')+'<button class="abtn ghost" style="margin-top:10px" data-a="opsSheetClose">Đóng</button>');
  if (k === 'ticket'){
    const x = S.ops.tickets.filter(t => t.id === S.ops.sel)[0]; if (!x) return '';
    const canWork = me.role === 'Kỹ thuật';
    const stTxt = { new:'Chưa nhận', doing:'Đang làm', wait:'Chờ nhà thầu', done:'Đã xong' }[x.st];
    const act = !canWork ? '<div class="note" style="margin-bottom:10px"><b>'+stTxt+'</b> · chỉ Kỹ thuật cập nhật tiến độ phiếu.</div>'
      : x.st === 'new' ? '<button class="abtn primary" data-a="opsTicketSt" data-v="doing">Nhận việc</button>' : x.st === 'doing' ? '<button class="abtn primary" data-a="opsTicketSt" data-v="done">Hoàn thành</button>' : x.st === 'wait' ? '<button class="abtn primary" data-a="opsTicketSt" data-v="doing">Bắt đầu làm</button>' : '<div class="chip ok">Đã xong</div>';
    return wrap('<div class="row" style="margin-bottom:6px">'+lvChip(x.lv)+'<b style="color:var(--navy)">#'+x.id+'</b></div><h3 style="font-size:19px">'+x.title+'</h3><p class="mut" style="margin-bottom:14px">'+x.loc+' · '+x.due+'</p>'+act+'<button class="abtn ghost" data-a="opsSheetClose">Đóng</button>');
  }
  return '';
}
function opsPhone(){
  const s = S.ops.screen, me = opsUser();
  const body = s === 'duyet' ? opsAiScreen() : s === 'viec' ? opsTasksScreen() : opsAlertScreen();
  const all = { 'canh-bao':['bell','Cảnh báo'], duyet:['spark','Duyệt AI'], viec:['clip', me.role === 'Trưởng BQL' ? 'Việc của đội' : 'Việc của tôi'] };
  const unack = S.alerts.filter(a => a.st === 'Chưa xác nhận').length;
  const badge = { 'canh-bao': (S.sec.stage === 'detected' || S.sec.stage === 'accepted' ? 1 : 0) + unack, duyet: me.approve ? opsPending() : 0, viec: 0 };
  return '<div class="phone"><div class="notch"></div><div class="screen ops"><div class="sbar"><span>9:41</span><span>5G ▮▮▮</span></div>'+body+
    '<nav class="tabbar">'+me.tabs.map(id => '<button class="'+(id === s ? 'on' : '')+'" data-a="opsNav" data-s="'+id+'">'+ic(all[id][0], 22)+all[id][1]+(badge[id] ? '<span class="bdg">'+badge[id]+'</span>' : '')+'</button>').join('')+'</nav>'+opsSheet()+'</div></div>';
}
VIEWS.vanhanh = function(sub){
  if (sub) S.ops.screen = sub;
  const cur = S.ops.screen, idx = OPS_SCREENS.map(x => x[0]).indexOf(cur);
  return '<div class="stage"><div class="list"><h2>App vận hành</h2><p>BQL, bảo vệ, kỹ thuật · điện thoại công vụ · đăng nhập theo ca</p>'+OPS_SCREENS.map(x => '<button class="'+(cur === x[0] ? 'on' : '')+'" data-a="opsNav" data-s="'+x[0]+'">'+x[1]+'<small>'+x[2]+'</small></button>').join('')+'</div>' +
    opsPhone()+'<div class="notes">'+notesCard([OPS_NOTES[idx < 0 ? 0 : idx]])+'<div class="card" style="margin-top:12px"><h3>Thử ngay</h3><div class="mut sm" style="line-height:1.6">• Bấm tên người dùng ở góc trên điện thoại để đổi Bảo vệ / Kỹ thuật / Trưởng BQL: mỗi vai trò thấy tab và quyền khác nhau.<br>• Bấm “Tôi nhận xử lý”, sau đó mở web <a href="#/web/an-ninh">An ninh</a> để thấy trạng thái đổi theo.<br>• Đăng nhập Trưởng BQL hoặc Kỹ thuật, vào Duyệt AI để duyệt đóng van rò rỉ; web <a href="#/web/canh-bao">Cảnh báo</a> đổi theo.<br>• Đề xuất thông gió có đếm ngược 10 phút.<br>• Quét QR thiết bị rồi tạo phiếu ngay trên điện thoại, hoặc tạo ở web <a href="#/web/thiet-bi">Thiết bị</a>.</div></div></div></div>';
};
ACT.opsNav = d => { opsNav(d.s); };
ACT.opsSheet = d => { S.ops.sheet = d.v; render(); };
ACT.opsSheetClose = (d, el, e) => { if (el.dataset.bg && e.target !== el) return; S.ops.sheet = null; render(); };
ACT.opsLive = () => { S.ops.sheet = 'live'; render(); };
ACT.opsUser = d => {
  S.ops.user = d.u; S.ops.sheet = null;
  const u = opsUser(); toast('Đã đăng nhập: '+u.name+' · '+u.role+' · '+u.shift);
  if (u.tabs.indexOf(S.ops.screen) < 0) opsNav('canh-bao'); else render();
};
ACT.opsAlert = d => { S.ops.selAlert = +d.id; S.ops.sheet = 'alert'; render(); };
ACT.opsAlertAck = d => { const a = S.alerts.filter(x => x.id === +d.id)[0]; a.st = opsUser().name+' đang xử lý'; toast('Đã nhận xử lý · ghi nhật ký'); render(); };
ACT.opsAlertAi = () => { opsNav('duyet'); };
ACT.opsAlertTicket = d => { if (+d.id === 2) ACT.mkTicket(); else ACT.alertTicket(d); };
ACT.aiOk = () => { if (!opsUser().approve) return; S.ops.ai.st = 'approved'; S.ops.ai.by = opsWho(); toast('Đã phê duyệt · ghi nhật ký lệnh #L-2032'); render(); };
ACT.aiNo = d => { S.ops.ai.st = 'rejected'; S.ops.ai.reason = d.r; S.ops.sheet = null; render(); };
ACT.aiAgain = () => { S.ops.ai = { st:'pending', deadline:Date.now() + 10*60*1000, reason:null }; render(); };
ACT.opsTicket = d => { S.ops.sel = +d.id; S.ops.sheet = 'ticket'; render(); };
ACT.opsTicketSt = d => { const x = S.ops.tickets.filter(t => t.id === S.ops.sel)[0]; x.st = d.v; if (d.v === 'doing') x.due = 'đang làm'; S.ops.sheet = null; toast(d.v === 'done' ? 'Đã hoàn thành phiếu #'+x.id : 'Đã nhận phiếu #'+x.id); render(); };
ACT.opsScanOk = () => { S.ops.sheet = 'device'; render(); };
