# Portfolio Backend

This is the backend API for the MERN portfolio application. It provides RESTful endpoints for managing projects, blog posts, contact messages, user authentication, profile settings, and resume downloads.

## 🔗 Links

- **Backend API (Render):** [https://my-portfolio-ler8.onrender.com/api](https://my-portfolio-ler8.onrender.com/api)
- **GitHub:** [https://github.com/MuhammadShoaib20/my-portfolio](https://github.com/MuhammadShoaib20/my-portfolio)

> ⚠️ The API may return a 404 if the Render server is sleeping. Ensure the backend is running and the URL is correctly set in your frontend `.env`.

---

## 🚀 Features

- 🔐 **Authentication** – JWT-based login; roles: superadmin, admin, editor
- 📁 **File Uploads** – Images and documents (PDF, DOC, DOCX) via Cloudinary
- 📝 **Projects** – CRUD with technologies, live/GitHub URLs, featured status, view/like counts
- 📰 **Blogs** – CRUD with slug generation, categories, tags, reading time, publish/draft status
- 💬 **Contact Messages** – Store, read, reply, delete; spam prevention
- 👤 **Profile** – Update name, bio, profile image, contact details, social links
- 👥 **User Management** – Superadmin can create/delete admin and editor accounts
- 📄 **Resume Management** – Upload multiple versions (PDF/DOC), enable/disable for download
- 📊 **Analytics** – Auto-track views and likes on projects and blogs

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | Backend framework |
| MongoDB + Mongoose | Database and ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Cloudinary | File storage |
| Multer | Multipart form data parsing |
| dotenv | Environment variable management |
| cookie-parser | Cookie handling |
| cors | Cross-origin resource sharing |

---

## 📦 Prerequisites

- Node.js **v18 or higher**
- MongoDB (local or Atlas)
- Cloudinary account

---

## 🔧 Installation & Setup

**1. Clone the repository:**

```bash
git clone https://github.com/MuhammadShoaib20/my-portfolio.git
cd my-portfolio/backend
```

**2. Install dependencies:**

```bash
npm install
```

**3. Create a `.env` file:**

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (CORS)
CLIENT_URL=http://localhost:3000
```

**4. Start the server:**

```bash
npm run dev    # development with nodemon
npm start      # production
```

Server runs at `http://localhost:5000`. All routes prefixed with `/api`.

---

## 🌍 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port | No (default 5000) |
| `NODE_ENV` | `development` or `production` | No |
| `MONGO_URI` | MongoDB connection string | ✅ Yes |
| `JWT_SECRET` | JWT signing secret | ✅ Yes |
| `JWT_EXPIRE` | Token expiry (e.g. `30d`) | No |
| `JWT_COOKIE_EXPIRE` | Cookie expiry in days | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ Yes |
| `CLIENT_URL` | Frontend URL for CORS | ✅ Yes |

---

## 📡 API Endpoints

All endpoints prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

### Authentication · `/api/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register first admin | Public |
| POST | `/login` | Login | Public |
| GET | `/me` | Get current user | Private |
| POST | `/logout` | Logout (clears cookie) | Private |
| PUT | `/changepassword` | Change password | Private |

### Projects · `/api/projects`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all published projects | Public |
| GET | `/:id` | Get single project | Public |
| PUT | `/:id/like` | Increment like count | Public |
| POST | `/` | Create project | Admin+ |
| PUT | `/:id` | Update project | Admin+ |
| DELETE | `/:id` | Delete project | Admin+ |
| PUT | `/:id/featured` | Toggle featured status | Admin+ |

### Blogs · `/api/blogs`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get published blogs | Public |
| GET | `/:slug` | Get blog by slug | Public |
| PUT | `/:id/like` | Increment like count | Public |
| GET | `/admin` | Get all blogs (incl. drafts) | Admin+ |
| POST | `/` | Create blog | Admin+ |
| PUT | `/:id` | Update blog | Admin+ |
| DELETE | `/:id` | Delete blog | Admin+ |
| PUT | `/:id/publish` | Toggle publish status | Admin+ |

### Contact · `/api/contact`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/` | Send a message | Public |
| GET | `/` | Get all messages | Admin+ |
| GET | `/:id` | Get single message | Admin+ |
| PUT | `/:id` | Update message status | Admin+ |
| DELETE | `/:id` | Delete message | Admin+ |

### Profile · `/api/profile`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get public profile | Public |
| PUT | `/` | Update profile | Admin+ |

### Users · `/api/users`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all users | Superadmin |
| POST | `/` | Create admin/editor | Superadmin |
| DELETE | `/:id` | Delete user | Superadmin |
| PUT | `/password` | Change own password | Private |

### Resumes · `/api/resumes`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/active` | Get active resumes | Public |
| GET | `/download/:id` | Download resume | Public |
| GET | `/` | Get all resumes | Admin+ |
| POST | `/` | Upload resume | Admin+ |
| PUT | `/:id` | Update resume | Admin+ |
| DELETE | `/:id` | Delete resume | Admin+ |
| PUT | `/:id/toggle` | Toggle active status | Admin+ |

### Upload · `/api/upload`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/` | Upload file to Cloudinary | Admin+ |

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                   # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── blogController.js
│   ├── contactController.js
│   ├── profileController.js
│   ├── projectController.js
│   ├── resumeController.js
│   ├── uploadController.js
│   └── userController.js
├── middleware/
│   └── authMiddleware.js       # JWT verification + role check
├── models/
│   ├── Blog.js
│   ├── Message.js
│   ├── Profile.js
│   ├── Project.js
│   ├── Resume.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   ├── blogRoutes.js
│   ├── contactRoutes.js
│   ├── profileRoutes.js
│   ├── projectRoutes.js
│   ├── resumeRoutes.js
│   ├── uploadRoutes.js
│   └── userRoutes.js
├── utils/
│   └── tokenGenerator.js
├── .env.example
├── server.js
└── package.json
```

---

## 🚀 Deployment (Render)

1. Push code to GitHub and connect to Render
2. Build command: `npm install` · Start command: `npm start`
3. Add all environment variables
4. Whitelist all IPs in MongoDB Atlas (or add Render's IP)
5. Set `NODE_ENV=production` and `CLIENT_URL` to your frontend domain

---

## 🤝 Contributing

Contributions are welcome! Open an issue or submit a pull request.

---

## 📄 License

Licensed under the **MIT License**.

---

<div align="center">Built with ❤️ by <a href="https://github.com/MuhammadShoaib20/Muhammad Shoaib">Muhammad Shoaib</a></div>