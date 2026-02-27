 Client Hub – Mini CRM System
📌 Overview

Client Hub is a full-stack Mini CRM (Customer Relationship Management) application designed to manage client leads efficiently.
It allows administrators to authenticate securely, track incoming leads, update their status, and manage follow-ups — all through a clean and minimal dashboard interface.
This project demonstrates full-stack development skills including authentication, API development, database integration, and modern frontend architecture.

-Features

 Secure Admin Authentication (JWT-based)
 Lead Management (Create, Read, Update, Delete)
 Lead Status Tracking (New / Contacted / Converted)
 Notes & Follow-ups for each lead
 Dashboard with lead statistics
 Search and filter functionality
 Minimalist UI using Tailwind CSS
 RESTful API architecture

-Tech Stack

Frontend

React.js
Vite
Tailwind CSS
TypeScript

Backend

Node.js
Express.js
JWT Authentication
Bcrypt for password hashing

Database

PostgreSQL
Drizzle ORM

-Project Structure

Client-Hub/
│
├── client/      # React frontend
├── server/      # Express backend APIs
├── shared/      # Shared utilities/types
├── .gitignore
└── package.json

-Authentication Flow

Admin logs in with credentials
Password is validated and compared securely
JWT token is generated
Protected routes require valid token
Middleware verifies authentication

-Lead Workflow

New Lead → Contacted → Converted

Admins can:

Add new leads
Update lead status
Add notes for follow-ups
Delete leads

View analytics on dashboard

-Installation & Setup

1️ Clone the repository
git clone https://github.com/Rajchaudhary-web/FUTURE_FS_02.git
2️ Install dependencies
npm install
3️ Setup environment variables

Create a .env file inside server/ and add:

PORT=5000
DATABASE_URL=database_connection_string
JWT_SECRET=clienthub_super_secure_secret_2026

4️ Run the development server
npm run dev

-Learning Outcomes

This project demonstrates:

Full-stack architecture design
REST API development
Authentication & authorization
Database schema design
Clean UI/UX implementation
Git version control workflow

-Author
Raj Chaudhary
First-year Developer | Full-Stack Enthusiast
