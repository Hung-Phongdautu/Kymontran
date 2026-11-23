// N17 – Đóng gói đầu ra (Mục 6.1) + chuyển tiếp meta cho N18.
const d = $input.first().json;
const pick = (o, ks) => Object.fromEntries(ks.map(k => [k, o[k]]));
return [{ json: { http_status: 200, meta: d.meta, body: {
  ok: true, ma_phien: d.meta.ma_phien, thoi_diem: d.meta.thoi_diem, phien_ban_quy_tac: d.meta.phien_ban_quy_tac,
  nguon: d.meta.nguon, kich_ban: d.meta.kich_ban,
  cong_trinh: pick(d.cong_trinh, ["ma_cong_trinh", "ten_cong_trinh", "chi_nhanh", "dia_diem"]),
  ket_luan: d.ket_luan, tieu_chi: d.tieu_chi, kiem_tra_ho_so: d.kiem_tra_ho_so, doi_chieu_ba_chieu: d.doi_chieu,
  kiem_tra_hop_dong: d.kiem_tra_hop_dong, checklist_gd5: d.checklist_gd5, phat_hien: d.phat_hien,
  phieu_ycbs: d.phieu_ycbs ?? null, to_trinh: d.to_trinh ?? null, dong_bao_cao: d.dong_bao_cao,
  canh_bao: d.kiem_tra_cau_truc.canh_bao,
  thong_bao: { can_gui: d.ket_luan.ma !== "DAT", trang_thai: "cho_nguoi_duyet",
    nguoi_nhan: [d.cong_trinh.email_chi_nhanh, d.cong_trinh.nha_thau && d.cong_trinh.nha_thau.email].filter(Boolean) },
} } }];
