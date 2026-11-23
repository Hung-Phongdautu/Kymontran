// N21 – Soạn thông báo (bản nháp email). Đạt hoặc lỗi: không soạn. Node gửi N22 đang TẮT (D8).
const d = $input.first().json; const b = d.body;
if (!b || !b.ok || !b.thong_bao.can_gui || !b.phieu_ycbs) return [];
return [{ json: {
  to: b.thong_bao.nguoi_nhan.join(","),                       // có thể rỗng -> người duyệt phải điền
  subject: `[Biwase – Phòng Đầu tư] ${b.ket_luan.nhan} – ${b.cong_trinh.ten_cong_trinh}`,
  html: b.phieu_ycbs.html,
  text: b.phieu_ycbs.markdown,
  ma_phien: b.ma_phien,
  trang_thai: "ban_nhap_cho_duyet",
} }];
