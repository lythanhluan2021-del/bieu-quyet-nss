# HƯỚNG DẪN TRIỂN KHAI FORM BIỂU QUYẾT CHO 80 GIÁO VIÊN
## TRƯỜNG THPT NGUYỄN SINH SẮC (NĂM HỌC 2026 - 2027)

Tài liệu này hướng dẫn bạn chi tiết từng bước để đưa Form biểu quyết lên mạng và gửi cho 80 giáo viên thực hiện khảo sát ngay trên điện thoại trong buổi Hội nghị.

---

### BƯỚC 1: TẠO GOOGLE SHEET & DÁN MÃ GOOGLE APPS SCRIPT (MẤT 2 PHÚT)

1. Mở trình duyệt, truy cập vào [Google Sheets](https://docs.google.com/spreadsheets) và tạo **1 Trang tính mới (Blank spreadsheet)**.
2. Đổi tên trang tính thành: **`Tong_Hop_Bieu_Quyet_Nghi_Quyet_2026_2027_THPT_NSS`**.
3. Trên thanh menu trên cùng, chọn: **Tiện ích mở rộng (Extensions)** $\rightarrow$ **Apps Script**.
4. Xóa hết tất cả mã mặc định đang có trong khung soạn thảo.
5. Mở file **`google_apps_script.js`** (trong thư mục `d:\FORM-NSS`), copy toàn bộ nội dung và dán vào Apps Script.
6. Bấm biểu tượng **Lưu** (hình đĩa mềm) hoặc nhấn `Ctrl + S`.
7. Bấm nút màu xanh **Triển khai (Deploy)** ở góc trên bên phải $\rightarrow$ Chọn **Tùy chọn triển khai mới (New deployment)**.
8. Cài đặt các thông số như sau:
   * **Chọn loại:** Bấm vào biểu tượng bánh răng ⚙ $\rightarrow$ Chọn **Ứng dụng web (Web app)**.
   * **Mô tả (Description):** `Biểu quyết THPT Nguyễn Sinh Sắc 2026-2027`.
   * **Thực thi dưới dạng (Execute as):** `Tôi (Email của bạn)`.
   * **Ai có quyền truy cập (Who has access):** Chọn **Bất kỳ ai (Anyone)** *(Quan trọng: để 80 giáo viên mở link là làm được ngay mà không bị hỏi quyền đăng nhập).*
9. Bấm nút **Triển khai (Deploy)**.
10. Google sẽ yêu cầu cấp quyền lần đầu:
    * Bấm **Ủy quyền truy cập (Authorize access)**.
    * Chọn tài khoản Google của bạn.
    * Bấm vào chữ nhỏ **Nâng cao (Advanced)** ở góc dưới bên trái $\rightarrow$ Chọn **Đi tới ... (không an toàn) / Go to ... (unsafe)**.
    * Bấm **Cho phép (Allow)**.
11. Sau khi triển khai xong, Google sẽ cung cấp **URL Ứng dụng web (Web App URL)** có dạng:
    `https://script.google.com/macros/s/AKfycby.../exec`
12. **Sao chép (Copy) đường link này**.

---

### BƯỚC 2: DÁN ĐƯỜNG LINK VÀO FILE `index.html`

1. Mở file **`index.html`** (trong thư mục `d:\FORM-NSS`) bằng Notepad hoặc bất kỳ trình soạn thảo nào.
2. Tìm dòng (ở gần cuối file):
   ```javascript
   const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
   ```
3. Thay thế đoạn `"YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"` bằng đường link bạn vừa copy ở Bước 1.
4. Bấm `Ctrl + S` để lưu file.

---

### BƯỚC 3: ĐƯA FORM LÊN WEB & GỬI CHO 80 GIÁO VIÊN

Bạn có thể đưa form lên mạng hoàn toàn miễn phí trong 10 giây bằng 1 trong các cách sau:

#### Cách 1: Kéo thả file lên Tiiny Host / Netlify Drop (Cực nhanh - Khuyên dùng)
1. Mở trang web: [tiiny.host](https://tiiny.host) hoặc [app.netlify.com/drop](https://app.netlify.com/drop)
2. Kéo thả file **`index.html`** vào trang web đó.
3. Nhập tên link bạn muốn (ví dụ: `thpt-nguyensinhsac-bieuquyet`).
4. Bạn sẽ có ngay một đường link web chính thức, ngắn gọn và đẹp mắt!

#### Cách 2: Sử dụng GitHub Pages hoặc Vercel
* Nếu nhà trường có tài khoản GitHub / Vercel, chỉ cần tải file lên để chạy vĩnh viễn miễn phí.

---

### BƯỚC 4: CÁCH CHIA SẺ CHO 80 GIÁO VIÊN TẠI HỘI NGHỊ

1. **Gửi qua nhóm Zalo trường:**
   Copy đường link web và gửi vào nhóm Zalo Hội đồng sư phạm:
   > *"Kính gửi quý Thầy/Cô, xin vui lòng bấm vào liên kết sau trên điện thoại để hoàn thành biểu quyết dự thảo Nghị quyết năm học 2026 - 2027: [Dán link tại đây]"*

2. **Quét mã QR Code tại Hội trường (Nhanh & Ấn tượng nhất):**
   * Vào trang [me-qr.com](https://me-qr.com) hoặc [qr-code-generator.com](https://www.qr-code-generator.com/) $\rightarrow$ Dán đường link web của bạn vào để tải ảnh mã QR.
   * Chèn mã QR này vào slide PowerPoint chiếu lên màn hình máy chiếu / màn hình LED của hội trường.
   * 80 Thầy/Cô chỉ cần mở camera điện thoại quét mã là form tự động mở ra biểu quyết trong vòng 1 phút!

---

### BẢNG ĐIỀU KHIỂN & BÁO CÁO CỦA BAN GIÁM HIỆU (GOOGLE SHEET)
* Mỗi khi 1 giáo viên nộp bài, 1 dòng dữ liệu mới sẽ xuất hiện ngay lập tức trên Google Sheet.
* Tự động phân loại tỷ lệ: **Nhất trí toàn bộ** vs **Có ý kiến đóng góp**.
* Tệp đính kèm / ảnh tài liệu (nếu có) sẽ tự động được lưu vào thư mục Google Drive **`THPT_NSS_Tap_Tin_Bieu_Quyet_2026_2027`** và tạo link mở trực tiếp trên bảng tính.
