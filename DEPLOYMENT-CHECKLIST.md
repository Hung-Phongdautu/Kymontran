# Việc cần làm trước khi đưa trang lên mạng

- [ ] Chạy `python3 build.py` và `python3 tests/check_site.py`, cả hai đều đạt.
- [ ] Mở `index.html` trên máy tính và điện thoại; thử lập bàn, hai công cụ tra nhanh và phiếu đăng ký.
- [ ] Kiểm tra `CONTACT_EMAIL` trong `src/app.js` đúng là hộp thư đang dùng.
- [ ] Bảng giá trong `src/template.html` và trong `src/app.js` (biến `GOI`) khớp nhau.
- [ ] Không có khóa API, mật khẩu hay dữ liệu khách hàng trong kho (xem [SECURITY.md](SECURITY.md)).
- [ ] Lời nhắc "kết quả mang tính tham khảo" vẫn hiển thị ở trang Tra Cứu và FAQ (xem [RESPONSIBLE-USE.md](RESPONSIBLE-USE.md)).
- [ ] Ghi thay đổi vào [CHANGELOG.md](CHANGELOG.md).
- [ ] Nếu dùng GitHub Pages: bật Pages với nguồn "GitHub Actions" trong Settings, rồi chạy tay quy trình "Đưa trang lên GitHub Pages".
