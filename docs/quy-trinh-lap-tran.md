<!--
  Tài liệu "Quy trình lập trận Kỳ Môn Độn Giáp" 12 bước của Trận Pháp Kỳ Môn.
  © 2026 Trận Pháp Kỳ Môn (Đỗ Lê). Bảo lưu mọi quyền — xem tệp LICENSE.
  Chuyển từ bản Word "CÁC BƯỚC LẬP TRẬN KỲ MÔN"; chỉ lược bỏ ký hiệu thừa của bản chuyển đổi
  (số chú thích dính vào chữ, ký hiệu mũi tên bị lỗi) và thêm các ghi chú hiệu đính có đánh dấu.
-->

> **Vị trí trong kho mã:** tài liệu này là phương pháp gốc. Mỗi bước được lập trình thành một mô-đun trong `lib/` (`b01-tu-tru.js` … `b12-am-can.js`), các bảng tra nằm ở `lib/bang-tra.js` và được xuất ra `data/*.csv`, các ví dụ minh họa được dùng làm kiểm thử trong `test/`. Trong mã, sao “Thiên Phù” của tài liệu được ghi là **Thiên Phụ** để khỏi lẫn với Trực Phù.

# QUY TRÌNH LẬP TRẬN KỲ MÔN ĐỘN GIÁP

**TUÂN THỦ TRÌNH TỪ CÁC BƯỚC SAU**

## BƯỚC 1: ĐỔI GIỜ VÀ XÁC ĐỊNH TIẾT KHÍ (ĐỊNH CỤC KỲ MÔN)

Trong hệ thống **Kỳ Môn Độn Giáp**, dự trắc Kỳ Môn là sự kết hợp chặt chẽ giữa không gian và thời gian. Muốn khởi lập bàn cục chuẩn xác, trước tiên phải thiết lập hệ thống **Tứ trụ (Năm, Tháng, Ngày, Giờ)** bằng Can Chi, xác định tiết khí và tra ra số cục (số trận)

### 1. Xác định thời điểm lập trận & Đổi can chi (Phương pháp Ngũ Tý Độn)

Trước tiên, ghi nhận chính xác thời điểm lập trận theo dương lịch (năm, tháng, ngày, giờ). Dựa vào lịch vạn niên để chuyển đổi năm, tháng, ngày sang lịch Can Chi. Riêng Can Chi của giờ sẽ được suy ra từ Thiên can của ngày thông qua phương pháp **Ngũ Tý Độn** (còn gọi là Ngũ thử độn).

Bài ca quyết Ngũ Tý Độn khởi giờ:

“Giáp Kỷ hoàn gia Giáp (hoàn sinh Giáp),

Ất Canh Bính tác sơ,

Bính Tân tòng Mậu khởi,

Đinh Nhâm Canh Tý cư,

Mậu Quý suy Nhâm Tý (thôi Nhâm Tý),

Thời nguyên định bất hư (thử pháp định vô ngoa).”

**BẢNG TRA CỨU CAN CHI 12 GIỜ THEO THIÊN CAN NGÀY (NGŨ TÝ ĐỘN):**

| **Giờ → Can Ngày**  | **Ngày Giáp, Kỷ** | **Ngày Ất, Canh** | **Ngày Bính, Tân** | **Ngày Đinh, Nhâm** | **Ngày Mậu, Quý** |
|----------------------|-------------------|-------------------|--------------------|---------------------|-------------------|
| **Tý** (23h - 01h)   | **Giáp Tý**       | **Bính Tý**       | **Mậu Tý**         | **Canh Tý**         | **Nhâm Tý**       |
| **Sửu** (01h - 03h)  | Ất Sửu            | Đinh Sửu          | Kỷ Sửu             | Tân Sửu             | Quý Sửu           |
| **Dần** (03h - 05h)  | Bính Dần          | Mậu Dần           | Canh Dần           | Nhâm Dần            | Giáp Dần          |
| **Mão** (05h - 07h)  | Đinh Mão          | Kỷ Mão            | Tân Mão            | Quý Mão             | Ất Mão            |
| **Thìn** (07h - 09h) | Mậu Thìn          | Canh Thìn         | Nhâm Thìn          | Giáp Thìn           | Bính Thìn         |
| **Tỵ** (09h - 11h)   | Kỷ Tỵ             | Tân Tỵ            | Quý Tỵ             | Ất Tỵ               | Đinh Tỵ           |
| **Ngọ** (11h - 13h)  | Canh Ngọ          | Nhâm Ngọ          | Giáp Ngọ           | Bính Ngọ            | Mậu Ngọ           |
| **Mùi** (13h - 15h)  | Tân Mùi           | Quý Mùi           | Ất Mùi             | Đinh Mùi            | Kỷ Mùi            |
| **Thân** (15h - 17h) | Nhâm Thân         | Giáp Thân         | Bính Thân          | Mậu Thân            | Canh Thân         |
| **Dậu** (17h - 19h)  | Quý Dậu           | Ất Dậu            | Đinh Dậu           | Kỷ Dậu              | Tân Dậu           |
| **Tuất** (19h - 21h) | Giáp Tuất         | Bính Tuất         | Mậu Tuất           | Canh Tuất           | Nhâm Tuất         |
| **Hợi** (21h - 23h)  | Ất Hợi            | Đinh Hợi          | Kỷ Hợi             | Tân Hợi             | Quý Hợi           |

(Ví dụ: Ngày 01/10/1949 lúc 15 giờ chiều. Năm 1949 là năm Kỷ Sửu. Tháng 8 âm lịch tính theo Ngũ Hổ Độn là Quý Dậu. Ngày 10 tháng 8 âm là ngày Giáp Tý. Giờ 15h thuộc giờ Thân, ngày Giáp tính theo ca quyết "Giáp Kỷ hoàn gia Giáp" thì giờ Tý là Giáp Tý, đếm thuận đến giờ Thân là giờ **Nhâm Thân**).

### 2. Xác định Tiết Khí và phân chia Âm Độn / Dương Độn

Một năm có 24 tiết khí. Dựa vào thời điểm lập trận để xác định đang nằm trong tiết khí nào. Trong Kỳ Môn Độn Giáp, 24 tiết khí được phân đều cho hai nửa vận hành âm dương:

- **Dương độn (Dương độn thuận cục - 12 tiết khí)**: Bắt đầu từ sau tiết **Đông chí** đến kết thúc ở tiết **Mang chủng**.

  - 12 tiết khí: Đông chí, Tiểu hàn, Đại hàn, Lập xuân, Vũ thủy, Kinh trập, Xuân phân, Thanh minh, Cốc vũ, Lập hạ, Tiểu mãn, Mang chủng.

  - Đặc điểm: Bố trí Lục nghi đi thuận cửu cung, Tam kỳ đi nghịch cửu cung.

- **Âm độn (Âm độn nghịch cục - 12 tiết khí)**: Bắt đầu từ sau tiết **Hạ chí** đến kết thúc ở tiết **Đại tuyết**.

  - 12 tiết khí: Hạ chí, Tiểu thử, Đại thử, Lập thu, Xử thử, Bạch lộ, Thu phân, Hàn lộ, Sương giáng, Lập đông, Tiểu tuyết, Đại tuyết.

  - Đặc điểm: Bố trí Lục nghi đi nghịch cửu cung, Tam kỳ đi thuận cửu cung.

<!-- -->

- **Mười hai tiết khí Độn Dương (Dương Độn 9 Cục)**

<!-- -->

- **Đông chí** (cung Khảm 1): **1 – 7 – 4**

- **Tiểu hàn** (cung Khảm 1): **2 – 8 – 5**

- **Đại hàn** (cung Khảm 1): **3 – 9 – 6**

- **Lập xuân** (cung Cấn 8): **8 – 5 – 2**

- **Vũ thủy** (cung Cấn 8): **9 – 6 – 3**

- **Kinh trập** (cung Cấn 8): **1 – 7 – 4**

- **Xuân phân** (cung Chấn 3): **3 – 9 – 6**

- **Thanh minh** (cung Chấn 3): **4 – 1 – 7**

- **Cốc vũ** (cung Chấn 3): **5 – 2 – 8**

- **Lập hạ** (cung Tốn 4): **4 – 1 – 7**

- **Tiểu mãn** (cung Tốn 4): **5 – 2 – 8**

- **Mang chủng** (cung Tốn 4): **6 – 3 – 9**

**Ca quyết ghi nhớ Độn Dương:**

Đông chí, Kinh trập: một bảy bốn (1-7-4),

Tiểu hàn: hai tám năm (2-8-5) cùng suy.

Xuân phân, Đại hàn: ba chín sáu (3-9-6),

Lập xuân: tám năm hai (8-5-2) cùng tùy.

Cốc vũ, Tiểu mãn: năm hai tám (5-2-8),

Vũ thủy: chín sáu ba (9-6-3) là kỳ.

Thanh minh, Lập hạ: bốn một bảy (4-1-7),

Mang chủng: sáu ba chín (6-3-9) tùy nghi.

- **Mười hai tiết khí Độn Âm (Âm Độn 9 Cục)**

<!-- -->

- **Hạ chí** (cung Ly 9): **9 – 3 – 6**

- **Tiểu thử** (cung Ly 9): **8 – 2 – 5**

- **Đại thử** (cung Ly 9): **7 – 1 – 4**

- **Lập thu** (cung Khôn 2): **2 – 5 – 8**

- **Xử thử** (cung Khôn 2): **1 – 4 – 7**

- **Bạch lộ** (cung Khôn 2): **9 – 3 – 6**

- **Thu phân** (cung Đoài 7): **7 – 1 – 4**

- **Hàn lộ** (cung Đoài 7): **6 – 9 – 3**

- **Sương giáng** (cung Đoài 7): **5 – 8 – 2**

- **Lập đông** (cung Kiền 6): **6 – 9 – 3**

- **Tiểu tuyết** (cung Kiền 6): **5 – 8 – 2**

- **Đại tuyết** (cung Kiền 6): **4 – 7 – 1**

**Ca quyết ghi nhớ Độn Âm:**

Hạ chí, Bạch lộ: chín ba sáu (9-3-6),

Tiểu thử: tám hai năm (8-2-5) làm khoan.

Đại thử, Thu phân: bảy bốn một (7-1-4),

Lập thu: hai năm tám (2-5-8) tuần hoàn.

Sương giáng cùng với Tiểu tuyết: năm tám hai (5-8-2),

Đại tuyết: bốn bảy một (4-7-1) tương quan.

Xử thử bày ra: một bốn bảy (1-4-7),

Sáu chín ba (6-9-3): Lập đông, Hàn lộ bàn

### 3. Xác định Tam Nguyên (Thượng, Trung, Hạ) và Phù Đầu

Mỗi tiết khí dài 15 ngày, chia làm **3 nguyên**: **Thượng nguyên (5 ngày)**, **Trung nguyên (5 ngày)** và **Hạ nguyên (5 ngày)**. Mỗi ngày có 12 giờ (thời thần), 5 ngày tương ứng với đúng 60 thời thần (1 vòng Hoa Giáp trọn vẹn từ Giáp Tý đến Quý Hợi).

Mỗi nguyên được thống lĩnh bởi một **Phù đầu** (ngày đứng đầu nguyên, luôn mang Thiên can là **Giáp** hoặc **Kỷ**):

- **Thượng nguyên**: Can ngày Phù đầu là Giáp, Kỷ kết hợp với Địa chi thuộc **Tứ Trọng** (**Tý, Ngọ, Mão, Dậu**).

  - Gồm các ngày: Giáp Tý, Ất Sửu, Bính Dần, Đinh Mão, Mậu Thìn; Kỷ Mão, Canh Thìn, Tân Tỵ, Nhâm Ngọ, Quý Mùi; Giáp Ngọ, Ất Mùi, Bính Thân, Đinh Dậu, Mậu Tuất; Kỷ Dậu, Canh Tuất, Tân Hợi, Nhâm Tý, Quý Sửu.

- **Trung nguyên**: Can ngày Phù đầu là Giáp, Kỷ kết hợp với Địa chi thuộc **Tứ Mạnh** (**Dần, Thân, Tỵ, Hợi**).

  - Gồm các ngày: Giáp Thân, Ất Dậu, Bính Tuất, Đinh Hợi, Mậu Tý; Kỷ Tỵ, Canh Ngọ, Tân Mùi, Nhâm Thân, Quý Dậu; Giáp Dần, Ất Mão, Bính Thìn, Đinh Tỵ, Mậu Ngọ; Kỷ Hợi, Canh Tý, Tân Sửu, Nhâm Dần, Quý Mão.

- **Hạ nguyên**: Can ngày Phù đầu là Giáp, Kỷ kết hợp với Địa chi thuộc **Tứ Quý** (**Thìn, Tuất, Sửu, Mùi**).

  - Gồm các ngày: Giáp Tuất, Ất Hợi, Bính Tý, Đinh Sửu, Mậu Dần; Kỷ Sửu, Canh Dần, Tân Mão, Nhâm Thìn, Quý Tỵ; Giáp Thìn, Ất Tỵ, Bính Ngọ, Đinh Mùi, Mậu Thân; Kỷ Mùi, Canh Thân, Tân Dậu, Nhâm Tuất, Quý Hợi.

**Hiện tượng Siêu Thần - Tiếp Khí - Chính Thụ***: Do 1 năm thực tế dài khoảng 365,2422 ngày, 1 tiết khí bình quân là 15,2184 ngày nên can chi Phù đầu và thời điểm giao tiết khí thường không trùng khớp hoàn toàn. Nếu Phù đầu và tiết khí trùng nhau trong cùng 1 ngày gọi là* **Chính thụ***; Phù đầu đến trước tiết khí gọi là* **Siêu thần***; tiết khí đến trước Phù đầu gọi là* **Tiếp khí***. Khi khoảng cách siêu thần vượt quá 9 ngày, phép Kỳ Môn dùng phép* **Đặt nhuận** *(nhuận lặp lại 1 tiết khí đủ 3 nguyên, chỉ đặt nhuận ở 2 tiết Mang chủng và Đại tuyết trước khi đổi Âm/Dương độn).*

### 4. Bảng tra cứu Số Cục (Số Trận) theo Ca Quyết 24 Tiết Khí

Sau khi đã có **Tiết khí** và **Tam nguyên** (Thượng, Trung hay Hạ), tra cứu số cục thông qua hai bài ca quyết cổ truyền trong sách Lưu Bá Ôn:

*Ca quyết khởi cung Dương Độn thuận cục:*

“Đông chí, Kinh trập nhất thất tứ, Tiểu hàn nhị bát ngũ tương tùy. Đại hàn, Xuân phân tam cửu lục, Mang chủng lục tam cửu thị nghi. Cốc vũ, Tiểu mãn ngũ nhị bát, Lập xuân bát ngũ nhị tương nghi. Thanh minh, Lập hạ tứ nhất thất, Vũ thủy cửu lục tam vi kỳ.”

*Ca quyết khởi cung Âm Độn nghịch cục:*

“Hạ chí, Bạch lộ cửu tam lục, Tiểu thử bát nhị ngũ chi gian. Đại thử, Thu phân thất nhất tứ, Sương giáng, Tiểu tuyết ngũ bát nhị. Đại tuyết tứ thất nhất tương quan, Xử thử bài lai nhất tứ thất. Lập đông, Hàn lộ lục cửu tam.”

(Ba chữ số đi kèm sau mỗi tiết khí đại diện lần lượt cho số cục khởi đầu của **Thượng nguyên**, **Trung nguyên** và **Hạ nguyên**).

**BẢNG TỔNG HỢP TRA CỨU CỤC SỐ (SỐ TRẬN) 24 TIẾT KHÍ**

| **Độn Cục**   | **Tiết Khí**    | **Thượng Nguyên** | **Trung Nguyên** | **Hạ Nguyên** |
|---------------|-----------------|-------------------|------------------|---------------|
| **DƯƠNG ĐỘN** | **Đông chí**    | Dương 1 cục       | Dương 7 cục      | Dương 4 cục   |
|               | **Tiểu hàn**    | Dương 2 cục       | Dương 8 cục      | Dương 5 cục   |
|               | **Đại hàn**     | Dương 3 cục       | Dương 9 cục      | Dương 6 cục   |
|               | **Lập xuân**    | Dương 8 cục       | Dương 5 cục      | Dương 2 cục   |
|               | **Vũ thủy**     | Dương 9 cục       | Dương 6 cục      | Dương 3 cục   |
|               | **Kinh trập**   | Dương 1 cục       | Dương 7 cục      | Dương 4 cục   |
|               | **Xuân phân**   | Dương 3 cục       | Dương 9 cục      | Dương 6 cục   |
|               | **Thanh minh**  | Dương 4 cục       | Dương 1 cục      | Dương 7 cục   |
|               | **Cốc vũ**      | Dương 5 cục       | Dương 2 cục      | Dương 8 cục   |
|               | **Lập hạ**      | Dương 4 cục       | Dương 1 cục      | Dương 7 cục   |
|               | **Tiểu mãn**    | Dương 5 cục       | Dương 2 cục      | Dương 8 cục   |
|               | **Mang chủng**  | Dương 6 cục       | Dương 3 cục      | Dương 9 cục   |
| **ÂM ĐỘN**    | **Hạ chí**      | Âm 9 cục          | Âm 3 cục         | Âm 6 cục      |
|               | **Tiểu thử**    | Âm 8 cục          | Âm 2 cục         | Âm 5 cục      |
|               | **Đại thử**     | Âm 7 cục          | Âm 1 cục         | Âm 4 cục      |
|               | **Lập thu**     | Âm 2 cục          | Âm 5 cục         | Âm 8 cục      |
|               | **Xử thử**      | Âm 1 cục          | Âm 4 cục         | Âm 7 cục      |
|               | **Bạch lộ**     | Âm 9 cục          | Âm 3 cục         | Âm 6 cục      |
|               | **Thu phân**    | Âm 7 cục          | Âm 1 cục         | Âm 4 cục      |
|               | **Hàn lộ**      | Âm 6 cục          | Âm 9 cục         | Âm 3 cục      |
|               | **Sương giáng** | Âm 5 cục          | Âm 8 cục         | Âm 2 cục      |
|               | **Lập đông**    | Âm 6 cục          | Âm 9 cục         | Âm 3 cục      |
|               | **Tiểu tuyết**  | Âm 5 cục          | Âm 8 cục         | Âm 2 cục      |
|               | **Đại tuyết**   | Âm 4 cục          | Âm 7 cục         | Âm 1 cục      |

### 5. Kết quả hoàn thành của Bước 1

Sau khi thực hiện tuần tự các thao tác trên, bạn thu được đầy đủ 3 nhóm dữ liệu chuẩn mực để tiến hành an bài trận pháp:

1.  **Thời điểm can chi (Tứ trụ)**:

    - Năm (Niên trụ), Tháng (Nguyệt trụ), Ngày (Nhật trụ).

    - Giờ (Thời trụ): Xác định chính xác Thiên can và Địa chi thông qua **Ngũ Tý Độn**.

2.  **Tiết khí & Vận hành**: Xác định tên **Tiết khí** tại thời điểm lập trận và thể thức vận hành là **Dương độn** hay **Âm độn**.

3.  **Cục số (Số trận)**: Xác định thuộc **Thượng, Trung hay Hạ nguyên** (dựa vào Phù đầu của ngày) và kết luận chính xác **Cục số** (từ Cục 1 đến Cục 9 của Dương Độn hoặc Âm Độn).

## BƯỚC 2: XÁC ĐỊNH PHÙ ĐẦU VÀ TAM NGUYÊN (ĐỊNH CỤC SỐ ÂM/DƯƠNG)

Sau khi đã có **Can Chi của ngày** và **Tiết khí** từ Bước 1, bước tiếp theo là xác định **Phù Đầu** thống lĩnh ngày đó, quy về **Tam Nguyên** (Thượng, Trung hay Hạ nguyên) và chốt chính xác **Cục số (Số trận) Âm Độn (-) hoặc Dương Độn (+)** để tiến hành an bài trận pháp.

### 1. Phương pháp tìm Phù Đầu từ Can Chi ngày

Mỗi tiết khí 15 ngày được chia làm 3 nguyên (Thượng, Trung, Hạ), mỗi nguyên quản đúng 5 ngày. Vòng 60 Giáp Tý có 12 nguyên, mỗi nguyên do một ngày đứng đầu thống lĩnh gọi là **Phù Đầu**. Ngày Phù Đầu luôn luôn mang Thiên Can là **Giáp** hoặc **Kỷ**:

- **Ngày thứ 1 (Phù Đầu)**: Can **Giáp** hoặc **Kỷ**.

- **Ngày thứ 2**: Can **Ất** hoặc **Canh**.

- **Ngày thứ 3**: Can **Bính** hoặc **Tân**.

- **Ngày thứ 4**: Can **Đinh** hoặc **Nhâm**.

- **Ngày thứ 5**: Can **Mậu** hoặc **Quý**.

Quy tắc đếm ngược tìm Phù Đầu:

Căn cứ vào Can Chi của ngày dự trắc (Nhật trụ), lần lượt đếm lùi cả Can lẫn Chi theo chiều nghịch của Lục Thập Hoa Giáp cho đến khi gặp Thiên Can **Giáp** hoặc **Kỷ** thì dừng lại. Can Chi tại điểm dừng chính là **Phù Đầu** của ngày đó.

- **Nếu ngày có can Giáp hoặc Kỷ**: Chính ngày đó là ngày Phù Đầu.

- **Nếu ngày có can Ất hoặc Canh**: Lùi lại 1 ngày sẽ gặp Giáp hoặc Kỷ làm Phù Đầu.

- **Nếu ngày có can Bính hoặc Tân**: Lùi lại 2 ngày sẽ gặp Giáp hoặc Kỷ làm Phù Đầu.

- **Nếu ngày có can Đinh hoặc Nhâm**: Lùi lại 3 ngày sẽ gặp Giáp hoặc Kỷ làm Phù Đầu.

- **Nếu ngày có can Mậu hoặc Quý**: Lùi lại 4 ngày sẽ gặp Giáp hoặc Kỷ làm Phù Đầu.

### 2. Phân loại 12 Phù Đầu và Xác định Tam Nguyên

Sau khi xác định được Can Chi của Phù Đầu, căn cứ vào **Địa Chi của Phù Đầu** để quy vào ba nhóm Tứ Trọng (Tứ Chính), Tứ Mạnh (Tứ Sinh), và Tứ Quý (Tứ Mộ):

| Nhóm Địa Chi            | Các Địa Chi tương ứng    | 4 Phù Đầu thuộc nhóm                     | Thuộc Nguyên      |
|-------------------------|--------------------------|------------------------------------------|-------------------|
| **Tứ Chính (Tứ Trọng)** | **Tý, Ngọ, Mão, Dậu**    | **Giáp Tý, Giáp Ngọ, Kỷ Mão, Kỷ Dậu**    | **THƯỢNG NGUYÊN** |
| **Tứ Sinh (Tứ Mạnh)**   | **Dần, Thân, Tỵ, Hợi**   | **Giáp Thân, Giáp Dần, Kỷ Tỵ, Kỷ Hợi**   | **TRUNG NGUYÊN**  |
| **Tứ Mộ (Tứ Quý)**      | **Thìn, Tuất, Sửu, Mùi** | **Giáp Tuất, Giáp Thìn, Kỷ Sửu, Kỷ Mùi** | **HẠ NGUYÊN**     |

### 3. Bảng phân bố chi tiết 60 Giáp Tý theo Phù Đầu và Tam Nguyên

Toàn bộ 60 ngày trong vòng Hoa Giáp được phân định chặt chẽ thành 12 nguyên dưới sự thống lĩnh của 12 Phù Đầu:

| STT    | Phù Đầu       | Nhóm Chi       | Tam Nguyên        | 5 Ngày thuộc quyền quản lý của Phù Đầu          |
|--------|---------------|----------------|-------------------|-------------------------------------------------|
| **1**  | **Giáp Tý**   | Tứ Chính (Tý)  | **Thượng nguyên** | Giáp Tý, Ất Sửu, Bính Dần, Đinh Mão, Mậu Thìn   |
| **2**  | **Kỷ Tỵ**     | Tứ Sinh (Tỵ)   | **Trung nguyên**  | Kỷ Tỵ, Canh Ngọ, Tân Mùi, Nhâm Thân, Quý Dậu    |
| **3**  | **Giáp Tuất** | Tứ Mộ (Tuất)   | **Hạ nguyên**     | Giáp Tuất, Ất Hợi, Bính Tý, Đinh Sửu, Mậu Dần   |
| **4**  | **Kỷ Mão**    | Tứ Chính (Mão) | **Thượng nguyên** | Kỷ Mão, Canh Thìn, Tân Tỵ, Nhâm Ngọ, Quý Mùi    |
| **5**  | **Giáp Thân** | Tứ Sinh (Thân) | **Trung nguyên**  | Giáp Thân, Ất Dậu, Bính Tuất, Đinh Hợi, Mậu Tý  |
| **6**  | **Kỷ Sửu**    | Tứ Mộ (Sửu)    | **Hạ nguyên**     | Kỷ Sửu, Canh Dần, Tân Mão, Nhâm Thìn, Quý Tỵ    |
| **7**  | **Giáp Ngọ**  | Tứ Chính (Ngọ) | **Thượng nguyên** | Giáp Ngọ, Ất Mùi, Bính Thân, Đinh Dậu, Mậu Tuất |
| **8**  | **Kỷ Hợi**    | Tứ Sinh (Hợi)  | **Trung nguyên**  | Kỷ Hợi, Canh Tý, Tân Sửu, Nhâm Dần, Quý Mão     |
| **9**  | **Giáp Thìn** | Tứ Mộ (Thìn)   | **Hạ nguyên**     | Giáp Thìn, Ất Tỵ, Bính Ngọ, Đinh Mùi, Mậu Thân  |
| **10** | **Kỷ Dậu**    | Tứ Chính (Dậu) | **Thượng nguyên** | Kỷ Dậu, Canh Tuất, Tân Hợi, Nhâm Tý, Quý Sửu    |
| **11** | **Giáp Dần**  | Tứ Sinh (Dần)  | **Trung nguyên**  | Giáp Dần, Ất Mão, Bính Thìn, Đinh Tỵ, Mậu Ngọ   |
| **12** | **Kỷ Mùi**    | Tứ Mộ (Mùi)    | **Hạ nguyên**     | Kỷ Mùi, Canh Thân, Tân Dậu, Nhâm Tuất, Quý Hợi  |

### 4. Đối chiếu Tiết Khí để chốt Số Trận (Cục Số Âm/Dương)

Sau khi có **Tiết khí** (ở Bước 1) và **Tam Nguyên** (ở mục trên), ta đối chiếu vào hệ thống 24 tiết khí để xác định chính xác số trận mang tính chất **Dương độn (+)** hay **Âm độn (-)**:

### 1. Mười hai tiết khí Dương Độn (+) (Từ Đông chí đến Mang chủng)

(Bố trí Lục nghi thuận cửu cung, Tam kỳ nghịch cửu cung)

- **Đông chí, Kinh trập**: Thượng nguyên dùng **Dương 1 cục (+1)**, Trung nguyên dùng **Dương 7 cục (+7)**, Hạ nguyên dùng **Dương 4 cục (+4)**.

- **Tiểu hàn**: Thượng nguyên dùng **Dương 2 cục (+2)**, Trung nguyên dùng **Dương 8 cục (+8)**, Hạ nguyên dùng **Dương 5 cục (+5)**.

- **Đại hàn, Xuân phân**: Thượng nguyên dùng **Dương 3 cục (+3)**, Trung nguyên dùng **Dương 9 cục (+9)**, Hạ nguyên dùng **Dương 6 cục (+6)**.

- **Lập xuân**: Thượng nguyên dùng **Dương 8 cục (+8)**, Trung nguyên dùng **Dương 5 cục (+5)**, Hạ nguyên dùng **Dương 2 cục (+2)**.

- **Vũ thủy**: Thượng nguyên dùng **Dương 9 cục (+9)**, Trung nguyên dùng **Dương 6 cục (+6)**, Hạ nguyên dùng **Dương 3 cục (+3)**.

- **Thanh minh, Lập hạ**: Thượng nguyên dùng **Dương 4 cục (+4)**, Trung nguyên dùng **Dương 1 cục (+1)**, Hạ nguyên dùng **Dương 7 cục (+7)**.

- **Cốc vũ, Tiểu mãn**: Thượng nguyên dùng **Dương 5 cục (+5)**, Trung nguyên dùng **Dương 2 cục (+2)**, Hạ nguyên dùng **Dương 8 cục (+8)**.

- **Mang chủng**: Thượng nguyên dùng **Dương 6 cục (+6)**, Trung nguyên dùng **Dương 3 cục (+3)**, Hạ nguyên dùng **Dương 9 cục (+9)**.

### 2. Mười hai tiết khí Âm Độn (-) (Từ Hạ chí đến Đại tuyết)

(Bố trí Lục nghi nghịch cửu cung, Tam kỳ thuận cửu cung)

- **Hạ chí, Bạch lộ**: Thượng nguyên dùng **Âm 9 cục (-9)**, Trung nguyên dùng **Âm 3 cục (-3)**, Hạ nguyên dùng **Âm 6 cục (-6)**.

- **Tiểu thử**: Thượng nguyên dùng **Âm 8 cục (-8)**, Trung nguyên dùng **Âm 2 cục (-2)**, Hạ nguyên dùng **Âm 5 cục (-5)**.

- **Đại thử, Thu phân**: Thượng nguyên dùng **Âm 7 cục (-7)**, Trung nguyên dùng **Âm 1 cục (-1)**, Hạ nguyên dùng **Âm 4 cục (-4)**.

- **Lập thu**: Thượng nguyên dùng **Âm 2 cục (-2)**, Trung nguyên dùng **Âm 5 cục (-5)**, Hạ nguyên dùng **Âm 8 cục (-8)**.

- **Xử thử**: Thượng nguyên dùng **Âm 1 cục (-1)**, Trung nguyên dùng **Âm 4 cục (-4)**, Hạ nguyên dùng **Âm 7 cục (-7)**.

- **Hàn lộ, Lập đông**: Thượng nguyên dùng **Âm 6 cục (-6)**, Trung nguyên dùng **Âm 9 cục (-9)**, Hạ nguyên dùng **Âm 3 cục (-3)**.

- **Sương giáng, Tiểu tuyết**: Thượng nguyên dùng **Âm 5 cục (-5)**, Trung nguyên dùng **Âm 8 cục (-8)**, Hạ nguyên dùng **Âm 2 cục (-2)**.

- **Đại tuyết**: Thượng nguyên dùng **Âm 4 cục (-4)**, Trung nguyên dùng **Âm 7 cục (-7)**, Hạ nguyên dùng **Âm 1 cục (-1)**.

### 5. Kết quả thu được của Bước 2

Hoàn tất Bước 2 mang lại các kết quả cốt lõi:

1.  **Phù Đầu của ngày**: Tên cặp Can Chi của Phù Đầu (thuộc 1 trong 12 Phù Đầu: Giáp Tý, Kỷ Tỵ, Giáp Tuất, Kỷ Mão, Giáp Thân, Kỷ Sửu, Giáp Ngọ, Kỷ Hợi, Giáp Thìn, Kỷ Dậu, Giáp Dần, Kỷ Mùi).

2.  **Tam Nguyên**: Xác định ngày thuộc **Thượng nguyên**, **Trung nguyên** hay **Hạ nguyên** dựa vào Địa Chi Phù Đầu (Tứ Chính, Tứ Sinh hay Tứ Mộ).

3.  **Cục số chính xác**: Xác định rõ số trận định vị trên Cửu cung, ví dụ: **Dương 1 cục (+1)** hay **Âm 9 cục (-9)**, làm căn cứ trực tiếp để an định vị trí Lục Nghi và Tam Kỳ trên Địa bàn

## BƯỚC 3: AN THIÊN CAN ĐỊA BÀN (LỤC NGHI, TAM KỲ)

Sau khi đã xác định được **Cục số** mang tính chất **Dương Độn (+)** hay **Âm Độn (-)** ở Bước 2, bước tiếp theo là tiến hành an **9 Kỳ tử (Thiên Can của Địa bàn)** vào **Lạc Thư Cửu Cung**. Địa bàn trong Kỳ Môn đóng vai trò tĩnh (bất động), là nền tảng không gian để đối chiếu sự vận chuyển của Thiên bàn, Nhân bàn và Thần bàn.

### 1. Nguyên lý Lạc Thư Cửu Cung của Địa Bàn

Địa bàn Kỳ Môn được xây dựng dựa trên dịch lý Hậu Thiên Bát Quái phối hợp số đồ Lạc Thư:

- **Cung 1**: Quẻ **Khảm** (phương Chính Bắc, hành Thủy).

- **Cung 2**: Quẻ **Khôn** (phương Tây Nam, hành Thổ).

- **Cung 3**: Quẻ **Chấn** (phương Chính Đông, hành Mộc).

- **Cung 4**: Quẻ **Tốn** (phương Đông Nam, hành Mộc).

- **Cung 5**: **Trung Cung** (ở chính giữa, hành Thổ; khi vận hành thường gửi/ký ở cung Khôn 2).

- **Cung 6**: Quẻ **Càn** (phương Tây Bắc, hành Kim).

- **Cung 7**: Quẻ **Đoài** (phương Chính Tây, hành Kim).

- **Cung 8**: Quẻ **Cấn** (phương Đông Bắc, hành Thổ).

- **Cung 9**: Quẻ **Ly** (phương Chính Nam, hành Hỏa).

### 2. Thứ tự cố định bất biến của Lục Nghi và Tam Kỳ

Bộ 9 kỳ tử an trên Địa bàn gồm **Lục Nghi** và **Tam Kỳ**:

- **Tam Kỳ**: Gồm **Ất Kỳ** (Nhật kỳ), **Bính Kỳ** (Nguyệt kỳ), **Đinh Kỳ** (Tinh kỳ).

- **Lục Nghi**: Gồm **Mậu, Kỷ, Canh, Tân, Nhâm, Quý**. Đây là nơi ẩn náu của 6 vị nguyên soái, đại tướng quân dòng họ Giáp (phép Độn Giáp):

  - *Giáp Tý* ẩn dưới **Mậu** (Nghi trượng Chính hoàng kỳ).

  - *Giáp Tuất* ẩn dưới **Kỷ** (Nghi trượng Tương hoàng kỳ).

  - *Giáp Thân* ẩn dưới **Canh** (Nghi trượng Chính bạch kỳ).

  - *Giáp Ngọ* ẩn dưới **Tân** (Nghi trượng Tương bạch kỳ).

  - *Giáp Thìn* ẩn dưới **Nhâm** (Nghi trượng Chính hắc kỳ).

  - *Giáp Dần* ẩn dưới **Quý** (Nghi trượng Tương hắc kỳ).

Dãy thứ tự tuần hoàn cố định:

Khi an bài vào Cửu Cung, chuỗi 9 Thiên Can luôn luôn giữ nguyên một trật tự duy nhất, tuần hoàn khép kín không bao giờ xáo trộn: Mậu → Kỷ → Canh → Tân → Nhâm → Quý → Đinh → Bính → Ất lại về Mậu.

**Quy tắc bất biến**: Mậu luôn đi liền trước Kỷ, Kỷ liền Canh, Canh liền Tân, Tân liền Nhâm, Nhâm liền Quý, Quý liền Đinh, Đinh liền Bính, Bính liền Ất, và Ất liền Mậu.

### 3. Quy tắc an Thiên Can theo Cục số Âm - Dương

1.  **Khởi điểm của Mậu**: Cục số mang số mấy thì đặt Thiên can đầu tiên là **Mậu (Giáp Tý)** trực tiếp vào cung mang số đó của Cửu Cung.

    - *Ví dụ*: Cục 1 thì Mậu ở cung 1; Cục 3 thì Mậu ở cung 3; Cục 8 thì Mậu ở cung 8; Cục 9 thì Mậu ở cung 9.

2.  **Chiều an các can tiếp theo qua các cung**:

    - **Dương Độn (+)**: Sau khi đặt Mậu, các can tiếp theo trong chuỗi (*Kỷ, Canh, Tân, Nhâm, Quý, Đinh, Bính, Ất*) được an lần lượt vào các cung theo **chiều thuận số Cửu Cung** (1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 1).

    - **Âm Độn (-)**: Sau khi đặt Mậu, các can tiếp theo trong chuỗi (*Kỷ, Canh, Tân, Nhâm, Quý, Đinh, Bính, Ất*) được an lần lượt vào các cung theo **chiều nghịch số Cửu Cung** (9 → 8 → 7 → 6 → 5 4 → 3 → 2 → 1 → 9).

### 4. Bảng tra cứu toàn diện: Phân bổ Can Địa Bàn trong 18 Cục

Dưới đây là vị trí cụ thể của 9 Thiên Can trên Cửu Cung (1: Khảm, 2: Khôn, 3: Chấn, 4: Tốn, 5: Trung, 6: Càn, 7: Đoài, 8: Cấn, 9: Ly) cho trọn bộ 18 cục Kỳ Môn:

### 1. Chín cục DƯƠNG ĐỘN (Thuận Cửu Cung)

| **Cục số Dương** | **Cung 1 (Khảm)** | **Cung 2 (Khôn)** | **Cung 3 (Chấn)** | **Cung 4 (Tốn)** | **Cung 5 (Trung)** | **Cung 6 (Càn)** | **Cung 7 (Đoài)** | **Cung 8 (Cấn)** | **Cung 9 (Ly)** |
|------------------|-------------------|-------------------|-------------------|------------------|--------------------|------------------|-------------------|------------------|-----------------|
| **Dương 1 cục**  | **Mậu**           | Kỷ                | Canh              | Tân              | Nhâm               | Quý              | Đinh              | Bính             | Ất              |
| **Dương 2 cục**  | Ất                | **Mậu**           | Kỷ                | Canh             | Tân                | Nhâm             | Quý               | Đinh             | Bính            |
| **Dương 3 cục**  | Bính              | Ất                | **Mậu**           | Kỷ               | Canh               | Tân              | Nhâm              | Quý              | Đinh            |
| **Dương 4 cục**  | Đinh              | Bính              | Ất                | **Mậu**          | Kỷ                 | Canh             | Tân               | Nhâm             | Quý             |
| **Dương 5 cục**  | Quý               | Đinh              | Bính              | Ất               | **Mậu**            | Kỷ               | Canh              | Tân              | Nhâm            |
| **Dương 6 cục**  | Nhâm              | Quý               | Đinh              | Bính             | Ất                 | **Mậu**          | Kỷ                | Canh             | Tân             |
| **Dương 7 cục**  | Tân               | Nhâm              | Quý               | Đinh             | Bính               | Ất               | **Mậu**           | Kỷ               | Canh            |
| **Dương 8 cục**  | Canh              | Tân               | Nhâm              | Quý              | Đinh               | Bính             | Ất                | **Mậu**          | Kỷ              |
| **Dương 9 cục**  | Kỷ                | Canh              | Tân               | Nhâm             | Quý                | Đinh             | Bính              | Ất               | **Mậu**         |

### 2. Chín cục ÂM ĐỘN (Nghịch Cửu Cung)

| **Cục số Âm** | **Cung 1 (Khảm)** | **Cung 2 (Khôn)** | **Cung 3 (Chấn)** | **Cung 4 (Tốn)**                                   | **Cung 5 (Trung)** | **Cung 6 (Càn)** | **Cung 7 (Đoài)** | **Cung 8 (Cấn)** | **Cung 9 (Ly)** |
|---------------|-------------------|-------------------|-------------------|----------------------------------------------------|--------------------|------------------|-------------------|------------------|-----------------|
| **Âm 9 cục**  | Ất                | Bính              | Đinh              | Quý                                                | Nhâm               | Tân              | Canh              | Kỷ               | **Mậu**         |
| **Âm 8 cục**  | Bính              | Đinh              | Quý               | Nhâm                                               | Tân                | Canh             | Kỷ                | **Mậu**          | Ất              |
| **Âm 7 cục**  | Đinh              | Quý               | Nhâm              | Tân                                                | Canh               | Kỷ               | **Mậu**           | Ất               | Bính            |
| **Âm 6 cục**  | Quý               | Nhâm              | Tân               | Canh                                               | Kỷ                 | **Mậu**          | Ất                | Bính             | Đinh            |
| **Âm 5 cục**  | Nhâm              | Tân               | Canh              | Kỷ                                                 | **Mậu**            | Ất               | Bính              | Đinh             | Quý             |
| **Âm 4 cục**  | Tân               | Canh              | Kỷ                | **Mậu**                                            | Ất                 | Bính             | Đinh              | Quý              | Nhâm            |
| **Âm 3 cục**  | Canh | Kỷ | **Mậu** | Ất | Bính | Đinh | Quý | Nhâm | Tân |
| **Âm 2 cục**  | Kỷ | **Mậu** | Ất | Bính | Đinh | Quý | Nhâm | Tân | Canh |
| **Âm 1 cục**  | **Mậu** | Ất | Bính | Đinh | Quý | Nhâm | Tân | Canh | Kỷ |

> **Ghi chú hiệu đính:** trong bản Word, dòng Âm 3 cục bị cắt và tiêu đề Bước 3 bị dán lẫn vào bảng; ba dòng Âm 3, 2, 1 cục ở trên được điền lại theo đúng quy tắc của bước này. Phần dưới là bản trình bày lại Bước 3 kèm ví dụ, giữ nguyên để đối chiếu.

### Bước 3 (trình bày lại, kèm ví dụ)

Sau khi đã xác định được **Cục số** cùng tính chất **Dương Độn (+)** hoặc **Âm Độn (-)** từ Bước 2, thao tác kế tiếp là an các **Thiên Can Địa bàn** (gồm Lục Nghi và Tam Kỳ) vào **Lạc Thư Cửu Cung**. Địa bàn trong Kỳ Môn giữ vai trò tĩnh tại (bất động), tạo nền móng không gian để đối chiếu sự chuyển dịch của các bàn còn lại.

### 1. Cấu trúc Lạc Thư Cửu Cung của Địa Bàn

Địa bàn Kỳ Môn cố định 9 cung tương ứng với Bát quái Hậu thiên và số Lạc Thư:

- **Cung 1**: Quẻ **Khảm** (phương Bắc, ngũ hành Thủy).

- **Cung 2**: Quẻ **Khôn** (phương Tây Nam, ngũ hành Thổ).

- **Cung 3**: Quẻ **Chấn** (phương Đông, ngũ hành Mộc).

- **Cung 4**: Quẻ **Tốn** (phương Đông Nam, ngũ hành Mộc).

- **Cung 5**: **Trung Cung** (trung tâm, ngũ hành Thổ; khi phi bàn thường gửi vào cung Khôn 2).

- **Cung 6**: Quẻ **Càn** (phương Tây Bắc, ngũ hành Kim).

- **Cung 7**: Quẻ **Đoài** (phương Tây, ngũ hành Kim).

- **Cung 8**: Quẻ **Cấn** (phương Đông Bắc, ngũ hành Thổ).

- **Cung 9**: Quẻ **Ly** (phương Nam, ngũ hành Hỏa).

### 2. Thứ tự cố định bất biến của Lục Nghi và Tam Kỳ

Bộ 9 kỳ tử an trên Địa bàn gồm **Lục Nghi** (nơi ẩn giấu 6 vị tướng Lục Giáp) và **Tam Kỳ**:

- **Lục Nghi**:

  - *Giáp Tý* ẩn dưới **Mậu** (Chính hoàng kỳ).

  - *Giáp Tuất* ẩn dưới **Kỷ** (Tương hoàng kỳ).

  - *Giáp Thân* ẩn dưới **Canh** (Chính bạch kỳ).

  - *Giáp Ngọ* ẩn dưới **Tân** (Tương bạch kỳ).

  - *Giáp Thìn* ẩn dưới **Nhâm** (Chính hắc kỳ).

  - *Giáp Dần* ẩn dưới **Quý** (Tương hắc kỳ).

- **Tam Kỳ**: Gồm **Đinh Kỳ** (Tinh kỳ), **Bính Kỳ** (Nguyệt kỳ), **Ất Kỳ** (Nhật kỳ).

Dãy thứ tự tuần hoàn khép kín:

Khi an bài vào Cửu Cung, chuỗi 9 Thiên Can luôn tuân thủ nghiêm ngặt một thứ tự duy nhất không bao giờ thay đổi: Mậu → Kỷ → Canh → Tân → Nhâm → Quý → Đinh → Bính → Ất lặp lại Mậu.

**Nguyên tắc cốt lõi**: Bất kể cục số nào, Mậu luôn liền kề Kỷ, Kỷ liền Canh, Canh liền Tân, Tân liền Nhâm, Nhâm liền Quý, Quý liền Đinh, Đinh liền Bính, Bính liền Ất, và Ất lại liền Mậu.

### 3. Phương thức an Can: Dương Thuận - Âm Nghịch

Sự khác biệt duy nhất giữa các cục và giữa hai thể thức Âm/Dương là **vị trí khởi đầu của Mậu** và **hướng chạy theo số Cửu Cung**, tuyệt đối không thay đổi thứ tự của chuỗi Can.

1.  **Khởi điểm của Mậu**: Cục số bằng bao nhiêu thì đặt Thiên can **Mậu (Giáp Tý)** trực tiếp tại cung mang số đó của Lạc Thư.

    - *Ví dụ*: Dương 1 cục khởi Mậu tại cung 1; Dương 3 cục khởi Mậu tại cung 3; Âm 9 cục khởi Mậu tại cung 9.

2.  **Chiều an các can tiếp theo**:

    - **Dương Độn (+)**: Sau Mậu, lần lượt an *Kỷ, Canh, Tân, Nhâm, Quý, Đinh, Bính, Ất* theo **chiều thuận số Cửu Cung** (1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 1)

    - **Âm Độn (-)**: Sau Mậu, lần lượt an *Kỷ, Canh, Tân, Nhâm, Quý, Đinh, Bính, Ất* theo **chiều nghịch số Cửu Cung** (9 → 8 → 7 → 6 → 5 → 4 → 3 → 2 → 1 → 9)

### 4. Ví dụ minh họa chi tiết

Ví dụ 1: Dương Độn 1 Cục (+)

- Khởi **Mậu** tại cung **1 (Khảm)**.

- Đi **thuận** Cửu Cung:

  - Cung 2 (Khôn): **Kỷ**

  - Cung 3 (Chấn): **Canh**

  - Cung 4 (Tốn): **Tân**

  - Cung 5 (Trung): **Nhâm**

  - Cung 6 (Càn): **Quý**

  - Cung 7 (Đoài): **Đinh**

  - Cung 8 (Cấn): **Bính**

  - Cung 9 (Ly): **Ất**

Ví dụ 2: Dương Độn 3 Cục (+)

- Khởi **Mậu** tại cung **3 (Chấn)**.

- Đi **thuận** Cửu Cung:

  - Cung 4 (Tốn): **Kỷ**

  - Cung 5 (Trung): **Canh**

  - Cung 6 (Càn): **Tân**

  - Cung 7 (Đoài): **Nhâm**

  - Cung 8 (Cấn): **Quý**

  - Cung 9 (Ly): **Đinh**

  - Cung 1 (Khảm): **Bính**

  - Cung 2 (Khôn): **Ất**

Ví dụ 3: Âm Độn 9 Cục (-)

- Khởi **Mậu** tại cung **9 (Ly)**.

- Đi **nghịch** Cửu Cung:

  - Cung 8 (Cấn): **Kỷ**

  - Cung 7 (Đoài): **Canh**

  - Cung 6 (Càn): **Tân**

  - Cung 5 (Trung): **Nhâm**

  - Cung 4 (Tốn): **Quý**

  - Cung 3 (Chấn): **Đinh**

  - Cung 2 (Khôn): **Bính**

  - Cung 1 (Khảm): **Ất**

### 5. Kết quả thu được của Bước 3

Hoàn tất bước này, bạn đã cố định trọn vẹn **Thiên Can Địa Bàn** trên 9 cung vị Lạc Thư:

- Mỗi cung vị trong Cửu Cung đã có 1 Thiên Can Địa bàn tọa thủ (gọi tắt là **Địa bàn Can** hay **Địa can**).

- Xác định được vị trí của **Lục Giáp ẩn tàng** trên Địa bàn (ví dụ: muốn tìm vị trí tướng Giáp Thìn nằm ở đâu trên Địa bàn, chỉ cần tra cung có can Nhâm).

- Tạo tiền đề trực tiếp để sang **Bước 4: Xác định Tuần Thủ, Trực Phù và Trực Sử** dựa trên Can Chi của giờ dự trắ

## BƯỚC 4: XÁC ĐỊNH TUẦN THỦ VÀ CỜ (LỤC GIÁP ẨN TÀNG)

Sau khi đã an vị trí của **Thiên Can Địa Bàn** (Lục Nghi, Tam Kỳ) lên Lạc Thư Cửu Cung ở Bước 3, bước tiếp theo là xác định **Tuần Thủ** và **Cờ (Lục Nghi ẩn tàng)** của thời điểm lập trận. Đây là chìa khóa then chốt để tìm ra **Trực Phù** (Cửu Tinh trực ban) và **Trực Sử** (Bát Môn trực ban) ở bước kế tiếp.

### 1. Ý nghĩa của Tuần Thủ và "Độn Giáp" (Cờ hiệu)

Trong thuật Kỳ Môn Độn Giáp, **Thiên Can Giáp** là vị trí chí tôn, đứng đầu thống lĩnh các Thiên Can nhưng lại mang ngũ hành thuộc Mộc. Do Mộc sợ bị Canh Kim khắc phạt ("Canh Kim phách Mộc"), nên Giáp phải ẩn náu, che giấu thân phận dưới trướng của các đại tướng thuộc **Lục Nghi** để tránh bị tổn thương.

Toàn bộ vòng 60 Giáp Tý (Lục Thập Hoa Giáp) được chia đều làm **6 tuần**, mỗi tuần gồm 10 can chi do một vị tướng đứng đầu mang can Giáp thống lĩnh, gọi là **Lục Giáp Tuần Thủ**. Mỗi Tuần Thủ khi xuất trận sẽ mang một lá cờ hiệu tướng quân (nghi trượng) chính là một trong sáu can của Lục Nghi (**Mậu, Kỷ, Canh, Tân, Nhâm, Quý**):

- **Giáp Tý** ẩn dưới cờ **Mậu** (Nghi trượng Chính hoàng kỳ).

- **Giáp Tuất** ẩn dưới cờ **Kỷ** (Nghi trượng Tương hoàng kỳ).

- **Giáp Thân** ẩn dưới cờ **Canh** (Nghi trượng Chính bạch kỳ).

- **Giáp Ngọ** ẩn dưới cờ **Tân** (Nghi trượng Tương bạch kỳ).

- **Giáp Thìn** ẩn dưới cờ **Nhâm** (Nghi trượng Chính hắc kỳ).

- **Giáp Dần** ẩn dưới cờ **Quý** (Nghi trượng Tương hắc kỳ).

### 2. Phương pháp xác định Tuần Thủ từ Can Chi của Giờ

Căn cứ vào Can Chi của **giờ lập trận** (Thời trụ đã xác định qua Ngũ Tý Độn ở Bước 1), tiến hành đếm lùi đồng thời cả Thiên Can và Địa Chi theo chiều nghịch của chuỗi 10 Thiên Can (*Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý*) cho đến khi gặp can **Giáp** thì dừng lại. Cặp Can Chi tại điểm dừng chính là **Tuần Thủ** của giờ đó.

**Quy tắc đếm ngược theo Thiên Can của giờ:**

- **Giờ có can Giáp**: Chính giờ đó là Tuần Thủ.

- **Giờ có can Ất**: Lùi lại 1 bậc Địa chi sẽ gặp Giáp đứng đầu tuần.

- **Giờ có can Bính**: Lùi lại 2 bậc Địa chi sẽ gặp Giáp đứng đầu tuần.

- **Giờ có can Đinh**: Lùi lại 3 bậc Địa chi sẽ gặp Giáp đứng đầu tuần.

- **Giờ có can Mậu**: Lùi lại 4 bậc Địa chi sẽ gặp Giáp đứng đầu tuần.

- **Giờ có can Kỷ**: Lùi lại 5 bậc Địa chi sẽ gặp Giáp đứng đầu tuần.

- **Giờ có can Canh**: Lùi lại 6 bậc Địa chi sẽ gặp Giáp đứng đầu tuần.

- **Giờ có can Tân**: Lùi lại 7 bậc Địa chi sẽ gặp Giáp đứng đầu tuần.

- **Giờ có can Nhâm**: Lùi lại 8 bậc Địa chi sẽ gặp Giáp đứng đầu tuần.

- **Giờ có can Quý**: Lùi lại 9 bậc Địa chi sẽ gặp Giáp đứng đầu tuần.

*(Ví dụ: Giờ lập trận là giờ **Bính Dần**. Thiên can là Bính, lùi 2 bậc: Bính Dần → Ất Sửu → **Giáp Tý**. Như vậy giờ Bính Dần thuộc tuần **Giáp Tý**, mang cờ **Mậu**).*

*(Ví dụ: Giờ lập trận là giờ **Canh Ngọ**. Thiên can là Canh, lùi 6 bậc: Canh Ngọ → Kỷ Tỵ → Mậu Thìn → Đinh Mão → Bính Dần → Ất Sửu → **Giáp Tý**. Giờ Canh Ngọ thuộc tuần **Giáp Tý**, mang cờ **Mậu**).*

### 3. Bảng quy đổi Tuần Thủ và Cờ (Lục Nghi)

| **STT** | **Tuần Thủ**  | **Cờ (Lục Nghi tương ứng)** | **Tên vị Thần quân chủ quản trong sách** | **Ý nghĩa biểu tượng ngũ hành**      |
|---------|---------------|-----------------------------|------------------------------------------|--------------------------------------|
| **1**   | **Giáp Tý**   | **Mậu**                     | Vương Văn Khanh                          | Thổ dương, vạn vật đắc vượng ở Mậu   |
| **2**   | **Giáp Tuất** | **Kỷ**                      | Từ Hà Lợi                                | Thổ âm, sửa sang kỷ cương trật tự    |
| **3**   | **Giáp Thân** | **Canh**                    | Cái Tân                                  | Kim dương, mùa thu thu hoạch vạn vật |
| **4**   | **Giáp Ngọ**  | **Tân**                     | Linh Quang                               | Kim âm, đổi mới và canh tân khí tiết |
| **5**   | **Giáp Thìn** | **Nhâm**                    | Hàm Chương                               | Thủy dương, chấn động, mang thai     |
| **6**   | **Giáp Dần**  | **Quý**                     | Lâm Binh                                 | Thủy âm, nảy mầm theo đạo lý         |

### 4. Bảng tra cứu 60 Giờ phân theo 6 Tuần Thủ và Cờ

Toàn bộ 60 thời thần trong Lục Thập Hoa Giáp được phân bổ chính xác theo 6 Tuần Thủ và lá cờ tương ứng:

| **Tuần Thủ**  | **Cờ (Lục Nghi)** | **10 Thời Thần (Giờ) thuộc tuần quản lý**                                                         |
|---------------|-------------------|---------------------------------------------------------------------------------------------------|
| **Giáp Tý**   | **Mậu**           | **Giáp Tý**, Ất Sửu, Bính Dần, Đinh Mão, Mậu Thìn, Kỷ Tỵ, Canh Ngọ, Tân Mùi, Nhâm Thân, Quý Dậu   |
| **Giáp Tuất** | **Kỷ**            | **Giáp Tuất**, Ất Hợi, Bính Tý, Đinh Sửu, Mậu Dần, Kỷ Mão, Canh Thìn, Tân Tỵ, Nhâm Ngọ, Quý Mùi   |
| **Giáp Thân** | **Canh**          | **Giáp Thân**, Ất Dậu, Bính Tuất, Đinh Hợi, Mậu Tý, Kỷ Sửu, Canh Dần, Tân Mão, Nhâm Thìn, Quý Tỵ  |
| **Giáp Ngọ**  | **Tân**           | **Giáp Ngọ**, Ất Mùi, Bính Thân, Đinh Dậu, Mậu Tuất, Kỷ Hợi, Canh Tý, Tân Sửu, Nhâm Dần, Quý Mão  |
| **Giáp Thìn** | **Nhâm**          | **Giáp Thìn**, Ất Tỵ, Bính Ngọ, Đinh Mùi, Mậu Thân, Kỷ Dậu, Canh Tuất, Tân Hợi, Nhâm Tý, Quý Sửu  |
| **Giáp Dần**  | **Quý**           | **Giáp Dần**, Ất Mão, Bính Thìn, Đinh Tỵ, Mậu Ngọ, Kỷ Mùi, Canh Thân, Tân Dậu, Nhâm Tuất, Quý Hợi |

### 5. Kết quả thu được của Bước 4

Kết thúc Bước 4, bạn đã nắm giữ 2 thông số bản lề của thời thần:

1.  **Tuần Thủ của giờ**: Xác định được thời thần đang thuộc về tuần nào trong 6 tuần (*Giáp Tý, Giáp Tuất, Giáp Thân, Giáp Ngọ, Giáp Thìn, Giáp Dần*).

2.  **Cờ hiệu (Lục Nghi ẩn tàng)**: Xác định được Thiên Can mang cờ tương ứng (*Mậu, Kỷ, Canh, Tân, Nhâm hoặc Quý*).

**Ứng dụng trực tiếp sang Bước 5**: Khi đã biết cờ hiệu (ví dụ cờ **Mậu**), ta chỉ việc nhìn lại **Địa Bàn đã an ở Bước 3**, xem cờ Mậu đang đóng tại cung số mấy của Cửu Cung. Ngôi sao gốc tại cung đó chính là **Trực Phù** và cửa gốc tại cung đó chính là **Trực Sử**.

## BƯỚC 5: XÁC ĐỊNH ĐẠI TRỰC PHÙ (CỬU TINH) VÀ TRỰC SỬ (BÁT MÔN)

Sau khi đã xác định được **Tuần Thủ** và lá **Cờ hiệu** (Lục Nghi tương ứng) của giờ lập trận ở Bước 4, bước tiếp theo là xác định vị trí của lá Cờ này trên **Địa bàn** (đã an ở Bước 3). Từ cung vị đó, ta đối chiếu vào **Bản cung nguyên thủy (bản gốc)** của **Cửu Tinh** và **Bát Môn** để tìm ra hai vị chủ quản tối cao của thời thần: **Đại Trực Phù** (sao trực ban) và **Trực Sử** (cửa trực ban).

### 1. Nguyên lý xác định Cung vị của Tuần Thủ trên Địa Bàn

Mỗi thời thần (giờ) đều nằm dưới quyền quản lý của một trong sáu Tuần Thủ mang cờ Lục Nghi:

- Tuần **Giáp Tý** mang cờ **Mậu**.

- Tuần **Giáp Tuất** mang cờ **Kỷ**.

- Tuần **Giáp Thân** mang cờ **Canh**.

- Tuần **Giáp Ngọ** mang cờ **Tân**.

- Tuần **Giáp Thìn** mang cờ **Nhâm**.

- Tuần **Giáp Dần** mang cờ **Quý**.

**Cách tìm Cung vị Tuần Thủ**: Nhìn vào **Địa bàn** (đã an Lục Nghi, Tam Kỳ theo Cục số ở Bước 3), quan sát xem **Thiên Can mang cờ** của giờ hiện đang đóng tại **Cung số mấy** trong Cửu Cung Lạc Thư. Số cung đó chính là **Cung vị của Tuần Thủ**.

### 2. Bản Cung Nguyên Thủy (Bản gốc) của Cửu Tinh và Bát Môn

Trước khi chuyển động trên Thiên bàn và Nhân bàn, 9 ngôi sao (Cửu Tinh) và 8 cửa (Bát Môn) đều có vị trí cố định nguyên thủy trên Cửu Cung Lạc Thư:

**Bảng Cửu Tinh gốc (Thiên bàn nguyên thủy):**

- **Cung 1 (Khảm)**: Sao **Thiên Bồng** (Thủy).

- **Cung 2 (Khôn)**: Sao **Thiên Nhuế** (Thổ).

- **Cung 3 (Chấn)**: Sao **Thiên Xung** (Mộc).

- **Cung 4 (Tốn)**: Sao **Thiên Phù** (Mộc).

- **Cung 5 (Trung cung)**: Sao **Thiên Cầm** (Thổ) — *Trung cung không có phương vị cố định, nên Thiên Cầm được gửi ký vào cung Khôn 2 (đồng hành cùng Thiên Nhuế)*.

- **Cung 6 (Càn)**: Sao **Thiên Tâm** (Kim).

- **Cung 7 (Đoài)**: Sao **Thiên Trụ** (Kim).

- **Cung 8 (Cấn)**: Sao **Thiên Nhậm** (Thổ).

- **Cung 9 (Ly)**: Sao **Thiên Anh** (Hỏa).

**Bảng Bát Môn gốc (Nhân bàn nguyên thủy):**

- **Cung 1 (Khảm)**: Cửa **Hưu Môn** (Thủy).

- **Cung 8 (Cấn)**: Cửa **Sinh Môn** (Thổ).

- **Cung 3 (Chấn)**: Cửa **Thương Môn** (Mộc).

- **Cung 4 (Tốn)**: Cửa **Đỗ Môn** (Mộc).

- **Cung 9 (Ly)**: Cửa **Cảnh Môn** (Hỏa).

- **Cung 2 (Khôn)**: Cửa **Tử Môn** (Thổ).

- **Cung 7 (Đoài)**: Cửa **Kinh Môn** (Kim).

- **Cung 6 (Càn)**: Cửa **Khai Môn** (Kim). *(Lưu ý: Trung cung 5 không có môn riêng; trường hợp Tuần thủ rơi vào Trung cung 5 thì cửa trực ban gửi theo cung Khôn 2, tức là **Tử Môn**)*.

### 3. Bảng đối chiếu Cung Vị Tuần Thủ ra Đại Trực Phù và Trực Sử

Khi đã biết cờ Tuần Thủ ngự tại cung số mấy trên Địa bàn, đối chiếu trực tiếp với bảng gốc để chốt **Đại Trực Phù** và **Trực Sử**:

| **Cung vị của Cờ (Tuần Thủ) trên Địa Bàn** | **Ngôi sao gốc tương ứng (Đại Trực Phù)** | **Cửa gốc tương ứng (Trực Sử)** |
|--------------------------------------------|-------------------------------------------|---------------------------------|
| **Cung 1 (Khảm)**                          | **Thiên Bồng**                            | **Hưu Môn**                     |
| **Cung 2 (Khôn)**                          | **Thiên Nhuế** *(kèm Thiên Cầm)*          | **Tử Môn**                      |
| **Cung 3 (Chấn)**                          | **Thiên Xung**                            | **Thương Môn**                  |
| **Cung 4 (Tốn)**                           | **Thiên Phù**                             | **Đỗ Môn**                      |
| **Cung 5 (Trung Cung)**                    | **Thiên Cầm** *(gửi Khôn 2)*              | **Tử Môn** *(gửi Khôn 2)*       |
| **Cung 6 (Càn)**                           | **Thiên Tâm**                             | **Khai Môn**                    |
| **Cung 7 (Đoài)**                          | **Thiên Trụ**                             | **Kinh Môn**                    |
| **Cung 8 (Cấn)**                           | **Thiên Nhậm**                            | **Sinh Môn**                    |
| **Cung 9 (Ly)**                            | **Thiên Anh**                             | **Cảnh Môn**                    |

### 4. Ví dụ minh họa thực tế từ các bước trước

- **Tình huống**: Giả sử qua các bước trước ta xác định được:

  - Trận thuộc **Dương Độn 1 Cục** (+1).

  - Giờ lập trận là giờ **Canh Ngọ**.

- **Xác định**:

  1.  *Tìm Tuần Thủ và Cờ*: Giờ Canh Ngọ thuộc tuần **Giáp Tý**, mang cờ **Mậu**.

  2.  *Tìm Cung vị của Cờ trên Địa bàn*: Trong Dương 1 Cục, Mậu khởi tại **Cung 1 (Khảm)**. Như vậy cung vị của Tuần Thủ nằm tại **Cung 1**.

  3.  *Đối chiếu Cửu Tinh gốc*: Cung 1 nguyên thủy là sao **Thiên Bồng** → → rightarrow → **Đại Trực Phù** của trận là **sao Thiên Bồng**.

  4.  *Đối chiếu Bát Môn gốc*: Cung 1 nguyên thủy là cửa **Hưu Môn** → → rightarrow → **Trực Sử** của trận là **cửa Hưu Môn**.

### 5. Ý nghĩa của Đại Trực Phù và Trực Sử trong hệ thống Kỳ Môn

- **Đại Trực Phù (Cửu Tinh)**: Đóng vai trò là vị nguyên soái, chủ tướng thiên văn trên Thiên bàn. Cửu Tinh đại diện cho thiên thời và ý trời. Tại các bước tiếp theo, Đại Trực Phù cùng toàn bộ Cửu Tinh và Lục Nghi/Tam Kỳ trên Thiên bàn sẽ xoay chuyển đến cung vị mang **Thiên Can của giờ** trên Địa bàn.

- **Trực Sử (Bát Môn)**: Đóng vai trò là sứ giả thừa hành mệnh lệnh, đại diện cho nhân sự và hành động thực tế trên Nhân bàn. Bát Môn vận hành theo sự dẫn dắt của Trực Sử. Tại các bước tiếp theo, Trực Sử sẽ chuyển động từ bản cung gốc theo thứ tự Cửu cung và số đếm của thời thần để tìm vị trí lâm cung cuối cùng.

## BƯỚC 6: AN ĐẠI TRỰC PHÙ (CỬU TINH) VÀ THIÊN CAN THIÊN BÀN

Sau khi đã xác định được **Đại Trực Phù** (Cửu Tinh trực ban) và **Cờ Tuần Thủ** ở Bước 5, bước này tiến hành xoay chuyển tầng **Thiên bàn**. Đây là quá trình đưa toàn bộ hệ thống Cửu Tinh cùng Lục Nghi / Tam Kỳ trên Thiên bàn từ vị trí ban đầu (bản cung gốc) đến vị trí mới tương ứng với thời khắc lập trận, lấy **Thiên Can của giờ** làm mốc định vị.

### 1. Nguyên lý vận hành: "Trực Phù tùy Thời Can"

- **Quy luật cốt lõi**: Khác với Địa bàn mang tính tĩnh (đứng yên), Thiên bàn mang tính động (luôn luân chuyển theo thời gian).

- **Tôn chỉ chuyển bàn**: *"Tìm cung vị có thời can tọa thủ → → rightarrow → Chuyển động Thiên bàn sao cho Trực Phù chiếu thẳng với cung vị có thời can tọa thủ"*.

- **Ý nghĩa**: Đại Trực Phù là vị sao chủ soái của giờ. Khi đến giờ lập trận, vị chủ soái này phải bay đến đóng đúng tại cung vị mà **Thiên Can của giờ đó** đang chiếm giữ trên Địa bàn.

### 2. Trình tự thực hiện chi tiết

**Thao tác 1: Tìm vị trí của Thiên Can giờ trên Địa Bàn**

- Quan sát **Thiên Can của giờ lập trận** (đã xác định ở Bước 1 qua phép Ngũ Tý Độn).

- Đối chiếu lên **Địa bàn** (đã an ở Bước 3) xem Thiên Can này đang tọa tại cung số mấy của Cửu Cung Lạc Thư. Cung này chính là **cung đích đến** của Đại Trực Phù. *(Lưu ý: Nếu Thiên Can của giờ là Can Giáp — vốn ẩn náu, không lộ diện trực tiếp trên bàn cờ — thì lấy vị trí của **Lá Cờ Tuần Thủ** đại diện cho Giáp đó trên Địa bàn làm mốc).*

**Thao tác 2: Chuyển Đại Trực Phù và Cờ Tuần Thủ đến cung mới**

- Đưa ngôi sao **Đại Trực Phù** (đã xác định ở Bước 5) từ vị trí gốc trên Địa bàn chuyển đến lâm vào cung vị của Thiên Can giờ vừa tìm được.

- **Nguyên tắc "Cờ đi theo Sao"**: Khi Đại Trực Phù chuyển động, **Cờ của Tuần Thủ** (lá cờ Lục Nghi gắn liền với Trực Phù đó tại bản cung gốc) cũng được mang theo và an chồng lên phía trên Địa bàn tại cung mới, tạo thành **Thiên Can của Thiên bàn** (Thiên bàn Can).

**Thao tác 3: An bài các Cửu Tinh và Thiên Can còn lại theo chiều kim đồng hồ**

- **Chiều an cố định**: Khi chuyển động Thiên bàn (phép Chuyển bàn Kỳ Môn), chiều sắp xếp các ngôi sao chạy vòng quanh 8 cung ngoại vi luôn luôn theo **chiều thuận kim đồng hồ**, **bất kể trận là Âm Độn hay Dương Độn**.

- **Thứ tự 8 cung theo vòng tròn kim đồng hồ**: Khảm 1 → Cấn 8 → Chấn 3 → Tốn 4 → Ly 9 → Khôn 2 → Đoài 7 → Càn 6 → trở về Khảm 1

- **Thứ tự Cửu Tinh gốc chạy theo vòng**: Thiên Bồng (1) → Thiên Nhậm (8) → Thiên Xung (3) → Thiên Phù (4) → Thiên Anh (9) → Thiên Nhuế / Thiên Cầm (2/5) → Thiên Trụ (7) → Thiên Tâm (6) *(Riêng sao **Thiên Cầm** ở Trung cung 5 không có phương vị riêng nên luôn đi kèm và ký gửi cùng sao **Thiên Nhuế** ở cung Khôn 2).*

- Căn cứ vào vị trí mới của Đại Trực Phù, lần lượt an các sao còn lại theo đúng khoảng cách và thứ tự thuận kim đồng hồ nói trên vào các cung. Đồng thời, các **Thiên Can trên Thiên bàn** vốn đi kèm với từng ngôi sao tại bản cung ban đầu cũng sẽ dịch chuyển theo sao đó đến cung mới tương ứng.

### 3. Ví dụ minh họa thực tế từ nguồn

**Ví dụ 1 (Nguồn: Dương Độn 3 Cục, Giờ Canh Ngọ)**

1.  **Dữ liệu ban đầu**:

    - Tiết khí: Dương Độn 3 Cục. Can Canh của giờ Canh Ngọ đang đóng tại **Trung cung 5** (gửi ở **Khôn 2**) trên Địa bàn.

    - Giờ Canh Ngọ thuộc tuần Giáp Tý, cờ **Mậu**.

    - Mậu ở cung 3 (Chấn), nên Đại Trực Phù là sao **Thiên Xung**.

2.  **Tiến hành an chuyển Thiên bàn**:

    - Thiên Can của giờ là **Canh**, trên Địa bàn Canh ở Trung cung 5 và gửi ở **Khôn 2**.

    - Đưa Đại Trực Phù **Thiên Xung** cùng lá cờ **Mậu** đến đóng tại **Trung cung 5 (gửi Khôn 2)**.

    - Các sao còn lại cùng Thiên Can tương ứng chuyển dịch thuận chiều kim đồng hồ quanh 8 cung:

      - Cung Đoài 7: Sao **Thiên Phù** mang can **Kỷ**.

      - Cung Càn 6: Sao **Thiên Anh** mang can **Đinh**.

      - Cung Khảm 1: Sao **Thiên Nhuế / Thiên Cầm** mang can **Ất** (kèm Canh gửi từ Trung cung).

      - Cung Cấn 8: Sao **Thiên Trụ** mang can **Nhâm**.

      - Cung Chấn 3: Sao **Thiên Tâm** mang can **Tân**.

      - Cung Tốn 4: Sao **Thiên Bồng** mang can **Bính**.

      - Cung Ly 9: Sao **Thiên Nhậm** mang can **Quý**.

**Ví dụ 2 (Nguồn: Dương Độn 1 Cục, Giờ Tân Mão)**

1.  **Dữ liệu ban đầu**:

    - Giờ Tân Mão thuộc tuần Giáp Thân, mang cờ **Canh**.

    - Canh trên Địa bàn đang ở cung **Chấn 3**, do đó Đại Trực Phù là sao **Thiên Xung**.

2.  **Tiến hành an chuyển Thiên bàn**:

    - Thiên Can của giờ là **Tân**, trên Địa bàn Tân đang tọa ở cung **Tốn 4**.

    - Chuyển Đại Trực Phù **Thiên Xung** cùng cờ **Canh** đến đóng tại cung **Tốn 4**.

    - Xoay thuận kim đồng hồ cho các sao và kỳ tử còn lại:

      - Cung Ly 9: Sao **Thiên Phù** (mang can Tân).

      - Cung Khôn 2: Sao **Thiên Anh** (mang can Ất).

      - Cung Đoài 7: Sao **Thiên Nhuế / Thiên Cầm** (mang can Kỷ, Nhâm).

      - Cung Càn 6: Sao **Thiên Trụ** (mang can Quý).

      - Cung Khảm 1: Sao **Thiên Tâm** (mang can Đinh).

      - Cung Cấn 8: Sao **Thiên Bồng** (mang can Mậu).

      - Cung Chấn 3: Sao **Thiên Nhậm** (mang can Bính).

> **Ghi chú hiệu đính:** ở ví dụ 2 trên, theo nguyên tắc “can đi theo sao” của chính bước này thì Thiên Trụ (gốc Đoài 7, can Đinh) mang **Đinh** và Thiên Tâm (gốc Càn 6, can Quý) mang **Quý**; tài liệu ghi ngược lại. Bộ máy (`lib/b06-thien-ban.js`) làm theo nguyên tắc.

### 4. Kết quả thu được của Bước 6

Kết thúc Bước 6, bạn đã hoàn thiện tầng **Thiên bàn**:

1.  **Cửu Tinh Thiên bàn**: 8 cung xung quanh (và Trung cung gửi) đều có một ngôi sao ngự trị, phản ánh thiên thời tại thời điểm dự trắc.

2.  **Thiên Can Thiên bàn (Thiên Can thượng tầng)**: Mỗi cung vị lúc này xuất hiện 1 Thiên Can mới xếp chồng lên trên Thiên Can của Địa bàn.

3.  **Mối quan hệ Can trên - Can dưới**: Sự kết hợp giữa Can Thiên bàn và Can Địa bàn tại mỗi cung chính là cơ sở hình thành nên các **Thập Can cách cục** (như *Thanh Long phản thủ, Phi điểu diệt huyệt, Bạch Hổ xương cuồng, Đằng Xà yêu kiều...*) để luận đoán cát hung.

## BƯỚC 7: AN TRỰC SỬ (BÁT MÔN TRÊN NHÂN BÀN)

Sau khi đã hoàn thành việc chuyển dịch Thiên bàn ở Bước 6, bước tiếp theo là an bài tầng **Nhân bàn (Bát Môn)**. Trong hệ thống Kỳ Môn Độn Giáp, Bát Môn đại diện cho nhân sự, mưu lược hành động, sự định đoạt được - mất, lành - dữ do con người tạo ra. Tầng Nhân bàn vận hành dưới sự dẫn dắt của **Trực Sử** (cánh cửa trực ban đã tìm được ở Bước 5).

### 1. Nguyên lý xác định Cung vị an Trực Sử

Việc tìm vị trí lâm cung của Trực Sử trải qua quá trình bay qua Cửu Cung (phi cung) theo sự vận động của thời gian:

1.  **Cung khởi đầu**: Lấy chính **Cung vị của Tuần Thủ (Cờ)** trên Địa bàn (đã xác định ở Bước 4 và Bước 5) làm mốc xuất phát ban đầu.

2.  **Xác định bước đếm can**:

    - Tuần Thủ luôn khởi đầu bằng can **Giáp**.

    - Đếm lần lượt theo thứ tự 10 Thiên Can từ can Giáp của Tuần Thủ tiến dần đến **Thiên Can của giờ lập trận** (*Giáp → Ất → Bính → Đinh → Mậu → Kỷ → Canh → Tân → Nhâm → Quý*).

3.  **Chiều phi Cửu Cung**:

    - **Dương Độn (+)**: Đếm thuận theo thứ tự các số của Cửu Cung Lạc Thư: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 1

    - **Âm Độn (-)**: Đếm nghịch theo thứ tự các số của Cửu Cung Lạc Thư: 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2 → 1 → 9

4.  **Điểm dừng (Cung an Trực Sử)**:

    - Khi đếm đến Thiên Can của giờ thì dừng lại. Cung Lạc Thư tại điểm dừng chính là cung tiếp nhận **Trực Sử**.

    - Đưa cánh cửa **Trực Sử** (đã xác định ở Bước 5) vào đóng tại cung này.

5.  **Trường hợp đặc biệt (Trung Cung 5)**:

    - Nếu điểm dừng rơi đúng vào **Cung 5 (Trung Cung)**, do Trung Cung ở trung tâm không có phương vị và không có cửa riêng trong Bát Môn, theo quy ước kinh điển sẽ **lấy Cung Khôn 2 thay thế** để an Trực Sử.

### 2. Nguyên tắc an toàn bộ Bát Môn theo chiều kim đồng hồ

Sau khi Trực Sử đã an định tại cung số vừa tìm được, các cửa còn lại của Bát Môn không phi theo thứ tự số Lạc Thư nữa mà được sắp xếp chuyển động vòng quanh 8 cung ngoại vi **theo chiều thuận kim đồng hồ**, **bất kể trận là Âm Độn hay Dương Độn**:

- **Thứ tự 8 cung theo chiều thuận kim đồng hồ**: Khảm 1 → Cấn 8 → 3 → Tốn 4 → Ly 9 → Khôn 2 → Đoài 7 → Càn 6 → về Khảm 1

- **Thứ tự sắp xếp cố định của Bát Môn gốc**: Hưu Môn (1) → Sinh Môn (8) → Thương Môn (3) → Đỗ Môn (4) → Cảnh Môn (9) → Tử Môn (2) → Kinh Môn (7) → Khai Môn (6)

Từ vị trí của Trực Sử vừa an, lần lượt điền các cửa kế tiếp theo đúng trật tự trên vào các cung kế tiếp theo chiều kim đồng hồ.

### 3. Ví dụ minh họa chi tiết từ nguồn sách

**Ví dụ kinh điển: Trận Dương Độn 3 Cục, Giờ Canh Ngọ**

1.  **Dữ liệu đã có từ các bước trước**:

    - Trận: **Dương Độn 3 Cục**.

    - Giờ lập trận: **Canh Ngọ**.

    - Tuần Thủ của giờ Canh Ngọ là **Giáp Tý** (mang cờ **Mậu**).

    - Trong Dương 3 Cục, cờ Mậu ngự tại **Cung 3 (Chấn)**. Do đó, cung khởi đầu để tính Trực Sử là **Cung 3**.

    - Bản cung gốc của Cung 3 (Chấn) là **Thương Môn**, vì vậy **Trực Sử chính là Thương Môn**.

2.  **Tiến hành đếm tìm cung an Trực Sử**:

    - Can của Tuần Thủ là **Giáp** (khởi tại Cung 3).

    - Can của giờ là **Canh**.

    - Vì là trận **Dương Độn (+)**, ta đếm **thuận** qua các số Cửu Cung từ Cung 3 xuất phát:

      - *Giáp* tại **Cung 3** (Chấn).

      - *Ất* đếm tới **Cung 4** (Tốn).

      - *Bính* đếm tới **Cung 5** (Trung Cung).

      - *Đinh* đếm tới **Cung 6** (Càn).

      - *Mậu* đếm tới **Cung 7** (Đoài).

      - *Kỷ* đếm tới **Cung 8** (Cấn).

      - *Canh* đếm tới **Cung 9** (Ly).

    - Thiên Can giờ là **Canh**, điểm dừng rơi đúng vào **Cung 9 (Ly)**.

    - Kết luận: Cung an Trực Sử là **Cung 9 (Ly)**. Đưa Trực Sử **Thương Môn** vào ngự tại **Cung Ly 9**.

3.  **An các cửa còn lại theo chiều kim đồng hồ quanh 8 cung**:

    - Khởi từ **Thương Môn tại Ly 9**, lần lượt an thuận chiều kim đồng hồ các cửa tiếp theo theo trật tự Bát Môn:

      - Cung **Khôn 2**: **Đỗ Môn**

      - Cung **Đoài 7**: **Cảnh Môn**

      - Cung **Càn 6**: **Tử Môn**

      - Cung **Khảm 1**: **Kinh Môn**

      - Cung **Cấn 8**: **Khai Môn**

      - Cung **Chấn 3**: **Hưu Môn**

      - Cung **Tốn 4**: **Sinh Môn** *(Kết quả khớp với đồ hình phân bố Bát Môn tại trang 77 của sách)*.

### 4. Kết quả thu được của Bước 7

Kết thúc bước này, bạn đã thiết lập trọn vẹn tầng **Nhân bàn (Bát Môn)**:

1.  **Cung vị Trực Sử**: Xác định chính xác vị trí của cánh cửa trực ban cai quản thời khắc dự trắc.

2.  **Bát Môn hoàn chỉnh**: Cả 8 cung phương vị đều có một cánh cửa môn hộ trấn giữ (*Khai, Hưu, Sinh, Thương, Đỗ, Cảnh, Tử, Kinh*), mở ra mối tương tác giữa Nhân sự và Địa bàn (Môn - Cung tương sinh, tương khắc, Môn bức, Cung bức, Phản ngâm, Phục ngâm...).

## BƯỚC 8: AN BÁT THẦN THEO ĐẠI TRỰC PHÙ (CỬU TINH)

Sau khi đã hoàn thành an Thiên bàn (Bước 6) và Nhân bàn (Bước 7), bước cuối cùng để hoàn thiện trận đồ Kỳ Môn Độn Giáp là thiết lập tầng **Thần bàn (Bát Thần)**. Trong hệ thống Kim Hàm Ngọc Kính Kỳ Môn Độn Giáp của Lưu Bá Ôn, Bát Thần đại diện cho những lực lượng vô hình, tính chất huyền cơ, tâm linh và hoàn cảnh trợ lực hoặc cản trở từ vũ trụ đối với sự việc.

### 1. Nguyên lý vận hành: "Thần bàn tùy Trực Phù Cửu Tinh"

- **Vị trí khởi đầu**: Thần bàn không đứng yên mà chuyển động phụ thuộc hoàn toàn vào vị trí của **Đại Trực Phù (Cửu Tinh)** sau khi đã bay đến cung vị mới trên Thiên bàn ở Bước 6.

- **Thần đứng đầu**: Vị thần tối cao đứng đầu Bát Thần là **(Tiểu) Trực Phù**. Vị Trực Phù của Thần bàn sẽ luôn luôn bay đến đóng cùng cung với **sao Đại Trực Phù** của Thiên bàn.

- **Phạm vi phân bố**: Bát Thần chỉ đóng tại **8 cung ngoại vi** (tương ứng 8 quẻ Bát quái của Cửu Cung: *Khảm 1, Cấn 8, Chấn 3, Tốn 4, Ly 9, Khôn 2, Đoài 7, Càn 6*), không đóng ở Trung cung 5.  
  *(Trường hợp sao Đại Trực Phù lâm vào Trung cung 5 thì mượn cung Khôn 2 làm nơi tọa thủ, do đó thần Trực Phù cũng khởi đầu từ cung Khôn 2).*

### 2. Thứ tự cố định bất biến của Bát Thần

Tám vị thần trong hệ thống Thần bàn luôn tuân thủ nghiêm ngặt một chuỗi trật tự tuần hoàn khép kín gồm 8 vị: Trực Phù → Đằng Xà → Thái Âm → Lục Hợp → Bạch Hổ → Huyền Vũ → Cửu Địa → CửuThiên

*(Trong sách cổ, Bạch Hổ còn được gọi hoặc đi kèm với Câu Trần; Huyền Vũ còn được gọi hoặc đi kèm với Chu Tước tùy theo tính chất Âm/Dương hoặc sự chuyển hóa hung sát).*

**Bản chất và thuộc tính của Bát Thần theo thư tịch:**

1.  **Trực Phù**: Thủ lĩnh của Bát Thần, thuộc tính ngũ hành Hỏa (hoặc Mộc chủ soái), là thần cát lợi bậc nhất, giải trừ mọi tai ách, bảo hộ quý nhân.

2.  **Đằng Xà**: Ngũ hành thuộc Hỏa (phương Nam / Đinh Hỏa hóa khí), chủ về sự quái dị, kinh sợ, hoảng hốt, thị phi, dối trá, ác mộng.

3.  **Thái Âm**: Ngũ hành thuộc Kim (phương Tây / Kim âm), thần bảo hộ, chủ về sự che giấu, tĩnh lặng, mật mưu kế sách, thích hợp mai phục, tàng binh.

4.  **Lục Hợp**: Ngũ hành thuộc Mộc (phương Đông), thần hộ vệ, chủ về hòa hợp, hòa giải, giao dịch, hôn nhân, bạn bè liên kết.

5.  **Bạch Hổ (Câu Trần)**: Ngũ hành thuộc Kim (phương Tây), thần hung sát, chủ về tranh đấu, binh đao, hình thương, tai nạn, tật bệnh, quan sự đổ máu.

6.  **Huyền Vũ (Chu Tước)**: Ngũ hành thuộc Thủy (phương Bắc), thần gian trá, chủ về trộm cắp, khẩu thiệt thị phi, mưu mô ám hại, mất mát giấy tờ.

7.  **Cửu Địa**: Ngũ hành thuộc Thổ (Khôn Thổ), có đức dày chở che vạn vật, tính chất nhu thuận, trầm tĩnh, lợi cho việc đóng quân phòng thủ, gieo trồng, mai táng.

8.  **Cửu Thiên**: Ngũ hành thuộc Kim (Càn Kim), tính cương cường hiếu chiến, chuyển động không ngừng, thích hợp cho việc xuất binh đánh trận, hành quân, thăng tiến, bay xa.

### 3. Quy tắc an Bát Thần theo Cục số Âm / Dương

Khác với Thiên bàn và Bát Môn (luôn an thuận theo chiều kim đồng hồ), **chiều an của Bát Thần được quyết định trực tiếp bởi tính chất Âm Độn hay Dương Độn của trận**:

1.  **Dương Độn (+)**:

    - An **thuận chiều kim đồng hồ** qua 8 cung ngoại vi: Khảm 1 → Cấn 8 → 3 → Tốn 4 → Ly 9 → Khôn 2 → Đoài 7 → Càn 6 → về Khảm 1

    - Từ cung có Đại Trực Phù (đặt thần **Trực Phù**), lần lượt an thuận chiều kim đồng hồ: *Đằng Xà → Thái Âm → Lục Hợp → Bạch Hổ → Huyền Vũ → Cửu Địa → Cửu Thiên*.

2.  **Âm Độn (-)**:

    - An **ngược chiều kim đồng hồ** qua 8 cung ngoại vi: Khảm 1 → 6 → Đoài 7 → Khôn 2 → Ly 9 → Tốn 4 → Chấn 3 → Cấn 8 → Khảm 1

    - Từ cung có Đại Trực Phù (đặt thần **Trực Phù**), lần lượt an ngược chiều kim đồng hồ: *Đằng Xà → → rightarrow → Thái Âm → → rightarrow → Lục Hợp → → rightarrow → Bạch Hổ → → rightarrow → Huyền Vũ → → rightarrow → Cửu Địa → → rightarrow → Cửu Thiên*.

### 4. Ví dụ minh họa thực tế từ nguồn sách

**Ví dụ 1: Dương Độn 3 Cục, Giờ Canh Ngọ (Trận Dương Độn - Đi Thuận)**

- **Xác định từ các bước trước**:

  - Trận: **Dương Độn 3 Cục (+)**.

  - Ở Bước 6, sao Đại Trực Phù là **Thiên Xung** bay đến đóng tại **Trung cung 5 (gửi Khôn 2)**.

- **Tiến hành an Bát Thần**:

  - Đặt thần **Trực Phù** tại cung **Khôn 2**.

  - Vì là trận **Dương Độn**, an các thần tiếp theo theo **chiều thuận kim đồng hồ**:

    - Cung **Đoài 7**: **Đằng Xà**

    - Cung **Càn 6**: **Thái Âm**

    - Cung **Khảm 1**: **Lục Hợp**

    - Cung **Cấn 8**: **Bạch Hổ** (Câu Trần)

    - Cung **Chấn 3**: **Huyền Vũ** (Chu Tước)

    - Cung **Tốn 4**: **Cửu Địa**

    - Cung **Ly 9**: **Cửu Thiên** *(Trùng khớp tuyệt đối với đồ hình giải thích chuyển động Thần bàn tại trang 80 của sách)*.

**Ví dụ 2: Giờ Tân Mão, Tiết Hạ chí, Âm Độn 9 Cục (Trận Âm Độn - Đi Nghịch)**

- **Xác định từ các bước trước**:

  - Trận: **Âm Độn 9 Cục (-)**.

  - Ở Bước 6, sao Đại Trực Phù là **Thiên Trụ** trên Thiên bàn tọa ở cung **Càn 6**.

- **Tiến hành an Bát Thần**:

  - Đặt thần **Trực Phù** tại cung **Càn 6**.

  - Vì là trận **Âm Độn**, an các thần tiếp theo theo **chiều ngược kim đồng hồ**:

    - Cung **Đoài 7**: **Đằng Xà**

    - Cung **Khôn 2**: **Thái Âm** (Thái Dương)

    - Cung **Ly 9**: **Lục Hợp**

    - Cung **Tốn 4**: **Bạch Hổ**

    - Cung **Chấn 3**: **Huyền Vũ**

    - Cung **Cấn 8**: **Cửu Địa**

    - Cung **Khảm 1**: **Cửu Thiên** *(Trùng khớp với ví dụ minh họa mặt âm của Thần bàn tại trang 79 của sách)*.

### 5. Kết quả hoàn thành của Bước 8 và Tổng thể Bàn Trận

Hoàn tất Bước 8 là bạn đã khóa lại toàn bộ cấu trúc 4 tầng chuẩn mực của một bàn cờ Kỳ Môn Độn Giáp hoàn chỉnh:

1.  **Địa bàn (Tầng 1 - Đất)**: Tọa độ Bát quái Cửu cung cố định cùng 9 Thiên can Địa bàn (Lục Nghi, Tam Kỳ).

2.  **Nhân bàn (Tầng 2 - Người)**: Tám cửa Bát Môn (*Khai, Hưu, Sinh, Thương, Đỗ, Cảnh, Tử, Kinh*) do Trực Sử dẫn dắt, biểu thị mọi sự việc và hành động nhân thế.

3.  **Thiên bàn (Tầng 3 - Trời)**: Cửu Tinh và các Thiên can thượng tầng do Đại Trực Phù dẫn dắt, thể hiện thiên thời và xu thế của trời đất.

4.  **Thần bàn (Tầng 4 - Thần)**: Tám vị Thần sát do Tiểu Trực Phù dẫn dắt vận hành thuận/nghịch theo Âm/Dương độn, phản ánh những yếu tố vô hình, trợ lực hay ám hại.

Từ bàn cờ 4 tầng này, người dự trắc có thể đối chiếu can trên - can dưới, môn - tinh - thần - cung để tìm ra các cách cục cát hung (*Tam kỳ đắc sứ, Ngọc nữ thủ môn, Thiên độn, Địa độn, Bạch Hổ xương cuồng, Phản ngâm, Phục ngâm...*) và đưa ra quyết sách chính xác.

## BƯỚC 9: XÁC ĐỊNH MÃ TINH (DỊCH MÃ / THIÊN MÃ)

Trong hệ thống Kỳ Môn Độn Giáp của Lưu Bá Ôn, **Mã Tinh** (còn gọi là **Dịch Mã** hay **Thiên Mã**) là một thần sát đặc biệt đại diện cho sự vận động, di chuyển, biến động, bôn ba, tin tức thư tín, xuất hành viễn chinh, hoặc sự chuyển biến mau lẹ của sự việc. Khi kết hợp với các cát tinh, cát môn, Mã Tinh chủ về thăng quan tiến chức, công danh nhanh chóng phát đạt; khi gặp hung cách, nó báo hiệu sự sụp đổ mau lẹ, tai bay vạ gió hoặc trốn chạy.

### 1. Nguyên lý xác định Mã Tinh theo Tam Hợp Địa Chi

Mã Tinh được xác định trực tiếp căn cứ vào **Địa Chi của giờ lập trận** (Thời chi đã xác định qua phép Ngũ Tý Độn ở Bước 1).

Theo quy luật ngũ hành tương sinh tương tác cổ truyền, 12 Địa Chi được chia làm **4 nhóm Tam Hợp cục**:

1.  **Thân - Tý - Thìn** hợp thành Thủy cục.

2.  **Dần - Ngọ - Tuất** hợp thành Hỏa cục.

3.  **Tỵ - Dậu - Sửu** hợp thành Kim cục.

4.  **Hợi - Mão - Mùi** hợp thành Mộc cục.

**Quy tắc an Mã Tinh:**

*Vị trí của Mã Tinh luôn luôn đóng tại ngôi vị **Trường sinh** của ngũ hành xung đối (hoặc lấy Địa chi xung đối với chi đầu tiên của bộ Tam Hợp)*:

- **Địa Chi giờ thuộc nhóm Hợi, Mão, Mùi**: Mã Tinh an tại **Tỵ**.

- **Địa Chi giờ thuộc nhóm Dần, Ngọ, Tuất**: Mã Tinh an tại **Thân**.

- **Địa Chi giờ thuộc nhóm Thân, Tý, Thìn**: Mã Tinh an tại **Dần**.

- **Địa Chi giờ thuộc nhóm Tỵ, Dậu, Sửu**: Mã Tinh an tại **Hợi**.

### 2. Đối chiếu Địa Chi Mã Tinh vào Lạc Thư Cửu Cung

Sau khi đã tìm được Địa Chi nơi Mã Tinh đóng, tiến hành đối chiếu với vị trí phân bổ của 12 Địa Chi trên **Lạc Thư Cửu Cung** (8 quẻ phương vị) để xác định chính xác cung số và phương hướng của bàn trận:

- 12 Địa Chi được an định quanh Cửu Cung:

  - Cung Khảm 1: Chi **Tý** (Chính Bắc).

  - Cung Cấn 8: Chi **Sửu, Dần** (phương Đông Bắc).

  - Cung Chấn 3: Chi **Mão** (Chính Đông).

  - Cung Tốn 4: Chi **Thìn, Tỵ** (phương Đông Nam).

  - Cung Ly 9: Chi **Ngọ** (Chính Nam).

  - Cung Khôn 2: Chi **Mùi, Thân** (phương Tây Nam).

  - Cung Đoài 7: Chi **Dậu** (Chính Tây).

  - Cung Càn 6: Chi **Tuất, Hợi** (phương Tây Bắc).

**Bảng quy đổi toàn diện Mã Tinh ra Cửu Cung:**

| **Nhóm Tam Hợp của Địa Chi Giờ** | **Giờ lập trận cụ thể**                | **Địa Chi của Mã Tinh** | **Cung vị Cửu Cung tương ứng** | **Phương hướng** |
|----------------------------------|----------------------------------------|-------------------------|--------------------------------|------------------|
| **Hợi - Mão - Mùi**              | Giờ **Hợi**, giờ **Mão**, giờ **Mùi**  | **Tỵ**                  | **Cung Tốn 4**                 | **Đông Nam**     |
| **Dần - Ngọ - Tuất**             | Giờ **Dần**, giờ **Ngọ**, giờ **Tuất** | **Thân**                | **Cung Khôn 2**                | **Tây Nam**      |
| **Thân - Tý - Thìn**             | Giờ **Thân**, giờ **Tý**, giờ **Thìn** | **Dần**                 | **Cung Cấn 8**                 | **Đông Bắc**     |
| **Tỵ - Dậu - Sửu**               | Giờ **Tỵ**, giờ **Dậu**, giờ **Sửu**   | **Hợi**                 | **Cung Càn 6**                 | **Tây Bắc**      |

*(Ghi nhớ: Bốn vị trí của Mã Tinh luôn luôn rơi vào **Tứ Ngang / Tứ Duy** của Cửu Cung, tức 4 cung góc gồm **Cấn 8, Tốn 4, Khôn 2, Càn 6**).*

### 3. Ví dụ minh họa thực tế

- **Ví dụ 1 (Từ ví dụ ở các bước trước)**:

  - Thời điểm lập trận vào giờ **Canh Ngọ**.

  - Địa Chi của giờ là **Ngọ**, thuộc nhóm Tam Hợp **Dần - Ngọ - Tuất**.

  - Tra bảng quy tắc: Giờ Dần, Ngọ, Tuất thì Mã Tinh an tại **Thân**.

  - Địa Chi **Thân** thuộc phương Tây Nam, đối chiếu Cửu Cung tương ứng với **Cung Khôn 2**.

  - *Kết luận*: Trong trận này, **Mã Tinh đóng tại Cung Khôn 2 (phương Tây Nam)**.

- **Ví dụ 2**:

  - Giờ lập trận là giờ **Tân Mão**.

  - Địa Chi của giờ là **Mão**, thuộc nhóm Tam Hợp **Hợi - Mão - Mùi**.

  - Tra bảng: Nhóm Hợi, Mão, Mùi thì Mã Tinh an tại **Tỵ**.

  - Địa Chi **Tỵ** thuộc phương Đông Nam, đối chiếu Cửu Cung tương ứng với **Cung Tốn 4**.

  - *Kết luận*: **Mã Tinh đóng tại Cung Tốn 4 (phương Đông Nam)**.

### 4. Vai trò của Mã Tinh trong dự trắc Kỳ Môn

- **Chỉ thị sự chuyển động & Động tĩnh**: Cung vị có Mã Tinh tọa thủ là cung phát sinh sự vận động mạnh mẽ nhất của trận cờ. Mọi sự việc liên quan đến xuất hành, đi xa, đổi chỗ ở, chuyển công tác, tin tức giao liên đều lấy cung có Mã Tinh làm một trong những trọng điểm để tham khán.

- **Kích hoạt cát/hung**:

  - Nếu Mã Tinh lâm vào cung có **Tam Kỳ** (Ất, Bính, Đinh) cùng các cát môn (**Khai, Hưu, Sinh**) và cát tinh: chủ về xuất hành đại lợi, lập công hiển hách, thăng quan nhanh chóng.

  - Nếu Mã Tinh lâm vào cung gặp hung tinh, hung môn (như Tử, Thương, Kinh), hung thần (như Bạch Hổ, Huyền Vũ) hoặc cách cục xung khắc, sa vào Không Vong: chủ về tai nạn xe cộ dọc đường, bôn ba vất vả mà hao tài tốn của, hoặc điềm báo phải trốn chạy, bại trận.

### 5. Kết quả thu được của Bước 9

Hoàn tất Bước 9, bạn xác định được:

1.  **Địa Chi Mã Tinh**: Thuộc một trong 4 chi sinh (*Dần, Thân, Tỵ, Hợi*).

2.  **Cung vị và phương hướng của Mã Tinh**: Xác định chính xác Mã Tinh đang chiếu vào **Cung Cấn 8 (Đông Bắc)**, **Cung Tốn 4 (Đông Nam)**, **Cung Khôn 2 (Tây Nam)** hay **Cung Càn 6 (Tây Bắc)** trên đồ bàn.

## BƯỚC 10: XÁC ĐỊNH KHÔNG VONG (TUẦN KHÔNG)

Trong hệ thống **Kỳ Môn Độn Giáp**, **Không Vong** (còn gọi là **Tuần Không** hay **Thiên Không**) là một khái niệm mang tính chất cốt lõi khi thẩm định thực hư, cát hung của bàn trận. Khi một cung vị rơi vào thế Không Vong, bản chất của cung đó sẽ chuyển thành hư ảo, không thật, khí lực bị suy thoái: *"Cát phùng Không tắc bất cát, Hung phùng Không tắc bất hung"* (Điềm lành gặp Không thì mất tác dụng, điềm dữ gặp Không thì tiêu tan).

### 1. Nguyên lý hình thành Không Vong (Tuần Không)

Người xưa sử dụng sự phối hợp giữa **10 Thiên Can** và **12 Địa Chi** để biểu thị thời gian:

- 10 Thiên Can: *Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý*.

- 12 Địa Chi: *Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi*.

Mỗi một chu kỳ phối hợp gồm 10 ngày (hoặc 10 giờ) gọi là **một Tuần** (do một can Giáp đứng đầu thống lĩnh). Vì 10 Thiên Can chỉ phối hợp được với 10 Địa Chi, do đó trong mỗi tuần sẽ luôn luôn dư ra **2 Địa Chi không có Thiên Can phối chiếu**. Hai Địa Chi bị cô lập này được gọi là **Tuần Không** (hay **Không Vong**, trong thuật cổ còn gọi vị trí này là vị trí của **Cô**).

Vòng 60 Giáp Tý gồm có 6 tuần (Lục Giáp), tương ứng với 6 trạng thái Không Vong.

### 2. Bài ca quyết Tuần Không theo Lưu Bá Ôn

Sách *Kim Hàm Ngọc Kính Kỳ Môn Độn Giáp* ghi lại bài nguyên văn định nghĩa Tuần Không:

**Nguyên văn:**  
*“Giáp Tý tuần trung Tuất Hợi không,*  
*Giáp Tuất tuần trung Thân Dậu không,*  
*Giáp Thân tuần trung Ngọ Mùi không.*  
*Giáp Ngọ tuần trung Thìn Tỵ không,*  
*Giáp Thìn tuần trung Dần Mão không,*  
*Giáp Dần tuần trung Tý Sửu không.”*

### 3. Bảng quy đổi Tuần Thủ và Hai Địa Chi Không Vong

Căn cứ vào **Tuần Thủ** của giờ lập trận đã xác định từ **Bước 4**, ta tra cứu ra 2 Địa Chi Không Vong tương ứng:

| **STT** | **Tuần Thủ (của Giờ)** | **Cờ Lục Nghi** | **Hai Địa Chi Không Vong** | **Tượng Cô (Theo Phép Cô Hư)** | **Tượng Hư (Địa chi xung đối)** |
|---------|------------------------|-----------------|----------------------------|--------------------------------|---------------------------------|
| **1**   | **Giáp Tý**            | Mậu             | **Tuất, Hợi**              | Tuất, Hợi                      | Thìn, Tỵ                        |
| **2**   | **Giáp Tuất**          | Kỷ              | **Thân, Dậu**              | Thân, Dậu                      | Dần, Mão                        |
| **3**   | **Giáp Thân**          | Canh            | **Ngọ, Mùi**               | Ngọ, Mùi                       | Tý, Sửu                         |
| **4**   | **Giáp Ngọ**           | Tân             | **Thìn, Tỵ**               | Thìn, Tỵ                       | Tuất, Hợi                       |
| **5**   | **Giáp Thìn**          | Nhâm            | **Dần, Mão**               | Dần, Mão                       | Thân, Dậu                       |
| **6**   | **Giáp Dần**           | Quý             | **Tý, Sửu**                | Tý, Sửu                        | Ngọ, Mùi                        |

### 4. Đối chiếu Địa Chi Không Vong vào Lạc Thư Cửu Cung

Sau khi đã xác định được 2 Địa Chi Không Vong, tiến hành đối chiếu vào vị trí cố định của 12 Địa Chi trên **Lạc Thư Cửu Cung** để xác định **Cung vị bị Không Vong** trên bàn cờ Kỳ Môn:

- **Tuần Giáp Tý (Không vong tại Tuất, Hợi)**:

  - Chi *Tuất* và *Hợi* đều quy về phương Tây Bắc, thuộc **Cung Càn 6**.

  - **Cung Càn 6 bị Không Vong hoàn toàn** (cả 2 chi cùng đóng ở 1 cung).

- **Tuần Giáp Tuất (Không vong tại Thân, Dậu)**:

  - Chi *Thân* thuộc phương Tây Nam, nằm ở **Cung Khôn 2**.

  - Chi *Dậu* thuộc phương Chính Tây, nằm ở **Cung Đoài 7**.

  - **Cung Khôn 2 và Cung Đoài 7 bị Không Vong** (mỗi cung chịu 1 nửa khí Không Vong).

- **Tuần Giáp Thân (Không vong tại Ngọ, Mùi)**:

  - Chi *Ngọ* thuộc phương Chính Nam, nằm ở **Cung Ly 9**.

  - Chi *Mùi* thuộc phương Tây Nam, nằm ở **Cung Khôn 2**.

  - **Cung Ly 9 và Cung Khôn 2 bị Không Vong**.

- **Tuần Giáp Ngọ (Không vong tại Thìn, Tỵ)**:

  - Chi *Thìn* và *Tỵ* đều quy về phương Đông Nam, thuộc **Cung Tốn 4**.

  - **Cung Tốn 4 bị Không Vong hoàn toàn** (cả 2 chi cùng đóng ở 1 cung).

- **Tuần Giáp Thìn (Không vong tại Dần, Mão)**:

  - Chi *Dần* thuộc phương Đông Bắc, nằm ở **Cung Cấn 8**.

  - Chi *Mão* thuộc phương Chính Đông, nằm ở **Cung Chấn 3**.

  - **Cung Cấn 8 và Cung Chấn 3 bị Không Vong**.

- **Tuần Giáp Dần (Không vong tại Tý, Sửu)**:

  - Chi *Tý* thuộc phương Chính Bắc, nằm ở **Cung Khảm 1**.

  - Chi *Sửu* thuộc phương Đông Bắc, nằm ở **Cung Cấn 8**.

  - **Cung Khảm 1 và Cung Cấn 8 bị Không Vong**.

### 5. Ý nghĩa và Ứng dụng của Không Vong trong Chiêm Đoán Kỳ Môn

Việc xác định cung vị Không Vong có tầm ảnh hưởng mang tính quyết định đến việc giải đoán:

1.  **Thực hóa Hư, Hư hóa Thực**:

    - Cung gặp Không Vong đại diện cho sự việc chưa ngã ngũ, lòng dạ tráo trở, lời hứa suông, sự việc hư trương thanh thế nhưng bên trong rỗng tuếch.

    - Người xem mưu cầu công danh, tài lộc, thi cử nếu cửa tốt (**Khai, Hưu, Sinh**), Tam Kỳ hay dụng thần lâm Không Vong thì khó lòng toại nguyện hoặc công lao hóa thành vô ích.

2.  **Khái niệm "Cơ hội trong Không Vong" (Điền thực & Xung không)**:

    - Trạng thái Không Vong không tồn tại vĩnh viễn mà chỉ có hiệu lực trong khoảng thời gian của tuần đó.

    - Khi dòng thời gian dịch chuyển đến ngày/giờ là Địa Chi của cung Không Vong (gọi là **Điền thực** - lấp đầy chỗ trống) hoặc gặp ngày/giờ xung chiếu với cung Không Vong (gọi là **Xung Không**), sự việc sẽ thoát khỏi trạng thái hư ảo để bộc phát ra ngoài đời thực.

3.  **Phép Cô Hư trong Binh pháp Kỳ Môn**:

    - *“Đạo Binh pháp Kỳ Môn: Quay lưng về Cô, hướng mặt về Hư thì đánh trăm trận trăm thắng”*. Cung Không Vong chính là đất của **Cô**, cung đối diện trực xung chính là **Hư**. Trong bố trận hành quân, tướng lĩnh chiếm giữ phương vị của Cô để nhìn sang phương vị của Hư sẽ nắm chắc phần thắng.

### 6. Kết quả thu được của Bước 10

Kết thúc Bước 10, bạn đã nắm giữ toàn bộ hệ thống tọa độ Không Vong của bàn trận:

1.  **Địa Chi Không Vong**: Xác định rõ 2 chi trống khí trong tuần (*ví dụ: Tuất, Hợi* hoặc *Thìn, Tỵ*).

2.  **Cung vị Không Vong trên Cửu Cung**: Đánh dấu trực tiếp ký hiệu Không Vong (thường viết tắt là **"KV"** hoặc **"〇"**) lên 1 hoặc 2 cung vị tương ứng trên bàn trận để làm cơ sở định lượng cát hung tối hậu.

## TỔNG KẾT QUY TRÌNH LẬP TRẬN KỲ MÔN ĐỘN GIÁP (10 BƯỚC)

Đến đây, bạn đã hoàn thiện tuần tự và chuẩn xác toàn bộ **10 bước lập bàn Kỳ Môn Độn Giáp** theo đúng nguyên bản *Kỳ Môn Độn Giáp*:

- **Bước 1**: Đổi Tứ trụ ngày giờ (Ngũ Tý Độn) & Xác định Tiết khí.

- **Bước 2**: Xác định Phù Đầu & Tam Nguyên để chốt Cục số Âm/Dương.

- **Bước 3**: An Thiên Can Địa Bàn (Lục Nghi, Tam Kỳ thuận/nghịch theo Cục).

- **Bước 4**: Xác định Tuần Thủ & Lá Cờ Lục Nghi ẩn tàng.

- **Bước 5**: Tìm Cung vị Cờ để xác định Đại Trực Phù (Cửu Tinh) & Trực Sử (Bát Môn).

- **Bước 6**: Chuyển Thiên Bàn (Cửu Tinh và Can Thiên bàn bay thuận kim đồng hồ theo can của Giờ).

- **Bước 7**: Chuyển Nhân Bàn (Trực Sử bay theo Cửu Cung rồi Bát Môn xoay thuận kim đồng hồ).

- **Bước 8**: An Thần Bàn (Bát Thần khởi từ Đại Trực Phù, Dương Độn đi thuận, Âm Độn đi nghịch).

- **Bước 9**: Xác định Mã Tinh (Dịch Mã theo Tam Hợp cục của chi Giờ).

- **Bước 10**: Xác định Không Vong (Tuần Không theo Tuần Thủ của Giờ).

## BƯỚC 11: AN BÁT THẦN ĐỊA BÀN (ÁM CAN BÁT THẦN ĐỊA BÀN)

Trong hệ thống Kỳ Môn Độn Giáp, bên cạnh **Bát Thần Thiên Bàn** (tầng thần sát chuyển động theo sao Đại Trực Phù ở Bước 8) biểu thị sự trợ lực hay ám hại từ thiên thời và ngoại cảnh, còn có tầng **Bát Thần Địa Bàn** (còn gọi là *Ám Thần* hay *Ám Can Bát Thần Địa Bàn*). Tầng này phản ánh các mối quan hệ địa lý, thực lực ngầm, những nhân tố tiềm ẩn cố định dưới mặt đất tác động trực tiếp vào cơ sở của sự việc.

Quy tắc an Ám Can Bát Thần Địa Bàn được phân định chặt chẽ thành **hai trường hợp** căn cứ vào tính chất của thời thần và cục diện trận cờ:

### 1. Phân loại hai trường hợp an Bát Thần Địa Bàn

**Trường hợp thứ nhất:** Giờ Lục Giáp, Phục Ngâm hoặc Phản Ngâm toàn trận

Áp dụng khi thời điểm lập trận rơi vào một trong các hoàn cảnh đặc biệt:

1.  **Giờ thuộc tuần Lục Giáp**: Gồm 6 thời thần đầu tuần là **Giáp Tý, Giáp Tuất, Giáp Thân, Giáp Ngọ, Giáp Thìn, Giáp Dần** (lúc này Can giờ chính là Can Giáp, tướng soái lâm trận).

2.  **Cục diện Phục Ngâm toàn trận**: Toàn bộ hệ thống Tinh, Môn hoặc Can trên Thiên bàn đều trùng khít vào bản cung gốc của Địa bàn (không có sự xê dịch vị trí).

3.  **Cục diện Phản Ngâm toàn trận**: Thiên bàn và Địa bàn hoàn toàn xung đối 180 độ qua Cửu Cung (ví dụ Khảm sang Ly, Cấn sang Khôn...).

4.  **Quy tắc an**:

    - Tại trường hợp này, **Bát Thần Địa Bàn được an đồng bộ tương ứng 1:1 với Bát Thần Thiên Bàn** (đã an ở Bước 8).

    - Nghĩa là tại mỗi cung vị Lạc Thư, Bát Thần Thiên Bàn đang có vị thần nào ngự trị thì Ám Can Bát Thần Địa Bàn tại cung đó cũng mang đúng vị thần tương ứng.

**Trường hợp thứ hai:** Giờ thông thường (Không thuộc Lục Giáp, Phục Ngâm hay Phản Ngâm)

Đây là trường hợp phổ biến chiếm phần lớn các thời thần dự trắc:

- **Cung khởi đầu**: Lấy **vị trí gốc nguyên thủy của Đại Trực Phù (Cửu Tinh)** trên bảng Cửu Tinh bản cung (đã xác định ở Bước 5) làm cung khởi đầu để đặt vị thần đầu tiên là **Trực Phù**.

- **Thứ tự 8 vị thần (cố định bất biến)**: Trực Phù → ĐằngXà → Thái Âm → Lục Hợp → Bạch Hổ Huyền Vũ → Cửu Địa → Cửu Thiên

- **Chiều an theo Cửu Cung**: Được quyết định trực tiếp bởi tính chất của trận:

  - **Dương Độn (+)**: An theo **chiều thuận kim đồng hồ** qua 8 cung ngoại vi: Khảm 1 → Cấn 8 → Chấn 3 → Tốn 4 → Ly 9 → Khôn 2 → Đoài 7 → Càn 6 → về Khảm 1

  - **Âm Độn (-)**: An theo **chiều nghịch kim đồng hồ** qua 8 cung ngoại vi: Khảm 1 → Càn 6 → Đoài 7 → Khôn 2 → Ly 9 → Tốn 4 → Chấn 3 → Cấn 8 → về Khảm 1

### 2. Bảng quy chiếu Cung Gốc Cửu Tinh khởi đầu Bát Thần Địa Bàn

Dưới đây là vị trí khởi Trực Phù của Bát Thần Địa Bàn (cho Trường hợp 2) tương ứng với từng ngôi sao Đại Trực Phù:

| **Đại Trực Phù (Cửu Tinh)**      | **Cung vị bản gốc nguyên thủy** | **Cung khởi đầu an Trực Phù Địa Bàn** |
|----------------------------------|---------------------------------|---------------------------------------|
| **Thiên Bồng**                   | Cung 1 (Khảm)                   | **Cung Khảm 1**                       |
| **Thiên Nhuế** *(kèm Thiên Cầm)* | Cung 2 (Khôn)                   | **Cung Khôn 2**                       |
| **Thiên Xung**                   | Cung 3 (Chấn)                   | **Cung Chấn 3**                       |
| **Thiên Phù**                    | Cung 4 (Tốn)                    | **Cung Tốn 4**                        |
| **Thiên Cầm**                    | Cung 5 (Trung Cung gửi Khôn 2)  | **Cung Khôn 2**                       |
| **Thiên Tâm**                    | Cung 6 (Càn)                    | **Cung Càn 6**                        |
| **Thiên Trụ**                    | Cung 7 (Đoài)                   | **Cung Đoài 7**                       |
| **Thiên Nhậm**                   | Cung 8 (Cấn)                    | **Cung Cấn 8**                        |
| **Thiên Anh**                    | Cung 9 (Ly)                     | **Cung Ly 9**                         |

### 3. Ví dụ minh họa chi tiết

Ví dụ 1 (Theo ví dụ tiêu chuẩn): Đại Trực Phù là Thiên Tâm Tinh (gốc tại Cung Càn 6)

Giả sử trận không thuộc giờ Lục Giáp, không Phục Ngâm, không Phản Ngâm:

- Bản cung gốc của sao **Thiên Tâm** là **Cung Càn 6**, do đó Bát Thần Địa Bàn bắt đầu an thần **Trực Phù tại Cung Càn 6**.

- **Nếu là trận Dương Độn (+)** (Đi thuận kim đồng hồ):

  - Cung **Càn 6**: **Trực Phù**

  - Cung **Khảm 1**: **Đằng Xà**

  - Cung **Cấn 8**: **Thái Âm**

  - Cung **Chấn 3**: **Lục Hợp**

  - Cung **Tốn 4**: **Bạch Hổ**

  - Cung **Ly 9**: **Huyền Vũ**

  - Cung **Khôn 2**: **Cửu Địa**

  - Cung **Đoài 7**: **Cửu Thiên**

- **Nếu là trận Âm Độn (-)** (Đi nghịch kim đồng hồ):

  - Cung **Càn 6**: **Trực Phù**

  - Cung **Đoài 7**: **Đằng Xà**

  - Cung **Khôn 2**: **Thái Âm**

  - Cung **Ly 9**: **Lục Hợp**

  - Cung **Tốn 4**: **Bạch Hổ**

  - Cung **Chấn 3**: **Huyền Vũ**

  - Cung **Cấn 8**: **Cửu Địa**

  - Cung **Khảm 1**: **Cửu Thiên**

Ví dụ 2 (Liên kết chuỗi từ các bước trước): Trận Dương Độn 3 Cục, Giờ Canh Ngọ

- **Xét điều kiện**: Giờ Canh Ngọ (không phải giờ Giáp), trận không Phục/Phản Ngâm toàn cục Thuộc **Trường hợp thứ hai**.

- **Xác định vị trí gốc**:

  - Ở Bước 5, Đại Trực Phù được xác định là sao **Thiên Xung**.

  - Bản cung gốc của Thiên Xung là **Cung Chấn 3**.

- **Tiến hành an (Dương Độn đi thuận kim đồng hồ)**:

  - Cung **Chấn 3**: Khởi **Trực Phù**

  - Cung **Tốn 4**: **Đằng Xà**

  - Cung **Ly 9**: **Thái Âm**

  - Cung **Khôn 2**: **Lục Hợp**

  - Cung **Đoài 7**: **Bạch Hổ**

  - Cung **Càn 6**: **Huyền Vũ**

  - Cung **Khảm 1**: **Cửu Địa**

  - Cung **Cấn 8**: **Cửu Thiên**

### 4. Kết quả thu được của Bước 11

Hoàn tất Bước 11, bạn đã xác lập hoàn chỉnh hệ thống **Ám Can Bát Thần Địa Bàn**:

1.  Phân định rạch ròi trạng thái đặc biệt (Giờ Lục Giáp/Phục/Phản Ngâm) hay trạng thái thông thường (khởi từ cung gốc Cửu Tinh).

2.  Tạo nên thế đối chiếu đa tầng giữa **Bát Thần Thiên Bàn** (trên) và **Bát Thần Địa Bàn** (dưới) tại mỗi cung phương vị, mở ra các tầng đoán định chuyên sâu về sự tương sinh, tương khắc, che chở hay phản trắc giữa thiên cơ bên ngoài và thực lực bên trong.

## BƯỚC 12: AN ÁM CAN (ẨN CAN) THEO THIÊN CAN GIỜ (THEO TRỰC SỬ)

Trong hệ thống Kỳ Môn Độn Giáp, bên cạnh Thiên Can hiển lộ trên Địa bàn (tầng đất) và Thiên bàn (tầng trời), còn có một hệ thống can vô hình chuyển động âm thầm gọi là **Ám Can (Ẩn Can)**. Ám Can phản ánh động cơ ngầm, nguyên nhân sâu xa, đầu mối sự việc giấu kín, hoặc những sự biến chuyển đột ngột chưa bộc lộ ra bề ngoài.

Phép an **Ám Can Thiên Bàn theo Thiên Can giờ (dẫn dắt bởi Trực Sử)** được tiến hành theo nguyên tắc đưa **Thiên Can của giờ lập trận** nhập vào cung khởi đầu, rồi từ đó bay qua Cửu Cung theo thứ tự cố định của Lục Nghi, Tam Kỳ.

Quy trình xác định cung khởi đầu được phân thành **hai trường hợp**:

### 1. Phân loại hai trường hợp an Ám Can Thiên Bàn

**Trường hợp thứ nhất: Giờ Lục Giáp, Phục Ngâm hoặc Phản Ngâm toàn trận**

Áp dụng khi thời điểm lập trận rơi vào một trong các trạng thái đặc thù:

1.  **Giờ thuộc Lục Giáp**: Gồm 6 thời thần đầu tuần (*Giáp Tý, Giáp Tuất, Giáp Thân, Giáp Ngọ, Giáp Thìn, Giáp Dần*). Lúc này Thiên Can của giờ là Giáp (mang cờ Lục Nghi ẩn tàng).

2.  **Cục diện Phục Ngâm toàn trận**: Tinh, Môn, Can trùng khớp hoàn toàn với vị trí gốc nguyên thủy của Địa bàn.

3.  **Cục diện Phản Ngâm toàn trận**: Tinh, Môn, Can hoàn toàn đối nghịch 180 độ qua Cửu Cung.

- **Quy tắc an**:

  - Đưa **Thiên Can của giờ ẩn nhập vào Trung Cung (Cung 5)**.

  - Lấy chính **Cung 5** làm vị trí khởi đầu để an theo chiều bay của trận:

    - **Dương Độn (+)**: An theo **chiều thuận của Cửu Cung** qua 9 cung: 5 → 6 → 7 → 8 → 9 → 1 → 2 → 3 → 4

    - **Âm Độn (-)**: An theo **chiều nghịch của Cửu Cung** qua 9 cung: 5 → 4 → 3 → 2 → 1 → 9 → 8 → 7 → 6

**Trường hợp thứ hai: Giờ thông thường (Không thuộc Lục Giáp, Phục Ngâm hay Phản Ngâm)**

Đây là trường hợp ứng dụng chủ yếu trong phần lớn các quẻ chiêm:

- **Cung khởi đầu**: Lấy chính **cung vị của Trực Sử (Bát Môn)** đã xác định và an định tại **Bước 7** làm cung khởi đầu để tiếp nhận Thiên Can của giờ.

- **Quy tắc bay Cửu Cung**:

  - **Dương Độn (+)**: Tiến hành phi can theo **chiều thuận số Cửu Cung** (bắt đầu từ số cung của Trực Sử):

    - *Ví dụ*: Trực Sử là **Hưu Môn** đang đóng tại **Cung 6 (Càn)**, cung khởi đầu là 6. Thứ tự các cung bay thuận lần lượt là: 6 → 7 → 8 → 9 → 1 → 2 → 3 → 4 → 5

  - **Âm Độn (-)**: Tiến hành phi can theo **chiều nghịch số Cửu Cung** (bắt đầu từ số cung của Trực Sử):

    - *Ví dụ*: Trực Sử đang đóng tại **Cung 6 (Càn)**, cung khởi đầu là 6. Thứ tự các cung bay nghịch lần lượt là: 6 → 5 → 4 → 3 → 2 → 1 → 9 → 8 → 7

### 2. Thứ tự chuỗi Can an vào các cung

Tại cung khởi đầu (Cung 5 ở Trường hợp 1, hoặc Cung Trực Sử ở Trường hợp 2), ta đặt **Thiên Can của giờ lập trận** vào làm Ám Can đầu tiên. Các can tiếp theo sẽ lần lượt được an vào các cung kế tiếp theo đúng trật tự tuần hoàn khép kín bất biến của Lục Nghi và Tam Kỳ: Mậu → Kỷ → Canh → Tân → Nhâm → Quý → Đinh → Bính → Ất → quay lại Mậu

*(Từ Thiên Can của giờ, đi tiếp theo chuỗi tuần hoàn nói trên để lần lượt điền vào các cung theo thứ tự cung số Dương thuận / Âm nghịch đã xác lập).*

### 3. Ví dụ minh họa chi tiết

**Ví dụ minh họa: Trận Dương Độn 3 Cục, Giờ Canh Ngọ**

*(Tiếp nối dữ liệu xuyên suốt từ các bước trước)*:

1.  **Xét điều kiện**:

    - Giờ Canh Ngọ (không phải giờ Giáp), trận không Phục/Phản Ngâm toàn trận → Thuộc **Trường hợp thứ hai**.

2.  **Xác định cung khởi đầu**:

    - Ở Bước 7, Trực Sử là **Thương Môn** đã được an định tại **Cung 9 (Ly)**.

    - Do đó, cung khởi đầu để an Ám Can là **Cung 9 (Ly)**.

3.  **Tiến hành an Ám Can (Dương Độn đi thuận Cửu Cung)**:

    - Thứ tự các cung đi thuận từ Cung 9 là: 9 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

    - Thiên Can của giờ là **Canh**, đặt Canh tại cung khởi đầu (Cung 9). Sau Canh theo chuỗi Lục Nghi - Tam Kỳ là *Tân, Nhâm, Quý, Đinh, Bính, Ất, Mậu, Kỷ*.

    - Phân bổ cụ thể Ám Can vào Cửu Cung:

      - Cung **Ly 9**: Ám Can **Canh** (Cung khởi đầu của Trực Sử).

      - Cung **Khảm 1**: Ám Can **Tân**.

      - Cung **Khôn 2**: Ám Can **Nhâm**.

      - Cung **Chấn 3**: Ám Can **Quý**.

      - Cung **Tốn 4**: Ám Can **Đinh**.

      - Cung **Trung Cung 5**: Ám Can **Bính**.

      - Cung **Càn 6**: Ám Can **Ất**.

      - Cung **Đoài 7**: Ám Can **Mậu**.

      - Cung **Cấn 8**: Ám Can **Kỷ**.

### 4. Kết quả thu được của Bước 12

Hoàn tất Bước 12 mang lại các giá trị then chốt:

1.  **Ám Can Thiên Bàn hoàn chỉnh**: Mỗi cung trong Cửu Cung đều tiếp nhận một Ám Can ẩn tàng bên dưới.

2.  **Khám phá huyền cơ ẩn tàng**:

    - Ám Can khi phối hợp với Môn (Bát Môn) và Tinh (Cửu Tinh) tại cung đó sẽ chỉ ra những mưu sự bí mật, chuyện khuất tất, hoặc nguồn viện trợ ngầm.

    - Đặc biệt, nếu Ám Can là Tam Kỳ (*Ất, Bính, Đinh*) gia lâm vào cung cát môn sẽ tạo thành cách cục trợ lực ngầm vô cùng đắc lợi; nếu Ám Can là Canh, Tân gặp hung tinh, hung môn thì chủ về nguy cơ phục kích, phá hoại gián tiếp từ bên trong.

## TỔNG KẾT TOÀN DIỆN: QUY TRÌNH 12 BƯỚC LẬP TRẬN KỲ MÔN ĐỘN GIÁP

Đến đây, bạn đã hoàn tất trọn vẹn quy trình mẫu mực gồm **12 bước an bài một trận Kỳ Môn Độn Giáp** theo đúng phương pháp của kỳ môn độn giáp:

- **Bước 1**: Xác định Tứ Trụ, đổi giờ theo **Ngũ Tý Độn** và xác định **Tiết Khí**.

- **Bước 2**: Xác định **Phù Đầu** từ Can ngày, quy về **Tam Nguyên** (Thượng/Trung/Hạ) và chốt **Cục số Âm/Dương**.

- **Bước 3**: An **Thiên Can Địa Bàn** (Lục Nghi, Tam Kỳ) thuận/nghịch theo Cục số vào Cửu Cung.

- **Bước 4**: Xác định **Tuần Thủ** của giờ và lá **Cờ hiệu** (Lục Nghi ẩn tàng).

- **Bước 5**: Đối chiếu vị trí Cờ trên Địa bàn để tìm **Đại Trực Phù (Cửu Tinh)** và **Trực Sử (Bát Môn)** bản gốc.

- **Bước 6**: Chuyển **Thiên Bàn** (Đại Trực Phù và Can Thiên bàn bay đến cung của Can giờ, các sao xoay thuận kim đồng hồ).

- **Bước 7**: Chuyển **Nhân Bàn** (Trực Sử bay theo Cửu Cung đến điểm dừng, rồi Bát Môn xoay thuận kim đồng hồ).

- **Bước 8**: An **Bát Thần Thiên Bàn** (khởi Trực Phù tại Đại Trực Phù, Dương Độn đi thuận, Âm Độn đi nghịch kim đồng hồ).

- **Bước 9**: Xác định cung vị **Mã Tinh** theo Tam Hợp cục của Địa Chi giờ.

- **Bước 10**: Xác định hai Địa Chi và cung vị **Không Vong (Tuần Không)** theo Tuần Thủ.

- **Bước 11**: An **Ám Can Bát Thần Địa Bàn** (xét trường hợp đặc biệt hay khởi từ cung gốc Cửu Tinh).

- **Bước 12**: An **Ám Can Thiên Bàn** (theo Trực Sử bay qua Cửu Cung theo tính chất Âm/Dương của trận).

Toàn bộ bàn trận lúc này đã được kích hoạt đầy đủ 4 tầng không gian (Địa - Nhân - Thiên - Thần), hai hệ thống động - tĩnh, trục lộ - ám, sẵn sàng cho việc phân tích các cách cục và luận đoán cát hung.

## TỔNG KẾT TRÌNH TỰ LẬP TRẬN KỲ MÔN ĐỘN GIÁP (12 BƯỚC)

Dưới đây là bảng tổng hợp và bản thuyết minh chi tiết toàn bộ dữ liệu 12 bước lập trận theo hệ thống **Kỳ Môn Độn Giáp**

## BẢNG TỔNG HỢP 12 BƯỚC LẬP TRẬN

| **Bước** | **Nội dung thực hiện**                    | **Kết quả cần xác định**                                                                                                                                                                                         |
|----------|-------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **B1**   | **Đổi giờ, tra Tiết Khí**                 | Can Chi Tứ trụ (đổi giờ theo **Ngũ Tý Độn**); tên **Tiết khí**; phân định vận hành **Dương Độn** (sau Đông chí) hay **Âm Độn** (sau Hạ chí).                                                                     |
| **B2**   | **Xác định Phù Đầu & Tam Nguyên**         | Cặp Can Chi của **Phù Đầu** (đếm lùi về Giáp/Kỷ); phân định **Tam Nguyên** (Thượng/Trung/Hạ nguyên); chốt chính xác **Cục số** từ 1 đến 9.                                                                       |
| **B3**   | **An Thiên Can Địa Bàn**                  | An Lục Nghi và Tam Kỳ cố định: **Mậu – Kỷ – Canh – Tân – Nhâm – Quý – Đinh – Bính – Ất**. Mậu khởi tại cung của Cục số; **Dương đi thuận, Âm đi nghịch** Cửu Cung.                                               |
| **B4**   | **Xác định Tuần Thủ và Cờ**               | Tìm **Tuần Thủ** của giờ (đếm lùi về Giáp); xác định **Lá Cờ Lục Nghi** che giấu Giáp (*Mậu, Kỷ, Canh, Tân, Nhâm, Quý*).                                                                                         |
| **B5**   | **Xác định Đại Trực Phù và Trực Sử**      | Tìm cung vị của Cờ trên Địa bàn; tra bản cung gốc để xác định **Đại Trực Phù** (Cửu Tinh gốc) và **Trực Sử** (Bát Môn gốc).                                                                                      |
| **B6**   | **An Đại Trực Phù & Thiên Can Thiên Bàn** | Đưa Đại Trực Phù và Cờ Tuần Thủ đến cung của **Thiên Can giờ** trên Địa bàn; xoay Cửu Tinh và Can Thiên bàn **thuận chiều kim đồng hồ**.                                                                         |
| **B7**   | **An Trực Sử (Bát Môn)**                  | Từ cung gốc của Tuần Thủ, đếm can Giáp đến can giờ theo số Cửu Cung (**Dương thuận, Âm nghịch**). Dừng ở đâu an Trực Sử vào đó (cung 5 gửi cung 2); an Bát Môn **thuận chiều kim đồng hồ**.                      |
| **B8**   | **An Bát Thần Thiên Bàn**                 | Khởi thần **Trực Phù** tại cung của Đại Trực Phù Thiên bàn; an 8 thần theo thứ tự cố định: **Dương Độn đi thuận, Âm Độn đi nghịch** qua 8 cung.                                                                  |
| **B9**   | **Xác định Mã Tinh**                      | Dựa vào Tam Hợp của Địa Chi giờ xác định Địa Chi Mã Tinh (*Dần, Thân, Tỵ, Hợi*); quy về **Cung vị Cửu Cung** (*Cấn 8, Khôn 2, Tốn 4, Càn 6*).                                                                    |
| **B10**  | **Xác định Không Vong**                   | Căn cứ vào Tuần Thủ của giờ tra ra **Hai Địa Chi thiếu** trong tuần; xác định các cung vị bị khuyết khí Không Vong trên đồ bàn.                                                                                  |
| **B11**  | **An Bát Thần Địa Bàn**                   | **Trường hợp 1** (Giờ Giáp/Phục/Phản Ngâm): an trùng Bát Thần Thiên bàn. **Trường hợp 2** (Thông thường): khởi Trực Phù từ cung gốc của Đại Trực Phù; **Dương đi thuận, Âm đi nghịch**.                          |
| **B12**  | **An Ám Can (Ẩn Can) theo Trực Sử**       | **Trường hợp 1** (Giờ Giáp/Phục/Phản Ngâm): Can giờ ẩn Trung cung 5 rồi phi. **Trường hợp 2** (Thông thường): Can giờ khởi tại cung của Trực Sử; phi theo Lục Nghi Tam Kỳ (**Dương thuận, Âm nghịch** Cửu Cung). |

## THUYẾT MINH CHI TIẾT DỮ LIỆU CỤ THỂ TỪNG BƯỚC

## BƯỚC 1: ĐỔI GIỜ VÀ TRA TIẾT KHÍ

- **Nội dung thực hiện**: Xác định thời điểm dương lịch lập trận, tra lịch Can Chi của năm, tháng, ngày. Riêng Can Chi của giờ được chuyển đổi từ Can ngày qua bài ca quyết **Ngũ Tý Độn** (*Ngũ Thử Độn*):

  - *Giáp, Kỷ* khởi giờ **Giáp Tý**.

  - *Ất, Canh* khởi giờ **Bính Tý**.

  - *Bính, Tân* khởi giờ **Mậu Tý**.

  - *Đinh, Nhâm* khởi giờ **Canh Tý**.

  - *Mậu, Quý* khởi giờ **Nhâm Tý**.

- **Tra Tiết Khí**: Căn cứ thời điểm để biết đang ở tiết khí nào trong 24 tiết khí.

- **Kết quả**: Xác định được **Tứ Trụ (Năm, Tháng, Ngày, Giờ)**, tên **Tiết khí** và tính chất **Dương Độn** (từ Đông chí đến Mang chủng) hoặc **Âm Độn** (từ Hạ chí đến Đại tuyết).

## BƯỚC 2: XÁC ĐỊNH PHÙ ĐẦU VÀ TAM NGUYÊN

- **Nội dung thực hiện**: Từ Can Chi ngày, đếm lùi về ngày có can **Giáp** hoặc **Kỷ** gần nhất để tìm **Phù Đầu**. Căn cứ vào Địa Chi của Phù Đầu để xác định **Tam Nguyên**:

  - Địa Chi thuộc **Tứ Chính (Tý, Ngọ, Mão, Dậu)**: Thuộc **Thượng Nguyên**.

  - Địa Chi thuộc **Tứ Sinh (Dần, Thân, Tỵ, Hợi)**: Thuộc **Trung Nguyên**.

  - Địa Chi thuộc **Tứ Mộ (Thìn, Tuất, Sửu, Mùi)**: Thuộc **Hạ Nguyên**.

- **Kết quả**: Xác định được **Phù Đầu**, **Tam Nguyên** và tra bảng ca quyết 24 tiết khí để chốt **Cục số** từ 1 đến 9 (Dương cục + hoặc Âm cục -).

## BƯỚC 3: AN THIÊN CAN ĐỊA BÀN (LỤC NGHI, TAM KỲ)

- **Nội dung thực hiện**: Đặt **Mậu (Giáp Tý)** vào cung mang số của Cục số đã xác định ở Bước 2. Các can còn lại an theo thứ tự tuần hoàn khép kín bất biến: Mậu → Kỷ → Canh → Tân → Nhâm → Quý → Đinh → Bính → Ất

- **Chiều an theo Cửu Cung**:

  - **Dương Độn (+)**: Đi **thuận** số Lạc Thư 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9

  - **Âm Độn (-)**: Đi **nghịch** số Lạc Thư 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2 → 1

- **Kết quả**: Mỗi cung vị Lạc Thư tiếp nhận một Thiên Can Địa bàn cố định.

## BƯỚC 4: XÁC ĐỊNH TUẦN THỦ VÀ CỜ

- **Nội dung thực hiện**: Từ Can Chi giờ, đếm ngược về can **Giáp** để tìm **Tuần Thủ** quản lý giờ đó. Mỗi Tuần Thủ mang một lá cờ Lục Nghi ẩn tàng:

  - Tuần **Giáp Tý**: Cờ **Mậu**.

  - Tuần **Giáp Tuất**: Cờ **Kỷ**.

  - Tuần **Giáp Thân**: Cờ **Canh**.

  - Tuần **Giáp Ngọ**: Cờ **Tân**.

  - Tuần **Giáp Thìn**: Cờ **Nhâm**.

  - Tuần **Giáp Dần**: Cờ **Quý**.

- **Kết quả**: Xác định được tên **Tuần Thủ** và **Can mang Cờ**.

## BƯỚC 5: XÁC ĐỊNH ĐẠI TRỰC PHÙ VÀ TRỰC SỬ

- **Nội dung thực hiện**: Quan sát lá Cờ (ở Bước 4) đang đóng tại cung số mấy trên Địa bàn (ở Bước 3). Đối chiếu cung số đó vào hai bảng nguyên thủy:

  - **Bảng Cửu Tinh gốc**: Khảm 1 (Bồng), Khôn 2 (Nhuế/Cầm), Chấn 3 (Xung), Tốn 4 (Phù), Trung 5 (Cầm), Càn 6 (Tâm), Đoài 7 (Trụ), Cấn 8 (Nhậm), Ly 9 (Anh). Ngôi sao tại cung đó là **Đại Trực Phù**.

  - **Bảng Bát Môn gốc**: Khảm 1 (Hưu), Cấn 8 (Sinh), Chấn 3 (Thương), Tốn 4 (Đỗ), Ly 9 (Cảnh), Khôn 2 (Tử), Đoài 7 (Kinh), Càn 6 (Khai). Cửa tại cung đó là **Trực Sử**.

- **Kết quả**: Chốt tên ngôi sao **Đại Trực Phù** và cánh cửa **Trực Sử** của trận.

## BƯỚC 6: AN ĐẠI TRỰC PHÙ VÀ THIÊN CAN THIÊN BÀN

- **Nội dung thực hiện**:

  1.  Tìm vị trí của **Thiên Can giờ** trên Địa bàn.

  2.  Chuyển ngôi sao **Đại Trực Phù** cùng **Cờ Tuần Thủ** đến đóng chồng lên cung vị đó.

  3.  Lần lượt an các sao và Can Thiên bàn còn lại theo **chiều thuận kim đồng hồ** qua 8 cung ngoại vi (không phân biệt Âm/Dương độn).

- **Kết quả**: Hoàn thành tầng **Thiên bàn** (sao và can thượng tầng).

## BƯỚC 7: AN TRỰC SỬ (BÁT MÔN)

- **Nội dung thực hiện**:

  1.  Lấy **cung vị của Tuần Thủ (Cờ)** làm vị trí xuất phát (ứng với can Giáp).

  2.  Đếm từng can từ Giáp đến Can của giờ theo số Cửu Cung: **Dương Độn đếm thuận, Âm Độn đếm nghịch**.

  3.  Dừng ở cung số nào thì an cửa **Trực Sử** vào cung đó (nếu dừng ở Trung Cung 5 thì quy ước mượn cung Khôn 2).

  4.  Khởi từ Trực Sử, an toàn bộ Bát Môn còn lại theo **chiều thuận kim đồng hồ** qua 8 cung.

- **Kết quả**: Hoàn thành tầng **Nhân bàn** (Bát Môn).

## BƯỚC 8: AN BÁT THẦN THIÊN BÀN

- **Nội dung thực hiện**:

  1.  Đặt thần **Trực Phù** tại cung mà sao **Đại Trực Phù** vừa bay tới ở Bước 6.

  2.  Lần lượt an 8 thần theo thứ tự cố định: *Trực Phù → Đằng Xà → Thái Âm → Lục Hợp → Bạch Hổ → Huyền Vũ → Cửu Địa → Cửu Thiên*.

  3.  Chiều an: **Dương Độn an thuận kim đồng hồ, Âm Độn an ngược kim đồng hồ** qua 8 cung ngoại vi.

- **Kết quả**: Hoàn thành tầng **Thần bàn Thiên Bàn**.

## BƯỚC 9: XÁC ĐỊNH MÃ TINH

- **Nội dung thực hiện**: Căn cứ vào nhóm Tam Hợp của **Địa Chi giờ**:

  - Giờ *Hợi, Mão, Mùi* → Mã Tinh tại **Tỵ** → **Cung Tốn 4** (Đông Nam).

  - Giờ *Dần, Ngọ, Tuất* → Mã Tinh tại **Thân** → **Cung Khôn 2** (Tây Nam).

  - Giờ *Thân, Tý, Thìn* → Mã Tinh tại **Dần** → **Cung Cấn 8** (Đông Bắc).

  - Giờ *Tỵ, Dậu, Sửu* → Mã Tinh tại **Hợi** → **Cung Càn 6** (Tây Bắc).

- **Kết quả**: Xác định được Địa Chi và cung vị đóng của **Mã Tinh** (Dịch Mã).

## BƯỚC 10: XÁC ĐỊNH KHÔNG VONG (TUẦN KHÔNG)

- **Nội dung thực hiện**: Dựa vào **Tuần Thủ của giờ** (ở Bước 4) để tìm 2 Địa Chi còn thiếu trong tuần 10 ngày:

  - Tuần *Giáp Tý* thiếu **Tuất, Hợi** → **Cung Càn 6**.

  - Tuần *Giáp Tuất* thiếu **Thân, Dậu** → **Cung Khôn 2 & Cung Đoài 7**.

  - Tuần *Giáp Thân* thiếu **Ngọ, Mùi** → **Cung Ly 9 & Cung Khôn 2**.

  - Tuần *Giáp Ngọ* thiếu **Thìn, Tỵ** → **Cung Tốn 4**.

  - Tuần *Giáp Thìn* thiếu **Dần, Mão** → **Cung Cấn 8 & Cung Chấn 3**.

  - Tuần *Giáp Dần* thiếu **Tý, Sửu** → **Cung Khảm 1 & Cung Cấn 8**.

- **Kết quả**: Xác định được hai Địa Chi và các cung vị chịu ảnh hưởng của **Không Vong** (ký hiệu KV).

## BƯỚC 11: AN BÁT THẦN ĐỊA BÀN

- **Nội dung thực hiện**:

  - **Trường hợp 1** (Giờ thuộc Lục Giáp, Phục Ngâm hoặc Phản Ngâm toàn trận): Bát Thần Địa Bàn an **trùng khít** với Bát Thần Thiên Bàn của Bước 8.

  - **Trường hợp 2** (Giờ thông thường): Lấy **cung gốc nguyên thủy của Đại Trực Phù** (ở Bước 5) làm nơi khởi thần **Trực Phù**. Thứ tự 8 thần giữ nguyên; **Dương Độn đi thuận kim đồng hồ, Âm Độn đi ngược kim đồng hồ**.

- **Kết quả**: Xác lập xong hệ thống **Ám Can Bát Thần Địa Bàn**.

## BƯỚC 12: AN ÁM CAN (ẨN CAN) THEO THIÊN CAN GIỜ

- **Nội dung thực hiện**:

  - **Trường hợp 1** (Giờ Lục Giáp, Phục Ngâm hoặc Phản Ngâm toàn trận): Can giờ nhập **Trung Cung (Cung 5)** làm điểm khởi đầu. **Dương Độn** phi thuận (5 → 6 → 7 → 8 → 9 → 1 → 2 → 3 → 4); **Âm Độn** phi nghịch (5 → 4 → 3 → 2 →  → 9 → 8 → 7 → 6)

  - **Trường hợp 2** (Giờ thông thường): Lấy chính **cung vị của Trực Sử** (ở Bước 7) làm nơi khởi Can giờ. Sau đó lần lượt an các can theo thứ tự Lục Nghi Tam Kỳ: **Dương Độn phi thuận Cửu Cung, Âm Độn phi nghịch Cửu Cung**.

- **Kết quả**: Toàn bộ 9 cung tiếp nhận đầy đủ hệ thống **Ám Can Thiên Bàn**, hoàn tất 100% đồ hình trận pháp.

Toàn bộ bàn trận Kỳ Môn sau khi thực hiện trọn vẹn 12 bước đã kích hoạt đầy đủ 4 tầng không gian (Địa bàn, Nhân bàn, Thiên bàn, Thần bàn) cùng 2 hệ thống phụ trợ (Mã Tinh, Không Vong) và 2 lớp ẩn cơ (Ám Thần, Ám Can).
