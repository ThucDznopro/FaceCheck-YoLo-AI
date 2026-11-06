import React, { useState } from 'react';

function App() {
  const [activeRole, setActiveRole] = useState('leader');

  const roles = [
    { key: 'leader', title: 'Lãnh đạo', subtitle: 'Tổng quan điểm danh' },
    { key: 'training', title: 'Đào tạo', subtitle: 'Thời khóa biểu & Danh sách SV' },
    { key: 'finance', title: 'Tài chính', subtitle: 'Thông báo học phí gửi qua Mobile App' },
    { key: 'academic', title: 'Giáo vụ', subtitle: 'Nhập điểm theo lớp / môn học' },
    { key: 'teacher', title: 'Giảng viên', subtitle: 'Điểm danh bằng Camera AI' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar navigation */}
      <div style={{ width: 250, backgroundColor: '#0f172a', color: '#fff', padding: 20 }}>
        <h2 style={{ fontSize: 20, marginBottom: 5 }}>FaceCheck</h2>
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 30 }}>Điểm danh bằng khuôn mặt</p>

        <p style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 10 }}>Vai trò hệ thống</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {roles.map(r => (
            <button
              key={r.key}
              onClick={() => setActiveRole(r.key)}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                backgroundColor: activeRole === r.key ? '#1e293b' : 'transparent',
                color: activeRole === r.key ? '#38bdf8' : '#cbd5e1',
                cursor: 'pointer',
                fontWeight: activeRole === r.key ? 'bold' : 'normal'
              }}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: 30 }}>
        <header style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24 }}>{roles.find(r => r.key === activeRole)?.title}</h1>
          <p style={{ color: '#64748b' }}>{roles.find(r => r.key === activeRole)?.subtitle}</p>
        </header>

        <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p>Màn hình demo giao diện hệ thống Quản lý cho role: <strong>{activeRole}</strong></p>
        </div>
      </div>
    </div>
  );
}

export default App;
