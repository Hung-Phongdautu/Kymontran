# Trận Pháp Kỳ Môn (Kymontran)

Trang học và thực hành Kỳ Môn Độn Giáp: lập bàn 9 cung, tra Cục số theo tiết khí, đổi giờ Ngũ Tý Độn và luận giải theo Dụng thần. Sự phối hợp giữa hai dòng Đỗ – Lê.

Toàn bộ trang là một tệp `index.html` chạy thẳng trên trình duyệt, không cần máy chủ. Tệp đó được dựng tự động từ các tệp nguồn bên dưới.

## Cấu trúc kho mã

| Đường dẫn | Vai trò |
| --- | --- |
| `index.html` | Trang hoàn chỉnh — **sản phẩm dựng ra, không sửa tay** |
| `build.py` | Ghép nguồn thành `index.html` |
| `server.py` | Chạy thử trang trên máy tại http://localhost:8000 |
| `src/template.html` | Khung trang và nội dung các trang con |
| `src/styles.css` | Giao diện |
| `src/tiet-khi.js` | Bảng giờ giao tiết 1900 – 2100 (tạo tự động, không sửa tay) |
| `tools/tao_bang_tiet_khi.py` | Tạo lại `src/tiet-khi.js` từ thư viện sxtwl (`pip install sxtwl`) |
| `src/kymon.js` | Bộ máy lập trận theo quy trình 12 bước (lịch Can Chi, tiết khí, Phù đầu, an bàn, Mã Tinh, Không Vong, Ám thần, Ám Can) |
| `src/app.js` | Bộ định tuyến, hiển thị bàn, công cụ tra cứu, phiếu đăng ký |
| `assets/` | Logo ĐL và tranh sơn thủy (được nhúng thẳng vào trang) |
| `content/kien-thuc/*.md` | Bài viết của trang Kiến Thức |
| `worker/` | Máy chủ trung gian (Cloudflare Workers) giữ khóa OpenAI cho phần "Luận giải bằng AI" — tùy chọn |
| `tests/check_site.py` | Kiểm tra mọi liên kết nội bộ dẫn tới trang và mục có thật |
| `tests/test_kymon.mjs` | Kiểm thử bộ máy lập trận bằng các ví dụ của tài liệu 12 bước |
| `tests/test_worker.mjs` | Kiểm thử máy chủ trung gian bằng OpenAI giả |
| `.github/workflows/` | Kiểm tra tự động khi đẩy mã; đưa trang lên GitHub Pages khi `main` thay đổi |

## Cách làm việc

Chỉ cần Python 3, không cài thêm gói nào.

```bash
python3 server.py             # dựng lại và chạy thử tại http://localhost:8000
python3 build.py              # chỉ dựng lại index.html sau khi sửa nguồn
python3 tests/check_site.py   # kiểm tra trước khi đẩy mã
node tests/test_kymon.mjs     # kiểm tra bộ máy lập trận (cần Node.js)
python3 build.py --demo       # ghi demo.html: bản chạy thử, nút AI trả về nội dung minh họa
```

Hướng dẫn từng bước để chạy trên máy và đưa lên mạng: [KHOI-CHAY.md](KHOI-CHAY.md).

## Thêm một bài Kiến Thức

Tạo tệp mới trong `content/kien-thuc/`, tên bắt đầu bằng số thứ tự để xếp vị trí, ví dụ `07-bat-than.md`:

```markdown
---
id: bat-than
title: Bát Thần
link: Lập bàn để xem Bát Thần → | #/tra-cuu/cong-cu?mode=lapban
---
Đoạn văn thường. Dùng **hai dấu sao** để in đậm.

- Mỗi dòng bắt đầu bằng "- " là một mục danh sách.
```

- `id`: chữ thường không dấu, số và dấu gạch nối. Bài sẽ có địa chỉ `#/kien-thuc/<id>`.
- `link`: nút dẫn ở cuối bài, dạng `chữ hiển thị | địa chỉ`; có thể khai báo nhiều dòng.
- Khối thơ, ca quyết: mở bằng dòng ```` ```verse Tiêu đề ```` và đóng bằng ```` ``` ````.

Chạy `python3 build.py` rồi `python3 tests/check_site.py`.

## Địa chỉ trong trang

Mọi nút và liên kết dùng dạng `#/<trang>/<mục>?<tham số>`:

- `<trang>`: `home`, `tra-cuu`, `huong-dan`, `bang-gia`, `kien-thuc`, `faq`, `dang-ky`.
- `<mục>`: cuộn tới phần tử có `id="muc-<mục>"` trong trang đó.
- Tham số của trang Tra Cứu: `mode` (`dudoan`, `chonngay`, `lapban`), `linhvuc`, `cung` (1–9). Trang Đăng Ký: `goi` (`que`, `thang`, `chuyen-gia`).

## Tài liệu khác

- [MO-TA-NOI-DUNG.md](MO-TA-NOI-DUNG.md) — mô tả toàn bộ nội dung trang: các trang, mục, nút bấm, công cụ và dữ liệu
- [KHOI-CHAY.md](KHOI-CHAY.md) — khởi chạy trên máy và đưa lên GitHub Pages
- [worker/README.md](worker/README.md) — bật "Luận giải bằng AI" bằng khóa OpenAI của bạn
- [CHANGELOG.md](CHANGELOG.md) — nhật ký thay đổi
- [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md) — việc cần làm trước khi đưa trang lên mạng
- [RESPONSIBLE-USE.md](RESPONSIBLE-USE.md) — nguyên tắc trình bày nội dung dự đoán
- [SECURITY.md](SECURITY.md) — những thứ không được đưa vào kho và cách báo lỗi bảo mật
- [SUPPORT.md](SUPPORT.md) — liên hệ

## Bản quyền và nguồn tham khảo

© 2026 Trận Pháp Kỳ Môn (Đỗ Lê). Bảo lưu mọi quyền — xem [LICENSE](LICENSE). Không sao chép, sửa đổi, phân phối hay dùng lại khi chưa có văn bản đồng ý của chủ sở hữu.

- Tri thức cổ pháp (ca quyết Ngũ Tý Độn, bảng 24 tiết khí – Cục số, Cửu Tinh, Bát Môn, Bát Thần, Tam Kỳ – Lục Nghi, Can Chi, Ngũ hành) thuộc phạm vi công cộng; lời diễn giải do Trận Pháp Kỳ Môn tự viết.
- [winvu88888888-maker/cuongtan66666666](https://github.com/winvu88888888-maker/cuongtan66666666): chỉ xem để đối chiếu ý tưởng chức năng.
- [masterai-top/Bazi-Ziwei-Qimen-Dunjia-Divination-System-Source-Code](https://github.com/masterai-top/Bazi-Ziwei-Qimen-Dunjia-Divination-System-Source-Code): chỉ xem để học cách tổ chức tài liệu và quy trình của kho mã.
- Không có mã nguồn, văn bản hay hình ảnh nào được lấy từ hai kho trên.
- Phần "Luận giải bằng AI" dùng dịch vụ của OpenAI; lời nhắc và mã gọi dịch vụ do Trận Pháp Kỳ Môn tự viết.
- Bảng giờ giao tiết 1900 – 2100 tính từ thư viện [sxtwl](https://github.com/yuangu/sxtwl_cpp) (Thọ Tinh vạn niên lịch, giấy phép BSD); kho chỉ lưu kết quả tính.
- Phông chữ Be Vietnam Pro và Noto Serif: SIL Open Font License 1.1 (Google Fonts).
