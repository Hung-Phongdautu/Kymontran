// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 4 — Tuần thủ và Cờ: đếm lùi Can Chi giờ về can Giáp; Giáp ẩn dưới một Nghi.
//   KM.B4.tinh(canGio, chiGio) → { gio60, tuanThu, co, ky, thanQuan }
(function (KM) {
  "use strict";
  var C = KM.CongCu, T = KM.BangTra;
  function tinh(canG, chiG) {
    var gio60 = C.chiSo60(canG, chiG);
    if (gio60 < 0) throw new Error("Can Chi giờ không hợp lệ");
    var tuanThu = gio60 - canG, dong = T.TUAN_CO[tuanThu / 10];
    return { gio60: gio60, tuanThu: tuanThu, co: dong.co, ky: dong.ky, thanQuan: dong.thanQuan };
  }
  KM.B4 = { tinh: tinh };
})(typeof module !== "undefined" && module.exports ? (require("./cong-cu.js"), require("./bang-tra.js"), module.exports = require("./km.js")) : KM);
