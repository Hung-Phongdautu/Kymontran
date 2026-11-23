// N04 – Chuẩn hóa đầu vào. Nguồn: N01 (webhook: {headers, body, ...}) hoặc N03 (hồ sơ trực tiếp).
// CAU_HINH là nơi DUY NHẤT khai báo ngưỡng; node sau đọc d.cau_hinh. cau_hinh gửi lên bị bỏ.
const CAU_HINH = {
  PHIEN_BAN_QUY_TAC: "2026.11-1",
  DUNG_SAI_KL: 0.001,              // hai khối lượng coi là khớp nếu |a-b| <= 0.001
  NGUONG_KHAC_THIET_KE: 0.05,      // > 5% => "khác thiết kế" (CẦN DUYỆT – D2)
  DUNG_SAI_TIEN: 1,                // đồng
  MOC_PHAP_LY: "2026-07-01",
  THOI_HAN_BO_SUNG_MAC_DINH: 7,    // ngày lịch (D7)
  CHI_NHANH: ["Khu Liên Hợp", "Tân Uyên", "Dĩ An", "Bàu Bàng"],
  EMAIL_PHONG_DAU_TU: "",          // để trống; người duyệt điền
};

const x = $input.first().json;
const laWebhook = !!x && typeof x === "object" && x.headers !== undefined && "body" in x;
let raw = laWebhook ? x.body : x;
const loi = [];

// 1. body dạng chuỗi -> thử parse
if (typeof raw === "string") {
  try { raw = JSON.parse(raw); }
  catch (e) { loi.push({ truong: "(body)", ma: "JSON_KHONG_HOP_LE", thong_bao: "Body không phải JSON hợp lệ" }); raw = {}; }
}
// 2. body phải là object, không phải mảng/null
if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
  loi.push({ truong: "(body)", ma: "BODY_KHONG_PHAI_OBJECT", thong_bao: "Body phải là 1 object hồ sơ (mỗi lần gửi 1 hồ sơ)" });
  raw = {};
}
raw = JSON.parse(JSON.stringify(raw));             // không sửa trực tiếp dữ liệu node trước

const nguonThuCong = laWebhook ? null : raw.__nguon_thu_cong;
delete raw.__nguon_thu_cong;
delete raw.cau_hinh;                               // không cho ghi đè ngưỡng
delete raw.meta;                                   // khóa nội bộ, không nhận từ ngoài
delete raw.kiem_tra_cau_truc;
delete raw.phat_hien;

// 3. Đổi chuỗi số -> number cho các trường số đã biết
function toSo(v, duongDan) {
  if (v === null || v === undefined || typeof v === "number") return v;
  if (typeof v === "string") {
    const s = v.trim();
    if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
    loi.push({ truong: duongDan, ma: "SO_SAI_DINH_DANG",
      thong_bao: `Giá trị "${v}" không phải số. Dùng dấu chấm thập phân, không dùng dấu phân cách nghìn (vd 1234.5)` });
    return v;
  }
  return v;   // kiểu khác để N05 báo lỗi kiểu
}
const laObj = o => o !== null && typeof o === "object" && !Array.isArray(o);
function doiSo(obj, khoa, tienTo) {
  if (!laObj(obj)) return;
  for (const k of khoa) if (k in obj) obj[k] = toSo(obj[k], `${tienTo}.${k}`);
}
const SO_HANG_MUC = ["stt","kl_thiet_ke","kl_thiet_ke_dieu_chinh","kl_hoan_cong","kl_nghiem_thu_hien_truong",
  "kl_nghiem_thu_bbnt","kl_quyet_toan","kl_hop_dong","don_gia_hop_dong","don_gia_quyet_toan"];
if (Array.isArray(raw.hang_muc)) raw.hang_muc.forEach((h, i) => doiSo(h, SO_HANG_MUC, `hang_muc[${i}]`));
doiSo(raw.hop_dong, ["gia_tri_hop_dong", "gia_tri_sau_phu_luc"], "hop_dong");
doiSo(raw.tong_hop_khai_bao, ["tong_quyet_toan_truoc_thue", "thue_suat_gtgt", "tong_quyet_toan_sau_thue"], "tong_hop_khai_bao");
doiSo(raw.hoa_don_gtgt, ["gia_tri_truoc_thue", "thue_suat", "gia_tri_sau_thue"], "hoa_don_gtgt");
doiSo(raw.chi_phi_giam_sat, ["gia_tri"], "chi_phi_giam_sat");
doiSo(raw.cong_trinh, ["thoi_han_bo_sung_ngay"], "cong_trinh");

// 4. Trim chuỗi ở cong_trinh; chuẩn hóa chi_nhanh về đúng chính tả (không phân biệt hoa thường, phân biệt dấu)
if (laObj(raw.cong_trinh)) {
  const ct = raw.cong_trinh;
  for (const k of Object.keys(ct)) if (typeof ct[k] === "string") ct[k] = ct[k].trim();
  if (laObj(ct.nha_thau)) for (const k of Object.keys(ct.nha_thau)) if (typeof ct.nha_thau[k] === "string") ct.nha_thau[k] = ct.nha_thau[k].trim();
  if (typeof ct.chi_nhanh === "string") {
    const chuan = s => s.normalize("NFC").toLowerCase();
    const cn = CAU_HINH.CHI_NHANH.find(c => chuan(c) === chuan(ct.chi_nhanh));
    if (cn) ct.chi_nhanh = cn;
  }
  // 5. Mặc định
  if (ct.loai_ho_so === undefined || ct.loai_ho_so === null || ct.loai_ho_so === "") ct.loai_ho_so = "Quyết toán";
  if (ct.thoi_han_bo_sung_ngay === undefined || ct.thoi_han_bo_sung_ngay === null) ct.thoi_han_bo_sung_ngay = CAU_HINH.THOI_HAN_BO_SUNG_MAC_DINH;
}
if (raw.phien_ban_schema === undefined || raw.phien_ban_schema === null) raw.phien_ban_schema = "1.0";
const gsMacDinh = { co_trong_du_toan: false, gia_tri: 0, da_giao_don_vi: false, don_vi_giam_sat: null, co_trong_quyet_toan: false };
raw.chi_phi_giam_sat = laObj(raw.chi_phi_giam_sat) ? { ...gsMacDinh, ...raw.chi_phi_giam_sat }
  : (raw.chi_phi_giam_sat == null ? gsMacDinh : raw.chi_phi_giam_sat);   // kiểu sai -> N05 báo
if (raw.ghi_chu_nguoi_kiem_tra === undefined || raw.ghi_chu_nguoi_kiem_tra === null) raw.ghi_chu_nguoi_kiem_tra = "";

const bayGio = DateTime.now().setZone("Asia/Ho_Chi_Minh");
const maCT = (laObj(raw.cong_trinh) && typeof raw.cong_trinh.ma_cong_trinh === "string" && raw.cong_trinh.ma_cong_trinh) || "KHONG_RO";
return [{ json: {
  ...raw,
  meta: {
    nguon: laWebhook ? "webhook" : "thu_cong",
    kich_ban: nguonThuCong && nguonThuCong.kich_ban ? nguonThuCong.kich_ban : null,
    ma_phien: `KTQT-${maCT}-${bayGio.toFormat("yyyyLLddHHmmss")}`,
    thoi_diem: bayGio.toISO(),
    phien_ban_quy_tac: CAU_HINH.PHIEN_BAN_QUY_TAC,
    workflow: "Biwase – Kiểm tra hồ sơ quyết toán công trình",
  },
  cau_hinh: CAU_HINH,
  loi_chuan_hoa: loi,
}}];
