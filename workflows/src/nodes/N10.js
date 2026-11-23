// N10 – Tổng hợp checklist GĐ5 (bản vẽ hoàn công + bảng quyết toán). Máy CHỈ HẠ, không nâng
// (ngoại lệ duy nhất: "Cộng dồn tổng" chua_kiem_tra -> dat khi máy cộng khớp, vì đây là phép tính thuần).
/*@HELPERS*/
const d = $input.first().json; const C = d.cau_hinh; const ph = [];
const BANG = [
  { nhom: "checklist_ban_ve_hoan_cong", khoa: "chieu_dai_tuyen", ten: "Chiều dài tuyến", nhom_ycbs: 9 },
  { nhom: "checklist_ban_ve_hoan_cong", khoa: "ky_thuat_lap_dat", ten: "Kỹ thuật lắp đặt", nhom_ycbs: 4 },
  { nhom: "checklist_ban_ve_hoan_cong", khoa: "boc_tach_coc_vs_thong_ke_vat_tu", ten: "Bóc tách KL chi tiết cọc so với bảng thống kê vật tư", nhom_ycbs: 9 },
  { nhom: "checklist_ban_ve_hoan_cong", khoa: "loi_trinh_bay", ten: "Lỗi trình bày", nhom_ycbs: 9 },
  { nhom: "checklist_du_toan_quyet_toan", khoa: "ma_hieu_dinh_muc_tt38", ten: "Mã hiệu định mức TT38", nhom_ycbs: 6 },
  { nhom: "checklist_du_toan_quyet_toan", khoa: "don_gia_nhan_cong_ca_may_bd", ten: "Đơn giá nhân công/ca máy Bình Dương", nhom_ycbs: 6 },
  { nhom: "checklist_du_toan_quyet_toan", khoa: "can_cu_phap_ly_theo_moc", ten: "Căn cứ pháp lý theo mốc 01/7/2026", nhom_ycbs: 6 },
  { nhom: "checklist_du_toan_quyet_toan", khoa: "kl_dao_dap_cat_dem_tai_lap_khop_mat_cat", ten: "KL đào đắp – cát đệm – tái lập khớp mặt cắt", nhom_ycbs: 6 },
  { nhom: "checklist_du_toan_quyet_toan", khoa: "don_gia_vat_tu_biwase", ten: "Đơn giá vật tư Biwase (đường kính + vật liệu + kiểu đấu nối + góc + kiểu nối)", nhom_ycbs: 6 },
  { nhom: "checklist_du_toan_quyet_toan", khoa: "cong_don_tong", ten: "Cộng dồn tổng", nhom_ycbs: 6 },
];
const lay = (nhom, khoa) => (d[nhom] && d[nhom][khoa]) || { ket_qua: "chua_kiem_tra" };
const tatCaMuc = BANG.map(b => {
  const x = lay(b.nhom, b.khoa);
  return { nhom_checklist: b.nhom, khoa: b.khoa, ten: b.ten, nhom_ycbs: b.nhom_ycbs,
    ket_qua_nguoi_nhap: x.ket_qua, ket_qua: x.ket_qua, nguon: "nguoi_kiem_tra",
    ghi_chu: x.ghi_chu || "", ghi_chu_tu_dong: "", so_lieu: x.so_lieu || {} };
});
const muc = khoa => tatCaMuc.find(m => m.khoa === khoa);
const daCoPH = new Set();   // khóa đã có phát hiện riêng -> không sinh CHECKLIST_KHONG_DAT trùng
const ha = (m, lyDo) => {
  if (m.ket_qua !== "khong_dat") { m.ket_qua = "khong_dat"; m.nguon = "tu_dong"; }
  m.ghi_chu_tu_dong = m.ghi_chu_tu_dong ? `${m.ghi_chu_tu_dong}; ${lyDo}` : lyDo;
};

// Tự kiểm 1: chiều dài tuyến
const cdt = muc("chieu_dai_tuyen");
const tongOng = Math.round(d.hang_muc.filter(h => h.loai === "ong").reduce((s, h) => s + h.kl_hoan_cong, 0) * 1000) / 1000;
if (typeof cdt.so_lieu.chieu_dai_ban_ve === "number" && Math.abs(cdt.so_lieu.chieu_dai_ban_ve - tongOng) > C.DUNG_SAI_KL) {
  const lyDo = `Chiều dài bản vẽ ${cdt.so_lieu.chieu_dai_ban_ve} m ≠ tổng KL hoàn công ống ${tongOng} m`;
  ha(cdt, lyDo); daCoPH.add(cdt.khoa);
  ph.push({ ma: "CHIEU_DAI_TUYEN_LECH", muc_do: "chan", nhom_ycbs: 9, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: null, nguon: "N10",
    noi_dung: `Chiều dài tuyến: ${lyDo}${cdt.ghi_chu ? ". " + cdt.ghi_chu : ""}` });
}
// Tự kiểm 2: bóc tách cọc
const bt = muc("boc_tach_coc_vs_thong_ke_vat_tu");
if ((bt.so_lieu.so_muc_lech || 0) > 0) ha(bt, `${bt.so_lieu.so_muc_lech} mục bóc tách cọc lệch bảng thống kê vật tư${Array.isArray(bt.so_lieu.danh_sach_lech) && bt.so_lieu.danh_sach_lech.length ? " (" + bt.so_lieu.danh_sach_lech.join(", ") + ")" : ""}`);
// Tự kiểm 3: vật tư Biwase
const vt = muc("don_gia_vat_tu_biwase");
if ((vt.so_lieu.so_muc_khong_khop || 0) > 0) ha(vt, `${vt.so_lieu.so_muc_khong_khop} vật tư chưa khớp đủ 5 thuộc tính (đường kính, vật liệu, kiểu đấu nối, góc, kiểu nối)${Array.isArray(vt.so_lieu.danh_sach) && vt.so_lieu.danh_sach.length ? ": " + vt.so_lieu.danh_sach.join(", ") : ""}`);
// Tự kiểm 4: mốc pháp lý (D10: theo ngày lập dự toán)
const mp = muc("can_cu_phap_ly_theo_moc");
const mocDung = d.cong_trinh.ngay_lap_du_toan >= C.MOC_PHAP_LY ? "tu_01072026" : "truoc_01072026";  // so chuỗi YYYY-MM-DD
if (mp.so_lieu.moc_ap_dung && mp.so_lieu.moc_ap_dung !== mocDung) {
  const lyDo = `Ngày lập dự toán ${d.cong_trinh.ngay_lap_du_toan} phải áp căn cứ ${mocDung === "tu_01072026" ? "từ 01/7/2026" : "trước 01/7/2026"}, hồ sơ khai ${mp.so_lieu.moc_ap_dung}`;
  ha(mp, lyDo); daCoPH.add(mp.khoa);
  ph.push({ ma: "MOC_PHAP_LY_SAI", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: null, nguon: "N10",
    noi_dung: `Căn cứ pháp lý theo mốc: ${lyDo}` });
}
// Tự kiểm 5: cộng dồn tổng (luôn chạy) – trước thuế và sau thuế
const cd = muc("cong_don_tong");
const khaiBao = d.tong_hop_khai_bao.tong_quyet_toan_truoc_thue;
const tinhLai = d.doi_chieu.tong_qt_tinh_lai;
const thue = d.tong_hop_khai_bao.thue_suat_gtgt;
const sauThueKhai = d.tong_hop_khai_bao.tong_quyet_toan_sau_thue;
const sauThueTuKhai = Math.round(khaiBao * (1 + thue / 100));
let congDonKhop = true;
if (Math.abs(khaiBao - tinhLai) > C.DUNG_SAI_TIEN) {
  congDonKhop = false;
  const lyDo = `Tổng khai báo ${fmtTien(khaiBao)} đ ≠ Σ(KL quyết toán × đơn giá) ${fmtTien(tinhLai)} đ`;
  ha(cd, lyDo); daCoPH.add(cd.khoa);
  ph.push({ ma: "CONG_DON_SAI", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: khaiBao - tinhLai, nguon: "N10",
    noi_dung: `Cộng dồn tổng: ${lyDo}` });
}
if (Math.abs(sauThueKhai - sauThueTuKhai) > C.DUNG_SAI_TIEN) {
  congDonKhop = false;
  const lyDo = `Tổng sau thuế khai báo ${fmtTien(sauThueKhai)} đ ≠ ${fmtTien(khaiBao)} × (1 + ${thue}%) = ${fmtTien(sauThueTuKhai)} đ`;
  ha(cd, lyDo); daCoPH.add(cd.khoa);
  ph.push({ ma: "CONG_DON_SAI", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: sauThueKhai - sauThueTuKhai, nguon: "N10",
    noi_dung: `Cộng dồn tổng (sau thuế): ${lyDo}` });
}
if (congDonKhop && cd.ket_qua === "chua_kiem_tra") { cd.ket_qua = "dat"; cd.nguon = "tu_dong"; cd.ghi_chu_tu_dong = "Máy cộng dồn khớp"; }

// Sinh phát hiện cho mọi mục còn lại
for (const m of tatCaMuc) {
  if (m.ket_qua === "khong_dat" && !daCoPH.has(m.khoa)) ph.push({ ma: "CHECKLIST_KHONG_DAT",
    muc_do: m.khoa === "loi_trinh_bay" ? "luu_y" : "chan", nhom_ycbs: m.nhom_ycbs, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: null, nguon: "N10",
    noi_dung: `${m.ten}: không đạt${[m.ghi_chu, m.ghi_chu_tu_dong].filter(Boolean).length ? ". " + [m.ghi_chu, m.ghi_chu_tu_dong].filter(Boolean).join(". ") : ""}` });
  if (m.ket_qua === "chua_kiem_tra") ph.push({ ma: "CHECKLIST_CHUA_KIEM_TRA", muc_do: "thieu_can_cu", nhom_ycbs: m.nhom_ycbs, yeu_cau: "Bổ sung",
    hang_muc_stt: null, tien_anh_huong: null, nguon: "N10", noi_dung: `${m.ten}: chưa kiểm tra / chưa đủ hồ sơ để kiểm tra` });
}
const boSoLieu = ({ nhom_checklist, ...m }) => m;
return [{ json: { ...d,
  checklist_gd5: {
    ban_ve_hoan_cong: tatCaMuc.filter(m => m.nhom_checklist === "checklist_ban_ve_hoan_cong").map(boSoLieu),
    du_toan_quyet_toan: tatCaMuc.filter(m => m.nhom_checklist === "checklist_du_toan_quyet_toan").map(boSoLieu),
    so_khong_dat: tatCaMuc.filter(m => m.ket_qua === "khong_dat").length,
    so_chua_kiem_tra: tatCaMuc.filter(m => m.ket_qua === "chua_kiem_tra").length,
    tong_chieu_dai_ong_hoan_cong: tongOng, moc_phap_ly_suy_ra: mocDung },
  phat_hien: [...d.phat_hien, ...ph] } }];
