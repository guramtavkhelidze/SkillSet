// Google Apps Script — SkillSet Academy რეგისტრაცია
// როგორ გამოვიყენო:
// 1. გახსენი script.google.com
// 2. "New project" → წაშალე ყველაფერი → ჩასვი ეს კოდი
// 3. Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 4. დააჭირე Deploy → დააკოპირე URL
// 5. index.html-ში ჩასვი URL: var SCRIPT_URL = 'შენი URL';

function doPost(e) {
  var sheet = SpreadsheetApp.openById('1fhpL9pzCfQeF8R7uCgdopZmQIoqybTDxc8ROQw7Fn4s').getActiveSheet();

  // სათაურები პირველ სტრიქონში (პირველად ერთხელ)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['თარიღი', 'სახელი და გვარი', 'ელ-ფოსტა', 'ტელეფონი']);
  }

  var name  = e.parameter.name  || '';
  var email = e.parameter.email || '';
  var phone = e.parameter.phone || '';
  var date  = new Date();

  sheet.appendRow([date, name, email, phone]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
