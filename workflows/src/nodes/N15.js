// N15 – Lập tờ trình chuyển ký (chỉ khi kết luận Đạt). Bản nháp – lãnh đạo ký mới có hiệu lực.
/*@HELPERS*/
const d = $input.first().json;
const ct = d.cong_trinh; const kl = d.ket_luan;
const tong = d.doi_chieu.tong_qt_tinh_lai;
const thue = d.tong_hop_khai_bao.thue_suat_gtgt;
const sauThue = Math.round(tong * (1 + thue / 100));
const giaHD = d.kiem_tra_hop_dong.gia_tri_hieu_luc;
const chenh = tong - giaHD;
const tieu_de = `Đề xuất trình ký quyết toán công trình ${ct.ten_cong_trinh}`;
const md = [
  `# ${tieu_de}`, "",
  "| Mục | Nội dung |", "|---|---|",
  `| Mã công trình | ${escMd(ct.ma_cong_trinh)} |`,
  `| Địa điểm | ${escMd(ct.dia_diem)} |`,
  `| Chi nhánh | ${escMd(ct.chi_nhanh)} |`,
  `| Nhà thầu | ${escMd(ct.nha_thau.ten)} |`,
  `| Hợp đồng | ${escMd(d.hop_dong.so_hop_dong)} |`,
  `| Người kiểm tra | ${escMd(ct.nguoi_kiem_tra)} |`, "",
  "| Giá trị | Số tiền (đ) |", "|---|---|",
  `| Giá trị hợp đồng (hiệu lực, trước thuế) | ${fmtTien(giaHD)} |`,
  `| Giá trị quyết toán đề nghị (trước thuế) | ${fmtTien(tong)} |`,
  `| Thuế GTGT ${thue}% | ${fmtTien(sauThue - tong)} |`,
  `| Giá trị quyết toán đề nghị (sau thuế) | ${fmtTien(sauThue)} |`,
  `| Chênh lệch so với hợp đồng (âm = giảm) | ${fmtTien(chenh)} |`, "",
  `**Kết luận kiểm tra:** ${kl.nhan} (quy tắc ${d.meta.phien_ban_quy_tac}).`, "",
];
if (kl.luu_y.length) { md.push("**Lưu ý:**"); kl.luu_y.forEach(x => md.push(`- ${x}`)); md.push(""); }
if (kl.can_bo_sung.length) { md.push("**Nội dung còn bổ sung (không chặn trình ký):**"); kl.can_bo_sung.forEach(x => md.push(`- ${x}`)); md.push(""); }
md.push("Đề nghị lãnh đạo xem xét, ký duyệt.", "", "---",
  `*Tờ trình sinh tự động bởi workflow n8n (phiên ${d.meta.ma_phien}). Bản nháp – chỉ có hiệu lực sau khi lãnh đạo Phòng Đầu tư ký duyệt.*`);

return [{ json: { ...d, phieu_ycbs: null, to_trinh: {
  tieu_de,
  gia_tri_quyet_toan_de_nghi_truoc_thue: tong,
  gia_tri_quyet_toan_de_nghi_sau_thue: sauThue,
  gia_tri_hop_dong: giaHD,
  chenh_lech_so_voi_hop_dong: chenh,
  luu_y: kl.luu_y,
  markdown: md.join("\n"),
} } }];
