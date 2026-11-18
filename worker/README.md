# Máy chủ trung gian luận giải bằng AI (OpenAI)

Trang web chạy trên GitHub Pages là trang tĩnh và kho mã công khai, nên **không được đặt khóa OpenAI trong trang**. Thư mục này chứa một hàm nhỏ chạy trên Cloudflare Workers (gói miễn phí): hàm giữ khóa của bạn, nhận bàn Kỳ Môn và câu hỏi từ trang, gọi OpenAI rồi trả về bốn phần luận giải.

```
Trình duyệt ──(bàn + câu hỏi)──▶ Cloudflare Worker ──(kèm khóa)──▶ OpenAI
            ◀──(4 phần luận giải)──                 ◀──────────────
```

Khi chưa cài đặt, trang vẫn chạy bình thường với phần luận giải soạn sẵn và nút "Luận giải bằng AI" không hiện.

## Cài đặt (làm một lần, không cần cài phần mềm)

### Bước 1: Lấy khóa OpenAI và đặt hạn mức chi tiêu

1. Vào https://platform.openai.com/api-keys và tạo một khóa mới dành riêng cho trang này.
2. Vào phần Billing → Limits của OpenAI và đặt hạn mức chi tiêu hằng tháng. Đây là lớp bảo vệ chính: mỗi lượt khách bấm nút đều tính tiền vào tài khoản của bạn.

### Bước 2: Tạo Worker

1. Đăng ký hoặc đăng nhập tại https://dash.cloudflare.com
2. Vào **Workers & Pages** → **Create** → **Create Worker**, đặt tên (ví dụ `kymontran-luan-giai`) rồi **Deploy**.
3. Bấm **Edit code**, xóa mã mẫu, dán toàn bộ nội dung tệp [`worker.js`](worker.js) vào rồi **Deploy**.

### Bước 3: Đặt khóa và cấu hình

Trong trang của Worker, vào **Settings** → **Variables and Secrets** và thêm:

| Tên | Loại | Giá trị |
| --- | --- | --- |
| `OPENAI_API_KEY` | **Secret** | khóa OpenAI ở Bước 1 |
| `ALLOWED_ORIGIN` | Text | `https://hung-phongdautu.github.io` |
| `OPENAI_MODEL` | Text (tùy chọn) | tên mô hình, mặc định `gpt-4o-mini` |
| `RATE_PER_MINUTE` | Text (tùy chọn) | số lượt mỗi phút cho một địa chỉ IP, mặc định `5` |

- `ALLOWED_ORIGIN` chỉ gồm phần `https://tên-miền`, không có đường dẫn phía sau. Nhiều nguồn thì cách nhau bằng dấu phẩy, ví dụ thêm `http://localhost:8000` để thử trên máy.
- Chọn đúng loại **Secret** cho khóa để Cloudflare không hiển thị lại giá trị.

### Bước 4: Nối trang với Worker

1. Sao chép địa chỉ của Worker (dạng `https://kymontran-luan-giai.<tên-bạn>.workers.dev`).
2. Mở `public/js/app.js`, tìm dòng `var AI_ENDPOINT='';` và dán địa chỉ vào giữa hai dấu nháy.
3. Chạy `python3 build.py`, kiểm tra bằng `npm test` (hoặc `python3 test/check_site.py`), rồi đẩy lên `main`.

Địa chỉ Worker không phải bí mật nên được phép nằm trong kho mã.

### Bước 5: Thử

Mở trang, vào Tra Cứu, lập trận ở chế độ Dự đoán rồi bấm **Luận giải bằng AI**. Bốn phần Hiện trạng — Dự đoán — Triển vọng — Kết luận sẽ được thay bằng bản do AI viết.

## Cách khác: triển khai bằng dòng lệnh

```bash
cd worker
npx wrangler deploy
npx wrangler secret put OPENAI_API_KEY   # dán khóa khi được hỏi
```

Các biến còn lại nằm trong [`wrangler.toml`](wrangler.toml).

## Những lớp bảo vệ đã có

- Khóa chỉ nằm trên Cloudflare; trang và kho mã không chứa khóa.
- Chỉ nhận yêu cầu từ nguồn khai báo trong `ALLOWED_ORIGIN`. Lớp này chặn trang web khác dùng nhờ, nhưng không chặn được người cố tình giả mạo bằng công cụ dòng lệnh.
- Giới hạn số lượt mỗi phút theo địa chỉ IP. Bộ đếm nằm trong bộ nhớ của Worker nên chỉ là lớp chặn nhẹ.
- Dữ liệu gửi lên bị kiểm tra chặt: lĩnh vực và chế độ phải thuộc danh sách của trang, câu hỏi tối đa 500 ký tự, bàn phải đủ chín cung. Lời nhắc cho AI nằm trên Worker nên người ngoài không biến được nó thành công cụ trò chuyện tự do.
- Mỗi câu trả lời bị giới hạn độ dài; lỗi từ OpenAI không được chuyển nguyên văn ra ngoài.

Vì hai lớp giữa không tuyệt đối, **hạn mức chi tiêu ở Bước 1 là bắt buộc**.

## Khi có lỗi

| Thông báo trên trang | Nguyên nhân thường gặp |
| --- | --- |
| Không kết nối được máy chủ luận giải | Sai `AI_ENDPOINT`, hoặc `ALLOWED_ORIGIN` không khớp địa chỉ trang |
| Máy chủ chưa được cấu hình khóa | Chưa thêm Secret `OPENAI_API_KEY` |
| Dịch vụ AI đang bận hoặc từ chối yêu cầu | Khóa sai, hết hạn mức, hoặc tên mô hình không tồn tại — xem **Logs** của Worker |
| Bạn gửi quá nhanh | Vượt `RATE_PER_MINUTE` |

## Kiểm thử

```bash
node --test test/worker.test.mjs
```

Bài kiểm thử thay OpenAI bằng bản giả nên không cần khóa và không tốn tiền.
