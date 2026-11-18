// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 12 — An Ám Can theo Can giờ: trường hợp đặc biệt (giờ Lục Giáp, Phục / Phản ngâm) Can giờ nhập Trung cung 5,
// giờ thường khởi tại cung Trực Sử; rồi phi qua Cửu Cung (Dương thuận, Âm nghịch) theo thứ tự Lục Nghi – Tam Kỳ.
// Giờ Giáp: Giáp ẩn dưới Cờ nên lấy can của Cờ.
//   KM.B12.tinh(duong, dacBiet, cungDenTS, canGio, co) → { cungKhoiAm, canKhoiAm, amCan: { 1..9: chỉ số Can } }
(function (KM) {
  "use strict";
  var C = KM.CongCu, T = KM.BangTra;
  function tinh(duong, dacBiet, cungDenTS, canG, co) {
    var cungKhoi = dacBiet ? 5 : cungDenTS, canKhoi = canG === 0 ? co : canG;
    var viTri = T.NGHI_KY.indexOf(canKhoi), amCan = {};
    for (var j = 0; j < 9; j++) amCan[C.phiCung(cungKhoi, j, duong)] = T.NGHI_KY[(viTri + j) % 9];
    return { cungKhoiAm: cungKhoi, canKhoiAm: canKhoi, amCan: amCan };
  }
  KM.B12 = { tinh: tinh };
})(typeof module !== "undefined" && module.exports ? (require("./cong-cu.js"), require("./bang-tra.js"), module.exports = require("./km.js")) : KM);
