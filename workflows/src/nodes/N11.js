// N11 – Đánh giá 15 tiêu chí. Người kiểm tra nhập 1–14; máy chỉ được HẠ TC13/TC14 khi dữ liệu chứng minh; TC15 lập ở N12.
// Tên tiêu chí là TẠM (D3) – logic chỉ phụ thuộc số và nhóm.
const d = $input.first().json;
const DM = [
  { so: 1,  ten: "Căn cứ pháp lý, chủ trương đầu tư", nhom: "KHONG_BAT_BUOC", nhom_ycbs: 1 },
  { so: 2,  ten: "Sự phù hợp quy hoạch, lộ giới", nhom: "KHONG_BAT_BUOC", nhom_ycbs: 2 },
  { so: 3,  ten: "Quy mô, phạm vi theo chủ trương", nhom: "KHONG_BAT_BUOC", nhom_ycbs: 3 },
  { so: 4,  ten: "Điều chỉnh nhỏ vị trí tuyến trong phạm vi cho phép", nhom: "KHONG_BAT_BUOC", nhom_ycbs: 4 },
  { so: 5,  ten: "Thay đổi hướng tuyến / chiều dài tuyến", nhom: "BAT_BUOC_DC", nhom_ycbs: 5 },
  { so: 6,  ten: "Thay đổi đường kính / vật liệu ống", nhom: "BAT_BUOC_DC", nhom_ycbs: 5 },
  { so: 7,  ten: "Thay đổi biện pháp thi công không làm đổi khối lượng chính", nhom: "KHONG_BAT_BUOC", nhom_ycbs: 4 },
  { so: 8,  ten: "Thay đổi giải pháp kỹ thuật lắp đặt / đấu nối", nhom: "BAT_BUOC_DC", nhom_ycbs: 4 },
  { so: 9,  ten: "Phát sinh / cắt giảm hạng mục so với dự toán duyệt", nhom: "BAT_BUOC_DC", nhom_ycbs: 6 },
  { so: 10, ten: "Hoàn chỉnh trình bày hồ sơ bản vẽ, thuyết minh", nhom: "KHONG_BAT_BUOC", nhom_ycbs: 9 },
  { so: 11, ten: "Khối lượng thay đổi so với dự toán duyệt", nhom: "BAT_BUOC_DC", nhom_ycbs: 6 },
  { so: 12, ten: "Chênh lệch chi phí", nhom: "THAM_KHAO", nhom_ycbs: 7 },
  { so: 13, ten: "Chỉ có biên bản hiện trường, không có hồ sơ điều chỉnh", nhom: "CHAN_QT", nhom_ycbs: 5 },
  { so: 14, ten: "Hoàn công khác thiết kế mà không có điều chỉnh", nhom: "CHAN_QT", nhom_ycbs: 5 },
  { so: 15, ten: "Kết luận tổng hợp", nhom: "TONG_HOP", nhom_ycbs: null },
];
const nhap = new Map((d.danh_gia_tieu_chi || []).filter(t => t.so !== 15).map(t => [t.so, t]));
const tc = DM.map(m => {
  if (m.so === 15) return { ...m, ket_qua_nguoi_nhap: null, ket_qua: null, nguon: "tu_dong", nhan_xet: "", ly_do_tu_dong: "" };
  const t = nhap.get(m.so);
  return { ...m, nhom_ycbs: (t && t.nhom_ycbs) || m.nhom_ycbs,
    ket_qua_nguoi_nhap: t ? t.ket_qua : null, ket_qua: t ? t.ket_qua : "chua_du_can_cu",
    nguon: t ? "nguoi_kiem_tra" : "mac_dinh", nhan_xet: (t && t.nhan_xet) || "", ly_do_tu_dong: "" };
});
const hm = d.doi_chieu.hang_muc; const dc = d.kiem_tra_ho_so.co_dieu_chinh_day_du;
const coBBHT = (d.ho_so.find(h => h && h.ma === "BB_NGHIEM_THU_HIEN_TRUONG") || {}).co === true;
const ha = (so, lyDo) => { const t = tc[so - 1]; if (t.ket_qua !== "khong_phu_hop") { t.ket_qua = "khong_phu_hop"; t.nguon = "tu_dong"; } t.ly_do_tu_dong = lyDo; };

const nt = hm.filter(x => x.khac_thiet_ke_nt).map(x => `HM${x.stt} (${x.kl_nghiem_thu_hien_truong}/${x.kl_tk_tham_chieu} ${x.don_vi})`);
if (coBBHT && nt.length && !dc) ha(13, `Khối lượng chốt hiện trường khác thiết kế ở: ${nt.join(", ")} – chỉ có biên bản hiện trường, chưa có hồ sơ thiết kế – dự toán điều chỉnh`);
const hc = hm.filter(x => x.khac_thiet_ke_hc).map(x => `HM${x.stt} (${x.kl_hoan_cong}/${x.kl_tk_tham_chieu} ${x.don_vi})`);
if (hc.length) ha(14, dc ? `Hoàn công khác cả thiết kế điều chỉnh ở: ${hc.join(", ")}` : `Hoàn công khác thiết kế, không có điều chỉnh ở: ${hc.join(", ")}`);

return [{ json: { ...d, tieu_chi: tc } }];
