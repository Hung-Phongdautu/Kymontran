# Nhật ký thay đổi

## 2026-11-19

- Quy đổi giờ như các trang lập bàn Kỳ Môn thường dùng:
  - Giờ giao tiết lấy từ bảng Thọ Tinh vạn niên lịch 1900 – 2100 (`src/tiet-khi.js`, chính xác tới phút), thay cho công thức sai số khoảng 15 phút. Ngoài khoảng năm đó vẫn dùng công thức.
  - Chọn nơi lập trận (11 thành phố Việt Nam và Bắc Kinh); giờ nhập là giờ đồng hồ tại nơi đó, kể cả múi giờ lịch sử.
  - Tùy chọn đổi Can Chi giờ theo giờ Mặt Trời thật (kinh độ và phương trình thời gian).
  - Tùy chọn đổi ngày lúc 23h (giờ Tý sớm) hoặc 0h (giờ Tý muộn).
  - Mục "Quy đổi giờ của bàn này" dưới bàn: giờ đồng hồ, UTC, giờ Bắc Kinh, giờ Mặt Trời trung bình và thật, giờ giao tiết hiện tại và kế tiếp.
- Thêm bài Kiến Thức "Quy đổi giờ khi lập trận" và câu hỏi FAQ "Nên dùng giờ đồng hồ hay giờ Mặt Trời thật?".

## 2026-11-18

- Viết lại bộ máy lập trận theo tài liệu "Quy trình lập trận Kỳ Môn Độn Giáp" 12 bước, tách riêng thành `src/kymon.js`:
  - Tứ trụ đủ năm, tháng, ngày, giờ; năm đổi ở Lập xuân, tháng đổi theo tiết, giờ Tý từ 23h tính sang ngày hôm sau.
  - Tiết khí tính theo vị trí Mặt Trời thay cho ngày cố định; Nguyên tính theo Phù đầu thay cho số ngày trong tiết.
  - Thêm Mã Tinh, Không Vong, Bát Thần Địa bàn (Ám thần), Ám Can; xử lý Thiên Cầm đi kèm Thiên Nhuế, Trung cung gửi Khôn 2, giờ Lục Giáp, Phục ngâm và Phản ngâm.
  - Sửa Can Chi ngày bị lệch (ví dụ 01/10/1949 trước ra Đinh Hợi, nay đúng là Giáp Tý).
- Dưới bàn có mục "Trình tự 12 bước" ghi kết quả từng bước; thêm hai tra cứu nhanh Phù đầu và Tuần thủ – Không Vong – Mã Tinh.
- Dụng thần dò đúng các ký hiệu ghi trong nhãn (Bệnh tật, Hôn nhân, Thất vật, Tài vận, Gia trạch, Học tập, Thể thao, Xuất hành). Chọn ngày bỏ qua ngày có cung Dụng thần gặp Không Vong.
- Thêm bài Kiến Thức "Quy trình 12 bước lập trận"; cập nhật bài Định cục và Cấu trúc bàn.
- Máy chủ trung gian AI nhận thêm Ám Can, Ám thần, Mã Tinh, Không Vong. Nếu đã dán `worker.js` lên Cloudflare, cần dán lại bản mới.
- Thêm `tests/test_kymon.mjs` vào kiểm tra tự động.
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
