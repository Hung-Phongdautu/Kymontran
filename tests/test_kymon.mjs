// Kiểm thử bộ máy lập trận (src/kymon.js) bằng các ví dụ trong tài liệu
// "Quy trình lập trận Kỳ Môn Độn Giáp" (12 bước).
//     node tests/test_kymon.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const KyMon = createRequire(import.meta.url)("../src/kymon.js");
const { CAN, CHI, canChi, anBan, lapTran, buoc2, TIET } = KyMon;
const can = (s) => CAN.indexOf(s), chi = (s) => CHI.indexOf(s);
const name = (i) => CAN[i];
const map9 = (m, f = (x) => x) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, f(v)]));
let n = 0; const ok = (label, fn) => { fn(); n++; };

// ----- Bước 1: ví dụ ngày 01/10/1949 lúc 15 giờ -----
ok("Bước 1 — Tứ trụ 01/10/1949 15h", () => {
  const b = lapTran(new Date(1949, 9, 1, 15, 0));
  assert.equal(canChi(b.tuTru.nam), "Kỷ Sửu");
  assert.equal(canChi(b.tuTru.thang), "Quý Dậu");
  assert.equal(canChi(b.tuTru.ngay), "Giáp Tý");
  assert.equal(canChi(b.tuTru.gio), "Nhâm Thân");
});

// ----- Bước 1: bảng Ngũ Tý Độn đủ 12 giờ × 5 nhóm ngày -----
ok("Bước 1 — Ngũ Tý Độn", () => {
  const dau = ["Giáp", "Bính", "Mậu", "Canh", "Nhâm"]; // giờ Tý của nhóm Giáp/Kỷ, Ất/Canh, ...
  for (let g = 0; g < 5; g++) for (let h = 0; h < 12; h++)
    assert.equal(KyMon.canGio(g, h), (can(dau[g]) + h) % 10);
  assert.equal(KyMon.canGio(can("Kỷ"), chi("Thân")), can("Nhâm"));
});

// ----- Bước 2: Phù đầu và Tam nguyên cho đủ 60 ngày (bảng phân bố 60 Giáp Tý) -----
ok("Bước 2 — 12 Phù đầu", () => {
  const bang = [["Giáp Tý", 0], ["Kỷ Tỵ", 1], ["Giáp Tuất", 2], ["Kỷ Mão", 0], ["Giáp Thân", 1], ["Kỷ Sửu", 2],
    ["Giáp Ngọ", 0], ["Kỷ Hợi", 1], ["Giáp Thìn", 2], ["Kỷ Dậu", 0], ["Giáp Dần", 1], ["Kỷ Mùi", 2]];
  for (let d = 0; d < 60; d++) {
    const r = buoc2(d, 0), [ten, ng] = bang[Math.floor(d / 5)];
    assert.equal(canChi(r.phuDau), ten, canChi(d));
    assert.equal(r.nguyen, ng, canChi(d));
  }
  // Đông chí Thượng/Trung/Hạ = 1/7/4; Hạ chí = 9/3/6
  assert.deepEqual(TIET[0].cuc, [1, 7, 4]); assert.deepEqual(TIET[12].cuc, [9, 3, 6]);
  assert.equal(buoc2(1, 18).cuc, 7); // ngày Ất Sửu, tiết Thu phân, Thượng nguyên → Âm 7 cục
});

// ----- Bước 3: bảng Địa bàn 18 cục (đối chiếu vài dòng của bảng) -----
ok("Bước 3 — Địa bàn", () => {
  const dia = (duong, cuc) => map9(anBan(duong, cuc, 0, 0).dia, name);
  assert.deepEqual(Object.values(dia(true, 1)), ["Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý", "Đinh", "Bính", "Ất"]);
  assert.deepEqual(Object.values(dia(true, 3)), ["Bính", "Ất", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý", "Đinh"]);
  assert.deepEqual(Object.values(dia(false, 9)), ["Ất", "Bính", "Đinh", "Quý", "Nhâm", "Tân", "Canh", "Kỷ", "Mậu"]);
  assert.deepEqual(Object.values(dia(false, 4)), ["Tân", "Canh", "Kỷ", "Mậu", "Ất", "Bính", "Đinh", "Quý", "Nhâm"]);
});

// ----- Ví dụ xuyên suốt: Dương độn 3 cục, giờ Canh Ngọ (Bước 4 – 12) -----
const A = anBan(true, 3, can("Canh"), chi("Ngọ"));
ok("Bước 4 — Tuần thủ", () => { assert.equal(canChi(A.tuanThu), "Giáp Tý"); assert.equal(name(A.co), "Mậu"); });
ok("Bước 5 — Trực Phù, Trực Sử", () => { assert.equal(A.cungCo, 3); assert.equal(A.trucPhu, "Thiên Xung"); assert.equal(A.trucSu, "Thương Môn"); });
ok("Bước 6 — Thiên bàn", () => {
  assert.equal(A.cungCanGio, 5); assert.equal(A.cungDenTP, 2);
  const want = { 2: [["Thiên Xung"], ["Mậu"]], 7: [["Thiên Phụ"], ["Kỷ"]], 6: [["Thiên Anh"], ["Đinh"]],
    1: [["Thiên Nhuế", "Thiên Cầm"], ["Ất", "Canh"]], 8: [["Thiên Trụ"], ["Nhâm"]], 3: [["Thiên Tâm"], ["Tân"]],
    4: [["Thiên Bồng"], ["Bính"]], 9: [["Thiên Nhậm"], ["Quý"]] };
  for (const [p, [tinh, cans]] of Object.entries(want)) {
    assert.deepEqual(A.thien[p].tinh, tinh, "cung " + p);
    assert.deepEqual(A.thien[p].can.map(name), cans, "cung " + p);
  }
});
ok("Bước 7 — Bát Môn", () => {
  assert.equal(A.cungDemSu, 9); assert.equal(A.cungDenTS, 9);
  assert.deepEqual(A.mon, { 9: "Thương Môn", 2: "Đỗ Môn", 7: "Cảnh Môn", 6: "Tử Môn", 1: "Kinh Môn", 8: "Khai Môn", 3: "Hưu Môn", 4: "Sinh Môn" });
});
ok("Bước 8 — Bát Thần Thiên bàn (Dương)", () => {
  assert.deepEqual(A.than, { 2: "Trực Phù", 7: "Đằng Xà", 6: "Thái Âm", 1: "Lục Hợp", 8: "Bạch Hổ", 3: "Huyền Vũ", 4: "Cửu Địa", 9: "Cửu Thiên" });
});
ok("Bước 9 — Mã Tinh", () => {
  assert.deepEqual(A.ma, { chi: chi("Thân"), cung: 2 });
  assert.deepEqual(anBan(true, 1, can("Tân"), chi("Mão")).ma, { chi: chi("Tỵ"), cung: 4 });
});
ok("Bước 10 — Không Vong", () => {
  assert.deepEqual(A.khongVong, { chi: [chi("Tuất"), chi("Hợi")], cung: [6] });
  const bang = [["Giáp Tý", "Tuất Hợi", [6]], ["Giáp Tuất", "Thân Dậu", [2, 7]], ["Giáp Thân", "Ngọ Mùi", [9, 2]],
    ["Giáp Ngọ", "Thìn Tỵ", [4]], ["Giáp Thìn", "Dần Mão", [8, 3]], ["Giáp Dần", "Tý Sửu", [1, 8]]];
  for (const [tuan, chis, cung] of bang) {
    const [c, h] = tuan.split(" "), r = anBan(true, 1, can(c), chi(h)).khongVong;
    assert.equal(r.chi.map((x) => CHI[x]).join(" "), chis, tuan);
    assert.deepEqual(r.cung, cung, tuan);
  }
});
ok("Bước 11 — Bát Thần Địa bàn", () => {
  assert.equal(A.dacBiet, false);
  assert.deepEqual(A.thanDia, { 3: "Trực Phù", 4: "Đằng Xà", 9: "Thái Âm", 2: "Lục Hợp", 7: "Bạch Hổ", 6: "Huyền Vũ", 1: "Cửu Địa", 8: "Cửu Thiên" });
});
ok("Bước 12 — Ám Can", () => {
  assert.deepEqual(map9(A.amCan, name), { 9: "Canh", 1: "Tân", 2: "Nhâm", 3: "Quý", 4: "Đinh", 5: "Bính", 6: "Ất", 7: "Mậu", 8: "Kỷ" });
});

// ----- Ví dụ 2 của Bước 6: Dương độn 1 cục, giờ Tân Mão -----
ok("Bước 6 — ví dụ Dương 1 cục giờ Tân Mão", () => {
  const B = anBan(true, 1, can("Tân"), chi("Mão"));
  assert.equal(canChi(B.tuanThu), "Giáp Thân"); assert.equal(name(B.co), "Canh");
  assert.equal(B.trucPhu, "Thiên Xung"); assert.equal(B.cungDenTP, 4);
  const sao = map9(B.thien, (x) => x.tinh.join("/"));
  assert.deepEqual(sao, { 4: "Thiên Xung", 9: "Thiên Phụ", 2: "Thiên Anh", 7: "Thiên Nhuế/Thiên Cầm", 6: "Thiên Trụ", 1: "Thiên Tâm", 8: "Thiên Bồng", 3: "Thiên Nhậm" });
  // Can đi theo sao: Thiên Nhuế mang Kỷ (cung 2) và Nhâm (Trung cung) như tài liệu ghi.
  assert.deepEqual(B.thien[7].can.map(name), ["Kỷ", "Nhâm"]);
  assert.deepEqual(B.thien[9].can.map(name), ["Tân"]); assert.deepEqual(B.thien[2].can.map(name), ["Ất"]);
  assert.deepEqual(B.thien[8].can.map(name), ["Mậu"]); assert.deepEqual(B.thien[3].can.map(name), ["Bính"]);
  // Tài liệu ghi Thiên Trụ mang Quý, Thiên Tâm mang Đinh; theo nguyên tắc "can đi theo sao" ở cùng bước
  // thì Thiên Trụ (gốc Đoài 7, can Đinh) mang Đinh và Thiên Tâm (gốc Càn 6, can Quý) mang Quý.
  assert.deepEqual(B.thien[6].can.map(name), ["Đinh"]); assert.deepEqual(B.thien[1].can.map(name), ["Quý"]);
});

// ----- Ví dụ 2 của Bước 8: Âm độn 9 cục, giờ Tân Mão -----
ok("Bước 8 — Bát Thần Thiên bàn (Âm)", () => {
  const C = anBan(false, 9, can("Tân"), chi("Mão"));
  assert.equal(C.trucPhu, "Thiên Trụ"); assert.equal(C.cungDenTP, 6);
  assert.deepEqual(C.than, { 6: "Trực Phù", 7: "Đằng Xà", 2: "Thái Âm", 9: "Lục Hợp", 4: "Bạch Hổ", 3: "Huyền Vũ", 8: "Cửu Địa", 1: "Cửu Thiên" });
});

// ----- Ví dụ 1 của Bước 11: Trực Phù Thiên Tâm (gốc Càn 6) -----
ok("Bước 11 — khởi từ cung gốc Thiên Tâm", () => {
  // Dương 6 cục: Mậu ở Càn 6; giờ Ất Sửu (tuần Giáp Tý, cờ Mậu) → Trực Phù Thiên Tâm, không Phục/Phản ngâm.
  const D = anBan(true, 6, can("Ất"), chi("Sửu"));
  assert.equal(D.trucPhu, "Thiên Tâm"); assert.equal(D.dacBiet, false);
  assert.deepEqual(D.thanDia, { 6: "Trực Phù", 1: "Đằng Xà", 8: "Thái Âm", 3: "Lục Hợp", 4: "Bạch Hổ", 9: "Huyền Vũ", 2: "Cửu Địa", 7: "Cửu Thiên" });
  const E = anBan(false, 6, can("Ất"), chi("Sửu"));
  assert.equal(E.trucPhu, "Thiên Tâm");
  assert.deepEqual(E.thanDia, { 6: "Trực Phù", 7: "Đằng Xà", 2: "Thái Âm", 9: "Lục Hợp", 4: "Bạch Hổ", 3: "Huyền Vũ", 8: "Cửu Địa", 1: "Cửu Thiên" });
});

// ----- Trường hợp đặc biệt: giờ Giáp, Trung cung -----
ok("Giờ Lục Giáp", () => {
  const G = anBan(true, 1, can("Giáp"), chi("Tý"));
  assert.equal(G.dichTinh, 0); assert.equal(G.dacBiet, true); assert.equal(G.cungDenTS, 1);
  assert.deepEqual(G.thanDia, G.than);
  assert.equal(name(G.amCan[5]), "Mậu"); assert.equal(name(G.amCan[6]), "Kỷ"); // Mậu nhập Trung cung, phi thuận 5 → 6
  const H = anBan(false, 1, can("Giáp"), chi("Tý"));
  assert.equal(name(H.amCan[5]), "Mậu"); assert.equal(name(H.amCan[4]), "Kỷ"); // phi nghịch 5 → 4
});
ok("Cờ ở Trung cung 5", () => {
  // Dương 5 cục: Mậu ở cung 5 → Trực Phù Thiên Cầm, Trực Sử Tử Môn (gửi Khôn 2)
  const K = anBan(true, 5, can("Bính"), chi("Dần"));
  assert.equal(K.cungCo, 5); assert.equal(K.trucPhu, "Thiên Cầm"); assert.equal(K.trucSu, "Tử Môn"); assert.equal(K.cungGocTP, 2);
  assert.ok(K.thien[K.cungDenTP].tinh.includes("Thiên Cầm"));
  for (let p = 1; p <= 9; p++) if (p !== 5) { assert.ok(K.mon[p]); assert.ok(K.than[p]); assert.ok(K.thien[p]); }
});
ok("Phản ngâm", () => {
  // Dương 1 cục, giờ Ất Sửu: Trực Phù Thiên Bồng (Khảm 1) tới cung của Ất (Ly 9) — đối xung 180°.
  const P = anBan(true, 1, can("Ất"), chi("Sửu"));
  assert.equal(P.cungDenTP, 9); assert.equal(P.phanNgam, true); assert.deepEqual(P.thanDia, P.than);
});

// ----- Tiết khí: so với thời điểm giao tiết đã công bố (giờ UTC) -----
ok("Tiết khí", () => {
  // Xuân phân, Hạ chí, Đông chí năm 2024 – 2025 theo giờ UTC đã công bố.
  const moc = [["2024-03-20T03:06Z", "Xuân phân"], ["2024-06-20T20:51Z", "Hạ chí"], ["2024-12-21T09:20Z", "Đông chí"],
    ["2025-03-20T09:01Z", "Xuân phân"], ["2025-06-21T02:42Z", "Hạ chí"], ["2025-12-21T15:03Z", "Đông chí"]];
  for (const [t, ten] of moc) {
    const ms = Date.parse(t);
    const truoc = lapTran(new Date(ms - 40 * 60000)), sau = lapTran(new Date(ms + 40 * 60000));
    assert.equal(sau.tenTiet, ten, t);
    assert.notEqual(truoc.tenTiet, ten, t);
    assert.ok(Math.abs(sau.giaoTiet.getTime() - ms) < 30 * 60000, t + " lệch " + (sau.giaoTiet.getTime() - ms) / 60000 + " phút");
  }
});
ok("Năm đổi ở Lập xuân, giờ Tý thuộc ngày hôm sau", () => {
  assert.equal(canChi(lapTran(new Date(2025, 0, 20, 12)).tuTru.nam), "Giáp Thìn");
  assert.equal(canChi(lapTran(new Date(2025, 1, 10, 12)).tuTru.nam), "Ất Tỵ");
  const truoc = lapTran(new Date(2026, 10, 18, 22, 30)), sau = lapTran(new Date(2026, 10, 18, 23, 30));
  assert.equal((truoc.tuTru.ngay + 1) % 60, sau.tuTru.ngay);
  assert.equal(CHI[sau.chiGio], "Tý");
});
ok("Ngày 1–4 tháng 1 không còn bị ép về Thượng nguyên", () => {
  // Nguyên giờ theo Phù đầu của ngày, nên 5 ngày liên tiếp thuộc cùng một Phù đầu có cùng Nguyên.
  const ngay = [1, 2, 3, 4, 5, 6].map((d) => lapTran(new Date(2027, 0, d, 10)));
  const phu = new Set(ngay.map((b) => b.phuDau));
  assert.ok(phu.size >= 2 && ngay.some((b) => b.nguyen !== 0));
});
ok("Trình tự 12 bước", () => {
  const s = KyMon.trinhTu(lapTran(new Date(1949, 9, 1, 15, 0)));
  assert.equal(s.length, 12); assert.equal(s[0].buoc, 1); assert.equal(s[11].buoc, 12);
  assert.match(s[0].ketQua, /Kỷ Sửu.*Quý Dậu.*Giáp Tý.*Nhâm Thân/);
});
console.log(`Đạt: bộ máy lập trận khớp ${n} nhóm ví dụ của tài liệu 12 bước.`);
