// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Không gian tên chung KM của bộ máy lập trận. Mỗi tệp trong lib/ gắn phần của mình vào đây:
//   KM.CongCu   hàm dùng chung            (lib/cong-cu.js)
//   KM.BangTra  bảng tra của quy trình    (lib/bang-tra.js)
//   KM.Lich     lịch, tiết khí, quy đổi giờ (lib/lich.js, lib/tiet-khi-bang.js)
//   KM.B1 … KM.B12  mười hai bước lập trận  (lib/b01-…js đến lib/b12-…js)
//   KM.TrinhTu  diễn giải kết quả từng bước (lib/trinh-tu.js)
// Trong trình duyệt các tệp được ghép theo thứ tự ở build.py; trong Node mỗi tệp tự require phần nó cần.
var KM = typeof KM !== "undefined" ? KM : {};
if (typeof module !== "undefined" && module.exports) module.exports = KM;
