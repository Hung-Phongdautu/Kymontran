// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 8 — An Bát Thần Thiên bàn: thần Trực Phù đóng cùng Đại Trực Phù; Dương độn thuận, Âm độn nghịch kim đồng hồ.
//   KM.B8.tinh(duong, cungKhoi) → { cung: tên Thần }   (Bước 11 dùng lại hàm này với cung khởi khác)
(function (KM) {
  "use strict";
  var C = KM.CongCu, T = KM.BangTra;
  function tinh(duong, cungKhoi) {
    var out = {}, s = T.VONG.indexOf(cungKhoi);
    T.BAT_THAN.forEach(function (t, g) { out[T.VONG[C.mod(s + (duong ? g : -g), 8)]] = t; });
    return out;
  }
  KM.B8 = { tinh: tinh };
})(typeof module !== "undefined" && module.exports ? (require("./cong-cu.js"), require("./bang-tra.js"), module.exports = require("./km.js")) : KM);
