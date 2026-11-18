# Trận Pháp Kỳ Môn (Kymontran)

Trang học và thực hành Kỳ Môn Độn Giáp: lập bàn 9 cung, tra Cục số theo tiết khí, đổi giờ Ngũ Tý Độn và luận giải theo Dụng thần. Sự phối hợp giữa hai dòng Đỗ – Lê.

Toàn bộ trang là một tệp `index.html` chạy thẳng trên trình duyệt, không cần máy chủ. Tệp đó được dựng tự động từ các tệp nguồn bên dưới.

## Cấu trúc kho mã

Bố cục chia theo vai trò, giống các dự án lập bàn Kỳ Môn mã nguồn mở: `lib/` tính toán, `views/` khung trang, `public/` giao diện, `test/` kiểm thử theo mô-đun.

```
docs/                     Phương pháp
  quy-trinh-lap-tran.md     tài liệu "Quy trình lập trận Kỳ Môn Độn Giáp" 12 bước (gốc của mọi tính toán)
  giay-phep-thanh-phan.md   giấy phép của từng thành phần và các kho đã tham khảo
lib/                      Bộ máy lập trận — mỗi bước một mô-đun, dùng được riêng
  km.js                     không gian tên chung KM
  cong-cu.js                hàm dùng chung (Can Chi 60, phi Cửu Cung, gửi Trung cung)
  bang-tra.js               thư viện tra cứu của quy trình (Cục số, Phù đầu, Tuần thủ – Cờ, bản cung gốc, Bát Thần, Mã Tinh…)
  tiet-khi-bang.js          bảng giờ giao tiết 1900 – 2100 (tạo tự động, không sửa tay)
  lich.js                   lịch: tiết khí, kinh độ Mặt Trời, phương trình thời gian, múi giờ
  b01-tu-tru.js             Bước 1  Tứ trụ, Ngũ Tý Độn, tiết khí, quy đổi giờ
  b02-phu-dau.js            Bước 2  Phù đầu, Tam nguyên, Cục số
  b03-dia-ban.js            Bước 3  Địa bàn (Lục Nghi, Tam Kỳ)
  b04-tuan-thu.js           Bước 4  Tuần thủ và Cờ
  b05-truc-phu-su.js        Bước 5  Đại Trực Phù và Trực Sử
  b06-thien-ban.js          Bước 6  Thiên bàn (Cửu Tinh, Can Thiên bàn)
  b07-nhan-ban.js           Bước 7  Nhân bàn (Bát Môn)
  b08-than-ban.js           Bước 8  Thần bàn (Bát Thần)
  b09-ma-tinh.js            Bước 9  Mã Tinh
  b10-khong-vong.js         Bước 10 Không Vong
  b11-than-dia-ban.js       Bước 11 Bát Thần Địa bàn (Ám thần)
  b12-am-can.js             Bước 12 Ám Can
  trinh-tu.js               diễn giải kết quả từng bước bằng lời
  kymon.js                  điều phối 12 bước (KyMon.lapTran, KyMon.anBan)
data/                     Bảng tra dạng CSV (mở bằng Excel), xuất từ lib/ bằng tools/xuat_bang_tra.mjs
views/index.html          Khung trang và nội dung các trang con
public/css/style.css      Giao diện
public/js/app.js          Định tuyến, công cụ lập trận tổng hợp, hiển thị bàn, luận giải, quy đổi giờ
public/js/mo-dun.js       Bàn làm việc 12 mô-đun (mỗi thẻ gọi một mô-đun của lib/)
public/js/dang-ky.js      Phiếu đăng ký
public/js/khoi-dong.js    Mở trang đầu tiên khi mọi tệp đã nạp
public/img/               Logo ĐL và tranh sơn thủy (được nhúng thẳng vào trang)
content/kien-thuc/*.md    Bài viết của trang Kiến Thức
test/                     Kiểm thử: quy trình 12 bước, từng mô-đun, bảng tra, máy chủ trung gian, liên kết nội bộ
tools/                    Tạo bảng giờ giao tiết (sxtwl) và xuất bảng tra CSV
worker/                   Máy chủ trung gian (Cloudflare Workers) giữ khóa OpenAI — tùy chọn
build.py, server.py       Dựng index.html; chạy thử tại http://localhost:8000
index.html                Trang hoàn chỉnh — sản phẩm dựng ra, không sửa tay
```

### Cách các phần liên kết với nhau

- Mỗi tệp trong `lib/` gắn phần của mình vào không gian tên `KM` (ví dụ `KM.B6.tinh(...)`). Trong Node mỗi tệp tự `require` các tệp nó cần; trong trình duyệt `build.py` ghép các tệp theo thứ tự ở danh sách `LIB`.
- `lib/kymon.js` gọi lần lượt `KM.B1` → `KM.B12` để lập một bàn trọn vẹn; trang dùng nó qua biến `KyMon`.
- Mỗi thẻ ở mục **Mười hai mô-đun lập trận** (trang Tra Cứu) đọc ô nhập của chính nó rồi gọi đúng mô-đun của bước đó, nên dùng được độc lập.
- Bảng tra trong `data/` được xuất từ `lib/bang-tra.js`; kiểm thử báo lỗi nếu hai nơi không khớp.

## Cách làm việc

Chỉ cần Python 3 và Node.js 18 trở lên, không cài thêm gói nào.

```bash
npm start                      # = python3 server.py — dựng lại và chạy thử tại http://localhost:8000
npm run build                  # = python3 build.py — dựng lại index.html sau khi sửa nguồn
npm test                       # kiểm thử mô-đun, bảng tra, máy chủ trung gian và liên kết nội bộ
npm run bang-tra               # xuất lại data/*.csv sau khi sửa lib/bang-tra.js
npm run demo                   # ghi demo.html: bản chạy thử, nút AI trả về nội dung minh họa
```

Hướng dẫn chạy trên máy, để kho riêng tư và đưa lên mạng khi cần: [KHOI-CHAY.md](KHOI-CHAY.md).

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

Chạy `npm run build` rồi `npm test`.

## Địa chỉ trong trang

Mọi nút và liên kết dùng dạng `#/<trang>/<mục>?<tham số>`:

- `<trang>`: `home`, `tra-cuu`, `huong-dan`, `bang-gia`, `kien-thuc`, `faq`, `dang-ky`.
- `<mục>`: cuộn tới phần tử có `id="muc-<mục>"` trong trang đó.
- Tham số của trang Tra Cứu: `mode` (`dudoan`, `chonngay`, `lapban`), `linhvuc`, `cung` (1–9). Trang Đăng Ký: `goi` (`que`, `thang`, `chuyen-gia`).

## Tài liệu khác

- [MO-TA-NOI-DUNG.md](MO-TA-NOI-DUNG.md) — mô tả toàn bộ nội dung trang: các trang, mục, nút bấm, công cụ và dữ liệu
- [docs/quy-trinh-lap-tran.md](docs/quy-trinh-lap-tran.md) — quy trình 12 bước lập trận (phương pháp gốc)
- [docs/giay-phep-thanh-phan.md](docs/giay-phep-thanh-phan.md) — giấy phép từng thành phần
- [KHOI-CHAY.md](KHOI-CHAY.md) — chạy trên máy, để kho riêng tư, đưa lên mạng khi cần
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
- Không có mã nguồn, văn bản hay hình ảnh nào được lấy từ các kho trên (xem [docs/giay-phep-thanh-phan.md](docs/giay-phep-thanh-phan.md)).
- Phần "Luận giải bằng AI" dùng dịch vụ của OpenAI; lời nhắc và mã gọi dịch vụ do Trận Pháp Kỳ Môn tự viết.
- Bảng giờ giao tiết 1900 – 2100 tính từ thư viện [sxtwl](https://github.com/yuangu/sxtwl_cpp) (Thọ Tinh vạn niên lịch, giấy phép BSD); kho chỉ lưu kết quả tính.
- [qfdk/qimen](https://github.com/qfdk/qimen) (MIT): chỉ xem để học cách chia mô-đun và bố cục thư mục; không lấy mã.
- Phông chữ Be Vietnam Pro và Noto Serif: SIL Open Font License 1.1 (Google Fonts).
