# ⚙️ Portfolio – Backend

Backend API for the MERN portfolio application. Provides RESTful APIs for projects, blogs, authentication, contact messages, profile management, and resume uploads.

---

## 🔗 Links

* 🌐 **API:**
  https://portfolio-backend-production-f6c0.up.railway.app/api

* 🐙 **GitHub:**
  https://github.com/MuhammadShoaib20/portfolio-backend

---

## 🚀 Features

* 🔐 JWT Authentication (admin, editor, superadmin)
* 📁 File uploads (Cloudinary)
* 📝 Projects CRUD + likes/views
* 📰 Blogs CRUD + slug system
* 💬 Contact message system
* 👤 Profile management
* 👥 User role management
* 📄 Resume uploads & tracking
* 📊 Analytics system

---

## 🛠️ Tech Stack

| Technology         | Purpose          |
| ------------------ | ---------------- |
| Node.js + Express  | Backend          |
| MongoDB + Mongoose | Database         |
| JWT                | Auth             |
| bcryptjs           | Password hashing |
| Cloudinary         | File storage     |
| Multer             | Upload handling  |
| dotenv             | Env config       |
| cors               | Security         |

---

## 📁 Project Structure

```bash
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── server.js
└── package.json
```

---

## ⚙️ Installation

```bash
git clone https://github.com/MuhammadShoaib20/portfolio-backend.git
cd portfolio-backend
npm install
```

---

## 🔧 Environment Variables

Create `.env`:

```env
PORT=5000
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:3000
```

---

## ▶️ Run Server

```bash
npm run dev
npm start
```

Runs on: **http://localhost:5000**

---

## 📡 API Overview

### Auth

* POST `/api/auth/login`
* GET `/api/auth/me`

### Projects

* GET `/api/projects`
* POST `/api/projects`

### Blogs

* GET `/api/blogs`
* POST `/api/blogs`

### Contact

* POST `/api/contact`

### Profile

* GET `/api/profile`

---

## 🚀 Deployment (Railway)

1. Push repo to GitHub
2. Connect in Railway
3. Add environment variables
4. Start: `npm start`

---

## 📄 License

MIT License

---

<div align="center">
❤️ Built by Muhammad Shoaib
</div>
