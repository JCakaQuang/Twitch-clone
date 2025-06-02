# Twitch Clone

## 📌 Project Description

**Twitch Clone** is a web application that simulates the livestream platform Twitch. It allows users to watch live channels, interact, and chat with the community.  
This project was developed for educational purposes in the Software Engineering course, helping students practice the software development process and enhance their web programming skills.

## 👥 Team Members

- [Phạm Quang Minh - 23010489](https://github.com/miin000)  
- [Nguyễn Văn Quang - 23011955](https://github.com/JCakaQuang)  
- [Lê Quang Đạt - 23010201](https://github.com/Lqdat28072005)  

## 🛠️ Technologies Used

- **Framework**: Next.js 14 (App Router)  
- **Database**: Turso (SQLite edge database)  
- **ORM**: Drizzle ORM  
- **Authentication**: NextAuth.js  
- **Others**: TypeScript, TailwindCSS, Shadcn/ui  

## 🚀 Main Features

- User registration and login (OAuth2 or Email/Password)  
- View list of currently live streaming channels  
- Watch livestreams and chat in real time  
- Manage personal livestream channels  
- Responsive, user-friendly interface across devices  

## ⚙️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-team-name/twitch-clone.git
cd twitch-clone
```

## Install Dependencies
```
npm install
```

## Configure Environment Variables
Create a .env.local file in the root directory and add the following:
```
DATABASE_URL="file:./db.sqlite"
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```
## Run the Application
```
npm run dev
ngrok http --url=diverse-bursting-boxer.ngrok-free.app 3000
```

## Access the Application: https://diverse-bursting-boxer.ngrok-free.app
