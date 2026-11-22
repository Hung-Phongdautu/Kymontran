#!/bin/bash
# Cài n8n (https://github.com/n8n-io/n8n) làm công cụ bổ trợ cho hệ 283 agent (agency-agents).
# n8n >= 2.x yêu cầu Node.js >= 24, nên cài Node 24 riêng vào /opt/node24 (không đụng Node mặc định).
set -e
NODE24_DIR=/opt/node24
if [ ! -x "$NODE24_DIR/node_modules/node/bin/node" ]; then
  mkdir -p "$NODE24_DIR"
  (cd "$NODE24_DIR" && npm init -y >/dev/null && npm install --loglevel=error node@24)
fi
command -v n8n >/dev/null 2>&1 || npm install -g --loglevel=error n8n@latest
cat > /usr/local/bin/n8n24 <<'WRAP'
#!/bin/bash
# Chạy n8n bằng Node 24. Ví dụ: n8n24 start
export N8N_LISTEN_ADDRESS="${N8N_LISTEN_ADDRESS:-0.0.0.0}"
exec /opt/node24/node_modules/node/bin/node "$(npm root -g)/n8n/bin/n8n" "$@"
WRAP
chmod +x /usr/local/bin/n8n24
echo "n8n $(n8n24 --version) đã sẵn sàng. Chạy: n8n24 start  ->  http://localhost:5678"
