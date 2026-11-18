// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Lịch dùng cho Bước 1: giờ giao tiết, kinh độ Mặt Trời, phương trình thời gian, quy đổi múi giờ.
(function (KM) {
  "use strict";
  var mod = KM.CongCu.mod, hai = KM.CongCu.hai, TIET = KM.BangTra.TIET;

  // Bảng giờ giao tiết 1900 – 2100 (lib/tiet-khi-bang.js, từ Thọ Tinh vạn niên lịch); ngoài khoảng đó dùng công thức.
  var BANG = null;
  (function () {
    var b = KM.BangTietKhi;
    if (!b) return;
    var t = [b.phut0 * 60000], m = b.phut0;
    for (var k = 0; k < b.buoc.length; k += 3) { m += parseInt(b.buoc.substr(k, 3), 36) + 20000; t.push(m * 60000); }
    BANG = { dau: b.dau, t: t };
  })();

  // Kinh độ Mặt Trời biểu kiến — J. Meeus, Astronomical Algorithms, chương 25 (sai số khoảng 0,01°).
  function kinhDoMatTroi(ms) {
    var T = (ms / 86400000 + 2440587.5 + 69 / 86400 - 2451545) / 36525; // +69 giây: giờ TT so với UT
    var rad = Math.PI / 180;
    var L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    var M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * rad;
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
    var omega = (125.04 - 1934.136 * T) * rad;
    return mod(L0 + C - 0.00569 - 0.00478 * Math.sin(omega), 360);
  }
  function chiSoTiet(kinhDo) { return Math.floor(mod(kinhDo - 270, 360) / 15); }
  function thoiDiemGiaoTiet(ms, i) { // dò thời điểm Mặt Trời tới kinh độ của tiết i
    var t = ms;
    for (var n = 0; n < 8; n++) {
      var lech = mod(kinhDoMatTroi(t) - TIET[i].kinhDo + 180, 360) - 180;
      t -= lech / 0.98564736 * 86400000;
      if (Math.abs(lech) < 1e-6) break;
    }
    return new Date(t);
  }
  // Tiết khí đang hiệu lực tại thời điểm ms: chỉ số (0 = Đông chí), lúc giao tiết, tiết kế tiếp, nguồn số liệu.
  function tietTai(ms) {
    if (BANG && ms >= BANG.t[0] && ms < BANG.t[BANG.t.length - 1]) {
      var lo = 0, hi = BANG.t.length - 1;
      while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (BANG.t[mid] <= ms) lo = mid; else hi = mid; }
      return { i: (BANG.dau + lo) % 24, giao: new Date(BANG.t[lo]), tiep: new Date(BANG.t[lo + 1]), nguon: "bang" };
    }
    var i = chiSoTiet(kinhDoMatTroi(ms));
    return { i: i, giao: thoiDiemGiaoTiet(ms, i), tiep: thoiDiemGiaoTiet(ms + 16 * 86400000, (i + 1) % 24), nguon: "congthuc" };
  }
  // Phương trình thời gian (phút): giờ Mặt Trời thật trừ giờ Mặt Trời trung bình — công thức NOAA, sai số dưới 1 phút.
  function phuongTrinhThoiGian(ms) {
    var d = new Date(ms), dauNam = Date.UTC(d.getUTCFullYear(), 0, 1);
    var soNgay = (Date.UTC(d.getUTCFullYear() + 1, 0, 1) - dauNam) / 86400000;
    var g = 2 * Math.PI / soNgay * ((ms - dauNam) / 86400000);
    return 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  }
  // Giờ đồng hồ của thời điểm ms tại múi giờ IANA `mui` (bỏ trống = múi giờ của máy).
  function gioDongHo(ms, mui) {
    var d = new Date(ms);
    if (!mui) return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate(), h: d.getHours(), mi: d.getMinutes() };
    var f = new Intl.DateTimeFormat("en-US", { timeZone: mui, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" });
    var o = {};
    f.formatToParts(d).forEach(function (p) { o[p.type] = parseInt(p.value, 10); });
    return { y: o.year, m: o.month, d: o.day, h: o.hour % 24, mi: o.minute };
  }
  function lechMuiGio(ms, mui) { // phút, giờ đồng hồ trừ UTC
    var g = gioDongHo(ms, mui);
    return Math.round((Date.UTC(g.y, g.m - 1, g.d, g.h, g.mi) - Math.floor(ms / 60000) * 60000) / 60000);
  }
  // Giờ đồng hồ tại múi giờ `mui` → thời điểm tuyệt đối (mili giây UTC).
  function thoiDiemTuGioDongHo(y, m, d, h, mi, mui) {
    if (!mui) return new Date(y, m - 1, d, h, mi).getTime();
    var dongHo = Date.UTC(y, m - 1, d, h, mi), ms = dongHo;
    for (var k = 0; k < 3; k++) ms = dongHo - lechMuiGio(ms, mui) * 60000;
    return ms;
  }
  function dinhDangGio(d, mui) {
    var g = gioDongHo(d.getTime(), mui);
    return hai(g.h) + ":" + hai(g.mi) + " ngày " + hai(g.d) + "/" + hai(g.m) + "/" + g.y;
  }

  KM.Lich = {
    kinhDoMatTroi: kinhDoMatTroi, tietTai: tietTai, phuongTrinhThoiGian: phuongTrinhThoiGian,
    gioDongHo: gioDongHo, lechMuiGio: lechMuiGio, thoiDiemTuGioDongHo: thoiDiemTuGioDongHo,
    dinhDangGio: dinhDangGio, coBangTiet: function () { return !!BANG; }
  };
})(typeof module !== "undefined" && module.exports
  ? (require("./cong-cu.js"), require("./bang-tra.js"), require("./tiet-khi-bang.js"), module.exports = require("./km.js"))
  : KM);
