# Việc cần làm trước khi đưa trang lên mạng

- [ ] Chạy `python3 build.py` rồi `npm test` (kiểm thử mô-đun, bảng tra `data/`, liên kết nội bộ), tất cả đều đạt.
- [ ] Mở `index.html` trên máy tính và điện thoại; thử lập bàn, hai công cụ tra nhanh và phiếu đăng ký.
- [ ] Kiểm tra `CONTACT_EMAIL` trong `public/js/dang-ky.js` đúng là hộp thư đang dùng.
- [ ] Bảng giá trong `views/index.html` và trong `public/js/dang-ky.js` (biến `GOI`) khớp nhau.
- [ ] Nếu bật AI: đã đặt hạn mức chi tiêu ở OpenAI, `ALLOWED_ORIGIN` khớp địa chỉ trang, và `node --test test/worker.test.mjs` đạt.
- [ ] Không có khóa API, mật khẩu hay dữ liệu khách hàng trong kho (xem [SECURITY.md](SECURITY.md)).
- [ ] Lời nhắc "kết quả mang tính tham khảo" vẫn hiển thị ở trang Tra Cứu và FAQ (xem [RESPONSIBLE-USE.md](RESPONSIBLE-USE.md)).
- [ ] Ghi thay đổi vào [CHANGELOG.md](CHANGELOG.md).
- [ ] Chạy `python3 server.py` và xem trang tại http://localhost:8000.
- [ ] Lần đầu dùng GitHub Pages: làm theo mục B trong [KHOI-CHAY.md](KHOI-CHAY.md).
