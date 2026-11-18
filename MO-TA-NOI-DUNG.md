# Mô tả nội dung website Trận Pháp Kỳ Môn

Tài liệu này mô tả toàn bộ nội dung của `index.html`: các trang, từng mục trong trang, nút bấm dẫn đi đâu, công cụ tính gì và dựa trên dữ liệu nào. Dùng khi cần rà soát nội dung, viết lại văn bản, thiết kế lại hoặc giao việc cho người khác.

`index.html` được dựng từ các tệp nguồn; muốn đổi nội dung thì sửa ở nguồn (xem mục 9) rồi chạy `python3 build.py`.

## 1. Tổng quan

| Hạng mục | Nội dung |
| --- | --- |
| Tên trang | Trận Pháp Kỳ Môn |
| Khẩu hiệu | Sơn thủy hữu tình · Lập trận · Định cục |
| Thông điệp chính | “Định cục trước, luận việc sau” |
| Mục đích | Học và thực hành Kỳ Môn Độn Giáp theo cổ pháp: lập bàn 9 cung theo giờ, tra Cục số, đổi giờ Ngũ Tý Độn, luận giải theo Dụng thần |
| Người dùng | Người mới học Kỳ Môn; người muốn xem một việc cụ thể hoặc chọn ngày |
| Ngôn ngữ | Tiếng Việt |
| Hình thức | Một tệp HTML duy nhất (khoảng 5,7 MB vì nhúng sẵn ảnh), chạy hoàn toàn trên trình duyệt, không cần máy chủ |
| Điều hướng | Bảy “trang” trong cùng một tệp, chuyển bằng địa chỉ `#/<trang>/<mục>?<tham số>` |
| Phí | Lập bàn và tra cứu miễn phí; luận giải chuyên sâu có bảng giá tham khảo, chưa mở thanh toán |
| Bản quyền | © 2026 Trận Pháp Kỳ Môn (Đỗ Lê), bảo lưu mọi quyền |

## 2. Nhận diện

- **Logo:** chữ ĐL viết thư pháp nằm trong vòng Thái cực âm dương, viền vàng. Xuất hiện ở thanh đầu trang, huy hiệu trên bàn 9 cung, dải tranh, trang Giới thiệu và chân trang.
- **Tranh sơn thủy:** núi non, mây và sông theo lối thủy mặc (ảnh tạo bằng AI). Dùng làm nền phần mở đầu, đầu mỗi trang con và các dải kêu gọi hành động.
- **Màu:** xanh ngọc thẫm làm màu chính, vàng đồng làm điểm nhấn, nền xanh nhạt ngả rêu. Tự chuyển sang giao diện tối theo cài đặt máy.
- **Chữ:** Noto Serif cho tiêu đề, Be Vietnam Pro cho nội dung.
- **Biểu tượng cát/hung:** nhãn CÁT (xanh), HUNG (đỏ gạch), TRUNG (vàng nhạt) trên từng cung.

## 3. Sơ đồ trang

| Địa chỉ | Tên trên thanh menu | Tiêu đề tab trình duyệt | Việc chính của trang |
| --- | --- | --- | --- |
| `#/home` | (logo) | Trận Pháp Kỳ Môn — Kỳ Môn Độn Giáp: Lập Trận & Tra Cứu Định Cục | Giới thiệu, dẫn vào công cụ |
| `#/tra-cuu` | Tra Cứu | Tra Cứu Kỳ Môn — Trận Pháp Kỳ Môn | Lập bàn, luận giải, tra nhanh |
| `#/huong-dan` | Hướng Dẫn | Hướng Dẫn Sử Dụng — Trận Pháp Kỳ Môn | Bốn bước sử dụng, 11 lĩnh vực |
| `#/bang-gia` | Bảng Giá | Bảng Giá — Trận Pháp Kỳ Môn | Ba mức sử dụng |
| `#/kien-thuc` | Kiến Thức | Kiến Thức Nền Kỳ Môn — Trận Pháp Kỳ Môn | Sáu bài học nền, bảng tra |
| `#/faq` | Giới Thiệu | Giới Thiệu & FAQ — Trận Pháp Kỳ Môn | Giới thiệu, hỏi đáp, bản quyền |
| `#/dang-ky` | (không có trên menu) | Đăng Ký Gói Dùng — Trận Pháp Kỳ Môn | Phiếu đăng ký quan tâm |

Địa chỉ không khớp trang nào sẽ đưa về trang chủ.

### Phần dùng chung trên mọi trang

- **Thanh đầu trang** (dính trên cùng khi cuộn): logo và tên trang → `#/home`; menu Tra Cứu, Hướng Dẫn, Bảng Giá, Kiến Thức, Giới Thiệu (mục đang mở được tô sáng); nút **Lập Bàn Miễn Phí** → `#/tra-cuu`.
- **Đầu trang con** (mọi trang trừ trang chủ): đường dẫn “Trang chủ / …”, tiêu đề lớn, một câu mô tả, nền tranh sơn thủy.
- **Chân trang:** logo, tên, câu giới thiệu, dòng © 2026 kèm liên kết Bản quyền; hàng liên kết Tra Cứu · Hướng Dẫn · Bảng Giá · Kiến Thức · FAQ · Bản quyền.

## 4. Chi tiết từng trang

### 4.1. Trang chủ (`#/home`)

1. **Phần mở đầu**
   - Nhãn nhỏ: “Học & thực hành theo cổ pháp Lưu Bá Ôn”.
   - Tiêu đề: “Kỳ Môn Độn Giáp — Định cục trước, luận việc sau.”
   - Đoạn dẫn: hệ thống tự đối chiếu giờ, tiết khí và Cục số; người dùng chỉ cần nhập thời gian và câu hỏi.
   - Nút **Tra cứu ngay →** → `#/tra-cuu`; nút **Tìm Hiểu Thêm** → `#/kien-thuc`.
2. **Bàn 9 cung minh họa** (bên phải phần mở đầu): chín ô Tốn 4, Ly 9, Khôn 2 / Chấn 3, Trung 5, Đoài 7 / Cấn 8, Khảm 1, Càn 6, mỗi ô có chữ Hán và tên cung. Bấm một ô → `#/tra-cuu/cong-cu?mode=lapban&cung=<số>`: lập bàn ngay và mở chi tiết đúng cung đó. Ghi chú bên dưới giải thích Cung Trung là Tâm bàn.
3. **Dải số liệu** (bốn ô bấm được):
   - 24 Tiết khí tra Cục số → `#/tra-cuu/cuc-so`
   - 9 cung Bàn Kỳ Môn Lạc Thư → `#/tra-cuu/cong-cu?mode=lapban`
   - 12 giờ Can Chi theo Ngũ Tý Độn → `#/tra-cuu/doi-gio`
   - 11 Lĩnh vực luận giải → `#/huong-dan/linh-vuc`
4. **Dải tranh sơn thủy** với chú thích “Sơn thủy hữu tình — an cục giữa núi sông” và câu “Sơn quản nhân đinh, thủy quản tài”.
5. **Tính Năng Nổi Bật** (ba thẻ):
   - Tra cứu Định cục → `#/tra-cuu/tra-nhanh`
   - Bàn Kỳ Môn đầy đủ 4 lớp → `#/tra-cuu/cong-cu?mode=lapban`
   - Luận giải & Dụng thần → `#/tra-cuu/cong-cu?mode=dudoan`
6. **Lối tắt** (bốn mục): Giới Thiệu → `#/faq/gioi-thieu`; Hướng Dẫn Sử Dụng → `#/huong-dan`; Câu Hỏi Thường Gặp → `#/faq/hoi-dap`; Bảng Giá & Gói Dùng → `#/bang-gia`.
7. **Kiến thức nền** (bốn mục, mỗi mục mở đúng bài): Kỳ Môn Độn Giáp là gì?; Định cục & Cục số; Một bàn Kỳ Môn gồm những gì; Ngũ Tý Độn đổi giờ.

### 4.2. Tra Cứu (`#/tra-cuu`)

**Mục Công cụ tra cứu** (`#/tra-cuu/cong-cu`)

- Ba nút chế độ: 🔮 Dự đoán · 📅 Chọn ngày · ☯ Lập bàn. Nút chính đổi chữ theo chế độ: “Lập trận & xem kết quả”, “Tìm ngày thuận”, “Lập bàn”.
- Ô nhập:
  - Thời gian lập trận (mặc định là lúc mở trang).
  - Lĩnh vực: một trong 11 lĩnh vực.
  - Câu hỏi: tối đa 500 ký tự, có bộ đếm.
- Kết quả hiện ra sau khi bấm nút chính:
  - Tiêu đề, ví dụ “Dự đoán · Kinh doanh — Âm độn 6 cục”, và dòng thời điểm, tiết khí, câu hỏi.
  - Bốn ô tóm tắt:
    - Tứ trụ: ngày, giờ, năm, tháng; ghi chú khi giờ từ 23h được tính sang ngày hôm sau.
    - Tiết khí · Cục: tên tiết, Âm/Dương và Cục số, Phù đầu, Tam nguyên, thời điểm giao tiết.
    - Trực Phù · Trực Sử: tuần thủ, cờ, cung của cờ, cung Trực Phù và Trực Sử bay tới.
    - Mã Tinh · Không Vong: cung và chi của Mã Tinh, Không Vong; ghi rõ khi là giờ Lục Giáp, Phục ngâm hoặc Phản ngâm.
  - **Bàn đầy đủ 9 cung.** Mỗi ô ghi:
    - Bát Thần, nhãn CÁT/HUNG/TRUNG, tên cung và hướng;
    - Cửu Tinh (ô có Thiên Nhuế ghi kèm Thiên Cầm) và Bát Môn;
    - Thiên Can (ô có Thiên Nhuế mang hai can), Địa Can, Ám Can, Ám thần;
    - nhãn Trực Phù, Trực Sử, Mã, KV.

    Cung Dụng thần có viền đậm. Bấm ô nào thì ô “Chi tiết cung” bên dưới giải thích ô đó, kể cả ý nghĩa của Ám Can là Tam Kỳ hoặc Canh, Tân, của Mã Tinh và Không Vong.
  - Chú giải ký hiệu.
  - **Trình tự 12 bước của bàn này** (mục mở/đóng): kết quả từng bước của quy trình, từ Tứ trụ tới Ám Can.
  - Theo chế độ:

| Phần kết quả | Dự đoán | Chọn ngày | Lập bàn |
| --- | --- | --- | --- |
| Bàn 9 cung, chi tiết cung | có | có | có |
| Ngày gợi ý (10 ngày tới) | — | có | — |
| Hiện trạng · Dự đoán · Triển vọng · Kết luận | có | có | — |
| Luận giải sâu bằng AI | có (khi đã bật) | có (khi đã bật) | — |
| Dụng thần & cách cục · Đọc bàn nhanh | có | có | có |

- Ghi chú cuối kết quả: bàn an theo lối Chuyển bàn, đúng 12 bước; tiết khí theo vị trí Mặt Trời, Nguyên theo Phù đầu, giờ Tý từ 23h tính sang ngày hôm sau, thời gian theo múi giờ của máy; chưa áp dụng phép Đặt nhuận.

**Mục Tra cứu nhanh — Định cục** (`#/tra-cuu/tra-nhanh`)

- **A · Đổi giờ — Ngũ Tý Độn** (`#/tra-cuu/doi-gio`): chọn Thiên can ngày và một trong 12 giờ → ra Can Chi giờ, kèm lời giải theo ca quyết. Mặc định giờ Thân.
- **B · Tra Cục số — Tiết khí & Nguyên** (`#/tra-cuu/cuc-so`): chọn một trong 24 tiết khí và Thượng/Trung/Hạ nguyên → ra Âm/Dương độn và Cục số, kèm ba số của tiết đó.
- **C · Phù đầu & Tam nguyên** (`#/tra-cuu/phu-dau`): chọn một trong 60 Can Chi ngày → số ngày phải lùi, Phù đầu, nhóm chi và Nguyên.
- **D · Tuần thủ, Cờ, Không Vong, Mã Tinh** (`#/tra-cuu/tuan-thu`): chọn một trong 60 Can Chi giờ → tuần thủ, cờ, hai chi và cung Không Vong, chi và cung Mã Tinh. Mặc định giờ Canh Ngọ.

**Tham số địa chỉ của trang này**

| Tham số | Giá trị | Tác dụng |
| --- | --- | --- |
| `mode` | `dudoan`, `chonngay`, `lapban` | Chọn sẵn chế độ |
| `linhvuc` | tên lĩnh vực, ví dụ `Công danh` | Chọn sẵn lĩnh vực |
| `cung` | 1–9 | Lập bàn ngay và mở chi tiết cung đó |

### 4.3. Hướng Dẫn (`#/huong-dan`)

- **Bắt đầu sử dụng:** đoạn tóm tắt cách dùng (một việc, một quẻ, tối đa 500 ký tự; kết quả 4 phần).
- **Bốn bước** (`#/huong-dan/cac-buoc`), mỗi bước bấm được:
  1. Chọn chế độ → `#/tra-cuu/cong-cu?mode=dudoan`
  2. Nhập thời gian → `#/tra-cuu/cong-cu`
  3. Chọn lĩnh vực & viết câu hỏi → `#/huong-dan/linh-vuc`
  4. Đọc bàn & kết quả → `#/kien-thuc/cau-truc-ban`
- **11 lĩnh vực luận giải** (`#/huong-dan/linh-vuc`): mỗi lĩnh vực một thẻ (xem bảng ở mục 5.2). Bấm thẻ → `#/tra-cuu/cong-cu?linhvuc=<tên>`.
- Dải kêu gọi: “Sẵn sàng lập quẻ đầu tiên?” → **Mở trang Tra Cứu →**.

### 4.4. Bảng Giá (`#/bang-gia`)

Mục Ba mức sử dụng (`#/bang-gia/cac-goi`):

| Gói | Giá | Quyền lợi | Nút → đích |
| --- | --- | --- | --- |
| Theo quẻ | 49.000₫ / quẻ | Luận giải 4 phần đầy đủ; chọn 1 trong 11 lĩnh vực; lưu lại nội dung quẻ | Bắt đầu với 1 quẻ → `#/tra-cuu/cong-cu?mode=dudoan` |
| Gói tháng (nhãn PHỔ BIẾN) | 199.000₫ / tháng | Không giới hạn lập bàn & tra cứu; 30 quẻ luận giải / tháng; chọn ngày cho nhiều việc; ưu tiên hỗ trợ | Chọn gói tháng → `#/dang-ky?goi=thang` |
| Hiệu đính chuyên gia | 490.000₫ / quẻ | Chuyên gia hiệu đính thủ công; kiểm tra lại định cục & Dụng thần; nhận xét bổ sung riêng | Tìm hiểu thêm → `#/dang-ky?goi=chuyen-gia` |

Ghi chú dưới bảng: giá là mức tham khảo, thanh toán chỉ mở khi dịch vụ chính thức; có liên kết tới phiếu đăng ký và câu hỏi về chi phí.

### 4.5. Kiến Thức (`#/kien-thuc`)

1. **Ba thẻ dẫn bài:** Kỳ Môn Độn Giáp là gì?; Một bàn Kỳ Môn gồm những gì?; Định cục & Cục số. Mỗi thẻ cuộn tới bài tương ứng.
2. **Bảy bài viết** theo thứ tự học, mỗi bài có địa chỉ riêng `#/kien-thuc/<id>` và nút dẫn tiếp ở cuối:

| # | Bài | Địa chỉ | Nội dung chính | Nút dẫn tiếp |
| --- | --- | --- | --- | --- |
| 1 | Kỳ Môn Độn Giáp là gì? | `ky-mon-la-gi` | Tam thức; nghĩa của Kỳ, Môn, Độn Giáp; 1.080 cục rút còn 18 cục | Cấu trúc bàn; Can Chi & Ngũ hành; Về Trận Pháp Kỳ Môn |
| 2 | Can Chi & Ngũ hành | `can-chi-ngu-hanh` | Hành của 10 Can, 12 Chi; tương sinh, tương khắc; Lục thập hoa giáp và sáu tuần Giáp | Tam Kỳ – Lục Nghi; Ngũ Tý Độn |
| 3 | Một bàn Kỳ Môn gồm những gì? | `cau-truc-ban` | Chín cung Lạc Thư; bốn tầng Địa, Thiên, Nhân, Thần bàn; bốn ký hiệu phụ Mã Tinh, Không Vong, Ám thần, Ám Can; cách đọc bàn | Lập bàn đầy đủ; Quy trình 12 bước; Bảng Cửu Tinh · Bát Môn |
| 4 | Tam Kỳ – Lục Nghi | `tam-ky-luc-nghi` | Thứ tự an 9 Can; Nhật, Nguyệt, Tinh Kỳ; Giáp ẩn dưới Nghi nào; ví dụ Dương độn 1 cục | Xem Địa bàn; Định cục & Cục số |
| 5 | Định cục & Cục số | `dinh-cuc` | Bốn bước đổi giờ, tiết khí, Nguyên theo Phù đầu, Cục số; Chính thụ, Siêu thần, Tiếp khí, Đặt nhuận | Tìm Phù đầu; Tra Cục số; Hỏi đáp Siêu thần |
| 6 | Ngũ Tý Độn | `ngu-ty-don` | Khung ca quyết sáu câu và lời giải; ví dụ ngày Giáp giờ Thân là Nhâm Thân | Đổi giờ bằng công cụ |
| 7 | Quy trình 12 bước lập trận | `quy-trinh-12-buoc` | Tóm tắt từng bước từ Tứ trụ tới Ám Can; ví dụ Dương độn 3 cục giờ Canh Ngọ | Lập bàn và xem 12 bước; Tìm Phù đầu; Tra Tuần thủ |

3. **Hai bảng tra** (`#/kien-thuc/bang-tra`): Cửu Tinh (tính chất, chủ về) và Bát Môn / Bát Thần (tính chất, chủ về), kèm ghi chú không đọc riêng lẻ một yếu tố.
4. Dải kêu gọi: “Thực hành định cục ngay” → `#/tra-cuu/tra-nhanh`.

### 4.6. Giới Thiệu & FAQ (`#/faq`)

- **Về Trận Pháp Kỳ Môn** (`#/faq/gioi-thieu`): giới thiệu trang, ý nghĩa logo, phần định cục do trang tự biên soạn; liên kết tới Tra Cứu, Hướng Dẫn, Bản quyền.
- **Câu hỏi thường gặp** (`#/faq/hoi-dap`), sáu câu dạng mở/đóng:
  1. Vì sao phải định cục trước khi luận quẻ? (mặc định mở)
  2. Ngũ Tý Độn dùng để làm gì?
  3. Dương độn và Âm độn khác nhau thế nào?
  4. Siêu thần, Tiếp khí, Chính thụ là gì?
  5. Lập bàn và tra cứu định cục có mất phí không? (`#/faq/hoi-phi`, tự mở khi được dẫn tới)
  6. Kết quả luận giải có phải quyết định thay cho tôi không?
- **Bản quyền & nguồn tham khảo** (`#/faq/ban-quyen`):
  - © 2026 và tuyên bố bảo lưu mọi quyền, kèm email xin phép.
  - Tri thức cổ pháp thuộc phạm vi công cộng.
  - Hai kho mã tham khảo, chỉ xem, không sao chép.
  - Phần AI dùng OpenAI.
  - Phông chữ theo giấy phép OFL; logo và tranh do chủ trang cung cấp.
- Dải kêu gọi: “Còn thắc mắc khi lập trận?” → **Mở trang Tra Cứu →**.

### 4.7. Đăng Ký (`#/dang-ky`)

- Vào từ nút “Chọn gói tháng”, “Tìm hiểu thêm” ở Bảng Giá, hoặc liên kết trong ghi chú giá. Tham số `goi` (`que`, `thang`, `chuyen-gia`) chọn sẵn gói và đổi câu mô tả theo gói.
- **Phiếu:** Gói quan tâm, Họ tên (bắt buộc), Cách liên hệ (bắt buộc), Việc cần xem / ghi chú (tối đa 500 ký tự).
- Bấm **Tạo phiếu đăng ký** → hiện phiếu dạng chữ (gói, họ tên, liên hệ, ghi chú, ngày lập) cùng hai nút:
  - **Sao chép phiếu**.
  - **Gửi qua email**: mở ứng dụng thư của người dùng với thư điền sẵn gửi tới agencylehung@gmail.com.
- Trang không tự gửi dữ liệu; người dùng phải tự bấm gửi trong ứng dụng thư.
- Dải kêu gọi: “Chưa cần gói trả phí?” → **Mở trang Tra Cứu →**.

## 5. Công cụ và cách tính

### 5.1. Lập bàn

Bàn được lập theo giờ (Thời gia Kỳ Môn), lối Chuyển bàn, đúng 12 bước của tài liệu “Quy trình lập trận Kỳ Môn Độn Giáp”. Mã nằm trong `src/kymon.js`, mỗi bước một đoạn.

1. **Đổi giờ, tiết khí:**
   - Lập Tứ trụ. Ngày Can Chi tính theo số ngày Julius (01/10/1949 là Giáp Tý). Giờ Tý từ 23h tính sang ngày hôm sau. Can giờ theo Ngũ Tý Độn.
   - Tháng đổi theo các “tiết” (Lập xuân mở tháng Dần…), Can tháng theo Ngũ Hổ Độn. Năm đổi ở Lập xuân.
   - Tiết khí xác định theo kinh độ Mặt Trời tại thời điểm lập trận (công thức Meeus, sai số khoảng 15 phút).
2. **Phù đầu, Tam nguyên:** lùi Can Chi ngày về ngày Giáp hoặc Kỷ; chi của Phù đầu thuộc Tứ Chính, Tứ Sinh hay Tứ Mộ cho Thượng, Trung hay Hạ nguyên; tra bảng 5.4 ra Cục số.
3. **Địa bàn:** Mậu khởi tại cung bằng Cục số, an tiếp Kỷ, Canh, Tân, Nhâm, Quý, Đinh, Bính, Ất; Dương độn thuận, Âm độn nghịch số Cửu Cung.
4. **Tuần thủ, Cờ:** lùi Can Chi giờ về can Giáp; Giáp Tý cờ Mậu, Giáp Tuất cờ Kỷ, Giáp Thân cờ Canh, Giáp Ngọ cờ Tân, Giáp Thìn cờ Nhâm, Giáp Dần cờ Quý.
5. **Đại Trực Phù, Trực Sử:** sao gốc và cửa gốc của cung có Cờ. Cờ ở Trung cung thì lấy Thiên Cầm và Tử Môn, gửi Khôn 2.
6. **Thiên bàn:** Đại Trực Phù cùng Cờ bay tới cung của Can giờ (giờ Giáp lấy cung của Cờ; cung 5 gửi Khôn 2). Các sao và Can Thiên bàn xoay thuận kim đồng hồ quanh 8 cung, cả Âm lẫn Dương độn. Thiên Cầm và can Trung cung đi cùng Thiên Nhuế.
7. **Nhân bàn:** từ cung của Cờ đếm từ Giáp tới Can giờ theo số Cửu Cung (Dương thuận, Âm nghịch). Dừng ở đâu đặt Trực Sử ở đó (cung 5 mượn Khôn 2), các cửa còn lại xoay thuận kim đồng hồ.
8. **Bát Thần Thiên bàn:** thần Trực Phù đóng cùng Đại Trực Phù; Dương độn an thuận, Âm độn an nghịch kim đồng hồ.
9. **Mã Tinh:** theo Tam Hợp của chi giờ, đóng ở Cấn 8, Tốn 4, Khôn 2 hoặc Càn 6.
10. **Không Vong:** hai chi thiếu Can trong tuần của giờ, quy về một hoặc hai cung.
11. **Bát Thần Địa bàn:**
    - Giờ Lục Giáp, Phục ngâm hoặc Phản ngâm toàn trận (Thiên bàn không dịch, hoặc dịch đúng nửa vòng): an trùng Bát Thần Thiên bàn.
    - Giờ thường: khởi Trực Phù tại cung gốc của Đại Trực Phù, cùng chiều với Bát Thần Thiên bàn.
12. **Ám Can:**
    - Trường hợp đặc biệt như trên: Can giờ (giờ Giáp lấy can của Cờ) nhập Trung cung 5.
    - Giờ thường: Can giờ khởi tại cung Trực Sử.
    - Từ cung khởi, phi qua 9 cung theo số Cửu Cung (Dương thuận, Âm nghịch), an theo thứ tự Lục Nghi – Tam Kỳ.

Vị trí gốc của Cửu Tinh và Bát Môn trên chín cung:

| Cung | Hướng · Hành | Sao gốc | Môn gốc |
| --- | --- | --- | --- |
| 1 Khảm | Bắc · Thủy | Thiên Bồng | Hưu Môn |
| 2 Khôn | Tây Nam · Thổ | Thiên Nhuế | Tử Môn |
| 3 Chấn | Đông · Mộc | Thiên Xung | Thương Môn |
| 4 Tốn | Đông Nam · Mộc | Thiên Phụ | Đỗ Môn |
| 5 Trung | Trung tâm · Thổ | Thiên Cầm | — |
| 6 Càn | Tây Bắc · Kim | Thiên Tâm | Khai Môn |
| 7 Đoài | Tây · Kim | Thiên Trụ | Kinh Môn |
| 8 Cấn | Đông Bắc · Thổ | Thiên Nhậm | Sinh Môn |
| 9 Ly | Nam · Hỏa | Thiên Anh | Cảnh Môn |

Nhãn cát/hung của cung lấy theo Môn: Khai, Hưu, Sinh là CÁT; Thương, Tử, Kinh là HUNG; Đỗ, Cảnh và cung Trung là TRUNG.

### 5.2. Dụng thần theo lĩnh vực

Trang dò lần lượt từng ký hiệu theo thứ tự ghi trong bảng; cung đầu tiên (trừ Trung cung) có ký hiệu đó là cung Dụng thần. Thứ tự dò trùng với thứ tự ghi trong nhãn hiển thị.

| Lĩnh vực | Mô tả trên thẻ | Thứ tự dò | Nhãn hiển thị |
| --- | --- | --- | --- |
| Kinh doanh | Ký kết, mở bán, đối tác & dòng tiền | Môn Sinh Môn → Tinh Thiên Tâm | Sinh Môn + Thiên Tâm (tài lộc, điều hành) |
| Bệnh tật | Sức khỏe, thời điểm thăm khám & hồi phục | Tinh Thiên Nhuế → Tinh Thiên Tâm | Thiên Nhuế (bệnh trạng) + Thiên Tâm (thầy thuốc) |
| Hôn nhân | Tình cảm, cưới hỏi, hòa hợp đôi lứa | Thần Lục Hợp → Môn Hưu Môn | Lục Hợp + Hưu Môn (hòa hợp đôi lứa) |
| Công danh | Thi cử quan lộc, thăng tiến, bổ nhiệm | Môn Khai Môn → Tinh Thiên Phụ | Khai Môn + Thiên Phụ (văn thư, bổ nhiệm) |
| Tài vận | Đầu tư, vay mượn, thu hồi nợ | Môn Sinh Môn → Tinh Thiên Tâm | Sinh Môn (tài lộc) + Thiên Tâm (người quản tài) |
| Gia trạch | Nhà đất, xây sửa, an cư | Tinh Thiên Nhậm → Môn Sinh Môn | Thiên Nhậm + Sinh Môn (đất đai, an cư) |
| Pháp lý | Kiện tụng, hợp đồng, tranh chấp | Môn Khai Môn → Tinh Thiên Tâm | Khai Môn + Thiên Tâm (phán quyết, người cầm cân) |
| Thất vật | Tìm đồ mất, giấy tờ thất lạc | Thần Huyền Vũ → Tinh Thiên Bồng | Huyền Vũ + Thiên Bồng (vật mất, hướng tìm) |
| Xuất hành | Đi xa, chuyển việc, khai trương | Môn Khai Môn → Tinh Thiên Xung | Khai Môn + Thiên Xung (xuất hành, khai trương) |
| Học tập | Học hành, thi cử, chọn trường | Tinh Thiên Phụ → Môn Cảnh Môn | Thiên Phụ + Cảnh Môn (học hành, thi cử) |
| Thể thao | Thi đấu, phong độ, kết quả trận đấu | Tinh Thiên Xung → Môn Thương Môn | Thiên Xung + Thương Môn (thi đấu, tốc độ) |

### 5.3. Luận giải

- **Hiện trạng · Dự đoán · Triển vọng · Kết luận:** mỗi phần có ba câu soạn sẵn. Câu được chọn theo nhãn của Môn tại cung Dụng thần (cát, trung hoặc hung). Câu hỏi của người dùng chỉ được nhắc lại, không làm đổi nội dung.
- **Dụng thần & cách cục:**
  - Cung Dụng thần rơi vào đâu, tìm theo ký hiệu nào.
  - Cung đó có Tinh, Môn, Thần, Thiên Can, Địa Can, Ám Can gì; Môn cát hay hung.
  - Cung có gặp Tam Kỳ (Ất, Bính, Đinh), Mã Tinh hoặc Không Vong không.
- **Đọc bàn nhanh:**
  - Số cung Môn cát và Môn hung.
  - Hướng của Đại Trực Phù và Trực Sử, hướng của Mã Tinh và Không Vong.
  - Ghi rõ khi bàn là giờ Lục Giáp, Phục ngâm hoặc Phản ngâm.
- **Chọn ngày:** xét 10 ngày tới cùng khung giờ. Bỏ ngày có cung Dụng thần gặp Không Vong; giữ ngày mà cung Dụng thần có ít nhất hai trong ba dấu hiệu:
  - Tam Kỳ;
  - Thần cát: Trực Phù, Thái Âm, Lục Hợp, Cửu Địa, Cửu Thiên;
  - Tinh cát: Thiên Phụ, Thiên Tâm, Thiên Nhậm, Thiên Xung, Thiên Cầm.

  Mỗi ngày là một nút; bấm vào thì lập lại bàn cho đúng ngày đó. Đây là quy tắc rút gọn do trang đặt ra.
- **Luận giải sâu bằng AI** (tắt cho tới khi có địa chỉ máy chủ trung gian):
  - Gửi bàn, lĩnh vực và câu hỏi tới máy chủ trung gian, máy chủ gọi OpenAI và trả về bốn phần thay cho bản soạn sẵn.
  - Cạnh nút có ghi rõ dữ liệu sẽ được gửi đi.
  - Lỗi thì giữ nguyên bản soạn sẵn và báo lý do.
  - Bản `demo.html` cho nút này trả về nội dung minh họa có nhãn “[Minh họa]”, không gửi gì đi.

### 5.4. Bảng Cục số dùng trong trang

Ba số là Cục của Thượng – Trung – Hạ nguyên.

| Dương độn | Cục | Âm độn | Cục |
| --- | --- | --- | --- |
| Đông chí | 1 – 7 – 4 | Hạ chí | 9 – 3 – 6 |
| Tiểu hàn | 2 – 8 – 5 | Tiểu thử | 8 – 2 – 5 |
| Đại hàn | 3 – 9 – 6 | Đại thử | 7 – 1 – 4 |
| Lập xuân | 8 – 5 – 2 | Lập thu | 2 – 5 – 8 |
| Vũ thủy | 9 – 6 – 3 | Xử thử | 1 – 4 – 7 |
| Kinh trập | 1 – 7 – 4 | Bạch lộ | 9 – 3 – 6 |
| Xuân phân | 3 – 9 – 6 | Thu phân | 7 – 1 – 4 |
| Thanh minh | 4 – 1 – 7 | Hàn lộ | 6 – 9 – 3 |
| Cốc vũ | 5 – 2 – 8 | Sương giáng | 5 – 8 – 2 |
| Lập hạ | 4 – 1 – 7 | Lập đông | 6 – 9 – 3 |
| Tiểu mãn | 5 – 2 – 8 | Tiểu tuyết | 5 – 8 – 2 |
| Mang chủng | 6 – 3 – 9 | Đại tuyết | 4 – 7 – 1 |

### 5.5. Ngũ Tý Độn

| Can ngày | Giáp, Kỷ | Ất, Canh | Bính, Tân | Đinh, Nhâm | Mậu, Quý |
| --- | --- | --- | --- | --- | --- |
| Giờ Tý khởi từ | Giáp Tý | Bính Tý | Mậu Tý | Canh Tý | Nhâm Tý |

Từ giờ Tý đếm thuận Thiên can ra 11 giờ còn lại (Sửu 1–3h, Dần 3–5h, … Hợi 21–23h; giờ Tý 23–1h).

## 6. Độ chính xác và giới hạn

Các điểm sau được ghi ngay trên trang (ghi chú dưới kết quả và trong bài Định cục):

- Tiết khí tính theo vị trí Mặt Trời với sai số khoảng 15 phút: bàn lập trong khoảng 15 phút quanh lúc giao tiết có thể rơi nhầm sang tiết bên cạnh.
- Thời gian lấy theo múi giờ của máy người dùng; Can Chi ngày đổi lúc 23h (đầu giờ Tý).
- Nguyên tính theo Phù đầu của ngày (đúng Bước 2) nhưng chưa áp dụng phép Đặt nhuận khi Siêu thần quá 9 ngày.
- Phần luận giải soạn sẵn chỉ có ba mức theo Môn tại cung Dụng thần.

Bộ máy được kiểm thử bằng chính các ví dụ trong tài liệu 12 bước (`tests/test_kymon.mjs`). Tài liệu có một chỗ tự mâu thuẫn ở ví dụ 2 của Bước 6 (Dương độn 1 cục, giờ Tân Mão):

- Tài liệu ghi Thiên Trụ mang can Quý và Thiên Tâm mang can Đinh.
- Theo nguyên tắc “can đi theo sao” của chính bước đó, Thiên Trụ (gốc Đoài 7, can Đinh) mang Đinh, Thiên Tâm (gốc Càn 6, can Quý) mang Quý.

Trang làm theo nguyên tắc.

## 7. Dữ liệu người dùng

- Lập bàn, tra cứu, luận giải soạn sẵn và chọn ngày chạy hoàn toàn trên trình duyệt; không có gì được gửi đi hay lưu lại.
- Phiếu đăng ký chỉ rời trình duyệt khi người dùng tự bấm “Gửi qua email” trong ứng dụng thư của họ.
- Khi phần AI được bật và người dùng bấm nút, bàn, lĩnh vực và câu hỏi được gửi tới máy chủ trung gian rồi tới OpenAI.
- Trang chỉ tải thêm phông chữ từ Google Fonts; không có mã theo dõi hay quảng cáo.

## 8. Điểm cần rà lại trong nội dung

- **Gói “Theo quẻ” ghi quyền lợi “Lưu lại nội dung quẻ”**, nhưng trang chưa có chức năng lưu quẻ.
- **Bảng giá và quyền lợi các gói chưa có thật:** thanh toán chưa mở, “30 quẻ / tháng” và “Ưu tiên hỗ trợ” chưa có cơ chế. Trang đã ghi rõ đây là mức tham khảo.

Hai lỗi ghi ở bản trước đã được sửa khi viết lại bộ máy:

- Nhãn Dụng thần nay khớp với cách dò cung.
- Ngày 1–4 tháng 1 không còn bị ép về Thượng nguyên, vì Nguyên nay tính theo Phù đầu.

## 9. Sửa nội dung ở đâu

| Muốn sửa | Tệp |
| --- | --- |
| Chữ trên các trang, bảng giá, FAQ, bảng tra, phiếu đăng ký | `src/template.html` |
| Bảy bài Kiến Thức (thêm, bớt, đổi thứ tự) | `content/kien-thuc/*.md` (cách viết: [README.md](README.md)) |
| Màu, chữ, bố cục | `src/styles.css` |
| Cách lập bàn 12 bước, lịch Can Chi, tiết khí | `src/kymon.js` (kiểm thử: `node tests/test_kymon.mjs`) |
| Dụng thần, câu luận giải soạn sẵn, quy tắc chọn ngày, giá trong phiếu, email nhận phiếu, địa chỉ AI | `src/app.js` |
| Logo, tranh sơn thủy | `assets/` |
| Lời nhắc và giới hạn của phần AI | `worker/worker.js` |

Sau khi sửa: `python3 build.py`, `python3 tests/check_site.py` và `node tests/test_kymon.mjs`.
