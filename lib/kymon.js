// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// Điều phối 12 bước lập trận theo tài liệu "Quy trình lập trận Kỳ Môn Độn Giáp" (docs/quy-trinh-lap-tran.md).
//   KyMon.lapTran(date, tuyChon)          lập trận đủ 12 bước cho một thời điểm (Bước 1 → 12)
//   KyMon.anBan(duong, cuc, canGio, chiGio)  an bàn Bước 3 → 12 khi đã biết Cục và Can Chi giờ
// Từng bước nằm ở lib/b01-…js đến lib/b12-…js và dùng được riêng (KM.B1 … KM.B12).
// KyMon giữ nguyên các tên cũ (CAN, CHI, TIET, canChi, tietTai, …) để giao diện và kiểm thử dùng tiếp.
var KyMon = (function (KM) {
  "use strict";
  var C = KM.CongCu, T = KM.BangTra, L = KM.Lich;

  function anBan(duong, cuc, canG, chiG) {
    var dia = KM.B3.tinh(duong, cuc);
    var b4 = KM.B4.tinh(canG, chiG);
    var b5 = KM.B5.tinh(dia, b4.co);
    var b6 = KM.B6.tinh(dia, b5, canG);
    var b7 = KM.B7.tinh(duong, b5, canG);
    var than = KM.B8.tinh(duong, b6.cungDenTP);
    var ma = KM.B9.tinh(chiG);
    var kv = KM.B10.tinh(b4.tuanThu);
    var b11 = KM.B11.tinh(duong, canG, b5, b6);
    var b12 = KM.B12.tinh(duong, b11.dacBiet, b7.cungDenTS, canG, b4.co);
    return {
      duong: duong, cuc: cuc, gio: b4.gio60, canGio: canG, chiGio: chiG,
      dia: dia,
      tuanThu: b4.tuanThu, co: b4.co, cungCo: b5.cungCo,
      trucPhu: b5.trucPhu, trucSu: b5.trucSu, cungGocTP: b5.cungGocTP,
      cungCanGio: b6.cungCanGio, cungDenTP: b6.cungDenTP, thien: b6.thien, dichTinh: b6.dichTinh,
      cungDemSu: b7.cungDemSu, cungDenTS: b7.cungDenTS, mon: b7.mon, dichMon: b7.dichMon,
      than: than, ma: ma, khongVong: kv,
      phucNgam: b11.phucNgam, phanNgam: b11.phanNgam, dacBiet: b11.dacBiet, thanDia: b11.thanDia,
      cungKhoiAm: b12.cungKhoiAm, amCan: b12.amCan
    };
  }

  function lapTran(date, tuyChon) {
    var b1 = KM.B1.tinh(date, tuyChon);
    var b2 = KM.B2.tinh(b1.tuTru.ngay, b1.tiet);
    var ban = anBan(b2.duong, b2.cuc, b1.canGio, b1.chiGio);
    ban.thoiDiem = new Date(date.getTime());
    ban.tuTru = b1.tuTru; ban.ngayTinh = b1.ngayTinh;
    ban.tiet = b1.tiet; ban.tenTiet = T.TIET[b1.tiet].ten; ban.kinhDo = L.kinhDoMatTroi(date.getTime()); ban.giaoTiet = b1.giaoTiet;
    ban.tietTiep = b1.tietTiep; ban.nguonTiet = b1.nguonTiet; ban.quyDoi = b1.quyDoi;
    ban.phuDau = b2.phuDau; ban.nguyen = b2.nguyen; ban.nhomChi = b2.nhomChi;
    return ban;
  }

  return {
    KM: KM,
    CAN: C.CAN, CHI: C.CHI, NGUYEN: T.NGUYEN, CUNG: T.CUNG, VONG: T.VONG, TIET: T.TIET, BAT_THAN: T.BAT_THAN,
    TINH_GOC: T.TINH_GOC, MON_GOC: T.MON_GOC, CHI_CUNG: T.CHI_CUNG,
    canChi: C.canChi, chiSo60: C.chiSo60, canGio: KM.B1.nguTyDon, kinhDoMatTroi: L.kinhDoMatTroi,
    tietTai: L.tietTai, phuongTrinhThoiGian: L.phuongTrinhThoiGian, gioDongHo: L.gioDongHo, lechMuiGio: L.lechMuiGio,
    thoiDiemTuGioDongHo: L.thoiDiemTuGioDongHo, coBangTiet: L.coBangTiet, dinhDangGio: L.dinhDangGio,
    buoc1: KM.B1.tinh, buoc2: KM.B2.tinh, anBan: anBan, lapTran: lapTran, trinhTu: KM.TrinhTu.tomTat
  };
})(typeof module !== "undefined" && module.exports
  ? ["./b01-tu-tru.js", "./b02-phu-dau.js", "./b03-dia-ban.js", "./b04-tuan-thu.js", "./b05-truc-phu-su.js", "./b06-thien-ban.js",
     "./b07-nhan-ban.js", "./b08-than-ban.js", "./b09-ma-tinh.js", "./b10-khong-vong.js", "./b11-than-dia-ban.js", "./b12-am-can.js",
     "./trinh-tu.js"].reduce(function (km, f) { require(f); return km; }, require("./km.js"))
  : KM);
if (typeof module !== "undefined" && module.exports) module.exports = KyMon;
