/* ===== App cư dân (slide 11–12) ===== */
const RES_SCREENS = [
  ['home','Trang chủ','Home','Việc hay dùng nhất ở trên cùng'],
  ['moi','Mời khách','Invite a guest','Kịch bản K2 · bước 1'],
  ['qr','Mã QR đã tạo','QR created','Gửi Zalo / SMS, tự hết hạn'],
  ['den','Thông báo khách đến','Guest arrived','Ảnh tại sảnh, thang đã mở đúng tầng'],
  ['hoadon','Hóa đơn tháng','Monthly bill','Điện, nước, sạc xe, phí dịch vụ'],
  ['khuonmat','Đăng ký khuôn mặt','Face enrolment','Đồng ý riêng, có lựa chọn thay thế'],
  ['taikhoan','Tài khoản','Account','Sửa thông tin, đăng xuất']
];
const RES_NOTES = [
  ['Việc hay dùng nhất ở trên cùng','Mời khách là thao tác chính, nằm trong vùng ngón cái và có màu nhấn'],
  ['Nói rõ khách được đi đâu','Cư dân thấy phạm vi quyền trước khi gửi; mặc định chỉ tầng nhà mình'],
  ['Gửi qua kênh khách đang dùng','Zalo, SMS; mã có hạn giờ, tự hủy, hủy thủ công được'],
  ['Xác nhận kết quả, không chỉ sự kiện','Cư dân biết khách đã vào và thang đã mở đúng tầng; có nút báo sai'],
  ['Hóa đơn minh bạch','Tách điện, nước, sạc xe, phí; so sánh 6 tháng để tự kiểm tra'],
  ['Đồng ý thật sự','Ô đồng ý không đánh sẵn; lựa chọn thay thế có trọng lượng ngang nhau']
];
const SLOTS = ['08:00 – 12:00','12:00 – 15:00','15:00 – 18:00','18:00 – 21:00'];
/* Hóa đơn 6 tháng gần nhất; tháng cuối là tháng hiện tại (chưa nộp) */
const BILL_FEE = 460000;
const BILLS = [
  { m:'T5', kwh:1180, dien:3180000, m3:9, nuoc:260000, ev:0, sac:0, paid:'23/05' },
  { m:'T6', kwh:1215, dien:3275000, m3:11, nuoc:310000, ev:16, sac:55000, paid:'19/06' },
  { m:'T7', kwh:1260, dien:3400000, m3:21, nuoc:590000, ev:99, sac:350000, paid:'24/07' },
  { m:'T8', kwh:1230, dien:3315000, m3:20, nuoc:560000, ev:159, sac:565000, paid:'21/08' },
  { m:'T9', kwh:1214, dien:3275000, m3:19, nuoc:520000, ev:75, sac:265000, paid:'22/09' },
  { m:'T10', kwh:1190, dien:3210000, m3:18, nuoc:495000, ev:62, sac:220000, paid:null }
];
const BILL_CUR = BILLS[BILLS.length - 1].m;
function billTotal(b){ return b.dien + b.nuoc + b.sac + BILL_FEE; }

/* 7 ngày tính cả hôm nay, theo đồng hồ thật của máy */
function resDays(){
  const wd = S.lang === 'en' ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] : ['CN','T2','T3','T4','T5','T6','T7'];
  const now = new Date();
  return [0,1,2,3,4,5,6].map(i => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const dm = String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0');
    return { v:String(i), dm:dm, label:(i === 0 ? t('Hôm nay','Today') : i === 1 ? t('Ngày mai','Tomorrow') : wd[d.getDay()]) + ', ' + dm };
  });
}
function dayText(day){
  const i = +day || 0;
  return i === 0 ? t('hôm nay','today') : i === 1 ? t('ngày mai','tomorrow') : t('ngày ','on ') + resDays()[i].dm;
}
/* Khung giờ đã qua hẳn: giờ kết thúc <= giờ hiện tại */
function slotPassed(slot){ const n = new Date(); return parseInt(slot.split('–')[1], 10) * 60 <= n.getHours() * 60 + n.getMinutes(); }

function resEnsure(screen){
  const r = S.res;
  if (screen === 'den' && !(r.invite && r.invite.scanned)){
    r.invite = { id:'INV-0420', name:'Nguyễn Lan', phone:'0912 345 678', day:'0', slot:'15:00 – 18:00', car:true, bike:false, plate:'30G-123.45', sent:'Zalo', scanned:true, at:'15:04', expired:false, cancelled:false };
  }
  if (screen === 'qr' && !r.invite){
    r.invite = { id:'INV-0420', name:r.form.name || 'Nguyễn Lan', phone:r.form.phone, day:r.form.day, slot:r.form.slot, car:r.form.car, bike:!!r.form.bike, plate:r.form.plate, sent:null, scanned:false, at:null, expired:false, cancelled:false };
  }
  if (screen === 'suatt' && !r.edit) r.edit = Object.assign({}, r.profile);
}
function resNav(screen){
  if (route().v === 'cudan') go('cudan/' + screen); else { resEnsure(screen); S.res.screen = screen; render(); }
}
function scopeText(car){ return t('Khách chỉ đi được sảnh T1, '+(car ? 'hầm B2 và ' : '')+'tầng 4', 'Guest can only access Lobby T1, '+(car ? 'garage B2 and ' : '')+'floor 4'); }
function resTab(){ const s = S.res.screen; return ['moi','qr','den','khach'].indexOf(s) > -1 ? 'khach' : s === 'hoadon' ? 'hoadon' : ['taikhoan','khuonmat','suatt'].indexOf(s) > -1 ? 'tk' : 'home'; }
function statusChip(i){
  if (i.cancelled) return '<span class="chip neutral">'+t('Đã hủy','Cancelled')+'</span>';
  if (i.expired) return '<span class="chip neutral">'+t('Đã hết hạn','Expired')+'</span>';
  if (i.scanned) return '<span class="chip ok">'+t('Đã đến '+i.at,'Arrived '+i.at)+'</span>';
  return '<span class="chip work">'+(i.sent ? t('Chờ khách quét','Waiting for scan') : t('Chưa gửi','Not sent'))+'</span>';
}

function resBody(){
  const r = S.res, s = r.screen, f = r.form, iv = r.invite, p = r.profile;
  const head = (title, back) => '<div class="ah">'+(back ? '<button class="back" data-a="resNav" data-s="'+back+'" aria-label="Quay lại">'+ic('back', 20, 2.2)+'</button>' : '')+'<h2>'+title+'</h2></div>';
  if (s === 'home'){
    const arrived = iv && iv.scanned && !iv.expired && !iv.cancelled;
    const qa = [['moi','userplus',t('Mời khách','Invite'),1],['door','key',t('Mở cửa sảnh','Open lobby')],['hoadon','file',t('Hóa đơn','Bills')],['later','msg',t('Phản ánh','Requests')],['later','cal',t('Đặt dịch vụ','Services')],['later','car',t('Bãi xe','Parking')]];
    const meter = (lbl, val, delta) => '<div class="acard"><div class="lbl">'+lbl+'</div><b>'+val+'</b><span class="delta">'+delta+'</span></div>';
    return '<div class="scroll" data-sk="res"><div class="hello"><div class="grow"><h2>'+t('Chào anh ','Hello, ')+esc(p.name)+'</h2><p>'+t('Căn 4B · Tô Ngọc Vân','Unit 4B · To Ngoc Van')+'</p></div><button class="bell" data-a="resLater" aria-label="'+t('Thông báo','Notifications')+'">'+ic('bell', 24)+'</button></div>' +
      (arrived ? '<div class="acard" style="background:var(--green-t);border-color:#bfe3cc" data-a="resNav" data-s="den"><div class="row"><span class="b" style="color:var(--green-d)">'+ic('check', 18)+' '+t('Khách '+esc(iv.name)+' đã đến','Guest '+esc(iv.name)+' has arrived')+'</span><span class="sp"></span>›</div></div>' : '') +
      '<div class="qa">'+qa.map(x => '<button class="'+(x[3] ? 'pri' : '')+'" data-a="'+(x[0] === 'door' ? 'resDoor' : x[0] === 'later' ? 'resLater' : 'resNav')+'" data-s="'+x[0]+'"><span class="i">'+ic(x[1], 30, 1.6)+'</span>'+x[2]+'</button>').join('')+'</div>' +
      '<div class="acard"><div class="lbl">'+t('BQL · Thông báo','Management · Notice')+'</div><div class="b" style="font-size:13px">'+t('Bảo trì thang máy số 2 ngày 22/10, 09:00–11:00','Elevator no. 2 maintenance on 22/10, 09:00–11:00')+'</div></div>' +
      '<div class="meters">'+meter(t('Điện tháng này','Electricity this month'), '1.190 kWh', '▼ 2% '+t('so tháng trước','vs last month')) +
        meter(t('Nước tháng này','Water this month'), '18 m³', '▼ 5% '+t('so tháng trước','vs last month'))+'</div></div>';
  }
  if (s === 'khach'){
    const past = '<div class="lrow"><div class="i">'+ic('user', 18)+'</div><div class="grow"><b>Trần Thị Hà</b><div class="mut sm">'+t('Hôm qua · 19:00 – 21:00','Yesterday · 19:00 – 21:00')+'</div></div><span class="chip neutral">'+t('Đã hết hạn','Expired')+'</span></div>';
    return '<div class="scroll" data-sk="res">'+head(t('Khách','Guests'))+'<button class="abtn primary" data-a="resNav" data-s="moi">'+ic('plus', 20)+' '+t('Mời khách mới','Invite a guest')+'</button><div class="acard" style="margin-top:14px"><div class="lbl">'+(iv && +iv.day ? t('Sắp tới','Upcoming') : t('Hôm nay','Today'))+'</div>' +
      (iv ? '<div class="lrow" data-a="resNav" data-s="'+(iv.scanned ? 'den' : 'qr')+'" style="cursor:pointer"><div class="i">'+ic('user', 18)+'</div><div class="grow"><b>'+esc(iv.name)+'</b><div class="mut sm">'+iv.slot+(+iv.day ? ' · '+dayText(iv.day) : '')+'</div></div>'+statusChip(iv)+'</div>' : '<div class="mut" style="padding:8px 0">'+t('Chưa có lời mời nào hôm nay.','No invitations today.')+'</div>') +
      '</div><div class="acard"><div class="lbl">'+t('Trước đó','Earlier')+'</div>'+past+'</div></div>';
  }
  if (s === 'moi'){
    return '<div class="scroll" data-sk="res">'+head(t('Mời khách','Invite a guest'), 'home') +
      '<div class="fld"><label>'+t('Tên khách','Guest name')+'</label><input data-bind="res.form.name" value="'+esc(f.name)+'" placeholder="Nguyễn Văn A" autocomplete="off"></div>' +
      '<div class="fld"><label>'+t('Số điện thoại','Phone number')+'</label><input data-bind="res.form.phone" value="'+esc(f.phone)+'" inputmode="tel" autocomplete="off"></div>' +
      '<div class="fld"><label>'+t('Ngày','Date')+'</label><select data-bind="res.form.day" data-c="resFormChg">'+resDays().map(o => '<option value="'+o.v+'" '+(o.v === f.day ? 'selected' : '')+'>'+o.label+'</option>').join('')+'</select></div>' +
      '<div class="fld"><label>'+t('Khung giờ','Time slot')+'</label><select data-bind="res.form.slot" data-c="resFormChg">'+SLOTS.map(o => '<option '+(o === f.slot ? 'selected' : '')+'>'+o+'</option>').join('')+'</select>' +
        (r.err ? '<div class="ferr" role="alert">'+ic('info', 16)+'<span>'+t('Khung giờ '+r.err+' hôm nay đã qua. Vui lòng chọn khung giờ hoặc ngày khác.','The '+r.err+' slot today has already passed. Please choose another slot or date.')+'</span></div>' : '')+'</div>' +
      '<div class="sw carrow"><span class="b">'+t('Khách đi ô tô','Guest arrives by car')+'</span><div class="tg '+(f.car ? 'on' : '')+'" data-a="carToggle" role="switch" aria-checked="'+f.car+'" tabindex="0"></div></div>' +
      '<div class="sw carrow"><span class="b">'+t('Khách đi xe máy','Guest arrives by motorbike')+'</span><div class="tg '+(f.bike ? 'on' : '')+'" data-a="bikeToggle" role="switch" aria-checked="'+!!f.bike+'" tabindex="0"></div></div>' +
      (f.car || f.bike ? '<div class="fld"><input data-bind="res.form.plate" value="'+esc(f.plate)+'" aria-label="'+t('Biển số','Plate')+'" placeholder="'+(f.car ? t('Biển số ô tô','Car plate') : t('Biển số xe máy','Motorbike plate'))+'" autocomplete="off"></div>' : '') +
      '<p class="scope">'+scopeText(f.car || f.bike)+'</p>' +
      '<button class="abtn primary" data-a="resCreate">'+t('Tạo mã QR','Create QR code')+'</button></div>';
  }
  if (s === 'qr'){
    const off = iv && (iv.cancelled || iv.expired);
    return '<div class="scroll" data-sk="res">'+head(t('Mã mời khách','Guest pass'), 'khach') +
      '<div class="qrbox '+(off ? 'off' : '')+'">'+qrSvg(iv.id + iv.name + iv.slot, 222)+'</div>' +
      '<div class="qrinfo"><b>'+esc(iv.name)+'</b><div class="sub">'+t('Hiệu lực '+iv.slot+' '+dayText(iv.day),'Valid '+iv.slot+' '+dayText(iv.day))+'</div>' +
      '<div class="pill">'+(iv.car || iv.bike ?t('Sảnh T1 · Hầm B2 · Tầng 4','Lobby T1 · Garage B2 · Floor 4') : t('Sảnh T1 · Tầng 4','Lobby T1 · Floor 4'))+'</div><div class="mut xs" style="margin:12px 0 16px">'+(iv.cancelled ? t('Lời mời đã hủy','Invitation cancelled') : iv.expired ? t('Mã đã hết hạn và bị hủy','Pass expired and revoked') : t('Tự hết hạn và hủy sau khung giờ','Auto-expires after the time slot'))+'</div></div>' +
      (iv.sent ? '<div class="note" style="margin-bottom:10px">'+ic('check', 16)+' '+t('Đã gửi qua '+iv.sent,'Sent via '+iv.sent)+'</div>' : '') +
      '<button class="abtn primary" data-a="resSend" data-v="Zalo" '+(off ? 'disabled' : '')+'>'+t('Gửi qua Zalo','Send via Zalo')+'</button>' +
      '<div class="btn2"><button class="abtn" data-a="resSend" data-v="SMS" '+(off ? 'disabled' : '')+'>'+t('Gửi SMS','Send SMS')+'</button><button class="abtn danger" data-a="resSheet" data-v="cancel" '+(off ? 'disabled' : '')+'>'+t('Hủy lời mời','Cancel invitation')+'</button></div></div>';
  }
  if (s === 'den'){
    return '<div class="scroll" data-sk="res">' +
      '<div class="camimg" style="margin-top:6px"><span class="ts">SẢNH T1 · '+iv.at+':08</span><span style="color:#b8c4cf">'+ic('user', 96, 1.4)+'</span><span class="cap">'+t('Ảnh tại sảnh T1 · chỉ lưu 7 ngày','Photo at Lobby T1 · kept 7 days')+'</span></div>' +
      '<h2 style="font-size:18px;color:var(--navy)">'+t('Khách '+esc(iv.name)+' đã đến','Guest '+esc(iv.name)+' has arrived')+'</h2><div class="mut" style="font-size:13px;margin-top:8px">'+t('Quét QR tại sảnh T1 lúc '+iv.at,'Scanned QR at Lobby T1 at '+iv.at)+'</div>' +
      '<div class="okbox">'+ic('checkc', 30, 1.8)+'<span>'+t('Thang máy đã được mở tới tầng 4','Elevator released to floor 4')+'</span></div>' +
      '<button class="abtn primary" data-a="resCall">'+t('Gọi video với khách','Video call the guest')+'</button><button class="abtn danger" data-a="resSheet" data-v="notmine">'+t('Không phải khách của tôi','Not my guest')+'</button></div>';
  }
  if (s === 'hoadon'){
    const b = BILLS.find(x => x.m === r.billMonth) || BILLS[BILLS.length - 1];
    const cur = b.m === BILL_CUR, paid = cur ? r.paid : true;
    const rows = [['bolt',t('Điện','Electricity'),fmt(b.kwh)+' kWh',b.dien],['drop',t('Nước','Water'),b.m3+' m³',b.nuoc],['car',t('Sạc xe điện','EV charging'),b.ev+' kWh',b.sac],['home',t('Phí dịch vụ','Service fee'),'',BILL_FEE]];
    const mlabel = x => t('Tháng '+x.m.slice(1)+'/2026','Month '+x.m.slice(1)+'/2026');
    return '<div class="scroll" data-sk="res">'+head(t('Hóa đơn tháng','Monthly bill'), 'home') +
      '<div class="fld"><label>'+t('Hóa đơn tháng','Bill for')+'</label><select data-c="billMonthSel">'+BILLS.slice().reverse().map(x => '<option value="'+x.m+'" '+(x.m === b.m ? 'selected' : '')+'>'+mlabel(x)+(x.m === BILL_CUR ? t(' (tháng này)',' (this month)') : '')+'</option>').join('')+'</select></div>' +
      '<div class="total"><div class="mut">'+(paid ? t('Tổng đã thanh toán','Total paid') : t('Tổng cần thanh toán','Total due'))+'</div><h3>'+fmt(billTotal(b))+' đ</h3>' +
        (paid ? '<span class="chip ok">'+(cur ? t('Đã thanh toán','Paid') : t('Đã nộp '+b.paid,'Paid on '+b.paid))+'</span>' : '<div class="mut">'+t('Hạn thanh toán 25/10','Due 25/10')+'</div>')+'</div>' +
      '<div>'+rows.map(x => '<div class="brow">'+ic(x[0], 20)+'<b>'+x[1]+'</b><span class="mut">'+x[2]+'</span><span class="amt">'+fmt(x[3])+'</span></div>').join('')+'</div>' +
      '<div class="acard" style="margin-top:10px"><div class="lbl">'+t('So sánh 6 tháng · chạm vào cột để xem lại','6-month comparison · tap a bar to review')+'</div><div class="bars6">'+BILLS.map(x => '<button class="'+(x.m === b.m ? 'cur' : '')+'" data-a="billMonth" data-v="'+x.m+'" aria-label="'+mlabel(x)+': '+fmt(billTotal(x))+' đ"><i style="height:'+((billTotal(x)-2500000)/30000)+'%"></i><span>'+x.m+'</span></button>').join('')+'</div></div>' +
      (cur ? '<button class="abtn primary" data-a="resSheet" data-v="pay" '+(r.paid ? 'disabled' : '')+'>'+t('Thanh toán','Pay now')+'</button>' : '')+'</div>';
  }
  if (s === 'khuonmat'){
    const fc = r.face;
    if (fc.state === 'scanning') return '<div class="scroll">'+head(t('Chụp ảnh khuôn mặt','Face capture'), '')+'<div class="face">'+personSvg(false, 80, 100)+'</div><p class="tr" style="text-align:center;color:var(--muted)">'+t('Giữ nguyên khuôn mặt trong khung…','Hold still inside the frame…')+'</p></div>';
    if (fc.state === 'done') return '<div class="scroll">'+head(t('Khuôn mặt','Face ID'), 'taikhoan')+'<div class="acard" style="text-align:center"><div class="i" style="width:60px;height:60px;border-radius:50%;background:var(--green-t);color:var(--green-d);display:grid;place-items:center;margin:0 auto 10px">'+ic('check', 30)+'</div><b style="font-size:16px">'+t('Đã đăng ký khuôn mặt','Face registered')+'</b><p class="mut" style="margin-top:6px;font-size:13px">'+t('Dùng để mở cửa và thang máy. Ảnh chỉ lưu tại tòa nhà, tự xóa khi kết thúc hợp đồng.','Used for doors and elevators. Stored on-site only; deleted when your lease ends.')+'</p></div><button class="abtn danger" data-a="faceDelete">'+t('Xóa dữ liệu khuôn mặt của tôi','Delete my face data')+'</button></div>';
    return '<div class="scroll" data-sk="res">'+head(t('Vào cửa bằng khuôn mặt','Enter with your face'), 'taikhoan') +
      '<div class="ring">'+ic('user', 56, 1.6)+'</div>' +
      '<ul class="bul">'+[t('Ảnh khuôn mặt chỉ lưu tại tòa nhà','Face image is stored in the building only'),t('Dùng để mở cửa và thang máy','Used to open doors and elevators'),t('Xóa được bất cứ lúc nào','Delete it any time'),t('Tự xóa khi kết thúc hợp đồng','Auto-deleted when your lease ends')].map(x => '<li>'+x+'</li>').join('')+'</ul>' +
      '<div class="consent '+(fc.consent ? 'on' : '')+'" data-a="faceConsent" role="checkbox" aria-checked="'+fc.consent+'" tabindex="0"><div class="box">'+(fc.consent ? ic('check', 16, 3) : '')+'</div><span>'+t('Tôi đồng ý cho tòa nhà xử lý ảnh khuôn mặt của tôi cho mục đích trên','I agree to the building processing my face image for the purposes above')+'</span></div>' +
      '<button class="abtn primary" data-a="faceStart" '+(fc.consent ? '' : 'disabled')+'>'+t('Đồng ý và chụp ảnh','Agree and take photo')+'</button><button class="abtn" data-a="faceAlt">'+t('Dùng thẻ hoặc QR thay thế','Use card or QR instead')+'</button>' +
      '<p class="plink"><a href="#" data-a="resSheet" data-v="policy" style="color:var(--teal)">'+t('Chính sách dữ liệu cá nhân','Personal data policy')+'</a></p></div>';
  }
  if (s === 'suatt'){
    const e = r.edit;
    return '<div class="scroll" data-sk="res">'+head(t('Sửa thông tin','Edit profile'), 'taikhoan') +
      '<div class="fld"><label>'+t('Họ và tên','Full name')+'</label><input data-bind="res.edit.name" value="'+esc(e.name)+'" autocomplete="off"></div>' +
      '<div class="fld"><label>'+t('Số điện thoại','Phone number')+'</label><input data-bind="res.edit.phone" value="'+esc(e.phone)+'" inputmode="tel" autocomplete="off"></div>' +
      '<div class="fld"><label>Email</label><input data-bind="res.edit.email" value="'+esc(e.email)+'" inputmode="email" autocomplete="off"></div>' +
      '<div class="fld"><label>'+t('Căn hộ','Unit')+'</label><input value="'+t('Căn 4B · Tô Ngọc Vân','Unit 4B · To Ngoc Van')+'" disabled><div class="mut xs" style="margin-top:5px">'+t('Liên hệ BQL để thay đổi căn hộ','Contact management to change your unit')+'</div></div>' +
      '<button class="abtn primary" style="margin-top:8px" data-a="resSaveProfile">'+t('Lưu thay đổi','Save changes')+'</button><button class="abtn ghost" data-a="resNav" data-s="taikhoan">'+t('Hủy','Cancel')+'</button></div>';
  }
  if (s === 'login'){
    return '<div class="scroll" data-sk="res"><div class="login"><div class="logo">'+ic('building', 38, 1.6)+'</div><h2>Tô Ngọc Vân Building</h2><p class="mut">'+t('Đăng nhập App cư dân','Sign in to the Resident app')+'</p>' +
      '<div class="fld"><label>'+t('Số điện thoại','Phone number')+'</label><input value="'+esc(p.phone)+'" inputmode="tel" autocomplete="off"></div>' +
      '<div class="fld"><label>'+t('Mật khẩu','Password')+'</label><input type="password" value="demo1234" autocomplete="off"></div>' +
      '<button class="abtn primary" style="margin-top:8px" data-a="resLogin">'+t('Đăng nhập','Sign in')+'</button></div></div>';
  }
  /* tài khoản */
  return '<div class="scroll" data-sk="res">'+head(t('Tài khoản','Account')) +
    '<div class="acard"><div class="row" style="gap:12px"><div class="avatar">'+ic('user', 26)+'</div><div><b style="font-size:16px">'+esc(p.name)+'</b><div class="mut sm" style="margin-top:3px">'+t('Căn 4B · Tô Ngọc Vân','Unit 4B · To Ngoc Van')+'</div></div></div>' +
      '<div class="pinfo"><div>'+t('Điện thoại','Phone')+': <b>'+esc(p.phone)+'</b></div><div>Email: <b>'+esc(p.email)+'</b></div></div></div>' +
    '<div class="acard" style="padding:0 16px"><div class="lrow" data-a="resEdit" style="cursor:pointer"><div class="i">'+ic('pen', 18)+'</div><div class="grow"><b>'+t('Sửa thông tin','Edit profile')+'</b><div class="mut sm">'+t('Họ tên, số điện thoại, email','Name, phone, email')+'</div></div>›</div></div>' +
    '<div class="acard" style="padding:0 16px"><div class="lrow" data-a="resNav" data-s="khuonmat" style="cursor:pointer"><div class="i">'+ic('lock', 18)+'</div><div class="grow"><b>'+t('Đăng ký khuôn mặt','Face enrolment')+'</b><div class="mut sm">'+(r.face.state === 'done' ? t('Đã đăng ký','Registered') : t('Chưa đăng ký','Not registered'))+'</div></div>›</div>' +
    '<div class="lrow" data-a="resSheet" data-v="policy" style="cursor:pointer"><div class="i">'+ic('shield', 18)+'</div><div class="grow"><b>'+t('Chính sách dữ liệu cá nhân','Personal data policy')+'</b></div>›</div>' +
    '<div class="lrow"><div class="i">'+ic('info', 18)+'</div><div class="grow"><b>'+t('Ngôn ngữ','Language')+'</b></div><div class="seg"><button class="'+(S.lang === 'vi' ? 'on' : '')+'" data-a="lang" data-v="vi">VI</button><button class="'+(S.lang === 'en' ? 'on' : '')+'" data-a="lang" data-v="en">EN</button></div></div></div>' +
    '<button class="abtn danger" style="margin-top:20px" data-a="resSheet" data-v="logout">'+ic('logout', 20)+' '+t('Đăng xuất','Sign out')+'</button></div>';
}
function resSheet(){
  const k = S.res.sheet; if (!k) return '';
  const wrap = h => '<div class="sheet" data-a="resSheetClose" data-bg="1"><div>'+h+'</div></div>';
  if (k === 'door') return wrap('<h3>'+t('Mở cửa sảnh T1?','Open Lobby T1 door?')+'</h3><p class="mut" style="margin-bottom:14px">'+t('Cửa mở trong 5 giây và được ghi nhật ký.','The door opens for 5 seconds and is logged.')+'</p><button class="abtn primary" data-a="resDoorOk">'+t('Mở cửa','Open')+'</button><button class="abtn ghost" data-a="resSheetClose">'+t('Hủy','Cancel')+'</button>');
  if (k === 'cancel') return wrap('<h3>'+t('Hủy lời mời?','Cancel this invitation?')+'</h3><p class="mut" style="margin-bottom:14px">'+t('Mã QR sẽ bị thu hồi ngay, khách không còn vào được.','The QR code is revoked immediately.')+'</p><button class="abtn danger" data-a="resCancelOk">'+t('Hủy lời mời','Cancel invitation')+'</button><button class="abtn ghost" data-a="resSheetClose">'+t('Giữ lại','Keep')+'</button>');
  if (k === 'notmine') return wrap('<h3>'+t('Báo đây không phải khách của bạn?','Not your guest?')+'</h3><p class="mut" style="margin-bottom:14px">'+t('Bảo vệ sẽ được báo ngay và quyền tạm của mã này bị thu hồi.','Security is alerted and the pass is revoked.')+'</p><button class="abtn danger" data-a="resNotMineOk">'+t('Báo bảo vệ','Alert security')+'</button><button class="abtn ghost" data-a="resSheetClose">'+t('Quay lại','Back')+'</button>');
  if (k === 'bell') return wrap('<h3>'+t('Chuông cửa sảnh T1','Lobby T1 doorbell')+'</h3><div class="camimg" style="height:150px;margin-bottom:12px"><span class="ts">SẢNH T1 · 15:06</span>'+personSvg(false, 70, 90)+'</div><p class="mut" style="margin-bottom:14px">'+t('Có người bấm chuông, không có lời mời. Bạn có muốn mở cửa từ xa?','Someone rang the bell without an invitation. Open the door remotely?')+'</p><button class="abtn primary" data-a="resBellOpen">'+t('Mở cửa từ xa','Open remotely')+'</button><button class="abtn ghost" data-a="resBellNo">'+t('Từ chối','Decline')+'</button>');
  if (k === 'pay') return wrap('<h3>'+t('Thanh toán 4.385.000 đ','Pay 4,385,000 VND')+'</h3>'+['Ví điện tử (MoMo, ZaloPay)','Thẻ ngân hàng nội địa','Chuyển khoản QR'].map(x => '<button class="abtn ghost" data-a="resPayOk">'+x+'</button>').join('')+'<p class="mut sm" style="margin-top:12px">'+t('Phương thức thanh toán sẽ chốt theo quyết định của CĐT.','Payment methods follow the owner’s final decision.')+'</p>');
  if (k === 'policy') return wrap('<h3>'+t('Chính sách dữ liệu cá nhân','Personal data policy')+'</h3><div style="font-size:14px;line-height:1.55" class="col"><div>• '+t('Ảnh khuôn mặt là dữ liệu sinh trắc học, chỉ lưu tại tòa nhà, không gửi tới dịch vụ AI đám mây.','Face images are biometric data, stored on-site only and never sent to cloud AI.')+'</div><div>• '+t('Bạn có thể xem và xóa dữ liệu bất cứ lúc nào trong Tài khoản.','You can view and delete your data any time under Account.')+'</div><div>• '+t('Khách vãng lai không bị định danh; đếm người không lưu khuôn mặt.','Walk-in visitors are not identified; people-counting stores no faces.')+'</div></div><button class="abtn primary" style="margin-top:16px" data-a="resSheetClose">'+t('Đã hiểu','Got it')+'</button>');
  if (k === 'logout') return wrap('<h3>'+t('Đăng xuất?','Sign out?')+'</h3><p class="mut" style="margin-bottom:14px">'+t('Bạn cần đăng nhập lại để mời khách và xem hóa đơn.','You will need to sign in again to invite guests and view bills.')+'</p><button class="abtn danger" data-a="resLogoutOk">'+t('Đăng xuất','Sign out')+'</button><button class="abtn ghost" data-a="resSheetClose">'+t('Ở lại','Stay')+'</button>');
  return '';
}
function resPhone(){
  const r = S.res, tb = resTab();
  const tabs = [['home','home',t('Trang chủ','Home')],['khach','users',t('Khách','Guests')],['hoadon','file',t('Hóa đơn','Bills')],['taikhoan','user',t('Tài khoản','Account')]];
  const keyOf = { home:'home', khach:'khach', hoadon:'hoadon', tk:'taikhoan' }[tb];
  return '<div class="phone res"><div class="notch"></div><div class="screen"><div class="sbar"><span>9:41</span><span>5G ▮▮▮</span></div>' + resBody() +
    (r.screen === 'login' ? '' : '<nav class="tabbar">'+tabs.map(x => '<button class="'+(x[0] === keyOf ? 'on' : '')+'" data-a="resNav" data-s="'+x[0]+'">'+ic(x[1], 22)+x[2]+'</button>').join('')+'</nav>') +
    (r.push ? '<div class="push" data-a="resPush"><b>'+esc(r.push.title)+'</b>'+esc(r.push.text)+'</div>' : '') + resSheet() + '</div></div>';
}
VIEWS.cudan = function(sub){
  if (sub){ resEnsure(sub); S.res.screen = sub; }
  const cur = S.res.screen;
  const list = RES_SCREENS.map(x => '<button class="'+(cur === x[0] ? 'on' : '')+'" data-a="resNav" data-s="'+x[0]+'">'+t(x[1], x[2])+'<small>'+x[3]+'</small></button>').join('');
  return '<div class="stage"><div class="list"><h2>App cư dân</h2><p>iOS, Android · song ngữ Việt – Anh · Kịch bản K2 · Persona: cư dân căn 4B</p>'+list+
    '<div class="seg" style="margin-top:10px"><button class="'+(S.lang === 'vi' ? 'on' : '')+'" data-a="lang" data-v="vi">Tiếng Việt</button><button class="'+(S.lang === 'en' ? 'on' : '')+'" data-a="lang" data-v="en">English</button></div></div>' +
    resPhone() + '<div class="notes">'+notesCard(RES_NOTES.slice(cur === 'home' || cur === 'moi' || cur === 'qr' ? 0 : 3, cur === 'home' || cur === 'moi' || cur === 'qr' ? 3 : 6))+'<p class="mut sm" style="margin-top:10px">Mở link này trên điện thoại để dùng toàn màn hình.</p></div></div>';
};
ACT.resNav = d => { S.res.push = null; S.res.sheet = null; S.res.err = null; if (d.s === 'hoadon') S.res.billMonth = BILL_CUR; resNav(d.s); };
ACT.resLater = () => toast(t('Tính năng thuộc giai đoạn sau, ngoài phạm vi prototype này','Planned for a later phase, outside this prototype'));
ACT.resDoor = () => { S.res.sheet = 'door'; render(); };
ACT.resDoorOk = () => { S.res.sheet = null; toast(t('Đã mở cửa sảnh T1 · ghi nhật ký','Lobby T1 door opened · logged')); render(); };
ACT.resSheet = d => { S.res.sheet = d.v; render(); };
ACT.resSheetClose = (d, el, e) => { if (el.dataset.bg && e.target !== el) return; S.res.sheet = null; render(); };
/* Ô tô và xe máy loại trừ nhau; đổi loại xe thì xóa biển số cũ */
ACT.carToggle = () => { const f = S.res.form; f.car = !f.car; if (f.car && f.bike){ f.bike = false; f.plate = ''; } render(); };
ACT.bikeToggle = () => { const f = S.res.form; f.bike = !f.bike; if (f.bike && f.car){ f.car = false; f.plate = ''; } render(); };
ACT.resFormChg = () => { if (S.res.err){ S.res.err = null; render(); } };
ACT.resCreate = () => {
  const f = S.res.form; if (!f.name.trim()){ toast(t('Nhập tên khách để tạo mã','Enter the guest name')); return; }
  /* Luồng K2 là kịch bản demo cố định 14:57 → bỏ qua kiểm tra giờ thật */
  if (route().v !== 'k2' && f.day === '0' && slotPassed(f.slot)){ S.res.err = f.slot; render(); return; }
  S.res.err = null;
  S.res.invite = { id:'INV-0420', name:f.name.trim(), phone:f.phone, day:f.day, slot:f.slot, car:f.car, bike:!!f.bike, plate:f.plate, sent:null, scanned:false, at:null, expired:false, cancelled:false };
  logEvt(S.k2.log, '14:57', 'App cư dân', 'tạo lời mời cho '+f.name.trim()+' ('+f.slot+')');
  resNav('qr');
};
ACT.resSend = d => {
  const i = S.res.invite; i.sent = d.v; logEvt(S.k2.log, '14:58', 'Nền tảng', 'gửi mã QR qua '+d.v+' tới '+i.phone);
  toast(t('Đã gửi mã qua '+d.v,'Sent via '+d.v)); render();
};
ACT.resCancelOk = () => { const i = S.res.invite; i.cancelled = true; S.res.sheet = null; logEvt(S.k2.log, '15:01', 'Nền tảng', 'thu hồi mã QR '+i.id+' (cư dân hủy)'); toast(t('Đã hủy lời mời','Invitation cancelled')); render(); };
ACT.resCall = () => toast(t('Đang gọi video tới khách tại sảnh T1…','Calling the guest at Lobby T1…'));
ACT.resNotMineOk = () => { const i = S.res.invite; i.cancelled = true; S.res.sheet = null; logEvt(S.k2.log, '15:05', 'Nền tảng', 'cư dân báo “không phải khách” → báo bảo vệ, thu hồi quyền tạm'); toast(t('Đã báo bảo vệ','Security alerted')); resNav('khach'); };
ACT.resPayOk = () => { S.res.paid = true; S.res.sheet = null; toast(t('Thanh toán thành công','Payment successful')); render(); };
ACT.billMonth = d => { S.res.billMonth = d.v; render(); };
ACT.billMonthSel = (d, el) => { S.res.billMonth = el.value; render(); };
ACT.resEdit = () => { S.res.edit = Object.assign({}, S.res.profile); resNav('suatt'); };
ACT.resSaveProfile = () => {
  const e = S.res.edit; if (!e.name.trim()){ toast(t('Họ tên không được để trống','Name cannot be empty')); return; }
  S.res.profile = { name:e.name.trim(), phone:e.phone.trim(), email:e.email.trim() }; S.res.edit = null;
  toast(t('Đã lưu thông tin tài khoản','Profile saved')); resNav('taikhoan');
};
ACT.resLogoutOk = () => { S.res.sheet = null; resNav('login'); };
ACT.resLogin = () => { toast(t('Đăng nhập thành công','Signed in')); resNav('home'); };
ACT.resPush = () => { S.res.push = null; resNav('den'); };
ACT.faceConsent = () => { S.res.face.consent = !S.res.face.consent; render(); };
ACT.faceAlt = () => toast(t('Đã chọn thẻ/QR thay thế · không lưu ảnh khuôn mặt','Card/QR chosen · no face image stored'));
ACT.faceStart = () => { S.res.face.state = 'scanning'; render(); setTimeout(() => { S.res.face.state = 'done'; render(); }, 2200); };
ACT.faceDelete = () => { S.res.face = { consent:false, state:'idle' }; toast(t('Đã xóa dữ liệu khuôn mặt','Face data deleted')); render(); };
