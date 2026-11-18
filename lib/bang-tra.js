// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Thư viện tra cứu của quy trình 12 bước (docs/quy-trinh-lap-tran.md). Mỗi bảng ghi bước của tài liệu.
// Chỉ số Can: 0 Giáp … 9 Quý; chỉ số Chi: 0 Tý … 11 Hợi; số cung theo Lạc Thư 1 – 9.
(function (KM) {
  "use strict";
  KM.BangTra = {
    NGUYEN: ["Thượng nguyên", "Trung nguyên", "Hạ nguyên"],

    // Bước 3, mục 1 — Lạc Thư Cửu Cung (Hậu Thiên Bát Quái)
    CUNG: {
      1: { ten: "KHẢM", huong: "Bắc", hanh: "Thủy" },
      2: { ten: "KHÔN", huong: "Tây Nam", hanh: "Thổ" },
      3: { ten: "CHẤN", huong: "Đông", hanh: "Mộc" },
      4: { ten: "TỐN", huong: "Đông Nam", hanh: "Mộc" },
      5: { ten: "TRUNG", huong: "Trung tâm", hanh: "Thổ" },
      6: { ten: "CÀN", huong: "Tây Bắc", hanh: "Kim" },
      7: { ten: "ĐOÀI", huong: "Tây", hanh: "Kim" },
      8: { ten: "CẤN", huong: "Đông Bắc", hanh: "Thổ" },
      9: { ten: "LY", huong: "Nam", hanh: "Hỏa" }
    },
    // Bước 6 – 8 — tám cung ngoại vi theo chiều kim đồng hồ: Khảm 1 → Cấn 8 → Chấn 3 → Tốn 4 → Ly 9 → Khôn 2 → Đoài 7 → Càn 6
    VONG: [1, 8, 3, 4, 9, 2, 7, 6],
    // Bước 3, mục 2 — thứ tự bất biến Mậu, Kỷ, Canh, Tân, Nhâm, Quý, Đinh, Bính, Ất
    NGHI_KY: [4, 5, 6, 7, 8, 9, 3, 2, 1],

    // Bước 1, mục 4 — bảng tổng hợp Cục số 24 tiết khí (Thượng – Trung – Hạ nguyên), bắt đầu Đông chí.
    TIET: [
      ["Đông chí", 1, 7, 4], ["Tiểu hàn", 2, 8, 5], ["Đại hàn", 3, 9, 6], ["Lập xuân", 8, 5, 2],
      ["Vũ thủy", 9, 6, 3], ["Kinh trập", 1, 7, 4], ["Xuân phân", 3, 9, 6], ["Thanh minh", 4, 1, 7],
      ["Cốc vũ", 5, 2, 8], ["Lập hạ", 4, 1, 7], ["Tiểu mãn", 5, 2, 8], ["Mang chủng", 6, 3, 9],
      ["Hạ chí", 9, 3, 6], ["Tiểu thử", 8, 2, 5], ["Đại thử", 7, 1, 4], ["Lập thu", 2, 5, 8],
      ["Xử thử", 1, 4, 7], ["Bạch lộ", 9, 3, 6], ["Thu phân", 7, 1, 4], ["Hàn lộ", 6, 9, 3],
      ["Sương giáng", 5, 8, 2], ["Lập đông", 6, 9, 3], ["Tiểu tuyết", 5, 8, 2], ["Đại tuyết", 4, 7, 1]
    ].map(function (r, i) { return { ten: r[0], duong: i < 12, kinhDo: (270 + 15 * i) % 360, cuc: [r[1], r[2], r[3]] }; }),

    // Bước 1, mục 1 — Ngũ Tý Độn: Can giờ Tý theo nhóm Can ngày (Giáp/Kỷ, Ất/Canh, Bính/Tân, Đinh/Nhâm, Mậu/Quý)
    NGU_TY_DON: [0, 2, 4, 6, 8],
    // Bước 1, mục 5 — Ngũ Hổ Độn: Can tháng Dần theo nhóm Can năm
    NGU_HO_DON: [2, 4, 6, 8, 0],

    // Bước 2, mục 2 — nhóm Địa Chi của Phù đầu → Tam nguyên
    NHOM_PHU_DAU: [
      { ten: "Tứ Chính", chi: [0, 6, 3, 9], nguyen: 0 },
      { ten: "Tứ Sinh", chi: [2, 8, 5, 11], nguyen: 1 },
      { ten: "Tứ Mộ", chi: [4, 10, 1, 7], nguyen: 2 }
    ],

    // Bước 4, mục 3 — Tuần thủ và Cờ (Lục Nghi), kèm tên vị thần quân chủ quản
    TUAN_CO: [
      { tuan: 0, co: 4, ky: "Chính hoàng kỳ", thanQuan: "Vương Văn Khanh" },
      { tuan: 10, co: 5, ky: "Tương hoàng kỳ", thanQuan: "Từ Hà Lợi" },
      { tuan: 20, co: 6, ky: "Chính bạch kỳ", thanQuan: "Cái Tân" },
      { tuan: 30, co: 7, ky: "Tương bạch kỳ", thanQuan: "Linh Quang" },
      { tuan: 40, co: 8, ky: "Chính hắc kỳ", thanQuan: "Hàm Chương" },
      { tuan: 50, co: 9, ky: "Tương hắc kỳ", thanQuan: "Lâm Binh" }
    ],

    // Bước 5, mục 2 — bản cung nguyên thủy của Cửu Tinh và Bát Môn (kèm ngũ hành)
    TINH_GOC: { 1: "Thiên Bồng", 2: "Thiên Nhuế", 3: "Thiên Xung", 4: "Thiên Phụ", 5: "Thiên Cầm", 6: "Thiên Tâm", 7: "Thiên Trụ", 8: "Thiên Nhậm", 9: "Thiên Anh" },
    HANH_TINH: { "Thiên Bồng": "Thủy", "Thiên Nhuế": "Thổ", "Thiên Xung": "Mộc", "Thiên Phụ": "Mộc", "Thiên Cầm": "Thổ", "Thiên Tâm": "Kim", "Thiên Trụ": "Kim", "Thiên Nhậm": "Thổ", "Thiên Anh": "Hỏa" },
    // Trung cung không có môn riêng: Tuần thủ rơi vào cung 5 thì Trực Sử gửi theo Khôn 2 (Tử Môn).
    MON_GOC: { 1: "Hưu Môn", 2: "Tử Môn", 3: "Thương Môn", 4: "Đỗ Môn", 5: "Tử Môn", 6: "Khai Môn", 7: "Kinh Môn", 8: "Sinh Môn", 9: "Cảnh Môn" },
    HANH_MON: { "Hưu Môn": "Thủy", "Sinh Môn": "Thổ", "Thương Môn": "Mộc", "Đỗ Môn": "Mộc", "Cảnh Môn": "Hỏa", "Tử Môn": "Thổ", "Kinh Môn": "Kim", "Khai Môn": "Kim" },

    // Bước 8, mục 2 — thứ tự bất biến và thuộc tính của Bát Thần
    BAT_THAN: ["Trực Phù", "Đằng Xà", "Thái Âm", "Lục Hợp", "Bạch Hổ", "Huyền Vũ", "Cửu Địa", "Cửu Thiên"],
    TINH_CHAT_THAN: {
      "Trực Phù": "Thủ lĩnh Bát Thần, cát lợi bậc nhất, giải trừ tai ách, bảo hộ quý nhân.",
      "Đằng Xà": "Hỏa; chủ quái dị, kinh sợ, thị phi, dối trá.",
      "Thái Âm": "Kim âm; chủ che giấu, tĩnh lặng, mật mưu kế sách.",
      "Lục Hợp": "Mộc; chủ hòa hợp, hòa giải, giao dịch, hôn nhân.",
      "Bạch Hổ": "Kim (Câu Trần); chủ tranh đấu, binh đao, tai nạn, tật bệnh.",
      "Huyền Vũ": "Thủy (Chu Tước); chủ trộm cắp, khẩu thiệt, mưu mô, mất mát giấy tờ.",
      "Cửu Địa": "Thổ; nhu thuận, trầm tĩnh, lợi phòng thủ, gieo trồng.",
      "Cửu Thiên": "Kim; cương cường, chuyển động, lợi xuất hành, thăng tiến."
    },

    // Bước 9, mục 2 — 12 Địa Chi trên Cửu Cung (Tý 1, Sửu Dần 8, Mão 3, Thìn Tỵ 4, Ngọ 9, Mùi Thân 2, Dậu 7, Tuất Hợi 6)
    CHI_CUNG: [1, 8, 8, 3, 4, 4, 9, 2, 2, 7, 6, 6],
    // Bước 9, mục 1 — Mã Tinh theo Tam Hợp của chi giờ (chỉ số theo chi giờ mod 4)
    MA_TINH: [2, 11, 8, 5], // Thân Tý Thìn → Dần; Tỵ Dậu Sửu → Hợi; Dần Ngọ Tuất → Thân; Hợi Mão Mùi → Tỵ

    // Bước 11, 12 — cung đối xung 180° (để nhận Phản ngâm)
    DOI_XUNG: { 1: 9, 9: 1, 8: 2, 2: 8, 3: 7, 7: 3, 4: 6, 6: 4 }
  };
})(typeof module !== "undefined" && module.exports ? (module.exports = require("./km.js")) : KM);
