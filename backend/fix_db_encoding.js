const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'db_store.json');

if (!fs.existsSync(DB_FILE)) {
  console.log('Không tìm thấy file db_store.json');
  process.exit(1);
}

const raw = fs.readFileSync(DB_FILE, 'utf-8');

// Hàm sửa lỗi mojibake (dịch ngược chuỗi bị hỏng)
function fixMojibake(str) {
  try {
    return Buffer.from(str, 'latin1').toString('utf8');
  } catch (e) {
    return str;
  }
}

// Lặp qua toàn bộ object để sửa các value dạng chuỗi
function traverseAndFix(obj) {
  if (typeof obj === 'string') {
    // Nếu phát hiện có ký tự mojibake điển hình như 'Ã' hay 'á'
    if (obj.includes('Ã') || obj.includes('á') || obj.includes('Æ')) {
      return fixMojibake(obj);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(traverseAndFix);
  }
  if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      let newKey = key;
      if (key.includes('Ã') || key.includes('á')) {
        newKey = fixMojibake(key);
      }
      newObj[newKey] = traverseAndFix(value);
    }
    return newObj;
  }
  return obj;
}

try {
  let db = JSON.parse(raw);
  db = traverseAndFix(db);
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  console.log('Đã sửa lỗi font chữ tiếng Việt thành công trong Database!');
} catch (e) {
  console.error('Lỗi khi sửa file:', e);
}
