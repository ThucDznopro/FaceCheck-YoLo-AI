# FaceCheck - Hệ thống Điểm danh Khuôn mặt & Quản lý Đào tạo

Hệ thống quản lý điểm danh bằng công nghệ nhận diện khuôn mặt AI, tích hợp quản lý đào tạo, tài chính, giáo vụ, điểm số và thông báo đa kênh.

## 🏗 Cấu trúc Dự án (Monorepo)

- `server/`: Backend API Server (Node.js/Express + Face AI Engine + FCM)
- `web/`: Frontend Web App dành cho 5 vai trò Admin (React.js + Vite)
- `flutter/`: Mobile App dành cho Sinh viên & Phụ huynh (Flutter)

## 🔐 Phân quyền Hệ thống (RBAC)

1. **Lãnh đạo**: Thống kê báo cáo tỷ lệ điểm danh toàn trường real-time.
2. **Đào tạo**: Quản lý Thời khóa biểu, Khoa, Giảng viên, Môn học.
3. **Tài chính**: Quản lý & gửi thông báo học phí tới Mobile App.
4. **Giáo vụ**: Quản lý & nhập điểm (ĐTBKT, Điểm thi, Điểm TB môn).
5. **Giảng viên**: Mở Camera điểm danh tự động bằng khuôn mặt AI.
6. **Sinh viên / Phụ huynh**: Tra cứu thông tin cá nhân, TKB, Học phí, Điểm số, Thông báo trên Mobile App.

## 🚀 Khởi chạy Dự án

### 1. Server (Backend)
```bash
cd backend
npm install
npm run dev
```

### YOLO26 Camera AI (Python)

The Node.js backend starts the local YOLO26 service automatically. Install its
Python dependencies once from the project root:

```powershell
cd backend\vision_service
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Restart the backend after installation. On first startup, Ultralytics downloads
`yolo26n.pt`; inference runs on CPU and detects people. The existing Face API
face descriptors match detected camera faces to registered HSSV records.
Register each HSSV with a clear face image, student ID, name, class, and
department so the camera can display the saved details.

### 2. Web App (Frontend)
```bash
cd frontend
npm install
npm run dev
```

### 3. Flutter App (Mobile)
```bash
cd flutter_app
flutter pub get
flutter run
```
