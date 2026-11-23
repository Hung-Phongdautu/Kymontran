// N12 – Áp quy tắc kết luận theo thứ tự ưu tiên (dừng ở quy tắc đầu tiên thỏa). D1: cổng số liệu đang BẬT.
const d = $input.first().json;
const kq = so => d.tieu_chi[so - 1].ket_qua;
const ph = d.phat_hien;
const lyDo = [], canBoSung = [], luuY = [];
let ma;

const tcChan = [13, 14].filter(s => kq(s) === "khong_phu_hop");
const tcDC = [5, 6, 8, 9, 11].filter(s => kq(s) === "khong_phu_hop");
const tcThieu = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14].filter(s => kq(s) === "chua_du_can_cu");
const phThieu = ph.filter(p => p.muc_do === "thieu_can_cu");
const phChan = ph.filter(p => p.muc_do === "chan");
const t = s => d.tieu_chi[s - 1];

if (tcChan.length) {
  ma = "DUNG_QUYET_TOAN";
  tcChan.forEach(s => lyDo.push(`Tiêu chí ${s} – ${t(s).ten}: ${t(s).ly_do_tu_dong || t(s).nhan_xet || "không phù hợp"}`));
} else if (tcDC.length) {
  ma = "DIEU_CHINH_TK_DT";
  tcDC.forEach(s => lyDo.push(`Tiêu chí ${s} – ${t(s).ten}: ${t(s).nhan_xet || "không phù hợp"}`));
} else if (tcThieu.length || phThieu.length || phChan.length) {
  ma = "CHUA_KET_LUAN";
  tcThieu.forEach(s => canBoSung.push(`Tiêu chí ${s} – ${t(s).ten}: chưa đủ căn cứ${t(s).nhan_xet ? " (" + t(s).nhan_xet + ")" : ""}`));
  phThieu.forEach(p => canBoSung.push(p.noi_dung));
  phChan.forEach(p => lyDo.push(p.noi_dung));
  if (phChan.length) lyDo.unshift("Số liệu quyết toán chưa khớp – cần điều chỉnh bảng quyết toán trước khi kết luận");
} else ma = "DAT";

// Bổ sung ngữ cảnh cho mọi kết luận
[1, 2, 3, 4, 7, 10].filter(s => kq(s) === "khong_phu_hop").forEach(s => luuY.push(`Tiêu chí ${s} – ${t(s).ten}: không phù hợp (không bắt buộc điều chỉnh)`));
ph.filter(p => p.muc_do === "luu_y").forEach(p => luuY.push(p.noi_dung));
if (ma !== "CHUA_KET_LUAN") { // vẫn liệt kê thiếu sót để chi nhánh xử lý cùng lúc
  tcThieu.forEach(s => canBoSung.push(`Tiêu chí ${s} – ${t(s).ten}: chưa đủ căn cứ`));
  phThieu.forEach(p => canBoSung.push(p.noi_dung));
}

const NHAN = { DUNG_QUYET_TOAN: "Không đạt — dừng quyết toán", DIEU_CHINH_TK_DT: "Không đạt — phải điều chỉnh thiết kế – dự toán",
               CHUA_KET_LUAN: "Chưa kết luận", DAT: "Đạt — chuyển trình ký" };
const tc = d.tieu_chi.map(x => x.so !== 15 ? x : { ...x,
  ket_qua: ma === "DAT" ? "phu_hop" : ma === "CHUA_KET_LUAN" ? "chua_du_can_cu" : "khong_phu_hop", nhan_xet: NHAN[ma] });

return [{ json: { ...d, tieu_chi: tc, ket_luan: { ma, nhan: NHAN[ma], ly_do: lyDo, can_bo_sung: [...new Set(canBoSung)], luu_y: luuY,
  quy_tac_ap_dung: { DUNG_QUYET_TOAN: 1, DIEU_CHINH_TK_DT: 2, CHUA_KET_LUAN: 3, DAT: 4 }[ma] } } }];
