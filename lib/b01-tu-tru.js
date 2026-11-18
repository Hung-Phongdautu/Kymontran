// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Bước 1 — Đổi giờ và xác định tiết khí: Tứ trụ năm, tháng, ngày, giờ (Ngũ Tý Độn), tiết khí, Âm/Dương độn.
//   KM.B1.nguTyDon(canNgay, chiGio)  → Can giờ
//   KM.B1.canChiNgay(nam, thang0, ngay) → chỉ số Can Chi ngày (0 – 59)
//   KM.B1.tinh(date, tuyChon)        → Tứ trụ, tiết khí, quy đổi giờ
// Tùy chọn: muiGio (IANA), kinhDo (độ Đông), gioMatTroi (true: đổi theo giờ Mặt Trời thật),
//           doiNgay ("23" giờ Tý sớm — mặc định; "0" giờ Tý muộn: 23h – 24h giữ ngày cũ, Can giờ theo ngày hôm sau).
(function (KM) {
  "use strict";
  var C = KM.CongCu, T = KM.BangTra, L = KM.Lich, mod = C.mod;

  function nguTyDon(canNgay, chiGio) { return mod(T.NGU_TY_DON[canNgay % 5] + chiGio, 10); }
  function nguHoDon(canNam, chiThang) { return mod(T.NGU_HO_DON[canNam % 5] + mod(chiThang - 2, 12), 10); }
  // Ngày Can Chi theo số ngày Julius; 01/10/1949 là Giáp Tý (ví dụ ở Bước 1 của tài liệu).
  function canChiNgay(nam, thang0, ngay) { return mod(Math.floor(Date.UTC(nam, thang0, ngay) / 86400000) + 17, 60); }

  function tinh(date, tc) {
    tc = tc || {};
    var ms = date.getTime();
    var dongHo = L.gioDongHo(ms, tc.muiGio);
    var dungMT = !!tc.gioMatTroi && typeof tc.kinhDo === "number";
    var eot = L.phuongTrinhThoiGian(ms), gio = dongHo;
    if (dungMT) {
      var mt = new Date(ms + (tc.kinhDo * 4 + eot) * 60000);
      gio = { y: mt.getUTCFullYear(), m: mt.getUTCMonth() + 1, d: mt.getUTCDate(), h: mt.getUTCHours(), mi: mt.getUTCMinutes() };
    }
    var doiLuc23 = tc.doiNgay !== "0";
    var ngayTinh = new Date(Date.UTC(gio.y, gio.m - 1, gio.d + (doiLuc23 && gio.h >= 23 ? 1 : 0)));
    var ngay = canChiNgay(ngayTinh.getUTCFullYear(), ngayTinh.getUTCMonth(), ngayTinh.getUTCDate());
    var chiG = Math.floor(mod(gio.h + 1, 24) / 2);
    var canNgayChoGio = ngay % 10;
    if (!doiLuc23 && gio.h >= 23) canNgayChoGio = (canNgayChoGio + 1) % 10;
    var canG = nguTyDon(canNgayChoGio, chiG);
    var tk = L.tietTai(ms), ti = tk.i;
    // Tháng đổi ở các "tiết" (Tiểu hàn mở tháng Sửu, Lập xuân mở tháng Dần …); năm đổi ở Lập xuân.
    var chiT = mod(1 + Math.floor(mod(ti - 1, 24) / 2), 12);
    var namDL = dongHo.y;
    if (dongHo.m <= 6 && ti <= 2) namDL -= 1;
    var nam = mod(namDL - 4, 60);
    return {
      tuTru: { nam: nam, thang: C.chiSo60(nguHoDon(nam % 10, chiT), chiT), ngay: ngay, gio: C.chiSo60(canG, chiG) },
      canGio: canG, chiGio: chiG,
      tiet: ti, duong: T.TIET[ti].duong, giaoTiet: tk.giao, tietTiep: tk.tiep, nguonTiet: tk.nguon, ngayTinh: ngayTinh,
      quyDoi: { utc: ms, dongHo: dongHo, muiGio: tc.muiGio || "", lechMui: L.lechMuiGio(ms, tc.muiGio),
        kinhDo: typeof tc.kinhDo === "number" ? tc.kinhDo : null, eot: eot, gioMatTroi: dungMT, gioDung: gio, doiNgay: doiLuc23 ? "23" : "0" }
    };
  }
  KM.B1 = { nguTyDon: nguTyDon, nguHoDon: nguHoDon, canChiNgay: canChiNgay, tinh: tinh };
})(typeof module !== "undefined" && module.exports ? (require("./lich.js"), module.exports = require("./km.js")) : KM);
