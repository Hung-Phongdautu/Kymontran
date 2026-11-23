// N08 – Đối chiếu ba chiều: hoàn công ↔ nghiệm thu hiện trường (SỐ GỐC) ↔ quyết toán.
/*@HELPERS*/
const d = $input.first().json; const C = d.cau_hinh;
const khop = (a, b) => Math.abs(a - b) <= C.DUNG_SAI_KL;
const r3 = v => Math.round(v * 1000) / 1000;
const ph = [];
const dc = d.kiem_tra_ho_so.co_dieu_chinh_day_du;

function khacThietKe(kl, tk) {
  if (tk === 0) return kl > 0;          // hạng mục phát sinh không có trong thiết kế
  if (kl === 0) return tk > 0;          // hạng mục thiết kế bị bỏ
  return Math.abs(kl - tk) / tk > C.NGUONG_KHAC_THIET_KE;
}

const ds = d.hang_muc.map(h => {
  const tk = (dc && h.kl_thiet_ke_dieu_chinh != null) ? h.kl_thiet_ke_dieu_chinh : h.kl_thiet_ke;
  const nt = h.kl_nghiem_thu_hien_truong;
  const r = { stt: h.stt, ten: h.ten, don_vi: h.don_vi, loai: h.loai, kl_tk_tham_chieu: tk,
    kl_hoan_cong: h.kl_hoan_cong, kl_nghiem_thu_hien_truong: nt, kl_nghiem_thu_bbnt: h.kl_nghiem_thu_bbnt,
    kl_quyet_toan: h.kl_quyet_toan, kl_hop_dong: h.kl_hop_dong, don_gia_quyet_toan: h.don_gia_quyet_toan,
    thanh_tien_quyet_toan: Math.round(h.kl_quyet_toan * h.don_gia_quyet_toan),
    ty_le_khac_thiet_ke: tk > 0 ? r3((h.kl_hoan_cong - tk) / tk) : null,
    khac_thiet_ke_hc: khacThietKe(h.kl_hoan_cong, tk),
    khac_thiet_ke_nt: nt != null && khacThietKe(nt, tk),
    lech_qt_hc: r3(h.kl_quyet_toan - h.kl_hoan_cong) };

  if (nt == null) {
    Object.assign(r, { lech_hc_nt: null, lech_qt_nt: null, lech_bbnt_nt: null, thanh_tien_anh_huong: null, trang_thai: "thieu_so_goc" });
    ph.push({ ma: "THIEU_SO_GOC", muc_do: "thieu_can_cu", nhom_ycbs: 6, yeu_cau: "Bổ sung", hang_muc_stt: h.stt, tien_anh_huong: null, nguon: "N08",
      noi_dung: `Hạng mục ${h.stt} "${h.ten}": không có khối lượng nghiệm thu hiện trường (số gốc) để đối chiếu` });
    return r;
  }
  r.lech_hc_nt = r3(h.kl_hoan_cong - nt);
  r.lech_qt_nt = r3(h.kl_quyet_toan - nt);
  r.lech_bbnt_nt = h.kl_nghiem_thu_bbnt == null ? null : r3(h.kl_nghiem_thu_bbnt - nt);
  r.thanh_tien_anh_huong = Math.round(r.lech_qt_nt * h.don_gia_quyet_toan);
  const lech = !khop(h.kl_hoan_cong, nt) || !khop(h.kl_quyet_toan, nt) || (r.lech_bbnt_nt != null && !khop(h.kl_nghiem_thu_bbnt, nt));
  r.trang_thai = lech ? "lech" : "khop";

  if (!khop(h.kl_quyet_toan, nt)) ph.push({ ma: "QT_LECH_NGHIEM_THU", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh", hang_muc_stt: h.stt,
    tien_anh_huong: r.thanh_tien_anh_huong, nguon: "N08",
    noi_dung: `Hạng mục ${h.stt} "${h.ten}": quyết toán ${h.kl_quyet_toan} ${h.don_vi} ≠ nghiệm thu hiện trường ${nt} ${h.don_vi} (lệch ${r.lech_qt_nt}); thành tiền ảnh hưởng ${fmtTien(r.thanh_tien_anh_huong)} đ` });
  if (!khop(h.kl_hoan_cong, nt)) ph.push({ ma: "HC_LECH_NGHIEM_THU", muc_do: "chan", nhom_ycbs: 9, yeu_cau: "Điều chỉnh", hang_muc_stt: h.stt,
    tien_anh_huong: null, nguon: "N08",
    noi_dung: `Hạng mục ${h.stt} "${h.ten}": bản vẽ hoàn công ${h.kl_hoan_cong} ≠ nghiệm thu hiện trường ${nt} ${h.don_vi}` });
  if (r.lech_bbnt_nt != null && !khop(h.kl_nghiem_thu_bbnt, nt)) ph.push({ ma: "BBNT_LECH_SO_GOC", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh",
    hang_muc_stt: h.stt, tien_anh_huong: null, nguon: "N08",
    noi_dung: `Hạng mục ${h.stt} "${h.ten}": BBNT ghi ${h.kl_nghiem_thu_bbnt} ≠ khối lượng chốt hiện trường ${nt} ${h.don_vi}` });
  return r;
});

const tt = ds.map(x => x.thanh_tien_anh_huong).filter(v => v != null);
return [{ json: { ...d,
  doi_chieu: {
    hang_muc: ds,
    tong_qt_tinh_lai: ds.reduce((s, x) => s + x.thanh_tien_quyet_toan, 0),
    tong_thanh_toan_du: tt.filter(v => v > 0).reduce((s, v) => s + v, 0),
    tong_thanh_toan_thieu: -tt.filter(v => v < 0).reduce((s, v) => s + v, 0),
    so_hang_muc_lech: ds.filter(x => x.trang_thai !== "khop").length,
    so_hang_muc_khac_thiet_ke: ds.filter(x => x.khac_thiet_ke_hc || x.khac_thiet_ke_nt).length },
  phat_hien: [...d.phat_hien, ...ph] } }];
