// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 3 — An Thiên Can Địa bàn (Lục Nghi, Tam Kỳ): Mậu khởi tại cung bằng Cục số, Dương thuận, Âm nghịch.
//   KM.B3.tinh(duong, cuc) → { 1..9: chỉ số Can }
//   KM.B3.cungCuaCan(dia, can) → số cung đang chứa Can đó
(function (KM) {
  "use strict";
  var C = KM.CongCu, T = KM.BangTra;
  function tinh(duong, cuc) {
    var dia = {};
    for (var i = 0; i < 9; i++) dia[C.phiCung(cuc, i, duong)] = T.NGHI_KY[i];
    return dia;
  }
  function cungCuaCan(dia, can) { for (var p = 1; p <= 9; p++) if (dia[p] === can) return p; return -1; }
  KM.B3 = { tinh: tinh, cungCuaCan: cungCuaCan };
})(typeof module !== "undefined" && module.exports ? (require("./cong-cu.js"), require("./bang-tra.js"), module.exports = require("./km.js")) : KM);
