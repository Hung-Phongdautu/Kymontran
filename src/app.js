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

// Cuc so table
var CUC=[
 ["Dương độn","Đông chí",1,7,4],["Dương độn","Tiểu hàn",2,8,5],["Dương độn","Đại hàn",3,9,6],["Dương độn","Lập xuân",8,5,2],["Dương độn","Vũ thủy",9,6,3],["Dương độn","Kinh trập",1,7,4],["Dương độn","Xuân phân",3,9,6],["Dương độn","Thanh minh",4,1,7],["Dương độn","Cốc vũ",5,2,8],["Dương độn","Lập hạ",4,1,7],["Dương độn","Tiểu mãn",5,2,8],["Dương độn","Mang chủng",6,3,9],
 ["Âm độn","Hạ chí",9,3,6],["Âm độn","Tiểu thử",8,2,5],["Âm độn","Đại thử",7,1,4],["Âm độn","Lập thu",2,5,8],["Âm độn","Xử thử",1,4,7],["Âm độn","Bạch lộ",9,3,6],["Âm độn","Thu phân",7,1,4],["Âm độn","Hàn lộ",6,9,3],["Âm độn","Sương giáng",5,8,2],["Âm độn","Lập đông",6,9,3],["Âm độn","Tiểu tuyết",5,8,2],["Âm độn","Đại tuyết",4,7,1]
];
var selTiet=document.getElementById('selTiet');
CUC.forEach(function(r,i){var o=document.createElement('option');o.value=i;o.textContent=r[1]+' ('+r[0]+')';selTiet.appendChild(o);});
document.getElementById('btnCuc').addEventListener('click',function(){
  var r=CUC[parseInt(selTiet.value,10)], ng=parseInt(document.getElementById('selNguyen').value,10);
  var ngName=["Thượng nguyên","Trung nguyên","Hạ nguyên"][ng], cuc=r[2+ng];
  var out=document.getElementById('outCuc'); out.classList.add('show');
  out.innerHTML='Tiết khí <strong>'+r[1]+'</strong> thuộc <strong>'+r[0]+'</strong> — '+ngName+' dùng: <span style="font-size:20px;font-weight:800;color:var(--red)">'+r[0].split(' ')[0]+' '+cuc+' cục</span><br><span style="font-size:13px;color:var(--muted)">'+(r[0]==='Dương độn'?'Dương độn: Lục Nghi đi thuận cửu cung, Tam Kỳ đi nghịch.':'Âm độn: Lục Nghi đi nghịch cửu cung, Tam Kỳ đi thuận.')+' Ba số của tiết này — Thượng: '+r[2]+' · Trung: '+r[3]+' · Hạ: '+r[4]+'.</span>';
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
var now=new Date(); now.setMinutes(now.getMinutes()-now.getTimezoneOffset());
document.getElementById('fTime').value=now.toISOString().slice(0,16);
// ===== Ky Mon full board engine (original implementation, Chuyen ban style) =====
var STEMS10=["Giáp","Ất","Bính","Đinh","Mậu","Kỷ","Canh","Tân","Nhâm","Quý"];
var BRANCH12=["Tý","Sửu","Dần","Mão","Thìn","Tỵ","Ngọ","Mùi","Thân","Dậu","Tuất","Hợi"];
var DIA_SEQ=["Mậu","Kỷ","Canh","Tân","Nhâm","Quý","Đinh","Bính","Ất"];
var RING=[1,8,3,4,9,2,7,6]; // clockwise outer ring from North
var PAL_INFO={1:{name:"KHẢM",dir:"Bắc · Thủy",star:"Thiên Bồng",door:"Hưu Môn",nature:"hung"},2:{name:"KHÔN",dir:"Tây Nam · Thổ",star:"Thiên Nhuế",door:"Tử Môn",nature:"hung"},3:{name:"CHẤN",dir:"Đông · Mộc",star:"Thiên Xung",door:"Thương Môn",nature:"hung"},4:{name:"TỐN",dir:"Đông Nam · Mộc",star:"Thiên Phụ",door:"Đỗ Môn",nature:"trung"},5:{name:"TRUNG",dir:"Trung tâm · Thổ",star:"Thiên Cầm",door:"—",nature:"cat"},6:{name:"CÀN",dir:"Tây Bắc · Kim",star:"Thiên Tâm",door:"Khai Môn",nature:"cat"},7:{name:"ĐOÀI",dir:"Tây · Kim",star:"Thiên Trụ",door:"Kinh Môn",nature:"hung"},8:{name:"CẤN",dir:"Đông Bắc · Thổ",star:"Thiên Nhậm",door:"Sinh Môn",nature:"cat"},9:{name:"LY",dir:"Nam · Hỏa",star:"Thiên Anh",door:"Cảnh Môn",nature:"trung"}};
var DOOR_NATURE={"Khai Môn":"cat","Hưu Môn":"cat","Sinh Môn":"cat","Cảnh Môn":"trung","Đỗ Môn":"trung","Thương Môn":"hung","Tử Môn":"hung","Kinh Môn":"hung","—":"trung"};
var FIELD_DUNG={"Kinh doanh":{door:"Sinh Môn",star:"Thiên Tâm",label:"Sinh Môn + Thiên Tâm (tài lộc, điều hành)"},"Bệnh tật":{door:"Hưu Môn",star:"Thiên Tâm",label:"Thiên Tâm + Thiên Nhuế (bệnh trạng, thầy thuốc)"},"Hôn nhân":{door:"Hưu Môn",star:"Thiên Phụ",label:"Lục Hợp + Hưu Môn (hòa hợp đôi lứa)"},"Công danh":{door:"Khai Môn",star:"Thiên Phụ",label:"Khai Môn + Thiên Phụ (văn thư, bổ nhiệm)"},"Tài vận":{door:"Sinh Môn",star:"Thiên Tâm",label:"Sinh Môn (tài) + cung Can ngày (bản thân)"},"Gia trạch":{door:"Sinh Môn",star:"Thiên Nhậm",label:"Thiên Nhậm + Sinh Môn (đất đai, an cư)"},"Pháp lý":{door:"Khai Môn",star:"Thiên Tâm",label:"Khai Môn + Thiên Tâm (phán quyết, người cầm cân)"},"Thất vật":{door:"Hưu Môn",star:"Thiên Bồng",label:"Huyền Vũ + Thiên Bồng (vật mất, hướng tìm)"},"Xuất hành":{door:"Khai Môn",star:"Thiên Xung",label:"Khai Môn theo hướng cung (xuất hành, khai trương)"},"Học tập":{door:"Cảnh Môn",star:"Thiên Phụ",label:"Thiên Phụ + Cảnh Môn (học hành, thi cử)"},"Thể thao":{door:"Thương Môn",star:"Thiên Xung",label:"Thiên Xung + Thương Môn (thi đấu, tốc độ)"}};
var TIET_START=[[0,5],[0,20],[1,4],[1,19],[2,5],[2,20],[3,5],[3,20],[4,5],[4,21],[5,5],[5,21],[6,7],[6,22],[7,7],[7,23],[8,7],[8,23],[9,7],[9,23],[10,8],[10,23],[11,7],[11,22]];
var TIET_ORDER_CUC=[12,13,14,3,4,5,6,7,8,9,10,11,0,1,2,15,16,17,18,19,20,21,22,23]; // not used directly; mapping via CUC index below
function estimateTiet(date){
  // CUC array order is: 0 Dong chi ... 11 Mang chung, 12 Ha chi ... 23 Dai tuyet
  // Solar term sequence in calendar year starting Tieu han:
  var seq=[{n:"Tiểu hàn",cucIdx:1},{n:"Đại hàn",cucIdx:2},{n:"Lập xuân",cucIdx:3},{n:"Vũ thủy",cucIdx:4},{n:"Kinh trập",cucIdx:5},{n:"Xuân phân",cucIdx:6},{n:"Thanh minh",cucIdx:7},{n:"Cốc vũ",cucIdx:8},{n:"Lập hạ",cucIdx:9},{n:"Tiểu mãn",cucIdx:10},{n:"Mang chủng",cucIdx:11},{n:"Hạ chí",cucIdx:12},{n:"Tiểu thử",cucIdx:13},{n:"Đại thử",cucIdx:14},{n:"Lập thu",cucIdx:15},{n:"Xử thử",cucIdx:16},{n:"Bạch lộ",cucIdx:17},{n:"Thu phân",cucIdx:18},{n:"Hàn lộ",cucIdx:19},{n:"Sương giáng",cucIdx:20},{n:"Lập đông",cucIdx:21},{n:"Tiểu tuyết",cucIdx:22},{n:"Đại tuyết",cucIdx:23},{n:"Đông chí",cucIdx:0}];
  var m=date.getMonth(), d=date.getDate(), chosen=seq[seq.length-1], startDate=new Date(date.getFullYear(),11,21), idx=seq.length-1;
  for(var i=0;i<TIET_START.length;i++){var sm=TIET_START[i][0], sd=TIET_START[i][1]; if(m>sm||(m===sm&&d>=sd)){chosen=seq[i]; idx=i; startDate=new Date(date.getFullYear(),sm,sd);}}
  var days=Math.floor((new Date(date.getFullYear(),m,d)-startDate)/86400000); if(days<0)days=0;
  var nguyen=days<5?0:(days<10?1:2);
  return {tiet:chosen, cucRow:CUC[chosen.cucIdx], nguyen:nguyen, days:days};
}
function buildBoard(date){
  var est=estimateTiet(date);
  var isDuong=est.cucRow[0]==="Dương độn";
  var cuc=est.cucRow[2+est.nguyen];
  // Dia ban
  var dia={}; for(var i=0;i<9;i++){var pn=isDuong?((cuc-1+i)%9)+1:(((cuc-1-i)%9)+9)%9+1; dia[pn]=DIA_SEQ[i];}
  // Day / hour Can Chi (deterministic 60-cycle estimate)
  var daysUtc=Math.floor(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())/86400000);
  var dayIdx=((daysUtc+40)%60+60)%60; var dayStem=STEMS10[dayIdx%10], dayBranch=BRANCH12[dayIdx%12];
  var hourBranchIdx=Math.floor(((date.getHours()+1)%24)/2)%12;
  var hourStemFull=NTD[hourBranchIdx][CAN_GROUP[dayStem]]; var hourStem=hourStemFull.split(" ")[0];
  // Tuan thu / hidden Nghi for Giaap
  var hourIdx=-1; for(var k=0;k<60;k++){if(STEMS10[k%10]===hourStem&&BRANCH12[k%12]===BRANCH12[hourBranchIdx]){hourIdx=k;break;}}
  if(hourIdx<0)hourIdx=0; var tuanStart=Math.floor(hourIdx/10)*10;
  var tuanBranch=BRANCH12[tuanStart%12];
  var HIDDEN={"Tý":"Mậu","Tuất":"Kỷ","Thân":"Canh","Ngọ":"Tân","Thìn":"Nhâm","Dần":"Quý"}; var hiddenNghi=HIDDEN[tuanBranch]||"Mậu";
  var findPal=function(stem){for(var p=1;p<=9;p++){if(dia[p]===stem)return p;} return 5;};
  var originPal=findPal(hiddenNghi);
  var hourPal=findPal(hourStem==="Giáp"?hiddenNghi:hourStem);
  // Star rotation along RING
  var thienStar={}, thienCan={}; thienStar[5]="Thiên Cầm"; thienCan[5]=dia[5];
  var oi=RING.indexOf(originPal), hi=RING.indexOf(hourPal); if(oi<0){oi=0;hi=0;}
  var starShift=((hi-oi)%8+8)%8;
  RING.forEach(function(p){var srcIdx=RING.indexOf(p); var dst=RING[(srcIdx+starShift)%8]; thienStar[dst]=PAL_INFO[p].star; thienCan[dst]=dia[p];});
  if(originPal===5){thienStar[hourPal]="Thiên Cầm"; thienCan[hourPal]=dia[5];}
  // Door rotation: Truc Su steps = position in tuan (0..9 mapped mod 8)
  var steps=hourIdx-tuanStart; var doorShift=isDuong?(steps%8):((-steps)%8+8)%8;
  var thienDoor={}; thienDoor[5]="—";
  RING.forEach(function(p){var srcIdx=RING.indexOf(p); var dst=RING[(srcIdx+doorShift)%8]; thienDoor[dst]=PAL_INFO[p].door;});
  // Bat Than: Truc Phu at hourPal (star position), then along ring
  var GODS=["Trực Phù","Đằng Xà","Thái Âm","Lục Hợp","Bạch Hổ","Huyền Vũ","Cửu Địa","Cửu Thiên"];
  var than={}; than[5]="—"; var startIdx=RING.indexOf(hourPal); if(startIdx<0)startIdx=0;
  for(var g=0;g<8;g++){var dst2=isDuong?RING[(startIdx+g)%8]:RING[((startIdx-g)%8+8)%8]; than[dst2]=GODS[g];}
  return {est:est,isDuong:isDuong,cuc:cuc,dia:dia,thienStar:thienStar,thienCan:thienCan,thienDoor:thienDoor,than:than,dayStem:dayStem,dayBranch:dayBranch,hourStemFull:hourStemFull,hourBranch:BRANCH12[hourBranchIdx],trucPhuStar:PAL_INFO[originPal].star,trucSuDoor:PAL_INFO[originPal].door,originPal:originPal,hourPal:hourPal,hiddenNghi:hiddenNghi};
}
var lastBoard=null;
function findDungPal(board,dung){
  for(var p=1;p<=9;p++){if(board.thienDoor[p]===dung.door)return p;}
  for(var p2=1;p2<=9;p2++){if(board.thienStar[p2]===dung.star)return p2;}
  return 5;
}
function pad2(n){return (n<10?'0':'')+n;}
function toLocalInput(d){return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())+'T'+pad2(d.getHours())+':'+pad2(d.getMinutes());}
// "Chon ngay": scan the next 10 days at the same hour and keep the days whose
// Dung than palace gathers at least two good signs (Tam Ky stem, auspicious god, auspicious star).
// Each result re-casts the board for that day.
var GOOD_GODS=["Trực Phù","Thái Âm","Lục Hợp","Cửu Địa","Cửu Thiên"], GOOD_STARS=["Thiên Phụ","Thiên Tâm","Thiên Nhậm","Thiên Xung","Thiên Cầm"];
function renderDays(date,field){
  var dung=FIELD_DUNG[field]||FIELD_DUNG["Kinh doanh"], wrap=document.getElementById('rDays'), found=0;
  wrap.innerHTML='';
  for(var i=1;i<=10;i++){
    var d=new Date(date.getTime()); d.setDate(d.getDate()+i);
    var b=buildBoard(d), pal=findDungPal(b,dung);
    var can=b.thienCan[pal], why=[];
    if(can==="Ất"||can==="Bính"||can==="Đinh")why.push('Tam Kỳ '+can);
    if(GOOD_GODS.indexOf(b.than[pal])>=0)why.push(b.than[pal]);
    if(GOOD_STARS.indexOf(b.thienStar[pal])>=0)why.push(b.thienStar[pal]);
    if(why.length<2)continue;
    found++;
    var btn=document.createElement('button'); btn.type='button'; btn.className='tab';
    btn.textContent=pad2(d.getDate())+'/'+pad2(d.getMonth()+1)+' · '+b.dayStem+' '+b.dayBranch+' · '+why.join(' + ')+' tại '+PAL_INFO[pal].name;
    (function(day){btn.addEventListener('click',function(){document.getElementById('fTime').value=toLocalInput(day);cast(true);});})(d);
    wrap.appendChild(btn);
  }
  document.getElementById('rDaysNote').textContent=found?('Có '+found+' ngày mà cung Dụng thần của lĩnh vực "'+field+'" hội được ít nhất hai yếu tố tốt (Tam Kỳ, Thần cát, Tinh cát) vào giờ này. Đây là gợi ý rút gọn — bấm một ngày để lập lại bàn cho đúng ngày đó.'):('Trong 10 ngày tới, vào khung giờ này chưa có ngày nào cung Dụng thần của lĩnh vực "'+field+'" hội đủ hai yếu tố tốt (Tam Kỳ, Thần cát, Tinh cát). Hãy thử đổi sang khung giờ khác rồi tìm lại.');
}
function renderBoard(board,field){
  lastBoard=board;
  var dung=FIELD_DUNG[field]||FIELD_DUNG["Kinh doanh"];
  var dungPal=findDungPal(board,dung);
  board.dungPal=dungPal; board.dung=dung;
  document.getElementById('kmMeta').innerHTML=
   '<div class="mbox"><small>Tiết khí · Cục</small><b>'+board.est.cucRow[1]+' — '+(board.isDuong?'Dương':'Âm')+' '+board.cuc+' cục</b><span>'+["Thượng nguyên","Trung nguyên","Hạ nguyên"][board.est.nguyen]+' (ước tính, ngày thứ '+(board.est.days+1)+' trong tiết) · '+(board.isDuong?'Nghi thuận, Kỳ nghịch':'Nghi nghịch, Kỳ thuận')+'</span></div>'+
   '<div class="mbox"><small>Ngày · Giờ</small><b>'+board.dayStem+' '+board.dayBranch+' · '+board.hourStemFull+'</b><span>Giờ '+board.hourBranch+' · Tuần thủ ẩn trong '+board.hiddenNghi+'</span></div>'+
   '<div class="mbox"><small>Trực Phù · Trực Sử</small><b>'+board.trucPhuStar+' · '+board.trucSuDoor+'</b><span>Trực Phù đóng tại cung '+board.hourPal+' ('+PAL_INFO[board.hourPal].name+') · Dụng thần: '+dung.label+'</span></div>';
  var order=[4,9,2,3,5,7,8,1,6]; var grid=document.getElementById('kmGrid'); grid.innerHTML='';
  order.forEach(function(p){
    var nature=DOOR_NATURE[board.thienDoor[p]]||"trung";
    var badge=nature==="cat"?"CÁT":(nature==="hung"?"HUNG":"TRUNG");
    var cell=document.createElement('button'); cell.type='button'; cell.className='km-cell'+(p===5?' is-center':'')+(p===dungPal?' is-dung':''); cell.setAttribute('data-pal',p);
    cell.innerHTML='<div class="km-top"><span class="km-than">'+board.than[p]+'</span><span class="km-badge '+nature+'">'+badge+'</span></div><div class="km-pal">'+PAL_INFO[p].name+' · '+p+' — '+PAL_INFO[p].dir+'</div><div class="km-star">'+board.thienStar[p]+'</div><div class="km-door">'+board.thienDoor[p]+'</div><div class="km-cans"><span>Thiên: <b>'+board.thienCan[p]+'</b></span><span>Địa: <b>'+board.dia[p]+'</b></span></div>';
    cell.addEventListener('click',function(){
      document.querySelectorAll('.km-cell').forEach(function(c){c.classList.remove('sel');}); cell.classList.add('sel');
      var d=document.getElementById('palaceDetail');
      d.innerHTML='<h4>Cung '+PAL_INFO[p].name+' ('+p+') — '+PAL_INFO[p].dir+(p===dungPal?' · Cung Dụng thần':'')+'</h4><p><strong>'+board.than[p]+' · '+board.thienStar[p]+' · '+board.thienDoor[p]+'</strong> · Thiên Can <strong>'+board.thienCan[p]+'</strong> / Địa Can <strong>'+board.dia[p]+'</strong>. '+(nature==="cat"?'Tổ hợp Môn ở cung này thuộc nhóm cát — thuận cho việc khởi sự, gặp gỡ và cam kết trong phạm vi lĩnh vực đang xem.':nature==="hung"?'Môn ở cung này thuộc nhóm hung — nên thận trọng, kiểm tra kỹ điều kiện và tránh quyết định vội tại hướng / mảng việc thuộc cung này.':'Môn ở cung này trung tính — kết quả tùy tổ hợp Tinh – Thần đi cùng và quan hệ sinh khắc với cung Dụng thần.')+(board.thienCan[p]==="Ất"||board.thienCan[p]==="Bính"||board.thienCan[p]==="Đinh"?' Thiên Can là một trong Tam Kỳ ('+board.thienCan[p]+') — điểm sáng trong cung, đặc biệt tốt khi gặp Môn cát.':'')+'</p>';
    });
    grid.appendChild(cell);
  });
  // Dung / pattern analysis
  var dungNature=DOOR_NATURE[board.thienDoor[dungPal]];
  var tamKy=(board.thienCan[dungPal]==="Ất"||board.thienCan[dungPal]==="Bính"||board.thienCan[dungPal]==="Đinh");
  var catCount=0,hungCount=0; for(var q=1;q<=9;q++){var n=DOOR_NATURE[board.thienDoor[q]]; if(n==="cat")catCount++; if(n==="hung")hungCount++;}
  document.getElementById('rDung').textContent='Dụng thần lấy '+dung.label+'. Trong bàn này Dụng thần rơi tại cung '+PAL_INFO[dungPal].name+' ('+dungPal+') với '+board.thienStar[dungPal]+', '+board.thienDoor[dungPal]+', '+board.than[dungPal]+', Thiên Can '+board.thienCan[dungPal]+' / Địa Can '+board.dia[dungPal]+'. '+(dungNature==="cat"?'Môn tại cung Dụng thuộc nhóm cát — việc có cửa mở rõ ràng.':dungNature==="hung"?'Môn tại cung Dụng thuộc nhóm hung — việc dễ nghẽn ở khâu thực thi, cần đổi thời điểm hoặc cách tiếp cận.':'Môn tại cung Dụng trung tính — cần thêm tín hiệu xác nhận trước khi chốt.')+(tamKy?' Cung Dụng gặp Tam Kỳ '+board.thienCan[dungPal]+' — cách cục sáng, thường gọi là Tam Kỳ đắc địa / đắc Môn khi đi cùng Môn cát.':'');
  document.getElementById('rRead').textContent='Toàn bàn có '+catCount+' cung Môn cát, '+hungCount+' cung Môn hung. Trực Phù '+board.trucPhuStar+' đóng cung '+board.hourPal+' cho thấy trọng tâm và người / yếu tố chủ chốt của việc đang ở hướng '+PAL_INFO[board.hourPal].dir+'. Đọc nhanh: ưu tiên hành động theo hướng và mảng việc của các cung Cát (Khai, Hưu, Sinh), tránh dồn lực vào cung Tử / Kinh / Thương trong thời điểm này.';
  return {dungPal:dungPal,dungNature:dungNature,catCount:catCount};
}
function cast(scroll){
  var field=document.getElementById('fField').value;
  var q=fQ.value.trim()||'(Chưa nhập câu hỏi cụ thể — luận giải theo cục diện chung của lĩnh vực đã chọn.)';
  var t=document.getElementById('fTime').value;
  var date=t?new Date(t):new Date(); if(isNaN(date.getTime()))date=new Date();
  var board=buildBoard(date); var info=renderBoard(board,field);
  var tone=info.dungNature==="cat"?1:(info.dungNature==="hung"?2:0);
  document.getElementById('castTitle').textContent=modeName[mode]+' · '+field+' — '+(board.isDuong?'Dương độn':'Âm độn')+' '+board.cuc+' cục';
  document.getElementById('castMeta').textContent='Thời điểm: '+(t?t.replace('T',' lúc '):'hiện tại')+' · Tiết khí ước tính: '+board.est.cucRow[1]+' · Câu hỏi: “'+q+'”';
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
    duDoan:tag+'Tại cung Dụng thần, Thiên Can '+d.thienCan+' đi trên Địa Can '+d.diaCan+'. Bản AI thật sẽ phân tích tổ hợp này cùng quan hệ sinh khắc với cung của người hỏi để nêu diễn biến gần.',
    trienVong:tag+b.trucPhu+', Trực Sử là '+b.trucSu+'. Bản AI thật sẽ dựa vào hướng và mảng việc của các cung này để nêu triển vọng trung hạn và điều cần chuẩn bị.',
    ketLuan:tag+'Đây là bản demo để xem bố cục; khi nối với OpenAI, bốn phần này sẽ là lời luận giải viết riêng cho bàn và câu hỏi của bạn. Nội dung chỉ mang tính tham khảo.'};
}
var aiRequest=null, aiSeq=0;
function resetAI(date,field,question,timeText){
  aiSeq++; // bo ket qua AI cua lan lap ban truoc neu no ve muon
  var board=lastBoard, palaces=[];
  for(var p=1;p<=9;p++){palaces.push({so:p,ten:PAL_INFO[p].name,huong:PAL_INFO[p].dir,than:board.than[p],tinh:board.thienStar[p],mon:board.thienDoor[p],thienCan:board.thienCan[p],diaCan:board.dia[p]});}
  aiRequest={mode:mode,field:field,question:fQ.value.trim(),board:{
    thoiDiem:timeText?timeText.replace('T',' '):toLocalInput(date).replace('T',' '),
    cuc:board.est.cucRow[1]+' — '+(board.isDuong?'Dương độn':'Âm độn')+' '+board.cuc+' cục, '+["Thượng nguyên","Trung nguyên","Hạ nguyên"][board.est.nguyen],
    ngayGio:'ngày '+board.dayStem+' '+board.dayBranch+', giờ '+board.hourStemFull,
    trucPhu:board.trucPhuStar+' đóng tại cung '+board.hourPal,
    trucSu:board.trucSuDoor,
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
