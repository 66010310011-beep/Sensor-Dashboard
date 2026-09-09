const SPREADSHEET_ID = '1yDm2wWPT9PqG6p1KkWEML54Yv-erxtPE-MDePwAezss';
const SHEET_NAME = 'Data';

// อุณหภูมิที่ถือว่าสูงเกินกำหนด
const TEMP_LIMIT = 35;


// เปิดหน้าเว็บ
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('Sensor Dashboard');
}


// บันทึกข้อมูล
function saveData(data) {

  // Honeypot
  // ถ้ามีข้อมูลในช่องนี้ ให้ถือว่าเป็น bot
  if (data.website && data.website.trim() !== '') {
    throw new Error('Spam detected');
  }

  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName(SHEET_NAME);

  const userEmail = Session
    .getActiveUser()
    .getEmail();

  const now = new Date();

  sheet.appendRow([
    now,
    now,
    Number(data.temperature),
    Number(data.humidity),
    userEmail || 'Unknown'
  ]);

  return {
    success: true,
    message: 'บันทึกข้อมูลเรียบร้อย'
  };
}


// อ่านข้อมูลจาก Google Sheets
function getData() {

  const sheet = SpreadsheetApp
    .openById(SPREADSHEET_ID)
    .getSheetByName(SHEET_NAME);

  const values = sheet.getDataRange().getValues();

  if (values.length <= 1) {
    return [];
  }

  return values.slice(1).map(row => {

    return {
      date: formatDate(row[0]),
      time: formatTime(row[1]),
      temperature: Number(row[2]),
      humidity: Number(row[3]),
      user: row[4]
    };

  }).reverse();
}


// Format วันที่
function formatDate(date) {

  return Utilities.formatDate(
    new Date(date),
    Session.getScriptTimeZone(),
    'dd/MM/yyyy'
  );

}


// Format เวลา
function formatTime(date) {

  return Utilities.formatDate(
    new Date(date),
    Session.getScriptTimeZone(),
    'HH:mm:ss'
  );

}


// คืนค่าอุณหภูมิสูงสุดที่กำหนด
function getTempLimit() {
  return TEMP_LIMIT;
}


// ข้อมูลผู้ใช้งาน
function getUserInfo() {

  const email = Session
    .getActiveUser()
    .getEmail();

  return {
    email: email || 'ไม่สามารถอ่าน Email ได้'
  };

}
