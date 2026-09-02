/**
 * GOOGLE APPS SCRIPT - HỆ THỐNG BIỂU QUYẾT & THỐNG KÊ TRỰC QUAN NGHỊ QUYẾT 2026 - 2027
 * TRƯỜNG THPT NGUYỄN SINH SẮC (SỞ GD&ĐT AN GIANG)
 */

// 1. XỬ LÝ LƯU PHIẾU BIỂU QUYẾT (POST)
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

// 2. XỬ LÝ LẤY DỮ LIỆU THỐNG KÊ TRỰC QUAN (GET)
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    var callback = e && e.parameter ? e.parameter.callback : null;

    // Danh sách 37 tiêu đề chỉ tiêu chuẩn
    var fieldMeta = [
      { id: "hs_si_so", name: "1. Duy trì sĩ số (Giảm ≤2%, bỏ học ≤1%, lưu ban <1%)", group: "a", groupName: "Chỉ tiêu Học sinh" },
      { id: "hs_tot_nghiep", name: "2. Đầu ra tốt nghiệp (100% đỗ tốt nghiệp THPT)", group: "a", groupName: "Chỉ tiêu Học sinh" },
      { id: "hs_dh_cd", name: "3. Đầu ra ĐH - CĐ (≥80% trúng tuyển ĐH, CĐ)", group: "a", groupName: "Chỉ tiêu Học sinh" },
      { id: "hs_len_lop", name: "4. Tỷ lệ lên lớp thẳng (≥99% trở lên)", group: "a", groupName: "Chỉ tiêu Học sinh" },
      { id: "hs_hoc_luc", name: "5. Kết quả học tập (Tốt ≥45.12%, Khá ≥48.47%)", group: "a", groupName: "Chỉ tiêu Học sinh" },
      { id: "hs_hanh_kiem", name: "6. Kết quả rèn luyện (Tốt ≥90.84%, Khá ≥6.64%)", group: "a", groupName: "Chỉ tiêu Học sinh" },
      { id: "hs_giai_tinh", name: "7. Phong trào mũi nhọn (≥1 giải HSG, ≥3 giải PT)", group: "a", groupName: "Chỉ tiêu Học sinh" },
      { id: "hs_bao_hiem", name: "8. Bảo hiểm & Tiện ích (100% BHYT, VNEDU, Wifi)", group: "a", groupName: "Chỉ tiêu Học sinh" },
      { id: "hs_an_ninh", name: "9. An ninh học đường (An toàn ATGT, không TNXH)", group: "a", groupName: "Chỉ tiêu Học sinh" },

      { id: "mon_toan", name: "Toán học (Yếu <2.0%, Giỏi ≥31.30%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_van", name: "Ngữ văn (Yếu <1.0%, Giỏi ≥50.31%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_ly", name: "Vật lí (Yếu <1.0%, Giỏi ≥48.01%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_hoa", name: "Hóa học (Yếu <2.0%, Giỏi ≥21.83%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_sinh", name: "Sinh học (Yếu <1.0%, Giỏi ≥40.44%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_tin", name: "Tin học (Yếu <1.0%, Giỏi ≥58.51%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_su", name: "Lịch sử (Yếu <1.0%, Giỏi ≥90.00%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_dia", name: "Địa lí (Yếu <1.0%, Giỏi ≥83.29%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_anh", name: "Ngoại ngữ - Tiếng Anh (Yếu <1.0%, Giỏi ≥27.94%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_cn", name: "Công nghệ (Yếu <1.0%, Giỏi ≥78.57%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_gdqp", name: "GDQP & AN (Yếu 0.0%, Giỏi ≥87.48%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_gdktpl", name: "GD Kinh tế & Pháp luật (Yếu <1.0%, Giỏi ≥64.95%)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_thechat", name: "GD Thể chất (100% Đạt, 0% Yếu)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_diaphuong", name: "Nội dung GD Địa phương (100% Đạt, 0% Yếu)", group: "b", groupName: "15 Bộ môn" },
      { id: "mon_hdtn", name: "Hoạt động TN - HN (100% Đạt, 0% Yếu)", group: "b", groupName: "15 Bộ môn" },

      { id: "muc_c_tn", name: "Điểm TB thi tốt nghiệp THPT so với tỉnh", group: "c", groupName: "Điểm thi & Cán bộ GV" },

      { id: "cb_thi_dua", name: "1. Danh hiệu thi đua cá nhân (100% LĐTT, ≥20% CSTĐCS)", group: "d", groupName: "Điểm thi & Cán bộ GV" },
      { id: "cb_xep_loai", name: "2. Xếp loại chất lượng viên chức (100% HTNV, ≥80% Tốt)", group: "d", groupName: "Điểm thi & Cán bộ GV" },
      { id: "cb_bgh", name: "3. Ban Giám hiệu (100% Hoàn thành tốt NV trở lên)", group: "d", groupName: "Điểm thi & Cán bộ GV" },
      { id: "cb_skkn", name: "4. Nghiên cứu KH & SKKN (≥30% GV tổ, ≥10 cấp cơ sở)", group: "d", groupName: "Điểm thi & Cán bộ GV" },
      { id: "cb_chuyen_mon", name: "5. Chuyên môn & Đổi mới (Dự giờ, CNTT, STEM, trực tuyến)", group: "d", groupName: "Điểm thi & Cán bộ GV" },

      { id: "ai_thoi_luong", name: "1. Thời lượng giáo dục AI (100% HS, ≥12 tiết/lớp/năm)", group: "e", groupName: "Giáo dục AI & Tập thể" },
      { id: "ai_tap_huan", name: "2. Tập huấn & Bồi dưỡng GV về AI (100% GV tham gia)", group: "e", groupName: "Giáo dục AI & Tập thể" },
      { id: "ai_yeu_cau", name: "3. Yêu cầu cần đạt về AI (100% HS nắm vững nền tảng, đạo đức)", group: "e", groupName: "Giáo dục AI & Tập thể" },
      { id: "ai_danh_gia", name: "4. Kiểm tra, đánh giá & Báo cáo Sở GD&ĐT (trước 15/6/2027)", group: "e", groupName: "Giáo dục AI & Tập thể" },

      { id: "tt_danh_hieu", name: "1. Danh hiệu thi đua trường (Tập thể Lao động xuất sắc)", group: "f", groupName: "Giáo dục AI & Tập thể" },
      { id: "tt_doan_the", name: "2. Xếp loại đoàn thể (Đảng bộ, Đoàn Thanh niên)", group: "f", groupName: "Giáo dục AI & Tập thể" },
      { id: "tt_do_dau", name: "3. Công tác nhân văn (Nhận đỡ đầu ≥2 học sinh khó khăn/tổ)", group: "f", groupName: "Giáo dục AI & Tập thể" }
    ];

    // Chưa có dữ liệu
    if (lastRow <= 1) {
      var emptyRes = {
        status: "success",
        totalSubmissions: 0,
        expectedTotal: 80,
        lastUpdated: Utilities.formatDate(new Date(), "GMT+7", "HH:mm:ss dd/MM/yyyy"),
        stats: fieldMeta.map(function(item) {
          return {
            id: item.id,
            name: item.name,
            group: item.group,
            groupName: item.groupName,
            agree: 0,
            disagree: 0,
            agreePercent: 0,
            disagreePercent: 0
          };
        }),
        feedbacks: []
      };
      return returnOutput(emptyRes, callback);
    }

    // Đọc tất cả các dòng dữ liệu (từ dòng 2 đến dòng cuối cùng)
    var numRows = lastRow - 1;
    var dataRange = sheet.getRange(2, 1, numRows, 38).getValues();
    
    var totalSubmissions = numRows;
    var stats = [];
    var feedbacks = [];
    var lastSubmitted = dataRange[numRows - 1][0];

    // Thống kê từng cột chỉ tiêu
    for (var i = 0; i < fieldMeta.length; i++) {
      var colIndex = i + 1; // Cột 0 là thời gian, cột 1..37 là 37 chỉ tiêu
      var agreeCount = 0;
      var disagreeCount = 0;

      for (var r = 0; r < numRows; r++) {
        var val = String(dataRange[r][colIndex]).trim().toLowerCase();
        if (val.indexOf("đồng ý") !== -1 && val.indexOf("không") === -1) {
          agreeCount++;
        } else if (val.indexOf("không") !== -1) {
          disagreeCount++;
        }
      }

      var agreePercent = totalSubmissions > 0 ? Math.round((agreeCount / totalSubmissions) * 1000) / 10 : 0;
      var disagreePercent = totalSubmissions > 0 ? Math.round((disagreeCount / totalSubmissions) * 1000) / 10 : 0;

      stats.push({
        id: fieldMeta[i].id,
        name: fieldMeta[i].name,
        group: fieldMeta[i].group,
        groupName: fieldMeta[i].groupName,
        agree: agreeCount,
        disagree: disagreeCount,
        agreePercent: agreePercent,
        disagreePercent: disagreePercent
      });
    }

    // Trích xuất các ý kiến đóng góp khác (cột 37 - index 37)
    for (var r = 0; r < numRows; r++) {
      var fb = String(dataRange[r][37]).trim();
      var time = String(dataRange[r][0]);
      if (fb && fb !== "" && fb !== "undefined" && fb !== "null") {
        feedbacks.push({
          time: time,
          content: fb
        });
      }
    }

    var result = {
      status: "success",
      totalSubmissions: totalSubmissions,
      expectedTotal: 80,
      completionRate: Math.round((totalSubmissions / 80) * 1000) / 10,
      lastSubmitted: String(lastSubmitted),
      lastUpdated: Utilities.formatDate(new Date(), "GMT+7", "HH:mm:ss dd/MM/yyyy"),
      stats: stats,
      feedbacks: feedbacks
    };

    return returnOutput(result, callback);

  } catch (err) {
    return returnOutput({
      status: "error",
      message: err.toString()
    }, callback);
  }
}

function returnOutput(data, callback) {
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + JSON.stringify(data) + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// 3. THIẾT LẬP TIÊU ĐỀ BẢNG TÍNH GOOGLE SHEET
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
