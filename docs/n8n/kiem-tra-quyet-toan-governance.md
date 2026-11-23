# Governance – Workflow "Kiểm tra hồ sơ quyết toán công trình" (Biwase)

**Ngày:** 2026-11-23 · **Đặc tả gốc:** `docs/n8n/kiem-tra-quyet-toan-spec.md` v0.1 · **Quy tắc:** `2026.11-1`
**File:** `workflows/kiem-tra-quyet-toan.json` (24 node, `active: false`) · **Mã nguồn Code node:** `workflows/src/nodes/*.js` → build bằng `node workflows/src/build.js` · **Kiểm thử:** `node workflows/test/run-tests.js`

## 1. Kết luận governance

**Verdict: APPROVE AS PILOT** (chạy thử nội bộ Phòng Đầu tư, song song với kiểm tra tay; chưa thay quy trình giấy).

| Tiêu chí | Đánh giá |
|---|---|
| Tiết kiệm thời gian | Trung bình–cao. Máy làm phần cộng dồn, đối chiếu ba chiều, áp 4 quy tắc kết luận và soạn Phiếu YCBS / tờ trình / dòng báo cáo. Phần đọc bản vẽ, tra TT38 và đơn giá vẫn do người làm. Lợi ích phụ thuộc số hồ sơ quyết toán mỗi tháng (chưa có số liệu, cần đo trong pilot). |
| Mức trọng yếu dữ liệu | **Cao** (giá trị hợp đồng, quyết toán, hóa đơn). Giảm rủi ro bằng cách: máy chỉ **hạ** kết quả, không bao giờ nâng (D1, TC13/14); mọi đầu ra là **bản nháp**; email tắt. |
| Rủi ro phụ thuộc ngoài | **Thấp.** Không gọi API ngoài, không credential, không ghi file/DB. Phụ thuộc duy nhất là bản cài n8n (xem mục 4, lỗi isolated-vm). |
| Mở rộng 1x → 100x | Tốt. Không giữ trạng thái, tính toán trong bộ nhớ, mỗi request một hồ sơ. Dòng báo cáo có `khoa_chong_trung` để bảng đích lọc trùng. Số phiếu YCBS chưa liên tục (D6). |
| Khả năng bảo trì | Tốt. Ngưỡng chỉ khai báo một chỗ (`CAU_HINH` ở N04, cấm gửi đè qua webhook). Logic tách thành từng file nguồn, build ra file JSON giống nhau mỗi lần, UUID cố định. Có 25 ca kiểm thử chạy offline. |

**Chưa được đưa lên PROD khi chưa có:** người duyệt chốt D1–D3, D9, D10 (bảng dưới); bật Header Auth; quyết định nơi lưu Báo cáo tổng hợp (Q4); gắn Error Workflow để cảnh báo; pilot tối thiểu 10 hồ sơ thật, có so sánh với kết luận làm tay.

## 2. Điểm cần người duyệt (kế thừa D1–D11)

| # | Nội dung | Mặc định đã dựng trong workflow | Người duyệt |
|---|---|---|---|
| D1 | Cổng số liệu: có phát hiện mức `chan` thì kết luận cao nhất chỉ là "Chưa kết luận" | **Bật** (N12, quy tắc 3) | Lãnh đạo PĐT |
| D2 | Ngưỡng "khác thiết kế" để máy hạ TC13/14 | **5%/hạng mục**; hạng mục phát sinh hoặc bị bỏ luôn tính là khác (`CAU_HINH.NGUONG_KHAC_THIET_KE`) | Lãnh đạo PĐT |
| D3 | Tên 15 tiêu chí | **Tên tạm** theo bảng 4.4.2 (N11). Đổi tên không ảnh hưởng logic | Người kiểm tra |
| D4 | "Có điều chỉnh" = có **cả** TK điều chỉnh và DT điều chỉnh | **Cả hai** (N07 `co_dieu_chinh_day_du`) | Lãnh đạo PĐT |
| D5 | Nhánh lỗi 400/422 không tạo dòng báo cáo | **Không ghi** (N23) | Người kiểm tra |
| D6 | Số phiếu YCBS | **Số tạm** `YCBS-{mã}-{yyyyMMdd}`. Hai phiếu cùng công trình trong một ngày sẽ trùng số | Văn thư/Lãnh đạo |
| D7 | Thời hạn bổ sung | **7 ngày lịch** tính từ ngày nhận. Nếu hạn đã qua thì tính lại từ ngày lập phiếu và ghi cảnh báo | Lãnh đạo PĐT |
| D8 | Node gửi email | **Tắt** (`disabled: true`, không có credential, `fromEmail` để trống) | Lãnh đạo PĐT |
| D9 | Webhook không xác thực | **Không xác thực**. Phải bật Header Auth trước khi mở ra ngoài localhost hoặc mạng nội bộ | Quản trị hệ thống |
| D10 | Mốc căn cứ pháp lý 01/7/2026 | Xác định theo **`ngay_lap_du_toan`** | Người kiểm tra |
| D11 | Phiếu/tờ trình chỉ là bản nháp | Có dòng chân trang "Chỉ có hiệu lực sau khi lãnh đạo duyệt" | Lãnh đạo PĐT |
| Q6 | Chuỗi `"210.000"` bị hiểu là 210 | **Giữ đúng đặc tả** (chấp nhận chuỗi số thập phân). Đề nghị cấm mọi chuỗi số. Ca TC-17c ghi lại rủi ro này | Lãnh đạo PĐT |

### Chỗ lệch nhỏ so với đặc tả (đã có kiểm thử)
1. N05: nếu body không phải JSON hoặc không phải object thì chỉ trả lỗi body, không liệt kê thêm hàng loạt `THIEU_TRUONG`.
2. N05 kiểm thêm `hoa_don_gtgt` (số, ngày, các số tiền), kiểu của `chi_phi_giam_sat`, `so_lieu` checklist và độ dài `ma_cong_trinh` ≤ 50, để N09 không tính ra NaN.
3. N09 thêm một trường hợp: quyết toán **vượt cả giá trị sau phụ lục** → `VUOT_GIA_HOP_DONG` mức `chan`. Đặc tả gốc để lọt trường hợp này.
4. N10 cũng kiểm tổng sau thuế (đặc tả có nêu trong ghi chú). N04 bỏ các khóa nội bộ `meta`, `phat_hien`, `kiem_tra_cau_truc` nếu người gọi gửi lên.
5. `fmtTien` luôn tự chèn dấu chấm, không phụ thuộc ICU. `phieu_ycbs.ten_file_goi_y` là object `{markdown, html}`. Có thêm `phieu_ycbs.canh_bao`.

## 3. Chuẩn triển khai

- **Tên chuẩn đề xuất** (giữ tên hiển thị tiếng Việt theo đặc tả, gắn tên chuẩn vào description/tag): pilot `TEST-QT-KiemTraHoSoQuyetToan-Evaluate-v0.1` → `PROD-QT-KiemTraHoSoQuyetToan-Evaluate-v1.0`. Đổi quy tắc kết luận thì tăng MAJOR; sửa câu chữ trong phiếu thì tăng MINOR. Đồng thời tăng `CAU_HINH.PHIEN_BAN_QUY_TAC`.
- **Tag:** đặc tả yêu cầu `biwase, phong-dau-tu, quyet-toan`. File JSON để `tags: []`, vì chưa thử import tag qua CLI (tag trong n8n là bản ghi riêng, không phải chuỗi). Gắn tag trong editor sau khi import.
- **Đối chiếu với baseline:** có nhánh lỗi (N23, 400/422/500). Chống trùng: ở bảng đích, nhờ `khoa_chong_trung`. Retry: không áp dụng (không có lời gọi ngoài; phía gọi có thể gửi lại an toàn). Timeout: 60 s. Log: `ma_phien`, phiên bản quy tắc, thời điểm, mã công trình, kết luận, ghi vào execution data (`saveData*: all`). **Còn thiếu:** chưa có cảnh báo khi lỗi (cần gắn Error Workflow), chưa có audit log bền ngoài DB execution của n8n. Đường dự phòng khi workflow hỏng: người kiểm tra lập phiếu tay theo checklist GĐ5.
- **Tài liệu SOP cần lập trước PROD:** cách người kiểm tra điền JSON (hoặc form nhập), quy trình duyệt phiếu, cách bật N22.

## 4. Bằng chứng kiểm thử

- `node workflows/test/run-tests.js`: **25/25 PASS**. Gồm 1 ca kiểm cấu trúc JSON và 24 ca chạy qua chuỗi Code node lấy trực tiếp từ file JSON: TC-01 → TC-18, các biến thể a/b, TC-01 qua webhook. IF/Switch được mô phỏng theo đúng `connections`.
- **CLI n8n 2.48.7 (Node 24, thư mục dữ liệu tạm):**
  - Lần import đầu **lỗi khởi động**: `Could not initialize the vm expression engine` (isolated-vm). Lỗi xảy ra trước khi n8n đọc file, không phải lỗi của workflow.
  - Chạy lại với biến cấu hình chính thức `N8N_EXPRESSION_ENGINE=legacy`: `Successfully imported 1 workflow`. Export ngược ra so sánh: 24 node, typeVersion và jsCode giữ nguyên, email vẫn `disabled`.
  - `n8n execute` chạy thật 3 kịch bản (Code node chạy trong task runner thật, có Luxon):
    - `DAT` → DAT, tổng 199.071.000, chênh lệch −1.749.000, kết thúc ở N20, N19 không chạy.
    - `DUNG_QUYET_TOAN` → TC13/14 bị máy hạ, dòng 5 phiếu "Bổ sung-điều chỉnh", N21 có 1 item, N22 cho dữ liệu đi qua (disabled), không gửi.
    - `LOI_HANG_MUC_RONG` → N23 trả 422.
- **Chưa kiểm chứng:**
  - Gọi HTTP thật vào webhook. Chưa làm vì phiên này không được chạy server nền, nên chưa xác nhận được mã trả về (`responseCode` dạng biểu thức), header, và cách n8n xử lý body `text/plain` (TC-16b mới chỉ mô phỏng).
  - Engine `vm` (mặc định) trên máy chủ thật. Cần sửa isolated-vm hoặc đặt `N8N_EXPRESSION_ENGINE=legacy` cho bản cài.
  - Gửi email thật.
  - Dữ liệu hồ sơ thật (mới dùng dữ liệu mẫu).

## 5. Import và chạy thử

```bash
# Import (máy chủ n8n 2.x, Node 24). Nếu gặp lỗi isolated-vm thì thêm N8N_EXPRESSION_ENGINE=legacy
n8n24 import:workflow --input=workflows/kiem-tra-quyet-toan.json
```

**Chạy thử bằng Manual Trigger:** mở workflow → node `Dữ liệu mẫu` → sửa `const KICH_BAN = "DAT";` (các giá trị: `DAT | DIEU_CHINH_TK_DT | DUNG_QUYET_TOAN | CHUA_KET_LUAN | CONG_SO_LIEU | LOI_HANG_MUC_RONG`) → **Execute workflow** → xem output của `Đóng gói đầu ra` (hoặc `Tạo phản hồi lỗi`). Ở chế độ này, execution kết thúc tại `Kết quả chạy thử`.

**Gọi webhook bằng curl:**

```bash
# Chế độ test: bấm "Listen for test event" trên node Webhook trước khi gọi
curl -sS -X POST "http://localhost:5678/webhook-test/biwase/kiem-tra-quyet-toan" \
  -H "Content-Type: application/json" \
  --data-binary @workflows/src/mau-dat.json | jq '.ket_luan, .dong_bao_cao.csv_dong'

# Production (sau khi người duyệt bật Active và Header Auth – D9)
curl -sS -X POST "http://localhost:5678/webhook/biwase/kiem-tra-quyet-toan" \
  -H "Content-Type: application/json" -H "X-Api-Key: <khóa do quản trị cấp>" \
  --data-binary @ho-so.json -w '\nHTTP %{http_code}\n'

# Lấy phiếu YCBS ra file HTML để trình duyệt
curl -sS -X POST "http://localhost:5678/webhook-test/biwase/kiem-tra-quyet-toan" \
  -H "Content-Type: application/json" --data-binary @ho-so.json | jq -r '.phieu_ycbs.html // empty' > YCBS.html
```

Mã trả về: `200` khi có kết luận (kể cả Không đạt); `400` khi đầu vào sai, có `loi[]` chi tiết; `422` khi danh sách hạng mục rỗng; `500` khi có lỗi nội bộ.
**Cách sửa workflow:** sửa file trong `workflows/src/nodes/`, chạy `node workflows/src/build.js`, rồi `node workflows/test/run-tests.js`. Không sửa tay file JSON.
