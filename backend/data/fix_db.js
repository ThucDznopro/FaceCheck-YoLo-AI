const fs = require('fs');
const file = 'db_store.json';
const raw = fs.readFileSync(file, 'utf8');

function fix(str) {
  if (typeof str !== 'string') return str;
  if (!/[\xC2-\xF4]/.test(str)) return str; // quick check
  try {
    function cp1252ToByte(c) {
      const code = c.charCodeAt(0);
      if (code < 128) return code;
      const map = {
        0x20AC:0x80, 0x201A:0x82, 0x0192:0x83, 0x201E:0x84, 0x2026:0x85, 0x2020:0x86, 0x2021:0x87, 0x02C6:0x88, 0x2030:0x89, 0x0160:0x8A, 0x2039:0x8B, 0x0152:0x8C, 0x017D:0x8E, 0x2018:0x91, 0x2019:0x92, 0x201C:0x93, 0x201D:0x94, 0x2022:0x95, 0x2013:0x96, 0x2014:0x97, 0x02DC:0x98, 0x2122:0x99, 0x0161:0x9A, 0x203A:0x9B, 0x0153:0x9C, 0x017E:0x9E, 0x0178:0x9F
      };
      return map[code] || code;
    }
    const buf = Buffer.alloc(str.length);
    for(let i=0; i<str.length; i++) buf[i] = cp1252ToByte(str[i]);
    const decoded = buf.toString('utf8');
    if (decoded && decoded !== str && !decoded.includes('\uFFFD')) return decoded;
  } catch(e) {}
  return str;
}

function traverse(obj) {
  if (typeof obj === 'string') return fix(obj);
  if (Array.isArray(obj)) return obj.map(traverse);
  if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [k, v] of Object.entries(obj)) {
      newObj[fix(k)] = traverse(v);
    }
    return newObj;
  }
  return obj;
}

const data = JSON.parse(raw);
const fixed = traverse(data);
fs.writeFileSync(file, JSON.stringify(fixed, null, 2), 'utf8');
console.log('Fixed db_store.json!');

