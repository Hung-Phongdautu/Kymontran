# Giấy phép các thành phần

Kiểm tra ngày 18/11/2026. Mục đích: biết rõ phần nào là của Trận Pháp Kỳ Môn, phần nào lấy từ nơi khác và được phép dùng theo điều kiện gì.

## Thành phần trong kho

| Thành phần | Tệp | Chủ sở hữu | Giấy phép | Điều kiện phải giữ |
| --- | --- | --- | --- | --- |
| Mã nguồn trang, bộ máy lập trận, công cụ dựng và kiểm thử | `lib/`, `public/`, `views/`, `build.py`, `server.py`, `tools/`, `test/`, `worker/` | Trận Pháp Kỳ Môn (Đỗ Lê) | Bảo lưu mọi quyền (`LICENSE`) | — |
| Tài liệu “Quy trình lập trận Kỳ Môn Độn Giáp” 12 bước | `docs/quy-trinh-lap-tran.md` | Trận Pháp Kỳ Môn | Bảo lưu mọi quyền | — |
| Bài Kiến Thức, nội dung trang | `content/`, `views/index.html` | Trận Pháp Kỳ Môn | Bảo lưu mọi quyền | — |
| Logo ĐL, tranh sơn thủy | `public/img/` | Chủ trang cung cấp; tranh do công cụ AI tạo | Theo quyền của chủ trang | Chủ trang tự xác nhận quyền dùng |
| Bảng giờ giao tiết 1900 – 2100 | `lib/tiet-khi-bang.js`, `data/tiet-khi-1900-2100.csv` | Kết quả tính từ thư viện sxtwl (yuangu/sxtwl_cpp) | Thư viện: BSD; kho chỉ lưu số liệu tính ra, không chứa mã của thư viện | Ghi nguồn (đã ghi ở trang Bản quyền, README, đầu tệp) |
| Bảng tra 12 bước | `lib/bang-tra.js`, `data/*.csv` | Trận Pháp Kỳ Môn biên soạn từ tri thức cổ pháp | Bảo lưu mọi quyền cho cách trình bày | Ca quyết, bảng cổ pháp thuộc phạm vi công cộng |
| Công thức kinh độ Mặt Trời | `lib/lich.js` | Viết lại theo sách của J. Meeus (Astronomical Algorithms) | Công thức toán học, không có bản quyền | Ghi nguồn trong chú thích |
| Công thức phương trình thời gian | `lib/lich.js` | Viết lại theo công thức công bố của NOAA | Tài liệu công của chính phủ Mỹ | Ghi nguồn trong chú thích |
| Phông Be Vietnam Pro, Noto Serif | Tải từ Google Fonts khi mở trang, không nằm trong kho | Tác giả phông | SIL Open Font License 1.1 | Không bán riêng phông |

Trang chạy không cần gói phần mềm nào của bên thứ ba: `package.json` không khai báo `dependencies`, `requirements.txt` để trống.

## Công cụ chỉ dùng khi phát triển (không nằm trong trang)

| Công cụ | Dùng để | Giấy phép |
| --- | --- | --- |
| sxtwl (Python) | Tạo lại bảng giờ giao tiết bằng `tools/tao_bang_tiet_khi.py` | BSD |
| Node.js | Chạy kiểm thử `node --test`, xuất bảng `tools/xuat_bang_tra.mjs` | MIT |
| Python 3 | Dựng trang `build.py`, chạy thử `server.py` | PSF |

## Các kho mã đã tham khảo

Cả ba kho chỉ được xem để học cách làm, không lấy mã nguồn, văn bản hay hình ảnh.

| Kho | Đã học gì | Giấy phép của kho | Kết quả đối chiếu |
| --- | --- | --- | --- |
| [qfdk/qimen](https://github.com/qfdk/qimen) | Cách chia bộ máy thành mô-đun theo từng bước (`lib/`), tách `views/` và `public/`, kiểm thử theo mô-đun trong `test/` | Tệp `LICENSE` ghi MIT; `package.json` lại ghi ISC (không thống nhất). Cả hai đều cho phép dùng lại nếu giữ thông báo bản quyền | So khớp từng đoạn 10 ký hiệu: không có đoạn mã nào trùng ngoài cú pháp chung (vòng lặp, khai báo CSS, thẻ HTML) |
| [winvu88888888-maker/cuongtan66666666](https://github.com/winvu88888888-maker/cuongtan66666666) | Ý tưởng chức năng | Không có giấy phép — mặc định không được sao chép | Không trùng mã hay văn bản |
| [masterai-top/Bazi-Ziwei-Qimen-Dunjia-Divination-System-Source-Code](https://github.com/masterai-top/Bazi-Ziwei-Qimen-Dunjia-Divination-System-Source-Code) | Cách tổ chức tài liệu của kho | MIT kèm hạn chế dùng thương mại | Không trùng mã hay văn bản |

## Khi thêm thành phần mới

1. Kiểm tra giấy phép trước khi chép bất kỳ đoạn mã, bảng số liệu hay hình ảnh nào.
2. Kho không có giấy phép thì chỉ được xem, không được chép.
3. Ghi thành phần mới vào bảng trên và vào mục Bản quyền của trang.
