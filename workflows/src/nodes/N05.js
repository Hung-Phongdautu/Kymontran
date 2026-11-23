// N05 – Kiểm tra cấu trúc. Gom TẤT CẢ lỗi (không dừng ở lỗi đầu), trừ khi body hỏng hoàn toàn.
const d = $input.first().json;
const C = d.cau_hinh;
const loi = [...(d.loi_chuan_hoa || [])];
const canhBao = [];
const them = (truong, ma, thong_bao) => loi.push({ truong, ma, thong_bao });
const laNgay = s => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && DateTime.fromISO(s).isValid;
const chuoiKhongRong = s => typeof s === "string" && s.trim() !== "";
const soKhongAm = v => typeof v === "number" && Number.isFinite(v) && v >= 0;
const laObj = o => o !== null && typeof o === "object" && !Array.isArray(o);

// Body hỏng (không phải JSON / không phải object): trả đúng lỗi đó, không liệt kê hàng loạt THIEU_TRUONG gây nhiễu.
const loiBody = loi.filter(l => l.ma === "JSON_KHONG_HOP_LE" || l.ma === "BODY_KHONG_PHAI_OBJECT");
if (loiBody.length) {
  return [{ json: { ...d, kiem_tra_cau_truc: { hop_le: false, loi: loiBody, canh_bao: [] } } }];
}

if (d.phien_ban_schema !== "1.0") them("phien_ban_schema", "SAI_PHIEN_BAN", "Chỉ hỗ trợ phiên bản 1.0");

// cong_trinh
const ct = d.cong_trinh;
if (!laObj(ct)) them("cong_trinh", "THIEU_TRUONG", "Thiếu thông tin công trình");
else {
  for (const k of ["ma_cong_trinh","ten_cong_trinh","dia_diem","nguoi_kiem_tra"]) if (!chuoiKhongRong(ct[k])) them(`cong_trinh.${k}`, "THIEU_TRUONG", "Bắt buộc, không được rỗng");
  if (typeof ct.ma_cong_trinh === "string" && ct.ma_cong_trinh.length > 50) them("cong_trinh.ma_cong_trinh", "GIA_TRI_KHONG_HOP_LE", "Tối đa 50 ký tự");
  if (!C.CHI_NHANH.includes(ct.chi_nhanh)) them("cong_trinh.chi_nhanh", "GIA_TRI_KHONG_HOP_LE", `Phải là một trong: ${C.CHI_NHANH.join(", ")}`);
  if (!laObj(ct.nha_thau) || !chuoiKhongRong(ct.nha_thau.ten)) them("cong_trinh.nha_thau.ten", "THIEU_TRUONG", "Bắt buộc");
  if (ct.loai_ho_so !== "Quyết toán") them("cong_trinh.loai_ho_so", "GIA_TRI_KHONG_HOP_LE", "Workflow này chỉ xử lý loại hồ sơ Quyết toán");
  for (const k of ["ngay_nhan","ngay_lap_du_toan"]) if (!laNgay(ct[k])) them(`cong_trinh.${k}`, "NGAY_KHONG_HOP_LE", "Định dạng YYYY-MM-DD");
  const thb = ct.thoi_han_bo_sung_ngay;
  if (!(Number.isInteger(thb) && thb >= 1 && thb <= 60)) them("cong_trinh.thoi_han_bo_sung_ngay", "GIA_TRI_KHONG_HOP_LE", "Số nguyên 1–60");
}

// hop_dong
const hd = d.hop_dong;
if (!laObj(hd)) them("hop_dong", "THIEU_TRUONG", "Thiếu thông tin hợp đồng");
else {
  if (!chuoiKhongRong(hd.so_hop_dong)) them("hop_dong.so_hop_dong", "THIEU_TRUONG", "Bắt buộc");
  if (!["don_gia_co_dinh","tron_goi","don_gia_dieu_chinh"].includes(hd.loai_gia)) them("hop_dong.loai_gia", "GIA_TRI_KHONG_HOP_LE", "don_gia_co_dinh | tron_goi | don_gia_dieu_chinh");
  if (!soKhongAm(hd.gia_tri_hop_dong)) them("hop_dong.gia_tri_hop_dong", "SO_KHONG_HOP_LE", "Số ≥ 0");
  if (hd.gia_tri_sau_phu_luc != null && !soKhongAm(hd.gia_tri_sau_phu_luc)) them("hop_dong.gia_tri_sau_phu_luc", "SO_KHONG_HOP_LE", "Số ≥ 0 hoặc null");
}

// ho_so
const MA_HO_SO = ["CV_CHU_TRUONG","HS_THIET_KE","HS_THIET_KE_DIEU_CHINH","DU_TOAN_PHE_DUYET","DU_TOAN_DIEU_CHINH","DE_XUAT_GIA",
  "QD_CHI_DINH_THAU","HOP_DONG","PHU_LUC_HOP_DONG","BB_NGHIEM_THU_HIEN_TRUONG","BBNT_KHOI_LUONG","BBNT_HOAN_THANH",
  "BAN_VE_HOAN_CONG","BANG_QUYET_TOAN","HOA_DON_GTGT"];
if (!Array.isArray(d.ho_so)) them("ho_so", "THIEU_TRUONG", "Phải là mảng danh mục hồ sơ");
else {
  const daGap = new Set();
  d.ho_so.forEach((h, i) => {
    if (!laObj(h) || !MA_HO_SO.includes(h.ma)) them(`ho_so[${i}].ma`, "MA_HO_SO_LA", `Mã hồ sơ không hợp lệ: ${h && h.ma}`);
    else if (daGap.has(h.ma)) them(`ho_so[${i}].ma`, "MA_HO_SO_TRUNG", `Trùng mã ${h.ma}`);
    else daGap.add(h.ma);
    if (laObj(h) && typeof h.co !== "boolean") them(`ho_so[${i}].co`, "KIEU_SAI", "Phải là true/false");
  });
  MA_HO_SO.filter(m => !daGap.has(m)).forEach(m => canhBao.push(`Không khai báo hồ sơ ${m} – coi như không có`));
}

// hang_muc
if (!Array.isArray(d.hang_muc)) them("hang_muc", "THIEU_TRUONG", "Phải là mảng hạng mục");
else if (d.hang_muc.length === 0) them("hang_muc", "HANG_MUC_RONG", "Danh sách hạng mục rỗng – không có gì để đối chiếu");
else {
  const sttGap = new Set();
  d.hang_muc.forEach((h, i) => {
    const p = `hang_muc[${i}]`;
    if (!laObj(h)) { them(p, "KIEU_SAI", "Phải là object"); return; }
    if (!Number.isInteger(h.stt)) them(`${p}.stt`, "KIEU_SAI", "Số nguyên");
    else if (sttGap.has(h.stt)) them(`${p}.stt`, "STT_TRUNG", `Trùng stt ${h.stt}`); else sttGap.add(h.stt);
    for (const k of ["ten","don_vi"]) if (!chuoiKhongRong(h[k])) them(`${p}.${k}`, "THIEU_TRUONG", "Bắt buộc");
    if (!["ong","phu_kien","dao_dap","cat_dem","tai_lap","khac"].includes(h.loai)) them(`${p}.loai`, "GIA_TRI_KHONG_HOP_LE", "ong|phu_kien|dao_dap|cat_dem|tai_lap|khac");
    for (const k of ["kl_thiet_ke","kl_hoan_cong","kl_quyet_toan","kl_hop_dong","don_gia_quyet_toan"]) if (!soKhongAm(h[k])) them(`${p}.${k}`, "SO_KHONG_HOP_LE", "Số ≥ 0, bắt buộc");
    for (const k of ["kl_thiet_ke_dieu_chinh","kl_nghiem_thu_hien_truong","kl_nghiem_thu_bbnt","don_gia_hop_dong"]) if (h[k] != null && !soKhongAm(h[k])) them(`${p}.${k}`, "SO_KHONG_HOP_LE", "Số ≥ 0 hoặc null");
    if (!("kl_nghiem_thu_hien_truong" in h)) them(`${p}.kl_nghiem_thu_hien_truong`, "THIEU_TRUONG", "Bắt buộc khai báo (được null nếu không có số đo)");
    if (soKhongAm(h.kl_hop_dong) && h.kl_hop_dong > 0 && h.don_gia_hop_dong == null) them(`${p}.don_gia_hop_dong`, "THIEU_TRUONG", "Bắt buộc khi hạng mục có trong hợp đồng");
    if (typeof h.co_so_do_hien_truong !== "boolean") them(`${p}.co_so_do_hien_truong`, "KIEU_SAI", "true/false");
  });
}

// tong_hop_khai_bao
const thkb = d.tong_hop_khai_bao;
if (!laObj(thkb)) them("tong_hop_khai_bao", "THIEU_TRUONG", "Bắt buộc");
else for (const k of ["tong_quyet_toan_truoc_thue","thue_suat_gtgt","tong_quyet_toan_sau_thue"]) if (!soKhongAm(thkb[k])) them(`tong_hop_khai_bao.${k}`, "SO_KHONG_HOP_LE", "Số ≥ 0");

// hoa_don_gtgt (bổ sung so với đặc tả: nếu có thì phải đủ số liệu, tránh NaN ở N09)
const hdg = d.hoa_don_gtgt;
if (hdg != null) {
  if (!laObj(hdg)) them("hoa_don_gtgt", "KIEU_SAI", "Phải là object hoặc null");
  else {
    if (!chuoiKhongRong(hdg.so)) them("hoa_don_gtgt.so", "THIEU_TRUONG", "Bắt buộc");
    if (!laNgay(hdg.ngay)) them("hoa_don_gtgt.ngay", "NGAY_KHONG_HOP_LE", "Định dạng YYYY-MM-DD");
    for (const k of ["gia_tri_truoc_thue","thue_suat","gia_tri_sau_thue"]) if (!soKhongAm(hdg[k])) them(`hoa_don_gtgt.${k}`, "SO_KHONG_HOP_LE", "Số ≥ 0");
  }
}

// chi_phi_giam_sat (bổ sung: kiểm kiểu)
const gs = d.chi_phi_giam_sat;
if (!laObj(gs)) them("chi_phi_giam_sat", "KIEU_SAI", "Phải là object");
else {
  for (const k of ["co_trong_du_toan","da_giao_don_vi","co_trong_quyet_toan"]) if (typeof gs[k] !== "boolean") them(`chi_phi_giam_sat.${k}`, "KIEU_SAI", "true/false");
  if (!soKhongAm(gs.gia_tri)) them("chi_phi_giam_sat.gia_tri", "SO_KHONG_HOP_LE", "Số ≥ 0");
}

// checklist: chỉ kiểm enum nếu có mặt; thiếu thì N10 coi là chua_kiem_tra
const KQ_CL = ["dat","khong_dat","chua_kiem_tra","khong_ap_dung"];
for (const nhom of ["checklist_ban_ve_hoan_cong","checklist_du_toan_quyet_toan"]) {
  const o = d[nhom];
  if (o == null) { canhBao.push(`Thiếu ${nhom} – mọi mục coi là chưa kiểm tra`); continue; }
  if (!laObj(o)) { them(nhom, "KIEU_SAI", "Phải là object"); continue; }
  for (const [k, v] of Object.entries(o)) {
    if (!laObj(v) || !KQ_CL.includes(v.ket_qua)) them(`${nhom}.${k}.ket_qua`, "GIA_TRI_KHONG_HOP_LE", KQ_CL.join("|"));
    else if (v.so_lieu != null && !laObj(v.so_lieu)) them(`${nhom}.${k}.so_lieu`, "KIEU_SAI", "Phải là object");
  }
}

// danh_gia_tieu_chi
if (d.danh_gia_tieu_chi != null) {
  if (!Array.isArray(d.danh_gia_tieu_chi)) them("danh_gia_tieu_chi", "KIEU_SAI", "Phải là mảng");
  else {
    const soGap = new Set();
    d.danh_gia_tieu_chi.forEach((t, i) => {
      if (!laObj(t) || !Number.isInteger(t.so) || t.so < 1 || t.so > 15) { them(`danh_gia_tieu_chi[${i}].so`, "GIA_TRI_KHONG_HOP_LE", "1..15"); return; }
      if (soGap.has(t.so)) them(`danh_gia_tieu_chi[${i}].so`, "TIEU_CHI_TRUNG", `Trùng tiêu chí ${t.so}`);
      soGap.add(t.so);
      if (t.so === 15) { canhBao.push("Tiêu chí 15 do máy tự lập – giá trị gửi lên bị bỏ qua"); return; }
      if (!["phu_hop","khong_phu_hop","chua_du_can_cu"].includes(t.ket_qua)) them(`danh_gia_tieu_chi[${i}].ket_qua`, "GIA_TRI_KHONG_HOP_LE", "phu_hop|khong_phu_hop|chua_du_can_cu");
      if (t.nhom_ycbs != null && !(Number.isInteger(t.nhom_ycbs) && t.nhom_ycbs >= 1 && t.nhom_ycbs <= 11)) them(`danh_gia_tieu_chi[${i}].nhom_ycbs`, "GIA_TRI_KHONG_HOP_LE", "1..11");
    });
  }
} else canhBao.push("Không có đánh giá tiêu chí – tiêu chí 1–14 coi là chưa đủ căn cứ");

return [{ json: { ...d, kiem_tra_cau_truc: { hop_le: loi.length === 0, loi, canh_bao: canhBao } } }];
