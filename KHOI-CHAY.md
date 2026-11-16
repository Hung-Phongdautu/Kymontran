# Khởi chạy website Trận Pháp Kỳ Môn

Có hai cách: chạy thử trên máy của bạn, và đưa lên mạng bằng GitHub Pages (miễn phí với kho công khai).

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

Lệnh này dựng lại `index.html` từ nguồn rồi phục vụ trang trên máy.

### Bước 3: Mở trình duyệt

Vào http://localhost:8000. Nhấn `Ctrl+C` trong cửa sổ lệnh để dừng.

Cũng có thể mở thẳng tệp `index.html` bằng trình duyệt mà không cần chạy lệnh nào.

## B. Đưa lên mạng bằng GitHub Pages

Làm một lần; sau đó trang tự cập nhật mỗi khi nhánh `main` thay đổi.

### Bước 1: Gộp mã vào nhánh `main`

Quy trình đưa trang lên mạng chỉ chạy từ nhánh `main`.

### Bước 2: Bật GitHub Pages

1. Vào https://github.com/Hung-Phongdautu/Kymontran/settings/pages
2. Ở mục **Build and deployment → Source**, chọn **GitHub Actions**.

### Bước 3: Chạy quy trình lần đầu

1. Vào https://github.com/Hung-Phongdautu/Kymontran/actions
2. Chọn **Đưa trang lên GitHub Pages** → **Run workflow** → **Run workflow**.
3. Đợi khoảng một đến hai phút cho tới khi hiện dấu xanh.

### Bước 4: Mở trang

Trang nằm tại https://hung-phongdautu.github.io/Kymontran/

### Kiểm tra khi có lỗi

- **Dấu đỏ ở quy trình "Đưa trang lên GitHub Pages"** ngay sau khi gộp mã: thường do chưa làm Bước 2. Bật Pages rồi chạy lại quy trình.
- **Dấu đỏ ở quy trình "Kiểm tra trang"**: bấm vào để đọc dòng `LỖI:`. Hai nguyên nhân hay gặp là quên chạy `python3 build.py` sau khi sửa nguồn, hoặc có liên kết trỏ tới mục không tồn tại.
- **Trang chưa đổi sau khi cập nhật**: tải lại bằng `Ctrl+Shift+R`.

## C. Cập nhật nội dung về sau

1. Sửa ở nguồn: `src/`, `assets/` hoặc `content/kien-thuc/*.md` (xem [README.md](README.md)).
2. Chạy `python3 build.py` rồi `python3 tests/check_site.py`.
3. Đẩy lên `main`. Trang trên mạng tự cập nhật sau một đến hai phút.

## Lưu ý

- Không đưa khóa API, mật khẩu hay dữ liệu khách hàng vào kho hoặc vào tài liệu hướng dẫn — kho công khai thì ai cũng đọc được (xem [SECURITY.md](SECURITY.md)).
- Dùng tên miền riêng: điền tên miền ở mục **Custom domain** trong trang cài đặt Pages và trỏ DNS theo hướng dẫn của GitHub.
- Trước mỗi lần công bố thay đổi lớn, rà [DEPLOYMENT-CHECKLIST.md](DEPLOYMENT-CHECKLIST.md).
