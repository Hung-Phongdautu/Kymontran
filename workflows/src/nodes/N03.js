// N03 – Dữ liệu mẫu: sinh hồ sơ mẫu theo kịch bản để chạy thử không cần gửi HTTP.
// Đổi KICH_BAN rồi bấm "Execute workflow".
const KICH_BAN = "DAT"; // DAT | DIEU_CHINH_TK_DT | DUNG_QUYET_TOAN | CHUA_KET_LUAN | CONG_SO_LIEU | LOI_HANG_MUC_RONG
const goc = /*@MAU*/;
const hs = JSON.parse(JSON.stringify(goc));      // bản sao sâu
const tc = (so) => hs.danh_gia_tieu_chi.find(t => t.so === so);

switch (KICH_BAN) {
  case "DAT":
    break;
  case "DIEU_CHINH_TK_DT":
    tc(9).ket_qua = "khong_phu_hop";
    tc(9).nhan_xet = "Phát sinh 01 van chặn D100 so với dự toán duyệt, cần lập dự toán điều chỉnh";
    break;
  case "DUNG_QUYET_TOAN":
    Object.assign(hs.hang_muc[0], { kl_hoan_cong: 520, kl_nghiem_thu_hien_truong: 520, kl_nghiem_thu_bbnt: 520, kl_quyet_toan: 520 });
    hs.checklist_ban_ve_hoan_cong.chieu_dai_tuyen.so_lieu.chieu_dai_ban_ve = 520;
    tc(5).ket_qua = "khong_phu_hop";                       // người kiểm tra thấy đổi tuyến
    // tc(13), tc(14) vẫn "phu_hop" (nhập sai) -> máy phải hạ
    break;
  case "CHUA_KET_LUAN":
    hs.ho_so.find(h => h.ma === "HOA_DON_GTGT").co = false;
    hs.hoa_don_gtgt = null;
    hs.checklist_ban_ve_hoan_cong.loi_trinh_bay.ket_qua = "chua_kiem_tra";
    tc(10).ket_qua = "chua_du_can_cu";
    break;
  case "CONG_SO_LIEU":
    Object.assign(hs.hang_muc[3], { kl_nghiem_thu_bbnt: 135, kl_quyet_toan: 135, co_so_do_hien_truong: false });
    break;
  case "LOI_HANG_MUC_RONG":
    hs.hang_muc = [];
    break;
  default:
    throw new Error(`KICH_BAN không hợp lệ: ${KICH_BAN}`);
}
hs.__nguon_thu_cong = { kich_ban: KICH_BAN };   // dấu hiệu nguồn chạy thử
return [{ json: hs }];
