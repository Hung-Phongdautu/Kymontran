// Kiểm tra worker/worker.js mà không gọi OpenAI thật: thay fetch bằng bản giả.
//     node --test test/*.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import worker, { buildUserMessage } from "../worker/worker.js";

const ORIGIN = "https://hung-phongdautu.github.io";
const env = { OPENAI_API_KEY: "sk-test-not-real", ALLOWED_ORIGIN: ORIGIN + ", http://localhost:8000", RATE_PER_MINUTE: "3" };
const palaces = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((so) => ({ so, ten: "KHẢM", huong: "Bắc · Thủy", than: "Trực Phù", tinh: so === 1 ? "Thiên Nhuế · Thiên Cầm" : "Thiên Tâm", mon: "Khai Môn", thienCan: so === 1 ? "Ất · Canh" : "Ất", diaCan: "Mậu", amCan: "Bính", thanDia: "Lục Hợp", ma: so === 2, khongVong: so === 6 }));
const good = { mode: "dudoan", field: "Kinh doanh", question: "Ký hợp đồng tuần tới có thuận không?", board: { thoiDiem: "2026-11-16 09:00", cuc: "Lập đông — Âm 6 cục", ngayGio: "Giáp Tý · Kỷ Tỵ", trucPhu: "Thiên Tâm tại cung 6", trucSu: "Khai Môn", dungThan: "Sinh Môn + Thiên Tâm", cungDungThan: 8, palaces } };
const answer = { hienTrang: "A.", duDoan: "B.", trienVong: "C.", ketLuan: "D." };

let calls = [];
let upstream = () => new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify(answer) } }] }), { status: 200 });
globalThis.fetch = async (url, init) => { calls.push({ url, init }); return upstream(); };

let ipSeq = 0;
const post = (body, { origin = ORIGIN, ip, method = "POST" } = {}) =>
  worker.fetch(new Request("https://worker.example/", { method, headers: { ...(origin ? { Origin: origin } : {}), "CF-Connecting-IP": ip || `10.0.0.${++ipSeq}` }, body: method === "POST" ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined }), env);

// 1. Yêu cầu hợp lệ: trả bốn phần, gắn khóa ở phía máy chủ, không lộ khóa ra ngoài.
let res = await post(good);
assert.equal(res.status, 200);
assert.deepEqual(await res.json(), answer);
assert.equal(res.headers.get("Access-Control-Allow-Origin"), ORIGIN);
assert.equal(calls.length, 1);
assert.equal(calls[0].url, "https://api.openai.com/v1/chat/completions");
assert.equal(calls[0].init.headers.Authorization, "Bearer sk-test-not-real");
const sent = JSON.parse(calls[0].init.body);
assert.equal(sent.messages[0].role, "system");
assert.match(sent.messages[1].content, /Lĩnh vực: Kinh doanh/);
assert.match(sent.messages[1].content, /rơi tại cung 8/);
assert.match(sent.messages[1].content, /Câu hỏi: Ký hợp đồng/);
assert.match(sent.messages[1].content, /Cung 1 KHẢM .*Tinh Thiên Nhuế · Thiên Cầm; .*Thiên Can Ất · Canh; .*Ám Can Bính; Ám thần Lục Hợp/);
assert.match(sent.messages[1].content, /Cung 2 .*; có Mã Tinh/);
assert.match(sent.messages[1].content, /Cung 6 .*; gặp Không Vong/);

// 2. Nguồn lạ hoặc thiếu Origin bị chặn trước khi gọi OpenAI.
calls = [];
assert.equal((await post(good, { origin: "https://evil.example" })).status, 403);
assert.equal((await post(good, { origin: "" })).status, 403);
assert.equal(calls.length, 0);

// 3. CORS preflight và phương thức khác.
res = await post(null, { method: "OPTIONS" });
assert.equal(res.status, 204);
assert.equal(res.headers.get("Access-Control-Allow-Origin"), ORIGIN);
assert.equal((await post(null, { method: "GET" })).status, 405);

// 4. Dữ liệu sai bị từ chối, không gọi OpenAI.
calls = [];
assert.equal((await post("{khong phai json")).status, 400);
assert.equal((await post({ ...good, field: "Lĩnh vực lạ" })).status, 400);
assert.equal((await post({ ...good, mode: "lapban" })).status, 400);
assert.equal((await post({ ...good, board: { ...good.board, palaces: palaces.slice(0, 8) } })).status, 400);
assert.equal((await post({ ...good, board: { ...good.board, cungDungThan: 12 } })).status, 400);
assert.equal((await post({ ...good, question: "x".repeat(9000) })).status, 413);
assert.equal(calls.length, 0);

// 5. Câu hỏi bị cắt còn 500 ký tự; xuống dòng bị gộp.
const msg = buildUserMessage({ ...good, question: "a\n\nb " + "x".repeat(600) });
assert.ok(msg.split("Câu hỏi: ")[1].length === 500 && msg.includes("Câu hỏi: a b x"));

// 6. Giới hạn lượt theo IP (3 lượt mỗi phút trong cấu hình thử).
for (let i = 0; i < 3; i++) assert.equal((await post(good, { ip: "9.9.9.9" })).status, 200);
assert.equal((await post(good, { ip: "9.9.9.9" })).status, 429);

// 7. Lỗi từ OpenAI: báo lỗi chung, không lộ nội dung lỗi gốc.
upstream = () => new Response('{"error":{"message":"Incorrect API key sk-..."}}', { status: 401 });
const log = console.log; console.log = () => {};
res = await post(good);
console.log = log;
assert.equal(res.status, 502);
assert.ok(!(await res.text()).includes("sk-"));
upstream = () => new Response(JSON.stringify({ choices: [{ message: { content: '{"hienTrang":"A"}' } }] }), { status: 200 });
assert.equal((await post(good)).status, 502);

// 8. Thiếu khóa trên máy chủ.
res = await worker.fetch(new Request("https://worker.example/", { method: "POST", headers: { Origin: ORIGIN }, body: "{}" }), { ALLOWED_ORIGIN: ORIGIN });
assert.equal(res.status, 500);

test("máy chủ trung gian xử lý đúng 8 nhóm tình huống", () => {});
