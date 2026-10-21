/* ===== App vận hành (slide 13) ===== */
const OPS_SCREENS = [['canh-bao','Cảnh báo kèm hình','Kịch bản K8 · bảo vệ Tuấn'],['duyet','Duyệt lệnh AI','Có căn cứ, giới hạn, hết hạn 10 phút'],['viec','Phiếu công việc','Việc của tôi · quét QR thiết bị']];
const OPS_NOTES = [
  ['Một người nhận, mọi người biết','Nút “Tôi nhận xử lý” tránh hai người cùng đi hoặc không ai đi'],
  ['Duyệt có thời hạn và giới hạn','Đề xuất hết hạn nếu không duyệt; dải giá trị và thiết bị bị loại trừ hiển thị rõ'],
  ['QR thiết bị nối hiện trường với dữ liệu','Kỹ thuật quét mã trên bơm, quạt để xem lịch sử, không phải tìm trên máy tính']
];
const LVORD = { khan:0, cao:1, tb:2, tin:3 };

function opsNav(screen){ S.ops.sheet = null; if (route().v === 'vanhanh') go('vanhanh/' + screen); else { S.ops.screen = screen; render(); } }
function oHead(title, sub){ return '<div class="ah" style="margin-bottom:10px"><div class="grow"><h2>'+title+'</h2>'+(sub ? '<div class="mut sm">'+sub+'</div>' : '')+'</div><span class="chip neutral">Tuấn · Bảo vệ · Ca đêm</span></div>'; }

function opsAlertScreen(){
  const q = S.sec, st = q.stage;
  let card = '';
  if (st === 'idle'){
    card = '<div class="acard" style="text-align:center;padding:26px 14px"><div style="color:var(--green);display:grid;place-items:center;margin-bottom:8px">'+ic('check', 36)+'</div><b>Không có cảnh báo an ninh đang mở</b><div class="mut sm" style="margin-top:4px">Camera AI đang giám sát. Cảnh báo mới sẽ hiện ở đây kèm hình.</div></div>';
  } else if (st === 'detected' || st === 'accepted'){
    card = '<div class="acard" style="border:2px solid var(--orange)"><div class="row" style="margin-bottom:6px">'+lvChip('cao')+'<b style="color:var(--navy)">Khu kỹ thuật Z10 · 23:47</b></div>' +
      '<div class="b" style="font-size:17px;line-height:1.35">Có người ngoài giờ, không có lượt quét hợp lệ</div>' +
      '<div class="camimg" style="margin-top:10px;height:130px"><span class="ts">CAM-B2-17 · '+q.at+'</span><div style="margin-top:12px">'+personSvg(!q.reveal, 60, 80)+'</div><span class="box" style="left:42%;top:24%;width:19%;height:64%"></span></div>' +
      '<div class="row" style="margin-top:6px"><span class="mut sm grow">Camera CAM-B2-17 · cạnh tủ rack trung tâm</span><button class="btn ghost sm" data-a="secReveal">'+ic('eye', 14)+' '+(q.reveal ? 'Làm mờ' : 'Xem ảnh')+'</button></div>' +
      (st === 'detected'
        ? '<div style="margin-top:12px"><button class="abtn primary" data-a="secAccept">Tôi nhận xử lý</button><div class="row2" style="margin-top:10px"><button class="abtn" style="margin:0" data-a="opsLive">Xem trực tiếp</button><button class="abtn ghost" style="margin:0" data-a="secFalse">Báo giả</button></div></div>'
        : '<div class="note" style="margin-top:12px;font-size:15px"><b>Tuấn đã nhận xử lý</b> lúc 23:48. Hùng (KT) và Trưởng BQL thấy trạng thái này.</div><div style="margin-top:10px"><button class="abtn primary" data-a="secVerify">Đã xác minh, đóng sự kiện</button><div class="row2" style="margin-top:10px"><button class="abtn" style="margin:0" data-a="opsLive">Xem trực tiếp</button><button class="abtn ghost" style="margin:0" data-a="secFalse">Báo giả</button></div></div>') +
      '<div class="mut sm" style="margin-top:10px">'+(st === 'accepted' ? 'Đã gửi: Tuấn (bảo vệ), Hùng (KT) · Tuấn đã nhận' : q.esc ? 'Không ai nhận sau 3 phút → <b>đã leo thang Trưởng BQL (anh Dũng)</b>' : 'Đã gửi: Tuấn (bảo vệ), Hùng (KT) · chưa ai nhận')+'</div></div>';
  } else if (st === 'closed'){
    card = '<div class="acard" style="background:var(--green-t);border-color:#bfe3cc"><div class="row"><span class="chip ok">ĐÃ ĐÓNG</span><b>Khu kỹ thuật Z10 · 23:47</b></div><p style="margin-top:8px">Đã xác minh: nhân viên kỹ thuật trực. Sự kiện được đưa vào tóm tắt ca.</p></div>';
  } else {
    card = '<div class="acard"><div class="row"><span class="chip neutral">BÁO GIẢ</span><b>Khu kỹ thuật Z10 · 23:47</b></div><p style="margin-top:8px">Đã đánh dấu để hiệu chỉnh vùng phát hiện của CAM-B2-17.</p></div>';
  }
  const others = S.alerts.slice(0, 3).map(a => '<div class="lrow">'+lvChip(a.lv)+'<div class="grow" style="font-size:15px">'+shortDesc(a)+'<div class="mut xs">'+a.loc+' · '+a.time+'</div></div></div>').join('');
  return '<div class="scroll" data-sk="ops">'+oHead('Cảnh báo','Màn hình ưu tiên một tay')+card+'<div class="acard"><div class="mut sm" style="margin-bottom:2px">Cảnh báo khác trong ca</div>'+others+'</div></div>';
}
function opsAiScreen(){
  const a = S.ops.ai;
  const st = a.st === 'pending' && Date.now() > a.deadline ? 'expired' : a.st;
  const hist = S.valve === 'closed' ? '<div class="lrow"><div class="i" style="background:var(--green-t);color:var(--green-d)">'+ic('check', 18)+'</div><div class="grow" style="font-size:15px"><b>Đóng van V-T3-02</b><div class="mut xs">02:41 · BQL duyệt trên web</div></div></div>' : '';
  let card = '';
  if (st === 'pending'){
    card = '<div class="acard" style="border:2px solid var(--teal)"><div class="mut sm">AI đề xuất · thông gió hầm</div><div class="b" style="font-size:18px;color:var(--navy);margin:4px 0 10px;line-height:1.35">Bật quạt thông gió thường hầm B2 ở 40 Hz từ 06:45</div>' +
      '<div class="b sm" style="margin-bottom:4px">Căn cứ</div>'+['CO hiện tại 18 ppm (ngưỡng 50)','Thứ Ba thường có 22 xe ra từ 07:00–07:30','Ước tính giữ CO dưới 35 ppm'].map(x => '<div class="row" style="align-items:flex-start;margin:4px 0;font-size:15px"><span style="color:var(--teal)">'+ic('check', 16)+'</span>'+x+'</div>').join('') +
      '<div class="note" style="margin-top:10px;font-size:14px"><b>Ghi có giới hạn · 20–50 Hz</b><br>Không áp dụng cho quạt sự cố SEAF/FAP</div>' +
      '<div class="row2" style="margin-top:12px"><button class="abtn primary" style="margin:0" data-a="aiOk">Phê duyệt</button><button class="abtn danger" style="margin:0" data-a="opsSheet" data-v="reject">Từ chối</button></div>' +
      '<div class="mut sm" style="margin-top:10px;text-align:center">Hết hạn sau <b data-cd="'+a.deadline+'">10:00</b> nếu không duyệt</div></div>';
  } else if (st === 'approved'){
    card = '<div class="acard" style="background:var(--green-t);border-color:#bfe3cc"><div class="b" style="color:var(--green-d);font-size:17px">✓ Đã phê duyệt</div><p style="margin:6px 0">Bật quạt thường hầm B2 ở 40 Hz từ 06:45. Ghi vào BACnet ưu tiên 12; hết giờ cao điểm hệ thống tự trả quyền (relinquish) về BMS.</p><div class="mut sm">Nhật ký lệnh #L-2032 · 06:41 · Tuấn duyệt</div></div>';
  } else if (st === 'rejected'){
    card = '<div class="acard"><div class="b">Đã từ chối</div><p class="mut" style="margin-top:4px">Lý do: '+esc(a.reason || '')+'. AI ghi nhận để hiệu chỉnh lần sau.</p><button class="abtn" style="margin-top:10px" data-a="aiAgain">Yêu cầu AI đề xuất lại</button></div>';
  } else {
    card = '<div class="acard" style="background:#f0f2f4"><div class="b">Đề xuất đã hết hạn</div><p class="mut" style="margin:4px 0 10px">Không ai duyệt trong 10 phút nên lệnh không được gửi xuống BMS.</p><button class="abtn" data-a="aiAgain">Yêu cầu AI đề xuất lại</button></div>';
  }
  const n = st === 'pending' ? 1 : 0;
  return '<div class="scroll" data-sk="ops">'+oHead('Duyệt lệnh AI','Chờ duyệt ('+n+')')+card+(hist ? '<div class="acard"><div class="mut sm">Đã xử lý</div>'+hist+'</div>' : '')+'</div>';
}
function opsTasksScreen(){
  const tk = S.ops.tickets.slice().sort((a, b) => (a.st === 'done') - (b.st === 'done') || LVORD[a.lv] - LVORD[b.lv]);
  const rows = tk.map(x => '<div class="lrow" data-a="opsTicket" data-id="'+x.id+'" style="cursor:pointer;'+(x.st === 'done' ? 'opacity:.5' : '')+'">'+lvChip(x.lv)+'<div class="grow"><b style="font-size:16px">#'+x.id+'</b> '+x.title+'<div class="mut sm">'+x.loc+' · '+(x.st === 'done' ? 'đã xong' : x.st === 'doing' && x.due !== 'đang làm' ? 'đang làm' : x.due)+'</div></div>›</div>').join('');
  return '<div class="scroll" data-sk="ops">'+oHead('Việc của tôi', tk.filter(x => x.st !== 'done').length+' phiếu đang mở')+'<div class="acard" style="padding:4px 14px">'+rows+'</div>' +
    '<button class="abtn" data-a="opsSheet" data-v="scan">'+ic('scan', 22)+' Quét QR thiết bị</button><p class="mut sm" style="text-align:center;margin-top:8px">Quét mã trên thiết bị để mở lịch sử và phiếu liên quan</p></div>';
}
function opsSheet(){
  const k = S.ops.sheet; if (!k) return '';
  const wrap = h => '<div class="sheet" data-a="opsSheetClose" data-bg="1"><div>'+h+'</div></div>';
  if (k === 'reject') return wrap('<h3>Lý do từ chối</h3>'+['CO thực tế thấp hơn dự báo','Đang có việc bảo trì quạt','Không phù hợp giờ này'].map(x => '<button class="abtn ghost" data-a="aiNo" data-r="'+x+'">'+x+'</button>').join(''));
  if (k === 'live') return wrap('<h3>CAM-B2-17 · trực tiếp</h3><div class="camimg" style="height:200px"><span class="ts"><span class="dot" style="background:var(--red);margin-right:5px;animation:bl 1s infinite"></span>LIVE '+S.sec.at.slice(0, 5)+'</span><div style="margin-top:20px">'+personSvg(!S.sec.reveal, 70, 90)+'</div></div><p class="mut sm" style="margin:10px 0">Hình làm mờ mặc định; chỉ vai trò được phép mới xem rõ.</p><button class="abtn ghost" data-a="opsSheetClose">Đóng</button>');
  if (k === 'scan') return wrap('<h3>Quét QR thiết bị</h3><div class="camimg" style="height:170px"><div style="width:110px;height:110px;border:3px solid var(--teal);border-radius:14px;display:grid;place-items:center;position:relative;overflow:hidden"><div style="opacity:.6">'+qrSvg('BTA-02', 80)+'</div></div></div><button class="abtn primary" style="margin-top:14px" data-a="opsScanOk">Giả lập: đã quét tem BTA-02</button><button class="abtn ghost" data-a="opsSheetClose">Hủy</button>');
  if (k === 'device') return wrap('<h3>Bơm tăng áp 02 · BTA-02</h3><div class="row" style="margin-bottom:10px">'+lvChip('cao')+'<span>Sức khỏe 61/100</span></div><div class="note" style="margin-bottom:10px">Khởi động 70 lần hôm qua (nền 23). Nghi van một chiều không kín.</div><b>Lịch sử gần đây</b>'+[['14/10','Chạy thử, bình thường'],['08/10','Thay gioăng bích đẩy'],['02/09','Bảo dưỡng định kỳ']].map(x => '<div class="lrow"><div class="grow">'+x[1]+'</div><span class="mut sm">'+x[0]+'</span></div>').join('')+'<div style="margin-top:8px"><b>Phiếu liên quan</b></div>'+(S.ticketMade ? '<div class="lrow"><span class="chip cao">CAO</span><div class="grow"><b>#1047</b> Kiểm tra van một chiều</div></div>' : '<div class="mut" style="padding:8px 0">Chưa có phiếu. Tạo từ trang Thiết bị trên web.</div>')+'<button class="abtn ghost" style="margin-top:10px" data-a="opsSheetClose">Đóng</button>');
  if (k === 'ticket'){
    const x = S.ops.tickets.filter(t => t.id === S.ops.sel)[0]; if (!x) return '';
    return wrap('<div class="row" style="margin-bottom:6px">'+lvChip(x.lv)+'<b style="color:var(--navy)">#'+x.id+'</b></div><h3 style="font-size:19px">'+x.title+'</h3><p class="mut" style="margin-bottom:14px">'+x.loc+' · '+x.due+'</p>'+
      (x.st === 'new' ? '<button class="abtn primary" data-a="opsTicketSt" data-v="doing">Nhận việc</button>' : x.st === 'doing' ? '<button class="abtn primary" data-a="opsTicketSt" data-v="done">Hoàn thành</button>' : x.st === 'wait' ? '<button class="abtn primary" data-a="opsTicketSt" data-v="doing">Bắt đầu làm</button>' : '<div class="chip ok">Đã xong</div>')+'<button class="abtn ghost" data-a="opsSheetClose">Đóng</button>');
  }
  return '';
}
function opsPhone(){
  const s = S.ops.screen, pend = S.ops.ai.st === 'pending' && Date.now() <= S.ops.ai.deadline;
  const body = s === 'duyet' ? opsAiScreen() : s === 'viec' ? opsTasksScreen() : opsAlertScreen();
  const tabs = [['canh-bao','bell','Cảnh báo'],['duyet','spark','Duyệt AI'],['viec','clip','Việc của tôi']];
  const badge = { 'canh-bao': (S.sec.stage === 'detected' || S.sec.stage === 'accepted') ? 1 : 0, duyet: pend ? 1 : 0, viec: 0 };
  return '<div class="phone"><div class="notch"></div><div class="screen"><div class="sbar"><span>9:41</span><span>5G ▮▮▮</span></div>'+body+
    '<nav class="tabbar">'+tabs.map(x => '<button class="'+(x[0] === s ? 'on' : '')+'" data-a="opsNav" data-s="'+x[0]+'">'+ic(x[1], 22)+x[2]+(badge[x[0]] ? '<span class="bdg">'+badge[x[0]]+'</span>' : '')+'</button>').join('')+'</nav>'+opsSheet()+'</div></div>';
}
VIEWS.vanhanh = function(sub){
  if (sub) S.ops.screen = sub;
  const cur = S.ops.screen, idx = OPS_SCREENS.map(x => x[0]).indexOf(cur);
  return '<div class="stage"><div class="list"><h2>App vận hành</h2><p>BQL, bảo vệ, kỹ thuật · điện thoại công vụ · đăng nhập theo ca</p>'+OPS_SCREENS.map(x => '<button class="'+(cur === x[0] ? 'on' : '')+'" data-a="opsNav" data-s="'+x[0]+'">'+x[1]+'<small>'+x[2]+'</small></button>').join('')+'</div>' +
    opsPhone()+'<div class="notes">'+notesCard([OPS_NOTES[idx < 0 ? 0 : idx]])+'<div class="card" style="margin-top:12px"><h3>Thử ngay</h3><div class="mut sm" style="line-height:1.6">• Bấm “Tôi nhận xử lý”, sau đó mở web <a href="#/web/an-ninh">An ninh</a> để thấy trạng thái đổi theo.<br>• Duyệt lệnh AI có đếm ngược 10 phút.<br>• Tạo phiếu ở web <a href="#/web/thiet-bi">Thiết bị</a> rồi quay lại tab Việc của tôi.</div></div></div></div>';
};
ACT.opsNav = d => { opsNav(d.s); };
ACT.opsSheet = d => { S.ops.sheet = d.v; render(); };
ACT.opsSheetClose = (d, el, e) => { if (el.dataset.bg && e.target !== el) return; S.ops.sheet = null; render(); };
ACT.opsLive = () => { S.ops.sheet = 'live'; render(); };
ACT.aiOk = () => { S.ops.ai.st = 'approved'; toast('Đã phê duyệt · ghi nhật ký lệnh #L-2032'); render(); };
ACT.aiNo = d => { S.ops.ai.st = 'rejected'; S.ops.ai.reason = d.r; S.ops.sheet = null; render(); };
ACT.aiAgain = () => { S.ops.ai = { st:'pending', deadline:Date.now() + 10*60*1000, reason:null }; render(); };
ACT.opsTicket = d => { S.ops.sel = +d.id; S.ops.sheet = 'ticket'; render(); };
ACT.opsTicketSt = d => { const x = S.ops.tickets.filter(t => t.id === S.ops.sel)[0]; x.st = d.v; if (d.v === 'doing') x.due = 'đang làm'; S.ops.sheet = null; toast(d.v === 'done' ? 'Đã hoàn thành phiếu #'+x.id : 'Đã nhận phiếu #'+x.id); render(); };
ACT.opsScanOk = () => { S.ops.sheet = 'device'; render(); };
