// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 2 — Phù đầu và Tam nguyên, chốt Cục số.
//   KM.B2.tinh(ngay60, tiet) → { phuDau, luiNgay, nhomChi, nguyen, duong, cuc }
//   ngay60: Can Chi ngày (0 – 59); tiet: chỉ số tiết khí (0 = Đông chí … 23 = Đại tuyết)
(function (KM) {
  "use strict";
  var T = KM.BangTra;
  function tinh(ngay60, tiet) {
    var lui = (ngay60 % 10) % 5;            // Giáp/Kỷ: 0 ngày; Ất/Canh: 1; Bính/Tân: 2; Đinh/Nhâm: 3; Mậu/Quý: 4
    var phuDau = ngay60 - lui, chi = phuDau % 12;
    var nhom = T.NHOM_PHU_DAU.filter(function (n) { return n.chi.indexOf(chi) >= 0; })[0];
    var t = T.TIET[tiet];
    return { phuDau: phuDau, luiNgay: lui, nhomChi: nhom.ten, nguyen: nhom.nguyen, duong: t.duong, cuc: t.cuc[nhom.nguyen] };
  }
  KM.B2 = { tinh: tinh };
})(typeof module !== "undefined" && module.exports ? (require("./bang-tra.js"), module.exports = require("./km.js")) : KM);
