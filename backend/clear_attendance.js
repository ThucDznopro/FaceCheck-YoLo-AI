const { Attendance } = require('./src/models.js');

async function run() {
  await Attendance.destroy({ where: {} });
  console.log('Cleared Attendance');
}
run();
