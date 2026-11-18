#!/usr/bin/env python3
"""Dựng index.html của Trận Pháp Kỳ Môn từ các tệp nguồn.

    python3 build.py              # ghi index.html
    python3 build.py --check      # báo lỗi nếu index.html chưa khớp với nguồn
    python3 build.py --site _site # ghi thêm thư mục để đưa lên mạng (GitHub Pages)
    python3 build.py --demo       # ghi demo.html: bản chạy thử có nút AI trả về nội dung minh họa

Nguồn:
    src/template.html          khung trang, chứa các chỗ giữ chỗ {{...}}
    src/styles.css             toàn bộ CSS            -> {{styles}}
    src/tiet-khi.js, src/kymon.js, src/app.js  bảng giao tiết, bộ máy lập trận, mã giao diện -> {{script}}
    assets/<tên tệp>           ảnh, nhúng dạng data URI -> {{asset:<tên tệp>}}
    content/kien-thuc/*.md     bài viết Kiến Thức     -> {{kien-thuc}}

Chỉ dùng thư viện chuẩn của Python 3.
© 2026 Trận Pháp Kỳ Môn. Bảo lưu mọi quyền — xem tệp LICENSE.
"""
import base64
import html
import mimetypes
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "index.html"
ARTICLE_DIR = ROOT / "content" / "kien-thuc"


def read(path):
    return path.read_text(encoding="utf-8")


def inline(text):
    """Chuyển **đậm** và [chữ](liên kết) trong một dòng Markdown sang HTML."""
    text = html.escape(text, quote=False)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    return re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", r'<a href="\2">\1</a>', text)


def parse_article(path):
    """Đọc một bài .md: phần đầu (id, title, link) rồi tới thân bài."""
    text = read(path)
    match = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    if not match:
        raise SystemExit(f"{path.name}: thiếu phần đầu '---' ở đầu tệp")
    meta = {"links": []}
    for line in match.group(1).splitlines():
        key, _, value = line.partition(":")
        key, value = key.strip(), value.strip()
        if key == "link":
            label, _, href = value.rpartition("|")
            if not label.strip() or not href.strip().startswith("#/"):
                raise SystemExit(f"{path.name}: dòng link phải có dạng 'chữ | #/trang/muc'")
            meta["links"].append((label.strip(), href.strip()))
        elif key in ("id", "title"):
            meta[key] = value
        elif key:
            raise SystemExit(f"{path.name}: không hiểu khóa '{key}' ở phần đầu")
    for key in ("id", "title"):
        if not meta.get(key):
            raise SystemExit(f"{path.name}: thiếu '{key}' ở phần đầu")
    if not re.fullmatch(r"[a-z0-9-]+", meta["id"]):
        raise SystemExit(f"{path.name}: id chỉ gồm chữ thường không dấu, số và dấu gạch nối")
    return meta, match.group(2)


def render_body(body):
    """Thân bài: đoạn văn, danh sách '- ' và khối ```verse <tiêu đề>."""
    out, lines, i = [], body.strip("\n").split("\n"), 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
        elif line.startswith("```verse"):
            title, verse = line[len("```verse"):].strip(), []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                verse.append(inline(lines[i]))
                i += 1
            i += 1
            out.append(f'<div class="verse"><small>{inline(title)}</small>{"<br>".join(verse)}</div>')
        elif line.startswith("- "):
            items = []
            while i < len(lines) and lines[i].startswith("- "):
                items.append(f"        <li>{inline(lines[i][2:])}</li>")
                i += 1
            out.append("<ul>\n" + "\n".join(items) + "\n      </ul>")
        else:
            para = []
            while i < len(lines) and lines[i].strip() and not lines[i].startswith(("- ", "```")):
                para.append(lines[i].strip())
                i += 1
            out.append(f"<p>{inline(' '.join(para))}</p>")
    return "\n      ".join(out)


def render_articles():
    blocks, seen = [], set()
    for path in sorted(ARTICLE_DIR.glob("*.md")):
        meta, body = parse_article(path)
        if meta["id"] in seen:
            raise SystemExit(f"{path.name}: id '{meta['id']}' bị trùng")
        seen.add(meta["id"])
        links = "".join(
            f'<a class="more" href="{html.escape(href)}">{inline(label)}</a>' for label, href in meta["links"]
        )
        blocks.append(
            f'    <article class="card" id="muc-{meta["id"]}"><h3>{inline(meta["title"])}</h3>\n'
            f"      {render_body(body)}\n"
            f"      {links}</article>"
        )
    if not blocks:
        raise SystemExit("content/kien-thuc/ chưa có bài .md nào")
    return "\n".join(blocks)


def data_uri(name):
    path = ROOT / "assets" / name
    if not path.is_file():
        raise SystemExit(f"Thiếu tệp ảnh assets/{name}")
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode('ascii')}"


def build():
    page = read(ROOT / "src" / "template.html")
    parts = {
        "styles": read(ROOT / "src" / "styles.css").strip("\n"),
        "script": "\n".join(read(ROOT / "src" / f).strip("\n") for f in ("tiet-khi.js", "kymon.js", "app.js")),
        "kien-thuc": render_articles(),
    }
    for key, value in parts.items():
        token = "{{" + key + "}}"
        if page.count(token) != 1:
            raise SystemExit(f"src/template.html phải chứa đúng một {token}")
        page = page.replace(token, value)
    cache = {}
    page = re.sub(
        r"\{\{asset:([\w.-]+)\}\}",
        lambda m: cache.setdefault(m.group(1), data_uri(m.group(1))),
        page,
    )
    left = re.search(r"\{\{[\w:.-]+\}\}", page)
    if left:
        raise SystemExit(f"Còn chỗ giữ chỗ chưa thay: {left.group(0)}")
    return page


def write_index():
    page = build()
    OUTPUT.write_text(page, encoding="utf-8")
    print(f"Đã ghi {OUTPUT.name} ({len(page.encode('utf-8')) // 1024} KB)")
    return page


def write_site(folder):
    """Ghi thư mục đưa lên mạng: trang chính, trang 404 và các tệp cho máy tìm kiếm."""
    folder = Path(folder)
    folder.mkdir(parents=True, exist_ok=True)
    page = read(OUTPUT)
    (folder / "index.html").write_text(page, encoding="utf-8")
    # Địa chỉ gõ sai vẫn mở được trang (bộ định tuyến đưa về trang chủ).
    (folder / "404.html").write_text(page, encoding="utf-8")
    (folder / "robots.txt").write_text("User-agent: *\nAllow: /\n", encoding="utf-8")
    # Báo cho GitHub Pages phục vụ nguyên trạng, không chạy Jekyll.
    (folder / ".nojekyll").write_text("", encoding="utf-8")
    return folder


def write_demo():
    """Bản chạy thử: bật nút "Luận giải bằng AI" ở chế độ minh họa, không gọi dịch vụ nào."""
    page, off, on = build(), "var AI_ENDPOINT='';", "var AI_ENDPOINT='demo';"
    if page.count(off) != 1:
        raise SystemExit("Không tìm thấy đúng một dòng AI_ENDPOINT trống trong src/app.js để tạo bản demo")
    page = page.replace(off, on).replace("<title>", "<title>[Demo] ", 1)
    (ROOT / "demo.html").write_text(page, encoding="utf-8")
    print("Đã ghi demo.html (bản chạy thử, không đưa lên mạng thay cho index.html)")


def main():
    args = sys.argv[1:]
    if "--demo" in args:
        write_demo()
        return
    if "--check" in args:
        if not OUTPUT.is_file() or read(OUTPUT) != build():
            raise SystemExit("index.html chưa khớp với nguồn — hãy chạy: python3 build.py")
        print("index.html khớp với nguồn.")
        return
    write_index()
    if "--site" in args:
        position = args.index("--site") + 1
        if position >= len(args):
            raise SystemExit("Thiếu tên thư mục sau --site")
        print(f"Đã ghi thư mục {write_site(ROOT / args[position]).name}/")


if __name__ == "__main__":
    main()
