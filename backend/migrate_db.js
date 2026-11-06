const fs = require('fs');
const path = require('path');
const { initDB, User, Face, Attendance, ClassSize, sequelize } = require('./src/models');

const dbPath = path.join(__dirname, 'data/db_store.json');

const NON_USER_KEYS = new Set([
  'faces',
  'attendanceLog',
  'classSizes',
  'departmentsData',
  'coursesData',
  'teachersData',
  'classesData',
  'schedulesData',
]);

async function migrate() {
  await sequelize.sync({ force: true });
  console.log('Khởi tạo lại Database...');
  await initDB();
  
  if (!fs.existsSync(dbPath)) {
    console.log('Không tìm thấy db_store.json, bỏ qua migrate.');
    return;
  }

  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  // 1. Migrate Users
  let userCount = 0;
  for (const [key, value] of Object.entries(dbData)) {
    if (!NON_USER_KEYS.has(key) && key.includes('@') && value) {
      await User.create({
        email: key,
        password: value.passwordHash || value.pass || '',
        name: value.name || '',
        role: value.role || 'student'
      });
      userCount++;
    }
  }
  console.log(`Migrated ${userCount} users.`);

  // 2. Migrate Faces
  if (dbData.faces && Array.isArray(dbData.faces)) {
    for (const f of dbData.faces) {
      if (!f) continue;
      const existing = await Face.findOne({ where: { studentId: f.studentId } });
      if (!existing && f.studentId) {
        await Face.create({
          studentId: f.studentId,
          name: f.name || '',
          className: f.className || '',
          imageBase64: f.imageBase64 || '',
          descriptor: f.descriptor || null,
          registeredAt: f.registeredAt || new Date().toISOString()
        });
      }
    }
    console.log(`Migrated ${dbData.faces.length} faces.`);
  }

  // 3. Migrate Attendance
  if (dbData.attendanceLog && Array.isArray(dbData.attendanceLog)) {
    const attendanceRecords = dbData.attendanceLog.filter(a => a).map(a => ({
      studentId: a.studentId || '',
      name: a.name || '',
      className: a.className || '',
      time: a.time || '',
      date: a.date || '',
      shift: a.shift || 'Sáng'
    }));
    await Attendance.bulkCreate(attendanceRecords);
    console.log(`Migrated ${attendanceRecords.length} attendance records.`);
  }

  // 4. Migrate ClassSizes
  if (dbData.classSizes && typeof dbData.classSizes === 'object') {
    const classSizeRecords = Object.entries(dbData.classSizes).filter(([cName]) => cName).map(([cName, size]) => ({
      className: cName,
      size
    }));
    await ClassSize.bulkCreate(classSizeRecords);
    console.log(`Migrated class sizes.`);
  }

  console.log('Migrate hoàn tất!');
}

migrate();
