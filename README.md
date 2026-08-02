# DevTrack — Plan. Track. Achieve.

DevTrack is a modern, responsive full-stack project and task management dashboard designed for students and developers. It allows users to create workspaces (projects), manage items on a Kanban task board, track deadlines on a calendar, write private project notes, upload files, and review progress through visual charts.

---

## 👨💻 Tech Stack

### Frontend
- **React.js & Vite** — Ultra fast builds and state rendering.
- **Tailwind CSS** — Dynamic themes and custom scrollbars.
- **React Router Dom** — SPA client-side routing.
- **Axios** — Request interceptor attachments for auth keys.
- **React Hook Form** — Client-side verification and schema handling.
- **React Icons & Font Awesome** — Clean design elements.
- **Chart.js & React Chartjs-2** — Task analytics and progress visuals.

### Backend
- **Node.js & Express.js** — Secure rest endpoints.
- **Mongoose & MongoDB Atlas** — Database scaling.
- **JWT (JSON Web Tokens)** — Authenticated route guarding.
- **Bcrypt.js** — Hashed password security.
- **Multer & Cloudinary** — File attachments storage.
- **Helmet & Rate Limiter** — Production headers protection and security.

---

## 📁 Directory Structure

```
DevTrack/
├── client/                 # React Frontend (Vite)
│   ├── public/
│   └── src/
│       ├── assets/         # Developer graphics
│       ├── components/     # Reusable modals, charts
│       ├── context/        # Auth and Theme provider states
│       ├── layouts/        # Screen wrappers (Public, Auth, Dashboard)
│       ├── pages/          # Core pages (Landing, Kanban board, notes, files)
│       └── services/       # Axios API integration
├── server/                 # Express Backend API
│   ├── config/             # DB and storage setups
│   ├── controllers/        # Request handling logic
│   ├── middleware/         # Security guards and error hooks
│   ├── models/             # User, Project, Task, Note schemas
│   ├── routes/             # Endpoints (auth, projects, notes)
│   └── server.js           # Server entry point
└── README.md               # Setup instructions
```

---

## 🌈 Theme Engine

DevTrack supports 5 customized themes. The styling is managed through CSS variables mapped in `tailwind.config.js` and loaded inside `ThemeContext.jsx`:
- **Light Mode** — Clean slate styling.
- **Dark Mode** — Charcoal and indigo details.
- **Midnight Ocean** — High contrast ocean blues.
- **Emerald Forest** — Emerald greens.
- **Cyber Violet** — Cyberpunk violet overlays.

---

## 🚀 Local Installation & Setup

Ensure you have **Node.js** and **MongoDB** installed locally (or have a MongoDB Atlas URI ready).

### 1. Database and Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd server
   ```
2. The dependencies are already installed. Check the `.env` configuration file in `server/.env`.
   - The default configuration connects to `mongodb://127.0.0.1:27017/devtrack`.
   - Adjust `MONGODB_URI` and `JWT_SECRET` as required.
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. The dependencies are already installed. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The client application will run on `http://localhost:5173` (or the next available port).

---

## 🔒 Security Practices
- **Rate Limiting:** Protects the backend endpoints against DDoS or script execution.
- **Helmet Security:** Secures Node app headers.
- **CORS Configuration:** Enables secure cross-origin requests.
- **Password Hashing:** Automatically hashes passwords using `bcryptjs` salt rounds on database saves.
