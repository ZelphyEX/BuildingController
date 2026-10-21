/* ===== App cư dân (slide 11–12) ===== */
const RES_SCREENS = [
  ['home','Trang chủ','Home','Việc hay dùng nhất ở trên cùng'],
  ['moi','Mời khách','Invite a guest','Kịch bản K2 · bước 1'],
  ['qr','Mã QR đã tạo','QR created','Gửi Zalo / SMS, tự hết hạn'],
  ['den','Thông báo khách đến','Guest arrived','Ảnh tại sảnh, thang đã mở đúng tầng'],
  ['hoadon','Hóa đơn tháng','Monthly bill','Điện, nước, sạc xe, phí dịch vụ'],
  ['khuonmat','Đăng ký khuôn mặt','Face enrolment','Đồng ý riêng, có lựa chọn thay thế']
];
const RES_NOTES = [
  ['Việc hay dùng nhất ở trên cùng','Mời khách là thao tác chính, nằm trong vùng ngón cái và có màu nhấn'],
  ['Nói rõ khách được đi đâu','Cư dân thấy phạm vi quyền trước khi gửi; mặc định chỉ tầng nhà mình'],
  ['Gửi qua kênh khách đang dùng','Zalo, SMS; mã có hạn giờ, tự hủy, hủy thủ công được'],
  ['Xác nhận kết quả, không chỉ sự kiện','Cư dân biết khách đã vào và thang đã mở đúng tầng; có nút báo sai'],
  ['Hóa đơn minh bạch','Tách điện, nước, sạc xe, phí; so sánh 6 tháng để tự kiểm tra'],
  ['Đồng ý thật sự','Ô đồng ý không đánh sẵn; lựa chọn thay thế có trọng lượng ngang nhau']
];
const BILL6 = [['T5',3900000],['T6',4100000],['T7',4800000],['T8',4900000],['T9',4520000],['T10',4385000]];

function resEnsure(screen){
  const r = S.res;
  if (screen === 'den' && !(r.invite && r.invite.scanned)){
    r.invite = { id:'INV-0420', name:'Nguyễn Lan', phone:'0912 345 678', slot:'15:00 – 18:00', car:true, plate:'30G-123.45', sent:'Zalo', scanned:true, at:'15:04', expired:false, cancelled:false };
  }
  if (screen === 'qr' && !r.invite){
    r.invite = { id:'INV-0420', name:r.form.name || 'Nguyễn Lan', phone:r.form.phone, slot:r.form.slot, car:r.form.car, plate:r.form.plate, sent:null, scanned:false, at:null, expired:false, cancelled:false };
  }
}
function resNav(screen){
  if (route().v === 'cudan') go('cudan/' + screen); else { resEnsure(screen); S.res.screen = screen; render(); }
}
function scopeText(car){ return t('Khách chỉ đi được sảnh T1, '+(car ? 'hầm B2 và ' : '')+'tầng 4', 'Guest can only access Lobby T1, '+(car ? 'garage B2 and ' : '')+'floor 4'); }
function resTab(){ const s = S.res.screen; return ['moi','qr','den','khach'].indexOf(s) > -1 ? 'khach' : s === 'hoadon' ? 'hoadon' : (s === 'taikhoan' || s === 'khuonmat') ? 'tk' : 'home'; }
function statusChip(i){
  if (i.cancelled) return '<span class="chip neutral">'+t('Đã hủy','Cancelled')+'</span>';
  if (i.expired) return '<span class="chip neutral">'+t('Đã hết hạn','Expired')+'</span>';
  if (i.scanned) return '<span class="chip ok">'+t('Đã đến '+i.at,'Arrived '+i.at)+'</span>';
  return '<span class="chip work">'+(i.sent ? t('Chờ khách quét','Waiting for scan') : t('Chưa gửi','Not sent'))+'</span>';
}

function resBody(){
  const r = S.res, s = r.screen, f = r.form, iv = r.invite;
  const head = (title, back) => '<div class="ah">'+(back ? '<button class="back" data-a="resNav" data-s="'+back+'" aria-label="Quay lại">'+ic('back', 18)+'</button>' : '')+'<h2>'+title+'</h2></div>';
  if (s === 'home'){
    const arrived = iv && iv.scanned && !iv.expired && !iv.cancelled;
    const qa = [['moi','qr',t('Mời khách','Invite'),1],['door','door',t('Mở cửa sảnh','Open lobby')],['hoadon','receipt',t('Hóa đơn','Bills')],['later','msg',t('Phản ánh','Requests')],['later','cal',t('Đặt dịch vụ','Services')],['later','car',t('Bãi xe','Parking')]];
    return '<div class="scroll" data-sk="res"><div class="hello"><h2>'+t('Chào anh Minh','Hello, Minh')+'</h2><p>'+t('Căn 4B · Tô Ngọc Vân','Unit 4B · To Ngoc Van')+'</p></div>' +
      (arrived ? '<div class="acard" style="background:var(--green-t);border-color:#bfe3cc" data-a="resNav" data-s="den"><div class="row"><span class="b" style="color:var(--green-d)">'+ic('check', 20)+' '+t('Khách '+iv.name+' đã đến','Guest '+iv.name+' has arrived')+'</span><span class="sp"></span>›</div></div>' : '') +
      '<div class="qa">'+qa.map(x => '<button class="'+(x[3] ? 'pri' : '')+'" data-a="'+(x[0] === 'door' ? 'resDoor' : x[0] === 'later' ? 'resLater' : 'resNav')+'" data-s="'+x[0]+'"><span class="i">'+ic(x[1], 22)+'</span>'+x[2]+'</button>').join('')+'</div>' +
      '<div class="acard"><div class="b" style="color:var(--navy);margin-bottom:4px">'+t('BQL · Thông báo','Management · Notice')+'</div><div>'+t('Bảo trì thang máy số 2 ngày 22/10, 09:00–11:00','Elevator no. 2 maintenance on 22/10, 09:00–11:00')+'</div></div>' +
      '<div class="acard"><div class="mut sm">'+t('Điện tháng này','Electricity this month')+'</div><div class="row"><b style="font-size:26px">1.190 kWh</b><span class="chip ok" style="margin-left:auto">▼ 2% '+t('so tháng trước','vs last month')+'</span></div>' +
      '<div class="bars6">'+[1180,1215,1260,1230,1214,1190].map((v, i) => '<div class="'+(i === 5 ? 'cur' : '')+'"><i style="height:'+((v-1000)/3.2)+'%"></i>T'+(i+5)+'</div>').join('')+'</div></div></div>';
  }
  if (s === 'khach'){
    const past = '<div class="lrow"><div class="i">'+ic('user', 18)+'</div><div class="grow"><b>Trần Thị Hà</b><div class="mut sm">'+t('Hôm qua · 19:00 – 21:00','Yesterday · 19:00 – 21:00')+'</div></div><span class="chip neutral">'+t('Đã hết hạn','Expired')+'</span></div>';
    return '<div class="scroll" data-sk="res">'+head(t('Khách','Guests'))+'<button class="abtn primary" data-a="resNav" data-s="moi">'+ic('plus', 20)+' '+t('Mời khách mới','Invite a guest')+'</button><div class="acard" style="margin-top:14px"><div class="mut sm" style="margin-bottom:4px">'+t('Hôm nay','Today')+'</div>' +
      (iv ? '<div class="lrow" data-a="resNav" data-s="'+(iv.scanned ? 'den' : 'qr')+'" style="cursor:pointer"><div class="i">'+ic('user', 18)+'</div><div class="grow"><b>'+esc(iv.name)+'</b><div class="mut sm">'+iv.slot+'</div></div>'+statusChip(iv)+'</div>' : '<div class="mut" style="padding:8px 0">'+t('Chưa có lời mời nào hôm nay.','No invitations today.')+'</div>') +
      '</div><div class="acard"><div class="mut sm" style="margin-bottom:4px">'+t('Trước đó','Earlier')+'</div>'+past+'</div></div>';
  }
  if (s === 'moi'){
    return '<div class="scroll" data-sk="res">'+head(t('Mời khách','Invite a guest'), 'home') +
      '<div class="fld"><label>'+t('Tên khách','Guest name')+'</label><input data-bind="res.form.name" value="'+esc(f.name)+'" placeholder="Nguyễn Văn A" autocomplete="off"></div>' +
      '<div class="fld"><label>'+t('Số điện thoại','Phone number')+'</label><input data-bind="res.form.phone" value="'+esc(f.phone)+'" inputmode="tel" autocomplete="off"></div>' +
      '<div class="row2"><div class="fld"><label>'+t('Ngày','Date')+'</label><select data-bind="res.form.date">'+['Hôm nay, 20/10','Ngày mai, 21/10'].map(o => '<option '+(o === f.date ? 'selected' : '')+'>'+o+'</option>').join('')+'</select></div>' +
      '<div class="fld"><label>'+t('Khung giờ','Time slot')+'</label><select data-bind="res.form.slot">'+['15:00 – 18:00','18:00 – 21:00','08:00 – 12:00'].map(o => '<option '+(o === f.slot ? 'selected' : '')+'>'+o+'</option>').join('')+'</select></div></div>' +
      '<div class="acard"><div class="sw"><span class="b">'+t('Khách đi ô tô','Guest arrives by car')+'</span><div class="tg '+(f.car ? 'on' : '')+'" data-a="carToggle" role="switch" aria-checked="'+f.car+'" tabindex="0"></div></div>' +
      (f.car ? '<div class="fld" style="margin:10px 0 0"><label>'+t('Biển số','Plate')+'</label><input data-bind="res.form.plate" value="'+esc(f.plate)+'" autocomplete="off"></div>' : '')+'</div>' +
      '<div class="note" style="margin-bottom:14px;font-size:14px">'+ic('shield', 16)+' '+scopeText(f.car)+'</div>' +
      '<button class="abtn primary" data-a="resCreate">'+ic('qr', 22)+' '+t('Tạo mã QR','Create QR code')+'</button></div>';
  }
  if (s === 'qr'){
    const off = iv && (iv.cancelled || iv.expired);
    return '<div class="scroll" data-sk="res">'+head(t('Mã mời khách','Guest pass'), 'khach') +
      '<div class="qrbox '+(off ? 'off' : '')+'"><b style="font-size:19px;color:var(--navy)">'+esc(iv.name)+'</b><div class="mut">'+t('Hiệu lực '+iv.slot+' hôm nay','Valid '+iv.slot+' today')+'</div>'+qrSvg(iv.id + iv.name + iv.slot, 200)+
      '<div class="b" style="color:var(--navy)">'+(iv.car ? t('Sảnh T1 · Hầm B2 · Tầng 4','Lobby T1 · Garage B2 · Floor 4') : t('Sảnh T1 · Tầng 4','Lobby T1 · Floor 4'))+'</div><div class="mut sm" style="margin-top:4px">'+(iv.cancelled ? t('Lời mời đã hủy','Invitation cancelled') : iv.expired ? t('Mã đã hết hạn và bị hủy','Pass expired and revoked') : t('Tự hết hạn và hủy sau khung giờ','Auto-expires after the time slot'))+'</div></div>' +
      '<div style="margin-top:12px">'+(iv.sent ? '<div class="note" style="margin-bottom:10px">'+ic('check', 16)+' '+t('Đã gửi qua '+iv.sent,'Sent via '+iv.sent)+'</div>' : '') +
      '<button class="abtn primary" data-a="resSend" data-v="Zalo" '+(off ? 'disabled' : '')+'>'+ic('send', 20)+' '+t('Gửi qua Zalo','Send via Zalo')+'</button><button class="abtn" data-a="resSend" data-v="SMS" '+(off ? 'disabled' : '')+'>'+t('Gửi SMS','Send SMS')+'</button><button class="abtn danger" data-a="resSheet" data-v="cancel" '+(off ? 'disabled' : '')+'>'+t('Hủy lời mời','Cancel invitation')+'</button></div></div>';
  }
  if (s === 'den'){
    return '<div class="scroll" data-sk="res">'+head(t('Khách đến','Guest arrived'), 'khach') +
      '<div class="acard"><div class="mut sm" style="margin-bottom:8px">'+t('Ảnh tại sảnh T1 · chỉ lưu 7 ngày','Photo at Lobby T1 · kept 7 days')+'</div><div class="camimg" style="height:170px"><span class="ts">SẢNH T1 · '+iv.at+':08</span>'+personSvg(false, 90, 115)+'</div></div>' +
      '<div class="acard"><div class="b" style="font-size:19px;color:var(--navy)">'+t('Khách '+esc(iv.name)+' đã đến','Guest '+esc(iv.name)+' has arrived')+'</div><div class="lrow"><div class="i" style="background:var(--green-t);color:var(--green-d)">'+ic('check', 18)+'</div><div>'+t('Quét QR tại sảnh T1 lúc '+iv.at,'Scanned QR at Lobby T1 at '+iv.at)+'</div></div><div class="lrow"><div class="i" style="background:var(--green-t);color:var(--green-d)">'+ic('check', 18)+'</div><div>'+t('Thang máy đã được mở tới tầng 4','Elevator released to floor 4')+'</div></div></div>' +
      '<button class="abtn primary" data-a="resCall">'+ic('phone', 20)+' '+t('Gọi video với khách','Video call the guest')+'</button><button class="abtn danger" data-a="resSheet" data-v="notmine">'+t('Không phải khách của tôi','Not my guest')+'</button></div>';
  }
  if (s === 'hoadon'){
    const rows = [['bolt',t('Điện','Electricity'),'1.190 kWh','3.210.000'],['drop',t('Nước','Water'),'18 m³','495.000'],['car',t('Sạc xe điện','EV charging'),'62 kWh','220.000'],['receipt',t('Phí dịch vụ','Service fee'),'','460.000']];
    return '<div class="scroll" data-sk="res">'+head(t('Hóa đơn tháng 10','October bill'), 'home') +
      '<div class="hello"><p>'+t('Tổng cần thanh toán','Total due')+'</p><h2 style="font-size:32px;margin-top:4px">4.385.000 đ</h2>'+(r.paid ? '<span class="chip ok" style="margin-top:8px">'+t('Đã thanh toán','Paid')+'</span>' : '<p style="margin-top:6px">'+t('Hạn thanh toán 25/10','Due 25/10')+'</p>')+'</div>' +
      '<div class="acard" style="padding:4px 14px">'+rows.map(x => '<div class="lrow"><div class="i">'+ic(x[0], 18)+'</div><div class="grow"><b>'+x[1]+'</b>'+(x[2] ? '<div class="mut sm">'+x[2]+'</div>' : '')+'</div><b>'+x[3]+'</b></div>').join('')+'</div>' +
      '<div class="acard"><div class="mut sm">'+t('So sánh 6 tháng (triệu đồng)','6-month comparison (million VND)')+'</div><div class="bars6">'+BILL6.map((b, i) => '<div class="'+(i === 5 ? 'cur' : '')+'"><i style="height:'+((b[1]-3000000)/20000)+'%"></i>'+b[0]+'</div>').join('')+'</div></div>' +
      '<button class="abtn primary" data-a="resSheet" data-v="pay" '+(r.paid ? 'disabled' : '')+'>'+t('Thanh toán','Pay now')+'</button></div>';
  }
  if (s === 'khuonmat'){
    const fc = r.face;
    if (fc.state === 'scanning') return '<div class="scroll">'+head(t('Chụp ảnh khuôn mặt','Face capture'), '')+'<div class="face">'+personSvg(false, 90, 110)+'</div><p class="tr" style="text-align:center;color:var(--muted)">'+t('Giữ nguyên khuôn mặt trong khung…','Hold still inside the frame…')+'</p></div>';
    if (fc.state === 'done') return '<div class="scroll">'+head(t('Khuôn mặt','Face ID'), 'taikhoan')+'<div class="acard" style="text-align:center"><div class="i" style="width:64px;height:64px;border-radius:50%;background:var(--green-t);color:var(--green-d);display:grid;place-items:center;margin:0 auto 10px">'+ic('check', 32)+'</div><b style="font-size:19px">'+t('Đã đăng ký khuôn mặt','Face registered')+'</b><p class="mut" style="margin-top:6px">'+t('Dùng để mở cửa và thang máy. Ảnh chỉ lưu tại tòa nhà, tự xóa khi kết thúc hợp đồng.','Used for doors and elevators. Stored on-site only; deleted when your lease ends.')+'</p></div><button class="abtn danger" data-a="faceDelete">'+t('Xóa dữ liệu khuôn mặt của tôi','Delete my face data')+'</button></div>';
    return '<div class="scroll" data-sk="res">'+head(t('Đăng ký khuôn mặt','Face enrolment'), 'taikhoan') +
      '<div class="acard"><div class="b" style="font-size:19px;color:var(--navy);margin-bottom:8px">'+ic('lock', 22)+' '+t('Vào cửa bằng khuôn mặt','Enter with your face')+'</div>' +
      [t('Ảnh khuôn mặt chỉ lưu tại tòa nhà','Face image is stored in the building only'),t('Dùng để mở cửa và thang máy','Used to open doors and elevators'),t('Xóa được bất cứ lúc nào','Delete it any time'),t('Tự xóa khi kết thúc hợp đồng','Auto-deleted when your lease ends')].map(x => '<div class="row" style="margin:7px 0;align-items:flex-start"><span style="color:var(--teal);flex:none">'+ic('check', 18)+'</span><span>'+x+'</span></div>').join('')+'</div>' +
      '<div class="consent '+(fc.consent ? 'on' : '')+'" data-a="faceConsent" role="checkbox" aria-checked="'+fc.consent+'" tabindex="0"><div class="box">'+(fc.consent ? ic('check', 18, 3) : '')+'</div><span>'+t('Tôi đồng ý cho tòa nhà xử lý ảnh khuôn mặt của tôi cho mục đích trên','I agree to the building processing my face image for the purposes above')+'</span></div>' +
      '<div style="margin-top:14px"><button class="abtn primary" data-a="faceStart" '+(fc.consent ? '' : 'disabled')+'>'+t('Đồng ý và chụp ảnh','Agree and take photo')+'</button><button class="abtn" data-a="faceAlt">'+t('Dùng thẻ hoặc QR thay thế','Use card or QR instead')+'</button></div>' +
      '<p style="text-align:center;margin-top:12px"><a href="#" data-a="resSheet" data-v="policy" style="color:var(--teal);font-weight:700">'+t('Chính sách dữ liệu cá nhân','Personal data policy')+'</a></p></div>';
  }
  /* tài khoản */
  return '<div class="scroll" data-sk="res">'+head(t('Tài khoản','Account')) +
    '<div class="acard"><div class="row"><div class="lrow" style="border:0;padding:0"><div class="i" style="width:52px;height:52px;border-radius:50%">'+ic('user', 26)+'</div><div><b style="font-size:18px">Minh</b><div class="mut">'+t('Căn 4B · Tô Ngọc Vân','Unit 4B · To Ngoc Van')+'</div></div></div></div></div>' +
    '<div class="acard"><div class="lrow" data-a="resNav" data-s="khuonmat" style="cursor:pointer"><div class="i">'+ic('lock', 18)+'</div><div class="grow"><b>'+t('Đăng ký khuôn mặt','Face enrolment')+'</b><div class="mut sm">'+(S.res.face.state === 'done' ? t('Đã đăng ký','Registered') : t('Chưa đăng ký','Not registered'))+'</div></div>›</div>' +
    '<div class="lrow" data-a="resSheet" data-v="policy" style="cursor:pointer"><div class="i">'+ic('shield', 18)+'</div><div class="grow"><b>'+t('Chính sách dữ liệu cá nhân','Personal data policy')+'</b></div>›</div>' +
    '<div class="lrow"><div class="i">'+ic('info', 18)+'</div><div class="grow"><b>'+t('Ngôn ngữ','Language')+'</b></div><div class="seg"><button class="'+(S.lang === 'vi' ? 'on' : '')+'" data-a="lang" data-v="vi">VI</button><button class="'+(S.lang === 'en' ? 'on' : '')+'" data-a="lang" data-v="en">EN</button></div></div></div></div>';
}
function resSheet(){
  const k = S.res.sheet; if (!k) return '';
  const wrap = h => '<div class="sheet" data-a="resSheetClose" data-bg="1"><div>'+h+'</div></div>';
  if (k === 'door') return wrap('<h3>'+t('Mở cửa sảnh T1?','Open Lobby T1 door?')+'</h3><p class="mut" style="margin-bottom:14px">'+t('Cửa mở trong 5 giây và được ghi nhật ký.','The door opens for 5 seconds and is logged.')+'</p><button class="abtn primary" data-a="resDoorOk">'+t('Mở cửa','Open')+'</button><button class="abtn ghost" data-a="resSheetClose">'+t('Hủy','Cancel')+'</button>');
  if (k === 'cancel') return wrap('<h3>'+t('Hủy lời mời?','Cancel this invitation?')+'</h3><p class="mut" style="margin-bottom:14px">'+t('Mã QR sẽ bị thu hồi ngay, khách không còn vào được.','The QR code is revoked immediately.')+'</p><button class="abtn danger" data-a="resCancelOk">'+t('Hủy lời mời','Cancel invitation')+'</button><button class="abtn ghost" data-a="resSheetClose">'+t('Giữ lại','Keep')+'</button>');
  if (k === 'notmine') return wrap('<h3>'+t('Báo đây không phải khách của bạn?','Not your guest?')+'</h3><p class="mut" style="margin-bottom:14px">'+t('Bảo vệ sẽ được báo ngay và quyền tạm của mã này bị thu hồi.','Security is alerted and the pass is revoked.')+'</p><button class="abtn danger" data-a="resNotMineOk">'+t('Báo bảo vệ','Alert security')+'</button><button class="abtn ghost" data-a="resSheetClose">'+t('Quay lại','Back')+'</button>');
  if (k === 'bell') return wrap('<h3>'+t('Chuông cửa sảnh T1','Lobby T1 doorbell')+'</h3><div class="camimg" style="height:150px;margin-bottom:12px"><span class="ts">SẢNH T1 · 15:06</span>'+personSvg(false, 70, 90)+'</div><p class="mut" style="margin-bottom:14px">'+t('Có người bấm chuông, không có lời mời. Bạn có muốn mở cửa từ xa?','Someone rang the bell without an invitation. Open the door remotely?')+'</p><button class="abtn primary" data-a="resBellOpen">'+t('Mở cửa từ xa','Open remotely')+'</button><button class="abtn ghost" data-a="resBellNo">'+t('Từ chối','Decline')+'</button>');
  if (k === 'pay') return wrap('<h3>'+t('Thanh toán 4.385.000 đ','Pay 4,385,000 VND')+'</h3>'+['Ví điện tử (MoMo, ZaloPay)','Thẻ ngân hàng nội địa','Chuyển khoản QR'].map(x => '<button class="abtn ghost" data-a="resPayOk">'+x+'</button>').join('')+'<p class="mut sm" style="margin-top:12px">'+t('Phương thức thanh toán sẽ chốt theo quyết định của CĐT.','Payment methods follow the owner’s final decision.')+'</p>');
  if (k === 'policy') return wrap('<h3>'+t('Chính sách dữ liệu cá nhân','Personal data policy')+'</h3><div style="font-size:15px;line-height:1.55" class="col"><div>• '+t('Ảnh khuôn mặt là dữ liệu sinh trắc học, chỉ lưu tại tòa nhà, không gửi tới dịch vụ AI đám mây.','Face images are biometric data, stored on-site only and never sent to cloud AI.')+'</div><div>• '+t('Bạn có thể xem và xóa dữ liệu bất cứ lúc nào trong Tài khoản.','You can view and delete your data any time under Account.')+'</div><div>• '+t('Khách vãng lai không bị định danh; đếm người không lưu khuôn mặt.','Walk-in visitors are not identified; people-counting stores no faces.')+'</div></div><button class="abtn primary" style="margin-top:16px" data-a="resSheetClose">'+t('Đã hiểu','Got it')+'</button>');
  return '';
}
function resPhone(){
  const r = S.res, tb = resTab();
  const tabs = [['home','home',t('Trang chủ','Home')],['khach','users',t('Khách','Guests')],['hoadon','receipt',t('Hóa đơn','Bills')],['taikhoan','user',t('Tài khoản','Account')]];
  const keyOf = { home:'home', khach:'khach', hoadon:'hoadon', tk:'taikhoan' }[tb];
  return '<div class="phone"><div class="notch"></div><div class="screen"><div class="sbar"><span>9:41</span><span>5G ▮▮▮</span></div>' + resBody() +
    '<nav class="tabbar">'+tabs.map(x => '<button class="'+(x[0] === keyOf ? 'on' : '')+'" data-a="resNav" data-s="'+x[0]+'">'+ic(x[1], 22)+x[2]+'</button>').join('')+'</nav>' +
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
ACT.resNav = d => { S.res.push = null; S.res.sheet = null; resNav(d.s); };
ACT.resLater = () => toast(t('Tính năng thuộc giai đoạn sau, ngoài phạm vi prototype này','Planned for a later phase, outside this prototype'));
ACT.resDoor = () => { S.res.sheet = 'door'; render(); };
ACT.resDoorOk = () => { S.res.sheet = null; toast(t('Đã mở cửa sảnh T1 · ghi nhật ký','Lobby T1 door opened · logged')); render(); };
ACT.resSheet = d => { S.res.sheet = d.v; render(); };
ACT.resSheetClose = (d, el, e) => { if (el.dataset.bg && e.target !== el) return; S.res.sheet = null; render(); };
ACT.carToggle = () => { S.res.form.car = !S.res.form.car; render(); };
ACT.resCreate = () => {
  const f = S.res.form; if (!f.name.trim()){ toast(t('Nhập tên khách để tạo mã','Enter the guest name')); return; }
  S.res.invite = { id:'INV-0420', name:f.name.trim(), phone:f.phone, slot:f.slot, car:f.car, plate:f.plate, sent:null, scanned:false, at:null, expired:false, cancelled:false };
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
ACT.resPush = () => { S.res.push = null; resNav('den'); };
ACT.faceConsent = () => { S.res.face.consent = !S.res.face.consent; render(); };
ACT.faceAlt = () => toast(t('Đã chọn thẻ/QR thay thế · không lưu ảnh khuôn mặt','Card/QR chosen · no face image stored'));
ACT.faceStart = () => { S.res.face.state = 'scanning'; render(); setTimeout(() => { S.res.face.state = 'done'; render(); }, 2200); };
ACT.faceDelete = () => { S.res.face = { consent:false, state:'idle' }; toast(t('Đã xóa dữ liệu khuôn mặt','Face data deleted')); render(); };
