// N16 – Tạo 1 dòng Báo cáo tổng hợp (mọi kết luận). Trả về JSON + CSV (;) + Markdown; không ghi ra kho lưu (Q4).
/*@HELPERS*/
const d = $input.first().json;
const ct = d.cong_trinh;
const COT = ["ngay_kiem_tra","ma_phien","ma_cong_trinh","ten_cong_trinh","chi_nhanh","dia_diem","nha_thau","loai_ho_so","so_hop_dong",
  "gia_tri_hop_dong","gia_tri_qt_khai_bao","gia_tri_qt_tinh_lai","tien_thanh_toan_du","so_hang_muc_lech","tieu_chi_khong_phu_hop",
  "tieu_chi_chua_du_can_cu","ho_so_thieu","ket_luan","so_phieu_ycbs","han_bo_sung","nguoi_kiem_tra","khoa_chong_trung","ghi_chu"];
const tc14 = d.tieu_chi.filter(t => t.so <= 14);
const khaiBao = d.tong_hop_khai_bao.tong_quyet_toan_truoc_thue;
const ghiChu = [d.ghi_chu_nguoi_kiem_tra, ...(d.kiem_tra_cau_truc.canh_bao || []), ...((d.phieu_ycbs && d.phieu_ycbs.canh_bao) || [])]
  .filter(x => x != null && String(x).trim() !== "");
const gia_tri = {
  ngay_kiem_tra: DateTime.fromISO(d.meta.thoi_diem, { setZone: true }).setZone("Asia/Ho_Chi_Minh").toFormat("dd/LL/yyyy"),
  ma_phien: d.meta.ma_phien,
  ma_cong_trinh: ct.ma_cong_trinh,
  ten_cong_trinh: ct.ten_cong_trinh,
  chi_nhanh: ct.chi_nhanh,
  dia_diem: ct.dia_diem,
  nha_thau: ct.nha_thau.ten,
  loai_ho_so: "Quyết toán",
  so_hop_dong: d.hop_dong.so_hop_dong,
  gia_tri_hop_dong: Math.round(d.kiem_tra_hop_dong.gia_tri_hieu_luc),
  gia_tri_qt_khai_bao: Math.round(khaiBao),
  gia_tri_qt_tinh_lai: Math.round(d.doi_chieu.tong_qt_tinh_lai),
  tien_thanh_toan_du: Math.round(d.doi_chieu.tong_thanh_toan_du),
  so_hang_muc_lech: d.doi_chieu.so_hang_muc_lech,
  tieu_chi_khong_phu_hop: tc14.filter(t => t.ket_qua === "khong_phu_hop").map(t => t.so).join(", "),
  tieu_chi_chua_du_can_cu: tc14.filter(t => t.ket_qua === "chua_du_can_cu").map(t => t.so).join(", "),
  ho_so_thieu: d.kiem_tra_ho_so.thieu.join("; "),
  ket_luan: d.ket_luan.nhan,
  so_phieu_ycbs: d.phieu_ycbs ? d.phieu_ycbs.so_phieu : "",
  han_bo_sung: d.phieu_ycbs ? d.phieu_ycbs.han_bo_sung : "",
  nguoi_kiem_tra: ct.nguoi_kiem_tra,
  khoa_chong_trung: `${ct.ma_cong_trinh}|${ct.ngay_nhan}|${Math.round(khaiBao)}`,
  ghi_chu: ghiChu.join("; "),
};
const oCsv = v => `"${String(v == null ? "" : v).replace(/\r?\n/g, " ").replace(/"/g, '""')}"`;
return [{ json: { ...d, dong_bao_cao: {
  cot: COT,
  gia_tri,
  csv_header: COT.map(oCsv).join(";"),
  csv_dong: COT.map(k => oCsv(gia_tri[k])).join(";"),
  markdown_dong: `| ${COT.map(k => escMd(gia_tri[k])).join(" | ")} |`,
} } }];
