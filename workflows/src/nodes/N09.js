// N09 – Kiểm tra hợp đồng: chép HĐ không số đo, hạng mục ngoài HĐ, đơn giá cố định, vượt giá HĐ, giám sát, hóa đơn GTGT.
/*@HELPERS*/
const d = $input.first().json; const C = d.cau_hinh; const hd = d.hop_dong;
const ph = []; const khop = (a, b) => Math.abs(a - b) <= C.DUNG_SAI_KL;
const coPL = d.kiem_tra_ho_so.co_phu_luc;
const giaHieuLuc = (coPL && hd.gia_tri_sau_phu_luc != null) ? hd.gia_tri_sau_phu_luc : hd.gia_tri_hop_dong;
const tongQT = d.doi_chieu.tong_qt_tinh_lai;
const chep = [], ngoai = [], donGiaKhac = [];

for (const h of d.hang_muc) {
  // (a) Chép 100% hợp đồng mà không có số đo
  const bbntBangHD = h.kl_nghiem_thu_bbnt != null && khop(h.kl_nghiem_thu_bbnt, h.kl_hop_dong);
  const qtBangHD = khop(h.kl_quyet_toan, h.kl_hop_dong);
  if (h.kl_hop_dong > 0 && qtBangHD && (bbntBangHD || h.kl_nghiem_thu_bbnt == null) && (!h.co_so_do_hien_truong || h.kl_nghiem_thu_hien_truong == null)) {
    chep.push(h.stt);
    ph.push({ ma: "CHEP_HOP_DONG_KHONG_SO_DO", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Bổ sung-điều chỉnh", hang_muc_stt: h.stt,
      tien_anh_huong: null, nguon: "N09",
      noi_dung: `Hạng mục ${h.stt} "${h.ten}": BBNT/quyết toán chép đúng khối lượng hợp đồng (${h.kl_hop_dong} ${h.don_vi}) nhưng không có số đo hiện trường – rủi ro thanh toán dư. Bổ sung số đo và điều chỉnh theo khối lượng thực tế` });
  }
  // (b) Hạng mục ngoài hợp đồng
  if (h.kl_hop_dong === 0 && h.kl_quyet_toan > 0 && !coPL) {
    ngoai.push(h.stt);
    const tien = Math.round(h.kl_quyet_toan * h.don_gia_quyet_toan);
    ph.push({ ma: "HANG_MUC_NGOAI_HOP_DONG", muc_do: "chan", nhom_ycbs: 1, yeu_cau: "Bổ sung", hang_muc_stt: h.stt,
      tien_anh_huong: tien, nguon: "N09",
      noi_dung: `Hạng mục ${h.stt} "${h.ten}" không có trong hợp đồng nhưng được quyết toán ${fmtTien(tien)} đ – cần phụ lục hợp đồng` });
  }
  // (c) Đơn giá cố định -> đơn giá quyết toán phải bằng đơn giá hợp đồng
  if (hd.loai_gia === "don_gia_co_dinh" && h.kl_hop_dong > 0 && h.don_gia_hop_dong != null && h.don_gia_quyet_toan !== h.don_gia_hop_dong) {
    donGiaKhac.push(h.stt);
    const tien = Math.round(h.kl_quyet_toan * (h.don_gia_quyet_toan - h.don_gia_hop_dong));
    ph.push({ ma: "DON_GIA_KHAC_HOP_DONG", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh", hang_muc_stt: h.stt, tien_anh_huong: tien, nguon: "N09",
      noi_dung: `Hạng mục ${h.stt} "${h.ten}": HĐ đơn giá cố định ${fmtTien(h.don_gia_hop_dong)} đ nhưng quyết toán ${fmtTien(h.don_gia_quyet_toan)} đ; ảnh hưởng ${fmtTien(tien)} đ` });
  }
}
// (d) Vượt giá hợp đồng
const vuot = tongQT - giaHieuLuc;
if (vuot > C.DUNG_SAI_TIEN && !coPL) ph.push({ ma: "VUOT_GIA_HOP_DONG", muc_do: "chan", nhom_ycbs: 1, yeu_cau: "Bổ sung",
  hang_muc_stt: null, tien_anh_huong: vuot, nguon: "N09",
  noi_dung: `Giá trị quyết toán tính lại ${fmtTien(tongQT)} đ vượt giá hợp đồng ${fmtTien(giaHieuLuc)} đ là ${fmtTien(vuot)} đ nhưng không có phụ lục/điều chỉnh hợp đồng` });
if (vuot > C.DUNG_SAI_TIEN && coPL && hd.gia_tri_sau_phu_luc == null) ph.push({ ma: "VUOT_GIA_HOP_DONG", muc_do: "thieu_can_cu", nhom_ycbs: 1, yeu_cau: "Bổ sung",
  hang_muc_stt: null, tien_anh_huong: vuot, nguon: "N09", noi_dung: "Có phụ lục hợp đồng nhưng không khai báo giá trị sau phụ lục để đối chiếu" });
if (vuot > C.DUNG_SAI_TIEN && coPL && hd.gia_tri_sau_phu_luc != null) ph.push({ ma: "VUOT_GIA_HOP_DONG", muc_do: "chan", nhom_ycbs: 1, yeu_cau: "Bổ sung",
  hang_muc_stt: null, tien_anh_huong: vuot, nguon: "N09",
  noi_dung: `Giá trị quyết toán tính lại ${fmtTien(tongQT)} đ vượt cả giá hợp đồng sau phụ lục ${fmtTien(giaHieuLuc)} đ là ${fmtTien(vuot)} đ` });
// (e) Giám sát
const gs = d.chi_phi_giam_sat; let kqGS = "hop_le";
if (gs.co_trong_du_toan && !gs.da_giao_don_vi && gs.co_trong_quyet_toan) {
  kqGS = "khong_quyet_toan";
  ph.push({ ma: "GIAM_SAT_KHONG_GIAO", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: gs.gia_tri, nguon: "N09",
    noi_dung: `Chi phí giám sát ${fmtTien(gs.gia_tri)} đ có trong dự toán nhưng không giao đơn vị thực hiện – không được quyết toán, đề nghị loại khỏi giá trị quyết toán` });
} else if (gs.co_trong_du_toan && !gs.da_giao_don_vi) {
  kqGS = "luu_y";
  ph.push({ ma: "GIAM_SAT_KHONG_GIAO_LUU_Y", muc_do: "luu_y", nhom_ycbs: 6, yeu_cau: "Không", hang_muc_stt: null, tien_anh_huong: null, nguon: "N09",
    noi_dung: "Chi phí giám sát có trong dự toán nhưng không giao đơn vị – đã không đưa vào quyết toán (đúng)" });
}
// (f) Hóa đơn GTGT so với tổng tính lại (sau thuế)
let hoaDon = { co: !!d.hoa_don_gtgt, khop: null, chenh_lech_sau_thue: null };
if (d.hoa_don_gtgt) {
  const sauThueTinhLai = Math.round(tongQT * (1 + d.tong_hop_khai_bao.thue_suat_gtgt / 100));
  const cl = d.hoa_don_gtgt.gia_tri_sau_thue - sauThueTinhLai;
  hoaDon = { co: true, khop: Math.abs(cl) <= C.DUNG_SAI_TIEN, chenh_lech_sau_thue: cl };
  if (!hoaDon.khop) ph.push({ ma: "HOA_DON_KHONG_KHOP", muc_do: "chan", nhom_ycbs: 11, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: cl, nguon: "N09",
    noi_dung: `Hóa đơn GTGT số ${d.hoa_don_gtgt.so} giá trị ${fmtTien(d.hoa_don_gtgt.gia_tri_sau_thue)} đ ≠ giá trị quyết toán sau thuế tính lại ${fmtTien(sauThueTinhLai)} đ` });
}
return [{ json: { ...d, kiem_tra_hop_dong: { loai_gia: hd.loai_gia, gia_tri_hop_dong: hd.gia_tri_hop_dong, gia_tri_hieu_luc: giaHieuLuc,
  co_phu_luc: coPL, tong_qt_tinh_lai: tongQT, vuot_hop_dong: Math.max(0, vuot),
  hang_muc_chep_hop_dong: chep, hang_muc_ngoai_hop_dong: ngoai, hang_muc_don_gia_khac: donGiaKhac,
  giam_sat: { ...gs, ket_qua: kqGS }, hoa_don: hoaDon },
  phat_hien: [...d.phat_hien, ...ph] } }];
