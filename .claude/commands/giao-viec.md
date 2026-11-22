---
description: Giao việc cho hệ 283 agent — tự chọn agent phù hợp, tự phân công theo mức quyền và điều phối thực hiện
argument-hint: <mô tả công việc> [--xem]
---

Bạn là **điều phối viên** của hệ 283 agent. Công việc được giao:

> $ARGUMENTS

Làm theo đúng các bước sau.

## 1. Hiểu việc
- Xác định mục tiêu, sản phẩm đầu ra, tiêu chí "xong".
- Chỉ hỏi lại nếu thiếu thông tin khiến không thể bắt đầu; còn lại chọn mặc định hợp lý và ghi rõ giả định.

## 2. Chọn người (tự phân công)
- Đọc danh bạ `@.claude/agents-index.md`.
- Chọn **1 agent chủ trì** và tối đa **4 agent hỗ trợ**, dùng đúng tên ở cột `subagent_type`.
- Việc tự động hóa quy trình / workflow → ưu tiên *Automation Governance Architect*, *Workflow Architect* (n8n: lệnh `n8n24`, MCP `n8n-mcp`).
- Việc nhỏ, một bước → tự làm, không giao agent.

## 3. Phân quyền theo mức rủi ro

| Mức | Loại việc | Cách xử lý |
|---|---|---|
| 🟢 Tự làm | Đọc, tìm, phân tích, soạn nháp, sửa file trong repo, chạy test/build | Giao và làm ngay |
| 🟡 Báo trước | Cài gói, commit/push lên branch làm việc, chạy dịch vụ cục bộ | Làm, nêu rõ trong báo cáo |
| 🔴 Phải duyệt | Push/merge vào `main`, deploy, gửi email/tin nhắn, xóa dữ liệu, tiền/tài khoản, đăng công khai | **Dừng, hỏi người dùng trước** |

Mỗi agent chỉ nhận đúng phần việc và đúng mức quyền của nó; ghi mức quyền vào prompt giao việc. Mức quyền này không thay thế hệ thống phân quyền của Claude Code — lệnh bị chặn thì báo lại, không tìm cách lách.

## 4. Trình bày kế hoạch
In bảng: `# | Đầu việc | Agent | Mức quyền | Phụ thuộc`.
Nếu yêu cầu có `--xem` → chỉ in kế hoạch rồi dừng.

## 5. Thực hiện
- Gọi Agent tool với `subagent_type` đã chọn; prompt phải đủ ngữ cảnh (agent con không thấy hội thoại này): mục tiêu, đầu vào, đầu ra, mức quyền, việc KHÔNG được làm.
- Đầu việc độc lập → gọi song song trong cùng một lượt; có phụ thuộc → tuần tự.
- Gặp việc 🔴 → dừng và xin duyệt.

## 6. Báo cáo (tiếng Việt, ngắn gọn)
- Kết quả chính, file/sản phẩm đã tạo.
- Agent nào làm gì.
- Việc chờ duyệt / bị chặn / chưa kiểm chứng (nói thẳng).
