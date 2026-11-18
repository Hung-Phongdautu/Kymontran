# Khởi chạy website Trận Pháp Kỳ Môn

Chạy thử trên máy của bạn bất cứ lúc nào; kho mã để riêng tư; chỉ đưa trang lên mạng khi cần.

## A. Chạy thử trên máy

Cần Python 3.9 trở lên, không cài thêm gói nào.

### Bước 1: Tải kho về

```bash
git clone https://github.com/Hung-Phongdautu/Kymontran.git
cd Kymontran
```

### Bước 2: Chạy

```bash
python3 server.py
```

Lệnh này dựng lại `index.html` từ nguồn rồi phục vụ trang trên máy (hoặc chạy `npm start`).

### Bước 3: Mở trình duyệt

Vào http://localhost:8000. Nhấn `Ctrl+C` trong cửa sổ lệnh để dừng.

Cũng có thể mở thẳng tệp `index.html` bằng trình duyệt mà không cần chạy lệnh nào.

## B. Để kho ở chế độ riêng tư

Kho mã giữ ở chế độ **riêng tư**: chỉ bạn và người được mời mới xem được mã nguồn, tài liệu quy trình và bảng tra.

1. Vào https://github.com/Hung-Phongdautu/Kymontran/settings
2. Kéo xuống cuối trang, mục **Danger Zone** → **Change repository visibility** → **Make private**, rồi xác nhận.
3. Muốn cho người khác xem: **Settings → Collaborators → Add people**.

Kiểm tra tự động (quy trình “Kiểm tra trang”) vẫn chạy với kho riêng tư, trong hạn mức phút chạy miễn phí của GitHub.

## C. Đưa trang lên mạng khi cần (GitHub Pages)

Quy trình “Đưa trang lên GitHub Pages” **không tự chạy**; nó chỉ chạy khi bạn bấm tay. Nhờ vậy trang chưa xuất hiện trên mạng cho tới khi bạn muốn.

> GitHub Pages cho kho **riêng tư** cần gói trả phí (GitHub Pro, Team hoặc Enterprise). Với gói miễn phí, hãy đổi kho sang công khai trước khi kích hoạt, hoặc đưa tệp `index.html` lên một dịch vụ lưu trữ tĩnh khác.

1. Gộp mã vào nhánh `main`.
2. Vào https://github.com/Hung-Phongdautu/Kymontran/settings/pages, ở mục **Build and deployment → Source** chọn **GitHub Actions**.
3. Vào https://github.com/Hung-Phongdautu/Kymontran/actions → **Đưa trang lên GitHub Pages** → **Run workflow**.
4. Đợi dấu xanh rồi mở https://hung-phongdautu.github.io/Kymontran/

Muốn gỡ trang xuống: **Settings → Pages → Unpublish site** (hoặc tắt Pages). Mỗi lần cập nhật nội dung, bấm chạy lại quy trình ở bước 3.

### Kiểm tra khi có lỗi

- **Dấu đỏ ở quy trình “Đưa trang lên GitHub Pages”**: thường do chưa làm bước 2, hoặc kho riêng tư mà tài khoản chưa có gói hỗ trợ Pages.
- **Dấu đỏ ở quy trình “Kiểm tra trang”**: bấm vào để đọc dòng báo lỗi. Hay gặp nhất là quên chạy `python3 build.py` hoặc `node tools/xuat_bang_tra.mjs` sau khi sửa nguồn.
- **Trang chưa đổi sau khi cập nhật**: tải lại bằng `Ctrl+Shift+R`.

## D. Cập nhật nội dung về sau

1. Sửa ở nguồn: `lib/` (bộ máy), `views/` và `public/` (giao diện), `content/kien-thuc/*.md` (bài viết) — xem [README.md](README.md).
2. Chạy `python3 build.py`, rồi `npm test`. Nếu sửa bảng tra trong `lib/bang-tra.js`, chạy thêm `node tools/xuat_bang_tra.mjs` để cập nhật `data/`.
3. Đẩy lên `main`. Trang trên mạng tự cập nhật sau một đến hai phút.

## E. Bật "Luận giải bằng AI" (tùy chọn)

Trang chạy đầy đủ mà không cần AI. Muốn phần luận giải do OpenAI viết theo từng câu hỏi, làm theo [worker/README.md](worker/README.md): tạo một Worker trên Cloudflare để giữ khóa, rồi dán địa chỉ Worker vào `AI_ENDPOINT` trong `public/js/app.js`.

Không đặt khóa OpenAI vào trang, vào kho mã hay vào GitHub Pages.

## Lưu ý

- Không đưa khóa API, mật khẩu hay dữ liệu khách hàng vào kho hoặc vào tài liệu hướng dẫn — kho công khai thì ai cũng đọc được (xem [SECURITY.md](SECURITY.md)).
- Dùng tên miền riêng: điền tên miền ở mục **Custom domain** trong trang cài đặt Pages và trỏ DNS theo hướng dẫn của GitHub.
- Trước mỗi lần công bố thay đổi lớn, rà [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md).
