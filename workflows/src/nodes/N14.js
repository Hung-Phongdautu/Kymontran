// N14 – Lập phiếu YCBS (Markdown + HTML sinh từ cùng dữ liệu). Bản nháp – chỉ có hiệu lực sau khi lãnh đạo duyệt (D11).
/*@HELPERS*/
const d = $input.first().json;
const ct = d.cong_trinh; const kl = d.ket_luan; const dcj = d.doi_chieu;
const ZONE = "Asia/Ho_Chi_Minh";
const NHOM_YCBS = ["Pháp lý dự án", "Sự phù hợp quy hoạch", "Quy mô – phạm vi đầu tư", "Giải pháp kỹ thuật", "Thiết kế cơ sở/TKKT",
  "Khối lượng – Dự toán", "Tổng mức đầu tư", "Hiệu quả đầu tư", "Hồ sơ bản vẽ", "Hồ sơ thuyết minh", "Các nội dung khác"];

// --- Thông tin phiếu ---
const chay = DateTime.fromISO(d.meta.thoi_diem, { setZone: true }).setZone(ZONE);
const homNay = chay.startOf("day");
const n = ct.thoi_han_bo_sung_ngay;
const canhBao = [];
let han = DateTime.fromISO(ct.ngay_nhan, { zone: ZONE }).plus({ days: n });
let hanTuNgayLap = false;
if (han <= homNay) { han = homNay.plus({ days: n }); hanTuNgayLap = true; canhBao.push("Hạn tính từ ngày nhận đã qua – tính lại từ ngày lập phiếu"); }
const maFile = String(ct.ma_cong_trinh).replace(/[^A-Za-z0-9_-]/g, "_");
const so_phieu = `YCBS-${ct.ma_cong_trinh}-${chay.toFormat("yyyyLLdd")}`;   // số tạm (D6)
const ngay_lap = chay.toFormat("dd/LL/yyyy");
const han_bo_sung = han.toFormat("dd/LL/yyyy");
const ngayNhanVN = DateTime.fromISO(ct.ngay_nhan).toFormat("dd/LL/yyyy");

// --- Bảng 11 nhóm ---
function gopYeuCau(ds) {
  const s = new Set(ds.filter(x => x !== "Không"));
  if (s.size === 0) return "Không";
  if (s.has("Bổ sung-điều chỉnh") || (s.has("Bổ sung") && s.has("Điều chỉnh"))) return "Bổ sung-điều chỉnh";
  return [...s][0];
}
const muc = NHOM_YCBS.map(() => []);
const them = (g, noi_dung, yeu_cau) => { if (Number.isInteger(g) && g >= 1 && g <= 11) muc[g - 1].push({ noi_dung, yeu_cau }); };
for (const t of d.tieu_chi) {
  if (t.so === 15) continue;
  if (t.ket_qua === "khong_phu_hop") {
    const yc = (t.so === 13 || t.so === 14) ? "Bổ sung-điều chỉnh" : t.so === 12 ? "Không" : "Điều chỉnh";
    them(t.nhom_ycbs, `[TC${t.so}] ${t.ten}: ${t.ly_do_tu_dong || t.nhan_xet || "không phù hợp"}`, yc);
  } else if (t.ket_qua === "chua_du_can_cu") {
    them(t.nhom_ycbs, `[TC${t.so}] ${t.ten}: chưa đủ căn cứ – đề nghị bổ sung hồ sơ chứng minh`, "Bổ sung");
  }
}
const phSapXep = d.phat_hien.map((p, i) => ({ p, i })).sort((a, b) => {
  const sa = a.p.hang_muc_stt == null ? Infinity : a.p.hang_muc_stt;
  const sb = b.p.hang_muc_stt == null ? Infinity : b.p.hang_muc_stt;
  return sa === sb ? a.i - b.i : sa - sb;
}).map(x => x.p);
for (const p of phSapXep) {
  const tien = (p.tien_anh_huong != null && p.tien_anh_huong !== 0) ? ` – ảnh hưởng ${fmtTien(p.tien_anh_huong)} đ` : "";
  them(p.nhom_ycbs, `${p.noi_dung}${tien}`, p.yeu_cau);
}
if (d.ghi_chu_nguoi_kiem_tra && String(d.ghi_chu_nguoi_kiem_tra).trim()) them(11, `Ghi chú người kiểm tra: ${String(d.ghi_chu_nguoi_kiem_tra).trim()}`, "Không");

const bang = NHOM_YCBS.map((ten, i) => ({
  stt: i + 1, nhom: ten,
  noi_dung: muc[i].length ? muc[i].map(x => x.noi_dung) : ["Không có ý kiến"],
  yeu_cau: muc[i].length ? gopYeuCau(muc[i].map(x => x.yeu_cau)) : "Không",
}));

// --- Mục III ---
const MO_DAU = {
  DUNG_QUYET_TOAN: "Hồ sơ quyết toán KHÔNG ĐẠT – DỪNG QUYẾT TOÁN. Đề nghị chi nhánh lập hồ sơ thiết kế – dự toán điều chỉnh, trình phê duyệt trước khi lập lại hồ sơ quyết toán.",
  DIEU_CHINH_TK_DT: "Hồ sơ quyết toán KHÔNG ĐẠT – PHẢI ĐIỀU CHỈNH THIẾT KẾ – DỰ TOÁN theo các nội dung tại mục II trước khi quyết toán.",
  CHUA_KET_LUAN: "CHƯA KẾT LUẬN. Đề nghị chi nhánh/nhà thầu bổ sung, điều chỉnh các nội dung sau để Phòng Đầu tư có đủ căn cứ kết luận:",
};
const moDau = MO_DAU[kl.ma] || kl.nhan;
const giamTru = dcj.tong_thanh_toan_du > 0 ? `Giá trị đề nghị giảm trừ tạm tính: ${fmtTien(dcj.tong_thanh_toan_du)} đ.` : "";
const hmLech = dcj.hang_muc.filter(x => x.trang_thai !== "khop");
const fmtKL = v => v == null ? "—" : String(v);
const cauHan = `Đề nghị chi nhánh ${ct.chi_nhanh} / nhà thầu ${ct.nha_thau.ten} hoàn chỉnh và gửi lại hồ sơ trước ngày ${han_bo_sung} (${n} ngày kể từ ngày ${hanTuNgayLap ? "lập phiếu" : "nhận hồ sơ"}).`;
const chanTrang = `Phiếu sinh tự động bởi workflow n8n (quy tắc ${d.meta.phien_ban_quy_tac}, phiên ${d.meta.ma_phien}). Chỉ có hiệu lực sau khi lãnh đạo Phòng Đầu tư duyệt.`;
const thongTin = [
  ["Tên công trình", ct.ten_cong_trinh], ["Địa điểm", ct.dia_diem], ["Chi nhánh", ct.chi_nhanh], ["Loại hồ sơ", "Quyết toán"],
  ["Ngày nhận hồ sơ", ngayNhanVN], ["Người kiểm tra", ct.nguoi_kiem_tra],
];

// --- Markdown ---
const md = [];
md.push("# PHIẾU YÊU CẦU BỔ SUNG HỒ SƠ", `**Số:** ${so_phieu} — **Ngày:** ${ngay_lap}`, "");
md.push("## I. THÔNG TIN CHUNG", "| Mục | Nội dung |", "|---|---|");
thongTin.forEach(([a, b]) => md.push(`| ${escMd(a)} | ${escMd(b)} |`));
md.push("", "## II. NỘI DUNG GÓP Ý", "| STT | Nhóm nội dung | Nội dung góp ý | Yêu cầu chỉnh sửa |", "|---|---|---|---|");
bang.forEach(r => {
  const nd = r.noi_dung.length === 1 && r.yeu_cau === "Không" && r.noi_dung[0] === "Không có ý kiến"
    ? "Không có ý kiến" : r.noi_dung.map((x, i) => `${i + 1}) ${escMd(x)}`).join("<br>");
  md.push(`| ${r.stt} | ${escMd(r.nhom)} | ${nd} | ${escMd(r.yeu_cau)} |`);
});
md.push("", "### Phụ lục II.a – Đối chiếu ba chiều (chỉ các hạng mục lệch hoặc thiếu số gốc)",
  "| STT HM | Hạng mục | ĐVT | Hoàn công | Nghiệm thu HT | Quyết toán | Lệch QT–NT | Thành tiền ảnh hưởng (đ) |",
  "|---|---|---|---|---|---|---|---|");
if (hmLech.length === 0) md.push("| | Không có hạng mục lệch | | | | | | |");
hmLech.forEach(x => md.push(`| ${x.stt} | ${escMd(x.ten)} | ${escMd(x.don_vi)} | ${fmtKL(x.kl_hoan_cong)} | ${fmtKL(x.kl_nghiem_thu_hien_truong)} | ${fmtKL(x.kl_quyet_toan)} | ${fmtKL(x.lech_qt_nt)} | ${x.thanh_tien_anh_huong == null ? "thiếu số gốc" : fmtTien(x.thanh_tien_anh_huong)} |`));
md.push(`| | **Tổng thanh toán dư** | | | | | | **${fmtTien(dcj.tong_thanh_toan_du)}** |`);
md.push("", "## III. KẾT LUẬN", `**${kl.nhan}**`, "", moDau, "");
kl.ly_do.forEach(x => md.push(`- ${x}`));
if (kl.can_bo_sung.length) { md.push("", "Cần bổ sung:"); kl.can_bo_sung.forEach(x => md.push(`- ${x}`)); }
if (kl.luu_y.length) { md.push("", "Lưu ý:"); kl.luu_y.forEach(x => md.push(`- ${x}`)); }
if (giamTru) md.push("", giamTru);
md.push("", "## IV. THỜI HẠN",
  `Đề nghị chi nhánh ${ct.chi_nhanh} / nhà thầu ${ct.nha_thau.ten} hoàn chỉnh và gửi lại hồ sơ **trước ngày ${han_bo_sung}** (${n} ngày kể từ ngày ${hanTuNgayLap ? "lập phiếu" : "nhận hồ sơ"}).`,
  "", "---", `*${chanTrang}*`);
const markdown = md.join("\n");

// --- HTML (từ cùng dữ liệu, mọi giá trị đã escape) ---
const e = escHtml;
const li = ds => ds.length ? `<ul>${ds.map(x => `<li>${e(x)}</li>`).join("")}</ul>` : "";
const h = [];
h.push(`<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${e(so_phieu)}</title><style>body{font-family:"Times New Roman",serif;font-size:13pt} table{border-collapse:collapse;width:100%} td,th{border:1px solid #000;padding:4px;vertical-align:top}</style></head><body>`);
h.push(`<h1>PHIẾU YÊU CẦU BỔ SUNG HỒ SƠ</h1><p><b>Số:</b> ${e(so_phieu)} — <b>Ngày:</b> ${e(ngay_lap)}</p>`);
h.push(`<h2>I. THÔNG TIN CHUNG</h2><table><tr><th>Mục</th><th>Nội dung</th></tr>${thongTin.map(([a, b]) => `<tr><td>${e(a)}</td><td>${e(b)}</td></tr>`).join("")}</table>`);
h.push(`<h2>II. NỘI DUNG GÓP Ý</h2><table><tr><th>STT</th><th>Nhóm nội dung</th><th>Nội dung góp ý</th><th>Yêu cầu chỉnh sửa</th></tr>`);
bang.forEach(r => {
  const nd = r.noi_dung.length === 1 && r.noi_dung[0] === "Không có ý kiến" && r.yeu_cau === "Không"
    ? "Không có ý kiến" : r.noi_dung.map((x, i) => `${i + 1}) ${e(x)}`).join("<br>");
  h.push(`<tr><td>${r.stt}</td><td>${e(r.nhom)}</td><td>${nd}</td><td>${e(r.yeu_cau)}</td></tr>`);
});
h.push(`</table><h3>Phụ lục II.a – Đối chiếu ba chiều (chỉ các hạng mục lệch hoặc thiếu số gốc)</h3><table><tr><th>STT HM</th><th>Hạng mục</th><th>ĐVT</th><th>Hoàn công</th><th>Nghiệm thu HT</th><th>Quyết toán</th><th>Lệch QT–NT</th><th>Thành tiền ảnh hưởng (đ)</th></tr>`);
if (hmLech.length === 0) h.push(`<tr><td></td><td colspan="7">Không có hạng mục lệch</td></tr>`);
hmLech.forEach(x => h.push(`<tr><td>${e(x.stt)}</td><td>${e(x.ten)}</td><td>${e(x.don_vi)}</td><td>${e(fmtKL(x.kl_hoan_cong))}</td><td>${e(fmtKL(x.kl_nghiem_thu_hien_truong))}</td><td>${e(fmtKL(x.kl_quyet_toan))}</td><td>${e(fmtKL(x.lech_qt_nt))}</td><td>${x.thanh_tien_anh_huong == null ? "thiếu số gốc" : e(fmtTien(x.thanh_tien_anh_huong))}</td></tr>`));
h.push(`<tr><td></td><td><b>Tổng thanh toán dư</b></td><td colspan="5"></td><td><b>${e(fmtTien(dcj.tong_thanh_toan_du))}</b></td></tr></table>`);
h.push(`<h2>III. KẾT LUẬN</h2><p><b>${e(kl.nhan)}</b></p><p>${e(moDau)}</p>${li(kl.ly_do)}`);
if (kl.can_bo_sung.length) h.push(`<p>Cần bổ sung:</p>${li(kl.can_bo_sung)}`);
if (kl.luu_y.length) h.push(`<p>Lưu ý:</p>${li(kl.luu_y)}`);
if (giamTru) h.push(`<p>${e(giamTru)}</p>`);
h.push(`<h2>IV. THỜI HẠN</h2><p>${e(cauHan)}</p><hr><p><i>${e(chanTrang)}</i></p></body></html>`);
const html = h.join("");

return [{ json: { ...d, to_trinh: null, phieu_ycbs: {
  so_phieu, ngay_lap, han_bo_sung, bang, markdown, html, canh_bao: canhBao,
  ten_file_goi_y: { markdown: `YCBS_${maFile}_${chay.toFormat("yyyyLLdd")}.md`, html: `YCBS_${maFile}_${chay.toFormat("yyyyLLdd")}.html` },
} } }];
