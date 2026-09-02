/**
 * GOOGLE APPS SCRIPT - BẢNG TỔNG HỢP BIỂU QUYẾT CÁC CHỈ TIÊU NGHỊ QUYẾT 2026 - 2027 (ẨN DANH)
 * TRƯỜNG THPT NGUYỄN SINH SẮC (SỞ GD&ĐT AN GIANG)
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Khởi tạo hàng tiêu đề nếu bảng tính còn trống
    if (sheet.getLastRow() === 0) {
      setupHeader(sheet);
    }
    
    // Thêm dòng kết quả biểu quyết vào Google Sheet
    sheet.appendRow([
      data.timestamp || Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss"),
      
      // Mục a: Học sinh
      data.hs_si_so || "",
      data.hs_tot_nghiep || "",
      data.hs_dh_cd || "",
      data.hs_len_lop || "",
      data.hs_hoc_luc || "",
      data.hs_hanh_kiem || "",
      data.hs_giai_tinh || "",
      data.hs_bao_hiem || "",
      data.hs_an_ninh || "",
      
      // Mục b: 15 Bộ môn
      data.mon_toan || "",
      data.mon_van || "",
      data.mon_ly || "",
      data.mon_hoa || "",
      data.mon_sinh || "",
      data.mon_tin || "",
      data.mon_su || "",
      data.mon_dia || "",
      data.mon_anh || "",
      data.mon_cn || "",
      data.mon_gdqp || "",
      data.mon_gdktpl || "",
      data.mon_thechat || "",
      data.mon_diaphuong || "",
      data.mon_hdtn || "",
      
      // Mục c: Điểm thi tốt nghiệp THPT
      data.muc_c_tn || "",
      
      // Mục d: Cán bộ, viên chức & người lao động
      data.cb_thi_dua || "",
      data.cb_xep_loai || "",
      data.cb_bgh || "",
      data.cb_skkn || "",
      data.cb_chuyen_mon || "",
      
      // Mục e: Giáo dục Trí tuệ nhân tạo (AI) - 4 chỉ tiêu
      data.ai_thoi_luong || "",
      data.ai_tap_huan || "",
      data.ai_yeu_cau || "",
      data.ai_danh_gia || "",
      
      // Mục f: Tập thể và các đoàn thể
      data.tt_danh_hieu || "",
      data.tt_doan_the || "",
      data.tt_do_dau || "",
      
      // Ý kiến đóng góp khác
      data.additionalFeedback || ""
    ]);
    
    // Định dạng dòng vừa thêm
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 38).setVerticalAlignment("middle");
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã lưu kết quả biểu quyết thành công!"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Hệ thống Biểu Quyết Chỉ Tiêu THPT Nguyễn Sinh Sắc 2026 - 2027 đang hoạt động!");
}

function setupHeader(sheet) {
  var headers = [
    "Thời gian nộp",
    
    // Mục a: Học sinh
    "a.1: Duy trì sĩ số (Giảm ≤2%, bỏ học ≤1%, lưu ban <1%)",
    "a.2: Đầu ra tốt nghiệp (100% đỗ TN)",
    "a.3: Đầu ra ĐH-CĐ (≥80% trúng tuyển)",
    "a.4: Tỷ lệ lên lớp thẳng (≥99%)",
    "a.5: Kết quả học tập (Tốt ≥45.12%, Khá ≥48.47%)",
    "a.6: Kết quả rèn luyện (Tốt ≥90.84%, Khá ≥6.64%)",
    "a.7: Phong trào mũi nhọn (≥1 giải HSG, ≥3 giải PT)",
    "a.8: Bảo hiểm & Tiện ích (100% BHYT, VNEDU/Wifi)",
    "a.9: An ninh học đường (Không vi phạm ATGT/TNXH)",
    
    // Mục b: 15 Bộ môn
    "b.1: Môn Toán học",
    "b.2: Môn Ngữ văn",
    "b.3: Môn Vật lí",
    "b.4: Môn Hóa học",
    "b.5: Môn Sinh học",
    "b.6: Môn Tin học",
    "b.7: Môn Lịch sử",
    "b.8: Môn Địa lí",
    "b.9: Môn Ngoại ngữ (Tiếng Anh)",
    "b.10: Môn Công nghệ",
    "b.11: Môn GDQP & AN",
    "b.12: Môn GD Kinh tế & Pháp luật",
    "b.13: Môn GD Thể chất",
    "b.14: Môn Nội dung GD Địa phương",
    "b.15: Môn Hoạt động TN-HN",
    
    // Mục c: Điểm tốt nghiệp
    "c: Chỉ tiêu điểm TB thi tốt nghiệp THPT so với tỉnh",
    
    // Mục d: Cán bộ GV
    "d.1: Thi đua cá nhân (100% LĐTT, ≥20% CSTĐCS)",
    "d.2: Xếp loại viên chức (100% HTNV, ≥80% Tốt, 20% XS)",
    "d.3: Ban Giám hiệu (100% HT tốt nhiệm vụ trở lên)",
    "d.4: NCKH & SKKN (≥30% GV tổ, ≥10 cấp cơ sở)",
    "d.5: Chuyên môn & Đổi mới (Dự giờ, CNTT, STEM, NCKH, trực tuyến)",
    
    // Mục e: AI (Kế hoạch 369/KH-THPTNSS)
    "e.1: Thời lượng & Bảng khung nội dung AI (≥12 tiết/lớp/năm)",
    "e.2: Tập huấn & Bồi dưỡng GV về AI (100% GV)",
    "e.3: Đảm bảo yêu cầu cần đạt (100% HS nắm vững nền tảng, đạo đức AI)",
    "e.4: Kiểm tra, đánh giá & Báo cáo Sở GD&ĐT (Trước 15/6/2027)",
    
    // Mục f: Tập thể
    "f.1: Danh hiệu trường (Tập thể Lao động xuất sắc)",
    "f.2: Xếp loại đoàn thể (Đảng bộ, Đoàn TNCS HCM)",
    "f.3: Công tác nhân văn (Đỡ đầu ≥2 HS khó khăn/tổ)",
    
    // Ý kiến khác
    "Ý kiến đóng góp, đề xuất khác"
  ];
  
  sheet.appendRow(headers);
  
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#0e7490");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 44);
  sheet.setFrozenRows(1);
}
