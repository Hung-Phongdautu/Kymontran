// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 6 — An Đại Trực Phù và Thiên Can Thiên bàn: Trực Phù bay tới cung của Can giờ (giờ Giáp lấy cung của Cờ),
// các sao và Can đi kèm xoay thuận kim đồng hồ, không phân biệt Âm / Dương. Thiên Cầm và can Trung cung đi cùng Thiên Nhuế.
//   KM.B6.tinh(dia, b5, canGio) → { cungCanGio, cungDenTP, dichTinh, thien: { cung: { tinh: [...], can: [...], tu } } }
(function (KM) {
  "use strict";
  var C = KM.CongCu, T = KM.BangTra;
  function tinh(dia, b5, canG) {
    var cungCanGio = canG === 0 ? b5.cungCo : KM.B3.cungCuaCan(dia, canG);
    var cungDenTP = C.gui(cungCanGio);
    var dichTinh = C.mod(T.VONG.indexOf(cungDenTP) - T.VONG.indexOf(b5.cungGocTP), 8);
    var thien = {};
    T.VONG.forEach(function (p, k) {
      thien[T.VONG[(k + dichTinh) % 8]] = {
        tinh: p === 2 ? [T.TINH_GOC[2], T.TINH_GOC[5]] : [T.TINH_GOC[p]],
        can: p === 2 ? [dia[2], dia[5]] : [dia[p]],
        tu: p
      };
    });
    return { cungCanGio: cungCanGio, cungDenTP: cungDenTP, dichTinh: dichTinh, thien: thien };
  }
  KM.B6 = { tinh: tinh };
})(typeof module !== "undefined" && module.exports ? (require("./b03-dia-ban.js"), module.exports = require("./km.js")) : KM);
