/**
 * ==============================================================================
 * HỆ THỐNG KHẢO SÁT & BÁO CÁO THIẾU SÁCH GIÁO KHOA THPT
 * Cấu hình kết nối Google Apps Script Web App & Google Sheets
 * ==============================================================================
 * HƯỚNG DẪN CẤU HÌNH:
 * 1. Mở Google Sheet -> Tiện ích mở rộng -> Apps Script -> Triển khai (Deploy)
 * 2. Chọn "Tùy chọn triển khai mới" -> Chọn "Ứng dụng web" (Web app)
 * 3. Quyền truy cập: "Bất kỳ ai" (Anyone) -> Triển khai -> Sao chép URL Web App.
 * 4. Dán URL nhận được vào biến GOOGLE_SCRIPT_WEBAPP_URL bên dưới:
 *    Ví dụ: const GOOGLE_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycb.../exec";
 */

const GOOGLE_SCRIPT_WEBAPP_URL = "";

// Gán vào window để các trang Index.html và ThongKe.html đọc tự động
if (typeof window !== "undefined") {
  window.GOOGLE_SCRIPT_WEBAPP_URL = GOOGLE_SCRIPT_WEBAPP_URL;
}
