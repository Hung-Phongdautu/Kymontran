// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
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
