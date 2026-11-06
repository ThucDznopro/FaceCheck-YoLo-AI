window.apiCall = async function(url, method = 'GET', body = null) { try { const options = { method, headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('facecheck_token') } }; if (body) { options.headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(body); } const res = await fetch(url, options); return await res.json(); } catch (err) { console.error('API Error:', err); return { success: false, error: err.message }; } };


window.customAlert = function(msg) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:99999;';
  const box = document.createElement('div');
  box.style.cssText = 'background:#fff; border-radius:16px; padding:24px; width:400px; max-width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.1); text-align:center;';
  box.innerHTML = `<h3 style="margin-top:0; color:#0f172a; font-size:18px;">Thông báo</h3><p style="color:#475569; font-size:14px; margin-bottom:24px; line-height:1.5; white-space:pre-wrap;">${msg}</p><button style="background:#2563eb; color:#fff; border:none; padding:10px 24px; border-radius:8px; font-weight:600; cursor:pointer;" onclick="this.parentElement.parentElement.remove()">Đóng</button>`;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
};
window.alert = window.customAlert;
window.customConfirm = function(msg, onConfirm) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:99999;';
  const box = document.createElement('div');
  box.style.cssText = 'background:#fff; border-radius:16px; padding:24px; width:400px; max-width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.1); text-align:center;';
  
  box.innerHTML = `
    <h3 style="margin-top:0; color:#0f172a; font-size:18px;">Xác nhận</h3>
    <p style="color:#475569; font-size:14px; margin-bottom:24px; line-height:1.5; white-space:pre-wrap;">${msg}</p>
    <div style="display:flex; justify-content:center; gap:12px;">
      <button id="btnConfirmOk" style="background:#ef4444; color:#fff; border:none; padding:10px 24px; border-radius:8px; font-weight:600; cursor:pointer; transition:0.2s;">OK</button>
      <button id="btnConfirmCancel" style="background:#e2e8f0; color:#475569; border:none; padding:10px 24px; border-radius:8px; font-weight:600; cursor:pointer; transition:0.2s;">Hủy</button>
    </div>
  `;
  
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  
  document.getElementById('btnConfirmOk').onclick = () => {
    overlay.remove();
    if (onConfirm) onConfirm();
  };
  
  document.getElementById('btnConfirmCancel').onclick = () => {
    overlay.remove();
  };
};


window.renderCameraOverlayHUD = function(studentId, studentName, pillText, pillColor, studentDetails = {}) {
  const overlay = document.getElementById('cameraScanOverlayHUD');
  const idEl = document.getElementById('hudStudentId');
  const nameEl = document.getElementById('hudStudentName');
  const detailsEl = document.getElementById('hudStudentDetails');
  const pillEl = document.getElementById('hudStatusPill');
  
  if(overlay) overlay.style.display = 'flex';
  if(idEl) idEl.innerText = studentId;
  if(nameEl) nameEl.innerText = studentName;
  if(detailsEl) {
    const className = studentDetails.class || studentDetails.className || 'Chưa có lớp';
    const department = studentDetails.department || studentDetails.major || 'Chưa có khoa/ngành';
    detailsEl.innerText = `Lớp: ${className} · Khoa/Ngành: ${department}`;
  }
  
  if(pillEl) {
    pillEl.innerText = pillText;
    if(pillColor === 'green') {
      pillEl.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      overlay.style.borderColor = '#10b981';
    } else if(pillColor === 'orange') {
      pillEl.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      overlay.style.borderColor = '#f59e0b';
    } else {
      pillEl.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      overlay.style.borderColor = '#ef4444';
    }
  }
};


window.customConfirm = function(msg) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:99999;';
    const box = document.createElement('div');
    box.style.cssText = 'background:#fff; border-radius:16px; padding:24px; width:400px; max-width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.1); text-align:center;';
    
    const title = document.createElement('h3');
    title.style.cssText = 'margin-top:0; color:#0f172a; font-size:18px;';
    title.innerText = 'Xác nhận';
    
    const text = document.createElement('p');
    text.style.cssText = 'color:#475569; font-size:14px; margin-bottom:24px; line-height:1.5;';
    text.innerText = msg;
    
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'display:flex; justify-content:center; gap:12px;';
    
    const btnCancel = document.createElement('button');
    btnCancel.style.cssText = 'background:#f1f5f9; color:#475569; border:none; padding:10px 24px; border-radius:8px; font-weight:600; cursor:pointer;';
    btnCancel.innerText = 'Hủy';
    btnCancel.onclick = () => { overlay.remove(); resolve(false); };
    
    const btnOk = document.createElement('button');
    btnOk.style.cssText = 'background:#ef4444; color:#fff; border:none; padding:10px 24px; border-radius:8px; font-weight:600; cursor:pointer;';
    btnOk.innerText = 'OK';
    btnOk.onclick = () => { overlay.remove(); resolve(true); };
    
    btnContainer.appendChild(btnCancel);
    btnContainer.appendChild(btnOk);
    box.appendChild(title);
    box.appendChild(text);
    box.appendChild(btnContainer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  });
};

// State management
let currentRole = 'leader';
let activeTrainingTab = 'khoa';

// ----------------------------------------------------
// 1. DYNAMIC REAL-TIME CLOCK FOR TOP RIGHT HEADER
// ----------------------------------------------------
function updateLiveHeaderDateTime() {
  const el = document.getElementById('topDateBadgeText');
  if (!el) return;

  const now = new Date();
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = daysOfWeek[now.getDay()];

  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();

  const hrs = now.getHours();
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');

  let session = 'Buổi Sáng';
  if (hrs >= 12 && hrs < 18) session = 'Buổi Chiều';
  else if (hrs >= 18) session = 'Buổi Tối';

  el.innerText = `${dayName}, ${dd}/${mm}/${yyyy} · ${session} (${String(hrs).padStart(2, '0')}:${mins}:${secs})`;
}

// Start live clock ticker
setInterval(updateLiveHeaderDateTime, 1000);

// Check Backend Server Status on Startup & Periodic Realtime Monitoring
let isHealthCheckRunning = false;
let backendOnlineState = null;

async function checkBackendHealth() {
  const statusBadge = document.getElementById('backendStatusBadge');
  if (!statusBadge || isHealthCheckRunning) return;

  isHealthCheckRunning = true;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch('/api/health?t=' + Date.now(), { 
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'ok') {
        const activePort = data.port || '3000';
        if (backendOnlineState !== true) {
          statusBadge.innerHTML = `<span class="pulse-dot-green"></span><span>Sever : ONLINE</span>`;
          statusBadge.style.color = '#10b981';
          statusBadge.classList.remove('offline');
          statusBadge.classList.add('online');
          backendOnlineState = true;
        }
        isHealthCheckRunning = false;
        return;
      }
    }
  } catch (e) {
    // Relative endpoint request handled cleanly
  }

  if (backendOnlineState !== false) {
    statusBadge.innerHTML = '<span class="pulse-dot-red" style="width:8px;height:8px;background:#ef4444;border-radius:50%;display:inline-block;box-shadow:0 0 10px #ef4444;animation:pulse 2s infinite;"></span><span>Sever : OFF</span>';
    statusBadge.style.color = '#ef4444';
    statusBadge.classList.remove('online');
    statusBadge.classList.add('offline');
    backendOnlineState = false;
  }

  isHealthCheckRunning = false;
}

// Check status on initial load
checkBackendHealth();

// Check periodically every 15 seconds
setInterval(checkBackendHealth, 15000);

// ----------------------------------------------------
// 2. PERSISTENT STORAGE SYSTEM (LOCALSTORAGE + BACKEND API)
// ----------------------------------------------------

function savePersistentData() {
  const payload = {
    departmentsData: typeof departmentsData !== 'undefined' ? departmentsData : [],
    coursesData: typeof coursesData !== 'undefined' ? coursesData : [],
    teachersData: typeof teachersData !== 'undefined' ? teachersData : [],
    classesList: typeof classesList !== 'undefined' ? classesList : [],
    classesData: typeof classesData !== 'undefined' ? classesData : [],
    studentsData: typeof studentsData !== 'undefined' ? studentsData : [],
    timetableData: typeof timetableData !== 'undefined' ? timetableData : {},
    academicGradesStore: typeof window.academicGradesStore !== 'undefined' ? window.academicGradesStore : {},
    academicConductStore: typeof window.academicConductStore !== 'undefined' ? window.academicConductStore : {},
    financeSentHistory: typeof financeSentHistory !== 'undefined' ? financeSentHistory : []
  };

  // 1. Save to Browser localStorage (Immediate)
  try {
    localStorage.setItem('facecheck_db_v2', JSON.stringify(payload));
  } catch (e) {
    console.error('Lỗi lưu localStorage:', e);
  }

  // 2. Save to Backend Server Disk (/api/data)
  fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(err => console.warn('Backend save error:', err));
}

function loadPersistentData() {
  // 1. First load from localStorage for zero-latency instant render
  try {
    const localData = localStorage.getItem('facecheck_db_v2');
    if (localData) {
      const parsed = JSON.parse(localData);
      if (parsed.departmentsData) departmentsData = parsed.departmentsData;
      if (parsed.coursesData) coursesData = parsed.coursesData;
      if (parsed.teachersData) teachersData = parsed.teachersData;
      if (parsed.classesList) classesList = parsed.classesList;
      if (parsed.classesData) classesData = parsed.classesData;
      if (parsed.studentsData) studentsData = parsed.studentsData;
      if (parsed.timetableData) timetableData = parsed.timetableData;
      if (parsed.academicGradesStore) window.academicGradesStore = parsed.academicGradesStore;
      if (parsed.academicConductStore) window.academicConductStore = parsed.academicConductStore;
      if (parsed.financeSentHistory) financeSentHistory = parsed.financeSentHistory;
    }
  } catch (e) {
    console.error('Lỗi đọc localStorage:', e);
  }

  // 2. Synchronize from Backend Server /api/data & SQLite Database
  fetch('/api/data')
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (data) {
        if (data.departmentsData && data.departmentsData.length > 0) departmentsData = data.departmentsData;
        if (data.coursesData && data.coursesData.length > 0) coursesData = data.coursesData;
        if (data.teachersData && data.teachersData.length > 0) teachersData = data.teachersData;
        if (data.classesList && data.classesList.length > 0) classesList = data.classesList;
        if (data.classesData && data.classesData.length > 0) classesData = data.classesData;
        if (data.studentsData && data.studentsData.length > 0) studentsData = data.studentsData;
        if (data.timetableData && Object.keys(data.timetableData).length > 0) timetableData = data.timetableData;
        if (data.academicGradesStore) window.academicGradesStore = data.academicGradesStore;
        if (data.academicConductStore) window.academicConductStore = data.academicConductStore;
        if (data.financeSentHistory) financeSentHistory = data.financeSentHistory;
        
        // Refresh active views
        if (currentRole === 'training') switchTrainingTab(activeTrainingTab);
        else if (currentRole === 'academic') switchRole('academic');
      }
    })
    .catch(err => console.warn('Backend load sync warning:', err));
}

// Hàm Xuất PDF (Kế hoạch #2)
function exportPDFLeaderReport() {
  const tableCard = document.querySelector('.dashboard-card-white');
  if (!tableCard) {
    alert('Không tìm thấy bảng dữ liệu để xuất PDF!');
    return;
  }
  
  if (typeof html2pdf !== 'undefined') {
    alert('Đang tạo báo cáo PDF. Vui lòng đợi trong giây lát...');
    const opt = {
      margin:       0.5,
      filename:     'Bao_Cao_Chuyen_Can_QCET.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(tableCard).save();
  } else {
    alert('Lỗi: Thư viện html2pdf.js chưa được tải!');
  }
}

function exportPDFAcademicReport() {
  const tableCard = document.getElementById('academicGradeTableCard');
  if (!tableCard) {
    alert('Không tìm thấy bảng điểm để xuất PDF!');
    return;
  }
  
  if (typeof html2pdf !== 'undefined') {
    alert('Đang tạo phiếu điểm PDF. Vui lòng đợi trong giây lát...');
    const opt = {
      margin:       0.5,
      filename:     'Phieu_Diem_Hanh_Kiem_QCET.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(tableCard).save();
  } else {
    alert('Lỗi: Thư viện html2pdf.js chưa được tải!');
  }
}

// Lớp học viết tắt chuẩn theo hình ảnh (Abbreviated Classes List - Image 5)

let financeSentHistory = [
  { content: 'Học phí học kỳ 1...', target: 'Toàn trường', time: '2026-08-15 08:30', statusText: 'Thành công', type: 'green' }
];

let studentsData = [];
let classesData = [];
let classesList = [
  'CĐK17 CNTT A',
  'CĐK17 ĐCN A',
  'CĐK17 ĐCN B',
  'CĐK17 ĐCN C',
  'CĐK17 CNOTO A',
  'CĐK17 CNOTO B',
  'CĐK17 CNOTO C',
  'CĐK17 CNOTO D',
  'CĐK17 CNOTO E',
  'CĐK17 HDDL A',
  'CĐK17 KTCBMA A',
  'CĐK17 QTKS A',
  'CĐK17 CĐT A',
  'CĐK17 VHSCTBL A',
  'CĐK17 VHSCTBL B',
  'CĐK17 CGKL A',
  'CĐK17 CTTBCK A',
  'CĐK17 HAN A',
  'CĐK17 ĐTCN A'
];
let currentSelectedClass = 'CĐK17 CNTT A';

// Khoa đầy đủ khớp chính xác hình 4 (Khoa List Dropdown - Image 4)
let departmentsData = [];

// Môn học khớp chính xác hình 2 & 3 (Courses List - Images 2 & 3)
let coursesData = [];

let teachersData = [];

let timetableData = {
    'CĐK17 CNTT A': {
      sang: {
        T2: { subject: 'Lập trình điện thoại nền tảng Android', teacher: 'L.B. Mẫn', room: 'B1-102', periods: 4 },
        T3: { subject: 'Anh văn chuyên ngành', teacher: 'H.Đ. Dũng', room: 'B2-201', periods: 4 },
        T4: { subject: 'Lập trình điện thoại nền tảng Android (TH)', teacher: 'L.B. Mẫn', room: 'Phòng Lab 2', periods: 4 },
        T5: { subject: 'Hệ quản trị Cơ sở dữ liệu', teacher: 'T.T. Hương', room: 'C2-205', periods: 3 },
        T6: { subject: 'Phân tích và thiết kế HTTT', teacher: 'N.T.B. Hà', room: 'C2-401', periods: 4 }
      },
      chieu: {
        T3: { subject: 'Quản trị dự án phát triển phần mềm', teacher: 'N.V. Toàn', room: 'C1-301', periods: 3 },
        T4: { subject: 'Giáo dục thể chất', teacher: 'M.T. Đông', room: 'Sân tập', periods: 3 },
        T5: { subject: 'Lập trình Web (Frontend)', teacher: 'T.Q. Bình', room: 'Phòng Lab 3', periods: 4 },
        T6: { subject: 'Thực tập cơ sở', teacher: 'T.K. Nam', room: 'Cơ sở thực tập', periods: 4 },
        T7: { subject: 'Phần mềm thiết kế đồ họa (Photoshop)', teacher: 'Bảo Châu', room: 'Phòng máy', periods: 4 }
      }
    }
  };

function saveTimetableSlot() {
  const day = document.getElementById('tkbFormDay')?.value || 'T2';
  const shift = document.getElementById('tkbFormShift')?.value || 'sang';
  const subject = document.getElementById('tkbFormSubject')?.value || '';
  const teacher = document.getElementById('tkbFormTeacher')?.value || '';
  const room = document.getElementById('tkbFormRoom')?.value || 'P.301';
  const periods = document.getElementById('tkbFormPeriods')?.value || '4';

  if (!subject || !teacher || !room) {
    window.customAlert('Vui lòng nhập đủ thông tin!');
    return;
  }

  if (!timetableData[currentSelectedClass]) {
    timetableData[currentSelectedClass] = { sang: {}, chieu: {} };
  }
  if (!timetableData[currentSelectedClass][shift]) {
    timetableData[currentSelectedClass][shift] = {};
  }

  timetableData[currentSelectedClass][shift][day] = {
    subject: subject,
    teacher: teacher,
    room: room,
    periods: periods
  };

  savePersistentData();
  refreshTimetableGrid();
  window.customAlert(`✅ Đã lưu thời khóa biểu lớp ${currentSelectedClass} (${day} - Buổi ${shift === 'sang' ? 'Sáng' : 'Chiều'} - ${periods} tiết)!`);
}

async function deleteTimetableSlot() {
  const day = document.getElementById('tkbFormDay')?.value || 'T2';
  const shift = document.getElementById('tkbFormShift')?.value || 'sang';

  if (timetableData[currentSelectedClass] && timetableData[currentSelectedClass][shift]) {
    delete timetableData[currentSelectedClass][shift][day];
    savePersistentData();
    refreshTimetableGrid();
    selectCellToEdit(day, shift);
    alert(`🗑️ Đã xóa tiết học ${day} - Buổi ${shift === 'sang' ? 'Sáng' : 'Chiều'}!`);
  }
}

window.getDeptFromClassName = function(className) {
  if (typeof classesData !== 'undefined') {
    const found = classesData.find(c => c.className === className);
    if (found && found.dept) return found.dept;
  }
  if (!className) return '';
  if (className.includes('CNTT')) return 'CNTT';
  if (className.includes('ĐCN')) return 'D';
  if (className.includes('CNOTO')) return 'CNOTO';
  if (className.includes('HDDL')) return 'DL';
  if (className.includes('TMD')) return 'TMD';
  return '';
};

window.changeSelectedClass = function(className) {
  currentSelectedClass = className;
  const gridTitle = document.getElementById('gridTitleHeader');
  if (gridTitle) gridTitle.innerText = `Thời khóa biểu — ${currentSelectedClass}`;
  refreshTimetableGrid();
  
  // Update subject dropdown
  const subjectSelect = document.getElementById('tkbFormSubject');
  if (subjectSelect && typeof coursesData !== 'undefined') {
    const classDept = window.getDeptFromClassName(className);
    let filteredCourses = coursesData;
    if (classDept) {
      filteredCourses = coursesData.filter(c => c.dept === classDept || c.dept === 'ĐC' || c.dept === 'DC');
    }
    subjectSelect.innerHTML = filteredCourses.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  }
  
  const teacherSelect = document.getElementById('tkbFormTeacher');
  if (teacherSelect && typeof teachersData !== 'undefined') {
    const classDept = window.getDeptFromClassName(className);
    let filteredTeachers = teachersData;
    if (classDept) {
      filteredTeachers = teachersData.filter(t => t.dept === classDept || t.dept === 'ĐC' || t.dept === 'DC');
    }
    teacherSelect.innerHTML = filteredTeachers.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
  }
};

window.renderClassOptionsGrouped = function(selectedClass) {
  if (typeof classesList === 'undefined') return '';
  const groups = {};
  classesList.forEach(c => {
    const dept = window.getDeptFromClassName ? window.getDeptFromClassName(c) : 'Khác';
    if (!groups[dept]) groups[dept] = [];
    groups[dept].push(c);
  });
  
  const deptNames = {
    'CNTT': 'Khoa CNTT',
    'D': 'Khoa Điện',
    'CNOTO': 'Khoa Công nghệ Ô tô',
    'DL': 'Khoa Du lịch',
    'TMD': 'Khoa Thương mại điện tử',
    'DC': 'Khoa Đại cương'
  };

  let html = '';
  for (const dept in groups) {
    const label = deptNames[dept] || `Khoa ${dept}`;
    html += `<optgroup label="${label}">`;
    html += groups[dept].map(c => `<option value="${c}" ${c === selectedClass ? 'selected' : ''}>${c}</option>`).join('');
    html += `</optgroup>`;
  }
  return html;
};

function refreshTimetableGrid() {
  const gridTitle = document.getElementById('gridTitleHeader');
  const tableBody = document.getElementById('timetableBody');
  if (gridTitle) gridTitle.innerText = `Thời khóa biểu — ${currentSelectedClass}`;

  const classData = timetableData[currentSelectedClass] || { sang: {}, chieu: {} };
  const days = ['T2', 'T3', 'T4', 'T5', 'T6'];

  let sangHtml = `<tr><td class="shift-header">Sáng</td>`;
  days.forEach(day => {
    const item = classData.sang && classData.sang[day];
    if (item) {
      const pText = item.periods ? ` (${item.periods} tiết)` : ' (3 tiết)';
              const course = coursesData.find(c => c.name === item.subject);
        const subjectCode = course ? course.code : 'N/A';
        sangHtml += `
          <td class="cell-schedule" onclick="selectCellToEdit('${day}', 'sang')">
            <div class="subject-name" style="margin-bottom:4px; line-height:1.2;">${item.subject}</div>
            <div style="font-size:11px; color:#059669; font-weight:800; background:#d1fae5; display:inline-block; padding:2px 6px; border-radius:4px; margin-bottom:6px;">Mã: ${subjectCode}</div>
            <div style="font-size:11px; color:#475569; display:flex; align-items:center; gap:4px; margin-bottom:2px;">
               <span>👨‍🏫</span> ${item.teacher}
            </div>
            <div style="font-size:11px; color:#475569; display:flex; align-items:center; gap:4px;">
               <span>🏫</span> ${item.room}${pText}
            </div>
          </td>
        `;
    } else {
      sangHtml += `<td class="cell-schedule empty-cell" onclick="selectCellToEdit('${day}', 'sang')">—</td>`;
    }
  });
  sangHtml += `</tr>`;

  let chieuHtml = `<tr><td class="shift-header">Chiều</td>`;
  days.forEach(day => {
    const item = classData.chieu && classData.chieu[day];
    if (item) {
      const pText = item.periods ? ` (${item.periods} tiết)` : ' (3 tiết)';
              const course = coursesData.find(c => c.name === item.subject);
        const subjectCode = course ? course.code : 'N/A';
        chieuHtml += `
          <td class="cell-schedule" onclick="selectCellToEdit('${day}', 'chieu')">
            <div class="subject-name" style="margin-bottom:4px; line-height:1.2;">${item.subject}</div>
            <div style="font-size:11px; color:#059669; font-weight:800; background:#d1fae5; display:inline-block; padding:2px 6px; border-radius:4px; margin-bottom:6px;">Mã: ${subjectCode}</div>
            <div style="font-size:11px; color:#475569; display:flex; align-items:center; gap:4px; margin-bottom:2px;">
               <span>👨‍🏫</span> ${item.teacher}
            </div>
            <div style="font-size:11px; color:#475569; display:flex; align-items:center; gap:4px;">
               <span>🏫</span> ${item.room}${pText}
            </div>
          </td>
        `;
    } else {
      chieuHtml += `<td class="cell-schedule empty-cell" onclick="selectCellToEdit('${day}', 'chieu')">—</td>`;
    }
  });
  chieuHtml += `</tr>`;

  if (tableBody) {
    tableBody.innerHTML = sangHtml + chieuHtml;
  }
}


function switchTrainingTab(tabId) {
    activeTrainingTab = tabId;
    document.querySelectorAll('.training-tab-btn').forEach(btn => {
        btn.style.color = '#64748b';
        btn.style.borderBottom = '2px solid transparent';
    });
    const activeBtn = document.getElementById('tab-btn-' + tabId);
    if (activeBtn) {
        activeBtn.style.color = '#14b8a6';
        activeBtn.style.borderBottom = '2px solid #14b8a6';
    }
    
    const contentPanel = document.getElementById('trainingTabContent');
    if (contentPanel) {
        if (typeof renderTrainingSubTab === 'function') {
            contentPanel.innerHTML = renderTrainingSubTab(tabId);
            if (tabId === 'tkb' && typeof refreshTimetableGrid === 'function') {
                setTimeout(refreshTimetableGrid, 50);
            }
        }
    }
}

function renderTrainingSubTab(tabName) {
  switch(tabName) {
      case 'sinhvien':
        return `
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; box-shadow:0 4px 20px -2px rgba(15,23,42,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
              <div>
                <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin-bottom:4px;">Quản lý Sinh viên</h3>
                <p style="font-size:13px; color:#64748b;">Thêm / sửa / xóa sinh viên. Sĩ số lớp tự động tính từ danh sách này.</p>
              </div>
              <button class="btn-primary-blue" onclick="openAddStudentModal()" style="background:linear-gradient(135deg, #10b981, #059669); box-shadow:0 4px 14px rgba(16,185,129,0.3);">+ Thêm Sinh viên</button>
            </div>
            <table class="custom-data-table">
              <thead>
                <tr>
                  <th style="width:60px;">STT</th>
                  <th>MÃ SV</th>
                  <th>HỌ VÀ TÊN</th>
                  <th>LỚP</th>
                  <th style="width:160px; text-align:right; white-space:nowrap;">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                ${studentsData.map((s, idx) => `
                  <tr>
                    <td style="font-weight:600;">${idx + 1}</td>
                    <td style="font-weight:800; color:#0f172a;">${s.id}</td>
                    <td style="font-weight:700; color:#334155;">${s.name}</td>
                    <td style="font-weight:700; color:#64748b;">${s.class}</td>
                    <td style="text-align:right; white-space:nowrap;">
                      <button class="btn-action-edit" onclick="openEditStudentModal('${s.id}')">Sửa</button>
                      <button class="btn-action-delete" onclick="deleteStudent('${s.id}')">Xóa</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;

    case 'tkb':
      return `
        <div style="display:grid; grid-template-columns: 360px 1fr; gap:24px; align-items:start;">
          <div class="tkb-form-card">
            <h3 class="tkb-form-title">Tạo / Chỉnh sửa thời khóa biểu</h3>
            <form onsubmit="event.preventDefault(); saveTimetableSlot();">
              <div class="form-field">
                <label>Điều hướng Lớp học</label>
                <select id="tkbFormClass" class="form-select" onchange="changeSelectedClass(this.value)">
                  ${classesList.map(c => `<option value="${c}" ${c === currentSelectedClass ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
              </div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;" class="form-field">
                <div>
                  <label>Thứ</label>
                  <select id="tkbFormDay" class="form-select">
                    <option value="T2">Thứ 2 (T2)</option>
                    <option value="T3">Thứ 3 (T3)</option>
                    <option value="T4">Thứ 4 (T4)</option>
                    <option value="T5">Thứ 5 (T5)</option>
                    <option value="T6">Thứ 6 (T6)</option>
                  </select>
                </div>
                <div>
                  <label>Buổi học</label>
                  <select id="tkbFormShift" class="form-select">
                    <option value="sang">Buổi Sáng</option>
                    <option value="chieu">Buổi Chiều</option>
                  </select>
                </div>
              </div>
              <div class="form-field">
                <label>Môn học / Mô đun</label>
                <select id="tkbFormSubject" class="form-select">
                  ${(() => {
                    const classDept = window.getDeptFromClassName ? window.getDeptFromClassName(currentSelectedClass) : '';
                    let filtered = coursesData;
                    if (classDept) {
                      filtered = coursesData.filter(c => c.dept === classDept || c.dept === 'ĐC' || c.dept === 'DC');
                    }
                    return filtered.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
                  })()}
                </select>
              </div>
              <div class="form-field">
                <label>Giảng viên phụ trách</label>
                <select id="tkbFormTeacher" class="form-select">
                  ${(() => {
                    const classDept = window.getDeptFromClassName ? window.getDeptFromClassName(currentSelectedClass) : '';
                    let filtered = teachersData;
                    if (classDept) {
                      filtered = teachersData.filter(t => t.dept === classDept || t.dept === 'ĐC' || t.dept === 'DC');
                    }
                    return filtered.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
                  })()}
                </select>
              </div>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;" class="form-field">
                <div>
                  <label>Số tiết học</label>
                  <select id="tkbFormPeriods" class="form-select">
                    <option value="1">1 tiết</option>
                    <option value="2">2 tiết</option>
                    <option value="3">3 tiết</option>
                    <option value="4" selected>4 tiết (Mặc định)</option>
                  </select>
                </div>
                <div>
                  <label>Phòng học</label>
                  <input type="text" id="tkbFormRoom" class="form-input-text" value="P.301" placeholder="P.301..." required />
                </div>
              </div>
              <div style="display:flex; gap:10px; margin-top:10px;">
                <button type="submit" class="btn-teal-save" style="flex:1;">Lưu vào thời khóa biểu</button>
                <button type="button" id="btnDeleteSlot" onclick="deleteTimetableSlot()" style="display:none; padding:12px; background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; border-radius:10px; font-weight:700; cursor:pointer;" title="Xóa tiết học này">🗑️</button>
              </div>
            </form>
          </div>
          <div class="tkb-grid-card">
            <h3 id="gridTitleHeader" class="tkb-grid-title">Thời khóa biểu — ${currentSelectedClass}</h3>
            <table class="timetable-table">
              <thead><tr><th style="width:60px;"></th><th>T2</th><th>T3</th><th>T4</th><th>T5</th><th>T6</th></tr></thead>
              <tbody id="timetableBody"></tbody>
            </table>
          </div>
        </div>
      `;
    
    case 'lophoc':
      return `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; box-shadow:0 4px 20px -2px rgba(15,23,42,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <div>
              <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin-bottom:4px;">Quản lý lớp học</h3>
              <p style="font-size:13px; color:#64748b;">Thêm / sửa / xóa lớp học theo khóa chuyên ngành.</p>
            </div>
            <button class="btn-primary-blue" onclick="openAddClassModal()" style="background:linear-gradient(135deg, #10b981, #059669); box-shadow:0 4px 14px rgba(16,185,129,0.3);">+ Thêm lớp học</button>
          </div>
          <table class="custom-data-table">
            <thead>
              <tr>
                <th style="width:60px;">STT</th>
                <th>MÃ LỚP</th>
                <th>TÊN LỚP</th>
                <th>KHOA TRỰC THUỘC</th>
                <th style="width:120px; text-align:center;">SĨ SỐ</th>
                <th style="width:200px; text-align:right;">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              ${classesList.map((c, idx) => {
                const autoSize = (typeof studentsData !== 'undefined' && studentsData) ? studentsData.filter(s => s.className === c || s.class === c).length : 0;
                const sizeLabel = `<span style='font-weight:800; color:#0f172a;'>${autoSize}</span>`;
                
                let clsCode = '';
                let clsDept = '';
                
                if (classesData) {
                  const found = classesData.find(x => x.className === c);
                  if (found) {
                    clsCode = found.code || '';
                    clsDept = found.dept || '';
                  }
                }
                
                // Fallback n?u DB chua c (classes hardcode)
                if (!clsDept) {
                  const inferredDeptCode = window.getDeptFromClassName ? window.getDeptFromClassName(c) : '';
                  if (inferredDeptCode && typeof departmentsData !== 'undefined') {
                    const d = departmentsData.find(x => x.code === inferredDeptCode);
                    clsDept = d ? d.name : inferredDeptCode;
                  }
                }
                if (!clsCode) {
                  // V d? l?p C?K17 CNTT A th m s? l c?m d?u "C?K17"
                  clsCode = c.split(' ')[0] || '';
                }
                
                return `
                <tr>
                  <td style="font-weight:600;">${idx + 1}</td>
                  <td style="font-weight:800; color:#0f172a;">${clsCode}</td>
                  <td style="font-weight:800; color:#0f172a;">${c}</td>
                  <td style="font-weight:700; color:#334155;">${clsDept}</td>
                  <td style="text-align:center;">${sizeLabel}</td>
                  <td style="text-align:right; white-space:nowrap;">
                    <button class="btn-action-edit" onclick="openEditClassModal('${c}')">Sửa</button>
                    <button class="btn-action-delete" onclick="deleteClass('${c}')">Xóa</button>
                  </td>
                </tr>
              `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;

    case 'khoa':
      return `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; box-shadow:0 4px 20px -2px rgba(15,23,42,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <div>
              <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin-bottom:4px;">Quản lý khoa</h3>
              <p style="font-size:13px; color:#64748b;">Thêm / sửa / xóa ngành (Khoa = departments).</p>
            </div>
            <button class="btn-primary-blue" onclick="openAddDepartmentModal()">+ Thêm khoa</button>
          </div>
          <table class="custom-data-table">
            <thead>
              <tr>
                <th style="width:120px;">MÃ KHOA</th>
                <th>TÊN KHOA</th>
                <th>MÔ TẢ</th>
                <th style="width:160px; text-align:right;">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              ${departmentsData.map(d => `
                <tr>
                  <td style="font-weight:800; color:#0f172a;">${d.code}</td>
                  <td style="font-weight:700; color:#0f172a;">${d.name}</td>
                  <td style="color:#64748b;">${d.desc}</td>
                  <td style="text-align:right;">
                    <button class="btn-action-edit" onclick="openEditDepartmentModal('${d.code}')">Sửa</button>
                    <button class="btn-action-delete" onclick="deleteDepartment('${d.code}')">Xóa</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

    case 'giaovien':
      return `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; box-shadow:0 4px 20px -2px rgba(15,23,42,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <div>
              <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin-bottom:4px;">Quản lý giáo viên</h3>
              <p style="font-size:13px; color:#64748b;">Thêm / sửa / xóa giảng viên và phân công môn giảng dạy.</p>
            </div>
            <button class="btn-primary-blue" onclick="openAddTeacherModal()" style="background:linear-gradient(135deg, #f59e0b, #d97706); box-shadow:0 4px 14px rgba(245,158,11,0.3);">+ Thêm giáo viên</button>
          </div>
          <table class="custom-data-table">
            <thead>
              <tr>
                <th>HỌ TÊN</th>
                <th>EMAIL</th>
                <th>KHOA</th>
                <th>MÔ N GIẢNG DẠY</th>
                <th>SĐT</th>
                <th style="width:160px; text-align:right;">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              ${teachersData.map(t => `
                <tr>
                  <td style="font-weight:700; color:#0f172a;">${t.name}</td>
                  <td style="color:#334155;">${t.email}</td>
                  <td style="font-weight:800; color:#0f172a;">${t.dept}</td>
                  <td style="color:#334155;">${t.courses}</td>
                  <td style="color:#64748b; font-family:monospace;">${t.phone}</td>
                  <td style="text-align:right;">
                    <button class="btn-action-edit" onclick="openEditTeacherModal('${t.name}')">Sửa</button>
                    <button class="btn-action-delete" onclick="deleteTeacher('${t.name}')">Xóa</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

    case 'monhoc':
      return `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:24px; box-shadow:0 4px 20px -2px rgba(15,23,42,0.05);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <div>
              <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin-bottom:4px;">Quản lý môn học</h3>
              <p style="font-size:13px; color:#64748b;">Thêm / sửa / xóa môn học, mô đun theo từng khoa.</p>
            </div>
            <button class="btn-primary-blue" onclick="openAddCourseModal()">+ Thêm môn học</button>
          </div>
          <table class="custom-data-table">
            <thead>
              <tr>
                <th style="width:140px;">MÃ MÔN</th>
                <th>TÊN MÔN</th>
                <th>KHOA</th>
                <th style="width:160px; text-align:right;">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              ${coursesData.map((c, idx) => `
                <tr>
                  <td style="font-weight:800; color:#0f172a;">${c.code}</td>
                  <td style="font-weight:700; color:#0f172a;">${c.name}</td>
                  <td style="font-weight:800; color:#0f172a;">${c.dept}</td>
                  <td style="text-align:right;">
                    <button class="btn-action-edit" onclick="openEditCourseModal('${c.code}', ${idx})">Sửa</button>
                    <button class="btn-action-delete" onclick="deleteCourse('${c.code}', ${idx})">Xóa</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

    default:
      return `<p>Tab khác</p>`;
  }
}

// ----------------------------------------------------
// 5. FINANCE & ACADEMIC FUNCTIONS
// ----------------------------------------------------

function selectNotifTag(btnEl, tagValue) {
  document.querySelectorAll('.notif-tag-btn').forEach(btn => btn.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');

  const typeSelect = document.getElementById('notifTypeSelect');
  if (typeSelect) {
    typeSelect.value = tagValue;
    updateMobilePreview();
  }
}

function updateMobilePreview() {
  const typeVal = document.getElementById('notifTypeSelect')?.value || 'Thu học phí';
  const targetVal = document.getElementById('notifTargetSelect')?.value || 'Toàn trường';
  const titleVal = document.getElementById('notifTitleInput')?.value || 'Thông báo thu học phí';

  const prevType = document.getElementById('prevType');
  const prevTarget = document.getElementById('prevTarget');
  const mobileCardLive = document.getElementById('mobileCardLive');

  if (prevType) prevType.innerText = typeVal;
  if (prevTarget) prevTarget.innerText = `${titleVal} — ${targetVal}`;

  if (mobileCardLive) {
    if (typeVal === 'Nợ học phí') {
      mobileCardLive.style.background = '#fee2e2';
      if (prevType) prevType.style.color = '#dc2626';
    } else if (typeVal === 'Nợ môn') {
      mobileCardLive.style.background = '#fef3c7';
      if (prevType) prevType.style.color = '#b45309';
    } else {
      mobileCardLive.style.background = '#dbeafe';
      if (prevType) prevType.style.color = '#1d4ed8';
    }
  }
}

function broadcastMobileNotif(event) {
  if (event) event.preventDefault();
  const typeVal = document.getElementById('notifTypeSelect')?.value || 'Thông báo';
  const titleVal = document.getElementById('notifTitleInput')?.value || '-';
  const targetVal = document.getElementById('notifTargetSelect')?.value || 'Toàn trường';
  const contentVal = document.getElementById('notifContentInput')?.value || '';

  const historyBody = document.getElementById('notifHistoryBody');
  if (historyBody) {
    historyBody.innerHTML = `
      <tr>
        <td style="font-weight:700; color:#0f172a;">${typeVal}</td>
        <td style="color:#334155; font-weight:600;">${titleVal}</td>
        <td style="color:#64748b;">${targetVal}</td>
        <td style="text-align:right;"><span class="badge-status-green">Đã gửi</span></td>
      </tr>
    ` + historyBody.innerHTML;
  }
  
  const simBody = document.getElementById('mobileSimNotifBox');
  if (simBody) {
    const timeNow = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const color = typeVal.includes('Học phí') ? '#ef4444' : '#2563eb';
    simBody.innerHTML = `
      <div style="background:#fff; border-radius:16px; padding:16px; margin-bottom:12px; box-shadow:0 4px 15px rgba(0,0,0,0.03); border-left:4px solid ${color};">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
          <span style="font-size:11px; font-weight:700; color:${color}; text-transform:uppercase;">${typeVal}</span>
          <span style="font-size:11px; color:#94a3b8; font-weight:600;">Hôm nay, ${timeNow}</span>
        </div>
        <div style="font-size:14px; font-weight:800; color:#0f172a; margin-bottom:6px;">${titleVal}</div>
        <div style="font-size:13px; color:#475569; line-height:1.5;">${contentVal}</div>
      </div>
    ` + simBody.innerHTML;
  }

  // Force switch phone to notif mode so the user sees it immediately
  if (typeof togglePhoneSimMode === 'function') {
    togglePhoneSimMode('notif');
  }

  alert(`✅ PHÁT SÓNG THÀNH CÔNG:

Đã gửi thông báo "${titleVal}" đến Mobile App của ${targetVal}!`);
}

function refreshFinanceTable() {
  const tbody = document.getElementById('financeSentBody');
  if (tbody) {
    tbody.innerHTML = financeSentHistory.map(row => `
      <tr>
        <td style="font-weight:600; color:#0f172a;">${row.content}</td>
        <td style="color:#334155;">${row.target}</td>
        <td style="color:#64748b; font-family:monospace;">${row.time}</td>
        <td><span class="${row.type === 'green' ? 'badge-status-green' : 'badge-status-amber'}">${row.statusText}</span></td>
      </tr>
    `).join('');
  }
}

window.calculateGradeRow = function(index) {
  const getVal = (id) => {
    const el = document.getElementById(id);
    if (el && el.value.trim() !== '') return parseFloat(el.value);
    return null;
  };

  const hs1 = getVal(`hs1_${index}`);
  const hs2_1 = getVal(`hs2_1_${index}`);
  const hs2_2 = getVal(`hs2_2_${index}`);
  const hs2_3 = getVal(`hs2_3_${index}`);
  const hs2_4 = getVal(`hs2_4_${index}`);
  const hs2_5 = getVal(`hs2_5_${index}`);
  const exam = getVal(`exam_${index}`);

  let sum = 0;
  let weight = 0;

  if (hs1 !== null) { sum += hs1 * 1; weight += 1; }
  if (hs2_1 !== null) { sum += hs2_1 * 2; weight += 2; }
  if (hs2_2 !== null) { sum += hs2_2 * 2; weight += 2; }
  if (hs2_3 !== null) { sum += hs2_3 * 2; weight += 2; }
  if (hs2_4 !== null) { sum += hs2_4 * 2; weight += 2; }
  if (hs2_5 !== null) { sum += hs2_5 * 2; weight += 2; }

  let dtbkt = 0;
  if (weight > 0) {
    dtbkt = Math.round((sum / weight) * 10) / 10;
  }

  const examVal = exam !== null ? exam : 0;
  let dtbMon = 0;
  if (weight > 0 || examVal > 0) {
    dtbMon = Math.round((dtbkt * 0.4 + examVal * 0.6) * 100) / 100;
  }

  const dtbktCell = document.getElementById(`dtbkt_${index}`);
  const dtbMonCell = document.getElementById(`dtbMon_${index}`);

  if (dtbktCell) dtbktCell.innerText = dtbkt.toFixed(1);
  if (dtbMonCell) dtbMonCell.innerText = dtbMon.toFixed(2);
}
// Support both window and global scope call
function calculateGradeRow(index) { window.calculateGradeRow(index); }


// ----------------------------------------------------
// LEADER ATTENDANCE OVERVIEW DATA & LOGIC
// ----------------------------------------------------

// ----------------------------------------------------
// LEADER ATTENDANCE OVERVIEW — DỮ LIỆU THẬT
// ----------------------------------------------------
//
// Quy tắc tính (theo yêu cầu nghiệp vụ):
//   • Tổng số SV      = tổng SĨ SỐ của các lớp đang lọc
//   • SV có mặt       = số lượt điểm danh thật bằng Camera AI
//   • SV vắng         = Tổng số SV − SV có mặt
//   • Tỷ lệ điểm danh = SV có mặt / Tổng số SV × 100
//
// Sĩ số mỗi lớp: ưu tiên số nhập tay (classSizes), nếu chưa nhập
// thì tự đếm số SV đã đăng ký khuôn mặt của lớp đó.
// ----------------------------------------------------

// Sĩ số nhập tay: { 'CĐK17 CNTT A': 42, ... }
let classSizesMap = {};
// Bản ghi điểm danh camera của ngày/buổi đang xem
let attendanceLogCache = [];
// Danh sách khuôn mặt đã đăng ký (để tự đếm sĩ số & suy ra lớp)
let registeredFacesCache = [];

// Đếm số SV đã đăng ký khuôn mặt thuộc 1 lớp
function countRegisteredStudentsOfClass(className) {
  return registeredFacesCache.filter(f =>
    (f.className || f.class) === className
  ).length;
}

// Sĩ số chốt của 1 lớp (nhập tay ưu tiên, không có thì tự đếm)
function getClassSize(className) {
  const manual = classSizesMap[className];
  if (manual && manual > 0) return manual;
  return countRegisteredStudentsOfClass(className);
}

// Tải toàn bộ dữ liệu thật cần cho phân hệ Lãnh đạo
async function loadLeaderRealData(dateStr, shiftStr) {
  try {
    const [sizesRes, facesRes, logRes] = await Promise.all([
      fetch('/api/class-sizes'),
      fetch('/api/faces'),
      fetch(`/api/attendance?date=${encodeURIComponent(dateStr)}`)
    ]);

    if (sizesRes.ok) classSizesMap = await sizesRes.json() || {};
    if (facesRes.ok) registeredFacesCache = await facesRes.json() || [];
    if (logRes.ok) attendanceLogCache = await logRes.json() || [];
    return true;
  } catch (e) {
    console.error('Lỗi tải dữ liệu điểm danh thật:', e);
    return false;
  }
}

// Dựng danh sách lớp đang học kèm số liệu thật 100%
function buildLeaderClassRows(deptFilter, classFilter, dateStr, shiftStr) {
  let targetClasses = classesList.slice();

  if (deptFilter && deptFilter !== 'Tất cả khoa') {
    targetClasses = targetClasses.filter(c => {
      const d = window.getDeptFromClassName ? window.getDeptFromClassName(c) : '';
      if (deptFilter.includes('CNTT') && (c.includes('CNTT') || d === 'CNTT')) return true;
      if (deptFilter.includes('Ô tô') && (c.includes('CNOTO') || d === 'CNOTO')) return true;
      if (deptFilter.includes('Điện') && (c.includes('ĐCN') || d === 'D')) return true;
      if (deptFilter.includes('Cơ khí') && (c.includes('CĐT') || d === 'CK')) return true;
      if (deptFilter.includes('Du Lịch') && (c.includes('DL') || d === 'DL')) return true;
      if (deptFilter.includes('Đại cương') && (c.includes('DC') || d === 'DC')) return true;
      return false;
    });
  }

  if (classFilter && classFilter !== 'Tất cả lớp') {
    targetClasses = targetClasses.filter(c => c === classFilter);
  }

  // Tính dayKey dựa trên ngày chọn (T2 - T7 / CN)
  let dayKey = 'T2';
  if (dateStr) {
    const d = new Date(dateStr);
    const dayIndex = d.getDay();
    dayKey = dayIndex === 0 ? 'CN' : 'T' + (dayIndex + 1);
  }
  const shiftKey = (shiftStr === 'Chiều' || shiftStr === 'chieu') ? 'chieu' : 'sang';

  const rows = targetClasses.map(className => {
    const total = getClassSize(className);

    // Số SV có mặt = số lượt điểm danh THẬT trong Database SQLite
    const present = attendanceLogCache.filter(r => r.className === className).length;

    // SV vắng = Tổng SV - SV đã điểm danh thật
    const absent = Math.max(0, total - present);

    // Tra thông tin phòng & giáo viên từ thời khóa biểu thật
    const normalizedName = className.replace('Đ', 'D');
    const tkb = timetableData[className] || timetableData[normalizedName];
    
    let room = '—';
    let teacher = '—';
    let hasSchedule = false;
    if (tkb && tkb[shiftKey] && tkb[shiftKey][dayKey]) {
      const slot = tkb[shiftKey][dayKey];
      room = slot.room || '—';
      teacher = slot.teacher || '—';
      hasSchedule = true;
    }

    return { className, total, present, absent, room, teacher, hasSchedule };
  });

  // Chỉ hiển thị lớp THỰC SỰ có lịch học hôm nay hoặc có sinh viên điểm danh thật
  const filtered = rows.filter(r => (r.hasSchedule && r.total > 0) || r.present > 0);

  // Sắp xếp giảm dần theo Tỷ lệ điểm danh: 100% ở trên cùng, 0.0% ở dưới
  filtered.sort((a, b) => {
    const rateA = a.total > 0 ? (a.present / a.total) : 0;
    const rateB = b.total > 0 ? (b.present / b.total) : 0;
    if (rateB !== rateA) return rateB - rateA;
    return b.present - a.present;
  });

  return filtered;
}

async function updateLeaderAttendanceOverview() {
  const dateInput = document.getElementById('leaderFilterDate')?.value || getTodayDateString();
  const shiftSelect = document.getElementById('leaderFilterShift')?.value || 'Sáng';
  const deptSelect = document.getElementById('leaderFilterDept')?.value || 'Tất cả khoa';
  const classSelect = document.getElementById('leaderFilterClass')?.value || 'Tất cả lớp';

  // Format date display (e.g. 20/07/2026)
  const dateParts = dateInput.split('-');
  const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : dateInput;

  // Nạp dữ liệu thật từ server
  await loadLeaderRealData(dateInput, shiftSelect);

  const rows = buildLeaderClassRows(deptSelect, classSelect, dateInput, shiftSelect);

  // ---- Tính KPI theo đúng công thức nghiệp vụ ----
  const totalClasses = rows.length;
  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);   // Tổng sĩ số các lớp
  const totalPresent = rows.reduce((sum, r) => sum + r.present, 0); // Đã điểm danh camera
  const totalAbsent = Math.max(0, grandTotal - totalPresent);       // Vắng = Tổng - Có mặt
  const attendanceRate = grandTotal > 0 ? ((totalPresent / grandTotal) * 100).toFixed(1) : '0.0';

  // Update KPI Cards
  const kpiTotalClasses = document.getElementById('kpiTotalClasses');
  const kpiPresentCount = document.getElementById('kpiPresentCount');
  const kpiAbsentCount = document.getElementById('kpiAbsentCount');
  const kpiAttendanceRate = document.getElementById('kpiAttendanceRate');

  if (kpiTotalClasses) kpiTotalClasses.innerText = totalClasses;
  if (kpiPresentCount) kpiPresentCount.innerText = totalPresent;
  if (kpiAbsentCount) kpiAbsentCount.innerText = totalAbsent;
  if (kpiAttendanceRate) kpiAttendanceRate.innerText = `${attendanceRate}%`;

  // Update Table Title
  const tableTitle = document.getElementById('leaderSessionTableTitle');
  if (tableTitle) {
    tableTitle.innerText = `Danh sách lớp đang học — ${shiftSelect}, ${formattedDate}`;
  }

  // Render Table Body
  const tbody = document.getElementById('leaderClassSessionsBody');
  if (tbody) {
    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#64748b; padding:24px;">
        Chưa có dữ liệu điểm danh cho ${shiftSelect}, ${formattedDate}.<br/>
        <span style="font-size:13px;">Hãy vào phân hệ <b>Giảng viên</b> để điểm danh bằng Camera AI, hoặc nhập <b>Sĩ số</b> lớp ở phân hệ <b>Đào tạo</b>.</span>
      </td></tr>`;
      return;
    }

    tbody.innerHTML = rows.map(item => {
      const rate = item.total > 0 ? ((item.present / item.total) * 100).toFixed(1) : '0.0';
      const isHigh = rate >= 90;
      const isMedium = rate >= 80 && rate < 90;

      const badgeStyle = isHigh
        ? 'background:#dcfce7; color:#15803d; border:1px solid #bbf7d0;'
        : isMedium
          ? 'background:#fef3c7; color:#b45309; border:1px solid #fde68a;'
          : 'background:#fee2e2; color:#dc2626; border:1px solid #fca5a5;';

      return `
        <tr>
          <td style="font-weight:800; color:#0f172a; font-size:14px;">${item.className}</td>
          <td style="color:#475569; font-weight:700;">${item.room}</td>
          <td style="color:#0f172a; font-weight:700;">${item.teacher}</td>
          <td style="text-align:center; font-weight:800; color:#334155;">${item.total}</td>
          <td style="text-align:center; font-weight:800; color:#10b981;">${item.present}</td>
          <td style="text-align:center; font-weight:800; color:#ef4444;">${item.absent}</td>
          <td style="text-align:center;">
            <span style="${badgeStyle} padding:4px 12px; border-radius:20px; font-weight:800; font-size:12.5px; display:inline-block;">
              ${rate}%
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }
}

// Ngày hôm nay dạng YYYY-MM-DD theo giờ máy
function getTodayDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ----------------------------------------------------
// ROLE DEFINITIONS (ACADEMIC HAS 5 HS2 COLUMNS + HẠNH KIỂM)
// ----------------------------------------------------

const academicGradesWithConduct = [
  { id: 'SV20260231', name: 'Trần Văn An', hs1: 8, hs2_1: 7, hs2_2: 9, hs2_3: 8, hs2_4: 8.5, hs2_5: 7.5, exam: 8.5, conduct: 'Tốt' },
  { id: 'SV20260232', name: 'Lê Thị Bích', hs1: 6, hs2_1: 7, hs2_2: 6.5, hs2_3: 7, hs2_4: 6, hs2_5: 7.5, exam: 7, conduct: 'Khá' },
  { id: 'SV20260233', name: 'Phạm Quốc Cường', hs1: 9, hs2_1: 8.5, hs2_2: 9.5, hs2_3: 9, hs2_4: 9, hs2_5: 8.5, exam: 9, conduct: 'Tốt' }
];

const roleConfig = {
  leader: {
    title: 'Tổng quan điểm danh',
    subtitle: 'Toàn trường — tất cả khoa, tất cả lớp',
    render: () => {
      setTimeout(() => {
        if (typeof updateLeaderAttendanceOverview === 'function') {
          updateLeaderAttendanceOverview();
        }
      }, 50);

      return `
        <!-- Top Filter Bar Card: Ngày, Buổi học, Khoa, Lớp -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:20px; padding:22px 28px; margin-bottom:24px; box-shadow:0 4px 20px -2px rgba(15,23,42,0.05);">
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:20px;">
            <div>
              <label style="font-size:13px; font-weight:700; color:#64748b; display:block; margin-bottom:8px;">Ngày</label>
              <input type="date" id="leaderFilterDate" class="academic-filter-select" value="${getTodayDateString()}" onchange="updateLeaderAttendanceOverview()" />
            </div>
            <div>
              <label style="font-size:13px; font-weight:700; color:#64748b; display:block; margin-bottom:8px;">Buổi học</label>
              <select id="leaderFilterShift" class="academic-filter-select" onchange="updateLeaderAttendanceOverview()">
                <option value="Sáng" selected>Sáng</option>
                <option value="Chiều">Chiều</option>
                <option value="Cả ngày">Cả ngày</option>
              </select>
            </div>
            <div>
              <label style="font-size:13px; font-weight:700; color:#64748b; display:block; margin-bottom:8px;">Khoa</label>
              <select id="leaderFilterDept" class="academic-filter-select" onchange="updateLeaderAttendanceOverview()">
                <option value="Tất cả khoa" selected>Tất cả khoa</option>
                <option value="Khoa Công nghệ thông tin">Khoa Công nghệ thông tin</option>
                <option value="Khoa Đại cương">Khoa Đại cương</option>
                <option value="Khoa Công nghệ Ô tô">Khoa Công nghệ Ô tô</option>
                <option value="Khoa Du Lịch">Khoa Du Lịch</option>
                <option value="Khoa Điện tử - Tin học">Khoa Điện tử - Tin học</option>
              </select>
            </div>
            <div>
              <label style="font-size:13px; font-weight:700; color:#64748b; display:block; margin-bottom:8px;">Lớp</label>
              <select id="leaderFilterClass" class="academic-filter-select" onchange="updateLeaderAttendanceOverview()">
                <option value="Tất cả lớp" selected>Tất cả lớp</option>
                ${classesList.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Executive 4 KPI Indicator Cards -->
            <div class="kpi-grid-4">
        <div class="kpi-card">
            <div class="kpi-value" id="kpiTotalClasses">12</div>
            <div class="kpi-label">Lớp đang học buổi này</div>
        </div>

        <div class="kpi-card">
            <div class="kpi-value-green" id="kpiPresentCount">418</div>
            <div class="kpi-label">Sinh viên có mặt</div>
        </div>

        <div class="kpi-card">
            <div class="kpi-value" id="kpiAbsentCount" style="color:#f59e0b;">37</div>
            <div class="kpi-label">Sinh viên vắng</div>
        </div>

        <div class="kpi-card">
            <div class="kpi-value" id="kpiAttendanceRate">91.9%</div>
            <div class="kpi-label">Tỷ lệ điểm danh</div>
        </div>
    </div>

        <!-- Detailed Class Attendance Table Card -->
        <div class="dashboard-card-white">
          <div class="card-header-flex">
            <h3 class="card-title-outfit" id="leaderSessionTableTitle">Danh sách lớp đang học — Sáng, 20/07/2026</h3>
            <div style="display:flex; gap:10px;">
              <button class="btn-action-edit" onclick="exportExcelLeaderReport()">📥 Xuất Excel</button>
              <button class="btn-danger-red" onclick="exportPDFLeaderReport()" style="padding:10px 16px; background:#ef4444; color:#fff; border:none; border-radius:10px; font-weight:700; cursor:pointer;">📄 Xuất PDF</button>
            </div>
          </div>
          <table class="custom-data-table">
            <thead>
              <tr>
                <th style="width:160px;">LỚP</th>
                <th style="width:120px;">PHÒNG</th>
                <th style="min-width:180px;">GIÁO VIÊN</th>
                <th style="text-align:center; width:90px;">SĨ SỐ</th>
                <th style="text-align:center; width:90px;">CÓ MẶT</th>
                <th style="text-align:center; width:90px;">VẮNG</th>
                <th style="text-align:center; width:110px;">TỶ LỆ</th>
              </tr>
            </thead>
            <tbody id="leaderClassSessionsBody">
              <!-- Dynamically rendered by updateLeaderAttendanceOverview() -->
            </tbody>
          </table>
        </div>
      `;
    }
  },

  training: {
    title: 'Đào tạo',
    subtitle: 'Thời khóa biểu, Quản lý Lớp học, Khoa, Môn học & Giảng viên',
    render: () => `
      <div style="display:flex; gap:24px; border-bottom:1px solid #e2e8f0; margin-bottom:24px; font-weight:700; font-size:14px;">
        <button id="tab-btn-sinhvien" class="training-tab-btn" onclick="switchTrainingTab('sinhvien')" style="padding-bottom:10px; background:none; border:none; color:#64748b; border-bottom:2px solid transparent; cursor:pointer;">Sinh viên</button>
          <button id="tab-btn-tkb" class="training-tab-btn" onclick="switchTrainingTab('tkb')" style="padding-bottom:10px; background:none; border:none; color:#64748b; border-bottom:2px solid transparent; cursor:pointer;">Thời khóa biểu</button>
        <button id="tab-btn-lophoc" class="training-tab-btn" onclick="switchTrainingTab('lophoc')" style="padding-bottom:10px; background:none; border:none; color:#64748b; border-bottom:2px solid transparent; cursor:pointer;">Lớp học</button>
        <button id="tab-btn-khoa" class="training-tab-btn" onclick="switchTrainingTab('khoa')" style="padding-bottom:10px; background:none; border:none; color:#14b8a6; border-bottom:2px solid #14b8a6; cursor:pointer;">Khoa</button>
        <button id="tab-btn-giaovien" class="training-tab-btn" onclick="switchTrainingTab('giaovien')" style="padding-bottom:10px; background:none; border:none; color:#64748b; border-bottom:2px solid transparent; cursor:pointer;">Giáo viên</button>
        <button id="tab-btn-monhoc" class="training-tab-btn" onclick="switchTrainingTab('monhoc')" style="padding-bottom:10px; background:none; border:none; color:#64748b; border-bottom:2px solid transparent; cursor:pointer;">Môn học</button>
      </div>

      <div id="trainingTabContent">
        ${renderTrainingSubTab('khoa')}
      </div>
    `
  },

  finance: {
    title: 'Tài chính',
    subtitle: 'Thông báo học phí gửi qua Mobile App',
    render: () => `
      <div class="finance-grid">
        <div class="finance-card">
          <h3 class="finance-card-title">Soạn thông báo</h3>
          <form onsubmit="sendFinanceNotice(event)">
            <div class="finance-field">
              <label>Loại thông báo</label>
              <select id="financeTypeSelect" class="finance-select">
                <option value="Thông báo thu học phí">Thông báo thu học phí</option>
                <option value="Nhắc nợ học phí">Nhắc nợ học phí</option>
                <option value="Cảnh báo học tập">Cảnh báo học tập</option>
              </select>
            </div>
            <div class="finance-field">
              <label>Gửi đến</label>
              <select id="financeTargetSelect" class="finance-select" onchange="toggleFinanceStudentList()">
                <option value="Toàn trường">Toàn trường</option>
                <option value="Theo Lớp / Khoa">Theo Lớp / Khoa</option>
                <option value="Từng cá nhân sinh viên">Từng cá nhân sinh viên</option>
              </select>
            </div>
            <div class="finance-field">
              <label>Lớp / Khoa</label>
              <select id="financeClassSelect" class="finance-select" onchange="toggleFinanceStudentList()">
                ${classesList.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            
            <div id="financeStudentListSection" style="display:none; margin-top:16px;">
              <label style="font-size:13px; font-weight:700; color:#64748b; display:block; margin-bottom:8px;">Danh sách sinh viên</label>
              <div id="financeStudentTableContainer" style="max-height:200px; overflow-y:auto; border:1px solid #e2e8f0; border-radius:8px; padding:8px;">
                <!-- Filled via JS -->
              </div>
            </div>

            <div class="finance-field">
              <label>Nội dung</label>
              <textarea id="financeContentInput" class="finance-textarea">Học phí học kỳ 1 (2026-2027) cần hoàn tất trước 30/07/2026. Vui lòng nộp qua ứng dụng hoặc phòng tài chính.</textarea>
            </div>
            <button type="submit" class="btn-teal-mobile">Gửi đến Mobile App</button>
          </form>
        </div>

        <div class="finance-card">
          <h3 class="finance-card-title">Đã gửi gần đây</h3>
          <table class="custom-data-table">
            <thead>
              <tr><th>NỘI DUNG</th><th>ĐỐI TƯỢNG</th><th>THỜI GIAN</th><th>TRẠNG THÁI</th></tr>
            </thead>
            <tbody id="financeSentBody">
              ${financeSentHistory.map(row => `
                <tr>
                  <td style="font-weight:700; color:#0f172a;">${row.content}</td>
                  <td style="color:#334155;">${row.target}</td>
                  <td style="color:#64748b; font-family:monospace;">${row.time}</td>
                  <td><span class="${row.type === 'green' ? 'badge-status-green' : 'badge-status-amber'}">${row.statusText}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
  },

  // Role Giáo vụ (Academic Affairs) - MODULAR DEV-TAY STYLE
  academic: {
    title: 'Giáo vụ',
    subtitle: 'Nhập điểm & Đánh giá hạnh kiểm từng sinh viên theo lớp',
    render: () => {
      
window.academicGradesStore = window.academicGradesStore || {};
window.academicConductStore = window.academicConductStore || {};

window.saveAcademicData = function() {
    if (window.academicCurrentTab === 'diem') {
        const trs = document.querySelectorAll('#academicGradeTableCard tbody tr');
        let count = 0;
        trs.forEach((tr, idx) => {
            const td = tr.querySelector('td:first-child');
            if(!td) return;
            const sid = td.innerText.trim();
            const hs1 = document.getElementById(`hs1_${idx}`).value;
            const hs2_1 = document.getElementById(`hs2_1_${idx}`).value;
            const hs2_2 = document.getElementById(`hs2_2_${idx}`).value;
            const hs2_3 = document.getElementById(`hs2_3_${idx}`).value;
            const hs2_4 = document.getElementById(`hs2_4_${idx}`).value;
            const hs2_5 = document.getElementById(`hs2_5_${idx}`).value;
            const exam = document.getElementById(`exam_${idx}`).value;
            
            if (!window.academicGradesStore[window.academicCurrentClass]) window.academicGradesStore[window.academicCurrentClass] = {};
            if (!window.academicGradesStore[window.academicCurrentClass][window.academicCurrentCourse]) window.academicGradesStore[window.academicCurrentClass][window.academicCurrentCourse] = {};
            
            window.academicGradesStore[window.academicCurrentClass][window.academicCurrentCourse][sid] = {
                hs1, hs2_1, hs2_2, hs2_3, hs2_4, hs2_5, exam
            };
            count++;
        });
        customAlert(`Đã lưu điểm thành công cho ${count} sinh viên!`);
    } else {
        const trs = document.querySelectorAll('#academicGradeTableCard tbody tr');
        let count = 0;
        trs.forEach((tr, idx) => {
            const td = tr.querySelector('td:first-child');
            if(!td) return;
            const sid = td.innerText.trim();
            const select = tr.querySelector('.grade-conduct-select');
            if (select) {
                if (!window.academicConductStore[window.academicCurrentClass]) window.academicConductStore[window.academicCurrentClass] = {};
                if (!window.academicConductStore[window.academicCurrentClass][window.academicCurrentSemester]) window.academicConductStore[window.academicCurrentClass][window.academicCurrentSemester] = {};
                
                window.academicConductStore[window.academicCurrentClass][window.academicCurrentSemester][sid] = select.value;
                count++;
            }
        });
        customAlert(`Đã lưu Hạnh kiểm thành công cho ${count} sinh viên!`);
    }
};

window.academicCurrentTab = window.academicCurrentTab || 'diem';

      window.switchAcademicTab = function(tab) {
        window.academicCurrentTab = tab;
        document.getElementById('contentPanel').innerHTML = roleConfig.academic.render();
      };
      
      window.academicCurrentClass = window.academicCurrentClass || (typeof classesList !== 'undefined' && classesList.length > 0 ? classesList[0] : '');
      window.academicCurrentCourse = window.academicCurrentCourse || (typeof coursesData !== 'undefined' && coursesData.length > 0 ? coursesData[0].name : '');
      window.academicCurrentTeacher = window.academicCurrentTeacher || (typeof teachersData !== 'undefined' && teachersData.length > 0 ? teachersData[0].name : '');
      window.academicCurrentSemester = window.academicCurrentSemester || 'Học kỳ 1';

      // Ensure current course and teacher are valid for the selected class's department
      const cDept = window.getDeptFromClassName ? window.getDeptFromClassName(window.academicCurrentClass) : '';
      if (cDept && typeof coursesData !== 'undefined' && typeof teachersData !== 'undefined') {
        const validCourses = coursesData.filter(c => c.dept === cDept || c.dept === 'ĐC' || c.dept === 'DC');
        const validTeachers = teachersData.filter(t => t.dept === cDept || t.dept === 'ĐC' || t.dept === 'DC');
        
        if (validCourses.length > 0 && !validCourses.find(c => c.name === window.academicCurrentCourse)) {
          window.academicCurrentCourse = validCourses[0].name;
        }
        if (validTeachers.length > 0 && !validTeachers.find(t => t.name === window.academicCurrentTeacher)) {
          window.academicCurrentTeacher = validTeachers[0].name;
        }
      }

      const studentsInClass = (typeof studentsData !== 'undefined' ? studentsData : []).filter(s => s.className === window.academicCurrentClass || s.class === window.academicCurrentClass);
      
      let filterHTML = '';
      let tableHeaderHTML = '';
      let tableBodyHTML = '';
      
      if (window.academicCurrentTab === 'diem') {
        filterHTML = `
          <div class="filter-group">
            <label class="academic-filter-label"><span>🏫</span> Lớp học</label>
            <select class="academic-filter-select" onchange="window.academicCurrentClass=this.value; document.getElementById('contentPanel').innerHTML = roleConfig.academic.render();">
              ${window.renderClassOptionsGrouped ? window.renderClassOptionsGrouped(window.academicCurrentClass) : ''}
            </select>
          </div>
          <div class="filter-group">
            <label class="academic-filter-label"><span>📚</span> Môn học / Mô đun</label>
            <select class="academic-filter-select" onchange="window.academicCurrentCourse=this.value; document.getElementById('contentPanel').innerHTML = roleConfig.academic.render();">
              ${(() => {
                const classDept = window.getDeptFromClassName ? window.getDeptFromClassName(window.academicCurrentClass) : '';
                let filtered = typeof coursesData !== 'undefined' ? coursesData : [];
                if (classDept) {
                  filtered = filtered.filter(c => c.dept === classDept || c.dept === 'ĐC' || c.dept === 'DC');
                }
                return filtered.map(c => `<option value="${c.name}" ${c.name === window.academicCurrentCourse ? 'selected' : ''}>${c.name}</option>`).join('');
              })()}
            </select>
          </div>
          <div class="filter-group">
            <label class="academic-filter-label"><span>👨‍🏫</span> Giảng viên phụ trách</label>
            <select class="academic-filter-select" onchange="window.academicCurrentTeacher=this.value; document.getElementById('contentPanel').innerHTML = roleConfig.academic.render();">
              ${(() => {
                const classDept = window.getDeptFromClassName ? window.getDeptFromClassName(window.academicCurrentClass) : '';
                let filtered = typeof teachersData !== 'undefined' ? teachersData : [];
                if (classDept) {
                  filtered = filtered.filter(t => t.dept === classDept || t.dept === 'ĐC' || t.dept === 'DC');
                }
                return filtered.map(t => `<option value="${t.name}" ${t.name === window.academicCurrentTeacher ? 'selected' : ''}>${t.name}</option>`).join('');
              })()}
            </select>
          </div>
        `;
        
        tableHeaderHTML = `
            <tr style="background:#f8fafc;">
              <th style="white-space:nowrap;">MÃ SV</th>
              <th style="white-space:nowrap; min-width:140px;">HỌ TÊN</th>
              <th style="text-align:center; white-space:nowrap;">HS1</th>
              <th style="text-align:center; white-space:nowrap;">HS2-1</th>
              <th style="text-align:center; white-space:nowrap;">HS2-2</th>
              <th style="text-align:center; white-space:nowrap;">HS2-3</th>
              <th style="text-align:center; white-space:nowrap;">HS2-4</th>
              <th style="text-align:center; white-space:nowrap;">HS2-5</th>
              <th style="color:#2563eb; text-align:center; white-space:nowrap;">ĐTBKT</th>
              <th style="text-align:center; white-space:nowrap;">ĐIỂM THI</th>
              <th style="color:#059669; text-align:center; white-space:nowrap;">ĐTB MÔN</th>
            </tr>
        `;
        
        if (studentsInClass.length === 0) {
          tableBodyHTML = `<tr><td colspan="11" style="text-align:center; padding: 20px;">Không có sinh viên nào trong lớp này.</td></tr>`;
        } else {
          tableBodyHTML = studentsInClass.map((g, idx) => {
            const sid = g.id || g.studentId;
            let val = {};
            if (window.academicGradesStore && window.academicGradesStore[window.academicCurrentClass] && window.academicGradesStore[window.academicCurrentClass][window.academicCurrentCourse] && window.academicGradesStore[window.academicCurrentClass][window.academicCurrentCourse][sid]) {
                val = window.academicGradesStore[window.academicCurrentClass][window.academicCurrentCourse][sid];
            }
            return `
              <tr>
                <td style="font-weight:800; color:#0f172a; font-family:monospace; font-size:13px;">${sid}</td>
                <td style="font-weight:700; color:#0f172a; font-size:14px;">${g.name || g.studentName}</td>
                <td style="text-align:center;"><input type="number" step="0.5" id="hs1_${idx}" class="grade-table-input" value="${val.hs1||''}" oninput="calculateGradeRow(${idx})" /></td>
                <td style="text-align:center;"><input type="number" step="0.5" id="hs2_1_${idx}" class="grade-table-input" value="${val.hs2_1||''}" oninput="calculateGradeRow(${idx})" /></td>
                <td style="text-align:center;"><input type="number" step="0.5" id="hs2_2_${idx}" class="grade-table-input" value="${val.hs2_2||''}" oninput="calculateGradeRow(${idx})" /></td>
                <td style="text-align:center;"><input type="number" step="0.5" id="hs2_3_${idx}" class="grade-table-input" value="${val.hs2_3||''}" oninput="calculateGradeRow(${idx})" /></td>
                <td style="text-align:center;"><input type="number" step="0.5" id="hs2_4_${idx}" class="grade-table-input" value="${val.hs2_4||''}" oninput="calculateGradeRow(${idx})" /></td>
                <td style="text-align:center;"><input type="number" step="0.5" id="hs2_5_${idx}" class="grade-table-input" value="${val.hs2_5||''}" oninput="calculateGradeRow(${idx})" /></td>
                <td id="dtbkt_${idx}" style="font-weight:800; color:#2563eb; font-size:15px; text-align:center;">0.0</td>
                <td style="text-align:center;"><input type="number" step="0.5" id="exam_${idx}" class="grade-table-input" value="${val.exam||''}" oninput="calculateGradeRow(${idx})" /></td>
                <td id="dtbMon_${idx}" style="font-weight:800; color:#059669; font-size:16px; text-align:center;">0.00</td>
              </tr>
            `;
          }).join('');
        }
      } else {
        filterHTML = `
          <div class="filter-group">
            <label class="academic-filter-label"><span>🏫</span> Lớp học</label>
            <select class="academic-filter-select" onchange="window.academicCurrentClass=this.value; document.getElementById('contentPanel').innerHTML = roleConfig.academic.render();">
              ${window.renderClassOptionsGrouped ? window.renderClassOptionsGrouped(window.academicCurrentClass) : ''}
            </select>
          </div>
          <div class="filter-group">
            <label class="academic-filter-label"><span>👨‍🏫</span> Giáo viên chủ nhiệm</label>
            <select class="academic-filter-select" onchange="window.academicCurrentTeacher=this.value; document.getElementById('contentPanel').innerHTML = roleConfig.academic.render();">
              ${(() => {
                const classDept = window.getDeptFromClassName ? window.getDeptFromClassName(window.academicCurrentClass) : '';
                let filtered = typeof teachersData !== 'undefined' ? teachersData : [];
                if (classDept) {
                  filtered = filtered.filter(t => t.dept === classDept || t.dept === 'ĐC' || t.dept === 'DC');
                }
                return filtered.map(t => `<option value="${t.name}" ${t.name === window.academicCurrentTeacher ? 'selected' : ''}>${t.name}</option>`).join('');
              })()}
            </select>
          </div>
          <div class="filter-group">
            <label class="academic-filter-label"><span>📅</span> Học kỳ</label>
            <select class="academic-filter-select" onchange="window.academicCurrentSemester=this.value; document.getElementById('contentPanel').innerHTML = roleConfig.academic.render();">
              <option value="Học kỳ 1" ${window.academicCurrentSemester === 'Học kỳ 1' ? 'selected' : ''}>Học kỳ 1</option>
              <option value="Học kỳ 2" ${window.academicCurrentSemester === 'Học kỳ 2' ? 'selected' : ''}>Học kỳ 2</option>
            </select>
          </div>
        `;
        
        tableHeaderHTML = `
            <tr style="background:#f8fafc;">
              <th style="white-space:nowrap; width: 120px;">MÃ SV</th>
              <th style="white-space:nowrap; min-width:200px;">HỌ TÊN</th>
              <th style="text-align:center; white-space:nowrap; min-width:200px;">HẠNH KIỂM</th>
            </tr>
        `;
        
        if (studentsInClass.length === 0) {
          tableBodyHTML = `<tr><td colspan="3" style="text-align:center; padding: 20px;">Không có sinh viên nào trong lớp này.</td></tr>`;
        } else {
          tableBodyHTML = studentsInClass.map((g, idx) => {
            const sid = g.id || g.studentId;
            let cval = 'Tốt'; // default
            if (window.academicConductStore && window.academicConductStore[window.academicCurrentClass] && window.academicConductStore[window.academicCurrentClass][window.academicCurrentSemester] && window.academicConductStore[window.academicCurrentClass][window.academicCurrentSemester][sid]) {
                cval = window.academicConductStore[window.academicCurrentClass][window.academicCurrentSemester][sid];
            }
            return `
              <tr>
                <td style="font-weight:800; color:#0f172a; font-family:monospace; font-size:13px;">${sid}</td>
                <td style="font-weight:700; color:#0f172a; font-size:14px;">${g.name || g.studentName}</td>
                <td style="text-align:center;">
                  <select class="grade-conduct-select" style="width: 100%; max-width: 250px;">
                    <option value="Xuất sắc" ${cval === 'Xuất sắc' ? 'selected' : ''}>🌟 Xuất sắc</option>
                    <option value="Tốt" ${cval === 'Tốt' ? 'selected' : ''}>🟢 Tốt</option>
                    <option value="Khá" ${cval === 'Khá' ? 'selected' : ''}>🔵 Khá</option>
                    <option value="Trung bình" ${cval === 'Trung bình' ? 'selected' : ''}>🟡 Trung bình</option>
                    <option value="Yếu" ${cval === 'Yếu' ? 'selected' : ''}>🔴 Yếu</option>
                  </select>
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      return `
      <!-- Tabs for Academic -->
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <button onclick="switchAcademicTab('diem')" style="padding: 10px 20px; font-size: 15px; font-weight: bold; border-radius: 8px; border: 2px solid ${window.academicCurrentTab === 'diem' ? '#0f172a' : '#cbd5e1'}; background: ${window.academicCurrentTab === 'diem' ? '#0f172a' : '#fff'}; color: ${window.academicCurrentTab === 'diem' ? '#fff' : '#475569'}; cursor: pointer; transition: 0.2s;">NHẬP ĐIỂM MH/MĐ</button>
        <button onclick="switchAcademicTab('hanhkiem')" style="padding: 10px 20px; font-size: 15px; font-weight: bold; border-radius: 8px; border: 2px solid ${window.academicCurrentTab === 'hanhkiem' ? '#0f172a' : '#cbd5e1'}; background: ${window.academicCurrentTab === 'hanhkiem' ? '#0f172a' : '#fff'}; color: ${window.academicCurrentTab === 'hanhkiem' ? '#fff' : '#475569'}; cursor: pointer; transition: 0.2s;">NHẬP HẠNH KIỂM</button>
      </div>

      <!-- Filter Controls Header -->
      <div class="academic-filter-header">
        ${filterHTML}
      </div>

      <!-- Formula Guidelines Banner -->
      <div class="grading-formula-banner">
        <div class="grading-formula-title">
          <span>💡</span> Công thức tính điểm & Xếp loại Hạnh kiểm
        </div>
        <div class="grading-formula-desc">
          • <b>ĐTBKT</b> = làm tròn(trung bình có trọng số: HS1 × 1, HS2 × 2, tổng chia cho tổng hệ số các cột đã nhập)<br/>
          • <b>Điểm TB môn</b> = ĐTBKT × 0,4 + Điểm thi × 0,6 | <b>Hạnh kiểm</b>: Đánh giá theo quá trình học tập rèn luyện (Xuất sắc / Tốt / Khá / TB / Yếu)
        </div>
      </div>

      <!-- Grade & Conduct Table Container -->
      <div class="grade-table-card" id="academicGradeTableCard">
        <div class="card-header-flex">
          <div>
            <h3 class="card-title-outfit">Bảng điểm & Hạnh kiểm — ${window.academicCurrentTab === 'diem' ? window.academicCurrentCourse : 'Tổng hợp'}</h3>
            <div style="font-size:13px; color:#64748b; font-weight:600; margin-top:2px;">
              Lớp trực thuộc: <span style="color:#0d9488; font-weight:800;">${window.academicCurrentClass}</span> · Tổng số: <b>${studentsInClass.length} sinh viên</b>
            </div>
          </div>
        </div>

        <table class="custom-data-table" style="width:100%;">
          <thead>
            ${tableHeaderHTML}
          </thead>
          <tbody>
            ${tableBodyHTML}
          </tbody>
        </table>
        
        <!-- SAVE BUTTON -->
        <div style="text-align:right; margin-top:20px; padding:0 20px 20px;">
            <button onclick="saveAcademicData()" style="background:#2563eb; color:#fff; font-weight:bold; font-size:14px; border:none; padding:10px 24px; border-radius:8px; cursor:pointer; box-shadow:0 4px 10px rgba(37,99,235,0.3); transition:0.2s;">
                💾 LƯU DỮ LIỆU
            </button>
        </div>
      </div>
      
      <script>
        setTimeout(() => {
            for(let i=0; i<100; i++) {
                if (typeof calculateGradeRow === 'function' && document.getElementById('hs1_'+i)) {
                    calculateGradeRow(i);
                }
            }
        }, 100);
      </script>
      `;
    }
  },

  teacher: {
    title: 'Điểm danh bằng Camera AI',
    subtitle: 'Đăng nhập Camera IP / RTSP — quét khuôn mặt tự động lưu Server & đếm sĩ số',
    render: () => {
      setTimeout(() => {
        if (typeof refreshTeacherAttendanceTable === 'function') {
          refreshTeacherAttendanceTable();
        }
      }, 50);

      const registeredList = (typeof registeredFaceDatabase !== 'undefined' && registeredFaceDatabase) ? registeredFaceDatabase : [
        { id: 'SV20260231', name: 'Trần Văn An' },
        { id: 'SV20260232', name: 'Lê Thị Bích' },
        { id: 'SV20260233', name: 'Phạm Quốc Cường' },
        { id: 'SV20260234', name: 'Hoàng Minh Đức' },
        { id: 'SV20260235', name: 'Nguyễn Thảo Vân' }
      ];

      const now = new Date();
      const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
      const dayName = days[now.getDay()];
      const dateString = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth()+1).padStart(2, '0')}/${now.getFullYear()}`;
      const hour = now.getHours();
      const defaultShift = hour < 12 ? 'Sáng' : (hour < 18 ? 'Chiều' : 'Tối');

      return `
        <!-- Selection Area -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:20px; margin-bottom:20px; display:flex; gap:20px; align-items:flex-end;">
          <div style="flex:1;">
            <label style="font-size:13px; font-weight:700; color:#64748b; display:block; margin-bottom:8px;">1. Chọn Khoa</label>
            <select id="teacherSelectDept" class="academic-filter-select" onchange="window.onTeacherDeptChange ? window.onTeacherDeptChange() : null">
              <option value="">-- Chọn Khoa --</option>
              <option value="Khoa Công nghệ thông tin">Khoa Công nghệ thông tin</option>
              <option value="Khoa Công nghệ Ô tô">Khoa Công nghệ Ô tô</option>
              <option value="Khoa Điện">Khoa Điện</option>
              <option value="Khoa Cơ khí">Khoa Cơ khí</option>
              <option value="Khoa Du Lịch">Khoa Du Lịch</option>
              <option value="Khoa Văn hóa nghệ thuật">Khoa Văn hóa nghệ thuật</option>
              <option value="Khoa Đại cương">Khoa Đại cương</option>
            </select>
          </div>
          <div style="flex:1;">
            <label style="font-size:13px; font-weight:700; color:#64748b; display:block; margin-bottom:8px;">2. Chọn Lớp</label>
            <select id="teacherSelectClass" class="academic-filter-select" onchange="window.onTeacherClassChange ? window.onTeacherClassChange() : null">
              <option value="">-- Chọn Lớp --</option>
              <option value="CĐK17 CNTT A">CĐK17 CNTT A</option>
              <option value="CĐK17 CNTT B">CĐK17 CNTT B</option>
              <option value="CĐK17 CNTT C">CĐK17 CNTT C</option>
              <option value="CĐK18 CNTT A">CĐK18 CNTT A</option>
              <option value="CĐK18 CNTT B">CĐK18 CNTT B</option>
              <option value="CĐK17 CNOTO A">CĐK17 CNOTO A</option>
              <option value="CĐK17 CNOTO B">CĐK17 CNOTO B</option>
              <option value="CĐK18 CNOTO A">CĐK18 CNOTO A</option>
              <option value="CĐK17 ĐCN A">CĐK17 ĐCN A</option>
              <option value="CĐK17 ĐCN B">CĐK17 ĐCN B</option>
              <option value="CĐK18 ĐCN A">CĐK18 ĐCN A</option>
              <option value="CĐK17 CĐT A">CĐK17 CĐT A</option>
              <option value="CĐK17 CĐT B">CĐK17 CĐT B</option>
              <option value="CĐK17 DL1">CĐK17 DL1</option>
              <option value="CĐK17 DL2">CĐK17 DL2</option>
              <option value="CĐK17 QTKS">CĐK17 QTKS</option>
              <option value="CĐK17 HDDL">CĐK17 HDDL</option>
              <option value="CĐK17 VHSCTBL">CĐK17 VHSCTBL</option>
              <option value="CĐK17 DC1">CĐK17 DC1</option>
              <option value="CĐK17 DC2">CĐK17 DC2</option>
            </select>
          </div>
        </div>

        <div style="display:flex; gap:16px; margin-bottom:20px; align-items:center; flex-wrap:wrap;">
          <div style="background:#0ea5e9; color:#fff; font-weight:700; padding:10px 16px; border-radius:10px; font-size:14px; flex:1; text-align:center; min-width:200px; box-shadow:0 4px 10px rgba(14,165,233,0.2);">
            📅 Ngày: ${dateString}
          </div>
          <div style="background:#0ea5e9; color:#fff; font-weight:700; padding:10px 16px; border-radius:10px; font-size:14px; flex:1; text-align:center; min-width:200px; box-shadow:0 4px 10px rgba(14,165,233,0.2);">
            🗓 ${dayName}
          </div>
          <div style="flex:1; min-width:200px; display:flex; align-items:center;">
            <select id="teacherShiftSelect" style="width:100%; padding:10px 16px; border-radius:10px; border:2px solid #0ea5e9; font-weight:800; color:#0ea5e9; outline:none; cursor:pointer; background:#f0f9ff; appearance:none;">
              <option value="Sáng" ${defaultShift==='Sáng'?'selected':''}>🌅 Buổi Sáng</option>
              <option value="Chiều" ${defaultShift==='Chiều'?'selected':''}>☀️ Buổi Chiều</option>
              <option value="Tối" ${defaultShift==='Tối'?'selected':''}>🌙 Buổi Tối</option>
            </select>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
          <div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
            <button class="btn-primary-blue" onclick="scanCameraAttendance()" style="background:linear-gradient(135deg, #6366f1, #4f46e5); box-shadow:0 4px 14px rgba(99,102,241,0.3); font-weight:700;">
              🔑 Điểm danh HSSV
            </button>
            <button id="btnSaveStudent" class="btn-primary-blue" onclick="triggerScanNewStudent()" style="background:linear-gradient(135deg, #10b981, #059669); box-shadow:0 4px 14px rgba(16,185,129,0.3); font-weight:700;">
              💾 Thêm HSSV mới
            </button>
            <button id="btnStartWebcam" class="btn-teal-mobile" onclick="openCameraLoginModal()" style="font-weight:700;">
              📷 Đăng nhập camera
            </button>
            <button id="btnOpenDeviceCam" class="btn-teal-mobile" onclick="startRealWebcam()" style="font-weight:700; background:linear-gradient(135deg, #f59e0b, #d97706); box-shadow:0 4px 14px rgba(245,158,11,0.3); color:#fff; border:none; border-radius:10px; padding:10px 18px; cursor:pointer;">
              📹 Camera thiết bị
            </button>
            <button id="btnStopWebcam" class="btn-danger-red" onclick="stopRealWebcam()" style="display:none; padding:10px 18px; background:#ef4444; color:#fff; border:none; border-radius:10px; font-weight:700; cursor:pointer;">
              🔴 Tắt Camera
            </button>
            <button id="btnToggleCameraMirror" class="btn-camera-mirror" type="button" onclick="toggleCameraMirror()" aria-pressed="false" title="Bật hoặc tắt chế độ gương">
              🪞 Bật chế độ gương
            </button>
          </div>

          <!-- Select Student to Scan -->
          <div style="display:none; align-items:center; gap:8px; background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:6px 14px;">
            <span style="font-size:13px; font-weight:800; color:#334155;">📷 Quét sinh viên:</span>
            <select id="selectStudentToScan" onchange="scanCameraAttendance(this.value)" style="border:none; background:transparent; font-size:13px; font-weight:800; color:#0f172a; outline:none; cursor:pointer;">
              ${registeredList.map(s => `<option value="${s.id}">${s.id} — ${s.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="teacher-grid">
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div id="cameraViewport" class="camera-viewport-card">
              <div class="camera-reticle-top-left"></div>
              <div class="camera-reticle-top-right"></div>
              <div class="camera-reticle-bottom-left"></div>
              <div class="camera-reticle-bottom-right"></div>
              <div id="cameraStatusPill" class="camera-status-pill">Camera chưa bật</div>
                <!-- NEW HUD OVERLAY -->
                <div id="cameraScanOverlayHUD" style="display:none; position:absolute; bottom:16px; left:16px; right:16px; background:rgba(15,23,42,0.85); backdrop-filter:blur(8px); border:1px solid #38bdf8; border-radius:12px; padding:12px 16px; z-index:50; justify-content:space-between; align-items:center; gap:12px; box-shadow:0 8px 32px rgba(0,0,0,0.5);">
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    <div style="font-size:12px; font-weight:700; color:#94a3b8; font-family:'Outfit';">MÃ HSSV: <span id="hudStudentId" style="color:#38bdf8;">?</span></div>
                    <div style="font-size:16px; font-weight:800; color:#ffffff; font-family:'Outfit'; text-transform:uppercase;">HỌ TÊN: <span id="hudStudentName">Không phát hiện khuôn mặt</span></div>
                    <div id="hudStudentDetails" style="font-size:12px; font-weight:700; color:#cbd5e1; font-family:'Outfit';">Lớp: — · Khoa/Ngành: —</div>
                  </div>
                  <div>
                    <div id="hudStatusPill" style="padding:6px 14px; border-radius:8px; font-weight:700; font-size:13px; font-family:'Outfit'; color:#fff; background:#ef4444; box-shadow:0 4px 12px rgba(0,0,0,0.3);">⚠️ Vui lòng nhìn thẳng vào camera</div>
                  </div>
                </div>

              <video id="realWebcamVideo" class="webcam-video-element" autoplay playsinline muted></video>
              <div id="cameraPlaceholderText" class="camera-prompt-text">
                Nhấn "Điểm danh HSSV" hoặc "Camera thiết bị" để bắt đầu
              </div>
            </div>
            
            <div id="attendanceCounterBadge" style="background:#0f172a; color:#38bdf8; font-weight:800; font-size:14px; padding:12px 18px; border-radius:12px; border:1px solid #1e293b; font-family:'Outfit'; text-align:center;">
              Đã điểm danh: 0 / 0 học sinh
            </div>
          </div>

          <div class="table-card" style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:24px;">
            <div id="teacherTableTitle" class="table-card-title" style="font-family:'Outfit'; font-size:18px; font-weight:700; margin-bottom:20px;">Danh sách điểm danh — Vui lòng chọn lớp</div>
            <table class="custom-data-table">
              <thead><tr><th>STT</th><th>MÃ SV</th><th>HỌ TÊN</th><th>THỜI GIAN</th><th>TRẠNG THÁI</th></tr></thead>
              <tbody id="teacherAttendanceBody">
                <!-- Dynamically populated from registeredFaceDatabase -->
              </tbody>
            </table>
          </div>
        </div>
      `;
    }
  },


  notification: {
    title: 'Mô phỏng Mobile App (SV & PH)',
    subtitle: 'Trình giả lập ứng dụng di động QCET Student & Quản lý Thông báo toàn trường',
    render: () => {
      setTimeout(() => {
        if (typeof switchMobileSimTab === 'function') {
          switchMobileSimTab('home');
        }
      }, 50);

      return `
        

        <!-- Main Layout: Centered Phone Emulator -->
        <div style="display:flex; justify-content:center; padding-bottom: 40px;">
          
          <!-- Hidden Notif Composer Modal -->
          <div id="notifComposerModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.7); backdrop-filter:blur(6px); z-index:99999; justify-content:center; align-items:center; padding:20px;">
            <div style="background:#fff; border-radius:24px; padding:32px; width:100%; max-width:700px; max-height:95vh; overflow-y:auto; box-shadow:0 20px 40px rgba(0,0,0,0.2); position:relative; animation: modalFadeIn 0.3s ease;">
              <button type="button" onclick="document.getElementById(\'notifComposerModal\').style.display=\'none\'" style="position:absolute; top:20px; right:24px; background:#f1f5f9; border:none; width:36px; height:36px; border-radius:50%; font-size:20px; cursor:pointer; color:#475569; display:flex; justify-content:center; align-items:center;">&times;</button>
              
              <!-- Quick Category Select Tags -->
              <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:24px;">
                <button class="notif-tag-btn active" onclick="selectNotifTag(this, 'Thu học phí')">Thu học phí</button>
                <button class="notif-tag-btn red" onclick="selectNotifTag(this, 'Nợ học phí')">Nợ học phí</button>
                <button class="notif-tag-btn yellow" onclick="selectNotifTag(this, 'Nợ môn')">Nợ môn</button>
                <button class="notif-tag-btn gray" onclick="selectNotifTag(this, 'Tiến độ đào tạo')">Tiến độ đào tạo</button>
                <button class="notif-tag-btn gray" onclick="selectNotifTag(this, 'Thông báo chung')">Thông báo chung</button>
              </div>

              <!-- Left Column: Form Composer & Sent History -->
              <div style="display:flex; flex-direction:column; gap:28px;">
            <!-- Form Composer -->
            <div style="background:#fff; border:1px solid #e2e8f0; border-radius:20px; padding:28px; box-shadow:0 4px 20px -2px rgba(15,23,42,0.05);">
              <h3 style="font-family:'Outfit'; font-size:18px; font-weight:800; color:#0f172a; margin-bottom:18px; display:flex; align-items:center; gap:8px;">
                <span>📢</span> Soạn & Gửi thông báo đến Mobile App
              </h3>
              <form onsubmit="broadcastMobileNotif(event)">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:20px;">
                  <div class="modal-field">
                    <label>Loại thông báo</label>
                    <select id="notifTypeSelect" class="modal-input" style="height:46px;" onchange="updateMobilePreview()">
                      <option value="Thu học phí">Thu học phí</option>
                      <option value="Nợ học phí">Nợ học phí</option>
                      <option value="Nợ môn">Nợ môn</option>
                      <option value="Tiến độ đào tạo">Tiến độ đào tạo</option>
                      <option value="Thông báo chung">Thông báo chung</option>
                    </select>
                  </div>
                  <div class="modal-field">
                    <label>Đối tượng nhận</label>
                    <select id="notifTargetSelect" class="modal-input" style="height:46px;" onchange="updateMobilePreview()">
                      <option value="Toàn trường">Toàn trường</option>
                      <option value="K19-CNTT">K19-CNTT</option>
                      <option value="CNTT K19A">CNTT K19A</option>
                      <option value="CĐK17 CNOTO A">CĐK17 CNOTO A</option>
                    </select>
                  </div>
                </div>

                <div class="modal-field" style="margin-bottom:20px;">
                  <label>Tiêu đề</label>
                  <input type="text" id="notifTitleInput" class="modal-input" value="Thông báo thu học phí học kỳ 1" placeholder="Nhập tiêu đề thông báo..." oninput="updateMobilePreview()" required />
                </div>

                <div class="modal-field" style="margin-bottom:24px;">
                  <label>Nội dung</label>
                  <textarea id="notifContentInput" class="modal-input" style="min-height:110px; resize:vertical; line-height:1.6;" placeholder="Nhập nội dung thông báo..." oninput="updateMobilePreview()" required>Vui lòng hoàn tất học phí học kỳ 1 trước ngày 30/07/2026 qua ứng dụng di động hoặc chuyển khoản nhà trường.</textarea>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <button type="button" class="btn-action-edit" onclick="alert('Đã lên lịch gửi vào 08:00 sáng mai!')" style="display:flex; align-items:center; gap:6px; padding:12px 18px; font-weight:700;">
                    🕒 Lên lịch gửi
                  </button>
                  <button type="submit" style="background:#0f172a; color:#fff; border:none; padding:12px 28px; border-radius:12px; font-size:14px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:8px; box-shadow:0 4px 14px rgba(15,23,42,0.3);">
                    ✈️ Gửi thông báo ngay
                  </button>
                </div>
              </form>
            </div>

            <!-- Sent History Table -->
            <div style="background:#fff; border:1px solid #e2e8f0; border-radius:20px; padding:28px; box-shadow:0 4px 20px -2px rgba(15,23,42,0.05);">
              <h3 style="font-family:'Outfit'; font-size:18px; font-weight:800; color:#0f172a; margin-bottom:20px;">Lịch sử đã gửi</h3>
              <table class="custom-data-table">
                <thead>
                  <tr>
                    <th>LOẠI</th>
                    <th>TIÊU ĐỀ</th>
                    <th>ĐỐI TƯỢNG</th>
                    <th style="text-align:right;">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody id="notifHistoryBody">
                  <tr>
                    <td style="font-weight:700; color:#0f172a;">Nợ học phí</td>
                    <td style="color:#334155; font-weight:600;">Nhắc đóng học phí đợt 2</td>
                    <td style="color:#64748b;">K19-CNTT</td>
                    <td style="text-align:right;"><span class="badge-status-green">Đã gửi</span></td>
                  </tr>
                  <tr>
                    <td style="font-weight:700; color:#0f172a;">Thu học phí</td>
                    <td style="color:#334155; font-weight:600;">Thông báo thu học phí HK1</td>
                    <td style="color:#64748b;">Toàn trường</td>
                    <td style="text-align:right;"><span class="badge-status-green">Đã gửi</span></td>
                  </tr>
                </tbody>
              </table>
                        </div>
          </div>
          </div>
          </div>

          <!-- Right Column (Now Centered): Interactive Phone Emulator -->
          <div style="position:relative; margin-top:20px; display:flex; flex-direction:column; align-items:center;">
          
          <!-- 4 Buttons Floating Menu -->
          <div style="background:#fff; border-radius:30px; padding:8px 16px; display:flex; align-items:center; gap:16px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.1); margin-bottom: 24px; width:fit-content; position:relative; z-index:100;">
            <button type="button" onclick="togglePhoneSimMode('flutter')" style="background:#2563eb; color:#fff; border:none; border-radius:99px; padding:8px 16px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-size:13px; box-shadow:0 4px 10px rgba(37,99,235,0.3);">
              <span style="font-size:16px;">📱</span> Flutter App
            </button>

            <div style="width:1px; height:24px; background:#e2e8f0;"></div>

            <button type="button" onclick="togglePhoneSimMode('notif')" style="background:transparent; color:#475569; border:none; font-weight:700; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; font-size:11px;">
              <span style="font-size:16px; color:#f59e0b;">🔔</span> Thông Báo
            </button>
            
            <div style="width:1px; height:24px; background:#e2e8f0;"></div>

            <button type="button" onclick="document.getElementById('notifComposerModal').style.display='flex';" style="background:#8b5cf6; color:#fff; border:none; border-radius:99px; padding:8px 16px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-size:13px; box-shadow:0 4px 10px rgba(139,92,246,0.3);">
              <span style="font-size:16px;">📝</span> Soạn TB
            </button>

            <div style="width:1px; height:24px; background:#e2e8f0;"></div>

            <button type="button" onclick="window.open('/flutter_app_web/index.html', '_blank')" style="background:transparent; color:#475569; border:none; font-weight:700; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; font-size:11px;">
              <span style="font-size:16px; color:#10b981;">🌐</span> Mở App
            </button>

            <div style="width:1px; height:24px; background:#e2e8f0;"></div>

            <button type="button" onclick="requestRoleAccess('download-app')" style="background:transparent; color:#475569; border:none; font-weight:700; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; font-size:11px;">
              <span style="font-size:16px;">📥</span> Tải App
            </button>
          </div>
            <div id="mockPhoneContainer" style="background:#000000; border:2px solid #5a5a60; border-radius:55px; padding:10px; box-shadow:0 0 0 6px #131315, 0 35px 80px -15px rgba(0,0,0,0.5); width:380px; margin:0 auto; color:#0f172a; position:relative; transition:all 0.3s ease; box-sizing: border-box;">
              <!-- Hardware Buttons -->
              <div style="position:absolute; left:-6px; top:120px; width:4px; height:32px; background:#5a5a60; border-radius:4px 0 0 4px;"></div>
              <div style="position:absolute; left:-6px; top:170px; width:4px; height:60px; background:#5a5a60; border-radius:4px 0 0 4px;"></div>
              <div style="position:absolute; left:-6px; top:240px; width:4px; height:60px; background:#5a5a60; border-radius:4px 0 0 4px;"></div>
              <div style="position:absolute; right:-6px; top:190px; width:4px; height:80px; background:#5a5a60; border-radius:0 4px 4px 0;"></div>
              <div style="position:absolute; right:-6px; top:320px; width:4px; height:40px; background:#5a5a60; border-radius:0 4px 4px 0;"></div> <!-- Camera control -->

              <!-- Phone Viewport Screen Container -->
              <div id="mobileSimViewport" style="background:#f8fafc; border-radius:45px; height:800px; overflow:hidden; font-family:'Plus Jakarta Sans', sans-serif; position:relative; width: 100%; box-sizing: border-box;">
                
                <!-- Dynamic Island -->
                <div style="position:absolute; top:12px; left:50%; transform:translateX(-50%); width:120px; height:35px; background:#000000; border-radius:24px; z-index:9999; display:flex; justify-content:space-between; align-items:center; padding:0 12px; box-shadow:0 2px 10px rgba(0,0,0,0.5); pointer-events:none;">
                  <div style="width:12px; height:12px; background:#111; border-radius:50%; box-shadow: inset 0 0 4px rgba(255,255,255,0.1);"></div>
                  <div style="width:12px; height:12px; background:#150050; border-radius:50%; position:relative;">
                    <div style="position:absolute; top:3px; left:3px; width:6px; height:6px; background:#44aaff; border-radius:50%; filter:blur(1.5px);"></div>
                  </div>
                </div>

                <!-- Home Indicator -->
                <div style="position:absolute; bottom:8px; left:50%; transform:translateX(-50%); width:130px; height:5px; background:#1e293b; opacity:0.8; border-radius:100px; z-index:9999; pointer-events:none;"></div>
                <!-- Embedded Live Flutter Web App -->
                <iframe id="mobileSimIframe" src="/flutter_app_web/index.html" style="width:100%; height:100%; border:none; display:block;" title="QCET Student Mobile App"></iframe>

                <!-- Notification Preview Tab -->
                <div id="mobileSimNotifBox" style="display:none; height:100%; overflow-y:auto; padding:14px; background:#f8fafc;">
                  <!-- Rendered dynamically by switchMobileSimTab() -->
                </div>
              </div>

              <!-- Bottom Mock Phone Home Indicator Bar -->
              <div style="width:100px; height:4px; background:#94a3b8; border-radius:2px; margin:10px auto 2px;"></div>
            </div>
          </div>
        </div>
      `
    }
  },

  'download-app': {
    title: 'Tải Web thành App',
    subtitle: 'Tải ứng dụng QCET Smart cho điện thoại Android, iPhone, iPad & Phần mềm Máy tính PC',
    render: () => `
      <!-- 1. Top Forest Green Hero Banner Card (Dark Green Rounded) -->
      <div style="background: linear-gradient(135deg, #143823 0%, #1e4d30 100%); border-radius:28px; padding:36px 44px; color:#ffffff; margin-bottom:28px; box-shadow:0 12px 35px -5px rgba(20,56,35,0.3); border:1px solid #2d6a45; position:relative; overflow:hidden;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:24px; position:relative; z-index:2;">
          <div style="max-width:720px;">
            <h2 style="font-family:'Outfit', sans-serif; font-size:24px; font-weight:800; margin:0 0 12px 0; color:#ffffff; letter-spacing:0.5px; display:flex; align-items:center; gap:12px; text-transform:uppercase;">
              <span>📱</span> TẢI ỨNG DỤNG QCET SMART CHO ĐIỆN THOẠI & PHẦN MỀM MÁY TÍNH
            </h2>
            <p style="font-size:14.5px; color:#d1fae5; line-height:1.65; margin:0; opacity:0.92; font-weight:500;">
              Biến toàn bộ hệ thống Web Lớp Học Thông Minh QCET thành ứng dụng di động chạy mượt mà trên Android, iPhone, iPad và máy tính PC của bạn.
            </p>
          </div>
          <!-- Right Phone Graphic Icon -->
          <div style="width:72px; height:72px; background:rgba(255,255,255,0.12); border:2px solid rgba(255,255,255,0.25); border-radius:22px; display:flex; justify-content:center; align-items:center; font-size:38px; color:#ffffff; backdrop-filter:blur(6px);">
            📱
          </div>
        </div>
      </div>

      <!-- 2. Three Main Download Cards Grid -->
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:24px; margin-bottom:28px;">
        
        <!-- Card 1: App Android (APK) -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:32px 24px; text-align:center; box-shadow:0 8px 30px rgba(15,23,42,0.04); display:flex; flex-direction:column; align-items:center; justify-content:space-between; transition:transform 0.2s ease;">
          <div>
            <!-- Top Android Icon Circle -->
            <div style="width:68px; height:68px; background:#e6f4ea; border-radius:50%; display:flex; justify-content:center; align-items:center; margin:0 auto 16px; box-shadow:0 4px 14px rgba(16,185,129,0.15);">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#10b981"><path d="M6 18c0 .55.45 1 1 1h1v3c0 .55.45 1 1 1s1-.45 1-1v-3h4v3c0 .55.45 1 1 1s1-.45 1-1v-3h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-4.47l1.24-1.24c.2-.2.2-.51 0-.71a.498.498 0 00-.71 0l-1.42 1.42A7.95 7.95 0 0012 2.05c-1.39 0-2.69.35-3.83.97L6.75 1.6a.498.498 0 00-.71 0c-.2.2-.2.51 0 .71l1.24 1.24C5.45 4.96 4.25 6.7 4 8.75h16c-.25-2.05-1.45-3.79-3.47-5.22zM9 5.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
            </div>
            <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:800; color:#0f172a; margin:0 0 6px 0;">App Android (APK)</h3>
            
            <!-- Version Pill Badge -->
            <div style="display:inline-block; background:#f1f5f9; color:#64748b; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:16px;">
              Phiên bản v2.4 (APK)
            </div>
            
            <p style="font-size:13px; color:#64748b; line-height:1.6; margin:0 0 24px 0; font-weight:500;">
              Tải tệp cài đặt APK về điện thoại Android (Samsung, Xiaomi, Oppo, Realme...). Cài đặt trực tiếp và sử dụng mượt mà không cần qua Google Play Store.
            </p>
          </div>

          <a href="/api/download/app" download="QCET_Student_v1.0.4.apk" style="width:100%; background:#10b981; color:#ffffff; border:none; padding:14px 20px; border-radius:24px; font-weight:800; font-size:14.5px; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 6px 18px rgba(16,185,129,0.35); cursor:pointer;">
            <span>📥 Tải APK Android</span>
          </a>
        </div>

        <!-- Card 2: App iPhone / iPad (Highlighted with Green Border) -->
        <div style="background:#ffffff; border:2px solid #86efac; border-radius:24px; padding:32px 24px; text-align:center; box-shadow:0 10px 35px rgba(134,239,172,0.25); display:flex; flex-direction:column; align-items:center; justify-content:space-between; transition:transform 0.2s ease;">
          <div>
            <!-- Top Apple Icon Circle -->
            <div style="width:68px; height:68px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:50%; display:flex; justify-content:center; align-items:center; margin:0 auto 16px; box-shadow:0 4px 14px rgba(15,23,42,0.06);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#0f172a"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.09c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.15 1.86-1.01 2.96 1.07.08 2.16-.55 2.82-1.36z"/></svg>
            </div>
            <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:800; color:#0f172a; margin:0 0 6px 0;">App iPhone / iPad</h3>
            
            <!-- Version Pill Badge -->
            <div style="display:inline-block; background:#f1f5f9; color:#64748b; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:16px;">
              iOS Web App (PWA)
            </div>
            
            <p style="font-size:13px; color:#64748b; line-height:1.6; margin:0 0 24px 0; font-weight:500;">
              Cài đặt trực tiếp Web App lên Màn hình chính (Home Screen) của iPhone & iPad thông qua Safari. Hoạt động giống 100% ứng dụng native trên App Store.
            </p>
          </div>

          <a href="/api/download/ios" download="QCET_Student_v1.0.4.ipa" style="width:100%; background:#0f172a; color:#ffffff; border:none; padding:14px 20px; border-radius:24px; font-weight:800; font-size:14.5px; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 6px 18px rgba(15,23,42,0.3); cursor:pointer;">
            <span>📥 Tải Cho iPhone / iPad</span>
          </a>
        </div>

        <!-- Card 3: Phần Mềm PC Windows -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:32px 24px; text-align:center; box-shadow:0 8px 30px rgba(15,23,42,0.04); display:flex; flex-direction:column; align-items:center; justify-content:space-between; transition:transform 0.2s ease;">
          <div>
            <!-- Top Windows Icon Circle -->
            <div style="width:68px; height:68px; background:#e8f0fe; border-radius:50%; display:flex; justify-content:center; align-items:center; margin:0 auto 16px; box-shadow:0 4px 14px rgba(37,99,235,0.15);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#2563eb"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.851"/></svg>
            </div>
            <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:800; color:#0f172a; margin:0 0 6px 0;">Phần Mềm PC Windows</h3>
            
            <!-- Version Pill Badge -->
            <div style="display:inline-block; background:#f1f5f9; color:#64748b; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:16px;">
              Desktop App (.exe)
            </div>
            
            <p style="font-size:13px; color:#64748b; line-height:1.6; margin:0 0 24px 0; font-weight:500;">
              Tải phần mềm cài đặt dạng Desktop App (.exe) cho máy tính Windows 10/11. Khởi động nhanh, quản lý lớp học trực tiếp từ màn hình Desktop máy tính.
            </p>
          </div>

          <a href="/api/download/windows" download="QCET_Student_Windows.zip" style="width:100%; background:#2563eb; color:#ffffff; border:none; padding:14px 20px; border-radius:24px; font-weight:800; font-size:14.5px; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 6px 18px rgba(37,99,235,0.35); cursor:pointer;">
            <span>📄 Tải Cho Windows</span>
          </a>
        </div>

      </div>

      <!-- 3. Bottom QR Code Quick Scan Card -->
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:28px 36px; box-shadow:0 8px 30px rgba(15,23,42,0.04); margin-bottom:28px;">
        <div style="display:flex; align-items:center; gap:28px; flex-wrap:wrap;">
          
          <!-- Left Large Clean QR Code SVG Box -->
          <div style="width:130px; height:130px; background:#ffffff; border:1px solid #cbd5e1; border-radius:18px; padding:10px; display:flex; justify-content:center; align-items:center; box-shadow:0 4px 14px rgba(15,23,42,0.05); flex-shrink:0;">
            <svg width="110" height="110" viewBox="0 0 100 100" fill="#0f172a">
              <!-- Outer Border Frames -->
              <rect x="0" y="0" width="30" height="30" rx="4" fill="none" stroke="#0f172a" stroke-width="6"/>
              <rect x="8" y="8" width="14" height="14" rx="2" fill="#0f172a"/>
              
              <rect x="70" y="0" width="30" height="30" rx="4" fill="none" stroke="#0f172a" stroke-width="6"/>
              <rect x="78" y="8" width="14" height="14" rx="2" fill="#0f172a"/>
              
              <rect x="0" y="70" width="30" height="30" rx="4" fill="none" stroke="#0f172a" stroke-width="6"/>
              <rect x="8" y="78" width="14" height="14" rx="2" fill="#0f172a"/>

              <!-- Data Matrix Pixels -->
              <rect x="36" y="6" width="8" height="8" rx="1.5"/>
              <rect x="48" y="6" width="16" height="8" rx="1.5"/>
              <rect x="36" y="18" width="12" height="8" rx="1.5"/>
              <rect x="52" y="18" width="8" height="8" rx="1.5"/>

              <rect x="6" y="36" width="8" height="8" rx="1.5"/>
              <rect x="18" y="36" width="12" height="8" rx="1.5"/>
              <rect x="36" y="36" width="8" height="8" rx="1.5"/>
              <rect x="48" y="36" width="8" height="8" rx="1.5"/>
              <rect x="60" y="36" width="12" height="8" rx="1.5"/>
              <rect x="78" y="36" width="16" height="8" rx="1.5"/>

              <rect x="6" y="48" width="16" height="8" rx="1.5"/>
              <rect x="30" y="48" width="14" height="8" rx="1.5"/>
              <rect x="48" y="48" width="18" height="8" rx="1.5"/>
              <rect x="72" y="48" width="8" height="8" rx="1.5"/>

              <rect x="36" y="60" width="8" height="8" rx="1.5"/>
              <rect x="48" y="60" width="14" height="8" rx="1.5"/>
              <rect x="68" y="60" width="12" height="8" rx="1.5"/>
              <rect x="84" y="60" width="8" height="8" rx="1.5"/>

              <rect x="36" y="72" width="14" height="8" rx="1.5"/>
              <rect x="56" y="72" width="8" height="8" rx="1.5"/>
              <rect x="68" y="72" width="16" height="8" rx="1.5"/>

              <rect x="36" y="84" width="8" height="8" rx="1.5"/>
              <rect x="48" y="84" width="18" height="8" rx="1.5"/>
              <rect x="72" y="84" width="12" height="8" rx="1.5"/>
            </svg>
          </div>

          <!-- Right Text & Instructions -->
          <div style="flex:1;">
            <h4 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:800; color:#0f172a; margin:0 0 6px 0; display:flex; align-items:center; gap:8px;">
              <span>📷</span> Quét Mã QR Bằng Điện Thoại Để Tải Nhanh
            </h4>
            <p style="font-size:14px; color:#64748b; line-height:1.65; margin:0; font-weight:500;">
              Dùng ứng dụng Camera hoặc Zalo trên điện thoại quét mã QR bên cạnh để mở ngay liên kết tải App về máy di động của bạn trong 3 giây.
            </p>
          </div>

        </div>
      </div>

      <!-- 4. Embedded Live Interactive Flutter App View -->
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:28px; box-shadow:0 8px 30px rgba(15,23,42,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:800; color:#0f172a; margin:0;">
              Trải nghiệm Trực tiếp App Flutter (E:/FaceCheck/flutter_app)
            </h3>
              <div style="font-size:13px; color:#64748b; font-weight:600; margin-top:3px;">
              Toàn bộ dữ liệu hồ sơ Trương Đinh Thanh Thy, Thời khóa biểu & Bảng điểm 5 cột HS2
            </div>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button onclick="triggerFlutterTerminalLaunch()" style="background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color:#ffffff; border:none; padding:10px 18px; border-radius:12px; font-weight:800; font-size:13px; cursor:pointer; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(37,99,235,0.3);">
              🚀 Chạy flutter run -d chrome Terminal
            </button>
            <button onclick="window.open('/flutter_app_web/index.html', '_blank')" class="btn-teal-mobile" style="padding:10px 18px; font-weight:700;">
              🔗 Mở Cửa sổ Mới
            </button>
          </div>
        </div>

        <div id="flutterLaunchStatus" style="font-size:13px; font-weight:700; color:#64748b; margin-bottom:14px;"></div>

        <div style="width:100%; height:620px; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:20px; overflow:hidden;">
          <iframe src="/flutter_app_web/index.html" style="width:100%; height:100%; border:none;" title="QCET Student Flutter App"></iframe>
        </div>
      </div>
    `
  }
};

async function exportExcelLeaderReport() {
  const dateInput = document.getElementById('leaderFilterDate')?.value || getTodayDateString();
  const shiftSelect = document.getElementById('leaderFilterShift')?.value || 'Sáng';
  const deptSelect = document.getElementById('leaderFilterDept')?.value || 'Tất cả khoa';
  const classSelect = document.getElementById('leaderFilterClass')?.value || 'Tất cả lớp';

  // Lấy dữ liệu THẬT từ server đúng theo bộ lọc đang chọn
  await loadLeaderRealData(dateInput, shiftSelect);
  const rows = buildLeaderClassRows(deptSelect, classSelect);

  const grandTotal = rows.reduce((sum, r) => sum + r.total, 0);
  const totalPresent = rows.reduce((sum, r) => sum + r.present, 0);
  const totalAbsent = Math.max(0, grandTotal - totalPresent);
  const overallRate = grandTotal > 0 ? ((totalPresent / grandTotal) * 100).toFixed(1) + '%' : '0.0%';

  const csvData = [
    ["FaceCheck AI - BÁO CÁO TỔNG QUAN ĐIỂM DANH TOÀN TRƯỜNG (QCET)"],
    ["Ngày lọc:", dateInput],
    ["Buổi học:", shiftSelect],
    ["Khoa:", deptSelect],
    ["Lớp:", classSelect],
    ["Thời gian xuất báo cáo:", new Date().toLocaleString('vi-VN')],
    [],
    ["TỔNG SỐ LỚP:", rows.length],
    ["TỔNG SỐ SINH VIÊN:", grandTotal],
    ["SINH VIÊN CÓ MẶT (điểm danh Camera AI):", totalPresent],
    ["SINH VIÊN VẮNG:", totalAbsent],
    ["TỶ LỆ ĐIỂM DANH:", overallRate],
    [],
    ["MÃ LỚP", "PHÒNG", "GIÁO VIÊN", "SĨ SỐ", "CÓ MẶT", "VẮNG MẶT", "TỶ LỆ CHUYÊN CẦN"]
  ];

  rows.forEach(item => {
    const rate = item.total > 0 ? ((item.present / item.total) * 100).toFixed(1) + "%" : "0.0%";
    csvData.push([item.className, item.room, item.teacher, item.total, item.present, item.absent, rate]);
  });

  let csvContent = "\uFEFF"; // UTF-8 BOM for Vietnamese Excel compatibility
  csvData.forEach(row => {
    csvContent += row.map(e => `"${e}"`).join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `FaceCheck_TongQuan_DiemDanh_${shiftSelect}_${dateInput}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function switchRole(roleKey) {
  if (typeof stopRealWebcam === 'function') stopRealWebcam();
  if (typeof isAuthenticated !== 'undefined' && !isAuthenticated) {
    if (typeof requestRoleAccess === 'function') {
      requestRoleAccess(roleKey || 'leader');
    }
    return;
  }
  executeRoleSwitch(roleKey || 'leader');
}

function toggleMobileSidebar(open) {
  const sidebar = document.getElementById('mainSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  
  if (sidebar && backdrop) {
    if (open === undefined) {
      open = !sidebar.classList.contains('mobile-active');
    }
    
    if (open) {
      sidebar.classList.add('mobile-active');
      backdrop.classList.add('active');
    } else {
      sidebar.classList.remove('mobile-active');
      backdrop.classList.remove('active');
    }
  }
}

function executeRoleSwitch(roleKey) {
  const targetKey = roleKey || 'leader';
  try {
    if (currentRole === 'teacher' && targetKey !== 'teacher' && typeof stopRealWebcam === 'function') {
      stopRealWebcam();
    }
    currentRole = targetKey;

    // Auto-close mobile sidebar on role selection
    toggleMobileSidebar(false);

    // Ensure Admin Workspace page is visible when authenticated
    const loginPage = document.getElementById('loginPage');
    const adminPage = document.getElementById('adminPage');
    if (loginPage && adminPage) {
      loginPage.classList.remove('active');
      loginPage.style.display = 'none';
      adminPage.classList.add('active');
      adminPage.style.display = 'flex';
    }

    document.querySelectorAll('.sidebar-nav-item').forEach(el => el.classList.remove('active'));
    const activeMenu = document.getElementById(`menu-${targetKey}`);
    if (activeMenu) activeMenu.classList.add('active');

    const config = roleConfig[targetKey] || roleConfig['leader'];
    if (config) {
      const pageTitle = document.getElementById('pageTitle');
      const pageSubtitle = document.getElementById('pageSubtitle');
      const contentPanel = document.getElementById('contentPanel');

      if (pageTitle) pageTitle.innerText = config.title;
      if (pageSubtitle) pageSubtitle.innerText = config.subtitle;
      if (contentPanel) contentPanel.innerHTML = config.render();
      
      const topHeaderGlass = document.querySelector('.top-header-glass');
      if (topHeaderGlass) {
        if (targetKey === 'notification') {
          topHeaderGlass.style.display = 'none';
        } else {
          topHeaderGlass.style.display = 'flex'; // it's display:flex in css
        }
      }

      if (targetKey === 'training') {
        switchTrainingTab(activeTrainingTab || 'khoa');
      }
    }
  } catch (err) {
    console.error('Lỗi chuyển đổi vai trò:', err);
  }
}

function openDownloadAppModal() {
  const modal = document.getElementById('downloadAppModalOverlay');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeDownloadAppModal() {
  const modal = document.getElementById('downloadAppModalOverlay');
  if (modal) {
    modal.style.display = 'none';
  }
}

function triggerFlutterTerminalLaunch() {
  const statusEl = document.getElementById('flutterLaunchStatus');
  if (statusEl) {
    statusEl.innerHTML = '⚠️ Chức năng tự động chạy (auto-launch) đã bị tắt vì lý do bảo mật. Vui lòng tự chạy "flutter run".';
    statusEl.style.color = '#d97706';
  }
  
  // Chỉ mở tab preview
  setTimeout(() => {
    window.open('/flutter_app_web/index.html', '_blank');
  }, 1000);
}

function togglePhoneSimMode(mode) {
  const iframe = document.getElementById('mobileSimIframe');
  const notifBox = document.getElementById('mobileSimNotifBox');
  const btnFlutter = document.getElementById('btnPhoneModeFlutter');
  const btnNotif = document.getElementById('btnPhoneModeNotif');

  if (mode === 'flutter') {
    if (iframe) iframe.style.display = 'block';
    if (notifBox) notifBox.style.display = 'none';
    if (btnFlutter) { btnFlutter.style.background = '#2563eb'; btnFlutter.style.color = '#ffffff'; }
    if (btnNotif) { btnNotif.style.background = 'transparent'; btnNotif.style.color = '#64748b'; }
  } else {
    if (iframe) iframe.style.display = 'none';
    if (notifBox) notifBox.style.display = 'block';
    if (btnFlutter) { btnFlutter.style.background = 'transparent'; btnFlutter.style.color = '#64748b'; }
    if (btnNotif) { btnNotif.style.background = '#2563eb'; btnNotif.style.color = '#ffffff'; }
  }
}

// Page load initialization
document.addEventListener('DOMContentLoaded', () => {
  loadPersistentData();
  updateLiveHeaderDateTime();
  checkBackendHealth();
  
  // Restore an existing session if the user simply refreshed the page,
  // otherwise show the Login screen on initial launch.
  let restored = null;
  try {
    const raw = sessionStorage.getItem('facecheck_session');
    if (raw) restored = JSON.parse(raw);
  } catch (e) {}

  const loginPage = document.getElementById('loginPage');
  const adminPage = document.getElementById('adminPage');

  if (restored && restored.email) {
    if (typeof isAuthenticated !== 'undefined') isAuthenticated = true;
    executeRoleSwitch(restored.role || 'leader');
    return;
  }

  if (loginPage && adminPage) {
    loginPage.classList.add('active');
    loginPage.style.display = 'flex';
    adminPage.classList.remove('active');
    adminPage.style.display = 'none';
  }
});



window.toggleFinanceStudentList = function() {
  const target = document.getElementById('financeTargetSelect').value;
  const section = document.getElementById('financeStudentListSection');
  if (target === 'Từng cá nhân sinh viên') {
    section.style.display = 'block';
    const cls = document.getElementById('financeClassSelect').value;
    const container = document.getElementById('financeStudentTableContainer');
    
    // Get students for this class
    let students = studentsData ? studentsData.filter(s => s.className === cls) : [];
    
    if (students.length === 0) {
      container.innerHTML = '<p style="color:#ef4444; font-size:13px; font-style:italic;">Không có dữ liệu sinh viên cho lớp này.</p>';
      return;
    }
    
    let html = '<table style="width:100%; border-collapse:collapse; font-size:13px;">';
    students.forEach((st, idx) => {
      html += '<tr style="border-bottom:1px solid #e2e8f0;">';
      html += '<td style="padding:8px 4px; font-weight:600; color:#334155;">' + st.name + '<br><span style="font-size:11px; color:#94a3b8; font-weight:normal;">' + st.id + '</span></td>';
      html += '<td style="padding:8px 4px;">';
      html += '<input type="text" id="debt_' + idx + '" placeholder="Nhập số tiền/nội dung..." style="width:100%; padding:6px; border:1px solid #cbd5e1; border-radius:4px;" />';
      html += '</td>';
      html += '<td style="padding:8px 4px; text-align:right; min-width:60px;">';
      html += '<button type="button" onclick="sendFinanceNoticeToStudent(\'' + st.name + '\', \'debt_' + idx + '\')" style="padding:6px 12px; background:#10b981; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Gửi</button>';
      html += '</td>';
      html += '</tr>';
    });
    html += '</table>';
    container.innerHTML = html;
  } else {
    section.style.display = 'none';
  }
};

window.sendFinanceNoticeToStudent = async function(studentName, inputId) {
  const amount = document.getElementById(inputId).value;
  if (!amount.trim()) {
    customAlert('Vui lòng nhập số tiền nợ hoặc nội dung cho sinh viên ' + studentName);
    return;
  }
  
  try {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Thông báo tài chính',
        content: `[Gửi riêng ${studentName}] ${amount}`,
        type: 'finance'
      })
    });
  } catch (e) {}

  customAlert('Đã gửi thông báo đến TÀI KHOẢN CÁ NHÂN của sinh viên [' + studentName + '].\nNội dung: ' + amount);
  const simFrame = document.getElementById('flutterAppFrame');
  if (simFrame) simFrame.contentWindow.location.reload();
    fetchFinanceHistory();
};

window.sendFinanceNotice = async function(event) {
  event.preventDefault();
  const target = document.getElementById('financeTargetSelect').value;
  const cls = document.getElementById('financeClassSelect').value;
  const content = document.getElementById('financeContentInput').value;
  const type = document.getElementById('financeTypeSelect').value;
  
  if (target === 'Từng cá nhân sinh viên') {
    customAlert('Vui lòng sử dụng nút [Gửi] tương ứng bên cạnh từng sinh viên trong danh sách ở dưới.');
    return;
  }
  
  let targetStr = target === 'Theo Lớp / Khoa' ? cls : 'Toàn trường';
  
  try {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: type,
        content: `[${targetStr}] ${content}`,
        type: 'finance'
      })
    });
  } catch (e) {}
  
  customAlert('Đã gửi thông báo [' + type + '] đến [' + targetStr + ']!\nNội dung: ' + content);
  const simFrame = document.getElementById('flutterAppFrame');
  if (simFrame) simFrame.contentWindow.location.reload();
    fetchFinanceHistory();
};


window.openEditDepartmentModal = function(code) {
  const dept = departmentsData.find(d => d.code === code);
  if (!dept) return;
  const overlay = document.getElementById('dataModalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  title.innerText = 'Sửa thông tin Khoa';
  body.innerHTML = `
    <form onsubmit="saveEditDepartment(event, '${code}')">
      <div class="modal-field">
        <label>Mã khoa</label>
        <input type="text" class="modal-input" id="editDeptCode" value="${dept.code}" required />
      </div>
      <div class="modal-field">
        <label>Tên Khoa</label>
        <input type="text" class="modal-input" id="editDeptName" value="${dept.name}" required />
      </div>
      <div class="modal-field">
        <label>Mô tả chi tiết</label>
        <input type="text" class="modal-input" id="editDeptEn" value="${dept.desc}" required />
      </div>
      <div class="modal-actions">
        <button type="button" class="btn-modal-cancel" onclick="closeDataModal()">Hủy</button>
        <button type="submit" class="btn-modal-submit">Lưu thay đổi</button>
      </div>
    </form>
  `;
  if (overlay) overlay.style.display = 'flex';
};

window.saveEditDepartment = async function(e, code) {
  e.preventDefault();
  const c = document.getElementById('editDeptCode').value.trim();
  const n = document.getElementById('editDeptName').value.trim();
  const d = document.getElementById('editDeptEn').value.trim();
  if (!c || !n || !d) return;
  const idx = departmentsData.findIndex(x => x.code === code);
  if (idx > -1) {
    const res = await apiCall('/api/departments/update', 'POST', { oldCode: code, code: c, name: n, desc: d });
    if (res.success) {
      departmentsData[idx] = { code: c, name: n, desc: d };
      closeDataModal();
      if (typeof switchTrainingTab === 'function') switchTrainingTab('khoa');
    } else {
      alert('Lỗi: ' + res.error);
    }
  }
};


window.closeDataModal = function() {
    const modal = document.getElementById('dataModalOverlay');
    if (modal) {
        modal.style.display = 'none';
    }
};

window.openEditTeacherModal = function(name) {
  const t = teachersData.find(x => x.name === name);
  if (!t) return;
  const overlay = document.getElementById('dataModalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  title.innerText = 'Sửa thông tin Giảng viên';
  body.innerHTML = `
    <form onsubmit="saveEditTeacher(event, '${name}')">
      <div class="modal-field">
        <label>Họ và tên</label>
        <input type="text" class="modal-input" id="editTeachName" value="${t.name}" required />
      </div>
      <div class="modal-field">
        <label>Email liên hệ</label>
        <input type="email" class="modal-input" id="editTeachEmail" value="${t.email}" required />
      </div>
      <div class="modal-field">
        <label>Thuộc khoa</label>
        <input type="text" class="modal-input" id="editTeachDept" value="${t.dept}" required />
      </div>
      <div class="modal-field">
        <label>Môn giảng dạy</label>
        <input type="text" class="modal-input" id="editTeachCourses" value="${t.courses}" required />
      </div>
      <div class="modal-field">
        <label>Số điện thoại</label>
        <input type="text" class="modal-input" id="editTeachPhone" value="${t.phone}" required />
      </div>
      <div class="modal-actions">
        <button type="button" class="btn-modal-cancel" onclick="closeDataModal()">Hủy</button>
        <button type="submit" class="btn-modal-submit">Lưu thay đổi</button>
      </div>
    </form>
  `;
  if (overlay) overlay.style.display = 'flex';
};

window.saveEditTeacher = async function(e, oldName) {
  e.preventDefault();
  const n = document.getElementById('editTeachName').value.trim();
  const em = document.getElementById('editTeachEmail').value.trim();
  const d = document.getElementById('editTeachDept').value;
  const p = document.getElementById('editTeachPhone').value.trim();
  const c = document.getElementById('editTeachCourse').value;
  if (!n) return;
  const idx = teachersData.findIndex(x => x.name === oldName);
  if (idx > -1) {
    const res = await apiCall('/api/teachers/update', 'POST', { oldName, name: n, email: em, dept: d, phone: p, courses: c });
    if (res.success) {
      teachersData[idx] = { name: n, email: em, dept: d, phone: p, courses: c };
      closeDataModal();
      if (typeof switchTrainingTab === 'function') switchTrainingTab('giaovien');
    } else {
      alert('Lỗi: ' + res.error);
    }
  }
};

window.openEditCourseModal = function(code) {
  const c = coursesData.find(x => x.code === code);
  if (!c) return;
  const overlay = document.getElementById('dataModalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  title.innerText = 'Sửa thông tin Môn học';
  body.innerHTML = `
    <form onsubmit="saveEditCourse(event, '${code}')">
      <div class="modal-field">
        <label>Mã môn học / mô đun</label>
        <input type="text" class="modal-input" id="editCourseCode" value="${c.code}" required />
      </div>
      <div class="modal-field">
        <label>Tên môn học</label>
        <input type="text" class="modal-input" id="editCourseName" value="${c.name}" required />
      </div>
      <div class="modal-field">
        <label>Số tín chỉ</label>
        <input type="number" class="modal-input" id="editCourseCredits" value="${c.credits}" required />
      </div>
      <div class="modal-field">
        <label>Khoa phụ trách</label>
        <input type="text" class="modal-input" id="editCourseDept" value="${c.dept}" required />
      </div>
      <div class="modal-actions">
        <button type="button" class="btn-modal-cancel" onclick="closeDataModal()">Hủy</button>
        <button type="submit" class="btn-modal-submit">Lưu thay đổi</button>
      </div>
    </form>
  `;
  if (overlay) overlay.style.display = 'flex';
};

window.saveEditCourse = async function(e, oldCode) {
  e.preventDefault();
  const c = document.getElementById('editCourseCode').value.trim();
  const n = document.getElementById('editCourseName').value.trim();
  const d = document.getElementById('editCourseDept').value;
  const cr = document.getElementById('editCourseCredit').value;
  if (!c || !n) return;
  const idx = coursesData.findIndex(x => x.code === oldCode);
  if (idx > -1) {
    const res = await apiCall('/api/courses/update', 'POST', { oldCode, code: c, name: n, dept: d, credits: cr });
    if (res.success) {
      coursesData[idx] = { code: c, name: n, dept: d, credits: cr };
      closeDataModal();
      if (typeof switchTrainingTab === 'function') switchTrainingTab('monhoc');
    } else {
      alert('Lỗi: ' + res.error);
    }
  }
};



window.openAddStudentModal = function() {
  const overlay = document.getElementById('dataModalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  if (title) title.innerText = 'Thêm Sinh viên';
  if (body) {
    const opts = typeof classesList !== 'undefined' ? classesList.map(c => `<option value="${c}">${c}</option>`).join('') : '';
    body.innerHTML = `
      <form onsubmit="saveNewStudent(event)">
        <div class="modal-field">
          <label>Mã Sinh Viên</label>
          <input type="text" id="newStudentId" class="modal-input" placeholder="VD: SV123456" required />
        </div>
        <div class="modal-field">
          <label>Họ và Tên</label>
          <input type="text" id="newStudentName" class="modal-input" placeholder="Họ tên sinh viên..." required />
        </div>
        <div class="modal-field">
          <label>Lớp học</label>
          <select id="newStudentClass" class="modal-input" required>${opts}</select>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-modal-cancel" onclick="closeDataModal()">Hủy</button>
          <button type="submit" class="btn-modal-submit">Lưu Sinh viên</button>
        </div>
      </form>
    `;
  }
  if (overlay) overlay.style.display = 'flex';
};

window.saveNewStudent = async function(e) {
  e.preventDefault();
  const sid = document.getElementById('newStudentId').value.trim();
  const sname = document.getElementById('newStudentName').value.trim();
  const sclass = document.getElementById('newStudentClass').value;
  if (!sid || !sname || !sclass) return;
  
  if (studentsData.find(s => s.id === sid)) {
    if (typeof customAlert === 'function') customAlert('Mã sinh viên đã tồn tại!');
    else alert('Mã sinh viên đã tồn tại!');
    return;
  }
  
  const res = await apiCall('/api/students/add', 'POST', { id: sid, name: sname, className: sclass });
  if (res.success) {
    studentsData.push({ id: sid, name: sname, class: sclass });
    closeDataModal();
    if (typeof switchTrainingTab === 'function') switchTrainingTab('sinhvien');
  } else {
    alert('Lỗi: ' + res.error);
  }
};

window.openEditStudentModal = function(sid) {
  const overlay = document.getElementById('dataModalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  const student = studentsData.find(s => s.id === sid);
  if (!student) return;

  if (title) title.innerText = 'Sửa Sinh viên';
  if (body) {
    const opts = typeof classesList !== 'undefined' ? classesList.map(c => `<option value="${c}" ${c === student.class ? 'selected' : ''}>${c}</option>`).join('') : '';
    body.innerHTML = `
      <form onsubmit="saveEditStudent(event, '${sid}')">
        <div class="modal-field">
          <label>Mã Sinh Viên (Không thể sửa)</label>
          <input type="text" class="modal-input" value="${student.id}" readonly style="background:#f1f5f9; cursor:not-allowed;" />
        </div>
        <div class="modal-field">
          <label>Họ và Tên</label>
          <input type="text" id="editStudentName" class="modal-input" value="${student.name}" required />
        </div>
        <div class="modal-field">
          <label>Lớp học</label>
          <select id="editStudentClass" class="modal-input" required>${opts}</select>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-modal-cancel" onclick="closeDataModal()">Hủy</button>
          <button type="submit" class="btn-modal-submit" style="background:linear-gradient(135deg, #3b82f6, #2563eb); box-shadow:0 4px 14px rgba(59,130,246,0.3);">Lưu Cập nhật</button>
        </div>
      </form>
    `;
  }
  if (overlay) overlay.style.display = 'flex';
};

window.saveEditStudent = async function(e, sid) {
  e.preventDefault();
  const sname = document.getElementById('editStudentName').value.trim();
  const sclass = document.getElementById('editStudentClass').value;
  if (!sname || !sclass) return;
  
  const studentIndex = studentsData.findIndex(s => s.id === sid);
  if (studentIndex > -1) {
    const res = await apiCall('/api/students/update', 'POST', { id: sid, name: sname, className: sclass });
    if (res.success) {
      studentsData[studentIndex].name = sname;
      studentsData[studentIndex].class = sclass;
      closeDataModal();
      if (typeof switchTrainingTab === 'function') switchTrainingTab('sinhvien');
    } else {
      alert('Lỗi: ' + res.error);
    }
  }
};

window.openAddClassModal = function() {
  const overlay = document.getElementById('dataModalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  if (title) title.innerText = 'Thêm Lớp học';
  if (body) {
    body.innerHTML = `
      <form onsubmit="saveNewClass(event)">
        <div class="modal-field">
          <label>Mã / Tên Lớp</label>
          <input type="text" id="newClassName" class="modal-input" required />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-modal-cancel" onclick="closeDataModal()">Hủy</button>
          <button type="submit" class="btn-modal-submit">Lưu Lớp học</button>
        </div>
      </form>
    `;
  }
  if (overlay) overlay.style.display = 'flex';
};

window.saveNewClass = async function(e) {
  e.preventDefault();
  const ccode = document.getElementById('newClassCode').value.trim();
  const cname = document.getElementById('newClassName').value.trim();
  const cdept = document.getElementById('newClassDept').value;
  if (!cname || !ccode || !cdept) return;
  
  if (typeof classesList !== 'undefined') {
    if (classesList.includes(cname)) {
      if (typeof customAlert === 'function') customAlert('Lớp học đã tồn tại!');
      else alert('Lớp học đã tồn tại!');
      return;
    }
    const res = await apiCall('/api/classes/add', 'POST', { className: cname, code: ccode, dept: cdept });
    if (res.success) {
      classesList.push(cname);
      if (classesData) classesData.push({ className: cname, code: ccode, dept: cdept, size: 0 });
      closeDataModal();
      if (typeof switchTrainingTab === 'function') switchTrainingTab('lophoc');
    } else {
      alert('Lỗi: ' + res.error);
    }
  }
};

window.openEditClassModal = function(oldClassName) {
  const overlay = document.getElementById('dataModalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  if (title) title.innerText = 'Sửa Lớp học';
  if (body) {
    body.innerHTML = `
      <form onsubmit="saveEditClass(event, '${oldClassName}')">
        <div class="modal-field">
          <label>Tên Lớp (Mới)</label>
          <input type="text" id="editClassName" class="modal-input" value="${oldClassName}" required />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-modal-cancel" onclick="closeDataModal()">Hủy</button>
          <button type="submit" class="btn-modal-submit" style="background:linear-gradient(135deg, #3b82f6, #2563eb); box-shadow:0 4px 14px rgba(59,130,246,0.3);">Lưu Cập nhật</button>
        </div>
      </form>
    `;
  }
  if (overlay) overlay.style.display = 'flex';
};

window.saveEditClass = async function(e, oldClassName) {
  e.preventDefault();
  const ccode = document.getElementById('editClassCode').value.trim();
  const cname = document.getElementById('editClassName').value.trim();
  const cdept = document.getElementById('editClassDept').value;
  if (!cname || !ccode || !cdept) return;
  
  if (typeof classesList !== 'undefined') {
    if (cname !== oldClassName && classesList.includes(cname)) {
      if (typeof customAlert === 'function') customAlert('Tên lớp học này đã tồn tại!');
      else alert('Tên lớp học này đã tồn tại!');
      return;
    }
    const idx = classesList.indexOf(oldClassName);
    if (idx > -1) {
      const res = await apiCall('/api/classes/update', 'POST', { oldClassName, newClassName: cname, code: ccode, dept: cdept });
      if (res.success) {
        classesList[idx] = cname;
        if (classesData) {
          const cData = classesData.find(x => x.className === oldClassName);
          if (cData) {
            cData.className = cname;
            cData.code = ccode;
            cData.dept = cdept;
          }
        }
        if (typeof studentsData !== 'undefined') {
          studentsData.forEach(s => {
            if (s.class === oldClassName) s.class = cname;
            if (s.className === oldClassName) s.className = cname;
          });
        }
        closeDataModal();
        if (typeof switchTrainingTab === 'function') switchTrainingTab('lophoc');
      } else {
        alert('Lỗi: ' + res.error);
      }
    }
  }
};

window.openAddDepartmentModal = function() {
  const overlay = document.getElementById('dataModalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  if (title) title.innerText = 'Thêm Khoa';
  if (body) {
    body.innerHTML = `
      <form onsubmit="saveNewDepartment(event)">
        <div class="modal-field">
          <label>Mã Khoa</label>
          <input type="text" id="newDeptCode" class="modal-input" required />
        </div>
        <div class="modal-field">
          <label>Tên Khoa</label>
          <input type="text" id="newDeptName" class="modal-input" required />
        </div>
        <div class="modal-field">
          <label>Mô tả</label>
          <input type="text" id="newDeptDesc" class="modal-input" />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-modal-cancel" onclick="closeDataModal()">Hủy</button>
          <button type="submit" class="btn-modal-submit">Lưu Khoa</button>
        </div>
      </form>
    `;
  }
  if (overlay) overlay.style.display = 'flex';
};

window.saveNewDepartment = async function(e) {
  e.preventDefault();
  const c = document.getElementById('newDeptCode').value.trim();
  const n = document.getElementById('newDeptName').value.trim();
  const d = document.getElementById('newDeptEn').value.trim();
  if (!c || !n || !d) return;
  if (departmentsData.find(x => x.code === c)) {
    alert('Mã khoa đã tồn tại!'); return;
  }
  const res = await apiCall('/api/departments/add', 'POST', { code: c, name: n, desc: d });
  if (res.success) {
    departmentsData.push({ code: c, name: n, desc: d });
    closeDataModal();
    if (typeof switchTrainingTab === 'function') switchTrainingTab('khoa');
  } else {
    alert('Lỗi: ' + res.error);
  }
};

window.openAddTeacherModal = function() {
  const overlay = document.getElementById('dataModalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  if (title) title.innerText = 'Thêm Giáo viên';
  if (body) {
    body.innerHTML = `
      <form onsubmit="saveNewTeacher(event)">
        <div class="modal-field">
          <label>Họ và tên</label>
          <input type="text" id="newTeacherName" class="modal-input" required />
        </div>
        <div class="modal-field">
          <label>Email</label>
          <input type="email" id="newTeacherEmail" class="modal-input" required />
        </div>
        <div class="modal-field">
          <label>Khoa</label>
          <input type="text" id="newTeacherDept" class="modal-input" required />
        </div>
        <div class="modal-field">
          <label>Môn giảng dạy</label>
          <input type="text" id="newTeacherCourses" class="modal-input" required />
        </div>
        <div class="modal-field">
          <label>SĐT</label>
          <input type="text" id="newTeacherPhone" class="modal-input" required />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-modal-cancel" onclick="closeDataModal()">Hủy</button>
          <button type="submit" class="btn-modal-submit">Lưu Giáo viên</button>
        </div>
      </form>
    `;
  }
  if (overlay) overlay.style.display = 'flex';
};

window.saveNewTeacher = async function(e) {
  e.preventDefault();
  const n = document.getElementById('newTeacherName').value.trim();
  const em = document.getElementById('newTeacherEmail').value.trim();
  const d = document.getElementById('newTeacherDept').value;
  const p = document.getElementById('newTeacherPhone').value.trim();
  const c = document.getElementById('newTeacherCourse').value;
  if (!n) return;
  if (teachersData.find(x => x.name === n)) {
    alert('Giáo viên đã tồn tại!'); return;
  }
  const res = await apiCall('/api/teachers/add', 'POST', { name: n, email: em, dept: d, phone: p, courses: c });
  if (res.success) {
    teachersData.push({ name: n, email: em, dept: d, phone: p, courses: c });
    closeDataModal();
    if (typeof switchTrainingTab === 'function') switchTrainingTab('giaovien');
  } else {
    alert('Lỗi: ' + res.error);
  }
};

window.openAddCourseModal = function() {
  const overlay = document.getElementById('dataModalOverlay');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  
  if (title) title.innerText = 'Thêm Môn học';
  if (body) {
    body.innerHTML = `
      <form onsubmit="saveNewCourse(event)">
        <div class="modal-field">
          <label>Mã Môn</label>
          <input type="text" id="newCourseCode" class="modal-input" required />
        </div>
        <div class="modal-field">
          <label>Tên Môn</label>
          <input type="text" id="newCourseName" class="modal-input" required />
        </div>
        <div class="modal-field">
          <label>Số tín chỉ</label>
          <input type="number" id="newCourseCredits" class="modal-input" required />
        </div>
        <div class="modal-field">
          <label>Khoa</label>
          <input type="text" id="newCourseDept" class="modal-input" required />
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-modal-cancel" onclick="closeDataModal()">Hủy</button>
          <button type="submit" class="btn-modal-submit">Lưu Môn học</button>
        </div>
      </form>
    `;
  }
  if (overlay) overlay.style.display = 'flex';
};

window.saveNewCourse = async function(e) {
  e.preventDefault();
  const c = document.getElementById('newCourseCode').value.trim();
  const n = document.getElementById('newCourseName').value.trim();
  const d = document.getElementById('newCourseDept').value;
  const cr = document.getElementById('newCourseCredit').value;
  if (!c || !n) return;
  if (coursesData.find(x => x.code === c)) {
    alert('Mã môn đã tồn tại!'); return;
  }
  const res = await apiCall('/api/courses/add', 'POST', { code: c, name: n, dept: d, credits: cr });
  if (res.success) {
    coursesData.push({ code: c, name: n, dept: d, credits: cr });
    closeDataModal();
    if (typeof switchTrainingTab === 'function') switchTrainingTab('monhoc');
  } else {
    alert('Lỗi: ' + res.error);
  }
};



async function fetchInitialData() {
    try {
        const [depRes, courRes, teachRes, studRes, timeRes, clsRes] = await Promise.all([
            fetch('/api/departments'),
            fetch('/api/courses'),
            fetch('/api/teachers'),
            fetch('/api/students'),
            fetch('/api/timetables'),
            fetch('/api/classes')
        ]);
        if(depRes.ok) departmentsData = await depRes.json();
        if(courRes.ok) coursesData = await courRes.json();
        if(teachRes.ok) teachersData = await teachRes.json();
        if(studRes.ok) studentsData = await studRes.json();
        if(timeRes.ok) timetableData = await timeRes.json();
        if(clsRes && clsRes.ok) classesData = await clsRes.json();
        
        console.log('✅ Fetched initial data from backend!');
        fetchFinanceHistory();
        
        // re-render the current view if any
        if (window.currentRoleKey) {
            executeRoleSwitch(window.currentRoleKey);
        }
    } catch(err) {
        console.error('Failed to fetch data from backend:', err);
    }
}
window.fetchInitialData = fetchInitialData;

// Call it on load
document.addEventListener('DOMContentLoaded', () => {
    fetchInitialData();
});


async function fetchFinanceHistory() {
  try {
    const res = await fetch('/api/notifications');
    if (res.ok) {
      const data = await res.json();
      const financeNotifs = data.filter(n => n.type === 'finance');
      financeSentHistory = financeNotifs.map(n => ({
        content: n.content,
        target: n.target,
        time: n.timestamp,
        statusText: 'Thành công',
        type: 'green'
      }));
      refreshFinanceTable();
    }
  } catch(e) {
    console.error('Failed to fetch finance history', e);
  }
}
window.fetchFinanceHistory = fetchFinanceHistory;

window.deleteClass = async function(cname) {
  const ok = await customConfirm('Bạn có chắc chắn muốn xóa lớp ' + cname + '?');
  if (!ok) return;
  const idx = classesList.indexOf(cname);
  if (idx > -1) classesList.splice(idx, 1);
  if (typeof classesData !== 'undefined' && classesData) {
    classesData = classesData.filter(x => x.className !== cname);
  }
  if (typeof savePersistentData === 'function') savePersistentData();
  if (typeof switchTrainingTab === 'function') switchTrainingTab('lophoc');
  if (typeof window.showCustomToast === 'function') window.showCustomToast('Đã xóa lớp ' + cname + ' thành công!', 'success');

  try {
    await fetch('/api/classes/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ className: cname })
    });
  } catch(e) {}
};

window.deleteStudent = async function(sid) {
  const ok = await customConfirm('Bạn có chắc chắn muốn xóa sinh viên này?');
  if (!ok) return;
  if (typeof studentsData !== 'undefined') {
    studentsData = studentsData.filter(x => x.id !== sid);
  }
  if (typeof savePersistentData === 'function') savePersistentData();
  if (typeof switchTrainingTab === 'function') switchTrainingTab('sinhvien');
  if (typeof window.showCustomToast === 'function') window.showCustomToast('Đã xóa sinh viên thành công!', 'success');

  try {
    await fetch('/api/students/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sid })
    });
  } catch(e) {}
};

window.deleteDepartment = async function(code) {
  const ok = await customConfirm('Bạn có chắc chắn muốn xóa Khoa này?');
  if (!ok) return;
  if (typeof departmentsData !== 'undefined') {
    departmentsData = departmentsData.filter(x => x.code !== code);
  }
  if (typeof savePersistentData === 'function') savePersistentData();
  if (typeof switchTrainingTab === 'function') switchTrainingTab('khoa');
  if (typeof window.showCustomToast === 'function') window.showCustomToast('Đã xóa Khoa thành công!', 'success');

  try {
    await fetch('/api/departments/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
  } catch(e) {}
};

window.deleteTeacher = async function(name) {
  const ok = await customConfirm('Bạn có chắc chắn muốn xóa giáo viên ' + name + '?');
  if (!ok) return;
  if (typeof teachersData !== 'undefined') {
    teachersData = teachersData.filter(x => x.name !== name);
  }
  if (typeof savePersistentData === 'function') savePersistentData();
  if (typeof switchTrainingTab === 'function') switchTrainingTab('giaovien');
  if (typeof window.showCustomToast === 'function') window.showCustomToast('Đã xóa giáo viên ' + name + ' thành công!', 'success');

  try {
    await fetch('/api/teachers/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
  } catch(e) {}
};

window.deleteCourse = async function(code, idx) {
  const ok = await customConfirm('Bạn có chắc chắn muốn xóa môn học này?');
  if (!ok) return;
  
  let targetCode = code;
  let targetName = '';
  
  if (typeof coursesData !== 'undefined') {
    if (typeof idx === 'number' && coursesData[idx]) {
      targetCode = coursesData[idx].code;
      targetName = coursesData[idx].name;
      coursesData.splice(idx, 1);
    } else {
      const match = coursesData.find(x => x.code === code || x.code === code.replace('>', '&GT') || x.name === code);
      if (match) {
        targetCode = match.code;
        targetName = match.name;
      }
      coursesData = coursesData.filter(x => x.code !== code && x.code !== targetCode && x.name !== targetName);
    }
  }
  
  if (typeof savePersistentData === 'function') savePersistentData();
  if (typeof switchTrainingTab === 'function') switchTrainingTab('monhoc');
  if (typeof window.showCustomToast === 'function') window.showCustomToast('Đã xóa môn học thành công!', 'success');

  try {
    await fetch('/api/courses/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: targetCode, name: targetName })
    });
  } catch(e) {}
};



window.teacherVideoStream = null;

window.teacherScanInterval = null;
window.alreadyScannedSet = window.alreadyScannedSet || new Set();

window.scanCameraAttendanceReal = function(student) {
    if (window.alreadyScannedSet.has(student.id)) return;
    
    const idEl = document.getElementById('hudStudentId');
    const nameEl = document.getElementById('hudStudentName');
    const pillEl = document.getElementById('hudStatusPill');
    
    if(idEl) idEl.innerText = student.id;
    if(nameEl) nameEl.innerText = student.name.toUpperCase();
    if(pillEl) {
        pillEl.innerText = "✔️ Đã điểm danh";
        pillEl.style.background = '#10b981';
    }
    
    window.alreadyScannedSet.add(student.id);
    
    const tbody = document.getElementById('teacherAttendanceBody');
    if(tbody) {
        window.mockAttendanceCount = window.mockAttendanceCount || 0;
        window.mockAttendanceCount++;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${window.mockAttendanceCount}</td>
            <td>${student.id}</td>
            <td style="font-weight:700; color:#0f172a;">${student.name}</td>
            <td>${new Date().toLocaleTimeString('vi-VN')}</td>
            <td><span style="background:#10b981; color:#fff; padding:4px 10px; border-radius:6px; font-size:12px; font-weight:700;">Có mặt</span></td>
        `;
        tbody.prepend(tr);
        
        const selectEl = document.getElementById('teacherSelectClass');
        const classVal = selectEl ? selectEl.value : null;
        let total = 0;
        if(typeof registeredFaceDatabase !== 'undefined' && classVal) {
            total = registeredFaceDatabase.filter(s => s.class === classVal || s.className === classVal).length;
        } else {
            const sEl = document.getElementById('selectStudentToScan');
            if(sEl) total = sEl.options.length;
        }
        
        const counter = document.getElementById('attendanceCounterBadge');
        if(counter) {
            counter.innerText = `Đã điểm danh: ${window.mockAttendanceCount} / ${total > 0 ? total : window.mockAttendanceCount} học sinh`;
        }
    }
};


window.mockAttendanceCount = 0;



window.openCameraLoginModal = function() {
    const modal = document.getElementById('rtspLoginModalOverlay');
    if (modal) modal.style.display = 'flex';
};

window.closeRtspLoginModal = function() {
    const modal = document.getElementById('rtspLoginModalOverlay');
    if (modal) modal.style.display = 'none';
};

window.handleRtspLogin = function(event) {
    if (event) event.preventDefault();
    const user = document.getElementById('rtspUsernameInput')?.value || '';
    const pass = document.getElementById('rtspPasswordInput')?.value || '';
    
    closeRtspLoginModal();
    
    const statusPill = document.getElementById('cameraStatusPill');
    if (statusPill) {
        statusPill.innerText = '🟢 Đăng nhập Camera thành công! Đang kích hoạt luồng camera...';
        statusPill.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    }
    
    if (typeof startRealWebcam === 'function') {
        startRealWebcam();
    }
};
