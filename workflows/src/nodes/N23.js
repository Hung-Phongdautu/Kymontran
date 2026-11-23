// N23 – Tạo phản hồi lỗi. Vào từ N06 (false) hoặc N13 (fallback). Không tạo dòng báo cáo (D5).
const d = $input.first().json;
const loi = d.kiem_tra_cau_truc && !d.kiem_tra_cau_truc.hop_le ? d.kiem_tra_cau_truc.loi
          : [{ truong: "ket_luan.ma", ma: "LOI_HE_THONG", thong_bao: `Kết luận ngoài dự kiến: ${d.ket_luan && d.ket_luan.ma}` }];
const chiHangMucRong = loi.length > 0 && loi.every(l => l.ma === "HANG_MUC_RONG");
const coLoiHeThong = loi.some(l => l.ma === "LOI_HE_THONG");
const http_status = coLoiHeThong ? 500 : chiHangMucRong ? 422 : 400;
const ma_loi = coLoiHeThong ? "LOI_HE_THONG" : chiHangMucRong ? "HANG_MUC_RONG" : "DAU_VAO_KHONG_HOP_LE";
return [{ json: { http_status, meta: d.meta || { nguon: "webhook" }, body: {
  ok: false, ma_loi, thong_bao: {
    DAU_VAO_KHONG_HOP_LE: "Hồ sơ JSON thiếu trường hoặc sai định dạng – xem danh sách lỗi",
    HANG_MUC_RONG: "Danh sách hạng mục rỗng – không thể đối chiếu khối lượng",
    LOI_HE_THONG: "Lỗi xử lý nội bộ – báo quản trị n8n" }[ma_loi],
  loi, canh_bao: (d.kiem_tra_cau_truc && d.kiem_tra_cau_truc.canh_bao) || [],
  ma_phien: (d.meta && d.meta.ma_phien) || null, thoi_diem: (d.meta && d.meta.thoi_diem) || null } } }];
