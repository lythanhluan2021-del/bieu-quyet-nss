# HƯỚNG DẪN TRIỂN KHAI WEB FORM KHẢO SÁT THIẾU SÁCH GIÁO KHOA

Hệ thống web form khảo sát thiếu sách giáo khoa dành cho học sinh THPT (Khối 10, 11, 12), giao diện chuẩn điện thoại di động, đồng bộ trực tiếp với Google Sheets và liên kết cơ sở dữ liệu học sinh toàn trường.

---

## 📁 DANH MỤC CÁC FILE TRONG DỰ ÁN

| File | Vai trò |
| :--- | :--- |
| `DM SGK.xlsx` | File Excel danh mục SGK & Chuyên đề học tập chính thức của 3 khối (K10, K11, K12). |
| `dm_sgk_structured.json` | Cấu trúc dữ liệu thông minh gom nhóm từng môn học kèm chuyên đề đi kèm tương ứng. |
| `danh_sach_hoc_sinh26.xls` | File Excel gốc từ trường chứa 1.307 học sinh toàn trường (30 lớp khối 10, 11, 12). |
| `danh_sach_hoc_sinh_toan_truong.csv` | File danh sách 1.307 học sinh đã chuẩn hóa UTF-8 (dùng để nạp vào Google Sheet trong 5 giây). |
| `banner.jpg` | Ảnh bìa (Banner) chính của trường hiển thị ở phần đầu web form. |
| `logo.jpg` | Logo chính thức của trường hiển thị cạnh tiêu đề và popup hoàn tất. |
| `Code.gs` | Mã nguồn Backend chạy trên **Google Apps Script** (xử lý API, lưu dữ liệu, chống trùng lặp, cung cấp API Dashboard). |
| `Index.html` | Giao diện Web Form Khảo Sát Học Sinh (chuẩn Mobile, nút Thống Kê và Popup bảo mật phân quyền). |
| `ThongKe.html` | Trang Bảng Điều Khiển & Thống Kê Thời Gian Thực (Dashboard chuyên biệt cho BGH và GVCN, xuất Excel, nhắc Zalo). |

---

## 🚀 CÁC BƯỚC TRIỂN KHAI THỰC TẾ (CHỈ MẤT 3 - 5 PHÚT)

### Bước 1: Tạo Google Sheet mới
1. Mở trình duyệt, truy cập [Google Sheets](https://sheets.google.com) và tạo một bảng tính mới.
2. Đặt tên bảng tính: ví dụ `KhaoSat_Thieu_SGK_THPT`.

---

### Bước 2: Nạp Danh Sách 1.307 Học Sinh vào Sheet `HocSinh`
1. Đổi tên trang tính đầu tiên thành `HocSinh`.
2. **Cách nạp cực nhanh (Khuyên dùng - 5 giây):**
   - Trên Google Sheet, bấm menu **Tệp (File)** $\rightarrow$ **Nhập (Import)**.
   - Chọn tab **Tải lên (Upload)** $\rightarrow$ Kéo thả file `danh_sach_hoc_sinh_toan_truong.csv` vào.
   - Tại mục *Vị trí nhập*, chọn: **Thay thế trang tính hiện tại (Replace current sheet)**.
   - Bấm **Nhập dữ liệu (Import data)**. Toàn bộ 1.307 học sinh (kèm Mã định danh 12 số, Họ tên, Lớp, Khối) sẽ xuất hiện hoàn hảo, không lỗi font tiếng Việt!
3. *(Cách phụ: Bạn cũng có thể mở file `danh_sach_hoc_sinh26.xls`, copy toàn bộ các cột rồi dán vào sheet `HocSinh`, hệ thống sẽ tự động nhận diện thông minh các cột tương ứng).*

---

### Bước 3: Mở Trình Chỉnh Sửa Google Apps Script
1. Trên thanh công cụ Google Sheet, chọn menu **Tiện ích mở rộng** (Extensions) -> **Apps Script**.
2. Đổi tên dự án từ *Dự án không có tiêu đề* thành `KhaoSatSGK`.

---

### Bước 4: Dán Mã Nguồn Vào Apps Script
1. **File Backend:**
   - Mở file `Code.gs` trong thư mục dự án này, copy toàn bộ nội dung.
   - Quay lại trình chỉnh sửa Apps Script, dán đè vào file `Mã.gs` (hoặc `Code.gs`).
   - Bấm icon **Lưu** (hình đĩa mềm hoặc `Ctrl + S`).

2. **File Giao diện Khảo sát Học sinh (Index.html):**
   - Tại cột bên trái trong Apps Script, bấm dấu cộng `+` cạnh mục **Tệp** (Files) -> Chọn **HTML**.
   - Đặt tên tệp là: `Index` *(hệ thống sẽ tự tạo `Index.html`)*.
   - Mở file `Index.html` trong thư mục dự án này, copy toàn bộ nội dung và dán vào.
   - Bấm **Lưu** (`Ctrl + S`).

3. **File Trang Thống Kê & Báo Cáo (ThongKe.html):**
   - Tại cột bên trái trong Apps Script, bấm dấu cộng `+` cạnh mục **Tệp** (Files) -> Chọn **HTML**.
   - Đặt tên tệp là: `ThongKe` *(hệ thống sẽ tự tạo `ThongKe.html`)*.
   - Mở file `ThongKe.html` trong thư mục dự án này, copy toàn bộ nội dung và dán vào.
   - Bấm **Lưu** (`Ctrl + S`).

---

### Bước 5: Chạy Khởi Tạo Cấu Trúc Bảng Tính (Setup Tự Động)
1. Trên thanh công cụ của Apps Script, ở ô chọn hàm (cạnh nút "Chạy / Run"), chọn hàm: **`setupInitialSheets`**.
2. Bấm nút **Chạy** (Run).
3. Nếu Google hỏi cấp quyền:
   - Bấm **Xem lại quyền** (Review permissions) -> Chọn tài khoản Gmail của bạn.
   - Bấm **Nâng cao** (Advanced) -> Bấm **Đi tới KhaoSatSGK (không an toàn)**.
   - Bấm **Cho phép** (Allow).
4. 🎉 Khi script chạy xong, bạn quay lại Google Sheet sẽ thấy tự động tạo thêm:
   - Sheet `DanhMucSach`: Tự điền sẵn đầy đủ 25 đầu sách chuẩn GDPT 2018.
   - Sheet `KetQuaKhaoSat`: Sẵn toàn bộ các cột thông tin và 25 cột chi tiết từng môn.
   - Sheet `ThongKe`: Sẵn các công thức tự động đếm số lượng và tỉ lệ thiếu từng cuốn sách.

---

### Bước 6: Xuất Bản Web App (Deploy)
1. Ở góc trên cùng bên phải màn hình Apps Script, bấm nút màu xanh **Triển khai** (Deploy) -> Chọn **Tùy chọn triển khai mới** (New deployment).
2. Bấm vào biểu tượng bánh răng ⚙️ (chọn loại) -> Chọn **Ứng dụng web** (Web app).
3. Cấu hình triển khai như sau:
   - **Mô tả**: `Khảo sát thiếu SGK v1.0`
   - **Thực thi dưới dạng** (Execute as): **Tôi** (*địa chỉ email của bạn*)
   - **Người có quyền truy cập** (Who has access): **Bất kỳ ai** (*Anyone*)
4. Bấm **Triển khai** (Deploy).
5. Copy đường link tại mục **Ứng dụng web** (có dạng `https://script.google.com/macros/s/.../exec`).

> 💡 **Mẹo:** Bạn có thể dùng các trang rút gọn link như [tinyurl.com](https://tinyurl.com) hoặc [shorturl.at](https://shorturl.at) và tạo mã QR để in ra dán ở lớp hoặc gửi qua nhóm Zalo giáo viên chủ nhiệm.

---

## 📱 TRẢI NGHIỆM CỦA HỌC SINH TRÊN ĐIỆN THOẠI

1. **Bước 1: Chọn thông tin**:
   - Học sinh chọn Khối (10, 11, 12).
   - Chọn Lớp của mình -> Dropdown hiển thị kèm sĩ số lớp (ví dụ: `43 HS`) và đánh số thứ tự chuẩn theo sổ điểm `01, 02, ...`.
   - Chọn Tên mình trong danh sách (Tránh tối đa việc gõ nhầm họ tên, sai lớp).
   - **Cơ chế Ghi Đè Khảo Sát Thông Minh**:
     + Nếu học sinh này **đã từng gửi trước đó**, hệ thống lập tức hiển thị thẻ cảnh báo màu cam nổi bật: *“Đã tìm thấy bản khảo sát trước đó! - Chế độ ghi đè”* kèm thời gian gửi cũ và số lượng sách đã báo thiếu.
     + Hệ thống **tự động nạp lại (pre-fill)** toàn bộ danh sách sách đã báo thiếu, số điện thoại và ghi chú trước đây để học sinh không phải tick chọn lại từ đầu.
     + Nút gửi ở đáy màn hình tự chuyển sang: **`🔄 Cập Nhật Kết Quả (Ghi Đè)`** màu cam.

2. **Bước 2: Báo thiếu sách & Chuyên đề (Gom nhóm thông minh)**:
   - Giao diện gom nhóm trực quan: Mỗi thẻ môn học gồm **Sách giáo khoa chính (Tập 1, Tập 2)** và **Chuyên đề học tập** tương ứng của môn đó.
   - Nút thao tác nhanh 1 chạm:
     + *"Thiếu cả môn"* (chọn cả SGK lẫn Chuyên đề).
     + *"Chỉ thiếu các Chuyên đề"* (dành cho học sinh chỉ thiếu sách chuyên đề).
     + *"Đã có đủ 100% sách"* (nếu học sinh không thiếu bất kỳ sách nào).
   - Học sinh có thể bấm thêm hoặc bỏ bớt những cuốn sách cần điều chỉnh.

3. **Bước 3: Gửi & Cập nhật**:
   - Nhập số điện thoại liên hệ và ghi chú (nếu cần).
   - Bấm nút gửi / cập nhật: Có hộp thoại xác nhận chi tiết số lượng sách trước khi gửi.
   - **Xử lý trên Google Sheets**: Hệ thống tự động tìm đúng dòng kết quả cũ của học sinh (dựa trên Mã định danh 12 số) và **GHI ĐÈ** dữ liệu mới nhất lên đúng dòng đó, **hoàn toàn không bị tạo dòng trùng lặp rác**.
   - Màn hình hiển thị popup chúc mừng và tóm tắt số cuốn sách đã báo thiếu.

---

## 📊 THEO DÕI & TỔNG HỢP KẾT QUẢ DÀNH CHO GIÁO VIÊN

## 📊 HƯỚNG DẪN SỬ DỤNG TRANG THỐNG KÊ (DÀNH CHO BGH & GVCN)

### 1. Cách truy cập Trang Thống Kê
- Trên trang khảo sát [Index.html](file:///d:/FORM-NSS/FROM-SGK/Index.html), ở góc trên bên phải ảnh bìa trường học, bấm vào nút **`[🟢 📊 Thống Kê]`**.
- Một Popup bảo mật sẽ xuất hiện yêu cầu xác thực vai trò để **ngăn chặn học sinh tự ý truy cập**.

### 2. Mật khẩu phân quyền & Quy trình đăng nhập
- **Dành cho Ban Giám Hiệu (BGH):**
  - Mật khẩu: **`BGH`** *(không phân biệt chữ hoa, chữ thường: `bgh`, `BGH`...)*.
  - Bấm **"Vào Báo Cáo Toàn Trường"**: Hệ thống hiển thị toàn cảnh 1.307 học sinh, so sánh tiến độ 3 khối (10, 11, 12), bảng ma trận 30 lớp học và bảng xếp hạng nhu cầu 81 đầu sách toàn trường.
  - Có nút **"Xuất File Excel"** để tải về toàn bộ dữ liệu toàn trường.
- **Dành cho Giáo Viên Chủ Nhiệm (GVCN):**
  - Mật khẩu: **`GVCN`** *(không phân biệt chữ hoa, chữ thường: `gvcn`, `GVCN`...)*.
  - Sau khi nhập đúng mật khẩu, hệ thống mở khóa cho phép chọn **Khối** (10, 11, 12) và **Lớp** chủ nhiệm (ví dụ `10A1`).
  - Bấm **"Vào Thống Kê Lớp"**: Hệ thống hiển thị bảng điều khiển riêng cho lớp đó (sĩ số, đã nộp, chưa nộp, danh sách học sinh, chi tiết sách thiếu).
  - Có nút **"📋 Sao chép gửi Zalo lớp"**: Tự động copy danh sách các em chưa nộp để dán thẳng vào nhóm Zalo lớp nhắc nhở.
  - Có nút **"📥 Xuất File Excel Lớp"**: Tải về bảng thống kê riêng của lớp chuẩn UTF-8 có dấu.

### 3. Đồng bộ thời gian thực (Real-time Sync)
- Nút **"🔄 Làm mới"**: Bấm vào để lập tức tải dữ liệu mới nhất từ Google Sheets về màn hình.
- Hệ thống tự động thăm dò cập nhật định kỳ mỗi **30 giây** khi thầy cô mở màn hình theo dõi.


---

## 🌐 HƯỚNG DẪN TRIỂN KHAI ONLINE LÊN GITHUB PAGES & KẾT NỐI REAL-TIME GOOGLE SHEETS

### Bước 1: Lấy URL Web App từ Google Sheets
1. Trong Google Sheet của bạn (sau khi đã dán `Code.gs` và chạy `setupInitialSheets`), chọn **Triển khai (Deploy)** -> **Tùy chọn triển khai mới (New deployment)**.
2. Chọn loại: **Ứng dụng web (Web app)**.
3. Cấu hình:
   - **Thực thi dưới dạng (Execute as)**: *Tôi (địa chỉ Gmail của bạn)*
   - **Người có quyền truy cập (Who has access)**: *Bất kỳ ai (Anyone)* (Cực kỳ quan trọng để cho phép GitHub Pages gửi dữ liệu về Sheet).
4. Bấm **Triển khai (Deploy)** và sao chép đường link URL có dạng:
   `https://script.google.com/macros/s/AKfycb.../exec`

### Bước 2: Dán URL vào file `config.js`
1. Mở file `FROM-SGK/config.js` trong thư mục dự án.
2. Dán đường link URL vừa sao chép vào biến `GOOGLE_SCRIPT_WEBAPP_URL`:
   ```javascript
   const GOOGLE_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
3. *(Tùy chọn tiện ích):* Khi mở trang web trực tiếp trên trình duyệt, bạn cũng có thể bấm trực tiếp vào biểu tượng trạng thái kết nối **Google Sheet** ở góc trên màn hình để dán URL nhanh mà không cần sửa code.

### Bước 3: Đẩy mã nguồn lên GitHub (Git Push)
Chạy các lệnh sau trong terminal hoặc Command Prompt tại thư mục dự án:
```bash
git add FROM-SGK/
git commit -m "Triển khai online hệ thống khảo sát SGK và kết nối Google Sheets thời gian thực"
git push origin main
```

### Bước 4: Kích hoạt GitHub Pages trên kho GitHub
1. Mở trình duyệt, truy cập vào kho chứa GitHub của bạn: `https://github.com/lythanhluan2021-del/bieu-quyet-nss`
2. Bấm vào tab **Settings** (Cài đặt) ở góc trên bên phải.
3. Ở menu bên trái, chọn mục **Pages**.
4. Tại mục **Build and deployment** -> **Branch**:
   - Chọn nhánh: **`main`**
   - Thư mục: **`/ (root)`**
   - Bấm nút **Save** (Lưu).
5. Đợi khoảng 1 - 2 phút, GitHub sẽ hiển thị thông báo:
   *“Your site is live at https://lythanhluan2021-del.github.io/bieu-quyet-nss/”*

### Bước 5: Các đường link chính thức sử dụng
- 📱 **Link dành cho Học Sinh làm khảo sát:**
  `https://lythanhluan2021-del.github.io/bieu-quyet-nss/FROM-SGK/index.html`
  *(Học sinh mở trên điện thoại, chọn Khối, Lớp, Tên và bấm gửi kết quả -> Lưu ngay lập tức vào Google Sheets thời gian thực)*.

- 🏛️ **Link dành cho BGH & GVCN theo dõi thống kê:**
  `https://lythanhluan2021-del.github.io/bieu-quyet-nss/FROM-SGK/thongke.html`
  *(Xem báo cáo tổng hợp 25 đầu sách, bảng ma trận học sinh từng lớp, nút Làm mới dữ liệu thời gian thực, nút copy nhắc nhở Zalo, xuất file Excel)*.
