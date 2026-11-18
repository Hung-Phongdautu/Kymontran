// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 9 — Mã Tinh (Dịch Mã) theo Tam Hợp của chi giờ; luôn đóng ở cung góc Cấn 8, Tốn 4, Khôn 2 hoặc Càn 6.
//   KM.B9.tinh(chiGio) → { chi, cung }
(function (KM) {
  "use strict";
  var T = KM.BangTra;
  function tinh(chiG) { var chi = T.MA_TINH[chiG % 4]; return { chi: chi, cung: T.CHI_CUNG[chi] }; }
  KM.B9 = { tinh: tinh };
})(typeof module !== "undefined" && module.exports ? (require("./bang-tra.js"), module.exports = require("./km.js")) : KM);
