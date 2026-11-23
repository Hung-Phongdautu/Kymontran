#!/usr/bin/env node
// Kiểm thử offline workflow "Biwase – Kiểm tra hồ sơ quyết toán công trình".
// Tách jsCode của từng Code node TỪ FILE JSON đã build, chạy tuần tự bằng Node, mô phỏng IF/Switch theo đúng kết nối.
// Chạy: node workflows/test/run-tests.js
"use strict";
const fs = require("fs");
const path = require("path");

const WF_PATH = path.join(__dirname, "..", "kiem-tra-quyet-toan.json");
const wf = JSON.parse(fs.readFileSync(WF_PATH, "utf8"));

// Luxon: dùng bản đi kèm n8n (Code node n8n cũng cấp DateTime từ Luxon)
function loadLuxon() {
  const cands = ["luxon", "/opt/node22/lib/node_modules/n8n/node_modules/luxon", "/opt/node24/lib/node_modules/n8n/node_modules/luxon"];
  for (const c of cands) { try { return require(c); } catch (e) { /* thử tiếp */ } }
  throw new Error("Không tìm thấy luxon (cài cùng n8n).");
}
const { DateTime } = loadLuxon();

const byName = Object.fromEntries(wf.nodes.map(n => [n.name, n]));
const clone = o => JSON.parse(JSON.stringify(o));   // mô phỏng việc n8n tuần tự hóa item giữa các node

function runCode(name, json, patch) {
  const node = byName[name];
  if (!node || node.type !== "n8n-nodes-base.code") throw new Error(`Không có Code node ${name}`);
  let src = node.parameters.jsCode;
  if (patch) src = patch(src);
  const $input = { first: () => ({ json }), all: () => [{ json }], item: { json } };
  const fn = new Function("$input", "DateTime", "$json", `return (function(){\n${src}\n})();`);
  const out = fn($input, DateTime, json);
  if (!Array.isArray(out)) throw new Error(`${name} không trả mảng`);
  return out.map(o => clone(o.json));
}
// Lấy đích kết nối của node theo output index
const next = (name, idx = 0) => ((wf.connections[name] || {}).main || [])[idx] || [];

function runPipeline({ kichBan, webhookBody }) {
  const trace = [];
  let item;
  if (kichBan) {
    trace.push("Chạy thử thủ công", "Dữ liệu mẫu");
    [item] = runCode("Dữ liệu mẫu", {}, s => s.replace(/const KICH_BAN = "[A-Z_]+";/, `const KICH_BAN = "${kichBan}";`));
  } else {
    trace.push("Webhook nhận hồ sơ");
    item = { headers: { "content-type": "application/json" }, params: {}, query: {}, body: clone(webhookBody) };
  }
  let cur = "Chuẩn hóa đầu vào";
  const outputs = {};
  let email = null, terminal = null;
  while (cur) {
    trace.push(cur);
    const node = byName[cur];
    if (node.type === "n8n-nodes-base.code") {
      const out = runCode(cur, item);
      outputs[cur] = out;
      if (cur === "Đóng gói đầu ra") {
        // N17 có 2 đích: N18 (trên) rồi N21 (dưới)
        const dests = next(cur).map(x => x.node);
        if (dests[0] !== "Nguồn là webhook?" || dests[1] !== "Soạn thông báo") throw new Error("Thứ tự đích của N17 sai");
        const em = runCode("Soạn thông báo", out[0]);
        email = em;
        if (em.length) { const e = byName["Gửi email chi nhánh/nhà thầu"]; if (!e.disabled) throw new Error("Node email KHÔNG bị tắt"); }
      }
      if (out.length === 0) break;
      item = out[0];
      cur = next(cur)[0] && next(cur)[0].node;
    } else if (cur === "Hợp lệ?") {
      cur = next(cur, item.kiem_tra_cau_truc.hop_le === true ? 0 : 1)[0].node;
    } else if (cur === "Phân loại kết luận") {
      const map = { DUNG_QUYET_TOAN: 0, DIEU_CHINH_TK_DT: 1, CHUA_KET_LUAN: 2, DAT: 3 };
      const idx = item.ket_luan && item.ket_luan.ma in map ? map[item.ket_luan.ma] : 4;
      cur = next(cur, idx)[0].node;
    } else if (cur === "Nguồn là webhook?") {
      cur = next(cur, item.meta && item.meta.nguon === "webhook" ? 0 : 1)[0].node;
    } else if (cur === "Phản hồi webhook" || cur === "Kết quả chạy thử") {
      terminal = cur; break;
    } else throw new Error(`Node chưa mô phỏng: ${cur}`);
  }
  const resp = outputs["Đóng gói đầu ra"] ? outputs["Đóng gói đầu ra"][0] : outputs["Tạo phản hồi lỗi"] && outputs["Tạo phản hồi lỗi"][0];
  return { trace, resp, email, terminal, outputs };
}

// ---------- Dữ liệu gốc cho ca webhook (lấy từ N03 kịch bản DAT) ----------
const [goc] = runCode("Dữ liệu mẫu", {});
delete goc.__nguon_thu_cong;
const base = () => clone(goc);
const tcOf = (hs, so) => hs.danh_gia_tieu_chi.find(t => t.so === so);
const hsOf = (hs, ma) => hs.ho_so.find(h => h.ma === ma);
function apDungDungQT(hs) {     // biến đổi của kịch bản DUNG_QUYET_TOAN
  Object.assign(hs.hang_muc[0], { kl_hoan_cong: 520, kl_nghiem_thu_hien_truong: 520, kl_nghiem_thu_bbnt: 520, kl_quyet_toan: 520 });
  hs.checklist_ban_ve_hoan_cong.chieu_dai_tuyen.so_lieu.chieu_dai_ban_ve = 520;
  tcOf(hs, 5).ket_qua = "khong_phu_hop";
  return hs;
}
function apDung460(hs) {
  Object.assign(hs.hang_muc[0], { kl_hoan_cong: 460, kl_nghiem_thu_hien_truong: 460, kl_nghiem_thu_bbnt: 460, kl_quyet_toan: 460 });
  hs.tong_hop_khai_bao.tong_quyet_toan_truoc_thue = 202011000;
  hs.tong_hop_khai_bao.tong_quyet_toan_sau_thue = 222212100;
  hs.hoa_don_gtgt.gia_tri_truoc_thue = 202011000;
  hs.hoa_don_gtgt.gia_tri_sau_thue = 222212100;
  hs.checklist_ban_ve_hoan_cong.chieu_dai_tuyen.so_lieu.chieu_dai_ban_ve = 460;
  return hs;
}

// ---------- Ca kiểm thử ----------
const homNay = DateTime.now().setZone("Asia/Ho_Chi_Minh").startOf("day");
const ph = (b, ma) => b.phat_hien.filter(p => p.ma === ma);
const dong = (b, stt) => b.phieu_ycbs.bang[stt - 1];

const CASES = [
  { id: "TC-01", ten: "Đạt (Manual)", run: { kichBan: "DAT" }, mong: "DAT", check: (r, ok) => {
    const b = r.resp.body;
    ok(b.ket_luan.quy_tac_ap_dung === 4, "quy tắc 4");
    ok(b.tieu_chi[14].ket_qua === "phu_hop", "TC15 phu_hop");
    ok(b.phat_hien.length === 0, `phat_hien rỗng (có ${b.phat_hien.length})`);
    ok(b.doi_chieu_ba_chieu.tong_qt_tinh_lai === 199071000, "tổng tính lại 199071000");
    ok(b.doi_chieu_ba_chieu.so_hang_muc_lech === 0, "0 HM lệch");
    ok(b.to_trinh && b.to_trinh.chenh_lech_so_voi_hop_dong === -1749000, "chênh lệch -1749000");
    ok(b.to_trinh.gia_tri_quyet_toan_de_nghi_sau_thue === 218978100, "sau thuế 218978100");
    ok(b.phieu_ycbs === null, "phieu_ycbs null");
    ok(b.dong_bao_cao.gia_tri.ket_luan === "Đạt — chuyển trình ký" && b.dong_bao_cao.gia_tri.so_phieu_ycbs === "", "dòng báo cáo");
    ok(r.email.length === 0, "N21 trả rỗng");
    ok(r.terminal === "Kết quả chạy thử", "kết thúc ở N20 (TC-19)");
    ok(b.doi_chieu_ba_chieu.hang_muc[0].ty_le_khac_thiet_ke === -0.009, "tỷ lệ HM1 -0.009");
  } },
  { id: "TC-02", ten: "Điều chỉnh TK–DT (Manual)", run: { kichBan: "DIEU_CHINH_TK_DT" }, mong: "DIEU_CHINH_TK_DT", check: (r, ok) => {
    const b = r.resp.body;
    ok(b.ket_luan.quy_tac_ap_dung === 2, "quy tắc 2");
    ok(b.tieu_chi[14].ket_qua === "khong_phu_hop", "TC15 khong_phu_hop");
    ok(b.phieu_ycbs.bang.length === 11, "11 dòng");
    ok(dong(b, 6).noi_dung.some(x => x.startsWith("[TC9]")) && dong(b, 6).yeu_cau === "Điều chỉnh", "dòng 6 [TC9] Điều chỉnh");
    ok(b.phieu_ycbs.bang.filter(x => x.stt !== 6).every(x => x.yeu_cau === "Không" && x.noi_dung[0] === "Không có ý kiến"), "dòng khác Không");
    ok(b.phieu_ycbs.markdown.includes("KHÔNG ĐẠT – PHẢI ĐIỀU CHỈNH"), "mục III mở đầu");
    const hanMong = DateTime.fromISO("2026-11-27", { zone: "Asia/Ho_Chi_Minh" }) > homNay ? "27/11/2026" : homNay.plus({ days: 7 }).toFormat("dd/LL/yyyy");
    ok(b.phieu_ycbs.han_bo_sung === hanMong, `hạn ${b.phieu_ycbs.han_bo_sung} = ${hanMong}`);
    ok(r.email.length === 1 && r.email[0].subject.includes("Không đạt"), "N21 có 1 item (TC-20)");
    ok(b.phieu_ycbs.html.startsWith("<!doctype html>") && !/<script/i.test(b.phieu_ycbs.html), "HTML hợp lệ");
  } },
  { id: "TC-03", ten: "Dừng quyết toán (Manual)", run: { kichBan: "DUNG_QUYET_TOAN" }, mong: "DUNG_QUYET_TOAN", check: (r, ok) => {
    const b = r.resp.body;
    ok(b.ket_luan.quy_tac_ap_dung === 1, "quy tắc 1");
    const t14 = b.tieu_chi[13], t13 = b.tieu_chi[12];
    ok(t14.ket_qua === "khong_phu_hop" && t14.nguon === "tu_dong" && t14.ket_qua_nguoi_nhap === "phu_hop", "TC14 máy hạ");
    ok(t13.ket_qua === "khong_phu_hop" && t13.nguon === "tu_dong", "TC13 máy hạ");
    const cd = ph(b, "CONG_DON_SAI");
    ok(cd.length === 1 && cd[0].tien_anh_huong === -15540000, "CONG_DON_SAI -15540000");
    ok(ph(b, "HOA_DON_KHONG_KHOP").length === 1, "HOA_DON_KHONG_KHOP");
    const v = ph(b, "VUOT_GIA_HOP_DONG");
    ok(v.length === 1 && v[0].tien_anh_huong === 13791000, "VUOT_GIA 13791000");
    ok(dong(b, 5).yeu_cau === "Bổ sung-điều chỉnh", "dòng 5 Bổ sung-điều chỉnh");
  } },
  { id: "TC-04", ten: "Chưa kết luận (Manual)", run: { kichBan: "CHUA_KET_LUAN" }, mong: "CHUA_KET_LUAN", check: (r, ok) => {
    const b = r.resp.body; const cbs = b.ket_luan.can_bo_sung;
    ok(b.ket_luan.quy_tac_ap_dung === 3, "quy tắc 3");
    ok(cbs.includes("Thiếu Hóa đơn GTGT"), "can_bo_sung: thiếu hóa đơn");
    ok(cbs.some(x => x.startsWith("Lỗi trình bày: chưa kiểm tra")), "can_bo_sung: lỗi trình bày");
    ok(cbs.some(x => x.startsWith("Tiêu chí 10") && x.includes("chưa đủ căn cứ")), "can_bo_sung: TC10");
    ok(dong(b, 11).yeu_cau === "Bổ sung" && dong(b, 9).yeu_cau === "Bổ sung", "dòng 9, 11 Bổ sung");
    ok(b.dong_bao_cao.gia_tri.ho_so_thieu === "Thiếu Hóa đơn GTGT", "ho_so_thieu");
    ok(b.phieu_ycbs.markdown.includes("CHƯA KẾT LUẬN"), "mục III");
  } },
  { id: "TC-05", ten: "Cổng số liệu: chép HĐ (Manual)", run: { kichBan: "CONG_SO_LIEU" }, mong: "CHUA_KET_LUAN", check: (r, ok) => {
    const b = r.resp.body;
    const q = ph(b, "QT_LECH_NGHIEM_THU");
    ok(q.length === 1 && q[0].hang_muc_stt === 4 && q[0].tien_anh_huong === 624000, "QT_LECH HM4 624000");
    ok(ph(b, "BBNT_LECH_SO_GOC").length === 1 && ph(b, "CHEP_HOP_DONG_KHONG_SO_DO").length === 1, "BBNT_LECH + CHEP_HD");
    ok(ph(b, "CONG_DON_SAI").length === 1 && b.doi_chieu_ba_chieu.tong_qt_tinh_lai === 199695000, "CONG_DON_SAI / 199695000");
    ok(ph(b, "HOA_DON_KHONG_KHOP").length === 1 && b.phat_hien.some(p => p.noi_dung.includes("219.664.500")), "HOA_DON 219.664.500");
    ok(b.doi_chieu_ba_chieu.tong_thanh_toan_du === 624000, "thanh toán dư 624000");
    const pl = b.phieu_ycbs.markdown.split("Phụ lục II.a")[1].split("## III")[0].split("\n").filter(l => /^\| \d/.test(l));
    ok(pl.length === 1 && pl[0].startsWith("| 4 |"), "phụ lục 1 dòng HM4");
  } },
  { id: "TC-06", ten: "Vượt giá HĐ không phụ lục", run: { webhookBody: apDung460(base()) }, mong: "CHUA_KET_LUAN", check: (r, ok) => {
    const b = r.resp.body; const v = ph(b, "VUOT_GIA_HOP_DONG");
    ok(v.length === 1 && v[0].tien_anh_huong === 1191000 && v[0].nhom_ycbs === 1 && v[0].yeu_cau === "Bổ sung", "VUOT 1191000 nhóm 1");
    ok(ph(b, "CONG_DON_SAI").length === 0, "không CONG_DON_SAI");
    ok(b.tieu_chi[13].ket_qua === "phu_hop", "không hạ TC14");
    ok(r.terminal === "Phản hồi webhook" && r.resp.http_status === 200, "HTTP 200 qua N19");
  } },
  { id: "TC-06b", ten: "Vượt giá HĐ có phụ lục", run: { webhookBody: (() => { const h = apDung460(base()); hsOf(h, "PHU_LUC_HOP_DONG").co = true; h.hop_dong.gia_tri_sau_phu_luc = 205000000; return h; })() },
    mong: "DAT", check: (r, ok) => {
    const k = r.resp.body.kiem_tra_hop_dong;
    ok(k.gia_tri_hieu_luc === 205000000 && k.vuot_hop_dong === 0, "hiệu lực 205000000, vượt 0");
  } },
  { id: "TC-07", ten: "Giám sát không giao mà QT", run: { webhookBody: (() => { const h = base(); h.chi_phi_giam_sat = { co_trong_du_toan: true, gia_tri: 4500000, da_giao_don_vi: false, co_trong_quyet_toan: true }; return h; })() },
    mong: "CHUA_KET_LUAN", check: (r, ok) => {
    const b = r.resp.body;
    ok(ph(b, "GIAM_SAT_KHONG_GIAO").length === 1 && ph(b, "GIAM_SAT_KHONG_GIAO")[0].tien_anh_huong === 4500000, "GIAM_SAT 4500000");
    ok(b.kiem_tra_hop_dong.giam_sat.ket_qua === "khong_quyet_toan", "ket_qua khong_quyet_toan");
  } },
  { id: "TC-07b", ten: "Giám sát không giao, không QT", run: { webhookBody: (() => { const h = base(); h.chi_phi_giam_sat = { co_trong_du_toan: true, gia_tri: 4500000, da_giao_don_vi: false, co_trong_quyet_toan: false }; return h; })() },
    mong: "DAT", check: (r, ok) => {
    const b = r.resp.body;
    ok(b.ket_luan.luu_y.some(x => x.includes("giám sát")), "luu_y giám sát");
    ok(b.kiem_tra_hop_dong.giam_sat.ket_qua === "luu_y", "ket_qua luu_y");
  } },
  { id: "TC-08", ten: "Mốc pháp lý sai", run: { webhookBody: (() => { const h = base(); h.checklist_du_toan_quyet_toan.can_cu_phap_ly_theo_moc.so_lieu.moc_ap_dung = "truoc_01072026"; return h; })() },
    mong: "CHUA_KET_LUAN", check: (r, ok) => {
    const b = r.resp.body; const m = b.checklist_gd5.du_toan_quyet_toan.find(x => x.khoa === "can_cu_phap_ly_theo_moc");
    ok(m.ket_qua === "khong_dat" && m.nguon === "tu_dong", "mục bị hạ, nguon tu_dong");
    ok(ph(b, "MOC_PHAP_LY_SAI").length === 1 && ph(b, "MOC_PHAP_LY_SAI")[0].nhom_ycbs === 6, "MOC_PHAP_LY_SAI nhóm 6");
  } },
  { id: "TC-09", ten: "Thiếu số gốc", run: { webhookBody: (() => { const h = base(); h.hang_muc[1].kl_nghiem_thu_hien_truong = null; return h; })() },
    mong: "CHUA_KET_LUAN", check: (r, ok) => {
    const b = r.resp.body; const hm2 = b.doi_chieu_ba_chieu.hang_muc[1];
    ok(hm2.trang_thai === "thieu_so_goc" && hm2.thanh_tien_anh_huong === null, "HM2 thieu_so_goc");
    ok(ph(b, "THIEU_SO_GOC").length === 1, "THIEU_SO_GOC");
  } },
  { id: "TC-10", ten: "Ưu tiên quy tắc", run: { webhookBody: (() => { const h = apDungDungQT(base()); tcOf(h, 9).ket_qua = "khong_phu_hop"; hsOf(h, "QD_CHI_DINH_THAU").co = false; return h; })() },
    mong: "DUNG_QUYET_TOAN", check: (r, ok) => {
    const b = r.resp.body;
    ok(b.ket_luan.can_bo_sung.includes("Thiếu Quyết định chỉ định thầu"), "can_bo_sung thiếu QĐ CĐT");
    ok(dong(b, 1).yeu_cau === "Bổ sung", "dòng 1 Bổ sung");
  } },
  { id: "TC-11", ten: "Có điều chỉnh đầy đủ", run: { webhookBody: (() => {
      const h = apDungDungQT(base()); tcOf(h, 5).ket_qua = "phu_hop";
      hsOf(h, "HS_THIET_KE_DIEU_CHINH").co = true; hsOf(h, "DU_TOAN_DIEU_CHINH").co = true; h.hang_muc[0].kl_thiet_ke_dieu_chinh = 520;
      h.tong_hop_khai_bao.tong_quyet_toan_truoc_thue = 214611000; h.tong_hop_khai_bao.tong_quyet_toan_sau_thue = 236072100;
      h.hoa_don_gtgt.gia_tri_truoc_thue = 214611000; h.hoa_don_gtgt.gia_tri_sau_thue = 236072100;
      hsOf(h, "PHU_LUC_HOP_DONG").co = true; h.hop_dong.gia_tri_sau_phu_luc = 215000000; return h; })() },
    mong: "DAT", check: (r, ok) => {
    const b = r.resp.body;
    ok(b.tieu_chi[12].ket_qua === "phu_hop" && b.tieu_chi[13].ket_qua === "phu_hop", "TC13, TC14 giữ phu_hop");
    ok(b.doi_chieu_ba_chieu.hang_muc[0].kl_tk_tham_chieu === 520, "kl_tk_tham_chieu 520");
  } },
  { id: "TC-12", ten: "TC nhóm không bắt buộc", run: { webhookBody: (() => { const h = base(); tcOf(h, 10).ket_qua = "khong_phu_hop"; h.checklist_ban_ve_hoan_cong.loi_trinh_bay.ket_qua = "khong_dat"; return h; })() },
    mong: "DAT", check: (r, ok) => {
    const b = r.resp.body;
    ok(b.ket_luan.luu_y.length === 2, `luu_y 2 dòng (có ${b.ket_luan.luu_y.length})`);
    ok(b.to_trinh.luu_y.length === 2 && b.to_trinh.markdown.includes("Lưu ý"), "tờ trình liệt kê lưu ý");
  } },
  { id: "TC-13", ten: "Thiếu trường", run: { webhookBody: (() => { const h = base(); delete h.cong_trinh.ten_cong_trinh; h.cong_trinh.chi_nhanh = "Thủ Dầu Một"; return h; })() },
    mong: "HTTP 400 DAU_VAO_KHONG_HOP_LE", check: (r, ok) => {
    const b = r.resp.body;
    ok(b.loi.length === 2 && b.loi.some(l => l.ma === "THIEU_TRUONG") && b.loi.some(l => l.ma === "GIA_TRI_KHONG_HOP_LE"), `đúng 2 lỗi (có ${b.loi.length})`);
    ok(!r.outputs["Tạo dòng báo cáo tổng hợp"], "không có dòng báo cáo");
    ok(r.terminal === "Phản hồi webhook", "trả qua N19");
  } },
  { id: "TC-14", ten: "Hạng mục rỗng (Manual)", run: { kichBan: "LOI_HANG_MUC_RONG" }, mong: "HTTP 422 HANG_MUC_RONG", check: (r, ok) => {
    ok(r.terminal === "Kết quả chạy thử", "dừng ở N20");
  } },
  { id: "TC-15", ten: "HM rỗng + thiếu hop_dong", run: { webhookBody: (() => { const h = base(); h.hang_muc = []; delete h.hop_dong; return h; })() },
    mong: "HTTP 400 DAU_VAO_KHONG_HOP_LE", check: (r, ok) => {
    const l = r.resp.body.loi;
    ok(l.some(x => x.ma === "HANG_MUC_RONG") && l.some(x => x.ma === "THIEU_TRUONG"), "có cả HANG_MUC_RONG và THIEU_TRUONG");
  } },
  { id: "TC-16a", ten: "Body là mảng", run: { webhookBody: [base()] }, mong: "HTTP 400 DAU_VAO_KHONG_HOP_LE", check: (r, ok) => {
    ok(r.resp.body.loi.some(x => x.ma === "BODY_KHONG_PHAI_OBJECT"), "BODY_KHONG_PHAI_OBJECT");
  } },
  { id: "TC-16b", ten: "Body chuỗi \"abc\"", run: { webhookBody: "abc" }, mong: "HTTP 400 DAU_VAO_KHONG_HOP_LE", check: (r, ok) => {
    ok(r.resp.body.loi.some(x => x.ma === "JSON_KHONG_HOP_LE"), "JSON_KHONG_HOP_LE");
  } },
  { id: "TC-17a", ten: "Số \"210,000\"", run: { webhookBody: (() => { const h = base(); h.hang_muc[0].don_gia_quyet_toan = "210,000"; return h; })() },
    mong: "HTTP 400 DAU_VAO_KHONG_HOP_LE", check: (r, ok) => {
    ok(r.resp.body.loi.some(x => x.ma === "SO_SAI_DINH_DANG" && x.truong === "hang_muc[0].don_gia_quyet_toan"), "SO_SAI_DINH_DANG tại hang_muc[0]");
  } },
  { id: "TC-17b", ten: "Số \"210000\"", run: { webhookBody: (() => { const h = base(); h.hang_muc[0].don_gia_quyet_toan = "210000"; return h; })() },
    mong: "DAT", check: (r, ok) => { ok(r.resp.body.doi_chieu_ba_chieu.hang_muc[0].don_gia_quyet_toan === 210000, "đổi thành 210000"); } },
  { id: "TC-17c", ten: "Số \"210.000\" (Q6)", run: { webhookBody: (() => { const h = base(); h.hang_muc[0].don_gia_quyet_toan = "210.000"; return h; })() },
    mong: "CHUA_KET_LUAN", check: (r, ok) => {
    const b = r.resp.body; ok(ph(b, "DON_GIA_KHAC_HOP_DONG").length === 1 && ph(b, "CONG_DON_SAI").length >= 1, "DON_GIA_KHAC + CONG_DON_SAI");
  } },
  { id: "TC-18", ten: "Không ghi đè ngưỡng", run: { webhookBody: (() => { const h = apDungDungQT(base()); h.cau_hinh = { NGUONG_KHAC_THIET_KE: 0.5 }; return h; })() },
    mong: "DUNG_QUYET_TOAN", check: (r, ok) => { ok(r.resp.body.ket_luan.ma === "DUNG_QUYET_TOAN", "cau_hinh gửi lên bị bỏ"); } },
  { id: "TC-01w", ten: "Đạt qua webhook", run: { webhookBody: base() }, mong: "DAT", check: (r, ok) => {
    ok(r.terminal === "Phản hồi webhook" && r.resp.http_status === 200 && r.resp.meta.nguon === "webhook", "200 qua N19");
    ok(r.resp.body.dong_bao_cao.csv_dong.split(";").length === 23, "CSV 23 cột");
  } },
];

function ketLuanThucTe(r) {
  if (!r.resp) return "(không có đầu ra)";
  if (r.resp.body.ok) return r.resp.body.ket_luan.ma;
  return `HTTP ${r.resp.http_status} ${r.resp.body.ma_loi}`;
}

// ---------- Kiểm tra cấu trúc workflow ----------
function kiemTraCauTruc() {
  const loi = [];
  const ids = new Set();
  const reUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
  for (const k of ["name", "nodes", "connections", "settings"]) if (!(k in wf)) loi.push(`thiếu ${k}`);
  if (wf.active !== false) loi.push("active phải là false");
  for (const n of wf.nodes) {
    for (const k of ["id", "name", "type", "typeVersion", "position", "parameters"]) if (!(k in n)) loi.push(`${n.name}: thiếu ${k}`);
    if (!reUuid.test(n.id)) loi.push(`${n.name}: id không phải UUID`);
    if (ids.has(n.id)) loi.push(`${n.name}: trùng id`); ids.add(n.id);
    if (n.credentials) loi.push(`${n.name}: có credential`);
  }
  const email = wf.nodes.find(n => n.type === "n8n-nodes-base.emailSend");
  if (!email || email.disabled !== true) loi.push("node email phải disabled");
  for (const [src, c] of Object.entries(wf.connections)) {
    if (!byName[src]) loi.push(`kết nối từ node lạ ${src}`);
    for (const out of c.main) for (const x of out) if (!byName[x.node]) loi.push(`kết nối tới node lạ ${x.node}`);
  }
  const wh = wf.nodes.find(n => n.type === "n8n-nodes-base.webhook");
  if (wh.parameters.responseMode !== "responseNode") loi.push("webhook phải responseMode=responseNode");
  return loi;
}

// ---------- Chạy ----------
const rows = [];
let soFail = 0;
const ctLoi = kiemTraCauTruc();
rows.push(["STRUCT", "Cấu trúc JSON workflow", ctLoi.length ? ctLoi.join("; ") : "hợp lệ", "hợp lệ", ctLoi.length ? "FAIL" : "PASS"]);
if (ctLoi.length) soFail++;
const chiTiet = [];
for (const c of CASES) {
  let thucTe = "", loi = [];
  try {
    const r = runPipeline(c.run);
    thucTe = ketLuanThucTe(r);
    if (thucTe !== c.mong) loi.push(`kết luận ${thucTe} ≠ ${c.mong}`);
    if (r.resp) c.check(r, (cond, msg) => { if (!cond) loi.push(msg); });
  } catch (e) { thucTe = "EXCEPTION"; loi.push(e.stack.split("\n").slice(0, 3).join(" | ")); }
  const kq = loi.length ? "FAIL" : "PASS";
  if (loi.length) { soFail++; chiTiet.push(`${c.id}: ${loi.join("; ")}`); }
  rows.push([c.id, c.ten, thucTe, c.mong, kq]);
}
const head = ["Ca", "Mô tả", "Kết luận thực tế", "Mong đợi", "KQ"];
const w = head.map((h, i) => Math.max(h.length, ...rows.map(r => String(r[i]).length)));
const line = r => "| " + r.map((x, i) => String(x).padEnd(w[i])).join(" | ") + " |";
console.log(line(head));
console.log("|" + w.map(x => "-".repeat(x + 2)).join("|") + "|");
rows.forEach(r => console.log(line(r)));
console.log(`\nTổng: ${rows.length - soFail}/${rows.length} PASS`);
if (chiTiet.length) { console.log("\nChi tiết lỗi:"); chiTiet.forEach(x => console.log(" - " + x)); }
process.exit(soFail ? 1 : 0);
