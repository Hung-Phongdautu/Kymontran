#!/usr/bin/env node
// Dựng workflows/kiem-tra-quyet-toan.json từ mã nguồn Code node trong src/nodes/*.js.
// Chạy: node workflows/src/build.js   (sửa logic ở src/nodes rồi build lại; KHÔNG sửa tay file JSON)
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SRC = __dirname;
const OUT = path.join(SRC, "..", "kiem-tra-quyet-toan.json");
const HELPERS = fs.readFileSync(path.join(SRC, "nodes", "_helpers.js"), "utf8").trim();
const MAU = JSON.parse(fs.readFileSync(path.join(SRC, "mau-dat.json"), "utf8"));

// UUID v4-dạng, xác định theo tên (build lại không đổi id -> diff gọn)
function uuid(seed) {
  const h = crypto.createHash("sha1").update("biwase-ktqt:" + seed).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-${"89ab"[parseInt(h[16], 16) % 4]}${h.slice(17, 20)}-${h.slice(20, 32)}`;
}
function code(file) {
  let s = fs.readFileSync(path.join(SRC, "nodes", file), "utf8");
  s = s.replace("/*@HELPERS*/", HELPERS);
  s = s.replace("/*@MAU*/", JSON.stringify(MAU, null, 2));
  if (s.includes("/*@")) throw new Error(`Còn placeholder trong ${file}`);
  return s;
}
const codeNode = (name, file, pos, extra = {}) => ({
  parameters: { language: "javaScript", mode: "runOnceForAllItems", jsCode: code(file) },
  id: uuid(name), name, type: "n8n-nodes-base.code", typeVersion: 2, position: pos, ...extra,
});
const filterOpts = { caseSensitive: true, leftValue: "", typeValidation: "strict", version: 2 };
const strEq = (left, right, seed) => ({
  id: uuid(seed), leftValue: left, rightValue: right, operator: { type: "string", operation: "equals" },
});

const N = {
  N01: "Webhook nhận hồ sơ", N02: "Chạy thử thủ công", N03: "Dữ liệu mẫu", N04: "Chuẩn hóa đầu vào", N05: "Kiểm tra cấu trúc",
  N06: "Hợp lệ?", N07: "Kiểm tra hồ sơ căn cứ", N08: "Đối chiếu ba chiều", N09: "Kiểm tra hợp đồng", N10: "Tổng hợp checklist GĐ5",
  N11: "Đánh giá 15 tiêu chí", N12: "Áp quy tắc kết luận", N13: "Phân loại kết luận", N14: "Lập phiếu YCBS", N15: "Lập tờ trình chuyển ký",
  N16: "Tạo dòng báo cáo tổng hợp", N17: "Đóng gói đầu ra", N18: "Nguồn là webhook?", N19: "Phản hồi webhook", N20: "Kết quả chạy thử",
  N21: "Soạn thông báo", N22: "Gửi email chi nhánh/nhà thầu", N23: "Tạo phản hồi lỗi", N24: "Ghi chú: cần người duyệt",
};

const switchRule = (key, value) => ({
  conditions: { options: filterOpts, conditions: [strEq("={{ $json.ket_luan.ma }}", value, "sw-" + value)], combinator: "and" },
  renameOutput: true, outputKey: key,
});

const nodes = [
  { parameters: { httpMethod: "POST", path: "biwase/kiem-tra-quyet-toan", authentication: "none", responseMode: "responseNode", options: { rawBody: false } },
    id: uuid(N.N01), name: N.N01, type: "n8n-nodes-base.webhook", typeVersion: 2, position: [0, 0], webhookId: uuid("webhookId") },
  { parameters: {}, id: uuid(N.N02), name: N.N02, type: "n8n-nodes-base.manualTrigger", typeVersion: 1, position: [0, 300] },
  codeNode(N.N03, "N03.js", [240, 300], { notes: "Đổi hằng KICH_BAN ở dòng đầu để chọn kịch bản chạy thử", notesInFlow: true }),
  codeNode(N.N04, "N04.js", [480, 150]),
  codeNode(N.N05, "N05.js", [720, 150]),
  { parameters: {
      conditions: { options: filterOpts, conditions: [{ id: uuid("if-hop-le"), leftValue: "={{ $json.kiem_tra_cau_truc.hop_le }}", rightValue: "",
        operator: { type: "boolean", operation: "true", singleValue: true } }], combinator: "and" },
      looseTypeValidation: false, options: {} },
    id: uuid(N.N06), name: N.N06, type: "n8n-nodes-base.if", typeVersion: 2.2, position: [960, 150] },
  codeNode(N.N07, "N07.js", [1200, 0]),
  codeNode(N.N08, "N08.js", [1440, 0]),
  codeNode(N.N09, "N09.js", [1680, 0]),
  codeNode(N.N10, "N10.js", [1920, 0]),
  codeNode(N.N11, "N11.js", [2160, 0]),
  codeNode(N.N12, "N12.js", [2400, 0]),
  { parameters: {
      mode: "rules",
      rules: { values: [
        switchRule("Dừng quyết toán", "DUNG_QUYET_TOAN"),
        switchRule("Điều chỉnh TK-DT", "DIEU_CHINH_TK_DT"),
        switchRule("Chưa kết luận", "CHUA_KET_LUAN"),
        switchRule("Đạt", "DAT"),
      ] },
      options: { fallbackOutput: "extra", renameFallbackOutput: "Ngoài dự kiến", allMatchingOutputs: false } },
    id: uuid(N.N13), name: N.N13, type: "n8n-nodes-base.switch", typeVersion: 3.2, position: [2640, 0] },
  codeNode(N.N14, "N14.js", [2880, -150]),
  codeNode(N.N15, "N15.js", [2880, 150]),
  codeNode(N.N16, "N16.js", [3120, 0]),
  codeNode(N.N17, "N17.js", [3360, 0]),
  { parameters: {
      conditions: { options: filterOpts, conditions: [strEq("={{ $json.meta.nguon }}", "webhook", "if-nguon")], combinator: "and" },
      looseTypeValidation: false, options: {} },
    id: uuid(N.N18), name: N.N18, type: "n8n-nodes-base.if", typeVersion: 2.2, position: [3600, 0] },
  { parameters: { respondWith: "json", responseBody: "={{ $json.body }}",
      options: { responseCode: "={{ $json.http_status }}", responseHeaders: { entries: [{ name: "Content-Type", value: "application/json; charset=utf-8" }] } } },
    id: uuid(N.N19), name: N.N19, type: "n8n-nodes-base.respondToWebhook", typeVersion: 1.1, position: [3840, -100] },
  { parameters: {}, id: uuid(N.N20), name: N.N20, type: "n8n-nodes-base.noOp", typeVersion: 1, position: [3840, 100] },
  codeNode(N.N21, "N21.js", [3600, 300]),
  { parameters: { fromEmail: "", toEmail: "={{ $json.to }}", subject: "={{ $json.subject }}", emailFormat: "html", html: "={{ $json.html }}", options: {} },
    id: uuid(N.N22), name: N.N22, type: "n8n-nodes-base.emailSend", typeVersion: 2.1, position: [3840, 300], disabled: true,
    notes: "CẦN NGƯỜI DUYỆT: chỉ bật sau khi lãnh đạo Phòng Đầu tư duyệt nội dung phiếu YCBS và cấu hình SMTP.", notesInFlow: true },
  codeNode(N.N23, "N23.js", [1200, 350]),
  { parameters: { content: "## CẦN NGƯỜI DUYỆT\nNode gửi email đang TẮT. Trước khi bật: (1) lãnh đạo duyệt phiếu YCBS; (2) cấu hình SMTP credential; (3) điền fromEmail; (4) kiểm tra danh sách người nhận.\n\nWebhook đang không xác thực – bật Header Auth trước khi đưa ra ngoài mạng nội bộ.",
      height: 200, width: 360, color: 1 },
    id: uuid(N.N24), name: N.N24, type: "n8n-nodes-base.stickyNote", typeVersion: 1, position: [3560, 460] },
];

const to = (...names) => names.map(n => ({ node: n, type: "main", index: 0 }));
const connections = {
  [N.N01]: { main: [to(N.N04)] },
  [N.N02]: { main: [to(N.N03)] },
  [N.N03]: { main: [to(N.N04)] },
  [N.N04]: { main: [to(N.N05)] },
  [N.N05]: { main: [to(N.N06)] },
  [N.N06]: { main: [to(N.N07), to(N.N23)] },
  [N.N07]: { main: [to(N.N08)] },
  [N.N08]: { main: [to(N.N09)] },
  [N.N09]: { main: [to(N.N10)] },
  [N.N10]: { main: [to(N.N11)] },
  [N.N11]: { main: [to(N.N12)] },
  [N.N12]: { main: [to(N.N13)] },
  [N.N13]: { main: [to(N.N14), to(N.N14), to(N.N14), to(N.N15), to(N.N23)] },
  [N.N14]: { main: [to(N.N16)] },
  [N.N15]: { main: [to(N.N16)] },
  [N.N16]: { main: [to(N.N17)] },
  [N.N17]: { main: [to(N.N18, N.N21)] },          // N18 (y=0) trước N21 (y=300)
  [N.N18]: { main: [to(N.N19), to(N.N20)] },
  [N.N21]: { main: [to(N.N22)] },
  [N.N23]: { main: [to(N.N18)] },
};

const wf = {
  name: "Biwase – Kiểm tra hồ sơ quyết toán công trình",
  nodes,
  connections,
  active: false,
  settings: {
    executionOrder: "v1",
    timezone: "Asia/Ho_Chi_Minh",
    saveManualExecutions: true,
    saveDataSuccessExecution: "all",
    saveDataErrorExecution: "all",
    executionTimeout: 60,
  },
  pinData: {},
  tags: [],
};
fs.writeFileSync(OUT, JSON.stringify(wf, null, 2) + "\n");
console.log(`Đã ghi ${OUT} (${nodes.length} node)`);
