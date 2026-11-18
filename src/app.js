// © 2026 Trận Pháp Kỳ Môn — mã do Trận Pháp Kỳ Môn tự viết (xem ghi chú đầu tệp).
// ===== Page router =====
// Link format: #/<trang>[/<mục>][?mode=..&linhvuc=..&cung=..&goi=..]
// Every CTA is a real deep link: it switches page, scrolls to the named section
// (element id "muc-<mục>") and applies its parameters, including when the link
// points at the page that is already open.
var ROUTES=['home','tra-cuu','huong-dan','bang-gia','kien-thuc','faq','dang-ky'];
var TITLES={'home':'Trận Pháp Kỳ Môn — Kỳ Môn Độn Giáp: Lập Trận & Tra Cứu Định Cục','tra-cuu':'Tra Cứu Kỳ Môn — Trận Pháp Kỳ Môn','huong-dan':'Hướng Dẫn Sử Dụng — Trận Pháp Kỳ Môn','bang-gia':'Bảng Giá — Trận Pháp Kỳ Môn','kien-thuc':'Kiến Thức Nền Kỳ Môn — Trận Pháp Kỳ Môn','faq':'Giới Thiệu & FAQ — Trận Pháp Kỳ Môn','dang-ky':'Đăng Ký Gói Dùng — Trận Pháp Kỳ Môn'};
function parseHash(){
  var raw=(location.hash||'').replace(/^#\/?/,''), qi=raw.indexOf('?');
  var parts=(qi>=0?raw.slice(0,qi):raw).split('/'), params={};
  (qi>=0?raw.slice(qi+1):'').split('&').forEach(function(kv){
    if(!kv)return; var i=kv.indexOf('='), k=i>=0?kv.slice(0,i):kv, v=i>=0?kv.slice(i+1):'';
    try{params[k]=decodeURIComponent(v);}catch(e){params[k]=v;}
  });
  var known=ROUTES.indexOf(parts[0])>=0;
  return {route:known?parts[0]:'home',section:known?(parts[1]||''):'',params:params};
}
function showPage(st){
  var route=st.route, page=null;
  document.querySelectorAll('.page').forEach(function(p){var on=p.getAttribute('data-page')===route;p.classList.toggle('active',on);if(on)page=p;});
  document.querySelectorAll('[data-navlink]').forEach(function(a){a.classList.toggle('active',a.getAttribute('data-navlink')===route);});
  document.title=TITLES[route]||TITLES.home;
  var target=st.section?document.getElementById('muc-'+st.section):null;
  if(target&&page&&!page.contains(target))target=null;
  if(route==='tra-cuu'){var t2=applyTraCuu(st.params); if(t2)target=t2;}
  if(route==='dang-ky')applyDangKy(st.params);
  if(target){
    if(target.tagName==='DETAILS')target.open=true;
    target.scrollIntoView({block:'start',behavior:'instant'});
  }else{window.scrollTo({top:0,left:0,behavior:'instant'});}
}
function applyTraCuu(params){
  if(modeName[params.mode])setMode(params.mode);
  if(params.linhvuc){var sf=document.getElementById('fField');for(var i=0;i<sf.options.length;i++){if(sf.options[i].text===params.linhvuc){sf.selectedIndex=i;break;}}}
  var pal=parseInt(params.cung,10);
  if(pal>=1&&pal<=9){
    cast(false);
    var cell=document.querySelector('.km-cell[data-pal="'+pal+'"]'); if(cell)cell.click();
    return document.getElementById('castResult');
  }
  return null;
}
window.addEventListener('hashchange',function(){showPage(parseHash());});
document.addEventListener('click',function(e){
  var a=e.target.closest?e.target.closest('a[href^="#/"]'):null;
  if(a&&a.getAttribute('href')===location.hash)showPage(parseHash());
});

// ===== Data =====
var PALACES=[
 {han:"巽",name:"TỐN · 4",sub:"Đông Nam · Mộc",desc:"Cung Tốn (4) — Đông Nam, hành Mộc. Liên quan gió, sự lan tỏa, giao dịch và tin tức."},
 {han:"離",name:"LY · 9",sub:"Nam · Hỏa",desc:"Cung Ly (9) — phương Nam, hành Hỏa. Chủ văn thư, danh tiếng, sự rõ ràng và hiển lộ."},
 {han:"坤",name:"KHÔN · 2",sub:"Tây Nam · Thổ",desc:"Cung Khôn (2) — Tây Nam, hành Thổ. Chủ đất đai, người mẹ, sự nuôi dưỡng và tập thể."},
 {han:"震",name:"CHẤN · 3",sub:"Đông · Mộc",desc:"Cung Chấn (3) — phương Đông, hành Mộc. Chủ khởi động, sấm động, bắt đầu mới."},
 {han:"中",name:"TRUNG · 5",sub:"Trung tâm · Thổ",desc:"Cung Trung (5) — Tâm bàn, hành Thổ. Nơi an Trực Phù, Trực Sử khi luận cục; các cung khác xoay quanh đây."},
 {han:"兌",name:"ĐOÀI · 7",sub:"Tây · Kim",desc:"Cung Đoài (7) — phương Tây, hành Kim. Chủ miệng lưỡi, đàm phán, vui vẻ và thiếu nữ."},
 {han:"艮",name:"CẤN · 8",sub:"Đông Bắc · Thổ",desc:"Cung Cấn (8) — Đông Bắc, hành Thổ. Chủ núi, sự dừng lại, nhà cửa và tích lũy."},
 {han:"坎",name:"KHẢM · 1",sub:"Bắc · Thủy",desc:"Cung Khảm (1) — phương Bắc, hành Thủy. Chủ hiểm trở, trí tuệ, dòng chảy và việc ngầm."},
 {han:"乾",name:"CÀN · 6",sub:"Tây Bắc · Kim",desc:"Cung Càn (6) — Tây Bắc, hành Kim. Chủ trời, người đứng đầu, quyền uy và quý nhân."}
];
var grid=document.getElementById('grid9');
var PALACE_NUM=[4,9,2,3,5,7,8,1,6]; // Lac Thu numbers in reading order of the 3x3 grid
PALACES.forEach(function(p,i){
  var d=document.createElement('a'); d.className='cell'+(i===4?' center':''); d.href='#/tra-cuu/cong-cu?mode=lapban&cung='+PALACE_NUM[i]; d.setAttribute('data-palace',p.name); d.setAttribute('aria-label','Cung '+p.name+' — xem cung này trên bàn đầy đủ ở trang Tra Cứu');
  d.innerHTML='<div class="han">'+p.han+'</div><div class="name">'+p.name+'</div>';
  grid.appendChild(d);
});

// Ngu Ty Don table: rows = 12 gio, cols = 5 nhom ngay
var GIO=[["Tý","23h – 01h"],["Sửu","01h – 03h"],["Dần","03h – 05h"],["Mão","05h – 07h"],["Thìn","07h – 09h"],["Tỵ","09h – 11h"],["Ngọ","11h – 13h"],["Mùi","13h – 15h"],["Thân","15h – 17h"],["Dậu","17h – 19h"],["Tuất","19h – 21h"],["Hợi","21h – 23h"]];
var NTD=[
 ["Giáp Tý","Bính Tý","Mậu Tý","Canh Tý","Nhâm Tý"],
 ["Ất Sửu","Đinh Sửu","Kỷ Sửu","Tân Sửu","Quý Sửu"],
 ["Bính Dần","Mậu Dần","Canh Dần","Nhâm Dần","Giáp Dần"],
 ["Đinh Mão","Kỷ Mão","Tân Mão","Quý Mão","Ất Mão"],
 ["Mậu Thìn","Canh Thìn","Nhâm Thìn","Giáp Thìn","Bính Thìn"],
 ["Kỷ Tỵ","Tân Tỵ","Quý Tỵ","Ất Tỵ","Đinh Tỵ"],
 ["Canh Ngọ","Nhâm Ngọ","Giáp Ngọ","Bính Ngọ","Mậu Ngọ"],
 ["Tân Mùi","Quý Mùi","Ất Mùi","Đinh Mùi","Kỷ Mùi"],
 ["Nhâm Thân","Giáp Thân","Bính Thân","Mậu Thân","Canh Thân"],
 ["Quý Dậu","Ất Dậu","Đinh Dậu","Kỷ Dậu","Tân Dậu"],
 ["Giáp Tuất","Bính Tuất","Mậu Tuất","Canh Tuất","Nhâm Tuất"],
 ["Ất Hợi","Đinh Hợi","Kỷ Hợi","Tân Hợi","Quý Hợi"]
];
var selGio=document.getElementById('selGio');
GIO.forEach(function(g,i){var o=document.createElement('option');o.value=i;o.textContent='Giờ '+g[0]+' ('+g[1]+')';selGio.appendChild(o);});
selGio.value=8; // Gio Than - vi du 1949
var CAN_GROUP={"Giáp":0,"Kỷ":0,"Ất":1,"Canh":1,"Bính":2,"Tân":2,"Đinh":3,"Nhâm":3,"Mậu":4,"Quý":4};
var GROUP_LABEL=["Giáp / Kỷ","Ất / Canh","Bính / Tân","Đinh / Nhâm","Mậu / Quý"];
document.getElementById('btnGio').addEventListener('click',function(){
  var can=document.getElementById('selCan').value, gi=parseInt(selGio.value,10);
  var res=NTD[gi][CAN_GROUP[can]];
  var out=document.getElementById('outGio'); out.classList.add('show');
  out.innerHTML='Ngày <strong>'+can+'</strong> (nhóm '+GROUP_LABEL[CAN_GROUP[can]]+') — giờ <strong>'+GIO[gi][0]+'</strong> ('+GIO[gi][1]+') là: <span style="font-size:20px;font-weight:800;color:var(--red)">'+res+'</span><br><span style="font-size:13px;color:var(--muted)">Theo ca quyết: giờ Tý của nhóm này là '+NTD[0][CAN_GROUP[can]]+', đếm thuận Thiên can tới giờ '+GIO[gi][0]+' được '+res+'.</span>';
});

// B · Cục số 24 tiết khí (bảng nằm trong bộ máy KyMon.TIET)
var selTiet=document.getElementById('selTiet');
KyMon.TIET.forEach(function(r,i){var o=document.createElement('option');o.value=i;o.textContent=r.ten+' ('+(r.duong?'Dương độn':'Âm độn')+')';selTiet.appendChild(o);});
document.getElementById('btnCuc').addEventListener('click',function(){
  var r=KyMon.TIET[parseInt(selTiet.value,10)], ng=parseInt(document.getElementById('selNguyen').value,10);
  var don=r.duong?'Dương độn':'Âm độn', cuc=r.cuc[ng];
  var out=document.getElementById('outCuc'); out.classList.add('show');
  out.innerHTML='Tiết khí <strong>'+r.ten+'</strong> thuộc <strong>'+don+'</strong> — '+KyMon.NGUYEN[ng]+' dùng: <span style="font-size:20px;font-weight:800;color:var(--red)">'+(r.duong?'Dương ':'Âm ')+cuc+' cục</span><br><span style="font-size:13px;color:var(--muted)">'+(r.duong?'Dương độn: Lục Nghi đi thuận cửu cung, Tam Kỳ đi nghịch.':'Âm độn: Lục Nghi đi nghịch cửu cung, Tam Kỳ đi thuận.')+' Ba số của tiết này — Thượng: '+r.cuc[0]+' · Trung: '+r.cuc[1]+' · Hạ: '+r.cuc[2]+'.</span>';
});

// C · Phù đầu & Tam nguyên theo Can Chi ngày (Bước 2)
var selNgayCC=document.getElementById('selNgayCC');
for(var k60=0;k60<60;k60++){var o60=document.createElement('option');o60.value=k60;o60.textContent=KyMon.canChi(k60);selNgayCC.appendChild(o60);}
document.getElementById('btnPhuDau').addEventListener('click',function(){
  var d=parseInt(selNgayCC.value,10), r=KyMon.buoc2(d,0), lui=(d%10)%5;
  var out=document.getElementById('outPhuDau'); out.classList.add('show');
  out.innerHTML='Ngày <strong>'+KyMon.canChi(d)+'</strong> '+(lui?'lùi '+lui+' ngày':'chính là ngày Phù đầu')+' → Phù đầu <span style="font-size:20px;font-weight:800;color:var(--red)">'+KyMon.canChi(r.phuDau)+'</span> thuộc <strong>'+r.nhomChi+'</strong> → <strong>'+KyMon.NGUYEN[r.nguyen]+'</strong>.<br><span style="font-size:13px;color:var(--muted)">Tứ Chính (Tý, Ngọ, Mão, Dậu) là Thượng nguyên; Tứ Sinh (Dần, Thân, Tỵ, Hợi) là Trung nguyên; Tứ Mộ (Thìn, Tuất, Sửu, Mùi) là Hạ nguyên. Ghép với tiết khí ở bảng B để ra Cục số.</span>';
});

// D · Tuần thủ, Cờ, Không Vong, Mã Tinh theo Can Chi giờ (Bước 4, 9, 10)
var selGioCC=document.getElementById('selGioCC');
for(var g60=0;g60<60;g60++){var og=document.createElement('option');og.value=g60;og.textContent=KyMon.canChi(g60);selGioCC.appendChild(og);}
selGioCC.value=6; // Canh Ngọ — ví dụ của tài liệu
document.getElementById('btnTuan').addEventListener('click',function(){
  var g=parseInt(selGioCC.value,10), r=KyMon.anBan(true,1,g%10,g%12);
  var out=document.getElementById('outTuan'); out.classList.add('show');
  out.innerHTML='Giờ <strong>'+KyMon.canChi(g)+'</strong> thuộc tuần <span style="font-size:20px;font-weight:800;color:var(--red)">'+KyMon.canChi(r.tuanThu)+'</span>, mang cờ <strong>'+KyMon.CAN[r.co]+'</strong>.<br>Không Vong: <strong>'+r.khongVong.chi.map(function(c){return KyMon.CHI[c];}).join(', ')+'</strong> (cung '+r.khongVong.cung.map(function(p){return KyMon.CUNG[p].ten+' '+p;}).join(', ')+') · Mã Tinh tại <strong>'+KyMon.CHI[r.ma.chi]+'</strong> (cung '+KyMon.CUNG[r.ma.cung].ten+' '+r.ma.cung+').<br><span style="font-size:13px;color:var(--muted)">Tìm cung của cờ '+KyMon.CAN[r.co]+' trên Địa bàn để ra Đại Trực Phù và Trực Sử (Bước 5).</span>';
});

// Fields 11 — clicking a field opens the Tra Cuu page with that field selected
var FIELDS=[["Bệnh tật","Sức khỏe, thời điểm thăm khám & hồi phục"],["Hôn nhân","Tình cảm, cưới hỏi, hòa hợp đôi lứa"],["Kinh doanh","Ký kết, mở bán, đối tác & dòng tiền"],["Công danh","Thi cử quan lộc, thăng tiến, bổ nhiệm"],["Tài vận","Đầu tư, vay mượn, thu hồi nợ"],["Gia trạch","Nhà đất, xây sửa, an cư"],["Pháp lý","Kiện tụng, hợp đồng, tranh chấp"],["Thất vật","Tìm đồ mất, giấy tờ thất lạc"],["Xuất hành","Đi xa, chuyển việc, khai trương"],["Học tập","Học hành, thi cử, chọn trường"],["Thể thao","Thi đấu, phong độ, kết quả trận đấu"]];
var fw=document.getElementById('fields');
FIELDS.forEach(function(f){
  var a=document.createElement('a'); a.className='field'; a.href='#/tra-cuu/cong-cu?linhvuc='+encodeURIComponent(f[0]); a.style.textDecoration='none'; a.style.color='var(--ink)';
  a.innerHTML='<b>'+f[0]+'</b><span>'+f[1]+'</span>';
  fw.appendChild(a);
});

// Tra cuu tool
var mode='dudoan', modeName={dudoan:'Dự đoán',chonngay:'Chọn ngày',lapban:'Lập bàn'};
var CAST_LABEL={dudoan:'Lập trận & xem kết quả',chonngay:'Tìm ngày thuận',lapban:'Lập bàn'};
function setMode(m){
  mode=m;
  document.querySelectorAll('.tab[data-mode]').forEach(function(x){var on=x.getAttribute('data-mode')===m;x.classList.toggle('active',on);x.setAttribute('aria-pressed',on?'true':'false');});
  document.getElementById('btnCast').textContent=CAST_LABEL[m];
  if(document.getElementById('castResult').classList.contains('show'))cast(false);
}
document.querySelectorAll('.tab[data-mode]').forEach(function(t){t.addEventListener('click',function(){setMode(t.getAttribute('data-mode'));});});
var fQ=document.getElementById('fQ');
fQ.addEventListener('input',function(){document.getElementById('qCount').textContent=fQ.value.length;});
// ===== Quy đổi giờ: nơi lập trận (múi giờ, kinh độ), giờ Mặt Trời thật, quy ước giờ Tý =====
var QD_IDS=['fNoi','fGioDung','fDoiNgay'];
QD_IDS.forEach(function(id){
  var el=document.getElementById(id);
  try{var v=localStorage.getItem('kymon.'+id); if(v!==null&&[].some.call(el.options,function(o){return o.value===v;}))el.value=v;}catch(e){}
  el.addEventListener('change',function(){try{localStorage.setItem('kymon.'+id,el.value);}catch(e){} if(document.getElementById('castResult').classList.contains('show'))cast(false);});
});
function tuyChon(){
  var noi=document.getElementById('fNoi').value.split('|'), kd=noi[1]?parseFloat(noi[1]):null;
  return {muiGio:noi[0]||'', kinhDo:kd, gioMatTroi:document.getElementById('fGioDung').value==='mt'&&kd!==null, doiNgay:document.getElementById('fDoiNgay').value,
    tenNoi:document.getElementById('fNoi').selectedOptions[0].textContent.split(' — ')[0], muonMT:document.getElementById('fGioDung').value==='mt'};
}
function nhapThoiDiem(str,tc){ // "YYYY-MM-DDTHH:MM" là giờ đồng hồ tại nơi lập trận
  var m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(str||'');
  if(!m)return Date.now();
  return KyMon.thoiDiemTuGioDongHo(+m[1],+m[2],+m[3],+m[4],+m[5],tc.muiGio);
}
function chuoiGioDongHo(ms,mui){var g=KyMon.gioDongHo(ms,mui);return g.y+'-'+pad2(g.m)+'-'+pad2(g.d)+'T'+pad2(g.h)+':'+pad2(g.mi);}
document.getElementById('fTime').value=chuoiGioDongHo(Date.now(),tuyChon().muiGio);
// ===== Lập bàn: bộ máy 12 bước nằm trong src/kymon.js (biến KyMon) =====
var CAN=KyMon.CAN, CHI=KyMon.CHI, CUNG=KyMon.CUNG, cc=KyMon.canChi;
function tenCan(i){return CAN[i];}
function huongCung(p){return CUNG[p].huong+' · '+CUNG[p].hanh;}
function laTamKy(i){return i===1||i===2||i===3;} // Ất, Bính, Đinh
var DOOR_NATURE={"Khai Môn":"cat","Hưu Môn":"cat","Sinh Môn":"cat","Cảnh Môn":"trung","Đỗ Môn":"trung","Thương Môn":"hung","Tử Môn":"hung","Kinh Môn":"hung","—":"trung"};
// Dụng thần theo lĩnh vực: dò lần lượt từng ký hiệu trong `tim`; cung đầu tiên có ký hiệu đó là cung Dụng thần.
// Thứ tự trong `tim` trùng với thứ tự ghi trong nhãn hiển thị.
var FIELD_DUNG={
 "Kinh doanh":{tim:[["mon","Sinh Môn"],["tinh","Thiên Tâm"]],label:"Sinh Môn + Thiên Tâm (tài lộc, điều hành)"},
 "Bệnh tật":{tim:[["tinh","Thiên Nhuế"],["tinh","Thiên Tâm"]],label:"Thiên Nhuế (bệnh trạng) + Thiên Tâm (thầy thuốc)"},
 "Hôn nhân":{tim:[["than","Lục Hợp"],["mon","Hưu Môn"]],label:"Lục Hợp + Hưu Môn (hòa hợp đôi lứa)"},
 "Công danh":{tim:[["mon","Khai Môn"],["tinh","Thiên Phụ"]],label:"Khai Môn + Thiên Phụ (văn thư, bổ nhiệm)"},
 "Tài vận":{tim:[["mon","Sinh Môn"],["tinh","Thiên Tâm"]],label:"Sinh Môn (tài lộc) + Thiên Tâm (người quản tài)"},
 "Gia trạch":{tim:[["tinh","Thiên Nhậm"],["mon","Sinh Môn"]],label:"Thiên Nhậm + Sinh Môn (đất đai, an cư)"},
 "Pháp lý":{tim:[["mon","Khai Môn"],["tinh","Thiên Tâm"]],label:"Khai Môn + Thiên Tâm (phán quyết, người cầm cân)"},
 "Thất vật":{tim:[["than","Huyền Vũ"],["tinh","Thiên Bồng"]],label:"Huyền Vũ + Thiên Bồng (vật mất, hướng tìm)"},
 "Xuất hành":{tim:[["mon","Khai Môn"],["tinh","Thiên Xung"]],label:"Khai Môn + Thiên Xung (xuất hành, khai trương)"},
 "Học tập":{tim:[["tinh","Thiên Phụ"],["mon","Cảnh Môn"]],label:"Thiên Phụ + Cảnh Môn (học hành, thi cử)"},
 "Thể thao":{tim:[["tinh","Thiên Xung"],["mon","Thương Môn"]],label:"Thiên Xung + Thương Môn (thi đấu, tốc độ)"}};
function buildBoard(date){return KyMon.lapTran(date,tuyChon());}
// Ký hiệu của một cung, đã đổi sang chữ để hiển thị.
function oCung(b,p){
  var t=b.thien[p];
  return {
    than:b.than[p]||'—', tinh:t?t.tinh.join(' · '):'—', tinhDs:t?t.tinh:[], mon:b.mon[p]||'—',
    thienCan:t?t.can.map(tenCan).join(' · '):'—', thienCanDs:t?t.can:[], diaCan:tenCan(b.dia[p]),
    amCan:tenCan(b.amCan[p]), amCanSo:b.amCan[p], thanDia:b.thanDia[p]||'—',
    ma:b.ma.cung===p, kv:b.khongVong.cung.indexOf(p)>=0, trucPhu:p===b.cungDenTP, trucSu:p===b.cungDenTS
  };
}
function findDungPal(b,dung){
  for(var i=0;i<dung.tim.length;i++){
    var loai=dung.tim[i][0], ten=dung.tim[i][1];
    for(var p=1;p<=9;p++){
      if(p===5)continue;
      var o=oCung(b,p);
      if((loai==='mon'&&o.mon===ten)||(loai==='than'&&o.than===ten)||(loai==='tinh'&&o.tinhDs.indexOf(ten)>=0))return {pal:p,theo:ten};
    }
  }
  return {pal:b.cungDenTP,theo:b.trucPhu};
}
function pad2(n){return (n<10?'0':'')+n;}
function toLocalInput(d){return chuoiGioDongHo(d.getTime(),tuyChon().muiGio);}
var lastBoard=null;
// "Chon ngay": xét 10 ngày tới cùng khung giờ, giữ ngày mà cung Dụng thần hội ít nhất hai dấu hiệu tốt
// (Tam Kỳ, Thần cát, Tinh cát) và không rơi vào Không Vong (Bước 10: "Cát phùng Không tắc bất cát").
var GOOD_GODS=["Trực Phù","Thái Âm","Lục Hợp","Cửu Địa","Cửu Thiên"], GOOD_STARS=["Thiên Phụ","Thiên Tâm","Thiên Nhậm","Thiên Xung","Thiên Cầm"];
function renderDays(date,field){
  var dung=FIELD_DUNG[field]||FIELD_DUNG["Kinh doanh"], wrap=document.getElementById('rDays'), found=0;
  wrap.innerHTML='';
  for(var i=1;i<=10;i++){
    var d=new Date(date.getTime()+i*86400000); // cùng giờ đồng hồ, sau i ngày
    var b=buildBoard(d), pal=findDungPal(b,dung).pal, o=oCung(b,pal), why=[];
    if(o.kv)continue;
    var ky=o.thienCanDs.filter(laTamKy); if(ky.length)why.push('Tam Kỳ '+ky.map(tenCan).join(', '));
    if(GOOD_GODS.indexOf(o.than)>=0)why.push(o.than);
    var sao=o.tinhDs.filter(function(s){return GOOD_STARS.indexOf(s)>=0;}); if(sao.length)why.push(sao[0]);
    if(why.length<2)continue;
    found++;
    var btn=document.createElement('button'); btn.type='button'; btn.className='tab';
    btn.textContent=pad2(d.getDate())+'/'+pad2(d.getMonth()+1)+' · '+cc(b.tuTru.ngay)+' · '+why.join(' + ')+' tại '+CUNG[pal].ten;
    (function(day){btn.addEventListener('click',function(){document.getElementById('fTime').value=toLocalInput(day);cast(true);});})(d);
    wrap.appendChild(btn);
  }
  document.getElementById('rDaysNote').textContent=found?('Có '+found+' ngày mà cung Dụng thần của lĩnh vực "'+field+'" hội được ít nhất hai yếu tố tốt (Tam Kỳ, Thần cát, Tinh cát) và không gặp Không Vong vào giờ này. Đây là gợi ý rút gọn — bấm một ngày để lập lại bàn cho đúng ngày đó.'):('Trong 10 ngày tới, vào khung giờ này chưa có ngày nào cung Dụng thần của lĩnh vực "'+field+'" hội đủ hai yếu tố tốt mà không gặp Không Vong. Hãy thử đổi sang khung giờ khác rồi tìm lại.');
}
function hhmm(g){return pad2(g.h)+':'+pad2(g.mi);}
function ngayGio(g){return hhmm(g)+' ngày '+pad2(g.d)+'/'+pad2(g.m)+'/'+g.y;}
function lechTxt(phut){var s=phut<0?'−':'+';phut=Math.abs(Math.round(phut));return s+Math.floor(phut/60)+':'+pad2(phut%60);}
function renderQuyDoi(b){
  var q=b.quyDoi, tc=tuyChon(), rows=[], utc=q.utc;
  rows.push(['Nơi lập trận',tc.tenNoi+(q.kinhDo!==null?' (kinh độ '+String(q.kinhDo).replace('.',',')+'° Đông)':'')]);
  rows.push(['Giờ đồng hồ tại nơi lập trận',ngayGio(q.dongHo)+' (UTC'+lechTxt(q.lechMui)+')']);
  rows.push(['Giờ quốc tế (UTC)',ngayGio(KyMon.gioDongHo(utc,'UTC'))]);
  rows.push(['Giờ Bắc Kinh — để đối chiếu với ứng dụng Trung Quốc',ngayGio(KyMon.gioDongHo(utc,'Asia/Shanghai'))]);
  if(q.kinhDo!==null){
    var tb=new Date(utc+q.kinhDo*4*60000), th=new Date(utc+(q.kinhDo*4+q.eot)*60000);
    var g=function(d){return {y:d.getUTCFullYear(),m:d.getUTCMonth()+1,d:d.getUTCDate(),h:d.getUTCHours(),mi:d.getUTCMinutes()};};
    rows.push(['Giờ Mặt Trời trung bình (theo kinh độ)',ngayGio(g(tb))+' — chênh '+((q.kinhDo*4-q.lechMui)>=0?'+':'−')+Math.abs(q.kinhDo*4-q.lechMui).toFixed(1).replace('.',',')+' phút so với giờ đồng hồ']);
    rows.push(['Phương trình thời gian',(q.eot>=0?'+':'−')+Math.abs(q.eot).toFixed(1).replace('.',',')+' phút']);
    rows.push(['Giờ Mặt Trời thật',ngayGio(g(th))]);
  }
  rows.push(['Giờ dùng để đổi Can Chi',q.gioMatTroi?'Giờ Mặt Trời thật — '+hhmm(q.gioDung)+', giờ '+CHI[b.chiGio]:(tc.muonMT?'Giờ đồng hồ (chưa chọn nơi có kinh độ nên chưa dùng được giờ Mặt Trời thật)':'Giờ đồng hồ — '+hhmm(q.gioDung)+', giờ '+CHI[b.chiGio])]);
  rows.push(['Quy ước giờ Tý',q.doiNgay==='23'?'Đổi ngày lúc 23h (giờ Tý sớm)':'Đổi ngày lúc 0h (giờ Tý muộn: 23h – 24h giữ ngày cũ, Can giờ theo ngày hôm sau)']);
  rows.push(['Giao tiết '+b.tenTiet,KyMon.dinhDangGio(b.giaoTiet,q.muiGio)+' (giờ Bắc Kinh '+KyMon.dinhDangGio(b.giaoTiet,'Asia/Shanghai')+')']);
  rows.push(['Giao tiết kế tiếp — '+KyMon.TIET[(b.tiet+1)%24].ten,KyMon.dinhDangGio(b.tietTiep,q.muiGio)]);
  rows.push(['Nguồn giờ giao tiết',b.nguonTiet==='bang'?'Bảng Thọ Tinh vạn niên lịch (1900 – 2100), chính xác tới phút':'Công thức kinh độ Mặt Trời (ngoài 1900 – 2100), sai số khoảng 15 phút']);
  document.getElementById('kmQuyDoiBody').innerHTML='<div class="table-wrap"><table><tbody>'+rows.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>';}).join('')+'</tbody></table></div>';
}
function chip(on,cls,text){return on?'<span class="km-chip '+cls+'">'+text+'</span>':'';}
function renderBoard(board,field){
  lastBoard=board;
  var dung=FIELD_DUNG[field]||FIELD_DUNG["Kinh doanh"];
  var found=findDungPal(board,dung), dungPal=found.pal;
  board.dungPal=dungPal; board.dung=dung; board.dungTheo=found.theo;
  var tt=board.tuTru, gioTy=board.quyDoi.gioDung.h>=23&&board.quyDoi.doiNgay==='23';
  renderQuyDoi(board);
  var dacBiet=board.canGio===0?'Giờ Lục Giáp':(board.phucNgam?'Phục ngâm toàn trận':(board.phanNgam?'Phản ngâm toàn trận':''));
  document.getElementById('kmMeta').innerHTML=
   '<div class="mbox"><small>Tứ trụ</small><b>Ngày '+cc(tt.ngay)+' · giờ '+cc(tt.gio)+'</b><span>Năm '+cc(tt.nam)+' · tháng '+cc(tt.thang)+(gioTy?' · sau 23h tính sang ngày hôm sau':'')+'</span></div>'+
   '<div class="mbox"><small>Tiết khí · Cục</small><b>'+board.tenTiet+' — '+(board.duong?'Dương':'Âm')+' '+board.cuc+' cục</b><span>Phù đầu '+cc(board.phuDau)+' ('+board.nhomChi+') → '+KyMon.NGUYEN[board.nguyen]+' · giao tiết '+KyMon.dinhDangGio(board.giaoTiet,board.quyDoi.muiGio)+'</span></div>'+
   '<div class="mbox"><small>Trực Phù · Trực Sử</small><b>'+board.trucPhu+' · '+board.trucSu+'</b><span>Tuần '+cc(board.tuanThu)+', cờ '+tenCan(board.co)+' ở cung '+board.cungCo+' · Trực Phù tới '+CUNG[board.cungDenTP].ten+' '+board.cungDenTP+', Trực Sử tới '+CUNG[board.cungDenTS].ten+' '+board.cungDenTS+'</span></div>'+
   '<div class="mbox"><small>Mã Tinh · Không Vong</small><b>Mã '+CUNG[board.ma.cung].ten+' '+board.ma.cung+' · KV '+board.khongVong.cung.map(function(p){return CUNG[p].ten+' '+p;}).join(', ')+'</b><span>Mã tại '+CHI[board.ma.chi]+' · Không Vong '+board.khongVong.chi.map(function(c){return CHI[c];}).join(', ')+(dacBiet?' · '+dacBiet:'')+'</span></div>';
  var order=[4,9,2,3,5,7,8,1,6]; var grid=document.getElementById('kmGrid'); grid.innerHTML='';
  order.forEach(function(p){
    var o=oCung(board,p);
    var nature=DOOR_NATURE[o.mon]||"trung";
    var badge=nature==="cat"?"CÁT":(nature==="hung"?"HUNG":"TRUNG");
    var cell=document.createElement('button'); cell.type='button'; cell.className='km-cell'+(p===5?' is-center':'')+(p===dungPal?' is-dung':''); cell.setAttribute('data-pal',p);
    cell.innerHTML='<div class="km-top"><span class="km-than">'+o.than+'</span><span class="km-badge '+nature+'">'+badge+'</span></div>'+
      '<div class="km-pal">'+CUNG[p].ten+' · '+p+' — '+huongCung(p)+'</div>'+
      '<div class="km-star">'+o.tinh+'</div><div class="km-door">'+o.mon+'</div>'+
      '<div class="km-cans"><span>Thiên: <b>'+o.thienCan+'</b></span><span>Địa: <b>'+o.diaCan+'</b></span></div>'+
      '<div class="km-cans km-am"><span>Ám can: <b>'+o.amCan+'</b></span><span>Ám thần: <b>'+o.thanDia+'</b></span></div>'+
      '<div class="km-flags">'+chip(o.trucPhu,'tp','Trực Phù')+chip(o.trucSu,'ts','Trực Sử')+chip(o.ma,'ma','Mã')+chip(o.kv,'kv','KV')+'</div>';
    cell.addEventListener('click',function(){
      document.querySelectorAll('.km-cell').forEach(function(c){c.classList.remove('sel');}); cell.classList.add('sel');
      var d=document.getElementById('palaceDetail'), ky=o.thienCanDs.filter(laTamKy);
      var y=[];
      if(p===5)y.push('Trung cung không có Sao, Môn, Thần riêng: Thiên Cầm cùng can Trung cung đi kèm Thiên Nhuế, Môn và Thần gửi sang Khôn 2.');
      else y.push(nature==="cat"?'Môn ở cung này thuộc nhóm cát — thuận cho việc khởi sự, gặp gỡ và cam kết trong phạm vi lĩnh vực đang xem.':nature==="hung"?'Môn ở cung này thuộc nhóm hung — nên thận trọng, kiểm tra kỹ điều kiện và tránh quyết định vội tại hướng / mảng việc thuộc cung này.':'Môn ở cung này trung tính — kết quả tùy tổ hợp Tinh – Thần đi cùng và quan hệ sinh khắc với cung Dụng thần.');
      if(ky.length)y.push('Thiên Can có Tam Kỳ ('+ky.map(tenCan).join(', ')+') — điểm sáng trong cung, đặc biệt tốt khi gặp Môn cát.');
      if(laTamKy(o.amCanSo))y.push('Ám can '+o.amCan+' là Tam Kỳ — có trợ lực ngầm.');
      if(o.amCanSo===6||o.amCanSo===7)y.push('Ám can '+o.amCan+' — đề phòng cản trở, phá hoại từ bên trong khi gặp hung môn, hung tinh.');
      if(o.ma)y.push('Cung có Mã Tinh — nơi sự việc chuyển động mạnh nhất: xuất hành, đổi chỗ, tin tức.');
      if(o.kv)y.push('Cung gặp Không Vong — cát hung đều giảm, sự việc dễ hư, chưa ngã ngũ cho tới khi điền thực hoặc xung không.');
      d.innerHTML='<h4>Cung '+CUNG[p].ten+' ('+p+') — '+huongCung(p)+(p===dungPal?' · Cung Dụng thần':'')+'</h4><p><strong>'+o.than+' · '+o.tinh+' · '+o.mon+'</strong> · Thiên Can <strong>'+o.thienCan+'</strong> / Địa Can <strong>'+o.diaCan+'</strong> · Ám can <strong>'+o.amCan+'</strong> · Ám thần <strong>'+o.thanDia+'</strong>. '+y.join(' ')+'</p>';
    });
    grid.appendChild(cell);
  });
  document.getElementById('kmStepList').innerHTML=KyMon.trinhTu(board).map(function(s){return '<li><b>Bước '+s.buoc+' · '+s.ten+'</b><span>'+s.ketQua+'</span></li>';}).join('');
  // Dung / pattern analysis
  var od=oCung(board,dungPal), dungNature=DOOR_NATURE[od.mon];
  var ky=od.thienCanDs.filter(laTamKy);
  var catCount=0,hungCount=0; for(var q=1;q<=9;q++){var n=DOOR_NATURE[board.mon[q]]; if(n==="cat")catCount++; if(n==="hung")hungCount++;}
  document.getElementById('rDung').textContent='Dụng thần lấy '+dung.label+'. Trong bàn này '+found.theo+' rơi tại cung '+CUNG[dungPal].ten+' ('+dungPal+') với '+od.tinh+', '+od.mon+', '+od.than+', Thiên Can '+od.thienCan+' / Địa Can '+od.diaCan+', Ám can '+od.amCan+'. '+(dungNature==="cat"?'Môn tại cung Dụng thuộc nhóm cát — việc có cửa mở rõ ràng.':dungNature==="hung"?'Môn tại cung Dụng thuộc nhóm hung — việc dễ nghẽn ở khâu thực thi, cần đổi thời điểm hoặc cách tiếp cận.':'Môn tại cung Dụng trung tính — cần thêm tín hiệu xác nhận trước khi chốt.')+(ky.length?' Cung Dụng gặp Tam Kỳ '+ky.map(tenCan).join(', ')+' — cách cục sáng, thường gọi là Tam Kỳ đắc địa / đắc Môn khi đi cùng Môn cát.':'')+(od.ma?' Mã Tinh cùng cung — việc chuyển động nhanh.':'')+(od.kv?' Cung Dụng gặp Không Vong — kết quả dễ hư, nên chờ tới ngày giờ điền thực hoặc xung không.':'');
  document.getElementById('rRead').textContent='Toàn bàn có '+catCount+' cung Môn cát, '+hungCount+' cung Môn hung. Đại Trực Phù '+board.trucPhu+' tới cung '+board.cungDenTP+' ('+CUNG[board.cungDenTP].huong+'), Trực Sử '+board.trucSu+' tới cung '+board.cungDenTS+' ('+CUNG[board.cungDenTS].huong+'): đây là trọng tâm và hướng hành động chính của việc. Mã Tinh ở '+CUNG[board.ma.cung].huong+', Không Vong ở '+board.khongVong.cung.map(function(p){return CUNG[p].huong;}).join(' và ')+'.'+(dacBiet?' Bàn thuộc trường hợp '+dacBiet+'.':'')+' Đọc nhanh: ưu tiên hướng và mảng việc của các cung Cát (Khai, Hưu, Sinh), tránh dồn lực vào cung Tử / Kinh / Thương hoặc cung Không Vong trong thời điểm này.';
  return {dungPal:dungPal,dungNature:dungNature,catCount:catCount};
}
function cast(scroll){
  var field=document.getElementById('fField').value;
  var q=fQ.value.trim()||'(Chưa nhập câu hỏi cụ thể — luận giải theo cục diện chung của lĩnh vực đã chọn.)';
  var t=document.getElementById('fTime').value;
  var tc=tuyChon(), date=new Date(t?nhapThoiDiem(t,tc):Date.now()); if(isNaN(date.getTime()))date=new Date();
  var board=buildBoard(date); var info=renderBoard(board,field);
  var tone=info.dungNature==="cat"?1:(info.dungNature==="hung"?2:0);
  document.getElementById('castTitle').textContent=modeName[mode]+' · '+field+' — '+(board.duong?'Dương độn':'Âm độn')+' '+board.cuc+' cục';
  document.getElementById('castMeta').textContent='Thời điểm: '+(t?t.replace('T',' lúc '):'hiện tại')+(tc.muiGio?' (giờ tại '+tc.tenNoi+')':'')+(board.quyDoi.gioMatTroi?' · giờ Mặt Trời thật '+hhmm(board.quyDoi.gioDung):'')+' · Tiết '+board.tenTiet+' · Câu hỏi: “'+q+'”';
  var NOW=[
    'Cục diện hiện tại còn đang chuyển động: Dụng thần chưa gặp Môn cát, việc "'+field.toLowerCase()+'" đang ở thế thăm dò, chưa nên chốt vội.',
    'Hiện trạng cho thấy nền việc đã có sẵn, Dụng thần đứng ở cung có sinh khí — bạn đang có một điểm tựa thực tế để bắt đầu.',
    'Hiện trạng hơi nghẽn: có dấu hiệu chờ đợi thông tin hoặc chờ một người chủ chốt lên tiếng trước khi việc tiến thêm được.'];
  var PRED=[
    'Dự đoán trong thời gian gần: xuất hiện một tín hiệu rõ ràng hơn (tin tức, phản hồi hoặc một cuộc hẹn) giúp việc định hình. Ai nôn nóng ép tiến độ lúc này dễ làm lệch cục.',
    'Dự đoán: việc tiến theo chiều hướng thuận dần nếu giữ đúng trình tự — xử lý phần giấy tờ / cam kết trước, phần tiền bạc và con người theo sau.',
    'Dự đoán: có một trở ngại nhỏ mang tính thủ tục hoặc thời gian; không phải bế tắc bản chất, nhưng cần thêm một vòng xác nhận mới thông.'];
  var PROS=[
    'Triển vọng trung hạn ở mức khả quan nếu chọn đúng thời điểm hành động sau khi định cục lại theo ngày thực tế dự định làm việc.',
    'Triển vọng: kết quả tốt hơn khi thu hẹp mục tiêu — làm chắc một phần việc thay vì dàn trải nhiều đầu mối cùng lúc.',
    'Triển vọng phụ thuộc nhiều vào đối tác / người phối hợp: nên có phương án dự phòng về thời gian và người thay thế.'];
  var CONC=[
    'Kết luận: Thuận để chuẩn bị và thăm dò, chưa thuận để cam kết lớn ngay. Hãy định lại cục vào đúng ngày giờ dự định hành động trước khi quyết định cuối cùng.',
    'Kết luận: Có thể tiến hành, ưu tiên làm sớm trong khung giờ tốt của ngày đã chọn và giữ lại một điều khoản linh hoạt để xoay chuyển khi cần.',
    'Kết luận: Nên chậm lại một nhịp — bổ sung thông tin còn thiếu, đối chiếu lại định cục (tiết khí, nguyên, Cục số) rồi mới hành động sẽ vững hơn.'];
  document.getElementById('rNow').textContent=NOW[tone];
  document.getElementById('rPred').textContent=PRED[tone];
  document.getElementById('rPros').textContent=PROS[(tone+1)%3];
  document.getElementById('rConc').textContent=CONC[tone];
  document.querySelectorAll('[data-luan]').forEach(function(x){x.hidden=(mode==='lapban');});
  document.getElementById('rDaysBox').hidden=(mode!=='chonngay');
  if(mode==='chonngay')renderDays(date,field);
  document.getElementById('palaceDetail').innerHTML='<h4>Chi tiết cung</h4><p>Bấm vào một cung trên bàn để xem Tinh, Môn, Thần, Thiên/Địa Can và ý nghĩa của cung đó trong bàn này.</p>';
  resetAI(date,field,q,t);
  document.getElementById('castResult').classList.add('show');
  if(scroll)document.getElementById('castResult').scrollIntoView({behavior:'smooth',block:'nearest'});
}
document.getElementById('btnCast').addEventListener('click',function(){cast(true);});

// ===== Luan giai bang AI (qua may chu trung gian, xem worker/README.md) =====
// Dan dia chi Worker vao day de bat nut "Luan giai bang AI" (de trong = tat, trang chi dung
// luan giai soan san). KHONG bao gio dat khoa OpenAI trong tep nay: khoa nam tren Worker.
// Gia tri 'demo' (do `python3 build.py --demo` dat) cho chay thu giao dien: nut hien ra va tra ve
// mot ban MINH HOA soan ngay tren trinh duyet, khong goi AI va khong gui du lieu di dau.
var AI_ENDPOINT='';
var AI_DEMO=(AI_ENDPOINT==='demo');
var AI_NOTE=AI_DEMO?'BẢN DEMO — chưa nối với OpenAI. Bấm nút để xem cách phần luận giải bằng AI sẽ hiển thị; nội dung trả về là bản minh họa soạn ngay trên trình duyệt, không có dữ liệu nào được gửi đi.':'Bốn phần trên là luận giải soạn sẵn theo bàn. Bấm nút để nhận bản luận giải riêng cho câu hỏi của bạn. Khi bấm, bàn Kỳ Môn và câu hỏi được gửi tới dịch vụ AI (OpenAI) để xử lý.';
function demoAnswer(req){
  var b=req.board, d=b.palaces[b.cungDungThan-1], q=req.question?('“'+req.question+'”'):'việc thuộc lĩnh vực '+req.field;
  var tag='[Minh họa] ';
  return {
    hienTrang:tag+'Với câu hỏi '+q+', bàn lập lúc '+b.thoiDiem+' thuộc '+b.cuc+'. Dụng thần ('+b.dungThan+') rơi tại cung '+d.so+' '+d.ten+' ('+d.huong+'), nơi có '+d.tinh+', '+d.mon+' và '+d.than+'.',
    duDoan:tag+'Tại cung Dụng thần, Thiên Can '+d.thienCan+' đi trên Địa Can '+d.diaCan+', Ám can '+d.amCan+'. Bản AI thật sẽ phân tích tổ hợp này cùng quan hệ sinh khắc với cung của người hỏi để nêu diễn biến gần.',
    trienVong:tag+b.trucPhu+', Trực Sử là '+b.trucSu+'. Bản AI thật sẽ dựa vào hướng và mảng việc của các cung này để nêu triển vọng trung hạn và điều cần chuẩn bị.',
    ketLuan:tag+'Đây là bản demo để xem bố cục; khi nối với OpenAI, bốn phần này sẽ là lời luận giải viết riêng cho bàn và câu hỏi của bạn. Nội dung chỉ mang tính tham khảo.'};
}
var aiRequest=null, aiSeq=0;
function resetAI(date,field,question,timeText){
  aiSeq++; // bo ket qua AI cua lan lap ban truoc neu no ve muon
  var board=lastBoard, palaces=[];
  for(var p=1;p<=9;p++){var o=oCung(board,p);palaces.push({so:p,ten:CUNG[p].ten,huong:huongCung(p),than:o.than,tinh:o.tinh,mon:o.mon,thienCan:o.thienCan,diaCan:o.diaCan,amCan:o.amCan,thanDia:o.thanDia,ma:o.ma,khongVong:o.kv});}
  aiRequest={mode:mode,field:field,question:fQ.value.trim(),board:{
    thoiDiem:timeText?timeText.replace('T',' '):toLocalInput(date).replace('T',' '),
    cuc:board.tenTiet+' — '+(board.duong?'Dương độn':'Âm độn')+' '+board.cuc+' cục, '+KyMon.NGUYEN[board.nguyen]+' (Phù đầu '+cc(board.phuDau)+')',
    ngayGio:'năm '+cc(board.tuTru.nam)+', tháng '+cc(board.tuTru.thang)+', ngày '+cc(board.tuTru.ngay)+', giờ '+cc(board.tuTru.gio),
    trucPhu:board.trucPhu+' tới cung '+board.cungDenTP,
    trucSu:board.trucSu+' tới cung '+board.cungDenTS,
    dungThan:board.dung.label,
    cungDungThan:board.dungPal,
    palaces:palaces}};
  var btn=document.getElementById('btnAI');
  document.getElementById('aiBar').hidden=!(AI_ENDPOINT&&mode!=='lapban');
  document.getElementById('aiNote').textContent=AI_NOTE;
  btn.disabled=false; btn.textContent='Luận giải bằng AI';
}
document.getElementById('btnAI').addEventListener('click',function(){
  if(!AI_ENDPOINT||!aiRequest)return;
  var btn=this, note=document.getElementById('aiNote'), seq=aiSeq;
  btn.disabled=true; btn.textContent='Đang luận giải…';
  var fail=function(msg){if(seq!==aiSeq)return;note.textContent=msg+' Bốn phần trên vẫn là luận giải soạn sẵn.';btn.disabled=false;btn.textContent='Thử lại';};
  var call=AI_DEMO?new Promise(function(done){var req=aiRequest;setTimeout(function(){done({ok:true,data:demoAnswer(req)});},900);})
    :fetch(AI_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(aiRequest)})
    .then(function(res){return res.json().then(function(data){return {ok:res.ok,data:data};},function(){return {ok:false,data:{}};});});
  call
    .then(function(r){
      if(seq!==aiSeq)return;
      if(!r.ok){fail(r.data&&r.data.error?r.data.error:'Chưa nhận được luận giải từ AI.');return;}
      document.getElementById('rNow').textContent=r.data.hienTrang;
      document.getElementById('rPred').textContent=r.data.duDoan;
      document.getElementById('rPros').textContent=r.data.trienVong;
      document.getElementById('rConc').textContent=r.data.ketLuan;
      note.textContent=AI_DEMO?'BẢN DEMO — bốn phần ở trên vừa được thay bằng nội dung minh họa (chưa phải AI viết). Khi nối với OpenAI, chỗ này sẽ là lời luận giải thật.':'Bốn phần Hiện trạng — Dự đoán — Triển vọng — Kết luận ở trên đã được thay bằng bản do AI viết theo bàn và câu hỏi của bạn. Nội dung chỉ mang tính tham khảo.';
      btn.textContent=AI_DEMO?'Đã hiển thị bản minh họa ✓':'Đã luận giải ✓';
      document.querySelector('[data-luan]').scrollIntoView({behavior:'smooth',block:'nearest'});
    })
    .catch(function(){fail('Không kết nối được máy chủ luận giải.');});
});

// ===== Dang ky (registration-of-interest slip; nothing is sent automatically) =====
// Dien email nhan dang ky vao day de bat nut "Gui qua email" (de trong = chi sao chep phieu).
var CONTACT_EMAIL='agencylehung@gmail.com';
var GOI={'que':'Theo quẻ — 49.000₫ / quẻ','thang':'Gói tháng — 199.000₫ / tháng','chuyen-gia':'Hiệu đính chuyên gia — 490.000₫ / quẻ'};
var GOI_DESC={'que':'Theo quẻ: luận giải 4 phần đầy đủ cho một việc cụ thể, chọn 1 trong 11 lĩnh vực.','thang':'Gói tháng: không giới hạn lập bàn & tra cứu, 30 quẻ luận giải mỗi tháng, chọn ngày cho nhiều việc.','chuyen-gia':'Hiệu đính chuyên gia: người có kinh nghiệm rà soát thủ công, kiểm tra lại định cục & Dụng thần và nhận xét riêng.'};
function applyDangKy(params){
  var sel=document.getElementById('dkGoi'); if(GOI[params.goi])sel.value=params.goi;
  document.getElementById('dkDesc').textContent=GOI_DESC[sel.value]+' Điền cách liên hệ thuận tiện nhất rồi tạo phiếu.';
}
document.getElementById('dkGoi').addEventListener('change',function(){applyDangKy({});document.getElementById('dkOut').classList.remove('show');});
document.getElementById('dkForm').addEventListener('submit',function(e){
  e.preventDefault();
  var goi=GOI[document.getElementById('dkGoi').value], name=document.getElementById('dkName').value.trim(), contact=document.getElementById('dkContact').value.trim(), note=document.getElementById('dkNote').value.trim();
  var text='PHIẾU ĐĂNG KÝ — TRẬN PHÁP KỲ MÔN\nGói: '+goi+'\nHọ tên: '+name+'\nLiên hệ: '+contact+'\nGhi chú: '+(note||'(không có)')+'\nNgày lập: '+new Date().toLocaleDateString('vi-VN');
  document.getElementById('dkText').textContent=text;
  var mail=document.getElementById('dkMail');
  if(CONTACT_EMAIL){mail.hidden=false;mail.href='mailto:'+CONTACT_EMAIL+'?subject='+encodeURIComponent('Đăng ký '+goi)+'&body='+encodeURIComponent(text);}else{mail.hidden=true;}
  document.getElementById('dkHint').textContent=CONTACT_EMAIL?'Bấm “Gửi qua email” để mở ứng dụng thư với phiếu đã điền sẵn, hoặc sao chép phiếu.':'Phiếu chưa được gửi đi. Hãy sao chép và gửi cho quản trị trang qua kênh bạn đang liên hệ.';
  document.getElementById('dkOut').classList.add('show');
});
document.getElementById('dkCopy').addEventListener('click',function(){
  var btn=this, text=document.getElementById('dkText').textContent;
  var done=function(ok){btn.textContent=ok?'Đã sao chép ✓':'Hãy bôi đen phiếu để sao chép';setTimeout(function(){btn.textContent='Sao chép phiếu';},2200);};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){done(true);},function(){done(false);});}
  else{var r=document.createRange();r.selectNodeContents(document.getElementById('dkText'));var sel=window.getSelection();sel.removeAllRanges();sel.addRange(r);var ok=false;try{ok=document.execCommand('copy');}catch(e){}done(ok);}
});

// Initial page (supports deep links like #/tra-cuu and the browser back button)
showPage(parseHash());
