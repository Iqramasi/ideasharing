                                                 https://ideasharing-flaq.vercel.app
# 💡 Idea Sharing Platform

A full-stack web application that enables users to share innovative ideas, generate QR codes for easy access, and connect with people interested in collaborating on those ideas.

## 🚀 Overview

Many innovative ideas never reach the right audience. This platform provides a simple and interactive way for users to showcase ideas, gather interest, and build connections with potential collaborators.

Users can submit ideas, generate a unique QR code for each submission, and allow others to scan and explore those ideas instantly.

---

## ✨ Features

* 📝 Submit and manage ideas
* 🔗 Generate unique QR codes for every idea
* 📱 Scan QR codes to view ideas
* ❤️ Express interest in ideas
* 📊 Track engagement and interest count
* 👥 Connect with potential collaborators
* 🎯 Simple and user-friendly interface

---

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Additional Tools

* QR Code Generator
* REST APIs

---

## 📂 Project Structure

```bash
idea-sharing-platform/
│
├── frontend/
│   ├── src/
│   ├── public/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│
├── database/
│
└── README.md
```

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/idea-sharing-platform.git
cd idea-sharing-platform
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

---

## 🗄️ Database Schema

### Users

```text
user_id
name
email
```

### Ideas

```text
idea_id
title
description
owner_id
qr_code
created_at
```

### Interests

```text
interest_id
idea_id
user_id
timestamp
```

---

## 🔄 Workflow

```text
User submits idea
        ↓
Idea stored in MongoDB
        ↓
QR Code generated
        ↓
Other users scan QR
        ↓
View idea details
        ↓
Express interest
        ↓
Owner tracks engagement
```

---

## 🎥 Demo Video

Watch the project demo here:

[![Watch Demo](https://img.shields.io/badge/Watch-Demo-red)(https://youtu.be/mBsnbBoOShM)

---

## 🌟 Future Enhancements

* AI-powered idea recommendations
* Team formation system
* Comment and discussion section
* Idea voting and ranking
* Real-time notifications
* Category-based filtering

---

## 👩‍💻 Author

**Iqra Masi**

Computer Science Engineering Student | Cloud Lead | Full Stack Developer

GitHub: https://github.com/Iqramasi
