// Xuất các bảng tra của quy trình 12 bước ra data/*.csv (mở được bằng Excel, Google Sheets).
//     node tools/xuat_bang_tra.mjs           ghi lại data/
//     node tools/xuat_bang_tra.mjs --check   báo lỗi nếu data/ chưa khớp với lib/
// Số liệu lấy thẳng từ lib/bang-tra.js và các mô-đun bước, nên bảng luôn khớp với trang.
// © 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const require = createRequire(import.meta.url);
const K = require("../lib/kymon.js"), KM = K.KM, { CAN, CHI, canChi } = KM.CongCu, T = KM.BangTra;
const DATA = new URL("../data/", import.meta.url);
const ten = (p) => T.CUNG[p].ten + " " + p;
const csv = (rows) => "﻿" + rows.map((r) => r.map((x) => { x = String(x); return /[",\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x; }).join(",")).join("\r\n") + "\r\n";

const bang = {
  "cuc-so-24-tiet.csv": [["Thứ tự", "Tiết khí", "Độn", "Thượng nguyên", "Trung nguyên", "Hạ nguyên", "Kinh độ Mặt Trời (độ)"],
    ...T.TIET.map((t, i) => [i + 1, t.ten, t.duong ? "Dương" : "Âm", ...t.cuc, t.kinhDo])],
  "phu-dau-60-ngay.csv": [["Can Chi ngày", "Lùi (ngày)", "Phù đầu", "Nhóm chi", "Tam nguyên"],
    ...Array.from({ length: 60 }, (_, d) => { const r = KM.B2.tinh(d, 0); return [canChi(d), r.luiNgay, canChi(r.phuDau), r.nhomChi, T.NGUYEN[r.nguyen]]; })],
  "tuan-thu-60-gio.csv": [["Can Chi giờ", "Tuần thủ", "Cờ", "Nghi trượng", "Thần quân", "Không Vong (chi)", "Không Vong (cung)", "Mã Tinh (chi)", "Mã Tinh (cung)"],
    ...Array.from({ length: 60 }, (_, g) => {
      const b4 = KM.B4.tinh(g % 10, g % 12), kv = KM.B10.tinh(b4.tuanThu), ma = KM.B9.tinh(g % 12);
      return [canChi(g), canChi(b4.tuanThu), CAN[b4.co], b4.ky, b4.thanQuan, kv.chi.map((c) => CHI[c]).join(" "), kv.cung.map(ten).join(" · "), CHI[ma.chi], ten(ma.cung)];
    })],
  "dia-ban-18-cuc.csv": [["Cục", ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(ten)],
    ...[true, false].flatMap((d) => (d ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [9, 8, 7, 6, 5, 4, 3, 2, 1]).map((c) => {
      const dia = KM.B3.tinh(d, c); return [(d ? "Dương " : "Âm ") + c, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => CAN[dia[p]])];
    }))],
  "ngu-ty-don.csv": [["Giờ", "Ngày Giáp, Kỷ", "Ngày Ất, Canh", "Ngày Bính, Tân", "Ngày Đinh, Nhâm", "Ngày Mậu, Quý"],
    ...CHI.map((c, h) => ["Giờ " + c, ...[0, 1, 2, 3, 4].map((g) => CAN[KM.B1.nguTyDon(g, h)] + " " + c)])],
  "ban-cung-goc.csv": [["Cung", "Phương", "Ngũ hành", "Sao gốc", "Hành của sao", "Môn gốc", "Hành của môn", "Địa Chi"],
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => [ten(p), T.CUNG[p].huong, T.CUNG[p].hanh, T.TINH_GOC[p], T.HANH_TINH[T.TINH_GOC[p]],
      p === 5 ? "— (gửi Khôn 2: Tử Môn)" : T.MON_GOC[p], p === 5 ? "" : T.HANH_MON[T.MON_GOC[p]], CHI.filter((_, i) => T.CHI_CUNG[i] === p).join(" ")])],
  "bat-than.csv": [["Thứ tự", "Thần", "Tính chất"], ...T.BAT_THAN.map((t, i) => [i + 1, t, T.TINH_CHAT_THAN[t]])],
  "tiet-khi-1900-2100.csv": (() => {
    const rows = [["Giờ giao (UTC)", "Giờ Việt Nam (UTC+7)", "Tiết khí", "Độn"]];
    let ms = Date.UTC(1900, 0, 1);
    const end = Date.UTC(2101, 0, 1), fmt = (t, h) => new Date(t + h * 3600000).toISOString().slice(0, 16).replace("T", " ");
    while (ms < end) {
      const t = K.tietTai(ms);
      if (t.giao.getTime() >= Date.UTC(1900, 0, 1)) rows.push([fmt(t.giao.getTime(), 0), fmt(t.giao.getTime(), 7), T.TIET[t.i].ten, T.TIET[t.i].duong ? "Dương" : "Âm"]);
      ms = t.tiep.getTime() + 60000;
    }
    return rows;
  })()
};

const check = process.argv.includes("--check");
const lech = [];
for (const [f, rows] of Object.entries(bang)) {
  const noiDung = csv(rows), url = new URL(f, DATA);
  if (check) { if (!existsSync(url) || readFileSync(url, "utf8") !== noiDung) lech.push(f); }
  else writeFileSync(url, noiDung);
}
if (check) {
  if (lech.length) { console.error("data/ chưa khớp với lib/: " + lech.join(", ") + " — hãy chạy: node tools/xuat_bang_tra.mjs"); process.exit(1); }
  console.log("data/ khớp với lib/.");
} else console.log("Đã ghi " + Object.keys(bang).length + " bảng vào data/");
