# Bảo mật

## Không đưa vào kho

- Khóa API, mật khẩu, thông tin thanh toán.
- Dữ liệu thật của người dùng: họ tên, liên hệ, câu hỏi, phiếu đăng ký.
- Tài khoản quản trị và thông tin triển khai.

Khóa OpenAI chỉ được đặt ở phần Secrets của Cloudflare Worker (xem [worker/README.md](worker/README.md)), không đặt trong `lib/`, `public/`, `views/`, `index.html`, `wrangler.toml` hay tài liệu.

## Dữ liệu rời khỏi trình duyệt khi nào

- Lập bàn, tra cứu và luận giải soạn sẵn chạy hoàn toàn trên trình duyệt.
- Phiếu đăng ký chỉ được gửi khi người dùng tự bấm "Gửi qua email" trong ứng dụng thư của họ.
- Nếu "Luận giải bằng AI" được bật và người dùng bấm nút đó, bàn Kỳ Môn, lĩnh vực và câu hỏi của họ được gửi tới máy chủ trung gian rồi tới OpenAI. Máy chủ trung gian không lưu lại nội dung này.

## Báo lỗi bảo mật

Gửi mô tả lỗi và cách tái hiện tới `agencylehung@gmail.com`. Xin đừng công bố lỗi trước khi được phản hồi.
