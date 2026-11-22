# Kymontran
Sự phối hợp giữa 2 dòng Đỗ Lê

## Bổ trợ n8n cho hệ 283 agent

Hệ 283 agent ([agency-agents](https://github.com/msitarzewski/agency-agents)) được cài toàn cục vào `~/.claude/agents` qua setup script của môi trường. Repo này bổ sung [n8n](https://github.com/n8n-io/n8n) để các agent (vd. *Automation Governance Architect*, *Workflow Architect*, *Workflow Optimizer*) thiết kế và chạy workflow tự động hóa:

- `scripts/install-n8n.sh` — cài n8n + Node 24 (n8n 2.x cần Node ≥ 24), tạo lệnh `n8n24`.
- `n8n24 start` — chạy n8n tại http://localhost:5678.
- `.mcp.json` — MCP server [`n8n-mcp`](https://github.com/czlonkowski/n8n-mcp) cung cấp cho Claude/agent tài liệu và schema của toàn bộ node n8n để dựng workflow chính xác. Muốn agent tạo/sửa workflow trực tiếp trên n8n, thêm `N8N_API_URL` và `N8N_API_KEY` (tạo trong n8n: Settings → n8n API) vào `env`.
