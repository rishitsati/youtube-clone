# 🎬 YouTube Clone – MERN Stack

## 📌 Project Title

YouTube Clone Application – Full Stack MERN Project

---

## 📖 Project Overview

This project is a fully functional YouTube Clone developed using the MERN Stack (MongoDB, Express, React, Node.js).  
It replicates core YouTube features including authentication, video streaming, likes, comments, categories, and search.

The application is divided into two main parts:

- Frontend – Built with React and Tailwind CSS
- Backend – Built with Node.js, Express.js, and MongoDB

---

## 🚀 Features

### Authentication

- User Signup and Login
- JWT-based authentication
- Secure protected routes

### Video Features

- Upload videos
- Stream videos
- Like and Dislike videos
- Comment system with CRUD
- Delete and manage comments

### User Interface

- Category-based filtering
- Search functionality
- Responsive UI
- YouTube-style homepage layout
- Dynamic video loading

### Additional Features

- Channel page
- User dashboard
- Full CRUD operations on videos
- Real-time updates after actions

---

## 🛠 Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Axios
- React Router
- Vite

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST APIs

### Tools & Deployment

- Git & GitHub
- Postman
- Render (Backend Hosting)
- Vercel (Frontend Hosting)

---

## ⚙ How to Run the Project Locally

### 1️⃣ Clone the Repository

git clone https://github.com/rishitsati/youtube-clone.git  
cd youtube-clone

---

### 2️⃣ Running Backend

cd backend  
npm install  
npm run dev

Backend will run at:

http://localhost:8000

---

### 3️⃣ Running Frontend

Open a new terminal and run:

cd frontend  
npm install  
npm run dev

Frontend will run at:

http://localhost:5173

---

## 🔐 Environment Variables

Create a .env file inside the backend folder with the following values:

MONGO_URI=mongodb+srv://rishitsati:Rishi24@cluster0.7dimcnh.mongodb.net/youtube_clone?retryWrites=true&w=majority  
JWT_SECRET=Rishi@24  
PORT=8000

---

## 📡 API Endpoints

### Authentication

- POST /api/auth/register – Register user
- POST /api/auth/login – Login user

### Videos

- GET /api/videos – Get all videos
- POST /api/videos – Upload new video
- PUT /api/videos/:id/like – Like video
- PUT /api/videos/:id/dislike – Dislike video
- DELETE /api/videos/:id – Delete video

### Comments

- GET /api/comments/:videoId – Get comments
- POST /api/comments – Add comment
- DELETE /api/comments/:id – Delete comment

### Channels

- GET /api/channels/:id – Get channel info
- POST /api/channels – Create channel

---

## 🌐 Deployment Links

Frontend (Vercel)  
https://youtube-clone-eta-six-85.vercel.app

Backend (Render)  
https://youtube-clone-backend-co6r.onrender.com

---

## 🧪 Testing

- All APIs tested using Postman
- CRUD operations verified
- Frontend tested on multiple devices
- Authentication and protected routes verified

---

## 📂 Project Structure

youtube-clone/  
│  
├── backend/  
│ ├── models/  
│ ├── controllers/  
│ ├── routes/  
│ ├── middleware/  
│ ├── server.js  
│  
├── frontend/  
│ ├── src/  
│ │ ├── components/  
│ │ ├── pages/  
│ │ ├── api/  
│ │ ├── App.jsx  
│  
├── README.md

---

## 📌 Submission Notes

- ES Modules (import/export) used instead of CommonJS
- Built using Vite instead of Create React App
- Node modules are not included
- Fully working authentication system
- CRUD implemented for videos and comments
- Proper Git commit history maintained

---

## 👨‍💻 Author

Rishit Sati  
Full Stack Developer

GitHub: https://github.com/rishitsati

---

### ✅ Project Status: COMPLETED & SUBMISSION READY
