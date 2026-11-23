// --- Hàm dùng chung (chèn lúc build; Code node n8n không chia sẻ hàm) ---
function fmtTien(n) {
  if (n === null || n === undefined || !Number.isFinite(Number(n))) return String(n);
  const v = Math.round(Number(n));
  const s = String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (v < 0 ? "-" : "") + s;
}
function escMd(s) { return String(s == null ? "" : s).replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>"); }
function escHtml(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
// --- Hết hàm dùng chung ---
