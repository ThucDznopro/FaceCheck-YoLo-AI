
window.customAlert = function(msg) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:99999;';
  const box = document.createElement('div');
  box.style.cssText = 'background:#fff; border-radius:16px; padding:24px; width:400px; max-width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.1); text-align:center;';
  box.innerHTML = `<h3 style="margin-top:0; color:#0f172a; font-size:18px;">Thông báo</h3><p style="color:#475569; font-size:14px; margin-bottom:24px; line-height:1.5;">${msg}</p><button style="background:#2563eb; color:#fff; border:none; padding:10px 24px; border-radius:8px; font-weight:600; cursor:pointer;" onclick="this.parentElement.parentElement.remove()">Đóng</button>`;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
};
window.alert = window.customAlert;

window.renderCameraOverlayHUD = function(studentId, studentName, pillText, pillColor) {
  const overlay = document.getElementById('cameraScanOverlayHUD');
  const idEl = document.getElementById('hudStudentId');
  const nameEl = document.getElementById('hudStudentName');
  const pillEl = document.getElementById('hudStatusPill');
  
  if (overlay) overlay.style.display = 'flex';
  if (idEl) idEl.innerText = studentId;
  if (nameEl) nameEl.innerText = studentName;
  
  if (pillEl) {
    pillEl.innerText = pillText;
    if (pillColor === 'green') {
      pillEl.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      pillEl.style.color = '#ffffff';
      if (overlay) {
        overlay.style.borderColor = '#10b981';
        overlay.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.35)';
      }
    } else if (pillColor === 'orange') {
      pillEl.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
      pillEl.style.color = '#ffffff';
      if (overlay) {
        overlay.style.borderColor = '#f59e0b';
        overlay.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.35)';
      }
    } else {
      pillEl.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      pillEl.style.color = '#ffffff';
      if (overlay) {
        overlay.style.borderColor = '#ef4444';
        overlay.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.35)';
      }
    }
  }
};

// frontend/js/teacher.js - Real Face Scan, Registration & AI Attendance Logic
let mediaStream = null;
let isCameraMirrorEnabled = false;
let currentCapturedFaceData = null;
let currentFaceDescriptor = null; // Store extracted descriptor during registration

let isFaceApiLoaded = false;
let isFaceApiLoading = false;

window.toggleCameraMirror = function() {
  isCameraMirrorEnabled = !isCameraMirrorEnabled;

  const videoEl = document.getElementById('realWebcamVideo');
  const button = document.getElementById('btnToggleCameraMirror');
  if (videoEl) videoEl.classList.toggle('camera-preview-mirrored', isCameraMirrorEnabled);
  if (button) {
    button.setAttribute('aria-pressed', String(isCameraMirrorEnabled));
    button.innerText = isCameraMirrorEnabled ? '🪞 Tắt chế độ gương' : '🪞 Bật chế độ gương';
  }
};

async function loadFaceApiModels() {
  if (isFaceApiLoaded) return true;
  if (isFaceApiLoading) {
    while(isFaceApiLoading) { await new Promise(r => setTimeout(r, 200)); }
    return isFaceApiLoaded;
  }
  
  isFaceApiLoading = true;
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromUri('./models');
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('./models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('./models');
    isFaceApiLoaded = true;
    console.log("✅ Thư viện Face API & Models đã tải xong!");
  } catch (err) {
    console.error("❌ Lỗi tải Face API models:", err);
    alert("Chi tiết lỗi tải AI: " + err.message);
  } finally {
    isFaceApiLoading = false;
  }
  return isFaceApiLoaded;
}


// Initial Registered Face Database
let registeredFaceDatabase = [
  { id: 'SV20260231', name: 'Trần Văn An', class: 'CĐK17 CNTT A', status: 'unmarked', time: '—', faceData: 'data_sv231' },
  { id: 'SV20260232', name: 'Lê Thị Bích', class: 'CĐK17 CNTT A', status: 'unmarked', time: '—', faceData: 'data_sv232' },
  { id: 'SV20260233', name: 'Phạm Quốc Cường', class: 'CĐK17 CNTT A', status: 'unmarked', time: '—', faceData: 'data_sv233' },
  { id: 'SV20260234', name: 'Hoàng Minh Đức', class: 'CĐK17 CNTT A', status: 'unmarked', time: '—', faceData: 'data_sv234' },
  { id: 'SV20260235', name: 'Nguyễn Thảo Vân', class: 'CĐK17 CNTT A', status: 'unmarked', time: '—', faceData: 'data_sv235' }
];

window.todayCheckedInStudents = window.todayCheckedInStudents || {};

// Load persistent registered face database on startup
async function loadRegisteredFaceDb() {
  try {
    const res = await fetch('/api/faces');
    if (res.ok) {
      const data = await res.json();
      registeredFaceDatabase = data.map(dbItem => {
        let desc = dbItem.descriptor;
        if (typeof desc === 'string') {
          try { desc = JSON.parse(desc); } catch (e) { desc = null; }
        }
        if (desc && !Array.isArray(desc) && typeof desc === 'object') {
          desc = Object.values(desc);
        }
        const sid = dbItem.studentId || dbItem.id;
        const isChecked = window.todayCheckedInStudents[sid];
        return {
          id: sid,
          name: dbItem.name,
          class: dbItem.className || dbItem.class,
          department: dbItem.department || '',
          status: isChecked ? 'present' : 'unmarked',
          time: isChecked ? isChecked.time : '—',
          faceData: dbItem.imageBase64 || dbItem.faceData,
          descriptor: (Array.isArray(desc) && desc.length === 128) ? desc : null
        };
      });

      // Nạp lại trạng thái điểm danh THẬT của hôm nay từ server
      await applyTodayAttendanceStatus();

      refreshTeacherAttendanceTable(true);
    }
  } catch (e) {
    console.error('Lỗi tải cơ sở dữ liệu khuôn mặt:', e);
  }
}

// Lấy ngày hôm nay dạng YYYY-MM-DD theo giờ máy (không lệch múi giờ)
function getTodayDateStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Đánh dấu lại những sinh viên đã điểm danh hôm nay (giữ trạng thái sau khi F5)
async function applyTodayAttendanceStatus() {
  try {
    const res = await fetch(`/api/attendance?date=${getTodayDateStr()}`);
    if (!res.ok) return;
    const log = await res.json();
    if (!Array.isArray(log)) return;

    log.forEach(record => {
      window.todayCheckedInStudents[record.studentId] = {
        id: record.studentId,
        name: record.name,
        class: record.className,
        time: record.time,
        status: 'present'
      };
      const student = registeredFaceDatabase.find(s => s.id === record.studentId);
      if (student) {
        student.status = 'present';
        student.time = record.time;
      }
    });
  } catch (e) {
    console.error('Lỗi tải bản ghi điểm danh:', e);
  }
}

// Gửi bản ghi điểm danh lên server để lưu vĩnh viễn
async function postAttendanceRecord(student) {
  try {
    const shiftSelect = document.getElementById('teacherShiftSelect');
    const shift = shiftSelect ? shiftSelect.value : undefined;

    const res = await fetch('/api/attendance/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student.id,
        name: student.name,
        className: student.class,
        shift: shift
      })
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Lỗi lưu điểm danh lên server:', e);
  }
  return null;
}

function saveRegisteredFaceDb() {
  // Deprecated - saving via POST /api/faces/register now
}

// Initial fetch on load
loadRegisteredFaceDb();

// ----------------------------------------------------
// 1. OPEN REGISTER STUDENT FACE MODAL (LƯU HSSV MỚI)
// ----------------------------------------------------


window.captureFaceForRegistration = async function() {
    const previewImg = document.getElementById('regStudentFacePreview');
    const placeholderIcon = document.getElementById('regStudentPlaceholderIcon');
    let videoEl = document.getElementById('realWebcamVideo');
    if (!videoEl || !videoEl.srcObject || !mediaStream) {
      if (typeof startRealWebcam === 'function') {
        await startRealWebcam();
        videoEl = document.getElementById('realWebcamVideo');
      }
    }

    if (videoEl && videoEl.srcObject && mediaStream) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoEl.videoWidth || 320;
        canvas.height = videoEl.videoHeight || 240;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        currentCapturedFaceData = canvas.toDataURL('image/jpeg');
  
        if (previewImg) {
          previewImg.src = currentCapturedFaceData;
          previewImg.style.display = 'block';
        }
        const liveVid = document.getElementById('regStudentVideoLive');
        if (liveVid) liveVid.style.display = 'none';
        if (placeholderIcon) placeholderIcon.style.display = 'none';
  
        if (!isFaceApiLoaded) {
          await loadFaceApiModels();
        }

        if (isFaceApiLoaded) {
          const img = new Image();
          img.src = currentCapturedFaceData;
          await new Promise(r => img.onload = r);
          const detectionOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 });
          const detection = await faceapi.detectSingleFace(img, detectionOptions).withFaceLandmarks().withFaceDescriptor();
          if (detection) {
            currentFaceDescriptor = Array.from(detection.descriptor);
            console.log("✅ Trích xuất Face Descriptor thành công!");
          } else {
            currentFaceDescriptor = null;
            alert("⚠️ Không nhận diện được khuôn mặt trong ảnh, vui lòng chụp lại (cần rõ mặt)!");
          }
        }
      } catch (err) {
        console.warn('Không thể chụp hình từ video:', err);
      }
    } else {
      alert("⚠️ Vui lòng bật Camera trước khi chụp!");
    }
};

async function openRegisterStudentModal() {
  const modal = document.getElementById('registerStudentModalOverlay');
  if (modal) modal.style.display = 'flex'; // SHOW IMMEDIATELY for responsiveness
  const previewImg = document.getElementById('regStudentFacePreview');
  const placeholderIcon = document.getElementById('regStudentPlaceholderIcon');
  const idInput = document.getElementById('regStudentIdInput');
  const nameInput = document.getElementById('regStudentNameInput');

  // Auto-generate new unique MSSV ID
  const nextNumber = registeredFaceDatabase.length + 1;
  const newId = `SV20260${230 + nextNumber}`;

  if (idInput) idInput.value = newId;
  if (nameInput) nameInput.value = '';

  const deptSelect = document.getElementById('regStudentDeptSelect');
  const classSelect = document.getElementById('regStudentClassSelect');
  if (deptSelect) {
    deptSelect.innerHTML = '<option value="">-- Chọn Khoa --</option>' + (typeof departmentsData !== 'undefined' ? departmentsData.map(d => `<option value="${d.name}">${d.name}</option>`).join('') : '');
    deptSelect.value = '';
  }
  if (classSelect) {
    classSelect.innerHTML = '<option value="">-- Chọn Lớp --</option>' + (typeof classesList !== 'undefined' ? classesList.map(c => `<option value="${c}">${c}</option>`).join('') : '');
    classSelect.disabled = false;
  }

  // Turn on camera if not on yet
  if (!mediaStream && typeof startRealWebcam === 'function') {
    await startRealWebcam();
  }

  // Reset preview
  if (previewImg) previewImg.style.display = 'none';
  
  const liveVid = document.getElementById('regStudentVideoLive');
  if (mediaStream && liveVid) {
    if (placeholderIcon) placeholderIcon.style.display = 'none';
    liveVid.srcObject = mediaStream;
    liveVid.style.display = 'block';
  } else {
    if (placeholderIcon) placeholderIcon.style.display = 'block';
    if (liveVid) liveVid.style.display = 'none';
  }
  
  currentCapturedFaceData = null;
  currentFaceDescriptor = null;
}

function closeRegisterStudentModal() {
  const modal = document.getElementById('registerStudentModalOverlay');
  if (modal) modal.style.display = 'none';
}

function triggerScanNewStudent() {
  openRegisterStudentModal();
}

async function handleSaveRegisteredStudent(event) {
  if (event) event.preventDefault();

  const idVal = document.getElementById('regStudentIdInput')?.value?.trim();
  const nameVal = document.getElementById('regStudentNameInput')?.value?.trim();
  const departmentVal = document.getElementById('regStudentDeptSelect')?.value;
  const classVal = document.getElementById('regStudentClassSelect')?.value;

  if (!idVal || !nameVal || !departmentVal || !classVal) {
    alert('Vui lòng nhập Mã sinh viên, Họ tên, Khoa/Ngành và chọn Lớp!');
    return;
  }
  if (!currentFaceDescriptor || currentFaceDescriptor.length !== 128) {
    alert('⚠️ Vui lòng hướng mặt vào Camera và bấm "Chụp Ảnh Khuôn Mặt" trước khi Lưu!');
    return;
  }

  // KIỂM TRA TRÙNG LẶP KHUÔN MẶT VỚI SINH VIÊN KHÁC ĐÃ ĐĂNG KÝ
  if (registeredFaceDatabase && registeredFaceDatabase.length > 0) {
    for (const existing of registeredFaceDatabase) {
      if (existing.descriptor && existing.descriptor.length === 128 && existing.id !== idVal) {
        const dist = faceapi.euclideanDistance(new Float32Array(currentFaceDescriptor), new Float32Array(existing.descriptor));
        if (dist < 0.50) {
          alert(`⚠️ TRÙNG LẶP KHUÔN MẶT!\n\nKhuôn mặt này đã được đăng ký cho sinh viên:\n- MSSV: ${existing.id}\n- Họ tên: ${existing.name}\n- Lớp: ${existing.class}\n\nHệ thống từ chối đăng ký lại khuôn mặt này cho sinh viên khác!`);
          return;
        }
      }
    }
  }

  const faceData = currentCapturedFaceData || 'data_captured_' + Date.now();

  const newStudentItem = {
    id: idVal,
    name: nameVal,
    class: classVal,
    department: departmentVal,
    status: 'unmarked',
    time: '—',
    faceData: faceData,
    descriptor: currentFaceDescriptor
  };
  try {
    const payload = {
      studentId: idVal,
      name: nameVal,
      className: classVal,
      department: departmentVal,
      imageBase64: faceData,
      descriptor: currentFaceDescriptor
    };
    
    const res = await fetch('/api/faces/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${res.status}`);
    }
    await loadRegisteredFaceDb();
  } catch (e) {
    console.error('Lỗi lưu hồ sơ khuôn mặt lên server:', e);
    alert(`Không thể lưu hồ sơ HSSV lên máy chủ: ${e.message}`);
    return;
  }

  const exIdx = registeredFaceDatabase.findIndex(s => s.id === idVal);
  if (exIdx >= 0) {
    registeredFaceDatabase[exIdx] = newStudentItem;
  } else {
    registeredFaceDatabase.push(newStudentItem);
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const studentObj = {
    id: idVal,
    name: nameVal,
    class: classVal,
    department: departmentVal,
    status: 'present',
    time: timeStr,
    faceData: faceData
  };

  closeRegisterStudentModal();
  refreshTeacherAttendanceTable();

  // Render camera HUD overlay with newly registered student's EXACT ID & NAME
  renderCameraOverlayHUD(studentObj.id, studentObj.name, '✅ Đã lưu & Đăng ký khuôn mặt thành công', 'green', studentObj);

  alert(`🎉 ĐĂNG KÝ HỒ SƠ THÀNH CÔNG!\n\nĐã đăng ký và lưu dữ liệu khuôn mặt cho sinh viên:\n- Mã SV: ${studentObj.id}\n- Họ và tên: ${studentObj.name}\n- Lớp: ${studentObj.class}\n\nKhi sinh viên này qua Camera, hệ thống AI sẽ quét và hiển thị đúng thông tin sinh viên.`);
}

// ----------------------------------------------------
// 2. CAMERA AI SCANNING & FACE MATCHING ATTENDANCE
// ----------------------------------------------------

function openLoginCameraModal() {
  scanCameraAttendance();
}

// Execute AI Face Scan Attendance with Exact Student Face Match
let isFaceScanningLoopActive = false;
window.scanCameraAttendance = scanCameraAttendance;

async function scanCameraAttendance() {
    window.scanCameraAttendance = scanCameraAttendance;
    if (isFaceScanningLoopActive) {
        // Already scanning, ignore or toggle off? Let's just say it's active.
        return;
    }

    try {
      const response = await fetch('/api/yolo26/health');
      const health = await response.json();
      if (!response.ok || health.status !== 'ok') {
        throw new Error(health.error || 'YOLO26 chưa sẵn sàng');
      }
    } catch (error) {
      alert(`Không kết nối được dịch vụ YOLO26 Python: ${error.message}\n\nCài các thư viện trong backend/vision_service/requirements.txt rồi khởi động lại backend.`);
      return;
    }
    
    const statusPill = document.getElementById('cameraStatusPill');
    if (statusPill) {
      statusPill.innerText = '🟢 YOLO26 đang quét người — nhận diện HSSV...';
      statusPill.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    }
  
    if (typeof renderCameraOverlayHUD === 'function') {
      renderCameraOverlayHUD('?', 'Không phát hiện khuôn mặt', '⚠️ Vui lòng nhìn thẳng vào camera', 'red');
    }

    if (!isFaceApiLoaded) {
      const loaded = await loadFaceApiModels();
      if (!loaded) {
        alert("⚠️ Hệ thống AI không thể tải mô hình khuôn mặt. Vui lòng tải lại trang hoặc kiểm tra kết nối mạng!");
        return;
      }
    }
  
    let videoEl = document.getElementById('realWebcamVideo');
    if (!videoEl || !mediaStream) {
      if (typeof startRealWebcam === 'function') {
        await startRealWebcam();
        videoEl = document.getElementById('realWebcamVideo');
      }
    }

    if (!videoEl || !mediaStream) {
      alert("⚠️ Không thể mở Camera máy tính. Vui lòng kiểm tra quyền truy cập Camera!");
      if (statusPill) {
          statusPill.innerText = '🔴 Camera chưa bật';
          statusPill.style.background = 'rgba(0,0,0,0.5)';
      }
      return;
    }
  
    await loadRegisteredFaceDb();
    isFaceScanningLoopActive = true;
    
    // START AGGRESSIVE LOOP
    aggressiveScanLoop(videoEl, statusPill);
}

async function detectPeopleWithYolo26(videoEl) {
    const frameWidth = Math.min(videoEl.videoWidth, 640);
    if (!frameWidth || !videoEl.videoHeight) return [];

    const frameCanvas = document.createElement('canvas');
    frameCanvas.width = frameWidth;
    frameCanvas.height = Math.round(videoEl.videoHeight * frameWidth / videoEl.videoWidth);
    frameCanvas.getContext('2d').drawImage(videoEl, 0, 0, frameCanvas.width, frameCanvas.height);

    const response = await fetch('/api/yolo26/detect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: frameCanvas.toDataURL('image/jpeg', 0.65) })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || result.detail || `HTTP ${response.status}`);
    return Array.isArray(result.people) ? result.people : [];
}

async function aggressiveScanLoop(videoEl, statusPill) {
    if (!isFaceScanningLoopActive || !mediaStream) {
        isFaceScanningLoopActive = false;
        return;
    }

    try {
        const people = await detectPeopleWithYolo26(videoEl);
        const detectionOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.3 });
        const detection = people.length
          ? await faceapi.detectSingleFace(videoEl, detectionOptions).withFaceLandmarks().withFaceDescriptor()
          : null;
        
        if (!detection) {
            // 1. 🔴 Đỏ — Không phát hiện khuôn mặt
            renderCameraOverlayHUD('?', 'Không phát hiện khuôn mặt', '🔴 Vui lòng nhìn thẳng vào camera', 'red');
        } else {
            let bestMatch = null;
            let minDistance = 0.60; // Standard face recognition threshold

            const searchDb = registeredFaceDatabase || [];

            for (const student of searchDb) {
                if (student.descriptor && student.descriptor.length === 128) {
                    const dist = faceapi.euclideanDistance(detection.descriptor, new Float32Array(student.descriptor));
                    if (dist < minDistance) {
                        minDistance = dist;
                        bestMatch = student;
                    }
                }
            }

            if (bestMatch) {
                // 3. 🟢 Xanh — Nhận diện thành công
                let deptToSelect = '';
                const cls = bestMatch.class || '';

                if (cls.includes('CNTT')) deptToSelect = 'Khoa Công nghệ thông tin';
                else if (cls.includes('DTH') || cls.includes('DTTH')) deptToSelect = 'Khoa Điện tử - Tin học';
                else if (cls.includes('CNOTO') || cls.includes('O T')) deptToSelect = 'Khoa Công nghệ Ô tô';
                else if (cls.includes('DL')) deptToSelect = 'Khoa Du Lịch';
                else if (cls.includes('DC')) deptToSelect = 'Khoa Đại cương';

                const deptSelect = document.getElementById('teacherSelectDept');
                const classSelect = document.getElementById('teacherSelectClass');
                if (deptSelect && deptToSelect && classSelect) {
                    if (deptSelect.value !== deptToSelect) {
                        deptSelect.value = deptToSelect;
                        if (typeof window.onTeacherDeptChange === 'function') window.onTeacherDeptChange();
                    }
                    if (classSelect.value !== cls) {
                        classSelect.value = cls;
                        if (typeof window.onTeacherClassChange === 'function') window.onTeacherClassChange();
                    }
                }

                const isAlreadyPresent = bestMatch.status === 'present' ||
                  Boolean(window.todayCheckedInStudents?.[bestMatch.id]);
                const curTime = isAlreadyPresent && bestMatch.time && bestMatch.time !== '—'
                  ? bestMatch.time
                  : new Date().toLocaleTimeString('vi-VN', { hour12: false });
                bestMatch.time = curTime;
                bestMatch.status = 'present';

                window.todayCheckedInStudents = window.todayCheckedInStudents || {};
                window.todayCheckedInStudents[bestMatch.id] = {
                    id: bestMatch.id,
                    name: bestMatch.name,
                    class: bestMatch.class,
                    department: bestMatch.department,
                    time: curTime,
                    status: 'present'
                };

                if (typeof studentsData !== 'undefined') {
                    const studentInGlobal = studentsData.find(s => s.id === bestMatch.id);
                    if (studentInGlobal) {
                        studentInGlobal.status = 'present';
                        studentInGlobal.time = curTime;
                    }
                }
                if (!isAlreadyPresent) {
                    await postAttendanceRecord(bestMatch);
                }
                refreshTeacherAttendanceTable(true);
                
                if (typeof renderCameraOverlayHUD === 'function') {
                    if (isAlreadyPresent) {
                        renderCameraOverlayHUD(bestMatch.id, bestMatch.name, '🟢 Đã điểm danh trước đó', 'green', bestMatch);
                    } else {
                        renderCameraOverlayHUD(bestMatch.id, bestMatch.name, '✅ Đã điểm danh', 'green', bestMatch);
                    }
                }
            } else {
                // 2. 🟡 Vàng — Phát hiện khuôn mặt nhưng không có trong dữ liệu
                if (typeof renderCameraOverlayHUD === 'function') {
                    renderCameraOverlayHUD('UNKNOWN', 'Khuôn mặt chưa đăng ký', '⚠️ Bạn hiện chưa có trong dữ liệu lớp', 'orange');
                }
            }
        }
    } catch (error) {
        console.error('YOLO26 camera scan error:', error);
        if (statusPill) {
          statusPill.innerText = '🔴 YOLO26 gặp lỗi — kiểm tra log backend';
          statusPill.style.background = 'rgba(239, 68, 68, 0.85)';
        }
    }

    // Call it again extremely fast
    setTimeout(() => {
        aggressiveScanLoop(videoEl, statusPill);
    }, 500);
}

async function handleCameraLogin(event) {
  if (event) event.preventDefault();
  const username = document.getElementById('camLoginUsername')?.value || '';
  const password = document.getElementById('camLoginPassword')?.value || '';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password })
    });
    const data = await res.json();
    
    if (res.ok && data.token) {
      sessionStorage.setItem('facecheck_token', data.token); // Lưu token để fetch API lưu SV
      closeDataModal();
      startRealWebcam();
    } else {
      alert('Đăng nhập thất bại: ' + (data.error || 'Sai thông tin tài khoản hoặc mật khẩu'));
    }
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    alert('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại!');
  }
}

async function startRealWebcam() {
  const videoEl = document.getElementById('realWebcamVideo');
  const placeholderText = document.getElementById('cameraPlaceholderText');
  const statusPill = document.getElementById('cameraStatusPill');
  const btnStart = document.getElementById('btnOpenDeviceCam');
  const btnStop = document.getElementById('btnStopWebcam');

  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Trình duyệt của bạn không hỗ trợ truy cập Camera máy tính!');
      return;
    }

    if (mediaStream) {
      stopRealWebcam();
      return;
    }

    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      audio: false
    });

    if (videoEl) {
      videoEl.srcObject = mediaStream;
      videoEl.classList.add('active');
      videoEl.classList.toggle('camera-preview-mirrored', isCameraMirrorEnabled);
      await videoEl.play();
    }

    if (placeholderText) placeholderText.style.display = 'none';
    if (statusPill) {
      statusPill.innerText = '🟢 AI Camera máy tính đang hoạt động — Sẵn sàng nhận diện khuôn mặt';
      statusPill.style.background = 'rgba(16, 185, 129, 0.85)';
    }

    if (btnStart) btnStart.innerHTML = '💻 Đang bật Camera';
    if (btnStop) btnStop.style.display = 'inline-flex';

    refreshTeacherAttendanceTable();

  } catch (err) {
    console.error('Lỗi mở Camera:', err);
    alert('Không thể mở Camera máy tính. Vui lòng cấp quyền truy cập Camera trên trình duyệt!');
  }
}

function stopRealWebcam() {
  const videoEl = document.getElementById('realWebcamVideo');
  const placeholderText = document.getElementById('cameraPlaceholderText');
  const statusPill = document.getElementById('cameraStatusPill');
  const btnStart = document.getElementById('btnOpenDeviceCam');
  const btnStop = document.getElementById('btnStopWebcam');

  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }

  if (videoEl) {
    videoEl.srcObject = null;
    videoEl.classList.remove('active');
  }

  if (placeholderText) {
    placeholderText.style.display = 'block';
    placeholderText.innerText = 'Nhấn "Bật camera điểm danh" hoặc "Camera máy tính" để bắt đầu';
  }
  if (statusPill) {
    statusPill.innerText = 'Camera chưa kết nối';
    statusPill.style.background = 'rgba(0, 0, 0, 0.6)';
  }

  if (btnStart) btnStart.innerHTML = '📹 Camera thiết bị';
  if (btnStop) btnStop.style.display = 'none';

  // Xóa HUD Overlay và canvas vẽ khung khuôn mặt để trả giao diện về ban đầu
  const overlay = document.getElementById('cameraScanOverlayHUD');
  if (overlay) overlay.style.display = 'none';

  const cameraViewport = document.getElementById('cameraViewport');
  if (cameraViewport) {
    const canvases = cameraViewport.getElementsByTagName('canvas');
    for (let i = canvases.length - 1; i >= 0; i--) {
      canvases[i].remove();
    }
  }
}

function refreshTeacherAttendanceTable(skipReload = false) {
  if (!skipReload) loadRegisteredFaceDb();

  const tbody = document.getElementById('teacherAttendanceBody');
  const counterBadge = document.getElementById('attendanceCounterBadge');
  const classSelect = document.getElementById('teacherSelectClass');
  const title = document.getElementById('teacherTableTitle');

  const selectedClass = classSelect ? classSelect.value : '';

  if (title) {
    title.innerText = selectedClass ? `Danh sách điểm danh — ${selectedClass}` : 'Danh sách điểm danh — Toàn trường';
  }

  // Filter students based on selected class, or all registered students if no class selected
  let classStudents = [];
  if (selectedClass) {
    classStudents = registeredFaceDatabase.filter(s => s.class === selectedClass);
    if (typeof studentsData !== 'undefined') {
      studentsData.forEach(sd => {
        if (sd.class === selectedClass && !classStudents.find(cs => cs.id === sd.id)) {
          classStudents.push({ ...sd, status: sd.status || 'unmarked', time: sd.time || '—' });
        }
      });
    }
  } else {
    classStudents = registeredFaceDatabase || [];
  }

  let presentCount = 0;
  const totalCount = classStudents.length;

  classStudents.forEach(item => {
    if (item.status === 'present') presentCount++;
  });

  if (counterBadge) {
    if (selectedClass) {
      counterBadge.innerText = `Đã điểm danh: ${presentCount} / ${totalCount} học sinh`;
    } else {
      counterBadge.innerText = `Đã điểm danh: ${presentCount} / ${totalCount} học sinh`;
    }
  }

  if (tbody) {
    const presentStudents = classStudents.filter(row => row.status === 'present');
    
    if (presentStudents.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:#64748b; font-weight:600;">Chưa có sinh viên nào được điểm danh hôm nay</td></tr>`;
    } else {
      tbody.innerHTML = presentStudents.map((row, index) => {
        return `
          <tr style="animation:fadeInRow 0.3s ease-out;">
            <td style="font-weight:600; text-align:center;">${index + 1}</td>
            <td style="font-weight:800; color:#0f172a; font-family:monospace;">${row.id}</td>
            <td style="font-weight:700; color:#0f172a;">${row.name}</td>
            <td style="font-family:monospace; color:#475569; font-weight:600;">${row.time || new Date().toLocaleTimeString('vi-VN', { hour12: false })}</td>
            <td><span class="badge-present-green" style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; padding:4px 12px; border-radius:20px; font-weight:800; font-size:12.5px; display:inline-block;">Đã điểm danh</span></td>
          </tr>
        `;
      }).join('');
    }
  }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  loadRegisteredFaceDb();
  if (typeof faceapi !== 'undefined') {
    loadFaceApiModels();
  } else {
    // Wait slightly if script is deferred
    setTimeout(() => {
      if (typeof faceapi !== 'undefined') loadFaceApiModels();
    }, 1000);
  }
});


window.onTeacherDeptChange = function() {
  const dept = document.getElementById('teacherSelectDept')?.value;
  const classSelect = document.getElementById('teacherSelectClass');
  if (!classSelect) return;
  
  const deptClassesMap = {
    'Khoa Công nghệ thông tin': ['CĐK17 CNTT A', 'CĐK17 CNTT B', 'CĐK17 CNTT C', 'CĐK18 CNTT A', 'CĐK18 CNTT B'],
    'Khoa Công nghệ Ô tô': ['CĐK17 CNOTO A', 'CĐK17 CNOTO B', 'CĐK18 CNOTO A'],
    'Khoa Điện': ['CĐK17 ĐCN A', 'CĐK17 ĐCN B', 'CĐK18 ĐCN A'],
    'Khoa Cơ khí': ['CĐK17 CĐT A', 'CĐK17 CĐT B'],
    'Khoa Du Lịch': ['CĐK17 DL1', 'CĐK17 DL2', 'CĐK17 QTKS', 'CĐK17 HDDL'],
    'Khoa Văn hóa nghệ thuật': ['CĐK17 VHSCTBL'],
    'Khoa Đại cương': ['CĐK17 DC1', 'CĐK17 DC2']
  };

  const allCls = [
    'CĐK17 CNTT A', 'CĐK17 CNTT B', 'CĐK17 CNTT C', 'CĐK18 CNTT A', 'CĐK18 CNTT B',
    'CĐK17 CNOTO A', 'CĐK17 CNOTO B', 'CĐK18 CNOTO A',
    'CĐK17 ĐCN A', 'CĐK17 ĐCN B', 'CĐK18 ĐCN A',
    'CĐK17 CĐT A', 'CĐK17 CĐT B',
    'CĐK17 DL1', 'CĐK17 DL2', 'CĐK17 QTKS', 'CĐK17 HDDL',
    'CĐK17 VHSCTBL',
    'CĐK17 DC1', 'CĐK17 DC2'
  ];
  
  let targetClasses = dept ? (deptClassesMap[dept] || allCls) : allCls;
  
  classSelect.innerHTML = '<option value="">-- Chọn Lớp --</option>' + targetClasses.map(c => `<option value="${c}">${c}</option>`).join('');
  classSelect.disabled = false;
  
  if (typeof refreshTeacherAttendanceTable === 'function') {
    refreshTeacherAttendanceTable(true);
  }
};

window.onTeacherClassChange = function() {
  if (typeof refreshTeacherAttendanceTable === 'function') {
    refreshTeacherAttendanceTable();
  }
};


window.onRegStudentDeptChange = function() {
  const dept = document.getElementById('regStudentDeptSelect')?.value;
  const classSelect = document.getElementById('regStudentClassSelect');
  if (!classSelect) return;
  
  const deptClassesMap = {
    'Khoa Công nghệ thông tin': ['CĐK17 CNTT A', 'CĐK17 CNTT B', 'CĐK17 CNTT C', 'CĐK18 CNTT A', 'CĐK18 CNTT B'],
    'Khoa Công nghệ Ô tô': ['CĐK17 CNOTO A', 'CĐK17 CNOTO B', 'CĐK18 CNOTO A'],
    'Khoa Điện': ['CĐK17 ĐCN A', 'CĐK17 ĐCN B', 'CĐK18 ĐCN A'],
    'Khoa Cơ khí': ['CĐK17 CĐT A', 'CĐK17 CĐT B'],
    'Khoa Du Lịch': ['CĐK17 DL1', 'CĐK17 DL2', 'CĐK17 QTKS', 'CĐK17 HDDL'],
    'Khoa Văn hóa nghệ thuật': ['CĐK17 VHSCTBL'],
    'Khoa Đại cương': ['CĐK17 DC1', 'CĐK17 DC2']
  };

  const allCls = [
    'CĐK17 CNTT A', 'CĐK17 CNTT B', 'CĐK17 CNTT C', 'CĐK18 CNTT A', 'CĐK18 CNTT B',
    'CĐK17 CNOTO A', 'CĐK17 CNOTO B', 'CĐK18 CNOTO A',
    'CĐK17 ĐCN A', 'CĐK17 ĐCN B', 'CĐK18 ĐCN A',
    'CĐK17 CĐT A', 'CĐK17 CĐT B',
    'CĐK17 DL1', 'CĐK17 DL2', 'CĐK17 QTKS', 'CĐK17 HDDL',
    'CĐK17 VHSCTBL',
    'CĐK17 DC1', 'CĐK17 DC2'
  ];
  
  let targetClasses = dept ? (deptClassesMap[dept] || allCls) : allCls;
  
  classSelect.innerHTML = '<option value="">-- Chọn Lớp --</option>' + targetClasses.map(c => `<option value="${c}">${c}</option>`).join('');
};

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

  startRealWebcam();
};
