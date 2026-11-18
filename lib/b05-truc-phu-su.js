// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 5 — Đại Trực Phù (Cửu Tinh) và Trực Sử (Bát Môn) theo cung của Cờ trên Địa bàn.
//   KM.B5.tinh(dia, co) → { cungCo, trucPhu, trucSu, cungGocTP }
//   Cờ ở Trung cung: Trực Phù là Thiên Cầm, Trực Sử là Tử Môn, cùng gửi Khôn 2.
(function (KM) {
  "use strict";
  var C = KM.CongCu, T = KM.BangTra;
  function tinh(dia, co) {
    var cungCo = KM.B3.cungCuaCan(dia, co);
    return { cungCo: cungCo, trucPhu: T.TINH_GOC[cungCo], trucSu: T.MON_GOC[cungCo], cungGocTP: C.gui(cungCo) };
  }
  KM.B5 = { tinh: tinh };
})(typeof module !== "undefined" && module.exports ? (require("./b03-dia-ban.js"), module.exports = require("./km.js")) : KM);
