# Nhật ký thay đổi

## 2026-11-18

- Thêm `MO-TA-NOI-DUNG.md`: mô tả nội dung `index.html` theo từng trang, công cụ, dữ liệu tra và các điểm cần rà lại.

## 2026-11-16

- Thêm `server.py` để chạy thử trang trên máy.
- `build.py --site <thư mục>` ghi thư mục đưa lên mạng (trang chính, trang 404, `robots.txt`).
- Quy trình GitHub Pages tự chạy khi nhánh `main` thay đổi.
- Thêm hướng dẫn `KHOI-CHAY.md`.
- Thêm phần "Luận giải bằng AI" (tùy chọn): máy chủ trung gian `worker/` giữ khóa OpenAI, trang gọi qua `AI_ENDPOINT`. Mặc định tắt.
- `build.py --demo` ghi `demo.html`: bản chạy thử có nút AI trả về nội dung minh họa, không gọi dịch vụ nào.

## 2026-11-15

- Đưa trang Trận Pháp Kỳ Môn vào kho; ghi rõ bản quyền và nguồn tham khảo.
- Mọi nút và liên kết trở thành liên kết sâu `#/<trang>/<mục>?<tham số>`, dẫn tới nội dung có thật.
- Thêm trang Đăng Ký, bốn bước hướng dẫn sử dụng và chế độ Chọn ngày gợi ý ngày trong 10 ngày tới.
- Đổi giấy phép sang độc quyền (bảo lưu mọi quyền); đặt email nhận đăng ký.
- Tách trang thành các tệp nguồn (`src/`, `assets/`, `content/`) và dựng lại bằng `build.py`.
- Bài Kiến Thức viết bằng Markdown; thêm hai bài "Can Chi & Ngũ hành" và "Tam Kỳ – Lục Nghi".
- Thêm `tests/check_site.py` và kiểm tra tự động khi đẩy mã.
