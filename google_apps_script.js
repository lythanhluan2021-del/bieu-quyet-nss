/**
 * GOOGLE APPS SCRIPT - HỆ THỐNG BIỂU QUYẾT & THỐNG KÊ TRỰC QUAN NGHỊ QUYẾT 2026 - 2027
 * TRƯỜNG THPT NGUYỄN SINH SẮC (SỞ GD&ĐT AN GIANG)
 *
 * TẬP HỢP TẤT CẢ CÁC TÍNH NĂNG:
 * 1. doPost(e) : Nhận phiếu biểu quyết từ Web Form lưu vào Google Sheet.
 * 2. doGet(e)  : Cung cấp API JSON/JSONP cho Web Dashboard.
 * 3. onOpen()  : Tự động tạo Menu "📊 THỐNG KÊ NGHỊ QUYẾT" trên thanh công cụ Google Sheets.
 * 4. taoSheetThongKeVaBieuDo() : Tạo Sheet Thống Kê & Biểu Đồ Tròn tự động 100%.
 */

// =========================================================================
// 1. TỰ ĐỘNG TẠO MENU TRÊN GOOGLE SHEETS KHI MỞ FILE
// =========================================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📊 THỐNG KÊ NGHỊ QUYẾT")
    .addItem("📈 Tạo / Cập Nhật Sheet Thống Kê & Biểu Đồ", "taoSheetThongKeVaBieuDo")
    .addToUi();
}

// =========================================================================
// 2. XỬ LÝ LƯU PHIẾU BIỂU QUYẾT TỪ WEB FORM (POST)
// =========================================================================
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    
    // Khởi tạo hàng tiêu đề nếu bảng tính còn trống
    if (sheet.getLastRow() === 0) {
      setupHeader(sheet);
    }
    
    // Thêm dòng kết quả biểu quyết vào Google Sheet
    sheet.appendRow([
      data.timestamp || Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss"),
      
      // Mục a: Học sinh (9 chỉ tiêu)
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
      
      // Mục d: Cán bộ, viên chức & người lao động (5 chỉ tiêu)
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
      
      // Mục f: Tập thể và các đoàn thể (3 chỉ tiêu)
      data.tt_danh_hieu || "",
      data.tt_doan_the || "",
      data.tt_do_dau || "",
      
      // Ý kiến đóng góp khác
      data.additionalFeedback || ""
    ]);
    
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

// =========================================================================
// 3. TẠO SHEET THỐNG KÊ & BIỂU ĐỒ TRỰC QUAN TRÊN GOOGLE SHEETS
// =========================================================================
function taoSheetThongKeVaBieuDo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheets()[0]; // Lấy sheet dữ liệu nộp đầu tiên
  const rawSheetName = rawSheet.getName();

  // 1. Kiểm tra hoặc tạo mới Sheet "📊 THỐNG KÊ & BIỂU ĐỒ"
  let statsSheet = ss.getSheetByName("📊 THỐNG KÊ & BIỂU ĐỒ");
  if (statsSheet) {
    ss.deleteSheet(statsSheet);
  }
  statsSheet = ss.insertSheet("📊 THỐNG KÊ & BIỂU ĐỒ");

  // 2. Danh mục 37 chỉ tiêu chuẩn
  const criteria = [
    [1, "Học sinh", "Duy trì sĩ số (Giảm ≤2%, bỏ học ≤1%, lưu ban <1%)", "B"],
    [2, "Học sinh", "Đầu ra tốt nghiệp (100% đỗ tốt nghiệp THPT)", "C"],
    [3, "Học sinh", "Đầu ra ĐH - CĐ (≥80% trúng tuyển ĐH, CĐ)", "D"],
    [4, "Học sinh", "Tỷ lệ lên lớp thẳng (≥99% trở lên)", "E"],
    [5, "Học sinh", "Kết quả học tập (Tốt ≥45.12%, Khá ≥48.47%)", "F"],
    [6, "Học sinh", "Kết quả rèn luyện (Tốt ≥90.84%, Khá ≥6.64%)", "G"],
    [7, "Học sinh", "Phong trào mũi nhọn (≥1 giải HSG, ≥3 giải PT)", "H"],
    [8, "Học sinh", "Bảo hiểm & Tiện ích (100% BHYT, VNEDU, Wifi)", "I"],
    [9, "Học sinh", "An ninh học đường (An toàn ATGT, không TNXH)", "J"],
    [10, "15 Bộ môn", "Toán học (Yếu <2.0%, Giỏi ≥31.30%)", "K"],
    [11, "15 Bộ môn", "Ngữ văn (Yếu <1.0%, Giỏi ≥50.31%)", "L"],
    [12, "15 Bộ môn", "Vật lí (Yếu <1.0%, Giỏi ≥48.01%)", "M"],
    [13, "15 Bộ môn", "Hóa học (Yếu <2.0%, Giỏi ≥21.83%)", "N"],
    [14, "15 Bộ môn", "Sinh học (Yếu <1.0%, Giỏi ≥40.44%)", "O"],
    [15, "15 Bộ môn", "Tin học (Yếu <1.0%, Giỏi ≥58.51%)", "P"],
    [16, "15 Bộ môn", "Lịch sử (Yếu <1.0%, Giỏi ≥90.00%)", "Q"],
    [17, "15 Bộ môn", "Địa lí (Yếu <1.0%, Giỏi ≥83.29%)", "R"],
    [18, "15 Bộ môn", "Ngoại ngữ - Tiếng Anh (Yếu <1.0%, Giỏi ≥27.94%)", "S"],
    [19, "15 Bộ môn", "Công nghệ (Yếu <1.0%, Giỏi ≥78.57%)", "T"],
    [20, "15 Bộ môn", "GDQP & AN (Yếu 0.0%, Giỏi ≥87.48%)", "U"],
    [21, "15 Bộ môn", "GD Kinh tế & Pháp luật (Yếu <1.0%, Giỏi ≥64.95%)", "V"],
    [22, "15 Bộ môn", "GD Thể chất (100% Đạt, 0% Yếu)", "W"],
    [23, "15 Bộ môn", "Nội dung GD Địa phương (100% Đạt, 0% Yếu)", "X"],
    [24, "15 Bộ môn", "Hoạt động TN - HN (100% Đạt, 0% Yếu)", "Y"],
    [25, "CB-GV", "Điểm TB thi tốt nghiệp THPT so với tỉnh", "Z"],
    [26, "CB-GV", "Danh hiệu thi đua cá nhân (100% LĐTT, ≥20% CSTĐCS)", "AA"],
    [27, "CB-GV", "Xếp loại chất lượng viên chức (100% HTNV, ≥80% Tốt)", "AB"],
    [28, "CB-GV", "Ban Giám hiệu (100% Hoàn thành tốt NV trở lên)", "AC"],
    [29, "CB-GV", "Nghiên cứu KH & SKKN (≥30% GV tổ, ≥10 cấp cơ sở)", "AD"],
    [30, "CB-GV", "Chuyên môn & Đổi mới (Dự giờ, CNTT, STEM, trực tuyến)", "AE"],
    [31, "AI & TT", "Thời lượng giáo dục AI (100% HS, ≥12 tiết/lớp/năm)", "AF"],
    [32, "AI & TT", "Tập huấn & Bồi dưỡng GV về AI (100% GV tham gia)", "AG"],
    [33, "AI & TT", "Yêu cầu cần đạt về AI (100% HS nền tảng, đạo đức)", "AH"],
    [34, "AI & TT", "Kiểm tra, đánh giá & Báo cáo Sở GD&ĐT", "AI"],
    [35, "AI & TT", "Danh hiệu thi đua trường (Tập thể LĐXS)", "AJ"],
    [36, "AI & TT", "Xếp loại đoàn thể (Đảng bộ, Đoàn Thanh niên)", "AK"],
    [37, "AI & TT", "Công tác nhân văn (Đỡ đầu ≥2 học sinh khó khăn/tổ)", "AL"]
  ];

  // 3. Tiêu đề lớn
  statsSheet.getRange("A1:G1").merge()
    .setValue("BẢNG TỔNG HỢP & THỐNG KÊ KẾT QUẢ BIỂU QUYẾT NGHỊ QUYẾT NĂM HỌC 2026 - 2027")
    .setBackground("#1e3a8a").setFontColor("#ffffff").setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center").setVerticalAlignment("middle");
  statsSheet.setRowHeight(1, 40);

  // 4. Thẻ tóm tắt tổng số phiếu
  statsSheet.getRange("A2:B2").merge().setValue("Tổng Số Phiếu Đã Thu:").setFontWeight("bold").setBackground("#f1f5f9");
  statsSheet.getRange("C2").setFormula(`=COUNTA('${rawSheetName}'!A2:A)`).setFontWeight("bold").setFontColor("#1e40af").setHorizontalAlignment("center").setFontSize(12);

  statsSheet.getRange("D2:E2").merge().setValue("Tỷ Lệ Tán Thành Chung:").setFontWeight("bold").setBackground("#f1f5f9");
  statsSheet.getRange("F2").setFormula(`=AVERAGE(F4:F40)`).setNumberFormat("0.0%").setFontWeight("bold").setFontColor("#059669").setHorizontalAlignment("center").setFontSize(12);

  // 5. Tiêu đề các cột
  const headers = ["STT", "Nhóm Chỉ Tiêu", "Nội Dung Chỉ Tiêu Nghị Quyết", "Phiếu Đồng Ý", "Không Đồng Ý", "% Đồng Ý", "Thanh Trực Quan"];
  statsSheet.getRange("A3:G3").setValues([headers])
    .setBackground("#334155").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");
  statsSheet.setRowHeight(3, 30);

  // 6. Điền dữ liệu & Công thức tự động đếm
  const dataRows = [];
  for (let i = 0; i < criteria.length; i++) {
    const rNum = i + 4;
    const item = criteria[i];
    const colLetter = item[3];
    
    const fAgree = `=COUNTIF('${rawSheetName}'!${colLetter}2:${colLetter}, "*đồng ý*") - COUNTIF('${rawSheetName}'!${colLetter}2:${colLetter}, "*không*")`;
    const fDisagree = `=COUNTIF('${rawSheetName}'!${colLetter}2:${colLetter}, "*không*")`;
    const fPercent = `=IF($C$2>0, D${rNum}/$C$2, 0)`;
    const fSparkline = `=SPARKLINE(F${rNum}, {"charttype","bar"; "max",1; "color1","#059669"})`;

    dataRows.push([item[0], item[1], item[2], fAgree, fDisagree, fPercent, fSparkline]);
  }

  statsSheet.getRange("A4:G40").setValues(dataRows);

  // Định dạng hiển thị % và căn chỉnh
  statsSheet.getRange("A4:A40").setHorizontalAlignment("center").setFontWeight("bold");
  statsSheet.getRange("B4:B40").setHorizontalAlignment("center");
  statsSheet.getRange("D4:E40").setHorizontalAlignment("center").setFontWeight("bold");
  statsSheet.getRange("F4:F40").setNumberFormat("0.0%").setHorizontalAlignment("center").setFontWeight("bold").setFontColor("#059669");

  // Độ rộng các cột
  statsSheet.setColumnWidth(1, 50);
  statsSheet.setColumnWidth(2, 110);
  statsSheet.setColumnWidth(3, 380);
  statsSheet.setColumnWidth(4, 110);
  statsSheet.setColumnWidth(5, 110);
  statsSheet.setColumnWidth(6, 90);
  statsSheet.setColumnWidth(7, 140);

  // 7. Bảng phụ tạo Biểu Đồ Tròn (Pie Chart) ở Cột I, J
  statsSheet.getRange("I2").setValue("Tán thành");
  statsSheet.getRange("J2").setFormula("=F2");
  statsSheet.getRange("I3").setValue("Không tán thành");
  statsSheet.getRange("J3").setFormula("=1-F2");

  const chartBuilder = statsSheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(statsSheet.getRange("I2:J3"))
    .setPosition(2, 9, 0, 0)
    .setOption('title', 'TỶ LỆ TÁN THÀNH BÌNH QUÂN')
    .setOption('pieHole', 0.45)
    .setOption('colors', ['#059669', '#dc2626'])
    .setOption('width', 460)
    .setOption('height', 280)
    .build();
  statsSheet.insertChart(chartBuilder);

  SpreadsheetApp.getUi().alert("🎉 Đã tạo thành công Sheet '📊 THỐNG KÊ & BIỂU ĐỒ' với công thức tự động 100%!");
}

// =========================================================================
// 4. THIẾT LẬP TIÊU ĐỀ HÀNG ĐẦU TIÊN CỦA BẢNG TÍNH GOOGLE SHEET
// =========================================================================
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
