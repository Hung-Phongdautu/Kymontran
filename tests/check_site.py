#!/usr/bin/env python3
"""Kiểm tra tĩnh index.html: mọi liên kết nội bộ phải dẫn tới trang và mục có thật.

    python3 tests/check_site.py

Kiểm tra:
  1. index.html khớp với nguồn (python3 build.py --check).
  2. Không có id trùng nhau.
  3. Mỗi liên kết "#/<trang>[/<mục>]" trỏ tới một trang có trong ROUTES và,
     nếu có <mục>, tới phần tử id="muc-<mục>" nằm trong đúng trang đó.
  4. Mỗi trang trong ROUTES có khối <div class="page" data-page="...">.

Chỉ dùng thư viện chuẩn của Python 3.
© 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
"""
import re
import subprocess
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}


class Site(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []  # (tag, page mà thẻ này mở ra, hoặc None)
        self.page = None
        self.pages = set()
        self.ids = []
        self.id_page = {}
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        opened = None
        if tag == "div" and "page" in (attrs.get("class") or "").split() and attrs.get("data-page"):
            opened = self.page = attrs["data-page"]
            self.pages.add(opened)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
            self.id_page[attrs["id"]] = self.page
        if tag == "a" and (attrs.get("href") or "").startswith("#"):
            self.links.append(attrs["href"])
        if tag not in VOID:
            self.stack.append((tag, opened))

    def handle_endtag(self, tag):
        while self.stack:
            name, opened = self.stack.pop()
            if opened:
                self.page = None
            if name == tag:
                break


def main():
    errors = []
    built = subprocess.run([sys.executable, str(ROOT / "build.py"), "--check"], capture_output=True, text=True)
    if built.returncode:
        errors.append((built.stderr or built.stdout).strip())

    text = (ROOT / "index.html").read_text(encoding="utf-8")
    routes = re.search(r"var ROUTES=\[([^\]]*)\]", text)
    routes = re.findall(r"'([^']+)'", routes.group(1)) if routes else []
    if not routes:
        errors.append("Không tìm thấy khai báo ROUTES trong mã JavaScript")

    site = Site()
    site.feed(re.sub(r"<script>.*?</script>", "", text, flags=re.S))

    for name, count in Counter(site.ids).items():
        if count > 1:
            errors.append(f'id="{name}" xuất hiện {count} lần')
    for route in routes:
        if route not in site.pages:
            errors.append(f"ROUTES có '{route}' nhưng thiếu khối trang data-page=\"{route}\"")
    for page in sorted(site.pages - set(routes)):
        errors.append(f'Trang data-page="{page}" không có trong ROUTES')

    # Liên kết do JavaScript tạo ra (bàn 9 cung, 11 lĩnh vực) cũng được kiểm tra phần cố định.
    js_links = re.findall(r"href='(#/[^'?]*)", text)
    for href in site.links + js_links:
        match = re.fullmatch(r"#/([a-z0-9-]+)(?:/([a-z0-9-]+))?(?:\?.*)?", href)
        if not match:
            errors.append(f"Liên kết sai dạng: {href}")
            continue
        route, section = match.groups()
        if route not in routes:
            errors.append(f"{href}: không có trang '{route}'")
        elif section and site.id_page.get("muc-" + section) != route:
            errors.append(f'{href}: trang \'{route}\' không có phần tử id="muc-{section}"')

    if errors:
        print("\n".join("LỖI: " + e for e in errors))
        raise SystemExit(1)
    print(f"Đạt: {len(site.links) + len(js_links)} liên kết nội bộ, {len(routes)} trang, {len(site.ids)} id.")


if __name__ == "__main__":
    main()
