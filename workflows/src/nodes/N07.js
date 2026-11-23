// N07 – Kiểm tra hồ sơ căn cứ (chuỗi Dự toán → Đề xuất giá → QĐ chỉ định thầu → Hợp đồng → BBNT → Quyết toán).
const d = $input.first().json;
const co = ma => (d.ho_so.find(h => h && h.ma === ma) || {}).co === true;
const BAT_BUOC = ["CV_CHU_TRUONG","DU_TOAN_PHE_DUYET","DE_XUAT_GIA","QD_CHI_DINH_THAU","HOP_DONG",
  "BB_NGHIEM_THU_HIEN_TRUONG","BBNT_KHOI_LUONG","BBNT_HOAN_THANH","BAN_VE_HOAN_CONG","BANG_QUYET_TOAN","HOA_DON_GTGT"];
const TEN = {
  CV_CHU_TRUONG: "Công văn chấp thuận chủ trương",
  HS_THIET_KE: "Hồ sơ thiết kế",
  HS_THIET_KE_DIEU_CHINH: "Hồ sơ thiết kế điều chỉnh",
  DU_TOAN_PHE_DUYET: "Dự toán được phê duyệt",
  DU_TOAN_DIEU_CHINH: "Dự toán điều chỉnh được phê duyệt",
  DE_XUAT_GIA: "Đề xuất giá",
  QD_CHI_DINH_THAU: "Quyết định chỉ định thầu",
  HOP_DONG: "Hợp đồng",
  PHU_LUC_HOP_DONG: "Phụ lục/điều chỉnh hợp đồng",
  BB_NGHIEM_THU_HIEN_TRUONG: "Biên bản nghiệm thu hiện trường (khối lượng chốt tại hiện trường)",
  BBNT_KHOI_LUONG: "BBNT khối lượng",
  BBNT_HOAN_THANH: "BBNT hoàn thành",
  BAN_VE_HOAN_CONG: "Bản vẽ hoàn công",
  BANG_QUYET_TOAN: "Dự toán/bảng quyết toán",
  HOA_DON_GTGT: "Hóa đơn GTGT",
};
const NHOM = {
  CV_CHU_TRUONG: 1, DE_XUAT_GIA: 1, QD_CHI_DINH_THAU: 1, HOP_DONG: 1, PHU_LUC_HOP_DONG: 1,
  HS_THIET_KE: 5, HS_THIET_KE_DIEU_CHINH: 5,
  DU_TOAN_PHE_DUYET: 6, DU_TOAN_DIEU_CHINH: 6, BANG_QUYET_TOAN: 6, BB_NGHIEM_THU_HIEN_TRUONG: 6, BBNT_KHOI_LUONG: 6,
  BAN_VE_HOAN_CONG: 9, BBNT_HOAN_THANH: 10, HOA_DON_GTGT: 11,
};
const ph = [];
const danhSach = [];

for (const ma of BAT_BUOC) {
  const dat = co(ma);
  danhSach.push({ ma, ten: TEN[ma], muc: "bat_buoc", co: dat, dat });
  if (!dat) ph.push({ ma: "THIEU_HO_SO", muc_do: "thieu_can_cu", nhom_ycbs: NHOM[ma], yeu_cau: "Bổ sung",
    noi_dung: `Thiếu ${TEN[ma]}`, hang_muc_stt: null, tien_anh_huong: null, nguon: "N07" });
}
// Thiết kế: TK gốc hoặc TK điều chỉnh
const coTK = co("HS_THIET_KE") || co("HS_THIET_KE_DIEU_CHINH");
danhSach.push({ ma: "HS_THIET_KE", ten: TEN.HS_THIET_KE, muc: "bat_buoc", co: co("HS_THIET_KE"), dat: coTK });
danhSach.push({ ma: "HS_THIET_KE_DIEU_CHINH", ten: TEN.HS_THIET_KE_DIEU_CHINH, muc: "dieu_kien", co: co("HS_THIET_KE_DIEU_CHINH"), dat: true });
danhSach.push({ ma: "DU_TOAN_DIEU_CHINH", ten: TEN.DU_TOAN_DIEU_CHINH, muc: "dieu_kien", co: co("DU_TOAN_DIEU_CHINH"),
  dat: !co("HS_THIET_KE_DIEU_CHINH") || co("DU_TOAN_DIEU_CHINH") });
danhSach.push({ ma: "PHU_LUC_HOP_DONG", ten: TEN.PHU_LUC_HOP_DONG, muc: "dieu_kien", co: co("PHU_LUC_HOP_DONG"), dat: null }); // đánh giá ở N09
if (!coTK) ph.push({ ma: "THIEU_HO_SO", muc_do: "thieu_can_cu", nhom_ycbs: 5, yeu_cau: "Bổ sung",
  noi_dung: "Thiếu hồ sơ thiết kế (hoặc thiết kế điều chỉnh)", hang_muc_stt: null, tien_anh_huong: null, nguon: "N07" });
// Điều chỉnh: TK điều chỉnh mà không có DT điều chỉnh
if (co("HS_THIET_KE_DIEU_CHINH") && !co("DU_TOAN_DIEU_CHINH")) ph.push({ ma: "THIEU_DU_TOAN_DIEU_CHINH", muc_do: "thieu_can_cu",
  nhom_ycbs: 6, yeu_cau: "Bổ sung", noi_dung: "Có thiết kế điều chỉnh nhưng thiếu dự toán điều chỉnh được phê duyệt",
  hang_muc_stt: null, tien_anh_huong: null, nguon: "N07" });
// Hóa đơn: khai có nhưng không có chi tiết
if (co("HOA_DON_GTGT") && !d.hoa_don_gtgt) ph.push({ ma: "THIEU_HO_SO", muc_do: "thieu_can_cu", nhom_ycbs: 11, yeu_cau: "Bổ sung",
  noi_dung: "Khai có hóa đơn GTGT nhưng không cung cấp số, ngày, giá trị hóa đơn", hang_muc_stt: null, tien_anh_huong: null, nguon: "N07" });

const thieu = ph.filter(p => p.ma === "THIEU_HO_SO" || p.ma === "THIEU_DU_TOAN_DIEU_CHINH").map(p => p.noi_dung);
return [{ json: { ...d,
  kiem_tra_ho_so: { danh_sach: danhSach, thieu,
    co_dieu_chinh_day_du: co("HS_THIET_KE_DIEU_CHINH") && co("DU_TOAN_DIEU_CHINH"),
    co_phu_luc: co("PHU_LUC_HOP_DONG") },
  phat_hien: [...(d.phat_hien || []), ...ph] } }];
