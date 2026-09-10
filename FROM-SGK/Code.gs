/**
 * ==============================================================================
 * HỆ THỐNG WEB FORM KHẢO SÁT THIẾU SÁCH GIÁO KHOA THPT (KHỐI 10, 11, 12)
 * Backend Google Apps Script kết nối Google Sheets
 * ==============================================================================
 */

// Tên các trang tính (Sheet tabs)
const SHEET_NAMES = {
  STUDENTS: "HocSinh",
  BOOKS: "DanhMucSach",
  RESULTS: "KetQuaKhaoSat",
  STATS: "ThongKe"
};

// Danh mục 25 đầu sách giáo khoa GDPT 2018 mặc định
const DEFAULT_BOOKS = [
  {
    "stt": 1,
    "name": "Ngữ văn 10, tập một",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 2,
    "name": "Ngữ văn 10, tập hai",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 3,
    "name": "Chuyên đề học tập Ngữ văn 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 4,
    "name": "Toán 10, tập một",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 5,
    "name": "Toán 10, tập hai",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 6,
    "name": "Chuyên đề học tập Toán 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 7,
    "name": "Tiếng Anh 10 Global Success",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 8,
    "name": "Lịch sử 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 9,
    "name": "Chuyên đề học tập Lịch sử 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 10,
    "name": "Địa lí 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 11,
    "name": "Chuyên đề học tập Địa lí 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 12,
    "name": "Giáo dục Kinh tế và Pháp luật 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 13,
    "name": "Vật lí 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 14,
    "name": "Chuyên đề học tập Vật lí 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 15,
    "name": "Hoá học 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 16,
    "name": "Chuyên đề học tập Hoá học 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 17,
    "name": "Sinh học 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 18,
    "name": "Chuyên đề học tập Sinh học 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 19,
    "name": "Công nghệ 10 (Thiết kế)",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 20,
    "name": "Chuyên đề học tập Công nghệ 10 (Thiết kế)",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 21,
    "name": "Công nghệ 10 (Trồng trọt)",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 22,
    "name": "Chuyên đề học tập Công nghệ 10 (Trồng trọt)",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 23,
    "name": "Tin học 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 24,
    "name": "Chuyên đề học tập Tin học 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 25,
    "name": "Giáo dục thể chất 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 26,
    "name": "Giáo dục Quốc phòng và An ninh 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 27,
    "name": "Hoạt động trải nghiệm, hướng nghiệp 10",
    "grade": "10",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 1,
    "name": "Ngữ văn 11, tập một",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 2,
    "name": "Ngữ văn 11, tập hai",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 3,
    "name": "Chuyên đề học tập Ngữ văn 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 4,
    "name": "Toán 11, tập một",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 5,
    "name": "Toán 11, tập hai",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 6,
    "name": "Chuyên đề học tập Toán 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 7,
    "name": "Tiếng Anh 11 Global Success",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 8,
    "name": "Lịch sử 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 9,
    "name": "Chuyên đề học tập Lịch sử 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 10,
    "name": "Địa lí 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 11,
    "name": "Chuyên đề học tập Địa lí 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 12,
    "name": "Giáo dục Kinh tế và Pháp luật 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 13,
    "name": "Vật lí 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 14,
    "name": "Chuyên đề học tập Vật lí 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 15,
    "name": "Hoá học 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 16,
    "name": "Chuyên đề học tập Hoá học 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 17,
    "name": "Sinh học 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 18,
    "name": "Chuyên đề học tập Sinh học 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 19,
    "name": "Công nghệ công nghiệp 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 20,
    "name": "Chuyên đề học tập Công nghệ công nghiệp 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 21,
    "name": "Công nghệ nông nghiệp 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 22,
    "name": "Chuyên đề học tập Công nghệ nông nghiệp 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 23,
    "name": "Tin học 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 24,
    "name": "Chuyên đề học tập Tin học 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 25,
    "name": "Giáo dục thể chất 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 26,
    "name": "Giáo dục Quốc phòng và An ninh 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 27,
    "name": "Hoạt động trải nghiệm, hướng nghiệp 11",
    "grade": "11",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 1,
    "name": "Ngữ văn 12, tập một",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 2,
    "name": "Ngữ văn 12, tập hai",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 3,
    "name": "Chuyên đề học tập Ngữ văn 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 4,
    "name": "Toán 12, tập một",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 5,
    "name": "Toán 12, tập hai",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 6,
    "name": "Chuyên đề học tập Toán 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 7,
    "name": "Tiếng Anh 12 Global Success",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 8,
    "name": "Lịch sử 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 9,
    "name": "Chuyên đề học tập Lịch sử 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 10,
    "name": "Địa lí 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 11,
    "name": "Chuyên đề học tập Địa lí 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 12,
    "name": "Giáo dục Kinh tế và Pháp luật 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 13,
    "name": "Vật lí 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 14,
    "name": "Chuyên đề học tập Vật lí 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 15,
    "name": "Hoá học 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 16,
    "name": "Chuyên đề học tập Hoá học 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 17,
    "name": "Sinh học 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 18,
    "name": "Chuyên đề học tập Sinh học 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 19,
    "name": "Công nghệ công nghiệp 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 20,
    "name": "Chuyên đề học tập Công nghệ công nghiệp 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 21,
    "name": "Công nghệ nông nghiệp 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 22,
    "name": "Chuyên đề học tập Công nghệ nông nghiệp 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 23,
    "name": "Tin học 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 24,
    "name": "Chuyên đề học tập Tin học 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 25,
    "name": "Giáo dục thể chất 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 26,
    "name": "Giáo dục Quốc phòng và An ninh 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  },
  {
    "stt": 27,
    "name": "Hoạt động trải nghiệm, hướng nghiệp 12",
    "grade": "12",
    "category": "Sách giáo khoa chính"
  }
];

/**
 * Xử lý khi truy cập đường dẫn Web App
 */
function doGet(e) {
  // 1. Hỗ trợ gọi API dạng GET nếu cần
  if (e && e.parameter && e.parameter.action === "getInitialData") {
    const data = getInitialData();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (e && e.parameter && e.parameter.action === "getDashboardData") {
    const data = getDashboardData();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (e && e.parameter && (e.parameter.action === "checkStatus" || e.parameter.action === "checkStudentSurveyStatus")) {
    const maHs = e.parameter.maHs;
    const data = checkStudentSurveyStatus(maHs);
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. Chuyển hướng đến trang Thống kê (ThongKe.html) nếu có tham số page=thongke
  if (e && e.parameter && e.parameter.page === "thongke") {
    const template = HtmlService.createTemplateFromFile("ThongKe");
    template.scriptUrl = getScriptUrl();
    return template.evaluate()
      .setTitle("Báo Cáo & Thống Kê Khảo Sát SGK - THPT Nguyễn Sinh Sắc")
      .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // 3. Khởi tạo và trả về giao diện Khảo sát học sinh mặc định (Index.html)
  const template = HtmlService.createTemplateFromFile("Index");
  template.scriptUrl = getScriptUrl();
  return template.evaluate()
    .setTitle("Khảo Sát Thiếu Sách Giáo Khoa THPT - THPT Nguyễn Sinh Sắc")
    .addMetaTag("viewport", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Lấy URL chính thức của Web App phục vụ điều hướng trang trong Apps Script
 */
function getScriptUrl() {
  try {
    return ScriptApp.getService().getUrl();
  } catch (err) {
    return "";
  }
}

/**
 * Lấy toàn bộ dữ liệu thống kê tổng hợp thời gian thực cho Dashboard BGH & GVCN
 */
function getDashboardData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const resSheet = ss.getSheetByName(SHEET_NAMES.RESULTS);
  const surveys = {};

  if (resSheet && resSheet.getLastRow() > 1) {
    const values = resSheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const maHs = String(row[1] || "").trim();
      if (!maHs) continue;

      const missingCount = Number(row[6]) || 0;
      const missingStr = String(row[7] || "");
      let missingBooksList = [];
      if (missingStr && !missingStr.includes("Đã có đủ")) {
        missingBooksList = missingStr.split(";").map(s => s.trim()).filter(s => s.length > 0);
      }

      let timeStr = "";
      if (row[0]) {
        try {
          timeStr = Utilities.formatDate(new Date(row[0]), "GMT+7", "HH:mm dd/MM/yyyy");
        } catch (err) {
          timeStr = String(row[0]);
        }
      }

      // Lưu bản ghi mới nhất của học sinh
      surveys[maHs] = {
        maHs: maHs,
        hoTen: String(row[2] || "").trim(),
        lop: String(row[3] || "").trim(),
        khoi: String(row[4] || "").trim(),
        sdt: String(row[5] || "").trim(),
        missingCount: missingCount,
        missingBooks: missingBooksList,
        submittedAt: timeStr,
        notes: String(row[10] || "")
      };
    }
  }

  return {
    success: true,
    surveys: surveys,
    totalSurveys: Object.keys(surveys).length,
    timestamp: Utilities.formatDate(new Date(), "GMT+7", "HH:mm:ss dd/MM/yyyy")
  };
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    if (postData.action === "submitSurvey") {
      const result = submitSurvey(postData.data);
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    if (postData.action === "checkStatus" || postData.action === "checkStudentSurveyStatus") {
      const result = checkStudentSurveyStatus(postData.maHs || (postData.data && postData.data.maHs));
      return ContentService.createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Action không hợp lệ" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Lấy dữ liệu khởi tạo cho Web Form:
 * - Danh sách sách giáo khoa
 * - Danh sách khối, lớp và danh sách học sinh
 */
function getInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Lấy danh mục sách
  let books = [];
  const bookSheet = ss.getSheetByName(SHEET_NAMES.BOOKS);
  if (bookSheet && bookSheet.getLastRow() > 1) {
    const bookValues = bookSheet.getDataRange().getValues();
    for (let i = 1; i < bookValues.length; i++) {
      if (bookValues[i][0]) {
        books.push({
          id: String(bookValues[i][0]).trim(),
          name: String(bookValues[i][1]).trim(),
          category: bookValues[i][2] ? String(bookValues[i][2]).trim() : "Khác",
          grade: bookValues[i][3] ? String(bookValues[i][3]).trim() : "10,11,12"
        });
      }
    }
  }
  if (books.length === 0) {
    books = DEFAULT_BOOKS;
  }

  // 2. Lấy danh sách học sinh
  const studentSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  const students = [];
  const classList = new Set();
  const gradeList = new Set(["10", "11", "12"]);

  if (studentSheet && studentSheet.getLastRow() > 1) {
    const studentValues = studentSheet.getDataRange().getValues();
    const header = studentValues[0].map(h => String(h).toLowerCase().trim());

    // Tự động nhận diện cột dựa trên tên tiêu đề
    let maHsCol = header.findIndex(h => h.includes("mahs") || h.includes("định danh") || h.includes("dinh danh") || h.includes("mã hs") || h.includes("so dinh danh"));
    let hoTenCol = header.findIndex(h => h.includes("hoten") || h.includes("họ tên") || h.includes("họ và tên") || h.includes("ho ten"));
    let lopCol = header.findIndex(h => h.includes("lop") || h.includes("lớp"));
    let khoiCol = header.findIndex(h => h.includes("khoi") || h.includes("khối"));
    let ngaySinhCol = header.findIndex(h => h.includes("ngaysinh") || h.includes("ngày sinh"));

    // Fallback mặc định
    if (maHsCol === -1) maHsCol = 0;
    if (hoTenCol === -1) hoTenCol = 1;
    if (lopCol === -1) lopCol = 2;
    if (khoiCol === -1) khoiCol = 3;
    if (ngaySinhCol === -1) ngaySinhCol = 4;

    const classCounters = {};

    for (let i = 1; i < studentValues.length; i++) {
      const row = studentValues[i];
      const maHs = String(row[maHsCol] || "").trim();
      const hoTen = String(row[hoTenCol] || "").trim();
      const lop = String(row[lopCol] || "").trim();
      const khoiRaw = String(row[khoiCol] || "").replace(/[^0-9]/g, "").trim();
      
      let ngaySinh = "";
      if (ngaySinhCol !== -1 && row[ngaySinhCol]) {
        try {
          if (row[ngaySinhCol] instanceof Date) {
            ngaySinh = Utilities.formatDate(row[ngaySinhCol], "GMT+7", "dd/MM/yyyy");
          } else {
            ngaySinh = String(row[ngaySinhCol]).trim();
          }
        } catch (e) {
          ngaySinh = String(row[ngaySinhCol]);
        }
      }

      if (hoTen && lop) {
        let actualKhoi = khoiRaw;
        if (!actualKhoi) {
          const match = lop.match(/^(10|11|12)/);
          actualKhoi = match ? match[1] : "10";
        }
        classList.add(lop);
        gradeList.add(actualKhoi);

        classCounters[lop] = (classCounters[lop] || 0) + 1;
        const sttInClass = classCounters[lop];

        students.push({
          stt: sttInClass,
          maHs: maHs || ("HS" + i),
          hoTen: hoTen,
          lop: lop,
          khoi: actualKhoi,
          ngaySinh: ngaySinh
        });
      }
    }
  }

  // Sắp xếp lớp tự nhiên: 10A1, 10A2, ..., 10A9, 10A10
  const sortedClasses = Array.from(classList).sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
  });

  // Giữ nguyên thứ tự STT chuẩn theo sổ điểm/danh sách trường gửi cho từng lớp
  students.sort((a, b) => {
    if (a.lop !== b.lop) {
      return a.lop.localeCompare(b.lop, undefined, { numeric: true });
    }
    return a.stt - b.stt;
  });

  return {
    success: true,
    books: books,
    grades: Array.from(gradeList).sort(),
    classes: sortedClasses,
    students: students
  };
}

/**
 * Kiểm tra xem học sinh đã từng gửi khảo sát chưa
 */
function checkStudentSurveyStatus(maHs) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const resSheet = ss.getSheetByName(SHEET_NAMES.RESULTS);
  if (!resSheet || resSheet.getLastRow() <= 1) {
    return { surveyed: false };
  }

  const values = resSheet.getDataRange().getValues();
  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][1]).trim().toUpperCase() === String(maHs).trim().toUpperCase()) {
      const missingStr = String(values[i][7] || "");
      let prevList = [];
      if (missingStr && !missingStr.includes("Đã có đủ")) {
        prevList = missingStr.split(";").map(s => s.trim()).filter(s => s.length > 0);
      }
      return {
        surveyed: true,
        lastSubmitted: values[i][0] ? Utilities.formatDate(new Date(values[i][0]), "GMT+7", "HH:mm dd/MM/yyyy") : "",
        missingCount: values[i][6] || 0,
        missingBooks: values[i][7] || "",
        previousBooksList: prevList,
        phone: values[i][5] || "",
        notes: values[i][10] || values[i][8] || ""
      };
    }
  }
  return { surveyed: false };
}

/**
 * Ghi nhận kết quả khảo sát của học sinh vào Google Sheet
 */
function submitSurvey(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let resSheet = ss.getSheetByName(SHEET_NAMES.RESULTS);
  
  if (!resSheet) {
    setupInitialSheets();
    resSheet = ss.getSheetByName(SHEET_NAMES.RESULTS);
  }

  const timestamp = new Date();

  // Kiểm tra xem đã có bản ghi trước của học sinh này chưa (để cập nhật đè)
  const values = resSheet.getDataRange().getValues();
  let existingRowIndex = -1;

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][1]).trim().toUpperCase() === String(data.maHs).trim().toUpperCase()) {
      existingRowIndex = i + 1;
      break;
    }
  }

  // Danh sách sách thiếu từ request
  let missingList = [];
  if (Array.isArray(data.missingBooks)) {
    missingList = data.missingBooks;
  } else if (Array.isArray(data.missingBookIds)) {
    missingList = data.missingBookIds;
  }

  const missingSGK = missingList.filter(b => !String(b).toLowerCase().includes("chuyên đề"));
  const missingCD = missingList.filter(b => String(b).toLowerCase().includes("chuyên đề"));
  const missingCount = missingList.length;

  const rowData = [
    timestamp,
    data.maHs,
    data.hoTen,
    data.lop,
    data.khoi,
    data.sdt || "",
    missingCount,
    missingCount === 0 ? "Đã có đủ 100% sách" : missingList.join("; "),
    missingSGK.length === 0 ? "Đủ" : missingSGK.join("; "),
    missingCD.length === 0 ? "Đủ" : missingCD.join("; "),
    data.ghiChu || ""
  ];

  if (existingRowIndex > 0) {
    // Cập nhật đè lên dòng đã có
    resSheet.getRange(existingRowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    // Thêm dòng mới
    resSheet.appendRow(rowData);
  }

  // Cập nhật trạng thái trong Sheet HocSinh
  updateStudentStatus_(data.maHs, "Đã khảo sát");

  const isUpdate = existingRowIndex > 0;
  return {
    success: true,
    isUpdate: isUpdate,
    message: isUpdate 
      ? "Cập nhật thành công! Kết quả khảo sát mới nhất của bạn đã được ghi đè trên Google Sheets."
      : "Gửi khảo sát thành công! Dữ liệu đã được lưu vào Google Sheets.",
    missingCount: missingCount,
    submittedAt: Utilities.formatDate(timestamp, "GMT+7", "HH:mm dd/MM/yyyy")
  };
}

/**
 * Cập nhật cột TrangThai trong sheet HocSinh
 */
function updateStudentStatus_(maHs, status) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const stSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  if (!stSheet || stSheet.getLastRow() <= 1) return;

  const data = stSheet.getDataRange().getValues();
  const header = data[0];
  let maHsCol = 0;
  let statusCol = -1;

  for (let j = 0; j < header.length; j++) {
    const colName = String(header[j]).toLowerCase();
    if (colName.includes("mahs") || colName.includes("định danh") || colName.includes("dinh danh") || colName.includes("mã hs")) maHsCol = j;
    if (colName.includes("trangthai") || colName.includes("trạng thái")) statusCol = j;
  }

  if (statusCol === -1) {
    statusCol = header.length;
    stSheet.getRange(1, statusCol + 1).setValue("TrangThai");
  }

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][maHsCol]).trim().toUpperCase() === String(maHs).trim().toUpperCase()) {
      stSheet.getRange(i + 1, statusCol + 1).setValue(status);
      break;
    }
  }
}

/**
 * HÀM KHỞI TẠO BẢNG TÍNH GOOGLE SHEETS TỰ ĐỘNG
 */
function setupInitialSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Tạo Sheet HocSinh nếu chưa có
  let stSheet = ss.getSheetByName(SHEET_NAMES.STUDENTS);
  if (!stSheet) {
    stSheet = ss.insertSheet(SHEET_NAMES.STUDENTS);
    stSheet.appendRow(["MaHS", "HoTen", "Lop", "Khoi", "NgaySinh", "GioiTinh", "DanToc", "TrangThai"]);
    stSheet.getRange("A1:H1").setBackground("#1e40af").setFontColor("#ffffff").setFontWeight("bold");
    stSheet.setFrozenRows(1);
  }

  // 2. Tạo Sheet DanhMucSach chứa 81 đầu sách của cả 3 khối từ DM SGK.xlsx
  let bSheet = ss.getSheetByName(SHEET_NAMES.BOOKS);
  if (!bSheet) {
    bSheet = ss.insertSheet(SHEET_NAMES.BOOKS);
    bSheet.appendRow(["STT", "Khối", "Tên Sách / Chuyên Đề", "Loại Sách"]);
    bSheet.getRange("A1:D1").setBackground("#065f46").setFontColor("#ffffff").setFontWeight("bold");
    bSheet.setFrozenRows(1);

    const rows = DEFAULT_BOOKS.map(b => [b.stt, "Khối " + b.grade, b.name, b.category]);
    bSheet.getRange(2, 1, rows.length, 4).setValues(rows);
  }

  // 3. Tạo Sheet KetQuaKhaoSat
  let rSheet = ss.getSheetByName(SHEET_NAMES.RESULTS);
  if (!rSheet) {
    rSheet = ss.insertSheet(SHEET_NAMES.RESULTS);
    const headers = [
      "Thời Gian",
      "Số Định Danh (Mã HS)",
      "Họ Và Tên",
      "Lớp",
      "Khối",
      "Số Điện Thoại",
      "Tổng Sách Thiếu",
      "Toàn Bộ Sách Thiếu",
      "Chi Tiết SGK Thiếu",
      "Chi Tiết Chuyên Đề Thiếu",
      "Ghi Chú"
    ];
    rSheet.appendRow(headers);
    rSheet.getRange(1, 1, 1, headers.length).setBackground("#1f2937").setFontColor("#ffffff").setFontWeight("bold");
    rSheet.setFrozenRows(1);
  }

  // 4. Tạo Sheet ThongKe (Dashboard tổng hợp theo từng đầu sách của 3 khối)
  let sSheet = ss.getSheetByName(SHEET_NAMES.STATS);
  if (!sSheet) {
    sSheet = ss.insertSheet(SHEET_NAMES.STATS);
    sSheet.appendRow(["STT", "Khối", "Tên Sách / Chuyên Đề Giáo Khoa", "Loại", "Số Lượng HS Báo Thiếu", "Tỉ Lệ Thiếu (%)"]);
    sSheet.getRange("A1:F1").setBackground("#374151").setFontColor("#ffffff").setFontWeight("bold");
    sSheet.setFrozenRows(1);

    const statRows = [];
    for (let i = 0; i < DEFAULT_BOOKS.length; i++) {
      const b = DEFAULT_BOOKS[i];
      const rowNum = i + 2;
      // Công thức đếm tìm tên sách trong cột H (Toàn Bộ Sách Thiếu) của sheet KetQuaKhaoSat
      const formulaCount = `=COUNTIF(${SHEET_NAMES.RESULTS}!H:H, "*" & C${rowNum} & "*")`;
      const formulaPercent = `=IF(COUNTA(${SHEET_NAMES.RESULTS}!B$2:B)>0, E${rowNum}/COUNTA(${SHEET_NAMES.RESULTS}!B$2:B), 0)`;
      statRows.push([b.stt, "Khối " + b.grade, b.name, b.category, formulaCount, formulaPercent]);
    }
    sSheet.getRange(2, 1, statRows.length, 6).setValues(statRows);
    sSheet.getRange(`F2:F${statRows.length + 1}`).setNumberFormat("0.0%");
  }

  return "Khởi tạo bảng tính Google Sheets thành công!";
}

function getColumnLetter_(colNum) {
  let letter = "";
  while (colNum > 0) {
    let rem = (colNum - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    colNum = Math.floor((colNum - 1) / 26);
  }
  return letter;
}

