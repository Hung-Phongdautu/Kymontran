// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Diễn giải kết quả từng bước bằng lời ("Trình tự 12 bước của bàn này" dưới bàn).
//   KM.TrinhTu.tomTat(ban) → [{ buoc, ten, ketQua }]
(function (KM) {
  "use strict";
  var C = KM.CongCu, T = KM.BangTra, CAN = C.CAN, CHI = C.CHI, VONG = T.VONG, CUNG = T.CUNG, TIET = T.TIET, NGUYEN = T.NGUYEN, hai = C.hai;
  function tenCung(p) { return CUNG[p].ten + " " + p; }
  function trinhTu(b) {
    var c = function (i) { return CAN[i]; }, cc = C.canChi;
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
        (b.quyDoi && b.quyDoi.gioMatTroi ? " (đổi theo giờ Mặt Trời thật " + hai(b.quyDoi.gioDung.h) + ":" + hai(b.quyDoi.gioDung.mi) + ")" : "") +
        ". Tiết " + TIET[b.tiet].ten + " (" + (b.duong ? "Dương độn" : "Âm độn") + "), giao tiết lúc " + KM.Lich.dinhDangGio(b.giaoTiet, b.quyDoi && b.quyDoi.muiGio) +
        (b.nguonTiet === "bang" ? " theo bảng Thọ Tinh vạn niên lịch" : " theo công thức thiên văn") + "."]);
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

  KM.TrinhTu = { tomTat: trinhTu };
})(typeof module !== "undefined" && module.exports ? (require("./lich.js"), module.exports = require("./km.js")) : KM);
