// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Hàm dùng chung cho các bước: chia dư, Can Chi 60, phi Cửu Cung, gửi Trung cung.
(function (KM) {
  "use strict";
  var CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  var CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  function mod(a, n) { return ((a % n) + n) % n; }
  KM.CongCu = {
    CAN: CAN, CHI: CHI, mod: mod,
    canChi: function (i) { i = mod(i, 60); return CAN[i % 10] + " " + CHI[i % 12]; },
    chiSo60: function (can, chi) { for (var k = 0; k < 60; k++) if (k % 10 === can && k % 12 === chi) return k; return -1; },
    // Cung 5 không có phương vị riêng: khi đặt Sao, Môn hay Thần vào Trung cung thì gửi sang Khôn 2.
    gui: function (p) { return p === 5 ? 2 : p; },
    // Đi qua Cửu Cung theo số Lạc Thư: Dương thuận (1 → 9), Âm nghịch (9 → 1).
    phiCung: function (batDau, buoc, duong) { return mod(batDau - 1 + (duong ? buoc : -buoc), 9) + 1; },
    hai: function (n) { return (n < 10 ? "0" : "") + n; }
  };
})(typeof module !== "undefined" && module.exports ? (module.exports = require("./km.js")) : KM);
