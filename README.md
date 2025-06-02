### Twitch-clone
### Mô tả dự án
Twitch-clone là một ứng dụng web mô phỏng nền tảng livestream Twitch, cho phép người dùng xem các kênh phát trực tiếp, tương tác và trao đổi với cộng đồng qua chat. Dự án được phát triển nhằm mục đích học tập trong môn Kỹ Thuật Phần Mềm, giúp sinh viên thực hành quy trình phát triển phần mềm và nâng cao kỹ năng lập trình web.

### Thành viên nhóm:
<a href="https://github.com/miin000"> Phạm Quang Minh - 23010489 </a>
</br>
<a href="https://github.com/JCakaQuang"> Nguyễn Văn Quang - 23011955 </a>
</br>
<a href="https://github.com/Lqdat28072005"> Lê Quang Đạt - 23010201 </a>
</br>

### Công nghệ sử dụng: 
# Framework: Next.js 14 (App Router)
# Cơ sở dữ liệu: Turso (SQLite edge database)
# ORM: Drizzle ORM
# Authentication: NextAuth.js
# TypeScript, TailwindCSS, Shadcn/ui

### Tính năng chính
# Đăng ký / Đăng nhập (OAuth2 hoặc Email/Password)
# Xem danh sách kênh đang phát trực tiếp
# Xem video livestream và trò chuyện trực tiếp (chat realtime)
# Quản lý kênh livestream của người dùng
# Giao diện UI thân thiện, tương thích trên nhiều thiết bị

### Hướng dẫn cài đặt
## Clone dự án:
```
git clone https://github.com/your-team-name/twitch-clone.git
cd twitch-clone
```

## Cài đặt dependencies:
```
npm install
```

## Cấu hình môi trường:
# Tạo tệp .env.local và cấu hình như sau:
```
DATABASE_URL="file:./db.sqlite"
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```
# Khởi chạy:
```
npm run dev
ngrok http --url=diverse-bursting-boxer.ngrok-free.app 3000
```

# Truy cập: https://diverse-bursting-boxer.ngrok-free.app
