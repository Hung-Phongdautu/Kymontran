// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 11 — An Bát Thần Địa bàn (Ám thần).
//   Trường hợp 1 (giờ Lục Giáp, Phục ngâm hoặc Phản ngâm toàn trận): an trùng Bát Thần Thiên bàn.
//   Trường hợp 2 (giờ thường): khởi Trực Phù tại cung gốc của Đại Trực Phù, cùng chiều với Thần bàn.
//   KM.B11.tinh(duong, canGio, b5, b6) → { phucNgam, phanNgam, dacBiet, thanDia }
(function (KM) {
  "use strict";
  function tinh(duong, canG, b5, b6) {
    var phucNgam = b6.dichTinh === 0, phanNgam = b6.dichTinh === 4;
    var dacBiet = canG === 0 || phucNgam || phanNgam;
    return { phucNgam: phucNgam, phanNgam: phanNgam, dacBiet: dacBiet, thanDia: KM.B8.tinh(duong, dacBiet ? b6.cungDenTP : b5.cungGocTP) };
  }
  KM.B11 = { tinh: tinh };
})(typeof module !== "undefined" && module.exports ? (require("./b08-than-ban.js"), module.exports = require("./km.js")) : KM);
