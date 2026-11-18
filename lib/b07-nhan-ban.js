// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 7 — An Trực Sử (Bát Môn): từ cung của Cờ đếm Giáp → Can giờ theo số Cửu Cung (Dương thuận, Âm nghịch);
// dừng ở cung 5 thì mượn Khôn 2; các cửa còn lại xoay thuận kim đồng hồ.
//   KM.B7.tinh(duong, b5, canGio) → { cungDemSu, cungDenTS, dichMon, mon: { cung: tên Môn } }
(function (KM) {
  "use strict";
  var C = KM.CongCu, T = KM.BangTra;
  function tinh(duong, b5, canG) {
    var cungDemSu = C.phiCung(b5.cungCo, canG, duong);
    var cungDenTS = C.gui(cungDemSu);
    var monVong = T.VONG.map(function (p) { return T.MON_GOC[p]; });
    var dichMon = C.mod(T.VONG.indexOf(cungDenTS) - monVong.indexOf(b5.trucSu), 8);
    var mon = {};
    monVong.forEach(function (m, k) { mon[T.VONG[(k + dichMon) % 8]] = m; });
    return { cungDemSu: cungDemSu, cungDenTS: cungDenTS, dichMon: dichMon, mon: mon };
  }
  KM.B7 = { tinh: tinh };
})(typeof module !== "undefined" && module.exports ? (require("./cong-cu.js"), require("./bang-tra.js"), module.exports = require("./km.js")) : KM);
