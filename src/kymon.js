// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// ===== Bộ máy lập trận Kỳ Môn Độn Giáp =====
// Viết theo tài liệu "Quy trình lập trận Kỳ Môn Độn Giáp" (12 bước) của Trận Pháp Kỳ Môn.
// Mỗi hàm bên dưới ứng với một bước; số bước được ghi ở đầu hàm.
//
//   KyMon.lapTran(date)            lập trận cho một thời điểm (đủ 12 bước, có lịch Can Chi)
//   KyMon.anBan(duong, cuc, can, chi)  an bàn từ Bước 3 đến Bước 12 khi đã biết Cục và Can Chi giờ
//
// Không phụ thuộc trình duyệt: chạy được cả trong Node để kiểm thử (tests/test_kymon.mjs).
var KyMon = (function () {
  "use strict";

  var CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
  var CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  var NGUYEN = ["Thượng nguyên", "Trung nguyên", "Hạ nguyên"];

  // Lạc Thư Cửu Cung (Bước 3, mục 1)
  var CUNG = {
    1: { ten: "KHẢM", huong: "Bắc", hanh: "Thủy" },
    2: { ten: "KHÔN", huong: "Tây Nam", hanh: "Thổ" },
    3: { ten: "CHẤN", huong: "Đông", hanh: "Mộc" },
    4: { ten: "TỐN", huong: "Đông Nam", hanh: "Mộc" },
    5: { ten: "TRUNG", huong: "Trung tâm", hanh: "Thổ" },
    6: { ten: "CÀN", huong: "Tây Bắc", hanh: "Kim" },
    7: { ten: "ĐOÀI", huong: "Tây", hanh: "Kim" },
    8: { ten: "CẤN", huong: "Đông Bắc", hanh: "Thổ" },
    9: { ten: "LY", huong: "Nam", hanh: "Hỏa" }
  };

  // Tám cung ngoại vi theo chiều kim đồng hồ: Khảm 1 → Cấn 8 → Chấn 3 → Tốn 4 → Ly 9 → Khôn 2 → Đoài 7 → Càn 6
  var VONG = [1, 8, 3, 4, 9, 2, 7, 6];

  // Thứ tự bất biến của Lục Nghi – Tam Kỳ: Mậu, Kỷ, Canh, Tân, Nhâm, Quý, Đinh, Bính, Ất (chỉ số trong CAN)
  var NGHI_KY = [4, 5, 6, 7, 8, 9, 3, 2, 1];

  // Bản cung nguyên thủy của Cửu Tinh và Bát Môn (Bước 5, mục 2)
  var TINH_GOC = { 1: "Thiên Bồng", 2: "Thiên Nhuế", 3: "Thiên Xung", 4: "Thiên Phụ", 5: "Thiên Cầm", 6: "Thiên Tâm", 7: "Thiên Trụ", 8: "Thiên Nhậm", 9: "Thiên Anh" };
  // Trung cung không có môn riêng: Tuần thủ rơi vào cung 5 thì Trực Sử gửi theo Khôn 2 (Tử Môn).
  var MON_GOC = { 1: "Hưu Môn", 2: "Tử Môn", 3: "Thương Môn", 4: "Đỗ Môn", 5: "Tử Môn", 6: "Khai Môn", 7: "Kinh Môn", 8: "Sinh Môn", 9: "Cảnh Môn" };

  // Thứ tự bất biến của Bát Thần (Bước 8, mục 2)
  var BAT_THAN = ["Trực Phù", "Đằng Xà", "Thái Âm", "Lục Hợp", "Bạch Hổ", "Huyền Vũ", "Cửu Địa", "Cửu Thiên"];

  // Vị trí 12 Địa Chi trên Cửu Cung (Bước 9, mục 2)
  var CHI_CUNG = [1, 8, 8, 3, 4, 4, 9, 2, 2, 7, 6, 6];

  // 24 tiết khí bắt đầu từ Đông chí; kinhDo là kinh độ Mặt Trời lúc giao tiết; cuc là Thượng – Trung – Hạ nguyên
  // (Bước 1, mục 4 — bảng tổng hợp Cục số 24 tiết khí). 12 tiết đầu là Dương độn, 12 tiết sau là Âm độn.
  var TIET = [
    ["Đông chí", 1, 7, 4], ["Tiểu hàn", 2, 8, 5], ["Đại hàn", 3, 9, 6], ["Lập xuân", 8, 5, 2],
    ["Vũ thủy", 9, 6, 3], ["Kinh trập", 1, 7, 4], ["Xuân phân", 3, 9, 6], ["Thanh minh", 4, 1, 7],
    ["Cốc vũ", 5, 2, 8], ["Lập hạ", 4, 1, 7], ["Tiểu mãn", 5, 2, 8], ["Mang chủng", 6, 3, 9],
    ["Hạ chí", 9, 3, 6], ["Tiểu thử", 8, 2, 5], ["Đại thử", 7, 1, 4], ["Lập thu", 2, 5, 8],
    ["Xử thử", 1, 4, 7], ["Bạch lộ", 9, 3, 6], ["Thu phân", 7, 1, 4], ["Hàn lộ", 6, 9, 3],
    ["Sương giáng", 5, 8, 2], ["Lập đông", 6, 9, 3], ["Tiểu tuyết", 5, 8, 2], ["Đại tuyết", 4, 7, 1]
  ].map(function (r, i) {
    return { ten: r[0], duong: i < 12, kinhDo: (270 + 15 * i) % 360, cuc: [r[1], r[2], r[3]] };
  });

  function mod(a, n) { return ((a % n) + n) % n; }
  function canChi(i) { i = mod(i, 60); return CAN[i % 10] + " " + CHI[i % 12]; }
  function chiSo60(can, chi) { for (var k = 0; k < 60; k++) if (k % 10 === can && k % 12 === chi) return k; return -1; }
  function tenCung(p) { return CUNG[p].ten + " " + p; }
  // Cung 5 không có phương vị riêng: khi phải đặt Sao, Môn hay Thần vào Trung cung thì gửi sang Khôn 2.
  function gui(p) { return p === 5 ? 2 : p; }
  // Đi qua Cửu Cung theo số Lạc Thư: Dương thuận (1→9), Âm nghịch (9→1)
  function phiCung(batDau, buoc, duong) { return mod(batDau - 1 + (duong ? buoc : -buoc), 9) + 1; }

  // ---------- Lịch: kinh độ Mặt Trời và tiết khí ----------
  // Công thức gần đúng của J. Meeus (Astronomical Algorithms, chương 25), sai số khoảng 0,01°
  // tức khoảng 15 phút ở thời điểm giao tiết.
  function ngayJulius(ms) { return ms / 86400000 + 2440587.5; }
  function kinhDoMatTroi(ms) {
    var T = (ngayJulius(ms) + 69 / 86400 - 2451545) / 36525; // +69 giây: chênh lệch giờ TT so với UT
    var rad = Math.PI / 180;
    var L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    var M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * rad;
    var C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
    var omega = (125.04 - 1934.136 * T) * rad;
    return mod(L0 + C - 0.00569 - 0.00478 * Math.sin(omega), 360);
  }
  function chiSoTiet(kinhDo) { return Math.floor(mod(kinhDo - 270, 360) / 15); }
  // Tìm thời điểm Mặt Trời tới kinh độ của tiết `i`, bắt đầu dò từ `ms` (đang ở trong tiết đó).
  function thoiDiemGiaoTiet(ms, i) {
    var t = ms;
    for (var n = 0; n < 8; n++) {
      var lech = mod(kinhDoMatTroi(t) - TIET[i].kinhDo + 180, 360) - 180;
      t -= lech / 0.98564736 * 86400000;
      if (Math.abs(lech) < 1e-6) break;
    }
    return new Date(t);
  }

  // ---------- Bước 1: Tứ trụ, Ngũ Tý Độn, tiết khí ----------
  // Ngày Can Chi tính theo số ngày Julius; ngày 01/10/1949 là Giáp Tý (ví dụ ở Bước 1 của tài liệu).
  function chiSoNgay(nam, thang, ngay) { return mod(Math.floor(Date.UTC(nam, thang, ngay) / 86400000) + 17, 60); }
  // Ngũ Tý Độn: Giáp Kỷ khởi Giáp Tý, Ất Canh khởi Bính Tý, Bính Tân khởi Mậu Tý, Đinh Nhâm khởi Canh Tý, Mậu Quý khởi Nhâm Tý.
  function canGio(canNgay, chiGio) { return mod((canNgay % 5) * 2 + chiGio, 10); }
  // Ngũ Hổ Độn: Giáp Kỷ khởi Bính Dần, Ất Canh khởi Mậu Dần, Bính Tân khởi Canh Dần, Đinh Nhâm khởi Nhâm Dần, Mậu Quý khởi Giáp Dần.
  function canThang(canNam, chiThang) { return mod((canNam % 5) * 2 + 2 + mod(chiThang - 2, 12), 10); }

  function buoc1(date) {
    var ms = date.getTime(), gio = date.getHours();
    // Giờ Tý bắt đầu lúc 23h và là giờ đầu tiên của ngày hôm sau.
    var ngayAm = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (gio >= 23 ? 1 : 0));
    var ngay = chiSoNgay(ngayAm.getFullYear(), ngayAm.getMonth(), ngayAm.getDate());
    var chiG = Math.floor(mod(gio + 1, 24) / 2);
    var canG = canGio(ngay % 10, chiG);
    var kd = kinhDoMatTroi(ms), ti = chiSoTiet(kd);
    // Tháng Can Chi đổi ở các "tiết" (Lập xuân mở tháng Dần, Kinh trập mở tháng Mão, ...).
    var chiT = mod(Math.floor(mod(kd - 315, 360) / 30) + 2, 12);
    // Năm Can Chi đổi ở Lập xuân: tháng 1 – 2 trước Lập xuân vẫn thuộc năm trước.
    var namDL = date.getFullYear();
    if (date.getMonth() < 6 && kd >= 270 && kd < 315) namDL -= 1;
    var nam = mod(namDL - 4, 60);
    var thang = chiSo60(canThang(nam % 10, chiT), chiT);
    return {
      tuTru: { nam: nam, thang: thang, ngay: ngay, gio: chiSo60(canG, chiG) },
      canGio: canG, chiGio: chiG, canNgay: ngay % 10,
      tiet: ti, kinhDo: kd, giaoTiet: thoiDiemGiaoTiet(ms, ti),
      ngayTinh: ngayAm
    };
  }

  // ---------- Bước 2: Phù đầu, Tam nguyên, Cục số ----------
  function buoc2(chiSoNgayCC, tiet) {
    // Đếm lùi Can Chi ngày tới ngày có can Giáp hoặc Kỷ gần nhất.
    var phuDau = chiSoNgayCC - (chiSoNgayCC % 10) % 5;
    var chi = phuDau % 12;
    // Tứ Chính (Tý Ngọ Mão Dậu) → Thượng; Tứ Sinh (Dần Thân Tỵ Hợi) → Trung; Tứ Mộ (Thìn Tuất Sửu Mùi) → Hạ.
    var nhom = [0, 6, 3, 9].indexOf(chi) >= 0 ? 0 : ([2, 8, 5, 11].indexOf(chi) >= 0 ? 1 : 2);
    var t = TIET[tiet];
    return { phuDau: phuDau, nguyen: nhom, nhomChi: ["Tứ Chính", "Tứ Sinh", "Tứ Mộ"][nhom], duong: t.duong, cuc: t.cuc[nhom] };
  }

  // ---------- Bước 3 – 12: an bàn ----------
  function anBan(duong, cuc, canG, chiG) {
    var gio60 = chiSo60(canG, chiG);
    if (gio60 < 0) throw new Error("Can Chi giờ không hợp lệ");

    // Bước 3: an Lục Nghi – Tam Kỳ lên Địa bàn. Mậu khởi tại cung bằng Cục số.
    var dia = {};
    for (var i = 0; i < 9; i++) dia[phiCung(cuc, i, duong)] = NGHI_KY[i];
    var cungCuaCan = function (can) { for (var p = 1; p <= 9; p++) if (dia[p] === can) return p; return -1; };

    // Bước 4: Tuần thủ và Cờ. Đếm lùi Can Chi giờ về can Giáp.
    var tuanThu = gio60 - canG;
    var co = 4 + tuanThu / 10; // Giáp Tý → Mậu, Giáp Tuất → Kỷ, ... Giáp Dần → Quý

    // Bước 5: Đại Trực Phù và Trực Sử theo cung của Cờ trên Địa bàn.
    var cungCo = cungCuaCan(co);
    var trucPhu = TINH_GOC[cungCo], trucSu = MON_GOC[cungCo];
    var cungGocTP = gui(cungCo); // Thiên Cầm ở Trung cung đi kèm Thiên Nhuế tại Khôn 2

    // Bước 6: chuyển Thiên bàn. Trực Phù bay tới cung của Can giờ (giờ Giáp lấy cung của Cờ),
    // các sao và Can Thiên bàn xoay thuận kim đồng hồ quanh 8 cung, không phân biệt Âm / Dương.
    var cungCanGio = canG === 0 ? cungCo : cungCuaCan(canG);
    var cungDenTP = gui(cungCanGio);
    var dichTinh = mod(VONG.indexOf(cungDenTP) - VONG.indexOf(cungGocTP), 8);
    var thien = {};
    VONG.forEach(function (p, k) {
      var den = VONG[(k + dichTinh) % 8];
      // Thiên Cầm và can của Trung cung luôn đi cùng Thiên Nhuế.
      thien[den] = {
        tinh: p === 2 ? [TINH_GOC[2], TINH_GOC[5]] : [TINH_GOC[p]],
        can: p === 2 ? [dia[2], dia[5]] : [dia[p]],
        tu: p
      };
    });

    // Bước 7: chuyển Nhân bàn. Từ cung của Cờ, đếm từ Giáp tới Can giờ theo số Cửu Cung
    // (Dương thuận, Âm nghịch); dừng ở cung 5 thì mượn Khôn 2. Bát Môn xoay thuận kim đồng hồ.
    var cungDemSu = phiCung(cungCo, canG, duong);
    var cungDenTS = gui(cungDemSu);
    var monVong = VONG.map(function (p) { return MON_GOC[p]; });
    var dichMon = mod(VONG.indexOf(cungDenTS) - monVong.indexOf(trucSu), 8);
    var mon = {};
    monVong.forEach(function (m, k) { mon[VONG[(k + dichMon) % 8]] = m; });

    // Bước 8: Bát Thần Thiên bàn khởi Trực Phù tại cung Đại Trực Phù vừa tới;
    // Dương độn thuận, Âm độn nghịch kim đồng hồ.
    var anThan = function (cungKhoi) {
      var out = {}, s = VONG.indexOf(cungKhoi);
      BAT_THAN.forEach(function (t, g) { out[VONG[mod(s + (duong ? g : -g), 8)]] = t; });
      return out;
    };
    var than = anThan(cungDenTP);

    // Bước 9: Mã Tinh theo Tam Hợp của chi giờ.
    var chiMa = [2, 11, 8, 5][chiG % 4]; // Thân Tý Thìn → Dần; Tỵ Dậu Sửu → Hợi; Dần Ngọ Tuất → Thân; Hợi Mão Mùi → Tỵ
    var ma = { chi: chiMa, cung: CHI_CUNG[chiMa] };

    // Bước 10: Không Vong là hai Địa Chi không có Can phối trong tuần.
    var chiTuan = tuanThu % 12;
    var kvChi = [mod(chiTuan + 10, 12), mod(chiTuan + 11, 12)];
    var kvCung = [];
    kvChi.forEach(function (c) { if (kvCung.indexOf(CHI_CUNG[c]) < 0) kvCung.push(CHI_CUNG[c]); });

    // Trường hợp đặc biệt của Bước 11 và 12: giờ Lục Giáp, Phục ngâm hoặc Phản ngâm toàn trận
    // (Thiên bàn không dịch hoặc dịch đúng nửa vòng so với Địa bàn).
    var phucNgam = dichTinh === 0, phanNgam = dichTinh === 4;
    var dacBiet = canG === 0 || phucNgam || phanNgam;

    // Bước 11: Bát Thần Địa bàn (Ám thần).
    var thanDia = dacBiet ? anThan(cungDenTP) : anThan(cungGocTP);

    // Bước 12: Ám Can. Can giờ nhập cung khởi rồi phi qua Cửu Cung theo thứ tự Lục Nghi – Tam Kỳ.
    var cungKhoiAm = dacBiet ? 5 : cungDenTS;
    var canKhoiAm = canG === 0 ? co : canG; // giờ Giáp: Giáp ẩn dưới Cờ
    var viTri = NGHI_KY.indexOf(canKhoiAm), amCan = {};
    for (var j = 0; j < 9; j++) amCan[phiCung(cungKhoiAm, j, duong)] = NGHI_KY[(viTri + j) % 9];

    return {
      duong: duong, cuc: cuc, gio: gio60, canGio: canG, chiGio: chiG,
      dia: dia,
      tuanThu: tuanThu, co: co, cungCo: cungCo,
      trucPhu: trucPhu, trucSu: trucSu, cungGocTP: cungGocTP,
      cungCanGio: cungCanGio, cungDenTP: cungDenTP, thien: thien, dichTinh: dichTinh,
      cungDemSu: cungDemSu, cungDenTS: cungDenTS, mon: mon, dichMon: dichMon,
      than: than, ma: ma, khongVong: { chi: kvChi, cung: kvCung },
      phucNgam: phucNgam, phanNgam: phanNgam, dacBiet: dacBiet,
      thanDia: thanDia, cungKhoiAm: cungKhoiAm, amCan: amCan
    };
  }

  // Lập trận đủ 12 bước cho một thời điểm (giờ địa phương của máy).
  function lapTran(date) {
    var b1 = buoc1(date);
    var b2 = buoc2(b1.tuTru.ngay, b1.tiet);
    var ban = anBan(b2.duong, b2.cuc, b1.canGio, b1.chiGio);
    ban.thoiDiem = new Date(date.getTime());
    ban.tuTru = b1.tuTru; ban.ngayTinh = b1.ngayTinh;
    ban.tiet = b1.tiet; ban.tenTiet = TIET[b1.tiet].ten; ban.kinhDo = b1.kinhDo; ban.giaoTiet = b1.giaoTiet;
    ban.phuDau = b2.phuDau; ban.nguyen = b2.nguyen; ban.nhomChi = b2.nhomChi;
    return ban;
  }

  // Tóm tắt kết quả từng bước bằng lời, để hiển thị "Trình tự 12 bước" dưới bàn.
  function trinhTu(b) {
    var c = function (i) { return CAN[i]; }, cc = canChi;
    var dan = function (map, ten) {
      return VONG.map(function (p) { return tenCung(p) + ": " + ten(map[p]); }).join(" · ");
    };
    var thienTxt = VONG.map(function (p) {
      return tenCung(p) + ": " + b.thien[p].tinh.join(" / ") + " (" + b.thien[p].can.map(c).join(", ") + ")";
    }).join(" · ");
    var amTxt = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (p) { return tenCung(p) + ": " + c(b.amCan[p]); }).join(" · ");
    var diaTxt = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (p) { return tenCung(p) + ": " + c(b.dia[p]); }).join(" · ");
    var buocSu = b.canGio === 0 ? "giờ Giáp nên Trực Sử ở ngay cung của Cờ" :
      "đếm từ Giáp tại cung " + b.cungCo + " tới " + c(b.canGio) + " (" + b.canGio + " bước, " + (b.duong ? "thuận" : "nghịch") + " Cửu Cung) dừng ở cung " + b.cungDemSu + (b.cungDemSu === 5 ? ", mượn Khôn 2" : "");
    var steps = [];
    if (b.tuTru) {
      steps.push(["Đổi giờ và xác định tiết khí",
        "Tứ trụ: năm " + cc(b.tuTru.nam) + ", tháng " + cc(b.tuTru.thang) + ", ngày " + cc(b.tuTru.ngay) + ", giờ " + cc(b.tuTru.gio) +
        ". Tiết " + TIET[b.tiet].ten + " (" + (b.duong ? "Dương độn" : "Âm độn") + "), giao tiết lúc " + dinhDangGio(b.giaoTiet) + "."]);
      steps.push(["Phù đầu và Tam nguyên",
        "Ngày " + cc(b.tuTru.ngay) + " lùi về Phù đầu " + cc(b.phuDau) + " (" + b.nhomChi + ") → " + NGUYEN[b.nguyen] +
        ". Tiết " + TIET[b.tiet].ten + " " + TIET[b.tiet].cuc.join(" – ") + " → " + (b.duong ? "Dương " : "Âm ") + b.cuc + " cục."]);
    }
    steps.push(["An Thiên Can Địa bàn", "Mậu khởi tại cung " + b.cuc + ", " + (b.duong ? "thuận" : "nghịch") + " Cửu Cung. " + diaTxt + "."]);
    steps.push(["Tuần thủ và Cờ", "Giờ " + cc(b.gio) + " thuộc tuần " + cc(b.tuanThu) + ", mang cờ " + c(b.co) + "."]);
    steps.push(["Đại Trực Phù và Trực Sử", "Cờ " + c(b.co) + " ở cung " + tenCung(b.cungCo) + " → Đại Trực Phù " + b.trucPhu + ", Trực Sử " + b.trucSu +
      (b.cungCo === 5 ? " (Trung cung gửi Khôn 2)" : "") + "."]);
    steps.push(["An Đại Trực Phù và Thiên Can Thiên bàn",
      (b.canGio === 0 ? "Giờ Giáp lấy cung của Cờ" : "Can giờ " + c(b.canGio) + " ở cung " + b.cungCanGio + (b.cungCanGio === 5 ? " (gửi Khôn 2)" : "")) +
      " → Trực Phù tới " + tenCung(b.cungDenTP) + ", các sao xoay thuận kim đồng hồ. " + thienTxt + "."]);
    steps.push(["An Trực Sử (Bát Môn)", "Trực Sử " + b.trucSu + ": " + buocSu + " → " + tenCung(b.cungDenTS) + ". " +
      dan(b.mon, function (m) { return m; }) + "."]);
    steps.push(["An Bát Thần Thiên bàn", "Trực Phù tại " + tenCung(b.cungDenTP) + ", " + (b.duong ? "thuận" : "nghịch") + " kim đồng hồ. " +
      dan(b.than, function (t) { return t; }) + "."]);
    steps.push(["Mã Tinh", "Chi giờ " + CHI[b.chiGio] + " → Mã tại " + CHI[b.ma.chi] + ", cung " + tenCung(b.ma.cung) + " (" + CUNG[b.ma.cung].huong + ")."]);
    steps.push(["Không Vong", "Tuần " + cc(b.tuanThu) + " thiếu " + b.khongVong.chi.map(function (x) { return CHI[x]; }).join(", ") +
      " → cung " + b.khongVong.cung.map(tenCung).join(" và ") + "."]);
    var tinhHuong = b.canGio === 0 ? "giờ Lục Giáp" : (b.phucNgam ? "Phục ngâm toàn trận" : (b.phanNgam ? "Phản ngâm toàn trận" : ""));
    steps.push(["An Bát Thần Địa bàn", (b.dacBiet ? "Trường hợp 1 (" + tinhHuong + "): an trùng Bát Thần Thiên bàn. " :
      "Trường hợp 2: khởi Trực Phù tại cung gốc của " + b.trucPhu + " (" + tenCung(b.cungGocTP) + "), " + (b.duong ? "thuận" : "nghịch") + " kim đồng hồ. ") +
      dan(b.thanDia, function (t) { return t; }) + "."]);
    steps.push(["An Ám Can", (b.dacBiet ? "Trường hợp 1 (" + tinhHuong + "): " + c(b.canGio === 0 ? b.co : b.canGio) + " nhập Trung cung 5" :
      "Trường hợp 2: " + c(b.canGio) + " khởi tại cung Trực Sử " + tenCung(b.cungDenTS)) + ", phi " + (b.duong ? "thuận" : "nghịch") + " Cửu Cung. " + amTxt + "."]);
    var dau = b.tuTru ? 1 : 3;
    return steps.map(function (s, k) { return { buoc: dau + k, ten: s[0], ketQua: s[1] }; });
  }

  function hai(n) { return (n < 10 ? "0" : "") + n; }
  function dinhDangGio(d) {
    return hai(d.getHours()) + ":" + hai(d.getMinutes()) + " ngày " + hai(d.getDate()) + "/" + hai(d.getMonth() + 1) + "/" + d.getFullYear();
  }

  return {
    CAN: CAN, CHI: CHI, NGUYEN: NGUYEN, CUNG: CUNG, VONG: VONG, TIET: TIET, BAT_THAN: BAT_THAN,
    TINH_GOC: TINH_GOC, MON_GOC: MON_GOC, CHI_CUNG: CHI_CUNG,
    canChi: canChi, chiSo60: chiSo60, canGio: canGio, kinhDoMatTroi: kinhDoMatTroi,
    buoc1: buoc1, buoc2: buoc2, anBan: anBan, lapTran: lapTran, trinhTu: trinhTu, dinhDangGio: dinhDangGio
  };
})();
if (typeof module !== "undefined" && module.exports) module.exports = KyMon;
