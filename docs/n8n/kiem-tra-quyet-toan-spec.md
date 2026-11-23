# WORKFLOW: Kiểm tra hồ sơ quyết toán công trình tuyến ống cấp nước (Biwase)

**Phiên bản đặc tả**: 0.1
**Ngày**: 2026-11-23
**Tác giả**: Workflow Architect
**Trạng thái**: Draft (chờ người duyệt các mục ở Phần 9)
**Đơn vị nghiệp vụ**: Phòng Đầu tư – Tổng công ty Nước – Môi trường Bình Dương (Biwase)
**Nền tảng đích**: n8n 2.x (cài theo `scripts/install-n8n.sh`, Node 24), `executionOrder: v1`
**Người dùng đặc tả này**: agent dựng file JSON n8n (đọc Phần 4 → Phần 8 là đủ để dựng)

---

## Mục lục

1. Mục tiêu & phạm vi
2. Tác nhân, tiền điều kiện, kích hoạt
3. Schema JSON đầu vào (kèm ví dụ đầy đủ)
4. Sơ đồ và danh sách node theo thứ tự (kèm giả mã từng Code node)
5. Các nhánh và điều kiện (kể cả nhánh lỗi)
6. Schema đầu ra (thành công / lỗi)
7. Bộ ca kiểm thử
8. Hợp đồng bàn giao (handoff), trạng thái quan sát được, dọn dẹp
9. Điểm cần người duyệt
10. Giả định & câu hỏi mở
11. Nhật ký đặc tả – thực tế

---

## 1. Mục tiêu & phạm vi

### 1.1 Mục tiêu

Tự động hóa **phần tổng hợp và áp quy tắc** của Giai đoạn 5 (GĐ5 – quyết toán) trong quy trình kiểm tra hồ sơ công trình tuyến ống cấp nước của Biwase:

1. Nhận một hồ sơ quyết toán dưới dạng JSON (đã được người kiểm tra số hóa: danh mục hồ sơ có/không, bảng hạng mục khối lượng – đơn giá, kết quả checklist bản vẽ hoàn công và checklist dự toán/bảng quyết toán, đánh giá 15 tiêu chí).
2. Kiểm tra đủ **căn cứ bắt buộc** theo chuỗi hồ sơ: Dự toán → Đề xuất giá → QĐ chỉ định thầu → Hợp đồng → BBNT khối lượng → Quyết toán (bảng quyết toán, hóa đơn GTGT, bản vẽ hoàn công).
3. **Đối chiếu ba chiều** cho từng hạng mục: bản vẽ hoàn công ↔ khối lượng nghiệm thu (số gốc = khối lượng chốt tại hiện trường) ↔ khối lượng quyết toán; tính thành tiền ảnh hưởng.
4. Kiểm tra **hợp đồng**: đơn giá cố định → quyết toán theo khối lượng thực tế; phát hiện BBNT/quyết toán chép 100% số hợp đồng mà không có số đo; giá trị quyết toán vượt giá hợp đồng không có phụ lục; chi phí giám sát có trong dự toán nhưng không giao ai mà vẫn quyết toán.
5. Tổng hợp **checklist GĐ5** (bản vẽ hoàn công + bảng quyết toán), tự kiểm lại các mục tính được bằng máy (chiều dài tuyến cộng dồn, mốc căn cứ pháp lý 01/7/2026, cộng dồn tổng).
6. Hợp nhất **15 tiêu chí** (người kiểm tra nhập 1–14; máy chỉ được *hạ* kết quả 13, 14 khi dữ liệu chứng minh; máy tự lập 15).
7. Áp **quy tắc kết luận** theo thứ tự ưu tiên → 1 trong 4 kết luận.
8. Sinh đầu ra: **Phiếu YCBS** (Markdown + HTML) khi không đạt/chưa kết luận; **tờ trình chuyển ký** khi đạt; **1 dòng Báo cáo tổng hợp** trong mọi trường hợp; bản nháp email thông báo (node gửi bị **tắt**).

### 1.2 Trong phạm vi

- Một hồ sơ quyết toán / một lần gọi (một item).
- Loại hồ sơ duy nhất: `Quyết toán`.
- 4 chi nhánh: Khu Liên Hợp, Tân Uyên, Dĩ An, Bàu Bàng.
- Chạy được **không cần credential**: Webhook POST + Manual Trigger với dữ liệu mẫu.

### 1.3 Ngoài phạm vi (không dựng trong workflow này)

| Việc | Lý do | Ghi chú |
|---|---|---|
| Đọc bản vẽ PDF/CAD, bóc tách khối lượng bằng mắt | Cần người | Kết quả nhập qua trường `checklist_*` và `hang_muc[]` |
| Tra mã hiệu định mức TT38, đơn giá nhân công/ca máy Bình Dương, đơn giá vật tư Biwase | Cần người + dữ liệu tham chiếu chưa số hóa | Kết quả nhập qua `checklist_du_toan_quyet_toan` |
| Ghi Google Sheets / file trên đĩa | Ràng buộc "không credential"; n8n 2.x chặn truy cập đĩa mặc định | Dòng báo cáo trả về dưới dạng JSON + CSV + Markdown |
| Gửi email thật | Cần người duyệt + SMTP credential | Node `emailSend` để `disabled: true` |
| Đánh số phiếu YCBS liên tục | Workflow không giữ trạng thái | Số phiếu tạm = mã công trình + ngày (xem Mục 9) |
| GĐ1–GĐ4 (kiểm tra bản vẽ thiết kế, dự toán, nghiệm thu) | Workflow riêng | Đề xuất các workflow liên quan ở Mục 10.3 |

---

## 2. Tác nhân, tiền điều kiện, kích hoạt

### 2.1 Tác nhân

| Tác nhân | Vai trò |
|---|---|
| Người kiểm tra (chuyên viên Phòng Đầu tư) | Đọc hồ sơ giấy/PDF, điền checklist và đánh giá tiêu chí 1–14, gửi JSON |
| Hệ thống gọi (form nội bộ / script / Postman) | POST JSON tới webhook |
| n8n workflow | Chuẩn hóa, kiểm tra, đối chiếu, áp quy tắc, sinh phiếu và dòng báo cáo |
| Lãnh đạo Phòng Đầu tư | Duyệt phiếu YCBS trước khi gửi; bật node email nếu đồng ý |
| Chi nhánh / Nhà thầu | Người nhận phiếu YCBS (ngoài workflow) |

### 2.2 Tiền điều kiện

- n8n 2.x đang chạy, workflow đã import và **Active** (để URL production `/webhook/...` hoạt động; khi chưa Active chỉ dùng được `/webhook-test/...`).
- Workflow setting `timezone = Asia/Ho_Chi_Minh`.
- Người kiểm tra đã hoàn tất kiểm tra bằng mắt và có số liệu hạng mục.

### 2.3 Kích hoạt

| Kích hoạt | Node | Chi tiết |
|---|---|---|
| Chính | `Webhook nhận hồ sơ` | `POST /webhook/biwase/kiem-tra-quyet-toan`, `Content-Type: application/json`, body = 1 object theo Phần 3 |
| Chạy thử | `Chạy thử thủ công` → `Dữ liệu mẫu` | Bấm "Execute workflow" trong editor; kịch bản chọn bằng hằng `KICH_BAN` trong node `Dữ liệu mẫu` |

---

## 3. Schema JSON đầu vào

### 3.1 Quy ước chung

- Mã hóa UTF-8, khóa tiếng Việt không dấu dạng `snake_case`.
- Ngày: chuỗi `YYYY-MM-DD`.
- Số: kiểu `number` JSON, dấu thập phân là dấu chấm. Chấp nhận chuỗi số thuần (`"446.5"`) và tự đổi sang number. **Từ chối** chuỗi có dấu phẩy hoặc dấu chấm phân cách nghìn kiểu Việt (`"1.234,5"`, `"185,000"`) → lỗi 400 với gợi ý.
- Tiền: đồng (VND), **trước thuế GTGT** trừ khi tên trường có `_sau_thue`.
- Enum kết quả tiêu chí: `phu_hop` | `khong_phu_hop` | `chua_du_can_cu`.
- Enum kết quả mục checklist: `dat` | `khong_dat` | `chua_kiem_tra` | `khong_ap_dung`.

### 3.2 Bảng trường

#### 3.2.1 Gốc

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `phien_ban_schema` | string | Không (mặc định `"1.0"`) | Nếu có và khác `"1.0"` → lỗi 400 |
| `cong_trinh` | object | Có | 3.2.2 |
| `hop_dong` | object | Có | 3.2.3 |
| `ho_so` | array | Có | 3.2.4 |
| `hang_muc` | array | Có, ≥1 phần tử | 3.2.5. Mảng rỗng → lỗi 422 `HANG_MUC_RONG` |
| `tong_hop_khai_bao` | object | Có | 3.2.6 |
| `hoa_don_gtgt` | object \| null | Không | 3.2.7 |
| `chi_phi_giam_sat` | object | Không (mặc định không có giám sát trong dự toán) | 3.2.8 |
| `checklist_ban_ve_hoan_cong` | object | Không (thiếu → mọi mục = `chua_kiem_tra`) | 3.2.9 |
| `checklist_du_toan_quyet_toan` | object | Không (thiếu → mọi mục = `chua_kiem_tra`) | 3.2.10 |
| `danh_gia_tieu_chi` | array | Không (thiếu → tiêu chí 1–14 = `chua_du_can_cu`) | 3.2.11 |
| `ghi_chu_nguoi_kiem_tra` | string | Không | Đưa vào mục "Các nội dung khác" của YCBS và cột ghi chú báo cáo |

#### 3.2.2 `cong_trinh`

| Trường | Kiểu | Bắt buộc | Ràng buộc |
|---|---|---|---|
| `ma_cong_trinh` | string | Có | không rỗng, ≤ 50 ký tự |
| `ten_cong_trinh` | string | Có | không rỗng |
| `dia_diem` | string | Có | không rỗng |
| `chi_nhanh` | string | Có | ∈ {`Khu Liên Hợp`, `Tân Uyên`, `Dĩ An`, `Bàu Bàng`} (so khớp sau `trim`, phân biệt dấu, không phân biệt hoa thường) |
| `email_chi_nhanh` | string | Không | dùng cho bản nháp email |
| `nha_thau` | object | Có | `{ ten: string (bắt buộc), email?: string }` |
| `loai_ho_so` | string | Không | nếu có phải = `Quyết toán`; mặc định `Quyết toán` |
| `ngay_nhan` | date | Có | ngày Phòng Đầu tư nhận hồ sơ |
| `ngay_lap_du_toan` | date | Có | ngày lập dự toán/bảng quyết toán; dùng xác định mốc căn cứ pháp lý 01/7/2026 |
| `nguoi_kiem_tra` | string | Có | họ tên |
| `thoi_han_bo_sung_ngay` | integer | Không | 1–60; mặc định 7 (ngày lịch) |

#### 3.2.3 `hop_dong`

| Trường | Kiểu | Bắt buộc | Ràng buộc |
|---|---|---|---|
| `so_hop_dong` | string | Có | |
| `ngay_ky` | date | Không | |
| `loai_gia` | string | Có | ∈ {`don_gia_co_dinh`, `tron_goi`, `don_gia_dieu_chinh`} |
| `gia_tri_hop_dong` | number | Có | ≥ 0, trước thuế |
| `gia_tri_sau_phu_luc` | number \| null | Không | giá trị HĐ sau phụ lục điều chỉnh (trước thuế); chỉ được tính khi hồ sơ `PHU_LUC_HOP_DONG.co = true` |

#### 3.2.4 `ho_so[]` – danh mục hồ sơ có/không

Mỗi phần tử: `{ ma: string, co: boolean, so_hieu?: string, ngay?: date, ghi_chu?: string }`.

Mã hợp lệ (mã lạ → lỗi 400; mã trùng → lỗi 400; mã không khai báo → coi như `co = false`, ghi cảnh báo):

| `ma` | Tên hồ sơ | Mức | Ghi chú |
|---|---|---|---|
| `CV_CHU_TRUONG` | Công văn chấp thuận chủ trương | Bắt buộc | |
| `HS_THIET_KE` | Hồ sơ thiết kế | Bắt buộc* | *đạt nếu có `HS_THIET_KE` **hoặc** `HS_THIET_KE_DIEU_CHINH` |
| `HS_THIET_KE_DIEU_CHINH` | Hồ sơ thiết kế điều chỉnh | Điều kiện | |
| `DU_TOAN_PHE_DUYET` | Dự toán được phê duyệt | Bắt buộc | |
| `DU_TOAN_DIEU_CHINH` | Dự toán điều chỉnh được phê duyệt | Điều kiện | bắt buộc nếu có `HS_THIET_KE_DIEU_CHINH` |
| `DE_XUAT_GIA` | Đề xuất giá | Bắt buộc (chuỗi) | |
| `QD_CHI_DINH_THAU` | Quyết định chỉ định thầu | Bắt buộc (chuỗi) | |
| `HOP_DONG` | Hợp đồng | Bắt buộc | |
| `PHU_LUC_HOP_DONG` | Phụ lục/điều chỉnh hợp đồng | Điều kiện | bắt buộc khi tổng quyết toán > giá HĐ hoặc có hạng mục ngoài HĐ |
| `BB_NGHIEM_THU_HIEN_TRUONG` | Biên bản nghiệm thu hiện trường (khối lượng chốt tại hiện trường) | Bắt buộc | số gốc |
| `BBNT_KHOI_LUONG` | BBNT khối lượng | Bắt buộc (chuỗi) | |
| `BBNT_HOAN_THANH` | BBNT hoàn thành | Bắt buộc | |
| `BAN_VE_HOAN_CONG` | Bản vẽ hoàn công | Bắt buộc | |
| `BANG_QUYET_TOAN` | Dự toán/bảng quyết toán | Bắt buộc | |
| `HOA_DON_GTGT` | Hóa đơn GTGT | Bắt buộc | |

"Có hồ sơ điều chỉnh đầy đủ" (`co_dieu_chinh_day_du`) = `HS_THIET_KE_DIEU_CHINH.co && DU_TOAN_DIEU_CHINH.co`.

#### 3.2.5 `hang_muc[]`

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `stt` | integer | Có | duy nhất trong mảng |
| `ma_hieu_dinh_muc` | string | Không | mã hiệu TT38 (chỉ hiển thị; tính đúng sai do người kiểm tra nhập ở checklist) |
| `ten` | string | Có | tên công việc/vật tư |
| `don_vi` | string | Có | m, m3, m2, cái, bộ… |
| `loai` | string | Có | ∈ {`ong`, `phu_kien`, `dao_dap`, `cat_dem`, `tai_lap`, `khac`}; `ong` dùng để cộng dồn chiều dài tuyến |
| `kl_thiet_ke` | number | Có | ≥ 0; `0` = hạng mục không có trong thiết kế (phát sinh) |
| `kl_thiet_ke_dieu_chinh` | number \| null | Không | dùng làm khối lượng thiết kế tham chiếu khi `co_dieu_chinh_day_du` |
| `kl_hoan_cong` | number | Có | theo bản vẽ hoàn công |
| `kl_nghiem_thu_hien_truong` | number \| null | Có (cho phép null) | **số gốc**; null = không có số đo hiện trường |
| `kl_nghiem_thu_bbnt` | number \| null | Có (cho phép null) | số trong BBNT khối lượng/hoàn thành |
| `kl_quyet_toan` | number | Có | |
| `kl_hop_dong` | number | Có | `0` = hạng mục ngoài hợp đồng |
| `don_gia_hop_dong` | number \| null | Có (cho phép null khi `kl_hop_dong = 0`) | |
| `don_gia_quyet_toan` | number | Có | ≥ 0 |
| `co_so_do_hien_truong` | boolean | Có | có số đo/ghi chép đo đạc thực tế cho hạng mục này |

#### 3.2.6 `tong_hop_khai_bao`

| Trường | Kiểu | Bắt buộc | Mô tả |
|---|---|---|---|
| `tong_quyet_toan_truoc_thue` | number | Có | số tổng ghi trên bảng quyết toán |
| `thue_suat_gtgt` | number | Có | phần trăm, ví dụ `8` hoặc `10` |
| `tong_quyet_toan_sau_thue` | number | Có | |

#### 3.2.7 `hoa_don_gtgt`

`{ so: string, ngay: date, gia_tri_truoc_thue: number, thue_suat: number, gia_tri_sau_thue: number }` – có thể `null` nếu chưa có hóa đơn (khi đó `HOA_DON_GTGT.co` phải là `false`; nếu `co = true` mà `hoa_don_gtgt = null` → phát hiện `thieu_can_cu`).

#### 3.2.8 `chi_phi_giam_sat`

| Trường | Kiểu | Mặc định | Mô tả |
|---|---|---|---|
| `co_trong_du_toan` | boolean | false | |
| `gia_tri` | number | 0 | trước thuế |
| `da_giao_don_vi` | boolean | false | đã có văn bản giao/hợp đồng giám sát |
| `don_vi_giam_sat` | string \| null | null | |
| `co_trong_quyet_toan` | boolean | false | chi phí giám sát có bị đưa vào giá trị quyết toán không |

#### 3.2.9 `checklist_ban_ve_hoan_cong`

Mỗi mục là `MucChecklist = { ket_qua: enum, ghi_chu?: string, so_lieu?: object }`.

| Khóa | Nội dung kiểm tra (người làm) | `so_lieu` (tùy chọn) |
|---|---|---|
| `chieu_dai_tuyen` | Chiều dài tuyến trên bản vẽ hoàn công | `{ chieu_dai_ban_ve: number }` – máy so với tổng `kl_hoan_cong` các hạng mục `loai = ong` |
| `ky_thuat_lap_dat` | Kỹ thuật lắp đặt (độ sâu, khoảng cách, gối đỡ, thử áp…) | – |
| `boc_tach_coc_vs_thong_ke_vat_tu` | Bóc tách khối lượng chi tiết từng cọc so với bảng thống kê vật tư | `{ so_muc_lech: integer, danh_sach_lech?: string[] }` |
| `loi_trinh_bay` | Lỗi trình bày (khung tên, chữ ký, ghi chú, tỷ lệ…) | – |

#### 3.2.10 `checklist_du_toan_quyet_toan`

| Khóa | Nội dung kiểm tra | `so_lieu` (tùy chọn) |
|---|---|---|
| `ma_hieu_dinh_muc_tt38` | Mã hiệu định mức theo TT38 | `{ danh_sach_sai?: string[] }` |
| `don_gia_nhan_cong_ca_may_bd` | Đơn giá nhân công, ca máy Bình Dương | – |
| `can_cu_phap_ly_theo_moc` | Căn cứ pháp lý đúng mốc trước/sau 01/7/2026 | `{ moc_ap_dung: "truoc_01072026" \| "tu_01072026", van_ban?: string[] }` – máy so với `cong_trinh.ngay_lap_du_toan` |
| `kl_dao_dap_cat_dem_tai_lap_khop_mat_cat` | KL đào đắp – cát đệm – tái lập khớp mặt cắt | – |
| `don_gia_vat_tu_biwase` | Đơn giá vật tư Biwase khớp đủ: đường kính + vật liệu + kiểu đấu nối + góc + kiểu nối | `{ so_muc_khong_khop: integer, danh_sach?: string[] }` |
| `cong_don_tong` | Cộng dồn tổng | – (máy tự tính lại, xem N10) |

#### 3.2.11 `danh_gia_tieu_chi[]`

Mỗi phần tử: `{ so: 1..15, ket_qua: enum, nhan_xet?: string, nhom_ycbs?: 1..11 }`.
- `so` trùng → 400. `so` ngoài 1..15 → 400.
- Tiêu chí 15 nếu có sẽ **bị bỏ qua** (máy tự lập) và ghi cảnh báo.
- `nhom_ycbs` (tùy chọn) ghi đè nhóm mặc định trong bảng 4.4.2 khi xếp vào Phiếu YCBS.

### 3.3 Ví dụ đầy đủ (kịch bản "Đạt" – cũng là dữ liệu gốc của node `Dữ liệu mẫu`)

```json
{
  "phien_ban_schema": "1.0",
  "cong_trinh": {
    "ma_cong_trinh": "MAU-TU-2026-014",
    "ten_cong_trinh": "Lắp đặt tuyến ống cấp nước HDPE D110 hẻm mẫu số 14 (dữ liệu mẫu)",
    "dia_diem": "Phường mẫu, TP. Tân Uyên, TP. Hồ Chí Minh",
    "chi_nhanh": "Tân Uyên",
    "email_chi_nhanh": "chinhanh.mau@example.invalid",
    "nha_thau": { "ten": "Công ty TNHH Xây dựng Mẫu", "email": "nhathau.mau@example.invalid" },
    "loai_ho_so": "Quyết toán",
    "ngay_nhan": "2026-11-20",
    "ngay_lap_du_toan": "2026-08-12",
    "nguoi_kiem_tra": "Chuyên viên mẫu",
    "thoi_han_bo_sung_ngay": 7
  },
  "hop_dong": {
    "so_hop_dong": "HĐ-MAU/2026",
    "ngay_ky": "2026-08-25",
    "loai_gia": "don_gia_co_dinh",
    "gia_tri_hop_dong": 200820000,
    "gia_tri_sau_phu_luc": null
  },
  "ho_so": [
    { "ma": "CV_CHU_TRUONG", "co": true, "so_hieu": "CV-MAU-01", "ngay": "2026-06-10" },
    { "ma": "HS_THIET_KE", "co": true },
    { "ma": "HS_THIET_KE_DIEU_CHINH", "co": false },
    { "ma": "DU_TOAN_PHE_DUYET", "co": true },
    { "ma": "DU_TOAN_DIEU_CHINH", "co": false },
    { "ma": "DE_XUAT_GIA", "co": true },
    { "ma": "QD_CHI_DINH_THAU", "co": true },
    { "ma": "HOP_DONG", "co": true },
    { "ma": "PHU_LUC_HOP_DONG", "co": false },
    { "ma": "BB_NGHIEM_THU_HIEN_TRUONG", "co": true },
    { "ma": "BBNT_KHOI_LUONG", "co": true },
    { "ma": "BBNT_HOAN_THANH", "co": true },
    { "ma": "BAN_VE_HOAN_CONG", "co": true },
    { "ma": "BANG_QUYET_TOAN", "co": true },
    { "ma": "HOA_DON_GTGT", "co": true, "so_hieu": "0000123" }
  ],
  "hang_muc": [
    { "stt": 1, "ma_hieu_dinh_muc": "MINH_HOA.01", "ten": "Lắp đặt ống HDPE D110 PN10 nối hàn nhiệt", "don_vi": "m", "loai": "ong",
      "kl_thiet_ke": 450, "kl_thiet_ke_dieu_chinh": null, "kl_hoan_cong": 446, "kl_nghiem_thu_hien_truong": 446, "kl_nghiem_thu_bbnt": 446,
      "kl_quyet_toan": 446, "kl_hop_dong": 450, "don_gia_hop_dong": 210000, "don_gia_quyet_toan": 210000, "co_so_do_hien_truong": true },
    { "stt": 2, "ma_hieu_dinh_muc": "MINH_HOA.02", "ten": "Đào đất mương đặt ống bằng máy, đất cấp II", "don_vi": "m3", "loai": "dao_dap",
      "kl_thiet_ke": 162, "kl_thiet_ke_dieu_chinh": null, "kl_hoan_cong": 160.6, "kl_nghiem_thu_hien_truong": 160.6, "kl_nghiem_thu_bbnt": 160.6,
      "kl_quyet_toan": 160.6, "kl_hop_dong": 162, "don_gia_hop_dong": 95000, "don_gia_quyet_toan": 95000, "co_so_do_hien_truong": true },
    { "stt": 3, "ma_hieu_dinh_muc": "MINH_HOA.03", "ten": "Đắp cát đệm ống", "don_vi": "m3", "loai": "cat_dem",
      "kl_thiet_ke": 49.5, "kl_thiet_ke_dieu_chinh": null, "kl_hoan_cong": 49.1, "kl_nghiem_thu_hien_truong": 49.1, "kl_nghiem_thu_bbnt": 49.1,
      "kl_quyet_toan": 49.1, "kl_hop_dong": 49.5, "don_gia_hop_dong": 380000, "don_gia_quyet_toan": 380000, "co_so_do_hien_truong": true },
    { "stt": 4, "ma_hieu_dinh_muc": "MINH_HOA.04", "ten": "Tái lập mặt đường bê tông nhựa dày 7cm", "don_vi": "m2", "loai": "tai_lap",
      "kl_thiet_ke": 135, "kl_thiet_ke_dieu_chinh": null, "kl_hoan_cong": 133.8, "kl_nghiem_thu_hien_truong": 133.8, "kl_nghiem_thu_bbnt": 133.8,
      "kl_quyet_toan": 133.8, "kl_hop_dong": 135, "don_gia_hop_dong": 520000, "don_gia_quyet_toan": 520000, "co_so_do_hien_truong": true },
    { "stt": 5, "ma_hieu_dinh_muc": "MINH_HOA.05", "ten": "Tê HDPE D110x63 hàn nhiệt", "don_vi": "cái", "loai": "phu_kien",
      "kl_thiet_ke": 3, "kl_thiet_ke_dieu_chinh": null, "kl_hoan_cong": 3, "kl_nghiem_thu_hien_truong": 3, "kl_nghiem_thu_bbnt": 3,
      "kl_quyet_toan": 3, "kl_hop_dong": 3, "don_gia_hop_dong": 640000, "don_gia_quyet_toan": 640000, "co_so_do_hien_truong": true }
  ],
  "tong_hop_khai_bao": {
    "tong_quyet_toan_truoc_thue": 199071000,
    "thue_suat_gtgt": 10,
    "tong_quyet_toan_sau_thue": 218978100
  },
  "hoa_don_gtgt": { "so": "0000123", "ngay": "2026-11-15", "gia_tri_truoc_thue": 199071000, "thue_suat": 10, "gia_tri_sau_thue": 218978100 },
  "chi_phi_giam_sat": { "co_trong_du_toan": false, "gia_tri": 0, "da_giao_don_vi": false, "don_vi_giam_sat": null, "co_trong_quyet_toan": false },
  "checklist_ban_ve_hoan_cong": {
    "chieu_dai_tuyen": { "ket_qua": "dat", "so_lieu": { "chieu_dai_ban_ve": 446 } },
    "ky_thuat_lap_dat": { "ket_qua": "dat" },
    "boc_tach_coc_vs_thong_ke_vat_tu": { "ket_qua": "dat", "so_lieu": { "so_muc_lech": 0 } },
    "loi_trinh_bay": { "ket_qua": "dat" }
  },
  "checklist_du_toan_quyet_toan": {
    "ma_hieu_dinh_muc_tt38": { "ket_qua": "dat" },
    "don_gia_nhan_cong_ca_may_bd": { "ket_qua": "dat" },
    "can_cu_phap_ly_theo_moc": { "ket_qua": "dat", "so_lieu": { "moc_ap_dung": "tu_01072026" } },
    "kl_dao_dap_cat_dem_tai_lap_khop_mat_cat": { "ket_qua": "dat" },
    "don_gia_vat_tu_biwase": { "ket_qua": "dat", "so_lieu": { "so_muc_khong_khop": 0 } },
    "cong_don_tong": { "ket_qua": "dat" }
  },
  "danh_gia_tieu_chi": [
    { "so": 1, "ket_qua": "phu_hop" }, { "so": 2, "ket_qua": "phu_hop" }, { "so": 3, "ket_qua": "phu_hop" },
    { "so": 4, "ket_qua": "phu_hop" }, { "so": 5, "ket_qua": "phu_hop" }, { "so": 6, "ket_qua": "phu_hop" },
    { "so": 7, "ket_qua": "phu_hop" }, { "so": 8, "ket_qua": "phu_hop" }, { "so": 9, "ket_qua": "phu_hop" },
    { "so": 10, "ket_qua": "phu_hop" }, { "so": 11, "ket_qua": "phu_hop" }, { "so": 12, "ket_qua": "phu_hop", "nhan_xet": "Giảm 1.749.000 đ so với HĐ do khối lượng thực tế" },
    { "so": 13, "ket_qua": "phu_hop" }, { "so": 14, "ket_qua": "phu_hop" }
  ],
  "ghi_chu_nguoi_kiem_tra": ""
}
```

Kiểm tra số học của ví dụ (để agent dựng tự đối chiếu): tổng quyết toán tính lại = 93.660.000 + 15.257.000 + 18.658.000 + 69.576.000 + 1.920.000 = **199.071.000 đ**; giá HĐ = **200.820.000 đ**; sau thuế 10% = **218.978.100 đ**. Hạng mục 1: lệch thiết kế = (446−450)/450 = −0,89% (< ngưỡng 5%).

---

## 4. Sơ đồ và danh sách node

### 4.1 Sơ đồ luồng

```
[N01 Webhook nhận hồ sơ] ─────────────┐
                                      ├─> [N04 Chuẩn hóa đầu vào] -> [N05 Kiểm tra cấu trúc] -> [N06 Hợp lệ?]
[N02 Chạy thử thủ công] -> [N03 Dữ liệu mẫu] ┘                                                  │
                                                                                                │true
   ┌────────────────────────────────────────────────────────────────────────────────────────────┘
   v
[N07 Kiểm tra hồ sơ căn cứ] -> [N08 Đối chiếu ba chiều] -> [N09 Kiểm tra hợp đồng] -> [N10 Tổng hợp checklist GĐ5]
   -> [N11 Đánh giá 15 tiêu chí] -> [N12 Áp quy tắc kết luận] -> [N13 Phân loại kết luận (Switch)]
        out0 Dừng quyết toán ─┐
        out1 Điều chỉnh TK-DT ├─> [N14 Lập phiếu YCBS] ─────┐
        out2 Chưa kết luận ───┘                              ├─> [N16 Tạo dòng báo cáo tổng hợp] -> [N17 Đóng gói đầu ra]
        out3 Đạt ──────────────> [N15 Lập tờ trình chuyển ký]┘                                        │
        fallback ──────────────> [N23 Tạo phản hồi lỗi]                                               │
                                                                                                      ├─> [N18 Nguồn là webhook?]
[N06 Hợp lệ?] false ───────────> [N23 Tạo phản hồi lỗi] ───────────────────────────────────────────> [N18]
                                                                       [N18] true  -> [N19 Phản hồi webhook]
                                                                       [N18] false -> [N20 Kết quả chạy thử]
                                                       [N17] ─> [N21 Soạn thông báo] -> [N22 Gửi email chi nhánh/nhà thầu (DISABLED)]
```

Quyết định thiết kế: **không dùng node Merge**. Các bước tuần tự dồn khóa vào cùng một item (`{...d, khoa_moi}`), và các nhánh Switch hội tụ bằng cách nối nhiều output vào cùng một input của N16 (mỗi lần chạy chỉ một nhánh có dữ liệu). Lý do: Merge chờ đủ đầu vào và dễ "treo"/rỗng khi chỉ một nhánh chạy, làm webhook không được phản hồi.

### 4.2 Thiết lập workflow

| Thuộc tính | Giá trị |
|---|---|
| `name` | `Biwase – Kiểm tra hồ sơ quyết toán công trình` |
| `settings.executionOrder` | `v1` |
| `settings.timezone` | `Asia/Ho_Chi_Minh` |
| `settings.saveManualExecutions` | `true` |
| `settings.saveDataSuccessExecution` | `all` |
| `settings.saveDataErrorExecution` | `all` |
| `settings.executionTimeout` | `60` (giây) |
| `tags` | `["biwase", "phong-dau-tu", "quyet-toan"]` |
| `active` | `false` khi import (người duyệt bật) |

Mọi Code node: `language: javaScript`, `mode: runOnceForAllItems`, đọc `const d = $input.first().json;`, trả `return [{ json: {...} }];`. Không `require` module ngoài (n8n 2.x chặn mặc định). Được dùng `DateTime` (Luxon) có sẵn trong Code node.

### 4.3 Bảng node

| # | Tên node | Loại n8n (`type`) | typeVersion gợi ý | Vị trí [x,y] | Vào từ | Ra tới |
|---|---|---|---|---|---|---|
| N01 | Webhook nhận hồ sơ | `n8n-nodes-base.webhook` | 2 | [0,0] | – | N04 |
| N02 | Chạy thử thủ công | `n8n-nodes-base.manualTrigger` | 1 | [0,300] | – | N03 |
| N03 | Dữ liệu mẫu | `n8n-nodes-base.code` | 2 | [240,300] | N02 | N04 |
| N04 | Chuẩn hóa đầu vào | `n8n-nodes-base.code` | 2 | [480,150] | N01, N03 | N05 |
| N05 | Kiểm tra cấu trúc | `n8n-nodes-base.code` | 2 | [720,150] | N04 | N06 |
| N06 | Hợp lệ? | `n8n-nodes-base.if` | 2.2 | [960,150] | N05 | true→N07, false→N23 |
| N07 | Kiểm tra hồ sơ căn cứ | `n8n-nodes-base.code` | 2 | [1200,0] | N06(true) | N08 |
| N08 | Đối chiếu ba chiều | `n8n-nodes-base.code` | 2 | [1440,0] | N07 | N09 |
| N09 | Kiểm tra hợp đồng | `n8n-nodes-base.code` | 2 | [1680,0] | N08 | N10 |
| N10 | Tổng hợp checklist GĐ5 | `n8n-nodes-base.code` | 2 | [1920,0] | N09 | N11 |
| N11 | Đánh giá 15 tiêu chí | `n8n-nodes-base.code` | 2 | [2160,0] | N10 | N12 |
| N12 | Áp quy tắc kết luận | `n8n-nodes-base.code` | 2 | [2400,0] | N11 | N13 |
| N13 | Phân loại kết luận | `n8n-nodes-base.switch` | 3.2 | [2640,0] | N12 | out0,1,2→N14; out3→N15; fallback→N23 |
| N14 | Lập phiếu YCBS | `n8n-nodes-base.code` | 2 | [2880,-150] | N13 out0/1/2 | N16 |
| N15 | Lập tờ trình chuyển ký | `n8n-nodes-base.code` | 2 | [2880,150] | N13 out3 | N16 |
| N16 | Tạo dòng báo cáo tổng hợp | `n8n-nodes-base.code` | 2 | [3120,0] | N14, N15 | N17 |
| N17 | Đóng gói đầu ra | `n8n-nodes-base.code` | 2 | [3360,0] | N16 | N18, N21 |
| N18 | Nguồn là webhook? | `n8n-nodes-base.if` | 2.2 | [3600,0] | N17, N23 | true→N19, false→N20 |
| N19 | Phản hồi webhook | `n8n-nodes-base.respondToWebhook` | 1.1 | [3840,-100] | N18(true) | – |
| N20 | Kết quả chạy thử | `n8n-nodes-base.noOp` | 1 | [3840,100] | N18(false) | – |
| N21 | Soạn thông báo | `n8n-nodes-base.code` | 2 | [3600,300] | N17 | N22 |
| N22 | Gửi email chi nhánh/nhà thầu | `n8n-nodes-base.emailSend` | 2.1 | [3840,300] | N21 | – (**`disabled: true`**) |
| N23 | Tạo phản hồi lỗi | `n8n-nodes-base.code` | 2 | [1200,350] | N06(false), N13(fallback) | N18 |
| N24 | Ghi chú: cần người duyệt | `n8n-nodes-base.stickyNote` | 1 | [3560,460] | – | – |

(typeVersion là gợi ý cho n8n 2.x; agent dựng có thể dùng bản mới nhất mà bản cài hỗ trợ, giữ nguyên tham số ngữ nghĩa.)

Thứ tự kết nối đầu ra của N17 (quan trọng với `executionOrder v1`, chạy theo vị trí từ trên xuống): N18 (y=0) phải ở trên N21 (y=300) để phản hồi webhook được gửi trước khi soạn email.

### 4.4 Hằng số dùng chung (sinh tại N04, gắn vào item dưới khóa `cau_hinh`)

Mọi node sau đọc ngưỡng từ `d.cau_hinh` – **không** khai báo lại hằng ở node khác. Trường `cau_hinh` trong JSON đầu vào (nếu người gọi gửi) bị **bỏ qua** để không ai tự nới ngưỡng qua webhook.

```js
const CAU_HINH = {
  PHIEN_BAN_QUY_TAC: "2026.11-1",
  DUNG_SAI_KL: 0.001,              // hai khối lượng coi là khớp nếu |a-b| <= 0.001
  NGUONG_KHAC_THIET_KE: 0.05,      // |kl_hoan_cong - kl_tk_tham_chieu| / kl_tk_tham_chieu > 5% => "khác thiết kế" (CẦN DUYỆT, Mục 9)
  DUNG_SAI_TIEN: 1,                // đồng; so tổng tiền sau khi làm tròn
  MOC_PHAP_LY: "2026-07-01",
  THOI_HAN_BO_SUNG_MAC_DINH: 7,    // ngày lịch
  CHI_NHANH: ["Khu Liên Hợp", "Tân Uyên", "Dĩ An", "Bàu Bàng"],
  EMAIL_PHONG_DAU_TU: "",          // để trống; người duyệt điền
};
```

#### 4.4.1 Nhóm YCBS (11 nhóm, cố định thứ tự)

| `so` | Tên nhóm |
|---|---|
| 1 | Pháp lý dự án |
| 2 | Sự phù hợp quy hoạch |
| 3 | Quy mô – phạm vi đầu tư |
| 4 | Giải pháp kỹ thuật |
| 5 | Thiết kế cơ sở/TKKT |
| 6 | Khối lượng – Dự toán |
| 7 | Tổng mức đầu tư |
| 8 | Hiệu quả đầu tư |
| 9 | Hồ sơ bản vẽ |
| 10 | Hồ sơ thuyết minh |
| 11 | Các nội dung khác |

Giá trị cột "Yêu cầu chỉnh sửa" chỉ nhận đúng 4 chuỗi: `Không` | `Bổ sung` | `Điều chỉnh` | `Bổ sung-điều chỉnh`.

#### 4.4.2 Danh mục 15 tiêu chí

Nhóm: `KHONG_BAT_BUOC` = không bắt buộc điều chỉnh; `BAT_BUOC_DC` = bắt buộc điều chỉnh TK–DT; `CHAN_QT` = chặn quyết toán; `THAM_KHAO` = không phải tiêu chí quyết định; `TONG_HOP` = kết luận.

| Số | Tên (TẠM – thay bằng tên trong Bảng tiêu chí đánh giá chính thức, xem Mục 9) | Nhóm | Nhóm YCBS mặc định |
|---|---|---|---|
| 1 | Căn cứ pháp lý, chủ trương đầu tư | KHONG_BAT_BUOC | 1 |
| 2 | Sự phù hợp quy hoạch, lộ giới | KHONG_BAT_BUOC | 2 |
| 3 | Quy mô, phạm vi theo chủ trương | KHONG_BAT_BUOC | 3 |
| 4 | Điều chỉnh nhỏ vị trí tuyến trong phạm vi cho phép | KHONG_BAT_BUOC | 4 |
| 5 | Thay đổi hướng tuyến / chiều dài tuyến | BAT_BUOC_DC | 5 |
| 6 | Thay đổi đường kính / vật liệu ống | BAT_BUOC_DC | 5 |
| 7 | Thay đổi biện pháp thi công không làm đổi khối lượng chính | KHONG_BAT_BUOC | 4 |
| 8 | Thay đổi giải pháp kỹ thuật lắp đặt / đấu nối | BAT_BUOC_DC | 4 |
| 9 | Phát sinh / cắt giảm hạng mục so với dự toán duyệt | BAT_BUOC_DC | 6 |
| 10 | Hoàn chỉnh trình bày hồ sơ bản vẽ, thuyết minh | KHONG_BAT_BUOC | 9 |
| 11 | Khối lượng thay đổi so với dự toán duyệt | BAT_BUOC_DC | 6 |
| 12 | Chênh lệch chi phí | THAM_KHAO | 7 |
| 13 | Chỉ có biên bản hiện trường, không có hồ sơ điều chỉnh | CHAN_QT | 5 |
| 14 | Hoàn công khác thiết kế mà không có điều chỉnh | CHAN_QT | 5 |
| 15 | Kết luận tổng hợp | TONG_HOP | – |

Workflow chỉ phụ thuộc vào **số** và **nhóm** của tiêu chí; đổi tên không làm thay đổi logic.

#### 4.4.3 Cấu trúc một "phát hiện" (`phat_hien[]`)

```js
{
  ma: "QT_LECH_NGHIEM_THU",      // mã phát hiện, bảng 4.4.4
  muc_do: "chan" | "thieu_can_cu" | "luu_y",
  nhom_ycbs: 1..11,
  yeu_cau: "Không" | "Bổ sung" | "Điều chỉnh" | "Bổ sung-điều chỉnh",
  noi_dung: "string tiếng Việt, đủ để dán vào phiếu",
  hang_muc_stt: number | null,
  tien_anh_huong: number | null, // đồng, >0 = đề nghị giảm (thanh toán dư), <0 = thiếu
  nguon: "N07".."N11"
}
```

- `chan`: số liệu quyết toán sai → chặn kết luận "Đạt" (xem quy tắc 3, Mục 5.3).
- `thieu_can_cu`: thiếu hồ sơ/số liệu → "Chưa kết luận".
- `luu_y`: chỉ ghi nhận, không ảnh hưởng kết luận.

#### 4.4.4 Danh mục mã phát hiện

| Mã | Node | Mức | Nhóm YCBS | Yêu cầu | Điều kiện |
|---|---|---|---|---|---|
| `THIEU_HO_SO` | N07 | thieu_can_cu | theo hồ sơ (bảng 4.5.N07) | Bổ sung | hồ sơ bắt buộc `co=false` hoặc không khai báo |
| `THIEU_DU_TOAN_DIEU_CHINH` | N07 | thieu_can_cu | 6 | Bổ sung | có TK điều chỉnh nhưng không có DT điều chỉnh |
| `THIEU_SO_GOC` | N08 | thieu_can_cu | 6 | Bổ sung | `kl_nghiem_thu_hien_truong = null` |
| `QT_LECH_NGHIEM_THU` | N08 | chan | 6 | Điều chỉnh | kl_quyet_toan ≠ kl_nghiem_thu_hien_truong |
| `HC_LECH_NGHIEM_THU` | N08 | chan | 9 | Điều chỉnh | kl_hoan_cong ≠ kl_nghiem_thu_hien_truong |
| `BBNT_LECH_SO_GOC` | N08 | chan | 6 | Điều chỉnh | kl_nghiem_thu_bbnt ≠ kl_nghiem_thu_hien_truong (khi cả hai khác null) |
| `CHEP_HOP_DONG_KHONG_SO_DO` | N09 | chan | 6 | Bổ sung-điều chỉnh | xem N09 |
| `DON_GIA_KHAC_HOP_DONG` | N09 | chan | 6 | Điều chỉnh | HĐ đơn giá cố định, don_gia_quyet_toan ≠ don_gia_hop_dong |
| `HANG_MUC_NGOAI_HOP_DONG` | N09 | chan | 1 | Bổ sung | kl_hop_dong = 0 và kl_quyet_toan > 0, không có phụ lục |
| `VUOT_GIA_HOP_DONG` | N09 | chan | 1 | Bổ sung | tổng QT tính lại > giá HĐ hiệu lực, không có phụ lục |
| `GIAM_SAT_KHONG_GIAO` | N09 | chan | 6 | Điều chỉnh | giám sát có trong DT, không giao ai, vẫn có trong QT |
| `GIAM_SAT_KHONG_GIAO_LUU_Y` | N09 | luu_y | 6 | Không | giám sát có trong DT, không giao ai, không đưa vào QT |
| `HOA_DON_KHONG_KHOP` | N09 | chan | 11 | Điều chỉnh | giá trị hóa đơn ≠ tổng QT tính lại (sau thuế) |
| `CHECKLIST_KHONG_DAT` | N10 | chan (riêng `loi_trinh_bay`: luu_y) | bảng 4.5.N10 | Điều chỉnh | mục checklist `khong_dat` |
| `CHECKLIST_CHUA_KIEM_TRA` | N10 | thieu_can_cu | bảng 4.5.N10 | Bổ sung | mục checklist `chua_kiem_tra` |
| `CONG_DON_SAI` | N10 | chan | 6 | Điều chỉnh | tổng khai báo ≠ tổng tính lại |
| `MOC_PHAP_LY_SAI` | N10 | chan | 6 | Điều chỉnh | mốc khai báo ≠ mốc suy ra từ ngày lập dự toán |
| `CHIEU_DAI_TUYEN_LECH` | N10 | chan | 9 | Điều chỉnh | chiều dài bản vẽ ≠ tổng KL hoàn công ống |
| `TIEU_CHI_HA_TU_DONG` | N11 | (không tạo phát hiện riêng; ghi vào tiêu chí) | – | – | máy hạ tiêu chí 13/14 |

### 4.5 Chi tiết từng node

---

#### N01 – Webhook nhận hồ sơ (`n8n-nodes-base.webhook`)

Tham số:

| Tham số | Giá trị |
|---|---|
| `httpMethod` | `POST` |
| `path` | `biwase/kiem-tra-quyet-toan` |
| `responseMode` | `responseNode` (bắt buộc – mọi nhánh phải tới N19) |
| `authentication` | `none` (xem Mục 9 – đề nghị bật Header Auth khi đưa vào dùng thật) |
| `options.rawBody` | `false` |
| `webhookId` | sinh UUID cố định khi dựng |

Đầu ra: `{ headers, params, query, body }` – n8n tự parse JSON vào `body`.

---

#### N02 – Chạy thử thủ công (`n8n-nodes-base.manualTrigger`)

Không tham số. Đầu ra: 1 item rỗng.

---

#### N03 – Dữ liệu mẫu (Code)

Mục đích: sinh hồ sơ mẫu theo kịch bản để chạy thử không cần gửi HTTP.

```js
const KICH_BAN = "DAT"; // DAT | DIEU_CHINH_TK_DT | DUNG_QUYET_TOAN | CHUA_KET_LUAN | CONG_SO_LIEU | LOI_HANG_MUC_RONG
const goc = /* dán NGUYÊN VĂN JSON ở Mục 3.3 */;
const hs = JSON.parse(JSON.stringify(goc));      // bản sao sâu
const tc = (so) => hs.danh_gia_tieu_chi.find(t => t.so === so);

switch (KICH_BAN) {
  case "DIEU_CHINH_TK_DT":
    tc(9).ket_qua = "khong_phu_hop";
    tc(9).nhan_xet = "Phát sinh 01 van chặn D100 so với dự toán duyệt, cần lập dự toán điều chỉnh";
    break;
  case "DUNG_QUYET_TOAN":
    Object.assign(hs.hang_muc[0], { kl_hoan_cong: 520, kl_nghiem_thu_hien_truong: 520, kl_nghiem_thu_bbnt: 520, kl_quyet_toan: 520 });
    hs.checklist_ban_ve_hoan_cong.chieu_dai_tuyen.so_lieu.chieu_dai_ban_ve = 520;
    tc(5).ket_qua = "khong_phu_hop";                       // người kiểm tra thấy đổi tuyến
    // tc(13), tc(14) vẫn "phu_hop" (nhập sai) -> máy phải hạ
    break;
  case "CHUA_KET_LUAN":
    hs.ho_so.find(h => h.ma === "HOA_DON_GTGT").co = false;
    hs.hoa_don_gtgt = null;
    hs.checklist_ban_ve_hoan_cong.loi_trinh_bay.ket_qua = "chua_kiem_tra";
    tc(10).ket_qua = "chua_du_can_cu";
    break;
  case "CONG_SO_LIEU":
    Object.assign(hs.hang_muc[3], { kl_nghiem_thu_bbnt: 135, kl_quyet_toan: 135, co_so_do_hien_truong: false });
    break;
  case "LOI_HANG_MUC_RONG":
    hs.hang_muc = [];
    break;
}
hs.__nguon_thu_cong = { kich_ban: KICH_BAN };   // dấu hiệu nguồn chạy thử
return [{ json: hs }];
```

Ghi chú: tổng khai báo/hóa đơn trong các kịch bản biến thể **không** được cập nhật theo – điều này có chủ ý ở `CONG_SO_LIEU`/`DUNG_QUYET_TOAN` (sinh thêm `CONG_DON_SAI`, `HOA_DON_KHONG_KHOP`), không ảnh hưởng kết luận ưu tiên cao hơn. Kết quả mong đợi ở Mục 7.

---

#### N04 – Chuẩn hóa đầu vào (Code)

Đầu vào: item từ N01 (`{headers, body,...}`) hoặc N03 (hồ sơ trực tiếp).
Đầu ra: `{ ...hoSoChuanHoa, meta, cau_hinh, loi_chuan_hoa: [] }`.

```js
const x = $input.first().json;
const laWebhook = x && typeof x === "object" && x.headers !== undefined && "body" in x;
let raw = laWebhook ? x.body : x;
const loi = [];

// 1. body dạng chuỗi -> thử parse
if (typeof raw === "string") {
  try { raw = JSON.parse(raw); } catch (e) { loi.push({ truong: "(body)", ma: "JSON_KHONG_HOP_LE", thong_bao: "Body không phải JSON hợp lệ" }); raw = {}; }
}
// 2. body phải là object, không phải mảng/null
if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
  loi.push({ truong: "(body)", ma: "BODY_KHONG_PHAI_OBJECT", thong_bao: "Body phải là 1 object hồ sơ (mỗi lần gửi 1 hồ sơ)" });
  raw = {};
}

const nguonThuCong = raw.__nguon_thu_cong;
delete raw.__nguon_thu_cong;
delete raw.cau_hinh;                               // không cho ghi đè ngưỡng

// 3. Đổi chuỗi số -> number cho các trường số đã biết
const SO_HANG_MUC = ["stt","kl_thiet_ke","kl_thiet_ke_dieu_chinh","kl_hoan_cong","kl_nghiem_thu_hien_truong",
  "kl_nghiem_thu_bbnt","kl_quyet_toan","kl_hop_dong","don_gia_hop_dong","don_gia_quyet_toan"];
function toSo(v, duongDan) {
  if (v === null || v === undefined || typeof v === "number") return v;
  if (typeof v === "string") {
    const s = v.trim();
    if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
    loi.push({ truong: duongDan, ma: "SO_SAI_DINH_DANG",
      thong_bao: `Giá trị "${v}" không phải số. Dùng dấu chấm thập phân, không dùng dấu phân cách nghìn (vd 1234.5)` });
    return v;
  }
  return v;   // kiểu khác để N05 báo lỗi kiểu
}
if (Array.isArray(raw.hang_muc)) raw.hang_muc.forEach((h, i) => {
  if (h && typeof h === "object") SO_HANG_MUC.forEach(k => { if (k in h) h[k] = toSo(h[k], `hang_muc[${i}].${k}`); });
});
// tương tự cho: hop_dong.gia_tri_hop_dong, hop_dong.gia_tri_sau_phu_luc, tong_hop_khai_bao.*, hoa_don_gtgt.(gia_tri_truoc_thue|thue_suat|gia_tri_sau_thue), chi_phi_giam_sat.gia_tri, cong_trinh.thoi_han_bo_sung_ngay

// 4. Trim mọi chuỗi ở cong_trinh; chuẩn hóa chi_nhanh về đúng chính tả trong CAU_HINH.CHI_NHANH (so không phân biệt hoa thường)
// 5. Mặc định
raw.phien_ban_schema ??= "1.0";
if (raw.cong_trinh && typeof raw.cong_trinh === "object") {
  raw.cong_trinh.loai_ho_so ??= "Quyết toán";
  raw.cong_trinh.thoi_han_bo_sung_ngay ??= CAU_HINH.THOI_HAN_BO_SUNG_MAC_DINH;
}
raw.chi_phi_giam_sat = { co_trong_du_toan:false, gia_tri:0, da_giao_don_vi:false, don_vi_giam_sat:null, co_trong_quyet_toan:false, ...(raw.chi_phi_giam_sat||{}) };
raw.ghi_chu_nguoi_kiem_tra ??= "";

const bayGio = DateTime.now().setZone("Asia/Ho_Chi_Minh");
const ma = (raw.cong_trinh && raw.cong_trinh.ma_cong_trinh) || "KHONG_RO";
return [{ json: {
  ...raw,
  meta: {
    nguon: laWebhook ? "webhook" : "thu_cong",
    kich_ban: nguonThuCong ? nguonThuCong.kich_ban : null,
    ma_phien: `KTQT-${ma}-${bayGio.toFormat("yyyyLLddHHmmss")}`,
    thoi_diem: bayGio.toISO(),
    phien_ban_quy_tac: CAU_HINH.PHIEN_BAN_QUY_TAC,
  },
  cau_hinh: CAU_HINH,
  loi_chuan_hoa: loi,
}}];
```

---

#### N05 – Kiểm tra cấu trúc (Code)

Đầu ra: item cũ + `kiem_tra_cau_truc: { hop_le: boolean, loi: Loi[], canh_bao: string[] }`. Gom **tất cả** lỗi (không dừng ở lỗi đầu).

```js
const d = $input.first().json;
const C = d.cau_hinh;
const loi = [...d.loi_chuan_hoa];
const canhBao = [];
const them = (truong, ma, thong_bao) => loi.push({ truong, ma, thong_bao });
const laNgay = s => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && DateTime.fromISO(s).isValid;
const chuoiKhongRong = s => typeof s === "string" && s.trim() !== "";
const soKhongAm = v => typeof v === "number" && Number.isFinite(v) && v >= 0;

if (d.phien_ban_schema !== "1.0") them("phien_ban_schema", "SAI_PHIEN_BAN", "Chỉ hỗ trợ phiên bản 1.0");

// cong_trinh
const ct = d.cong_trinh;
if (!ct || typeof ct !== "object") them("cong_trinh", "THIEU_TRUONG", "Thiếu thông tin công trình");
else {
  for (const k of ["ma_cong_trinh","ten_cong_trinh","dia_diem","nguoi_kiem_tra"]) if (!chuoiKhongRong(ct[k])) them(`cong_trinh.${k}`, "THIEU_TRUONG", "Bắt buộc, không được rỗng");
  if (!C.CHI_NHANH.includes(ct.chi_nhanh)) them("cong_trinh.chi_nhanh", "GIA_TRI_KHONG_HOP_LE", `Phải là một trong: ${C.CHI_NHANH.join(", ")}`);
  if (!ct.nha_thau || !chuoiKhongRong(ct.nha_thau.ten)) them("cong_trinh.nha_thau.ten", "THIEU_TRUONG", "Bắt buộc");
  if (ct.loai_ho_so !== "Quyết toán") them("cong_trinh.loai_ho_so", "GIA_TRI_KHONG_HOP_LE", "Workflow này chỉ xử lý loại hồ sơ Quyết toán");
  for (const k of ["ngay_nhan","ngay_lap_du_toan"]) if (!laNgay(ct[k])) them(`cong_trinh.${k}`, "NGAY_KHONG_HOP_LE", "Định dạng YYYY-MM-DD");
  const th = ct.thoi_han_bo_sung_ngay;
  if (!(Number.isInteger(th) && th >= 1 && th <= 60)) them("cong_trinh.thoi_han_bo_sung_ngay", "GIA_TRI_KHONG_HOP_LE", "Số nguyên 1–60");
}

// hop_dong
const hd = d.hop_dong;
if (!hd || typeof hd !== "object") them("hop_dong", "THIEU_TRUONG", "Thiếu thông tin hợp đồng");
else {
  if (!chuoiKhongRong(hd.so_hop_dong)) them("hop_dong.so_hop_dong", "THIEU_TRUONG", "Bắt buộc");
  if (!["don_gia_co_dinh","tron_goi","don_gia_dieu_chinh"].includes(hd.loai_gia)) them("hop_dong.loai_gia", "GIA_TRI_KHONG_HOP_LE", "don_gia_co_dinh | tron_goi | don_gia_dieu_chinh");
  if (!soKhongAm(hd.gia_tri_hop_dong)) them("hop_dong.gia_tri_hop_dong", "SO_KHONG_HOP_LE", "Số ≥ 0");
  if (hd.gia_tri_sau_phu_luc != null && !soKhongAm(hd.gia_tri_sau_phu_luc)) them("hop_dong.gia_tri_sau_phu_luc", "SO_KHONG_HOP_LE", "Số ≥ 0 hoặc null");
}

// ho_so
const MA_HO_SO = ["CV_CHU_TRUONG","HS_THIET_KE","HS_THIET_KE_DIEU_CHINH","DU_TOAN_PHE_DUYET","DU_TOAN_DIEU_CHINH","DE_XUAT_GIA",
  "QD_CHI_DINH_THAU","HOP_DONG","PHU_LUC_HOP_DONG","BB_NGHIEM_THU_HIEN_TRUONG","BBNT_KHOI_LUONG","BBNT_HOAN_THANH",
  "BAN_VE_HOAN_CONG","BANG_QUYET_TOAN","HOA_DON_GTGT"];
if (!Array.isArray(d.ho_so)) them("ho_so", "THIEU_TRUONG", "Phải là mảng danh mục hồ sơ");
else {
  const daGap = new Set();
  d.ho_so.forEach((h, i) => {
    if (!h || !MA_HO_SO.includes(h.ma)) them(`ho_so[${i}].ma`, "MA_HO_SO_LA", `Mã hồ sơ không hợp lệ: ${h && h.ma}`);
    else if (daGap.has(h.ma)) them(`ho_so[${i}].ma`, "MA_HO_SO_TRUNG", `Trùng mã ${h.ma}`);
    else daGap.add(h.ma);
    if (h && typeof h.co !== "boolean") them(`ho_so[${i}].co`, "KIEU_SAI", "Phải là true/false");
  });
  MA_HO_SO.filter(m => !daGap.has(m)).forEach(m => canhBao.push(`Không khai báo hồ sơ ${m} – coi như không có`));
}

// hang_muc
if (!Array.isArray(d.hang_muc)) them("hang_muc", "THIEU_TRUONG", "Phải là mảng hạng mục");
else if (d.hang_muc.length === 0) them("hang_muc", "HANG_MUC_RONG", "Danh sách hạng mục rỗng – không có gì để đối chiếu");
else {
  const sttGap = new Set();
  d.hang_muc.forEach((h, i) => {
    const p = `hang_muc[${i}]`;
    if (!h || typeof h !== "object") { them(p, "KIEU_SAI", "Phải là object"); return; }
    if (!Number.isInteger(h.stt)) them(`${p}.stt`, "KIEU_SAI", "Số nguyên");
    else if (sttGap.has(h.stt)) them(`${p}.stt`, "STT_TRUNG", `Trùng stt ${h.stt}`); else sttGap.add(h.stt);
    for (const k of ["ten","don_vi"]) if (!chuoiKhongRong(h[k])) them(`${p}.${k}`, "THIEU_TRUONG", "Bắt buộc");
    if (!["ong","phu_kien","dao_dap","cat_dem","tai_lap","khac"].includes(h.loai)) them(`${p}.loai`, "GIA_TRI_KHONG_HOP_LE", "ong|phu_kien|dao_dap|cat_dem|tai_lap|khac");
    for (const k of ["kl_thiet_ke","kl_hoan_cong","kl_quyet_toan","kl_hop_dong","don_gia_quyet_toan"]) if (!soKhongAm(h[k])) them(`${p}.${k}`, "SO_KHONG_HOP_LE", "Số ≥ 0, bắt buộc");
    for (const k of ["kl_thiet_ke_dieu_chinh","kl_nghiem_thu_hien_truong","kl_nghiem_thu_bbnt","don_gia_hop_dong"]) if (h[k] != null && !soKhongAm(h[k])) them(`${p}.${k}`, "SO_KHONG_HOP_LE", "Số ≥ 0 hoặc null");
    if (!("kl_nghiem_thu_hien_truong" in h)) them(`${p}.kl_nghiem_thu_hien_truong`, "THIEU_TRUONG", "Bắt buộc khai báo (được null nếu không có số đo)");
    if (soKhongAm(h.kl_hop_dong) && h.kl_hop_dong > 0 && h.don_gia_hop_dong == null) them(`${p}.don_gia_hop_dong`, "THIEU_TRUONG", "Bắt buộc khi hạng mục có trong hợp đồng");
    if (typeof h.co_so_do_hien_truong !== "boolean") them(`${p}.co_so_do_hien_truong`, "KIEU_SAI", "true/false");
  });
}

// tong_hop_khai_bao
const th = d.tong_hop_khai_bao;
if (!th) them("tong_hop_khai_bao", "THIEU_TRUONG", "Bắt buộc");
else for (const k of ["tong_quyet_toan_truoc_thue","thue_suat_gtgt","tong_quyet_toan_sau_thue"]) if (!soKhongAm(th[k])) them(`tong_hop_khai_bao.${k}`, "SO_KHONG_HOP_LE", "Số ≥ 0");

// checklist: chỉ kiểm enum nếu có mặt; thiếu thì N10 coi là chua_kiem_tra
const KQ_CL = ["dat","khong_dat","chua_kiem_tra","khong_ap_dung"];
for (const nhom of ["checklist_ban_ve_hoan_cong","checklist_du_toan_quyet_toan"]) {
  const o = d[nhom]; if (o == null) { canhBao.push(`Thiếu ${nhom} – mọi mục coi là chưa kiểm tra`); continue; }
  for (const [k, v] of Object.entries(o)) if (!v || !KQ_CL.includes(v.ket_qua)) them(`${nhom}.${k}.ket_qua`, "GIA_TRI_KHONG_HOP_LE", KQ_CL.join("|"));
}

// danh_gia_tieu_chi
if (d.danh_gia_tieu_chi != null) {
  if (!Array.isArray(d.danh_gia_tieu_chi)) them("danh_gia_tieu_chi", "KIEU_SAI", "Phải là mảng");
  else {
    const soGap = new Set();
    d.danh_gia_tieu_chi.forEach((t, i) => {
      if (!t || !Number.isInteger(t.so) || t.so < 1 || t.so > 15) { them(`danh_gia_tieu_chi[${i}].so`, "GIA_TRI_KHONG_HOP_LE", "1..15"); return; }
      if (soGap.has(t.so)) them(`danh_gia_tieu_chi[${i}].so`, "TIEU_CHI_TRUNG", `Trùng tiêu chí ${t.so}`); soGap.add(t.so);
      if (!["phu_hop","khong_phu_hop","chua_du_can_cu"].includes(t.ket_qua)) them(`danh_gia_tieu_chi[${i}].ket_qua`, "GIA_TRI_KHONG_HOP_LE", "phu_hop|khong_phu_hop|chua_du_can_cu");
      if (t.nhom_ycbs != null && !(Number.isInteger(t.nhom_ycbs) && t.nhom_ycbs >= 1 && t.nhom_ycbs <= 11)) them(`danh_gia_tieu_chi[${i}].nhom_ycbs`, "GIA_TRI_KHONG_HOP_LE", "1..11");
      if (t.so === 15) canhBao.push("Tiêu chí 15 do máy tự lập – giá trị gửi lên bị bỏ qua");
    });
  }
} else canhBao.push("Không có đánh giá tiêu chí – tiêu chí 1–14 coi là chưa đủ căn cứ");

return [{ json: { ...d, kiem_tra_cau_truc: { hop_le: loi.length === 0, loi, canh_bao: canhBao } } }];
```

---

#### N06 – Hợp lệ? (`n8n-nodes-base.if`)

| Tham số | Giá trị |
|---|---|
| Điều kiện | `{{ $json.kiem_tra_cau_truc.hop_le }}` – kiểu Boolean – phép `is true` |
| `looseTypeValidation` | `false` |
| Output `true` | → N07 |
| Output `false` | → N23 |

---

#### N07 – Kiểm tra hồ sơ căn cứ (Code)

Đầu ra thêm: `kiem_tra_ho_so: { danh_sach: [{ma, ten, muc, co, dat}], thieu: string[], co_dieu_chinh_day_du: boolean, co_phu_luc: boolean }`, `phat_hien: [...]`.

Bảng nhóm YCBS cho hồ sơ thiếu:

| Mã hồ sơ | Nhóm YCBS |
|---|---|
| CV_CHU_TRUONG, DE_XUAT_GIA, QD_CHI_DINH_THAU, HOP_DONG, PHU_LUC_HOP_DONG | 1 |
| HS_THIET_KE, HS_THIET_KE_DIEU_CHINH | 5 |
| DU_TOAN_PHE_DUYET, DU_TOAN_DIEU_CHINH, BANG_QUYET_TOAN, BB_NGHIEM_THU_HIEN_TRUONG, BBNT_KHOI_LUONG | 6 |
| BAN_VE_HOAN_CONG | 9 |
| BBNT_HOAN_THANH | 10 |
| HOA_DON_GTGT | 11 |

```js
const d = $input.first().json;
const co = ma => (d.ho_so.find(h => h.ma === ma) || {}).co === true;
const BAT_BUOC = ["CV_CHU_TRUONG","DU_TOAN_PHE_DUYET","DE_XUAT_GIA","QD_CHI_DINH_THAU","HOP_DONG",
  "BB_NGHIEM_THU_HIEN_TRUONG","BBNT_KHOI_LUONG","BBNT_HOAN_THANH","BAN_VE_HOAN_CONG","BANG_QUYET_TOAN","HOA_DON_GTGT"];
const TEN = { /* bảng 3.2.4 */ };
const NHOM = { /* bảng trên */ };
const ph = [];
const danhSach = [];

for (const ma of BAT_BUOC) {
  const dat = co(ma);
  danhSach.push({ ma, ten: TEN[ma], muc: "bat_buoc", co: dat, dat });
  if (!dat) ph.push({ ma: "THIEU_HO_SO", muc_do: "thieu_can_cu", nhom_ycbs: NHOM[ma], yeu_cau: "Bổ sung",
    noi_dung: `Thiếu ${TEN[ma]}`, hang_muc_stt: null, tien_anh_huong: null, nguon: "N07" });
}
// Thiết kế: TK gốc hoặc TK điều chỉnh
const coTK = co("HS_THIET_KE") || co("HS_THIET_KE_DIEU_CHINH");
danhSach.push({ ma: "HS_THIET_KE", ten: TEN.HS_THIET_KE, muc: "bat_buoc", co: co("HS_THIET_KE"), dat: coTK });
if (!coTK) ph.push({ ma: "THIEU_HO_SO", muc_do: "thieu_can_cu", nhom_ycbs: 5, yeu_cau: "Bổ sung",
  noi_dung: "Thiếu hồ sơ thiết kế (hoặc thiết kế điều chỉnh)", hang_muc_stt: null, tien_anh_huong: null, nguon: "N07" });
// Điều chỉnh: TK điều chỉnh mà không có DT điều chỉnh
if (co("HS_THIET_KE_DIEU_CHINH") && !co("DU_TOAN_DIEU_CHINH")) ph.push({ ma: "THIEU_DU_TOAN_DIEU_CHINH", muc_do: "thieu_can_cu",
  nhom_ycbs: 6, yeu_cau: "Bổ sung", noi_dung: "Có thiết kế điều chỉnh nhưng thiếu dự toán điều chỉnh được phê duyệt", hang_muc_stt: null, tien_anh_huong: null, nguon: "N07" });
// Hóa đơn: khai có nhưng không có chi tiết
if (co("HOA_DON_GTGT") && !d.hoa_don_gtgt) ph.push({ ma: "THIEU_HO_SO", muc_do: "thieu_can_cu", nhom_ycbs: 11, yeu_cau: "Bổ sung",
  noi_dung: "Khai có hóa đơn GTGT nhưng không cung cấp số, ngày, giá trị hóa đơn", hang_muc_stt: null, tien_anh_huong: null, nguon: "N07" });
// PHU_LUC_HOP_DONG: chỉ đánh giá ở N09 (điều kiện phụ thuộc số liệu)

const thieu = ph.filter(p => p.ma === "THIEU_HO_SO" || p.ma === "THIEU_DU_TOAN_DIEU_CHINH").map(p => p.noi_dung);
return [{ json: { ...d,
  kiem_tra_ho_so: { danh_sach: danhSach, thieu,
    co_dieu_chinh_day_du: co("HS_THIET_KE_DIEU_CHINH") && co("DU_TOAN_DIEU_CHINH"),
    co_phu_luc: co("PHU_LUC_HOP_DONG") },
  phat_hien: [...(d.phat_hien || []), ...ph] } }];
```

---

#### N08 – Đối chiếu ba chiều (Code)

Nguyên tắc: **khối lượng nghiệm thu hiện trường là số gốc**. Ba con số phải khớp: hoàn công = nghiệm thu hiện trường = quyết toán. Thành tiền ảnh hưởng tính theo đơn giá quyết toán.

Đầu ra thêm `doi_chieu`:

```js
{
  hang_muc: [{
    stt, ten, don_vi, loai,
    kl_tk_tham_chieu, kl_hoan_cong, kl_nghiem_thu_hien_truong, kl_nghiem_thu_bbnt, kl_quyet_toan, kl_hop_dong,
    don_gia_quyet_toan,
    lech_hc_nt, lech_qt_nt, lech_qt_hc, lech_bbnt_nt,     // number | null (null nếu thiếu số gốc)
    thanh_tien_anh_huong,                                 // = round(lech_qt_nt * don_gia_quyet_toan); >0 thanh toán dư
    ty_le_khac_thiet_ke,                                  // (kl_hoan_cong - kl_tk_tham_chieu)/kl_tk_tham_chieu; null nếu kl_tk_tham_chieu = 0
    khac_thiet_ke_hc: boolean,                            // hoàn công khác thiết kế (dùng cho TC14)
    khac_thiet_ke_nt: boolean,                            // nghiệm thu hiện trường khác thiết kế (dùng cho TC13)
    trang_thai: "khop" | "lech" | "thieu_so_goc",
    thanh_tien_quyet_toan                                 // round(kl_quyet_toan * don_gia_quyet_toan)
  }],
  tong_qt_tinh_lai: number,         // Σ thanh_tien_quyet_toan
  tong_thanh_toan_du: number,       // Σ thanh_tien_anh_huong > 0
  tong_thanh_toan_thieu: number,    // |Σ thanh_tien_anh_huong < 0|
  so_hang_muc_lech: number,
  so_hang_muc_khac_thiet_ke: number
}
```

```js
const d = $input.first().json; const C = d.cau_hinh;
const khop = (a, b) => Math.abs(a - b) <= C.DUNG_SAI_KL;
const r3 = v => Math.round(v * 1000) / 1000;
const ph = [];
const dc = d.kiem_tra_ho_so.co_dieu_chinh_day_du;

function khacThietKe(kl, tk) {
  if (tk === 0) return kl > 0;          // hạng mục phát sinh không có trong thiết kế
  if (kl === 0) return tk > 0;          // hạng mục thiết kế bị bỏ
  return Math.abs(kl - tk) / tk > C.NGUONG_KHAC_THIET_KE;
}

const ds = d.hang_muc.map(h => {
  const tk = (dc && h.kl_thiet_ke_dieu_chinh != null) ? h.kl_thiet_ke_dieu_chinh : h.kl_thiet_ke;
  const nt = h.kl_nghiem_thu_hien_truong;
  const r = { stt: h.stt, ten: h.ten, don_vi: h.don_vi, loai: h.loai, kl_tk_tham_chieu: tk,
    kl_hoan_cong: h.kl_hoan_cong, kl_nghiem_thu_hien_truong: nt, kl_nghiem_thu_bbnt: h.kl_nghiem_thu_bbnt,
    kl_quyet_toan: h.kl_quyet_toan, kl_hop_dong: h.kl_hop_dong, don_gia_quyet_toan: h.don_gia_quyet_toan,
    thanh_tien_quyet_toan: Math.round(h.kl_quyet_toan * h.don_gia_quyet_toan),
    ty_le_khac_thiet_ke: tk > 0 ? r3((h.kl_hoan_cong - tk) / tk) : null,
    khac_thiet_ke_hc: khacThietKe(h.kl_hoan_cong, tk),
    khac_thiet_ke_nt: nt != null && khacThietKe(nt, tk),
    lech_qt_hc: r3(h.kl_quyet_toan - h.kl_hoan_cong) };

  if (nt == null) {
    Object.assign(r, { lech_hc_nt: null, lech_qt_nt: null, lech_bbnt_nt: null, thanh_tien_anh_huong: null, trang_thai: "thieu_so_goc" });
    ph.push({ ma: "THIEU_SO_GOC", muc_do: "thieu_can_cu", nhom_ycbs: 6, yeu_cau: "Bổ sung", hang_muc_stt: h.stt, tien_anh_huong: null, nguon: "N08",
      noi_dung: `Hạng mục ${h.stt} "${h.ten}": không có khối lượng nghiệm thu hiện trường (số gốc) để đối chiếu` });
    return r;
  }
  r.lech_hc_nt = r3(h.kl_hoan_cong - nt);
  r.lech_qt_nt = r3(h.kl_quyet_toan - nt);
  r.lech_bbnt_nt = h.kl_nghiem_thu_bbnt == null ? null : r3(h.kl_nghiem_thu_bbnt - nt);
  r.thanh_tien_anh_huong = Math.round(r.lech_qt_nt * h.don_gia_quyet_toan);
  const lech = !khop(h.kl_hoan_cong, nt) || !khop(h.kl_quyet_toan, nt) || (r.lech_bbnt_nt != null && !khop(h.kl_nghiem_thu_bbnt, nt));
  r.trang_thai = lech ? "lech" : "khop";

  if (!khop(h.kl_quyet_toan, nt)) ph.push({ ma: "QT_LECH_NGHIEM_THU", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh", hang_muc_stt: h.stt,
    tien_anh_huong: r.thanh_tien_anh_huong, nguon: "N08",
    noi_dung: `Hạng mục ${h.stt} "${h.ten}": quyết toán ${h.kl_quyet_toan} ${h.don_vi} ≠ nghiệm thu hiện trường ${nt} ${h.don_vi} (lệch ${r.lech_qt_nt}); thành tiền ảnh hưởng ${fmtTien(r.thanh_tien_anh_huong)} đ` });
  if (!khop(h.kl_hoan_cong, nt)) ph.push({ ma: "HC_LECH_NGHIEM_THU", muc_do: "chan", nhom_ycbs: 9, yeu_cau: "Điều chỉnh", hang_muc_stt: h.stt,
    tien_anh_huong: null, nguon: "N08",
    noi_dung: `Hạng mục ${h.stt} "${h.ten}": bản vẽ hoàn công ${h.kl_hoan_cong} ≠ nghiệm thu hiện trường ${nt} ${h.don_vi}` });
  if (r.lech_bbnt_nt != null && !khop(h.kl_nghiem_thu_bbnt, nt)) ph.push({ ma: "BBNT_LECH_SO_GOC", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh",
    hang_muc_stt: h.stt, tien_anh_huong: null, nguon: "N08",
    noi_dung: `Hạng mục ${h.stt} "${h.ten}": BBNT ghi ${h.kl_nghiem_thu_bbnt} ≠ khối lượng chốt hiện trường ${nt} ${h.don_vi}` });
  return r;
});

const tt = ds.map(x => x.thanh_tien_anh_huong).filter(v => v != null);
return [{ json: { ...d,
  doi_chieu: {
    hang_muc: ds,
    tong_qt_tinh_lai: ds.reduce((s, x) => s + x.thanh_tien_quyet_toan, 0),
    tong_thanh_toan_du: tt.filter(v => v > 0).reduce((s, v) => s + v, 0),
    tong_thanh_toan_thieu: -tt.filter(v => v < 0).reduce((s, v) => s + v, 0),
    so_hang_muc_lech: ds.filter(x => x.trang_thai !== "khop").length,
    so_hang_muc_khac_thiet_ke: ds.filter(x => x.khac_thiet_ke_hc || x.khac_thiet_ke_nt).length },
  phat_hien: [...d.phat_hien, ...ph] } }];
```

`fmtTien(n)` = định dạng số nguyên kiểu Việt Nam, dấu chấm phân cách nghìn (`new Intl.NumberFormat("vi-VN").format(n)`; nếu môi trường không có ICU thì tự chèn dấu chấm). Hàm này lặp lại trong N08, N09, N10, N14, N15, N16 (Code node không chia sẻ hàm).

---

#### N09 – Kiểm tra hợp đồng (Code)

Đầu ra thêm `kiem_tra_hop_dong`:

```js
{ loai_gia, gia_tri_hop_dong, gia_tri_hieu_luc, co_phu_luc, tong_qt_tinh_lai, vuot_hop_dong: number /* >0 nếu vượt */,
  hang_muc_chep_hop_dong: number[], hang_muc_ngoai_hop_dong: number[], hang_muc_don_gia_khac: number[],
  giam_sat: { co_trong_du_toan, da_giao_don_vi, co_trong_quyet_toan, gia_tri, ket_qua: "hop_le"|"khong_quyet_toan"|"luu_y" },
  hoa_don: { co, khop: boolean|null, chenh_lech_sau_thue: number|null } }
```

```js
const d = $input.first().json; const C = d.cau_hinh; const hd = d.hop_dong;
const ph = []; const khop = (a,b) => Math.abs(a-b) <= C.DUNG_SAI_KL;
const coPL = d.kiem_tra_ho_so.co_phu_luc;
const giaHieuLuc = (coPL && hd.gia_tri_sau_phu_luc != null) ? hd.gia_tri_sau_phu_luc : hd.gia_tri_hop_dong;
const tongQT = d.doi_chieu.tong_qt_tinh_lai;
const chep = [], ngoai = [], donGiaKhac = [];

for (const h of d.hang_muc) {
  // (a) Chép 100% hợp đồng mà không có số đo
  const bbntBangHD = h.kl_nghiem_thu_bbnt != null && khop(h.kl_nghiem_thu_bbnt, h.kl_hop_dong);
  const qtBangHD = khop(h.kl_quyet_toan, h.kl_hop_dong);
  if (h.kl_hop_dong > 0 && qtBangHD && (bbntBangHD || h.kl_nghiem_thu_bbnt == null) && (!h.co_so_do_hien_truong || h.kl_nghiem_thu_hien_truong == null)) {
    chep.push(h.stt);
    ph.push({ ma: "CHEP_HOP_DONG_KHONG_SO_DO", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Bổ sung-điều chỉnh", hang_muc_stt: h.stt,
      tien_anh_huong: null, nguon: "N09",
      noi_dung: `Hạng mục ${h.stt} "${h.ten}": BBNT/quyết toán chép đúng khối lượng hợp đồng (${h.kl_hop_dong} ${h.don_vi}) nhưng không có số đo hiện trường – rủi ro thanh toán dư. Bổ sung số đo và điều chỉnh theo khối lượng thực tế` });
  }
  // (b) Hạng mục ngoài hợp đồng
  if (h.kl_hop_dong === 0 && h.kl_quyet_toan > 0 && !coPL) {
    ngoai.push(h.stt);
    ph.push({ ma: "HANG_MUC_NGOAI_HOP_DONG", muc_do: "chan", nhom_ycbs: 1, yeu_cau: "Bổ sung", hang_muc_stt: h.stt,
      tien_anh_huong: Math.round(h.kl_quyet_toan * h.don_gia_quyet_toan), nguon: "N09",
      noi_dung: `Hạng mục ${h.stt} "${h.ten}" không có trong hợp đồng nhưng được quyết toán ${fmtTien(...)} đ – cần phụ lục hợp đồng` });
  }
  // (c) Đơn giá cố định
  if (hd.loai_gia === "don_gia_co_dinh" && h.kl_hop_dong > 0 && h.don_gia_hop_dong != null && h.don_gia_quyet_toan !== h.don_gia_hop_dong) {
    donGiaKhac.push(h.stt);
    const tien = Math.round(h.kl_quyet_toan * (h.don_gia_quyet_toan - h.don_gia_hop_dong));
    ph.push({ ma: "DON_GIA_KHAC_HOP_DONG", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh", hang_muc_stt: h.stt, tien_anh_huong: tien, nguon: "N09",
      noi_dung: `Hạng mục ${h.stt} "${h.ten}": HĐ đơn giá cố định ${fmtTien(h.don_gia_hop_dong)} đ nhưng quyết toán ${fmtTien(h.don_gia_quyet_toan)} đ; ảnh hưởng ${fmtTien(tien)} đ` });
  }
}
// (d) Vượt giá hợp đồng
const vuot = tongQT - giaHieuLuc;
if (vuot > C.DUNG_SAI_TIEN && !coPL) ph.push({ ma: "VUOT_GIA_HOP_DONG", muc_do: "chan", nhom_ycbs: 1, yeu_cau: "Bổ sung",
  hang_muc_stt: null, tien_anh_huong: vuot, nguon: "N09",
  noi_dung: `Giá trị quyết toán tính lại ${fmtTien(tongQT)} đ vượt giá hợp đồng ${fmtTien(giaHieuLuc)} đ là ${fmtTien(vuot)} đ nhưng không có phụ lục/điều chỉnh hợp đồng` });
if (vuot > C.DUNG_SAI_TIEN && coPL && hd.gia_tri_sau_phu_luc == null) ph.push({ ma: "VUOT_GIA_HOP_DONG", muc_do: "thieu_can_cu", nhom_ycbs: 1, yeu_cau: "Bổ sung",
  hang_muc_stt: null, tien_anh_huong: vuot, nguon: "N09", noi_dung: "Có phụ lục hợp đồng nhưng không khai báo giá trị sau phụ lục để đối chiếu" });
// (e) Giám sát
const gs = d.chi_phi_giam_sat; let kqGS = "hop_le";
if (gs.co_trong_du_toan && !gs.da_giao_don_vi && gs.co_trong_quyet_toan) {
  kqGS = "khong_quyet_toan";
  ph.push({ ma: "GIAM_SAT_KHONG_GIAO", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: gs.gia_tri, nguon: "N09",
    noi_dung: `Chi phí giám sát ${fmtTien(gs.gia_tri)} đ có trong dự toán nhưng không giao đơn vị thực hiện – không được quyết toán, đề nghị loại khỏi giá trị quyết toán` });
} else if (gs.co_trong_du_toan && !gs.da_giao_don_vi) {
  kqGS = "luu_y";
  ph.push({ ma: "GIAM_SAT_KHONG_GIAO_LUU_Y", muc_do: "luu_y", nhom_ycbs: 6, yeu_cau: "Không", hang_muc_stt: null, tien_anh_huong: null, nguon: "N09",
    noi_dung: "Chi phí giám sát có trong dự toán nhưng không giao đơn vị – đã không đưa vào quyết toán (đúng)" });
}
// (f) Hóa đơn GTGT so với tổng tính lại
let hoaDon = { co: !!d.hoa_don_gtgt, khop: null, chenh_lech_sau_thue: null };
if (d.hoa_don_gtgt) {
  const sauThueTinhLai = Math.round(tongQT * (1 + d.tong_hop_khai_bao.thue_suat_gtgt / 100));
  const cl = d.hoa_don_gtgt.gia_tri_sau_thue - sauThueTinhLai;
  hoaDon = { co: true, khop: Math.abs(cl) <= C.DUNG_SAI_TIEN, chenh_lech_sau_thue: cl };
  if (!hoaDon.khop) ph.push({ ma: "HOA_DON_KHONG_KHOP", muc_do: "chan", nhom_ycbs: 11, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: cl, nguon: "N09",
    noi_dung: `Hóa đơn GTGT số ${d.hoa_don_gtgt.so} giá trị ${fmtTien(d.hoa_don_gtgt.gia_tri_sau_thue)} đ ≠ giá trị quyết toán sau thuế tính lại ${fmtTien(sauThueTinhLai)} đ` });
}
return [{ json: { ...d, kiem_tra_hop_dong: { loai_gia: hd.loai_gia, gia_tri_hop_dong: hd.gia_tri_hop_dong, gia_tri_hieu_luc: giaHieuLuc,
  co_phu_luc: coPL, tong_qt_tinh_lai: tongQT, vuot_hop_dong: Math.max(0, vuot),
  hang_muc_chep_hop_dong: chep, hang_muc_ngoai_hop_dong: ngoai, hang_muc_don_gia_khac: donGiaKhac,
  giam_sat: { ...gs, ket_qua: kqGS }, hoa_don: hoaDon },
  phat_hien: [...d.phat_hien, ...ph] } }];
```

---

#### N10 – Tổng hợp checklist GĐ5 (Code)

Bảng mục checklist (tên hiển thị, nhóm YCBS):

| Nhóm checklist | Khóa | Tên hiển thị | Nhóm YCBS | Máy tự kiểm? |
|---|---|---|---|---|
| Bản vẽ hoàn công | `chieu_dai_tuyen` | Chiều dài tuyến | 9 | Có, nếu có `so_lieu.chieu_dai_ban_ve` |
| Bản vẽ hoàn công | `ky_thuat_lap_dat` | Kỹ thuật lắp đặt | 4 | Không |
| Bản vẽ hoàn công | `boc_tach_coc_vs_thong_ke_vat_tu` | Bóc tách KL chi tiết cọc so với bảng thống kê vật tư | 9 | Hạ về `khong_dat` nếu `so_muc_lech > 0` |
| Bản vẽ hoàn công | `loi_trinh_bay` | Lỗi trình bày | 9 | Không (mức `luu_y`) |
| Bảng quyết toán | `ma_hieu_dinh_muc_tt38` | Mã hiệu định mức TT38 | 6 | Không |
| Bảng quyết toán | `don_gia_nhan_cong_ca_may_bd` | Đơn giá nhân công/ca máy Bình Dương | 6 | Không |
| Bảng quyết toán | `can_cu_phap_ly_theo_moc` | Căn cứ pháp lý theo mốc 01/7/2026 | 6 | Có |
| Bảng quyết toán | `kl_dao_dap_cat_dem_tai_lap_khop_mat_cat` | KL đào đắp – cát đệm – tái lập khớp mặt cắt | 6 | Không |
| Bảng quyết toán | `don_gia_vat_tu_biwase` | Đơn giá vật tư Biwase (đường kính + vật liệu + kiểu đấu nối + góc + kiểu nối) | 6 | Hạ về `khong_dat` nếu `so_muc_khong_khop > 0` |
| Bảng quyết toán | `cong_don_tong` | Cộng dồn tổng | 6 | Có (luôn) |

Nguyên tắc: máy **chỉ hạ** (`dat`/`chua_kiem_tra` → `khong_dat`), không bao giờ nâng `khong_dat` → `dat`. Khi máy hạ, ghi `nguon: "tu_dong"` và lý do vào `ghi_chu_tu_dong`.

Đầu ra thêm `checklist_gd5: { ban_ve_hoan_cong: MucKetQua[], du_toan_quyet_toan: MucKetQua[], so_khong_dat, so_chua_kiem_tra }` với `MucKetQua = { khoa, ten, ket_qua_nguoi_nhap, ket_qua, nguon: "nguoi_kiem_tra"|"tu_dong", ghi_chu, ghi_chu_tu_dong }`.

```js
const d = $input.first().json; const C = d.cau_hinh; const ph = [];
const lay = (nhom, khoa) => (d[nhom] && d[nhom][khoa]) || { ket_qua: "chua_kiem_tra" };
const ha = (muc, lyDo) => { if (muc.ket_qua !== "khong_dat") { muc.ket_qua = "khong_dat"; muc.nguon = "tu_dong"; } muc.ghi_chu_tu_dong = lyDo; };

// Tạo danh sách mục từ bảng trên; mỗi mục: { khoa, ten, ket_qua_nguoi_nhap: x.ket_qua, ket_qua: x.ket_qua, nguon: "nguoi_kiem_tra", ghi_chu: x.ghi_chu||"", so_lieu: x.so_lieu||{} }

// Tự kiểm 1: chiều dài tuyến
const cdt = muc("chieu_dai_tuyen");
const tongOng = d.hang_muc.filter(h => h.loai === "ong").reduce((s,h) => s + h.kl_hoan_cong, 0);
if (cdt.so_lieu.chieu_dai_ban_ve != null && Math.abs(cdt.so_lieu.chieu_dai_ban_ve - tongOng) > C.DUNG_SAI_KL) {
  ha(cdt, `Chiều dài bản vẽ ${cdt.so_lieu.chieu_dai_ban_ve} m ≠ tổng KL hoàn công ống ${tongOng} m`);
  ph.push({ ma: "CHIEU_DAI_TUYEN_LECH", muc_do: "chan", nhom_ycbs: 9, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: null, nguon: "N10", noi_dung: cdt.ghi_chu_tu_dong });
}
// Tự kiểm 2: bóc tách cọc
const bt = muc("boc_tach_coc_vs_thong_ke_vat_tu");
if ((bt.so_lieu.so_muc_lech || 0) > 0) ha(bt, `${bt.so_lieu.so_muc_lech} mục bóc tách cọc lệch bảng thống kê vật tư`);
// Tự kiểm 3: vật tư Biwase
const vt = muc("don_gia_vat_tu_biwase");
if ((vt.so_lieu.so_muc_khong_khop || 0) > 0) ha(vt, `${vt.so_lieu.so_muc_khong_khop} vật tư chưa khớp đủ 5 thuộc tính (đường kính, vật liệu, kiểu đấu nối, góc, kiểu nối)`);
// Tự kiểm 4: mốc pháp lý
const mp = muc("can_cu_phap_ly_theo_moc");
const mocDung = d.cong_trinh.ngay_lap_du_toan >= C.MOC_PHAP_LY ? "tu_01072026" : "truoc_01072026";  // so chuỗi YYYY-MM-DD
if (mp.so_lieu.moc_ap_dung && mp.so_lieu.moc_ap_dung !== mocDung) {
  ha(mp, `Ngày lập dự toán ${d.cong_trinh.ngay_lap_du_toan} phải áp căn cứ ${mocDung === "tu_01072026" ? "từ 01/7/2026" : "trước 01/7/2026"}, hồ sơ khai ${mp.so_lieu.moc_ap_dung}`);
  ph.push({ ma: "MOC_PHAP_LY_SAI", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: null, nguon: "N10", noi_dung: mp.ghi_chu_tu_dong });
}
// Tự kiểm 5: cộng dồn tổng (luôn chạy)
const cd = muc("cong_don_tong");
const khaiBao = d.tong_hop_khai_bao.tong_quyet_toan_truoc_thue;
const tinhLai = d.doi_chieu.tong_qt_tinh_lai;
if (Math.abs(khaiBao - tinhLai) > C.DUNG_SAI_TIEN) {
  ha(cd, `Tổng khai báo ${fmtTien(khaiBao)} đ ≠ Σ(KL quyết toán × đơn giá) ${fmtTien(tinhLai)} đ`);
  ph.push({ ma: "CONG_DON_SAI", muc_do: "chan", nhom_ycbs: 6, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: khaiBao - tinhLai, nguon: "N10", noi_dung: cd.ghi_chu_tu_dong });
} else if (cd.ket_qua === "chua_kiem_tra") { cd.ket_qua = "dat"; cd.nguon = "tu_dong"; cd.ghi_chu_tu_dong = "Máy cộng dồn khớp"; }
// ^ ngoại lệ duy nhất máy được "nâng": mục cộng dồn tổng là phép tính thuần, máy kiểm thay người.
// Đồng thời kiểm sau thuế: |tong_quyet_toan_sau_thue - round(khaiBao*(1+thue/100))| > DUNG_SAI_TIEN -> thêm CONG_DON_SAI tương tự.

// Sinh phát hiện cho mọi mục còn lại (tránh trùng với phát hiện đã tạo ở trên cho cùng khóa)
for (const m of tatCaMuc) {
  if (m.ket_qua === "khong_dat" && !daCoPhatHien(m.khoa)) ph.push({ ma: "CHECKLIST_KHONG_DAT",
    muc_do: m.khoa === "loi_trinh_bay" ? "luu_y" : "chan", nhom_ycbs: m.nhom_ycbs, yeu_cau: "Điều chỉnh", hang_muc_stt: null, tien_anh_huong: null, nguon: "N10",
    noi_dung: `${m.ten}: không đạt. ${[m.ghi_chu, m.ghi_chu_tu_dong].filter(Boolean).join(". ")}` });
  if (m.ket_qua === "chua_kiem_tra") ph.push({ ma: "CHECKLIST_CHUA_KIEM_TRA", muc_do: "thieu_can_cu", nhom_ycbs: m.nhom_ycbs, yeu_cau: "Bổ sung",
    hang_muc_stt: null, tien_anh_huong: null, nguon: "N10", noi_dung: `${m.ten}: chưa kiểm tra / chưa đủ hồ sơ để kiểm tra` });
}
return [{ json: { ...d, checklist_gd5: {...}, phat_hien: [...d.phat_hien, ...ph] } }];
```

---

#### N11 – Đánh giá 15 tiêu chí (Code)

Đầu ra thêm `tieu_chi: TieuChi[15]`, `TieuChi = { so, ten, nhom, nhom_ycbs, ket_qua_nguoi_nhap, ket_qua, nguon: "nguoi_kiem_tra"|"tu_dong"|"mac_dinh", nhan_xet, ly_do_tu_dong }`.

Quy tắc:
1. Tiêu chí 1–14: lấy từ `danh_gia_tieu_chi`; thiếu → `chua_du_can_cu`, `nguon: "mac_dinh"`.
2. **Hạ tự động TC13** (chỉ có biên bản hiện trường, không có hồ sơ điều chỉnh): nếu `BB_NGHIEM_THU_HIEN_TRUONG.co` **và** có ≥1 hạng mục `khac_thiet_ke_nt = true` **và** `co_dieu_chinh_day_du = false` → `khong_phu_hop`.
3. **Hạ tự động TC14** (hoàn công khác thiết kế không điều chỉnh): nếu có ≥1 hạng mục `khac_thiet_ke_hc = true` **và** `co_dieu_chinh_day_du = false` → `khong_phu_hop`. Nếu `co_dieu_chinh_day_du = true` mà vẫn `khac_thiet_ke_hc` (so với KL thiết kế điều chỉnh) → cũng `khong_phu_hop`, lý do "hoàn công khác cả thiết kế điều chỉnh".
4. Hạ chỉ theo chiều xấu đi: `phu_hop`/`chua_du_can_cu` → `khong_phu_hop`. Không bao giờ nâng.
5. TC15 không lập ở đây (lập ở N12 sau khi có kết luận); N11 tạo chỗ `{ so: 15, ket_qua: null }`.

```js
const d = $input.first().json;
const DM = [ /* bảng 4.4.2: {so, ten, nhom, nhom_ycbs} */ ];
const nhap = new Map((d.danh_gia_tieu_chi || []).filter(t => t.so !== 15).map(t => [t.so, t]));
const tc = DM.map(m => {
  if (m.so === 15) return { ...m, ket_qua_nguoi_nhap: null, ket_qua: null, nguon: "tu_dong", nhan_xet: "", ly_do_tu_dong: "" };
  const t = nhap.get(m.so);
  return { ...m, nhom_ycbs: (t && t.nhom_ycbs) || m.nhom_ycbs,
    ket_qua_nguoi_nhap: t ? t.ket_qua : null, ket_qua: t ? t.ket_qua : "chua_du_can_cu",
    nguon: t ? "nguoi_kiem_tra" : "mac_dinh", nhan_xet: (t && t.nhan_xet) || "", ly_do_tu_dong: "" };
});
const hm = d.doi_chieu.hang_muc; const dc = d.kiem_tra_ho_so.co_dieu_chinh_day_du;
const coBBHT = (d.ho_so.find(h => h.ma === "BB_NGHIEM_THU_HIEN_TRUONG") || {}).co === true;
const ha = (so, lyDo) => { const t = tc[so-1]; if (t.ket_qua !== "khong_phu_hop") { t.ket_qua = "khong_phu_hop"; t.nguon = "tu_dong"; } t.ly_do_tu_dong = lyDo; };

const nt = hm.filter(x => x.khac_thiet_ke_nt).map(x => `HM${x.stt} (${x.kl_nghiem_thu_hien_truong}/${x.kl_tk_tham_chieu} ${x.don_vi})`);
if (coBBHT && nt.length && !dc) ha(13, `Khối lượng chốt hiện trường khác thiết kế ở: ${nt.join(", ")} – chỉ có biên bản hiện trường, chưa có hồ sơ thiết kế – dự toán điều chỉnh`);
const hc = hm.filter(x => x.khac_thiet_ke_hc).map(x => `HM${x.stt} (${x.kl_hoan_cong}/${x.kl_tk_tham_chieu} ${x.don_vi})`);
if (hc.length) ha(14, dc ? `Hoàn công khác cả thiết kế điều chỉnh ở: ${hc.join(", ")}` : `Hoàn công khác thiết kế, không có điều chỉnh ở: ${hc.join(", ")}`);

return [{ json: { ...d, tieu_chi: tc } }];
```

---

#### N12 – Áp quy tắc kết luận (Code)

Quy tắc (theo **thứ tự ưu tiên**, dừng ở quy tắc đầu tiên thỏa):

| Ưu tiên | Điều kiện | `ket_luan.ma` | `ket_luan.nhan` |
|---|---|---|---|
| 1 | TC13 hoặc TC14 = `khong_phu_hop` | `DUNG_QUYET_TOAN` | `Không đạt — dừng quyết toán` |
| 2 | ≥1 trong TC5, 6, 8, 9, 11 = `khong_phu_hop` | `DIEU_CHINH_TK_DT` | `Không đạt — phải điều chỉnh thiết kế – dự toán` |
| 3 | ≥1 trong TC1–11, 13, 14 = `chua_du_can_cu` **hoặc** có phát hiện `thieu_can_cu` **hoặc** có phát hiện `chan` (cổng số liệu, xem Mục 9 điểm D1) | `CHUA_KET_LUAN` | `Chưa kết luận` |
| 4 | Còn lại | `DAT` | `Đạt — chuyển trình ký` |

- TC12 **không** tham gia quy tắc nào (chỉ hiển thị).
- TC thuộc nhóm `KHONG_BAT_BUOC` (1,2,3,4,7,10) = `khong_phu_hop` **không** chặn "Đạt"; chúng được ghi vào `luu_y` của tờ trình.
- Sau khi có kết luận, lập TC15: `DAT` → `phu_hop`; `DUNG_QUYET_TOAN`/`DIEU_CHINH_TK_DT` → `khong_phu_hop`; `CHUA_KET_LUAN` → `chua_du_can_cu`. `nhan_xet` của TC15 = `ket_luan.nhan`.

```js
const d = $input.first().json;
const kq = so => d.tieu_chi[so-1].ket_qua;
const ph = d.phat_hien;
const lyDo = [], canBoSung = [], luuY = [];
let ma;

const tcChan = [13,14].filter(s => kq(s) === "khong_phu_hop");
const tcDC = [5,6,8,9,11].filter(s => kq(s) === "khong_phu_hop");
const tcThieu = [1,2,3,4,5,6,7,8,9,10,11,13,14].filter(s => kq(s) === "chua_du_can_cu");
const phThieu = ph.filter(p => p.muc_do === "thieu_can_cu");
const phChan = ph.filter(p => p.muc_do === "chan");

if (tcChan.length) {
  ma = "DUNG_QUYET_TOAN";
  tcChan.forEach(s => lyDo.push(`Tiêu chí ${s} – ${d.tieu_chi[s-1].ten}: ${d.tieu_chi[s-1].ly_do_tu_dong || d.tieu_chi[s-1].nhan_xet || "không phù hợp"}`));
} else if (tcDC.length) {
  ma = "DIEU_CHINH_TK_DT";
  tcDC.forEach(s => lyDo.push(`Tiêu chí ${s} – ${d.tieu_chi[s-1].ten}: ${d.tieu_chi[s-1].nhan_xet || "không phù hợp"}`));
} else if (tcThieu.length || phThieu.length || phChan.length) {
  ma = "CHUA_KET_LUAN";
  tcThieu.forEach(s => canBoSung.push(`Tiêu chí ${s} – ${d.tieu_chi[s-1].ten}: chưa đủ căn cứ${d.tieu_chi[s-1].nhan_xet ? " (" + d.tieu_chi[s-1].nhan_xet + ")" : ""}`));
  phThieu.forEach(p => canBoSung.push(p.noi_dung));
  phChan.forEach(p => lyDo.push(p.noi_dung));
  if (phChan.length) lyDo.unshift("Số liệu quyết toán chưa khớp – cần điều chỉnh bảng quyết toán trước khi kết luận");
} else ma = "DAT";

// Bổ sung ngữ cảnh cho mọi kết luận
[1,2,3,4,7,10].filter(s => kq(s) === "khong_phu_hop").forEach(s => luuY.push(`Tiêu chí ${s} – ${d.tieu_chi[s-1].ten}: không phù hợp (không bắt buộc điều chỉnh)`));
ph.filter(p => p.muc_do === "luu_y").forEach(p => luuY.push(p.noi_dung));
if (ma !== "CHUA_KET_LUAN") { // vẫn liệt kê thiếu sót để chi nhánh xử lý cùng lúc
  tcThieu.forEach(s => canBoSung.push(`Tiêu chí ${s}: chưa đủ căn cứ`));
  phThieu.forEach(p => canBoSung.push(p.noi_dung));
}

const NHAN = { DUNG_QUYET_TOAN: "Không đạt — dừng quyết toán", DIEU_CHINH_TK_DT: "Không đạt — phải điều chỉnh thiết kế – dự toán",
               CHUA_KET_LUAN: "Chưa kết luận", DAT: "Đạt — chuyển trình ký" };
const tc = d.tieu_chi.map(t => t.so !== 15 ? t : { ...t,
  ket_qua: ma === "DAT" ? "phu_hop" : ma === "CHUA_KET_LUAN" ? "chua_du_can_cu" : "khong_phu_hop", nhan_xet: NHAN[ma] });

return [{ json: { ...d, tieu_chi: tc, ket_luan: { ma, nhan: NHAN[ma], ly_do: lyDo, can_bo_sung: [...new Set(canBoSung)], luu_y: luuY,
  quy_tac_ap_dung: { DUNG_QUYET_TOAN: 1, DIEU_CHINH_TK_DT: 2, CHUA_KET_LUAN: 3, DAT: 4 }[ma] } } }];
```

---

#### N13 – Phân loại kết luận (`n8n-nodes-base.switch`)

| Tham số | Giá trị |
|---|---|
| `mode` | `rules` |
| Giá trị so sánh | `{{ $json.ket_luan.ma }}` |
| Rule 0 (outputKey `Dừng quyết toán`) | string `equals` `DUNG_QUYET_TOAN` → N14 |
| Rule 1 (outputKey `Điều chỉnh TK-DT`) | string `equals` `DIEU_CHINH_TK_DT` → N14 |
| Rule 2 (outputKey `Chưa kết luận`) | string `equals` `CHUA_KET_LUAN` → N14 |
| Rule 3 (outputKey `Đạt`) | string `equals` `DAT` → N15 |
| `options.fallbackOutput` | `extra` (output thứ 5, tên `Ngoài dự kiến`) → N23 |
| `options.allMatchingOutputs` | `false` |

(Giữ 3 output riêng cho 3 kết luận không đạt dù cùng tới N14 để người vận hành nhìn thấy nhánh nào chạy trong lịch sử execution.)

---

#### N14 – Lập phiếu YCBS (Code)

Đầu ra thêm `phieu_ycbs: { so_phieu, ngay_lap, han_bo_sung, bang: DongYCBS[11], markdown, html, ten_file_goi_y }`, `to_trinh: null`.

Dòng bảng: `DongYCBS = { stt: 1..11, nhom: string, noi_dung: string[], yeu_cau: "Không"|"Bổ sung"|"Điều chỉnh"|"Bổ sung-điều chỉnh" }`.

Thu gom nội dung cho từng nhóm g (giữ thứ tự: tiêu chí trước, phát hiện sau, theo `hang_muc_stt` tăng dần):
- Tiêu chí 1–14 có `ket_qua = khong_phu_hop` và `nhom_ycbs = g`: nội dung `"[TC{so}] {ten}: {ly_do_tu_dong || nhan_xet || 'không phù hợp'}"`; yêu cầu: TC13/14 → `Bổ sung-điều chỉnh`; nhóm `BAT_BUOC_DC` → `Điều chỉnh`; `KHONG_BAT_BUOC` → `Điều chỉnh`; TC12 → `Không`.
- Tiêu chí 1–14 có `ket_qua = chua_du_can_cu` và `nhom_ycbs = g`: `"[TC{so}] {ten}: chưa đủ căn cứ – đề nghị bổ sung hồ sơ chứng minh"`; yêu cầu `Bổ sung`.
- Mọi phát hiện có `nhom_ycbs = g`: `noi_dung` + (nếu `tien_anh_huong` ≠ null và ≠ 0: `" – ảnh hưởng {fmtTien} đ"`); yêu cầu = `p.yeu_cau`.
- Nhóm 11 thêm `ghi_chu_nguoi_kiem_tra` nếu không rỗng (yêu cầu `Không`).

Gộp yêu cầu của nhóm:

```js
function gopYeuCau(ds) {               // ds: mảng chuỗi yêu cầu
  const s = new Set(ds.filter(x => x !== "Không"));
  if (s.size === 0) return "Không";
  if (s.has("Bổ sung-điều chỉnh") || (s.has("Bổ sung") && s.has("Điều chỉnh"))) return "Bổ sung-điều chỉnh";
  return [...s][0];
}
```
Nhóm không có nội dung: `noi_dung = ["Không có ý kiến"]`, `yeu_cau = "Không"`.

Thông tin phiếu:
- `so_phieu` = `YCBS-{ma_cong_trinh}-{yyyyMMdd của ngày chạy}` (tạm, xem Mục 9).
- `ngay_lap` = ngày chạy, `dd/MM/yyyy`.
- `han_bo_sung` = `ngay_nhan` + `thoi_han_bo_sung_ngay` ngày lịch, định dạng `dd/MM/yyyy` (Luxon `DateTime.fromISO(ngay_nhan).plus({days: n})`). Nếu hạn ≤ ngày chạy → dùng ngày chạy + n và thêm cảnh báo `"Hạn tính từ ngày nhận đã qua – tính lại từ ngày lập phiếu"`.

Văn bản Kết luận (mục III) theo mã:

| `ket_luan.ma` | Đoạn mở đầu mục III |
|---|---|
| `DUNG_QUYET_TOAN` | `Hồ sơ quyết toán KHÔNG ĐẠT – DỪNG QUYẾT TOÁN. Đề nghị chi nhánh lập hồ sơ thiết kế – dự toán điều chỉnh, trình phê duyệt trước khi lập lại hồ sơ quyết toán.` |
| `DIEU_CHINH_TK_DT` | `Hồ sơ quyết toán KHÔNG ĐẠT – PHẢI ĐIỀU CHỈNH THIẾT KẾ – DỰ TOÁN theo các nội dung tại mục II trước khi quyết toán.` |
| `CHUA_KET_LUAN` | `CHƯA KẾT LUẬN. Đề nghị chi nhánh/nhà thầu bổ sung, điều chỉnh các nội dung sau để Phòng Đầu tư có đủ căn cứ kết luận:` |

Tiếp theo đoạn mở đầu: gạch đầu dòng `ly_do`, rồi "Cần bổ sung:" + gạch đầu dòng `can_bo_sung`, rồi nếu `doi_chieu.tong_thanh_toan_du > 0`: `"Giá trị đề nghị giảm trừ tạm tính: {fmtTien} đ."`.

Mẫu Markdown (giữ nguyên tiêu đề, thay `{…}`):

```markdown
# PHIẾU YÊU CẦU BỔ SUNG HỒ SƠ
**Số:** {so_phieu} — **Ngày:** {ngay_lap}

## I. THÔNG TIN CHUNG
| Mục | Nội dung |
|---|---|
| Tên công trình | {ten_cong_trinh} |
| Địa điểm | {dia_diem} |
| Chi nhánh | {chi_nhanh} |
| Loại hồ sơ | Quyết toán |
| Ngày nhận hồ sơ | {ngay_nhan dd/MM/yyyy} |
| Người kiểm tra | {nguoi_kiem_tra} |

## II. NỘI DUNG GÓP Ý
| STT | Nhóm nội dung | Nội dung góp ý | Yêu cầu chỉnh sửa |
|---|---|---|---|
| 1 | Pháp lý dự án | {noi_dung nối bằng "<br>", đánh số "1) 2) …"} | {yeu_cau} |
| … (đủ 11 dòng, đúng thứ tự 4.4.1) … |

### Phụ lục II.a – Đối chiếu ba chiều (chỉ các hạng mục lệch hoặc thiếu số gốc)
| STT HM | Hạng mục | ĐVT | Hoàn công | Nghiệm thu HT | Quyết toán | Lệch QT–NT | Thành tiền ảnh hưởng (đ) |
|---|---|---|---|---|---|---|---|
| … |
| | **Tổng thanh toán dư** | | | | | | **{tong_thanh_toan_du}** |

## III. KẾT LUẬN
**{ket_luan.nhan}**
{đoạn văn theo bảng trên + gạch đầu dòng}

## IV. THỜI HẠN
Đề nghị chi nhánh {chi_nhanh} / nhà thầu {nha_thau.ten} hoàn chỉnh và gửi lại hồ sơ **trước ngày {han_bo_sung}** ({thoi_han_bo_sung_ngay} ngày kể từ ngày nhận hồ sơ).

---
*Phiếu sinh tự động bởi workflow n8n (quy tắc {phien_ban_quy_tac}, phiên {ma_phien}). Chỉ có hiệu lực sau khi lãnh đạo Phòng Đầu tư duyệt.*
```

Yêu cầu kỹ thuật cho Markdown: thoát ký tự `|` trong nội dung thành `\|`; thay xuống dòng trong ô bằng `<br>`.

HTML: sinh **từ cùng dữ liệu** (không chuyển từ Markdown), cấu trúc: `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>{so_phieu}</title><style>body{font-family:"Times New Roman",serif;font-size:13pt} table{border-collapse:collapse;width:100%} td,th{border:1px solid #000;padding:4px;vertical-align:top}</style></head><body>…</body></html>` với 4 mục I–IV như Markdown. **Mọi giá trị chèn phải escape HTML** (`& < > " '`).

`ten_file_goi_y` = `YCBS_{ma_cong_trinh}_{yyyyMMdd}.md` (và `.html`).

---

#### N15 – Lập tờ trình chuyển ký (Code)

Đầu ra thêm `to_trinh`, `phieu_ycbs: null`.

```js
to_trinh = {
  tieu_de: `Đề xuất trình ký quyết toán công trình ${ten_cong_trinh}`,
  gia_tri_quyet_toan_de_nghi_truoc_thue: doi_chieu.tong_qt_tinh_lai,
  gia_tri_quyet_toan_de_nghi_sau_thue: round(tong_qt_tinh_lai * (1 + thue/100)),
  gia_tri_hop_dong: kiem_tra_hop_dong.gia_tri_hieu_luc,
  chenh_lech_so_voi_hop_dong: tong_qt_tinh_lai - gia_tri_hieu_luc,   // âm = giảm
  luu_y: ket_luan.luu_y,                    // TC nhóm không bắt buộc + phát hiện luu_y
  markdown: "..."                           // mẫu ngắn: thông tin chung + bảng giá trị + lưu ý + dòng "Đề nghị lãnh đạo xem xét, ký duyệt"
}
```

---

#### N16 – Tạo dòng báo cáo tổng hợp (Code)

Chạy cho **mọi** kết luận (vào từ N14 hoặc N15). Đầu ra thêm `dong_bao_cao: { cot: string[], gia_tri: object, csv_header, csv_dong, markdown_dong }`.

Cột (đúng thứ tự, dùng làm header CSV):

| # | Khóa | Nguồn | Định dạng |
|---|---|---|---|
| 1 | `ngay_kiem_tra` | meta.thoi_diem | dd/MM/yyyy |
| 2 | `ma_phien` | meta.ma_phien | |
| 3 | `ma_cong_trinh` | cong_trinh | |
| 4 | `ten_cong_trinh` | cong_trinh | |
| 5 | `chi_nhanh` | cong_trinh | |
| 6 | `dia_diem` | cong_trinh | |
| 7 | `nha_thau` | cong_trinh.nha_thau.ten | |
| 8 | `loai_ho_so` | "Quyết toán" | |
| 9 | `so_hop_dong` | hop_dong | |
| 10 | `gia_tri_hop_dong` | kiem_tra_hop_dong.gia_tri_hieu_luc | số nguyên |
| 11 | `gia_tri_qt_khai_bao` | tong_hop_khai_bao.tong_quyet_toan_truoc_thue | số nguyên |
| 12 | `gia_tri_qt_tinh_lai` | doi_chieu.tong_qt_tinh_lai | số nguyên |
| 13 | `tien_thanh_toan_du` | doi_chieu.tong_thanh_toan_du | số nguyên |
| 14 | `so_hang_muc_lech` | doi_chieu.so_hang_muc_lech | |
| 15 | `tieu_chi_khong_phu_hop` | tieu_chi (1–14) | "5, 13, 14" |
| 16 | `tieu_chi_chua_du_can_cu` | tieu_chi (1–14) | "10" |
| 17 | `ho_so_thieu` | kiem_tra_ho_so.thieu | nối "; " |
| 18 | `ket_luan` | ket_luan.nhan | |
| 19 | `so_phieu_ycbs` | phieu_ycbs?.so_phieu | rỗng nếu Đạt |
| 20 | `han_bo_sung` | phieu_ycbs?.han_bo_sung | rỗng nếu Đạt |
| 21 | `nguoi_kiem_tra` | cong_trinh | |
| 22 | `khoa_chong_trung` | `${ma_cong_trinh}|${ngay_nhan}|${gia_tri_qt_khai_bao}` | để bảng đích lọc trùng |
| 23 | `ghi_chu` | ghi_chu_nguoi_kiem_tra + cảnh báo N05 | nối "; " |

CSV: phân cách `;`, mọi ô bọc `"…"`, nhân đôi dấu `"` bên trong, xuống dòng trong ô thay bằng khoảng trắng; không BOM (để bên nhận tự thêm khi mở Excel). Markdown: 1 dòng `| … |` cùng thứ tự cột, escape `|`.

---

#### N17 – Đóng gói đầu ra (Code)

Sinh object trả về theo Mục 6.1 và chuyển tiếp `meta` cho N18:

```js
const d = $input.first().json;
return [{ json: { http_status: 200, meta: d.meta, body: {
  ok: true, ma_phien: d.meta.ma_phien, thoi_diem: d.meta.thoi_diem, phien_ban_quy_tac: d.meta.phien_ban_quy_tac,
  cong_trinh: pick(d.cong_trinh, ["ma_cong_trinh","ten_cong_trinh","chi_nhanh","dia_diem"]),
  ket_luan: d.ket_luan, tieu_chi: d.tieu_chi, kiem_tra_ho_so: d.kiem_tra_ho_so, doi_chieu_ba_chieu: d.doi_chieu,
  kiem_tra_hop_dong: d.kiem_tra_hop_dong, checklist_gd5: d.checklist_gd5, phat_hien: d.phat_hien,
  phieu_ycbs: d.phieu_ycbs ?? null, to_trinh: d.to_trinh ?? null, dong_bao_cao: d.dong_bao_cao,
  canh_bao: d.kiem_tra_cau_truc.canh_bao,
  thong_bao: { can_gui: d.ket_luan.ma !== "DAT", trang_thai: "cho_nguoi_duyet",
    nguoi_nhan: [d.cong_trinh.email_chi_nhanh, d.cong_trinh.nha_thau.email].filter(Boolean) }
}}}];
```

---

#### N18 – Nguồn là webhook? (`n8n-nodes-base.if`)

| Tham số | Giá trị |
|---|---|
| Điều kiện | `{{ $json.meta.nguon }}` string `equals` `webhook` |
| true | → N19 |
| false | → N20 |

Lý do có node này: khi chạy bằng Manual Trigger không có request HTTP để trả lời; tránh để node Respond to Webhook chạy ngoài ngữ cảnh webhook.

---

#### N19 – Phản hồi webhook (`n8n-nodes-base.respondToWebhook`)

| Tham số | Giá trị |
|---|---|
| `respondWith` | `json` |
| `responseBody` | `={{ $json.body }}` |
| `options.responseCode` | `={{ $json.http_status }}` |
| `options.responseHeaders` | `Content-Type: application/json; charset=utf-8` |

---

#### N20 – Kết quả chạy thử (`n8n-nodes-base.noOp`)

Không tham số. Người chạy thử xem output N17/N23 trong editor.

---

#### N21 – Soạn thông báo (Code)

```js
const d = $input.first().json; const b = d.body;
if (!b.ok || !b.thong_bao.can_gui) return [];                 // Đạt hoặc lỗi: không soạn email
return [{ json: {
  to: b.thong_bao.nguoi_nhan.join(","),                       // có thể rỗng -> người duyệt phải điền
  subject: `[Biwase – Phòng Đầu tư] ${b.ket_luan.nhan} – ${b.cong_trinh.ten_cong_trinh}`,
  html: b.phieu_ycbs.html,
  text: b.phieu_ycbs.markdown,
  ma_phien: b.ma_phien,
}}];
```

---

#### N22 – Gửi email chi nhánh/nhà thầu (`n8n-nodes-base.emailSend`) – **TẮT**

| Tham số | Giá trị |
|---|---|
| `disabled` | **`true`** |
| `fromEmail` | `""` (người duyệt điền) |
| `toEmail` | `={{ $json.to }}` |
| `subject` | `={{ $json.subject }}` |
| `emailFormat` | `html` |
| `html` | `={{ $json.html }}` |
| `credentials` | **không gán** (SMTP do người duyệt cấu hình) |
| `notes` | `CẦN NGƯỜI DUYỆT: chỉ bật sau khi lãnh đạo Phòng Đầu tư duyệt nội dung phiếu YCBS và cấu hình SMTP.` |
| `notesInFlow` | `true` |

Lưu ý: node bị tắt trong n8n vẫn cho dữ liệu đi qua và không gửi gì; không có node nào nối sau N22.

---

#### N23 – Tạo phản hồi lỗi (Code)

Vào từ N06 (false) hoặc N13 (fallback).

```js
const d = $input.first().json;
const loi = d.kiem_tra_cau_truc && !d.kiem_tra_cau_truc.hop_le ? d.kiem_tra_cau_truc.loi
          : [{ truong: "ket_luan.ma", ma: "LOI_HE_THONG", thong_bao: `Kết luận ngoài dự kiến: ${d.ket_luan && d.ket_luan.ma}` }];
const chiHangMucRong = loi.length > 0 && loi.every(l => l.ma === "HANG_MUC_RONG");
const coLoiHeThong = loi.some(l => l.ma === "LOI_HE_THONG");
const http_status = coLoiHeThong ? 500 : chiHangMucRong ? 422 : 400;
const ma_loi = coLoiHeThong ? "LOI_HE_THONG" : chiHangMucRong ? "HANG_MUC_RONG" : "DAU_VAO_KHONG_HOP_LE";
return [{ json: { http_status, meta: d.meta || { nguon: "webhook" }, body: {
  ok: false, ma_loi, thong_bao: {
    DAU_VAO_KHONG_HOP_LE: "Hồ sơ JSON thiếu trường hoặc sai định dạng – xem danh sách lỗi",
    HANG_MUC_RONG: "Danh sách hạng mục rỗng – không thể đối chiếu khối lượng",
    LOI_HE_THONG: "Lỗi xử lý nội bộ – báo quản trị n8n" }[ma_loi],
  loi, canh_bao: (d.kiem_tra_cau_truc && d.kiem_tra_cau_truc.canh_bao) || [],
  ma_phien: d.meta && d.meta.ma_phien, thoi_diem: d.meta && d.meta.thoi_diem } } }];
```

Nhánh lỗi **không** tạo dòng Báo cáo tổng hợp (hồ sơ chưa được kiểm tra) – xem Mục 9 điểm D5.

---

#### N24 – Ghi chú: cần người duyệt (`n8n-nodes-base.stickyNote`)

Nội dung: "Node gửi email đang TẮT. Trước khi bật: (1) lãnh đạo duyệt phiếu YCBS; (2) cấu hình SMTP credential; (3) điền fromEmail; (4) kiểm tra danh sách người nhận. Webhook đang không xác thực – bật Header Auth trước khi đưa ra ngoài mạng nội bộ." Đặt cạnh N22, kích thước ~ 360×200, màu vàng.

---

## 5. Các nhánh và điều kiện

### 5.1 Bảng nhánh

| Nhánh | Điều kiện | Đường đi | HTTP | Báo cáo tổng hợp | Phiếu YCBS |
|---|---|---|---|---|---|
| B1 Đạt | quy tắc 4 | N01→N04…N13(out3)→N15→N16→N17→N18→N19 (+N21 trả rỗng) | 200 | Có | Không (có tờ trình) |
| B2 Điều chỉnh TK–DT | quy tắc 2 | …N13(out1)→N14→N16→N17→N18→N19; N17→N21→N22(tắt) | 200 | Có | Có |
| B3 Dừng quyết toán | quy tắc 1 | …N13(out0)→N14→… | 200 | Có | Có |
| B4 Chưa kết luận | quy tắc 3 | …N13(out2)→N14→… | 200 | Có | Có |
| E1 JSON thiếu trường / sai kiểu / sai enum | N05 có lỗi không phải `HANG_MUC_RONG` | N06(false)→N23→N18→N19 | 400 | Không | Không |
| E2 Hạng mục rỗng | lỗi duy nhất là `HANG_MUC_RONG` | như E1 | 422 | Không | Không |
| E3 Body không phải JSON / là mảng / null | N04 ghi lỗi `JSON_KHONG_HOP_LE` / `BODY_KHONG_PHAI_OBJECT` | như E1 | 400 | Không | Không |
| E4 Kết luận ngoài dự kiến | Switch fallback | N13(fallback)→N23→N18→N19 | 500 | Không | Không |
| E5 Code node ném ngoại lệ (lỗi lập trình) | exception | n8n dừng execution; webhook trả 500 mặc định của n8n | 500 | Không | Không |
| M Chạy thử | `meta.nguon = thu_cong` | …→N18(false)→N20 | – | Có (trong output) | tùy kịch bản |

### 5.2 Phân biệt "hạng mục rỗng" và "thiếu hạng mục"

- `hang_muc` không có / không phải mảng → `THIEU_TRUONG` → 400.
- `hang_muc: []` → `HANG_MUC_RONG` → 422 (nếu không có lỗi khác; có lỗi khác → 400 kèm cả hai lỗi).
- Hạng mục có nhưng `kl_nghiem_thu_hien_truong = null` → **không** phải lỗi đầu vào; là phát hiện `THIEU_SO_GOC` → "Chưa kết luận".

### 5.3 Thứ tự ưu tiên khi nhiều điều kiện cùng xảy ra (ví dụ)

| Tình huống | Kết luận |
|---|---|
| TC14 hạ tự động + TC9 không phù hợp + thiếu hóa đơn | `DUNG_QUYET_TOAN` (lý do: TC14); TC9 và hóa đơn vẫn xuất hiện trong mục II phiếu |
| TC6 không phù hợp + phát hiện `chan` (lệch QT–NT) | `DIEU_CHINH_TK_DT` |
| Tất cả tiêu chí phù hợp + 1 phát hiện `chan` | `CHUA_KET_LUAN` (cổng số liệu) |
| Tất cả phù hợp + TC10 không phù hợp + lỗi trình bày (`luu_y`) | `DAT`, tờ trình có 2 lưu ý |
| TC12 = chua_du_can_cu, còn lại phù hợp | `DAT` (TC12 không tham gia quy tắc) |

### 5.4 Thời gian & đồng thời

- Toàn bộ là tính toán trong bộ nhớ, dự kiến < 2 s cho ≤ 500 hạng mục. `executionTimeout = 60 s`; quá hạn → n8n hủy, webhook nhận lỗi (người gọi gửi lại).
- Không có tài nguyên dùng chung, không ghi trạng thái → hai request cùng công trình chạy độc lập, không xung đột. Trùng lặp dòng báo cáo xử lý ở bảng đích bằng `khoa_chong_trung`.
- Giới hạn kích thước body mặc định n8n (16 MB) đủ dùng; không cần cấu hình thêm.

---

## 6. Schema đầu ra

### 6.1 Thành công (HTTP 200)

```json
{
  "ok": true,
  "ma_phien": "KTQT-MAU-TU-2026-014-20261123091500",
  "thoi_diem": "2026-11-23T09:15:00.000+07:00",
  "phien_ban_quy_tac": "2026.11-1",
  "cong_trinh": { "ma_cong_trinh": "…", "ten_cong_trinh": "…", "chi_nhanh": "Tân Uyên", "dia_diem": "…" },
  "ket_luan": {
    "ma": "DAT | DIEU_CHINH_TK_DT | DUNG_QUYET_TOAN | CHUA_KET_LUAN",
    "nhan": "Đạt — chuyển trình ký",
    "quy_tac_ap_dung": 4,
    "ly_do": ["string"],
    "can_bo_sung": ["string"],
    "luu_y": ["string"]
  },
  "tieu_chi": [
    { "so": 1, "ten": "…", "nhom": "KHONG_BAT_BUOC", "nhom_ycbs": 1,
      "ket_qua_nguoi_nhap": "phu_hop", "ket_qua": "phu_hop", "nguon": "nguoi_kiem_tra", "nhan_xet": "", "ly_do_tu_dong": "" }
  ],
  "kiem_tra_ho_so": { "danh_sach": [{ "ma": "HOP_DONG", "ten": "Hợp đồng", "muc": "bat_buoc", "co": true, "dat": true }],
                      "thieu": [], "co_dieu_chinh_day_du": false, "co_phu_luc": false },
  "doi_chieu_ba_chieu": {
    "hang_muc": [{ "stt": 1, "ten": "…", "don_vi": "m", "loai": "ong", "kl_tk_tham_chieu": 450, "kl_hoan_cong": 446,
                   "kl_nghiem_thu_hien_truong": 446, "kl_nghiem_thu_bbnt": 446, "kl_quyet_toan": 446, "kl_hop_dong": 450,
                   "don_gia_quyet_toan": 210000, "thanh_tien_quyet_toan": 93660000,
                   "lech_hc_nt": 0, "lech_qt_nt": 0, "lech_qt_hc": 0, "lech_bbnt_nt": 0, "thanh_tien_anh_huong": 0,
                   "ty_le_khac_thiet_ke": -0.009, "khac_thiet_ke_hc": false, "khac_thiet_ke_nt": false, "trang_thai": "khop" }],
    "tong_qt_tinh_lai": 199071000, "tong_thanh_toan_du": 0, "tong_thanh_toan_thieu": 0,
    "so_hang_muc_lech": 0, "so_hang_muc_khac_thiet_ke": 0
  },
  "kiem_tra_hop_dong": { "loai_gia": "don_gia_co_dinh", "gia_tri_hop_dong": 200820000, "gia_tri_hieu_luc": 200820000,
    "co_phu_luc": false, "tong_qt_tinh_lai": 199071000, "vuot_hop_dong": 0,
    "hang_muc_chep_hop_dong": [], "hang_muc_ngoai_hop_dong": [], "hang_muc_don_gia_khac": [],
    "giam_sat": { "co_trong_du_toan": false, "da_giao_don_vi": false, "co_trong_quyet_toan": false, "gia_tri": 0, "ket_qua": "hop_le" },
    "hoa_don": { "co": true, "khop": true, "chenh_lech_sau_thue": 0 } },
  "checklist_gd5": { "ban_ve_hoan_cong": [], "du_toan_quyet_toan": [], "so_khong_dat": 0, "so_chua_kiem_tra": 0 },
  "phat_hien": [],
  "phieu_ycbs": null,
  "to_trinh": { "tieu_de": "…", "gia_tri_quyet_toan_de_nghi_truoc_thue": 199071000, "gia_tri_quyet_toan_de_nghi_sau_thue": 218978100,
                "gia_tri_hop_dong": 200820000, "chenh_lech_so_voi_hop_dong": -1749000, "luu_y": [], "markdown": "…" },
  "dong_bao_cao": { "cot": ["ngay_kiem_tra", "…"], "gia_tri": {}, "csv_header": "…", "csv_dong": "…", "markdown_dong": "…" },
  "canh_bao": [],
  "thong_bao": { "can_gui": false, "trang_thai": "cho_nguoi_duyet", "nguoi_nhan": ["…"] }
}
```

Khi không đạt/chưa kết luận: `phieu_ycbs` = `{ so_phieu, ngay_lap, han_bo_sung, bang: [11 dòng], markdown, html, ten_file_goi_y }`, `to_trinh = null`, `thong_bao.can_gui = true`.

### 6.2 Lỗi (HTTP 400 / 422 / 500)

```json
{
  "ok": false,
  "ma_loi": "DAU_VAO_KHONG_HOP_LE | HANG_MUC_RONG | LOI_HE_THONG",
  "thong_bao": "string",
  "loi": [ { "truong": "cong_trinh.ten_cong_trinh", "ma": "THIEU_TRUONG", "thong_bao": "Bắt buộc, không được rỗng" } ],
  "canh_bao": ["string"],
  "ma_phien": "string | null",
  "thoi_diem": "string | null"
}
```

Danh mục `loi[].ma`: `JSON_KHONG_HOP_LE`, `BODY_KHONG_PHAI_OBJECT`, `SAI_PHIEN_BAN`, `THIEU_TRUONG`, `KIEU_SAI`, `GIA_TRI_KHONG_HOP_LE`, `NGAY_KHONG_HOP_LE`, `SO_KHONG_HOP_LE`, `SO_SAI_DINH_DANG`, `MA_HO_SO_LA`, `MA_HO_SO_TRUNG`, `STT_TRUNG`, `TIEU_CHI_TRUNG`, `HANG_MUC_RONG`, `LOI_HE_THONG`.

---

## 7. Bộ ca kiểm thử

Dữ liệu gốc = ví dụ Mục 3.3. Cột "Biến đổi" chỉ ghi phần khác gốc. Các ca có cột "KICH_BAN" chạy được bằng Manual Trigger; các ca còn lại gửi qua webhook (Postman/curl).

| Ca | KICH_BAN | Biến đổi so với dữ liệu gốc | Kết quả mong đợi |
|---|---|---|---|
| TC-01 Đạt | `DAT` | không | 200; `ket_luan.ma = DAT`, quy tắc 4; TC15 `phu_hop`; `phat_hien = []`; `doi_chieu.tong_qt_tinh_lai = 199071000`, `so_hang_muc_lech = 0`; `to_trinh.chenh_lech_so_voi_hop_dong = -1749000`; `phieu_ycbs = null`; `dong_bao_cao.gia_tri.ket_luan = "Đạt — chuyển trình ký"`, `so_phieu_ycbs = ""`; N21 trả rỗng, N22 không chạy |
| TC-02 Điều chỉnh TK–DT | `DIEU_CHINH_TK_DT` | TC9 = `khong_phu_hop` + nhận xét | 200; `DIEU_CHINH_TK_DT`, quy tắc 2; TC15 `khong_phu_hop`; phiếu YCBS có 11 dòng, dòng 6 "Khối lượng – Dự toán" chứa "[TC9]…" với yêu cầu `Điều chỉnh`, các dòng khác `Không`/"Không có ý kiến"; mục III mở đầu "KHÔNG ĐẠT – PHẢI ĐIỀU CHỈNH…"; hạn bổ sung = 27/11/2026 (khi chạy trước ngày này; sau đó hạn tính lại từ ngày lập phiếu) |
| TC-03 Dừng quyết toán (máy hạ TC14, TC13) | `DUNG_QUYET_TOAN` | HM1: HC = NT = BBNT = QT = 520 (TK 450, +15,6%); chiều dài bản vẽ 520; TC5 = `khong_phu_hop`; TC13, TC14 người nhập `phu_hop` | 200; `DUNG_QUYET_TOAN`, quy tắc 1 (ưu tiên hơn TC5); `tieu_chi[13].ket_qua = khong_phu_hop`, `nguon = tu_dong`, `ket_qua_nguoi_nhap = phu_hop`; tương tự TC13 (vì có BB hiện trường, NT ≠ TK, không điều chỉnh); phát hiện `CONG_DON_SAI` (tổng khai báo cũ 199.071.000 ≠ tính lại 214.611.000, `tien_anh_huong = -15540000`), `HOA_DON_KHONG_KHOP` và `VUOT_GIA_HOP_DONG` (`tien_anh_huong = 13791000`); dòng 5 phiếu "Thiết kế cơ sở/TKKT" yêu cầu `Bổ sung-điều chỉnh` |
| TC-04 Chưa kết luận | `CHUA_KET_LUAN` | `HOA_DON_GTGT.co = false`, `hoa_don_gtgt = null`; `loi_trinh_bay = chua_kiem_tra`; TC10 = `chua_du_can_cu` | 200; `CHUA_KET_LUAN`, quy tắc 3; `can_bo_sung` chứa "Thiếu Hóa đơn GTGT", "Lỗi trình bày: chưa kiểm tra…", "Tiêu chí 10 … chưa đủ căn cứ"; dòng 11 phiếu yêu cầu `Bổ sung`; dòng 9 yêu cầu `Bổ sung`; `ho_so_thieu` trong báo cáo = "Thiếu Hóa đơn GTGT" |
| TC-05 Cổng số liệu: chép hợp đồng | `CONG_SO_LIEU` | HM4: BBNT = QT = 135 (= HĐ), NT hiện trường 133,8, `co_so_do_hien_truong = false` | 200; `CHUA_KET_LUAN` (không phải Đạt); phát hiện `QT_LECH_NGHIEM_THU` HM4 lệch 1,2 m2, `tien_anh_huong = 624000`; `BBNT_LECH_SO_GOC` HM4; `CHEP_HOP_DONG_KHONG_SO_DO` HM4; `CONG_DON_SAI` (khai báo 199.071.000 ≠ 199.695.000); `HOA_DON_KHONG_KHOP` (218.978.100 ≠ 219.664.500); `doi_chieu.tong_thanh_toan_du = 624000`; phụ lục II.a có 1 dòng HM4 |
| TC-06 Vượt giá HĐ không phụ lục | (webhook) | HM1: HC = NT = BBNT = QT = 460; tổng khai báo 202.011.000, sau thuế 222.212.100; hóa đơn sau thuế 222.212.100; chiều dài bản vẽ 460 | 200; `CHUA_KET_LUAN`; phát hiện `VUOT_GIA_HOP_DONG` `tien_anh_huong = 1191000`, nhóm YCBS 1 yêu cầu `Bổ sung`; không có `CONG_DON_SAI`; không hạ TC14 (lệch 2,2% < 5%) |
| TC-06b Vượt giá HĐ có phụ lục | (webhook) | như TC-06 + `PHU_LUC_HOP_DONG.co = true`, `gia_tri_sau_phu_luc = 205000000` | 200; `DAT`; `kiem_tra_hop_dong.gia_tri_hieu_luc = 205000000`, `vuot_hop_dong = 0` |
| TC-07 Giám sát không giao mà quyết toán | (webhook) | `chi_phi_giam_sat = {co_trong_du_toan: true, gia_tri: 4500000, da_giao_don_vi: false, co_trong_quyet_toan: true}` | 200; `CHUA_KET_LUAN`; phát hiện `GIAM_SAT_KHONG_GIAO` `tien_anh_huong = 4500000`; `giam_sat.ket_qua = khong_quyet_toan` |
| TC-07b Giám sát không giao, không quyết toán | (webhook) | như TC-07 nhưng `co_trong_quyet_toan: false` | 200; `DAT`; `ket_luan.luu_y` có dòng về giám sát; `giam_sat.ket_qua = luu_y` |
| TC-08 Mốc pháp lý sai | (webhook) | `ngay_lap_du_toan = "2026-08-12"`, `can_cu_phap_ly_theo_moc.so_lieu.moc_ap_dung = "truoc_01072026"` (người nhập `dat`) | 200; `CHUA_KET_LUAN`; mục checklist bị hạ `khong_dat`, `nguon = tu_dong`; phát hiện `MOC_PHAP_LY_SAI` nhóm 6 |
| TC-09 Thiếu số gốc | (webhook) | HM2 `kl_nghiem_thu_hien_truong = null` | 200; `CHUA_KET_LUAN`; HM2 `trang_thai = thieu_so_goc`, `thanh_tien_anh_huong = null`; phát hiện `THIEU_SO_GOC` |
| TC-10 Ưu tiên quy tắc | (webhook) | như TC-03 + TC9 `khong_phu_hop` + thiếu `QD_CHI_DINH_THAU` | 200; `DUNG_QUYET_TOAN`; `can_bo_sung` vẫn chứa "Thiếu Quyết định chỉ định thầu"; dòng 1 phiếu yêu cầu `Bổ sung` |
| TC-11 Có điều chỉnh đầy đủ | (webhook) | như TC-03 + `HS_THIET_KE_DIEU_CHINH.co = DU_TOAN_DIEU_CHINH.co = true`, HM1 `kl_thiet_ke_dieu_chinh = 520`, TC5 = `phu_hop`, tổng/hóa đơn cập nhật 214.611.000 / 236.072.100; `PHU_LUC_HOP_DONG.co = true`, `gia_tri_sau_phu_luc = 215000000` | 200; `DAT`; TC13, TC14 giữ `phu_hop`; `kl_tk_tham_chieu = 520` |
| TC-12 TC nhóm không bắt buộc | (webhook) | TC10 = `khong_phu_hop`; `loi_trinh_bay = khong_dat` | 200; `DAT`; `luu_y` có 2 dòng; tờ trình liệt kê lưu ý |
| TC-13 Thiếu trường | (webhook) | xóa `cong_trinh.ten_cong_trinh`; `chi_nhanh = "Thủ Dầu Một"` | 400; `ma_loi = DAU_VAO_KHONG_HOP_LE`; `loi` có đúng 2 phần tử (`THIEU_TRUONG`, `GIA_TRI_KHONG_HOP_LE`); không có dòng báo cáo |
| TC-14 Hạng mục rỗng | `LOI_HANG_MUC_RONG` / webhook | `hang_muc = []` | 422; `ma_loi = HANG_MUC_RONG`; chạy thử: dừng ở N20, output N23 có `http_status = 422` |
| TC-15 Hạng mục rỗng + thiếu trường | (webhook) | `hang_muc = []` + thiếu `hop_dong` | 400; `loi` chứa cả `HANG_MUC_RONG` và `THIEU_TRUONG` |
| TC-16 Body không hợp lệ | (webhook) | body = `[ {...} ]` (mảng); body = chuỗi `"abc"` với `Content-Type: text/plain` | 400; `BODY_KHONG_PHAI_OBJECT` / `JSON_KHONG_HOP_LE` |
| TC-17 Số kiểu Việt | (webhook) | (a) HM1 `don_gia_quyet_toan = "210,000"`; (b) `= "210000"`; (c) `= "210.000"` | (a) 400 `SO_SAI_DINH_DANG` tại `hang_muc[0].don_gia_quyet_toan`; (b) chấp nhận, đổi thành 210000, kết quả như TC-01; (c) theo quy tắc hiện tại bị hiểu là 210 → sinh `DON_GIA_KHAC_HOP_DONG` và `CONG_DON_SAI`, kết luận `CHUA_KET_LUAN` (rủi ro đã nêu ở Q6) |
| TC-18 Không ghi đè ngưỡng | (webhook) | thêm `"cau_hinh": {"NGUONG_KHAC_THIET_KE": 0.5}` vào TC-03 | 200; vẫn `DUNG_QUYET_TOAN` (cau_hinh gửi lên bị bỏ) |
| TC-19 Manual không gọi Respond | `DAT` | chạy bằng nút Execute | Execution kết thúc ở N20, N19 không chạy, không lỗi |
| TC-20 Email tắt | `DIEU_CHINH_TK_DT` | – | N21 có 1 item; N22 hiển thị trạng thái disabled, không gửi |

Kiểm tra số học cho các ca:
- TC-03: Σ = 199.071.000 + (520−446)×210.000 = 199.071.000 + 15.540.000 = **214.611.000 đ**; `CONG_DON_SAI.tien_anh_huong = 199071000 − 214611000 = −15540000`.
- TC-05: Σ = 199.071.000 + (135−133,8)×520.000 = 199.071.000 + 624.000 = **199.695.000 đ**.
- TC-06: Σ = 199.071.000 + 14×210.000 = **202.011.000 đ**; vượt 200.820.000 là **1.191.000 đ**.
- TC-11: Σ = **214.611.000 đ**, sau thuế 10% = **236.072.100 đ**.

---

## 8. Hợp đồng bàn giao, trạng thái quan sát được, dọn dẹp

### 8.1 Handoff: Hệ thống gọi → Webhook

```
HANDOFF: Hệ thống gọi -> N01 Webhook nhận hồ sơ
  ENDPOINT: POST {N8N_URL}/webhook/biwase/kiem-tra-quyet-toan
  PAYLOAD: object theo Mục 3
  SUCCESS RESPONSE: 200 + Mục 6.1 (kể cả khi kết luận Không đạt)
  FAILURE RESPONSE: 400/422/500 + Mục 6.2; retryable = false với 400/422, true với 500/timeout
  TIMEOUT: phía gọi đặt 30 s — quá hạn coi là lỗi, gửi lại nguyên body (an toàn vì workflow không ghi trạng thái)
  ON FAILURE: phía gọi hiển thị danh sách loi[] cho người kiểm tra sửa
```

### 8.2 Handoff: Workflow → Người duyệt (thủ công)

```
HANDOFF: N17 -> Lãnh đạo Phòng Đầu tư
  PAYLOAD: phieu_ycbs.markdown/html, dong_bao_cao.csv_dong
  KÊNH: người kiểm tra lấy từ response (hoặc execution log) và trình duyệt
  ON APPROVE: dán dòng báo cáo vào Báo cáo tổng hợp; bật N22 hoặc gửi thủ công
  ON REJECT: người kiểm tra sửa dữ liệu đầu vào, gọi lại webhook (sinh ma_phien mới)
```

### 8.3 Trạng thái quan sát được

| Thời điểm | Người gọi thấy | Người vận hành n8n thấy | Dữ liệu lưu | Log |
|---|---|---|---|---|
| Đang chạy (< 2 s) | đang chờ HTTP | execution "Running" | – | – |
| Hoàn tất có kết luận | 200 + kết luận + phiếu | execution "Success", nhánh Switch đã chạy được tô sáng | execution data (theo setting lưu) | output từng node |
| Lỗi đầu vào | 400/422 + `loi[]` | execution "Success" (lỗi nghiệp vụ được xử lý), nhánh N06 false | execution data | output N05 |
| Lỗi lập trình | 500 mặc định n8n | execution "Error" ở node ném lỗi | execution data | stack trace |

### 8.4 Danh mục dọn dẹp

Workflow **không tạo tài nguyên bên ngoài** (không ghi file, không ghi DB, không gửi email). Không cần ABORT_CLEANUP. Tài nguyên duy nhất là bản ghi execution trong DB của n8n, dọn theo chính sách `EXECUTIONS_DATA_PRUNE` của bản cài.

---

## 9. Điểm cần người duyệt

| # | Nội dung | Mặc định trong đặc tả | Ai duyệt |
|---|---|---|---|
| D1 | **Cổng số liệu**: phát hiện mức `chan` (lệch QT–NT, chép HĐ không số đo, vượt HĐ không phụ lục, giám sát không giao, cộng dồn sai, đơn giá khác HĐ, hóa đơn lệch, mốc pháp lý sai) khiến kết luận tối đa là "Chưa kết luận" dù 15 tiêu chí đều phù hợp. Quy tắc gốc không nêu trường hợp này; đặc tả thêm để không cho hồ sơ có rủi ro thanh toán dư đi tới "Đạt". | Bật | Lãnh đạo Phòng Đầu tư |
| D2 | Ngưỡng "hoàn công khác thiết kế" để máy hạ TC13/TC14: `NGUONG_KHAC_THIET_KE = 5%` theo từng hạng mục; hạng mục phát sinh/bị bỏ luôn tính là khác. | 5% | Lãnh đạo Phòng Đầu tư |
| D3 | Tên 15 tiêu chí ở bảng 4.4.2 là **tạm**; cần thay bằng tên chính thức trong Bảng tiêu chí đánh giá, kiểm lại nhóm YCBS mặc định của từng tiêu chí. | Tên tạm | Người kiểm tra |
| D4 | "Có hồ sơ điều chỉnh" = có **cả** TK điều chỉnh **và** DT điều chỉnh. Chỉ có một trong hai → vẫn coi là không điều chỉnh (TC13/14 có thể bị hạ). | Cả hai | Lãnh đạo Phòng Đầu tư |
| D5 | Nhánh lỗi đầu vào (400/422) không ghi dòng Báo cáo tổng hợp. | Không ghi | Người kiểm tra |
| D6 | Số phiếu YCBS tạm `YCBS-{mã}-{ngày}`, không đánh số liên tục (workflow không lưu trạng thái). Nếu cần số liên tục → bổ sung kho lưu (Data Table của n8n hoặc Google Sheets, cần credential). | Số tạm | Văn thư/Lãnh đạo |
| D7 | Thời hạn bổ sung tính theo **ngày lịch**, mặc định 7 ngày từ ngày nhận. | 7 ngày lịch | Lãnh đạo Phòng Đầu tư |
| D8 | Node `Gửi email chi nhánh/nhà thầu` để **tắt**; chỉ bật sau khi duyệt nội dung phiếu, cấu hình SMTP, điền `fromEmail`. | Tắt | Lãnh đạo Phòng Đầu tư |
| D9 | Webhook **không xác thực** (đáp ứng ràng buộc không credential). Trước khi mở ra ngoài máy chủ nội bộ: bật Header Auth hoặc đặt sau reverse proxy có xác thực. Payload chứa giá trị hợp đồng và tên nhà thầu. | Không xác thực | Quản trị hệ thống |
| D10 | Mốc căn cứ pháp lý xác định theo `ngay_lap_du_toan` (≥ 01/7/2026 → căn cứ mới). Có thể đúng hơn là theo ngày ký hợp đồng hoặc thời điểm thi công. | `ngay_lap_du_toan` | Người kiểm tra |
| D11 | Phiếu YCBS chỉ có hiệu lực sau khi người duyệt ký; workflow chỉ sinh bản nháp. | – | Lãnh đạo Phòng Đầu tư |

---

## 10. Giả định & câu hỏi mở

### 10.1 Giả định

| # | Giả định | Đã kiểm chứng? | Rủi ro nếu sai |
|---|---|---|---|
| A1 | n8n bản cài là 2.x (theo `scripts/install-n8n.sh`, `n8n@latest`, Node 24) | Đã đọc script; chưa chạy | typeVersion node khác; agent dựng cần kiểm lại khi import |
| A2 | Code node n8n 2.x có `DateTime` (Luxon), `Intl` có ICU tiếng Việt | Chưa kiểm | Định dạng ngày/tiền sai → dùng hàm tự định dạng dự phòng |
| A3 | Respond to Webhook không được chạy khi nguồn là Manual Trigger → đã chặn bằng N18 | Thiết kế phòng thủ | – |
| A4 | Đơn giá quyết toán là đơn giá dùng tính thành tiền ảnh hưởng | Chưa xác nhận | Nếu phải dùng đơn giá HĐ → đổi 1 dòng ở N08 |
| A5 | Giá trị HĐ, quyết toán so sánh ở mức **trước thuế** | Chưa xác nhận | Có thể báo "vượt HĐ" sai nếu HĐ ghi sau thuế |
| A6 | Một request = một hồ sơ quyết toán | Theo yêu cầu | – |
| A7 | Mã hiệu định mức trong ví dụ (`MINH_HOA.xx`) chỉ để minh họa, không phải mã TT38 thật | – | Không dùng ví dụ làm tham chiếu định mức |

### 10.2 Câu hỏi mở

- Q1: Danh sách tên chính thức của tiêu chí 1–11 (D3).
- Q2: Lệch ba chiều nhỏ (vd. 0,1 m trên 446 m) có được chấp nhận dung sai nghiệp vụ không, hay phải khớp tuyệt đối như đặc tả (dung sai 0,001)?
- Q3: Phiếu YCBS có cần mẫu Word theo bộ biểu mẫu Biwase (mã hiệu M..-PDT.BWE-2026) không? Nếu có, nên sinh bằng workflow riêng từ JSON `phieu_ycbs.bang`.
- Q4: Báo cáo tổng hợp đích là gì (Excel trên ổ chung, Google Sheets, n8n Data Table)? Quyết định này quyết định có thêm node ghi hay không.
- Q5: Hợp đồng trọn gói (`tron_goi`): có áp quy tắc "quyết toán theo khối lượng thực tế" không? Đặc tả hiện chỉ kiểm đơn giá khi `don_gia_co_dinh`, còn đối chiếu ba chiều chạy cho mọi loại hợp đồng.
- Q6: Chuỗi `"210.000"` (người nhập hiểu là 210 nghìn) khớp định dạng thập phân và bị hiểu thành 210. Có nên **cấm mọi chuỗi số** (chỉ nhận `number` JSON) để tránh nhầm? Đề nghị: cấm – khi đó TC-17 mong đợi 400 cho cả hai biến thể.

### 10.3 Workflow liên quan phát hiện được (chưa đặc tả – không gộp vào đây)

| Workflow | Trạng thái | Ghi chú |
|---|---|---|
| GĐ1–GĐ2: kiểm tra bản vẽ thiết kế, dự toán | Missing | dùng chung checklist bản vẽ/dự toán |
| GĐ3–GĐ4: kiểm tra BBNT khối lượng, nghiệm thu hoàn thành | Missing | nguồn của `kl_nghiem_thu_*` |
| Ghi Báo cáo tổng hợp vào kho lưu | Missing | phụ thuộc Q4 |
| Duyệt và gửi phiếu YCBS (human-in-the-loop) | Missing | có thể dùng node Wait + form duyệt của n8n |
| Theo dõi hạn bổ sung, nhắc quá hạn | Missing | cần kho lưu trạng thái |

---

## 11. Nhật ký đặc tả – thực tế

| Ngày | Phát hiện | Hành động |
|---|---|---|
| 2026-11-23 | Tạo đặc tả ban đầu; thư mục `docs/n8n/` chưa có workflow JSON để đối chiếu | – |
