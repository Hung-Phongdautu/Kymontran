// Mỗi mô-đun trong lib/ phải nạp được riêng và làm việc chỉ với đầu vào của nó (như các thẻ ở trang Tra Cứu).
//     node --test test/*.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { readdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const require = createRequire(import.meta.url);
const LIB = new URL("../lib/", import.meta.url);
const tep = readdirSync(LIB).filter((f) => f.endsWith(".js"));

test("mỗi tệp trong lib/ nạp được riêng trong một tiến trình mới", () => {
  for (const f of tep) {
    execFileSync(process.execPath, ["-e", `require(${JSON.stringify(new URL(f, LIB).pathname)})`], { stdio: "pipe" });
  }
});

test("build.py ghép đủ mọi tệp trong lib/", () => {
  const build = readFileSync(new URL("../build.py", import.meta.url), "utf8");
  for (const f of tep) assert.ok(build.includes(`"${f}"`), f + " chưa có trong LIB của build.py");
});

const KM = require("../lib/kymon.js").KM;
const { CAN, CHI } = KM.CongCu;
const can = (s) => CAN.indexOf(s), chi = (s) => CHI.indexOf(s);

test("B1 — Ngũ Tý Độn và Can Chi ngày", () => {
  assert.equal(CAN[KM.B1.nguTyDon(can("Giáp"), chi("Thân"))], "Nhâm");
  assert.equal(KM.CongCu.canChi(KM.B1.canChiNgay(1949, 9, 1)), "Giáp Tý");
});
test("B2 — Phù đầu theo Can Chi ngày", () => {
  const r = KM.B2.tinh(3, 18); // Đinh Mão, tiết Thu phân
  assert.equal(KM.CongCu.canChi(r.phuDau), "Giáp Tý"); assert.equal(r.luiNgay, 3); assert.equal(r.nguyen, 0); assert.equal(r.cuc, 7);
});
test("B3 → B5 nối nhau chỉ bằng kết quả trung gian", () => {
  const dia = KM.B3.tinh(true, 3), b4 = KM.B4.tinh(can("Canh"), chi("Ngọ")), b5 = KM.B5.tinh(dia, b4.co);
  assert.equal(b4.thanQuan, "Vương Văn Khanh"); assert.equal(b5.trucPhu, "Thiên Xung"); assert.equal(b5.cungCo, 3);
  const b6 = KM.B6.tinh(dia, b5, can("Canh")), b7 = KM.B7.tinh(true, b5, can("Canh"));
  assert.equal(b6.cungDenTP, 2); assert.equal(b7.cungDenTS, 9);
  assert.equal(KM.B8.tinh(true, 2)[7], "Đằng Xà");
  assert.deepEqual(KM.B9.tinh(chi("Ngọ")), { chi: chi("Thân"), cung: 2 });
  assert.deepEqual(KM.B10.tinh(b4.tuanThu).cung, [6]);
  const b11 = KM.B11.tinh(true, can("Canh"), b5, b6); assert.equal(b11.dacBiet, false); assert.equal(b11.thanDia[3], "Trực Phù");
  assert.equal(CAN[KM.B12.tinh(true, false, 9, can("Canh"), b4.co).amCan[5]], "Bính");
});
test("KyMon.anBan bằng đúng chuỗi B3 → B12", () => {
  const K = require("../lib/kymon.js");
  for (let gio = 0; gio < 60; gio++) for (const duong of [true, false]) for (let cuc = 1; cuc <= 9; cuc++) {
    const a = K.anBan(duong, cuc, gio % 10, gio % 12), dia = KM.B3.tinh(duong, cuc);
    assert.deepEqual(a.dia, dia);
    assert.deepEqual(a.amCan, KM.B12.tinh(duong, a.dacBiet, a.cungDenTS, gio % 10, a.co).amCan);
  }
});

test("bảng tra data/*.csv khớp với lib/", () => {
  execFileSync(process.execPath, [new URL("../tools/xuat_bang_tra.mjs", import.meta.url).pathname, "--check"], { stdio: "pipe" });
});
