# JobNest - MERN Stack Job Portal

A modern, high-performance job portal application built with the MERN stack (MongoDB, Express, React, Node.js). JobNest provides a seamless experience where recruiters and companies can effortlessly post jobs, while applicants can search, filter, and apply for opportunities. The platform features dedicated, fully-responsive dashboards for both recruiters and applicants.

## ✨ Features

**Recruiters & Companies:**
- Create, edit, and manage job postings with rich text formatting
- Dashboard with real-time analytics and job management
- View and manage applications for posted jobs
- Company profile customization and branding

**Applicants & Job Seekers:**
- Advanced search and filter for job listings
- Apply to jobs seamlessly with resume/CV uploads
- Track application statuses
- Manage personal profiles and saved jobs

**Core Platform:**
- Secure Authentication powered by **Clerk**
- Cloud file and image uploads via **Cloudinary**
- Beautiful, responsive UI built with **Tailwind CSS** & **Framer Motion**
- RESTful API architecture with JWT authentication

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Framer Motion (Animations)
- React Router DOM
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (ODM)
- Clerk SDK (Authentication)
- Cloudinary SDK (File Storage)
- CORS & Dotenv

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Clerk and Cloudinary accounts

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd jobnest
   ```

2. **Install Dependencies**
   
   *For the Client:*
   ```bash
   cd client
   npm install
   ```
   
   *For the Server:*
   ```bash
   cd ../server
   npm install
   ```

---

## 🔐 Environment Variables (.env)

You must create a `.env` file in both the `client/` and `server/` directories. 
**Make sure to write your actual keys directly into these files before running the app.**

### `server/.env`
Create this file inside the `server` folder and add the following keys:

```env
# MongoDB Connection String
MONGODB_URI=your_mongodb_connection_string

# Clerk Backend Secret Key
CLERK_SECRET_KEY=your_clerk_secret_key

# Cloudinary Setup
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret

# Server Port
PORT=5000
```

### `client/.env`
Create this file inside the `client` folder and add the following keys:

```env
# Clerk Frontend Publishable Key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Backend API URL (Use localhost for development, update for production)
VITE_BACKEND_URL=http://localhost:5000
```

---

## 🏃‍♂️ Running the App Locally

**1. Start the Backend Server**
Open a terminal, navigate to the server folder, and run:
```bash
cd server
npm run dev
```

**2. Start the Frontend Application**
Open a new, separate terminal, navigate to the client folder, and run:
```bash
cd client
npm run dev
```

Your frontend should now be running on `http://localhost:5173`.

---

## 🚀 Deployment Guide

When you are ready to deploy to production (e.g., Render, Vercel, Netlify):

1. **Clerk:** Switch your Clerk dashboard to "Production" and update your `.env` variables on your hosting provider with the new Live Keys.
2. **MongoDB:** Ensure your MongoDB Network Access is set to allow connections from anywhere (`0.0.0.0/0`).
3. **Frontend URL:** Update the `VITE_BACKEND_URL` on your frontend host to point to your live deployed backend URL.
4. **CORS:** Ensure your backend `server.js` CORS configuration allows requests from your live frontend domain.
5. **Build Command:** Use `npm run build` for the frontend, and `npm start` (which runs `node server.js`) for the backend.

---

## 📄 License
This project is licensed for personal, non-commercial use only.
© 2025 JobNest. All rights reserved.
