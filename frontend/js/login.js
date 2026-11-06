
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

// frontend/js/login.js - Authentication, Real Backend Email OTP & Register Logic
let isAuthenticated = false; // Requires login first on app load
let pendingRequestedRole = 'leader';
let activeOtpCode = null;
let isOtpSent = false;
let otpTimerInterval = null;

const roleNamesMap = {
  leader: 'Lãnh đạo',
  training: 'Đào tạo',
  finance: 'Tài chính',
  academic: 'Giáo vụ',
  teacher: 'Giảng viên (Camera AI)',
  notification: 'Mobile App',
  student: 'Sinh viên',
  'download-app': 'Tải Web thành App'
};

// Local User Database (Persistent via localStorage) is NO LONGER USED for login.
// We keep an empty object or just remove references to avoid errors.
const usersDB = {};

function saveUsersDB() {
  // Deprecated, no-op
}

// Toggle Password Visibility (Show/Hide Password)
function togglePasswordVisibility(inputId, btnElem) {
  const inputElem = document.getElementById(inputId);
  if (!inputElem) return;

  if (inputElem.type === 'password') {
    inputElem.type = 'text';
    if (btnElem) btnElem.innerText = '🙈';
  } else {
    inputElem.type = 'password';
    if (btnElem) btnElem.innerText = '👁️';
  }
}

// Switch between Login, Forgot Password, and Register Cards
function showAuthCard(cardId) {
  const loginView = document.getElementById('loginCardView');
  const forgotView = document.getElementById('forgotCardView');
  const registerView = document.getElementById('registerCardView');

  if (loginView) loginView.style.display = 'none';
  if (forgotView) forgotView.style.display = 'none';
  if (registerView) registerView.style.display = 'none';

  const target = document.getElementById(cardId);
  if (target) {
    target.style.display = 'block';
  }
  
  // Only wipe the register form when we actually switch INTO the register card,
  // so navigating login <-> forgot no longer clears what the user typed.
  if (cardId === 'registerCardView' && typeof resetRegOtpForm === 'function') resetRegOtpForm();

  // Reset Forgot Password Card initial empty state
  if (cardId === 'forgotCardView') {
    isOtpSent = false;
    activeOtpCode = null;
    if (otpTimerInterval) clearInterval(otpTimerInterval);

    const emailIn = document.getElementById('forgotEmailInput');
    const otpSection = document.getElementById('otpSection');
    const otpNoticeBanner = document.getElementById('otpNoticeBanner');
    const btnForgot = document.getElementById('btnForgotSubmit');

    if (emailIn && !emailIn.value) emailIn.value = '';
    if (otpSection) otpSection.style.display = 'none';
    if (otpNoticeBanner) otpNoticeBanner.style.display = 'none';
    if (btnForgot) btnForgot.innerHTML = '<span>Gửi mã OTP khôi phục</span>';
  }
}

// Direct menu role click handler
function requestRoleAccess(roleKey) {
  pendingRequestedRole = roleKey;

  if (!isAuthenticated) {
    // Show login page, hide admin page
    const loginPage = document.getElementById('loginPage');
    const adminPage = document.getElementById('adminPage');

    if (loginPage && adminPage) {
      adminPage.classList.remove('active');
      adminPage.style.display = 'none';

      loginPage.classList.add('active');
      loginPage.style.display = 'flex';
      showAuthCard('loginCardView');
    }

    const roleName = roleNamesMap[roleKey] || roleKey;
    alert(`🔒 XÁC THỰC BẢO MẬT:\n\nBạn vừa chọn chức năng [${roleName}]. Vui lòng nhập tài khoản & mật khẩu để truy cập vào hệ thống!`);
  } else {
    // Already authenticated -> Switch role directly
    if (typeof executeRoleSwitch === 'function') {
      executeRoleSwitch(roleKey);
    }
  }
}

// Login Handler - Called when user clicks "Đăng nhập hệ thống"
async function handleLogin(event) {
  if (event) event.preventDefault();

  const userVal = document.getElementById('usernameInput')?.value?.trim() || '';
  const passVal = document.getElementById('passwordInput')?.value?.trim() || '';

  if (!userVal || !passVal) {
    alert('⚠️ Vui lòng nhập đầy đủ Email/Tài khoản và Mật khẩu!');
    return;
  }

  let targetRole = pendingRequestedRole || 'leader';

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userVal, password: passVal })
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.profile) {
         targetRole = data.profile.role || targetRole;
         if (data.token) {
           sessionStorage.setItem('facecheck_token', data.token);
         }
      }
    } else {
      const errData = await res.json();
      alert('❌ ' + (errData.error || 'Mật khẩu không chính xác!'));
      return;
    }
  } catch (e) {
    // Fallback if server is down
    console.error(e);
    alert('❌ Lỗi kết nối Server!');
    return;
  }

  // Set logged in state (kept in sessionStorage so an F5 refresh does not
  // bounce the user back to the login screen mid-session).
  isAuthenticated = true;
  try {
    sessionStorage.setItem('facecheck_session', JSON.stringify({ email: userVal, role: targetRole }));
  } catch (e) {}

  const loginPage = document.getElementById('loginPage');
  const adminPage = document.getElementById('adminPage');

  if (loginPage && adminPage) {
    loginPage.classList.remove('active');
    loginPage.style.display = 'none';
    
    adminPage.classList.add('active');
    adminPage.style.display = 'flex';

    if (typeof executeRoleSwitch === 'function') {
      executeRoleSwitch(targetRole);
    }
  }
}

// Resend OTP Code Handler (Called when clicking "Gửi lại mã OTP ngay")
async function resendOtpCode() {
  const btnResend = document.getElementById('btnResendOtp');
  if (btnResend && btnResend.disabled) return;

  isOtpSent = false;
  handleForgotPassword(new Event('submit'));
}

// Forgot Password Handler - Async Real Backend API Email OTP & Reset Flow
async function handleForgotPassword(event) {
  if (event) event.preventDefault();
  const emailVal = document.getElementById('forgotEmailInput')?.value?.trim() || '';
  const otpSection = document.getElementById('otpSection');
  const otpNoticeBanner = document.getElementById('otpNoticeBanner');
  const targetSentEmailElem = document.getElementById('targetSentEmail');
  const btnForgot = document.getElementById('btnForgotSubmit');

  if (!emailVal) {
    alert('⚠️ Vui lòng nhập Email của bạn để nhận mã OTP khôi phục!');
    return;
  }

  // STEP 1: Request Backend to Send Real Email OTP
  if (!isOtpSent) {
    if (btnForgot) btnForgot.innerHTML = '<span>Đang gửi Email OTP...</span>';

    try {
      const resp = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal })
      });
      const data = await resp.json();

      if (data.success) {
        isOtpSent = true;
        activeOtpCode = null;

        if (targetSentEmailElem) targetSentEmailElem.innerText = emailVal;
        if (otpNoticeBanner) otpNoticeBanner.style.display = 'block';
        if (otpSection) otpSection.style.display = 'block';
        if (btnForgot) btnForgot.innerHTML = '<span>Xác nhận mã OTP & Đổi mật khẩu</span>';

        // Start 60s countdown timer
        let secondsLeft = 60;
        const btnResend = document.getElementById('btnResendOtp');
        if (btnResend) {
          btnResend.disabled = true;
          btnResend.style.color = '#94a3b8';
          btnResend.style.cursor = 'not-allowed';
          btnResend.innerHTML = `Gửi lại mã (${secondsLeft}s)`;
        }

        if (otpTimerInterval) clearInterval(otpTimerInterval);
        otpTimerInterval = setInterval(() => {
          secondsLeft--;
          if (btnResend && secondsLeft > 0) {
            btnResend.innerHTML = `Gửi lại mã (${secondsLeft}s)`;
          }
          if (secondsLeft <= 0) {
            clearInterval(otpTimerInterval);
            if (btnResend) {
              btnResend.disabled = false;
              btnResend.style.color = '#d97706';
              btnResend.style.cursor = 'pointer';
              btnResend.innerHTML = '🔄 <b>Gửi lại mã OTP ngay</b>';
            }
          }
        }, 1000);

        let msg;
        if (data.emailSent === false) {
          // Backend could not deliver a real email (SMTP/Resend not configured).
          // Surface the dev OTP instead of falsely claiming the mail was sent.
          msg = `⚠️ CHƯA GỬI ĐƯỢC EMAIL THẬT\n\n${data.message || 'Máy chủ email chưa được cấu hình.'}`;
          if (data.devOtp) {
            msg += `\n\n🔑 Mã OTP (chế độ thử nghiệm): ${data.devOtp}\n\nNhập mã này vào ô OTP bên dưới để tiếp tục đổi mật khẩu.`;
            const otpInputElem = document.getElementById('otpInput');
            if (otpInputElem) otpInputElem.value = data.devOtp;
          }
        } else {
          msg = `📧 ĐÃ GỬI MÃ OTP THÀNH CÔNG VỀ EMAIL:\n\nHệ thống đã gửi mã xác thực 6 chữ số đến hòm thư: ${emailVal}.\n\nVui lòng mở Hộp thư đến (hoặc thư mục Spam/Quảng cáo) trên Email của bạn để lấy mã OTP!`;
        }
        if (data.previewUrl) {
          msg += `\n\n🔗 (Môi trường Test) Click xem Hộp thư thử nghiệm trực tiếp tại:\n${data.previewUrl}`;
        }
        alert(msg);
      } else {
        alert(`❌ Lỗi gửi email: ${data.error || 'Không thể gửi email'}`);
        if (btnForgot) btnForgot.innerHTML = '<span>Gửi mã OTP khôi phục</span>';
      }
    } catch (err) {
      console.error('OTP request failed:', err);
      isOtpSent = false;
      activeOtpCode = null;
      if (btnForgot) btnForgot.innerHTML = '<span>Gửi mã OTP khôi phục</span>';
      alert('❌ Không kết nối được máy chủ để gửi mã OTP.');
      return;
    }
  } 
  // STEP 2: Verify OTP and Reset Password via Backend API
  else {
    const otpVal = document.getElementById('otpInput')?.value?.trim() || '';
    const newPass = document.getElementById('newPassInput')?.value?.trim() || '';
    const newPassConfirm = document.getElementById('newPassConfirmInput')?.value?.trim() || '';

    if (!otpVal) {
      alert('⚠️ Vui lòng nhập mã OTP 6 chữ số!');
      return;
    }

    if (!newPass) {
      alert('⚠️ Vui lòng nhập Mật khẩu mới!');
      return;
    }

    const passRegex = /^.{6,}$/;
    if (!passRegex.test(newPass)) {
      alert('⚠️ Mật khẩu phải dài ít nhất 6 ký tự!');
      return;
    }

    if (newPass !== newPassConfirm) {
      alert('⚠️ Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    try {
      const resp = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal, otp: otpVal, newPassword: newPass })
      });
      const data = await resp.json();

      if (!resp.ok || !data.success) {
        alert(`❌ ${data.error || 'Mã OTP không hợp lệ!'}`);
        return;
      }
    } catch (err) {
      console.error('Password reset request failed:', err);
      alert('❌ Không kết nối được máy chủ để đổi mật khẩu.');
      return;
    }

    alert(`🎉 ĐỔI MẬT KHẨU THÀNH CÔNG!\n\nMật khẩu mới cho tài khoản [${emailVal}] đã được cập nhật. Vui lòng đăng nhập với mật khẩu mới!`);

    // Reset OTP flow state
    isOtpSent = false;
    activeOtpCode = null;
    if (otpTimerInterval) clearInterval(otpTimerInterval);
    if (otpSection) otpSection.style.display = 'none';
    if (otpNoticeBanner) otpNoticeBanner.style.display = 'none';
    if (btnForgot) btnForgot.innerHTML = '<span>Gửi mã OTP khôi phục</span>';

    // Auto-fill login form with updated email & password
    const userIn = document.getElementById('usernameInput');
    const passIn = document.getElementById('passwordInput');
    if (userIn) userIn.value = emailVal;
    if (passIn) passIn.value = newPass;

    showAuthCard('loginCardView');
  }
}

let isRegOtpSent = false;
let activeRegOtpCode = null;
let regTimerInterval = null;
let regTimeLeft = 60;
// NOTE: registration does not use OTP. The register card in index.html has no
// OTP markup, so the old startRegOtpTimer()/resendRegOtpCode() helpers were dead
// code that would throw on a null #btnRegResendOtp. They have been removed.

// Register Account Handler (Email is enough registration)
async function handleRegister(event) {
  if (event) event.preventDefault();

  const emailVal = document.getElementById('regEmailInput')?.value?.trim() || '';
  let nameVal = document.getElementById('regNameInput')?.value?.trim() || '';
  const passVal = document.getElementById('regPassInput')?.value?.trim() || '';
  const passConfirmVal = document.getElementById('regPassConfirmInput')?.value?.trim() || '';
  const roleVal = document.getElementById('regRoleSelect')?.value || 'teacher';

  if (!emailVal) {
    alert('⚠️ Vui lòng nhập Email QCET để đăng ký!');
    return;
  }

  if (!passVal) {
    alert('⚠️ Vui lòng nhập Mật khẩu cho tài khoản!');
    return;
  }

  const passRegex = /^.{6,}$/;
  if (!passRegex.test(passVal)) {
    alert('⚠️ Mật khẩu phải dài ít nhất 6 ký tự!');
    return;
  }

  if (passVal !== passConfirmVal) {
    alert('⚠️ Mật khẩu xác nhận không trùng khớp. Vui lòng kiểm tra lại!');
    return;
  }

  // If Name is omitted, auto-generate from email prefix
  if (!nameVal) {
    nameVal = emailVal.split('@')[0];
    nameVal = nameVal.charAt(0).toUpperCase() + nameVal.slice(1);
  }

  const emailKey = emailVal.toLowerCase();

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailKey,
        password: passVal,
        name: nameVal,
        role: roleVal
      })
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      alert('❌ Lỗi: ' + (data.error || 'Không thể đăng ký tài khoản'));
      return;
    }

    alert(`🎉 ĐĂNG KÝ TÀI KHOẢN THÀNH CÔNG:\n\n- Email đăng nhập: ${emailVal}\n- Họ tên: ${nameVal}\n- Vai trò: ${roleNamesMap[roleVal] || roleVal}`);

    const userIn = document.getElementById('usernameInput');
    const passIn = document.getElementById('passwordInput');
    if (userIn) userIn.value = emailVal;
    if (passIn) passIn.value = passVal;

    resetRegOtpForm();
    showAuthCard('loginCardView');
    return;
  } catch (err) {
    console.error('Register request failed:', err);
    alert('❌ Không kết nối được máy chủ để đăng ký tài khoản.');
    return;
  }
}

function resetRegOtpForm() {
  isRegOtpSent = false;
  activeRegOtpCode = null;
  clearInterval(regTimerInterval);

  const btn = document.getElementById('btnRegisterSubmit');
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `<span>Tạo tài khoản ngay</span>`;
  }

  ['regEmailInput', 'regNameInput', 'regPassInput', 'regPassConfirmInput'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}


// Logout Handler - Opens Custom Confirmation Board
function logout() {
  const modalOverlay = document.getElementById('logoutModalOverlay');
  if (modalOverlay) {
    modalOverlay.style.display = 'flex';
  } else {
    confirmLogoutExecute();
  }
}

// Close Logout Confirmation Board ("Không" / Cancel)
function closeLogoutModal() {
  const modalOverlay = document.getElementById('logoutModalOverlay');
  if (modalOverlay) {
    modalOverlay.style.display = 'none';
  }
}

// Execute Logout ("Có" / Confirm)
function confirmLogoutExecute() {
  closeLogoutModal();
  isAuthenticated = false;
  try { sessionStorage.removeItem('facecheck_session'); } catch (e) {}

  if (typeof stopRealWebcam === 'function') {
    stopRealWebcam();
  }

  const loginPage = document.getElementById('loginPage');
  const adminPage = document.getElementById('adminPage');

  if (loginPage && adminPage) {
    adminPage.classList.remove('active');
    adminPage.style.display = 'none';

    loginPage.classList.add('active');
    loginPage.style.display = 'flex';
    showAuthCard('loginCardView');
  }
}
