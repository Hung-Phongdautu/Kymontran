// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 10 — Không Vong (Tuần Không): hai Địa Chi không có Can phối trong tuần của giờ.
//   KM.B10.tinh(tuanThu) → { chi: [a, b], cung: [một hoặc hai cung] }
(function (KM) {
  "use strict";
  var C = KM.CongCu, T = KM.BangTra;
  function tinh(tuanThu) {
    var chiTuan = tuanThu % 12, chi = [C.mod(chiTuan + 10, 12), C.mod(chiTuan + 11, 12)], cung = [];
    chi.forEach(function (c) { if (cung.indexOf(T.CHI_CUNG[c]) < 0) cung.push(T.CHI_CUNG[c]); });
    return { chi: chi, cung: cung };
  }
  KM.B10 = { tinh: tinh };
})(typeof module !== "undefined" && module.exports ? (require("./cong-cu.js"), require("./bang-tra.js"), module.exports = require("./km.js")) : KM);
