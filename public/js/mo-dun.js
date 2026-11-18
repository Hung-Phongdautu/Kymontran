// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
// ===== Bàn làm việc 12 mô-đun =====
// Mỗi thẻ <article data-mo-dun="..."> ở trang Tra Cứu là một bước của quy trình. Thẻ chỉ đọc ô nhập của chính nó
// (data-vao), gọi đúng mô-đun trong lib/ (KM.B1 … KM.B12) và tự tính lại khi ô nhập thay đổi.
(function () {
  var C = KM.CongCu, T = KM.BangTra, CAN = C.CAN, CHI = C.CHI, cc = C.canChi;
  var THU_TU = [4, 9, 2, 3, 5, 7, 8, 1, 6]; // thứ tự đọc 3 × 3 của Lạc Thư
  var GIO_KHOANG = ["23h – 01h", "01h – 03h", "03h – 05h", "05h – 07h", "07h – 09h", "09h – 11h", "11h – 13h", "13h – 15h", "15h – 17h", "17h – 19h", "19h – 21h", "21h – 23h"];
  var LUA_CHON = {
    can: CAN.map(function (c, i) { return [i, c]; }),
    chi: CHI.map(function (c, i) { return [i, 'Giờ ' + c + ' (' + GIO_KHOANG[i] + ')']; }),
    ngay: Array.apply(null, Array(60)).map(function (_, i) { return [i, cc(i)]; }),
    gio: Array.apply(null, Array(60)).map(function (_, i) { return [i, cc(i)]; }),
    tiet: T.TIET.map(function (t, i) { return [i, t.ten + ' (' + (t.duong ? 'Dương độn' : 'Âm độn') + ')']; }),
    don: [[1, 'Dương độn'], [0, 'Âm độn']],
    cuc: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return [n, 'Cục ' + n]; })
  };
  // Ví dụ xuyên suốt của tài liệu: ngày 01/10/1949 15h; bàn Dương độn 3 cục, giờ Canh Ngọ.
  var VI_DU = { time: '1949-10-01T15:00', can: 0, chi: 8, ngay: 0, tiet: 18, don: 1, cuc: 3, gio: 6 };
  var VI_DU_RIENG = { 'ma-tinh': { chi: 6 } };

  function tenCung(p) { return T.CUNG[p].ten + ' ' + p; }
  function luoi(o, noiBat) {
    noiBat = noiBat || {};
    return '<div class="mg">' + THU_TU.map(function (p) {
      var cls = noiBat[p] ? ' ' + noiBat[p] : '';
      return '<div class="mg-o' + (p === 5 ? ' mg-tt' : '') + cls + '"><small>' + tenCung(p) + '</small><b>' + (o[p] === undefined ? '—' : o[p]) + '</b></div>';
    }).join('') + '</div>';
  }
  function dong(nhan, gt) { return '<p><span>' + nhan + '</span> <strong>' + gt + '</strong></p>'; }
  function vao(the) {
    var v = {};
    the.querySelectorAll('[data-vao]').forEach(function (el) { v[el.getAttribute('data-vao')] = el.type === 'datetime-local' ? el.value : parseInt(el.value, 10); });
    return v;
  }
  // Các bước 3 – 12 cần độn, cục và Can Chi giờ; mỗi thẻ tự gọi chuỗi mô-đun nó cần từ đầu vào của chính nó.
  function tran(v) {
    var duong = v.don === 1, canG = v.gio % 10, chiG = v.gio % 12;
    var dia = KM.B3.tinh(duong, v.cuc), b4 = KM.B4.tinh(canG, chiG), b5 = KM.B5.tinh(dia, b4.co);
    return { duong: duong, canG: canG, chiG: chiG, dia: dia, b4: b4, b5: b5 };
  }

  var MO_DUN = {
    'mo-dun-b1': function (v) {
      var tc = typeof tuyChon === 'function' ? tuyChon() : {};
      var ms = typeof nhapThoiDiem === 'function' ? nhapThoiDiem(v.time, tc) : Date.parse(v.time);
      var r = KM.B1.tinh(new Date(ms), tc), t = T.TIET[r.tiet];
      return dong('Năm', cc(r.tuTru.nam)) + dong('Tháng', cc(r.tuTru.thang)) + dong('Ngày', cc(r.tuTru.ngay)) + dong('Giờ', cc(r.tuTru.gio)) +
        dong('Tiết khí', t.ten + ' — ' + (t.duong ? 'Dương độn' : 'Âm độn')) +
        dong('Giao tiết', KM.Lich.dinhDangGio(r.giaoTiet, tc.muiGio) + (r.nguonTiet === 'bang' ? ' (bảng Thọ Tinh)' : ' (công thức)')) +
        (r.quyDoi.gioMatTroi ? dong('Giờ Mặt Trời thật', C.hai(r.quyDoi.gioDung.h) + ':' + C.hai(r.quyDoi.gioDung.mi)) : '');
    },
    'doi-gio': function (v) {
      var can = KM.B1.nguTyDon(v.can, v.chi), dau = KM.B1.nguTyDon(v.can, 0);
      return dong('Giờ ' + CHI[v.chi] + ' của ngày ' + CAN[v.can], CAN[can] + ' ' + CHI[v.chi]) +
        '<p class="note">Nhóm ngày ' + ['Giáp / Kỷ', 'Ất / Canh', 'Bính / Tân', 'Đinh / Nhâm', 'Mậu / Quý'][v.can % 5] + ' khởi giờ Tý là ' + CAN[dau] + ' Tý, đếm thuận Thiên can tới giờ ' + CHI[v.chi] + '.</p>';
    },
    'phu-dau': function (v) {
      var r = KM.B2.tinh(v.ngay, v.tiet), t = T.TIET[v.tiet];
      return dong('Phù đầu', cc(r.phuDau) + (r.luiNgay ? ' (lùi ' + r.luiNgay + ' ngày)' : ' (chính ngày này)')) +
        dong('Nhóm chi', r.nhomChi) + dong('Tam nguyên', T.NGUYEN[r.nguyen]) +
        dong('Tiết ' + t.ten, t.cuc.join(' – ')) + dong('Cục số', (r.duong ? 'Dương ' : 'Âm ') + r.cuc + ' cục');
    },
    'mo-dun-b3': function (v) {
      var dia = KM.B3.tinh(v.don === 1, v.cuc), o = {};
      for (var p = 1; p <= 9; p++) o[p] = CAN[dia[p]];
      var noi = {}; noi[v.cuc] = 'hl';
      return '<p class="note">Mậu khởi tại cung ' + v.cuc + ', ' + (v.don === 1 ? 'thuận' : 'nghịch') + ' Cửu Cung.</p>' + luoi(o, noi);
    },
    'tuan-thu': function (v) {
      var r = KM.B4.tinh(v.gio % 10, v.gio % 12);
      return dong('Giờ ' + cc(v.gio) + ' thuộc tuần', cc(r.tuanThu)) + dong('Cờ (Giáp ẩn dưới)', CAN[r.co] + ' — ' + r.ky) +
        dong('Thần quân chủ quản', r.thanQuan) + '<p class="note">Lùi ' + (v.gio % 10) + ' bậc về can Giáp.</p>';
    },
    'mo-dun-b5': function (v) {
      var x = tran(v);
      return dong('Cờ ' + CAN[x.b4.co] + ' ở cung', tenCung(x.b5.cungCo)) + dong('Đại Trực Phù', x.b5.trucPhu) + dong('Trực Sử', x.b5.trucSu) +
        (x.b5.cungCo === 5 ? '<p class="note">Cờ ở Trung cung: Thiên Cầm và Tử Môn, gửi Khôn 2.</p>' : '');
    },
    'mo-dun-b6': function (v) {
      var x = tran(v), r = KM.B6.tinh(x.dia, x.b5, x.canG), o = {}, noi = {};
      T.VONG.forEach(function (p) { o[p] = r.thien[p].tinh.join(' · ') + '<i>' + r.thien[p].can.map(function (c) { return CAN[c]; }).join(' · ') + '</i>'; });
      noi[r.cungDenTP] = 'hl';
      return '<p class="note">' + (x.canG === 0 ? 'Giờ Giáp lấy cung của Cờ' : 'Can giờ ' + CAN[x.canG] + ' ở cung ' + r.cungCanGio + (r.cungCanGio === 5 ? ' (gửi Khôn 2)' : '')) +
        ' → ' + x.b5.trucPhu + ' tới ' + tenCung(r.cungDenTP) + ', xoay thuận kim đồng hồ ' + r.dichTinh + ' cung.</p>' + luoi(o, noi);
    },
    'mo-dun-b7': function (v) {
      var x = tran(v), r = KM.B7.tinh(x.duong, x.b5, x.canG), noi = {};
      noi[r.cungDenTS] = 'hl';
      return '<p class="note">' + x.b5.trucSu + ': đếm từ Giáp tại cung ' + x.b5.cungCo + ' tới ' + CAN[x.canG] + ' (' + x.canG + ' bước, ' + (x.duong ? 'thuận' : 'nghịch') + ') dừng ở cung ' + r.cungDemSu +
        (r.cungDemSu === 5 ? ', mượn Khôn 2' : '') + '.</p>' + luoi(r.mon, noi);
    },
    'mo-dun-b8': function (v) {
      var x = tran(v), b6 = KM.B6.tinh(x.dia, x.b5, x.canG), than = KM.B8.tinh(x.duong, b6.cungDenTP), noi = {};
      noi[b6.cungDenTP] = 'hl';
      return '<p class="note">Trực Phù tại ' + tenCung(b6.cungDenTP) + ', ' + (x.duong ? 'thuận' : 'nghịch') + ' kim đồng hồ.</p>' + luoi(than, noi);
    },
    'ma-tinh': function (v) {
      var r = KM.B9.tinh(v.chi), o = {}, noi = {};
      o[r.cung] = 'Mã · ' + CHI[r.chi]; noi[r.cung] = 'hl';
      return dong('Giờ ' + CHI[v.chi] + ' → Mã tại', CHI[r.chi] + ', cung ' + tenCung(r.cung) + ' (' + T.CUNG[r.cung].huong + ')') + luoi(o, noi);
    },
    'khong-vong': function (v) {
      var b4 = KM.B4.tinh(v.gio % 10, v.gio % 12), r = KM.B10.tinh(b4.tuanThu), o = {}, noi = {};
      r.chi.forEach(function (c) { var p = T.CHI_CUNG[c]; o[p] = (o[p] ? o[p] + ', ' : 'KV · ') + CHI[c]; noi[p] = 'kv'; });
      return dong('Tuần ' + cc(b4.tuanThu) + ' thiếu', r.chi.map(function (c) { return CHI[c]; }).join(', ')) +
        dong('Cung Không Vong', r.cung.map(tenCung).join(' và ')) + luoi(o, noi);
    },
    'mo-dun-b11': function (v) {
      var x = tran(v), b6 = KM.B6.tinh(x.dia, x.b5, x.canG), r = KM.B11.tinh(x.duong, x.canG, x.b5, b6), noi = {};
      var th = x.canG === 0 ? 'giờ Lục Giáp' : (r.phucNgam ? 'Phục ngâm toàn trận' : (r.phanNgam ? 'Phản ngâm toàn trận' : ''));
      noi[r.dacBiet ? b6.cungDenTP : x.b5.cungGocTP] = 'hl';
      return '<p class="note">' + (r.dacBiet ? 'Trường hợp 1 (' + th + '): an trùng Bát Thần Thiên bàn.' : 'Trường hợp 2: khởi Trực Phù tại cung gốc của ' + x.b5.trucPhu + ' (' + tenCung(x.b5.cungGocTP) + ').') + '</p>' + luoi(r.thanDia, noi);
    },
    'mo-dun-b12': function (v) {
      var x = tran(v), b6 = KM.B6.tinh(x.dia, x.b5, x.canG), b7 = KM.B7.tinh(x.duong, x.b5, x.canG), b11 = KM.B11.tinh(x.duong, x.canG, x.b5, b6);
      var r = KM.B12.tinh(x.duong, b11.dacBiet, b7.cungDenTS, x.canG, x.b4.co), o = {}, noi = {};
      for (var p = 1; p <= 9; p++) o[p] = CAN[r.amCan[p]];
      noi[r.cungKhoiAm] = 'hl';
      return '<p class="note">' + (b11.dacBiet ? 'Trường hợp 1: ' + CAN[r.canKhoiAm] + ' nhập Trung cung 5' : 'Trường hợp 2: ' + CAN[r.canKhoiAm] + ' khởi tại cung Trực Sử ' + tenCung(r.cungKhoiAm)) +
        ', phi ' + (x.duong ? 'thuận' : 'nghịch') + ' Cửu Cung.</p>' + luoi(o, noi);
    }
  };

  function tinhThe(the) {
    var ra = the.querySelector('.mod-out');
    try { ra.innerHTML = MO_DUN[the.getAttribute('data-mo-dun')](vao(the)); }
    catch (e) { ra.innerHTML = '<p class="note">Chưa tính được: ' + e.message + '. Kiểm tra lại dữ liệu nhập.</p>'; }
  }
  function dat(the, gt) {
    the.querySelectorAll('[data-vao]').forEach(function (el) { var k = el.getAttribute('data-vao'); if (gt[k] !== undefined) el.value = String(gt[k]); });
    tinhThe(the);
  }
  var cacThe = [].slice.call(document.querySelectorAll('[data-mo-dun]'));
  cacThe.forEach(function (the) {
    the.querySelectorAll('select[data-vao]').forEach(function (sel) {
      LUA_CHON[sel.getAttribute('data-vao')].forEach(function (o) { var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; sel.appendChild(op); });
    });
    the.addEventListener('change', function () { tinhThe(the); });
    the.addEventListener('input', function (e) { if (e.target.type === 'datetime-local') tinhThe(the); });
  });
  function datViDu() { cacThe.forEach(function (the) { var k = the.getAttribute('data-mo-dun'), g = {}; for (var x in VI_DU) g[x] = VI_DU[x]; for (var y in (VI_DU_RIENG[k] || {})) g[y] = VI_DU_RIENG[k][y]; dat(the, g); }); }
  datViDu();
  document.getElementById('modViDu').addEventListener('click', function () {
    datViDu(); document.getElementById('modBarNote').textContent = 'Đã đặt lại ví dụ của tài liệu: ngày 01/10/1949 15h; bàn Dương độn 3 cục, giờ Canh Ngọ.';
  });
  document.getElementById('modTuBan').addEventListener('click', function () {
    var b = lastBoard; if (!b) return;
    var gt = { time: document.getElementById('fTime').value, can: b.tuTru.ngay % 10, chi: b.chiGio, ngay: b.tuTru.ngay, tiet: b.tiet, don: b.duong ? 1 : 0, cuc: b.cuc, gio: b.gio };
    cacThe.forEach(function (the) { dat(the, gt); });
    document.getElementById('modBarNote').textContent = 'Đã điền dữ liệu của bàn ' + (b.duong ? 'Dương' : 'Âm') + ' ' + b.cuc + ' cục, giờ ' + cc(b.gio) + ' vào cả 13 thẻ.';
  });
  // Gọi sau mỗi lần lập trận ở công cụ phía trên.
  window.moDunCoBan = function () { document.getElementById('modTuBan').disabled = !lastBoard; };
})();
