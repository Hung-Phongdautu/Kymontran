#!/usr/bin/env python3
"""Chạy thử trang Trận Pháp Kỳ Môn trên máy của bạn.

    python3 server.py              # dựng lại index.html rồi mở http://localhost:8000
    python3 server.py --port 9000  # dùng cổng khác
    python3 server.py --no-build   # phục vụ index.html hiện có, không dựng lại

Máy chủ chỉ nghe trên máy này (127.0.0.1) và chỉ phục vụ thư mục trang đã dựng
(index.html, 404.html, robots.txt) — giống hệt những gì sẽ đưa lên GitHub Pages.
Nhấn Ctrl+C để dừng.

Chỉ dùng thư viện chuẩn của Python 3.
© 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
"""
import argparse
import functools
import http.server
import tempfile
from pathlib import Path

import build


class Handler(http.server.SimpleHTTPRequestHandler):
    """Phục vụ tệp tĩnh; địa chỉ không tồn tại trả về 404.html như GitHub Pages."""

    def send_error(self, code, message=None, explain=None):
        page = Path(self.directory) / "404.html"
        if code == 404 and page.is_file():
            body = page.read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description="Chạy thử trang Trận Pháp Kỳ Môn trên máy.")
    parser.add_argument("--port", type=int, default=8000, help="cổng (mặc định 8000)")
    parser.add_argument("--no-build", action="store_true", help="không dựng lại index.html")
    args = parser.parse_args()

    if not args.no_build:
        build.write_index()
    with tempfile.TemporaryDirectory() as site:
        build.write_site(Path(site))
        handler = functools.partial(Handler, directory=site)
        with http.server.ThreadingHTTPServer(("127.0.0.1", args.port), handler) as httpd:
            print(f"Trang đang chạy tại http://localhost:{args.port}  (Ctrl+C để dừng)")
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nĐã dừng.")


if __name__ == "__main__":
    main()
