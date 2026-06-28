# Task Management API

![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![Express](https://img.shields.io/badge/Express-5.x-black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Sequelize-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-ISC-yellow)

A secure and fast REST API for task management, built with Node.js and Express. Supports JWT authentication, Google OAuth2, and email verification.

---

## Features

- 🔐 JWT Authentication (Access + Refresh Token)
- 🔑 Google OAuth2 (Passport.js)
- 📧 Email Verification (Nodemailer)
- ✅ Input Validation (Zod)
- 🛡️ Security (Helmet, CORS, Rate Limiting)
- 👤 Role-based Access Control (user / admin)
- 📋 Task Management with priority and due date

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | PostgreSQL + Sequelize |
| Auth | JWT + Passport Google OAuth2 |
| Validation | Zod |
| Email | Nodemailer |
| Security | Helmet, express-rate-limit |

---

## API Endpoints

### Auth Routes `/api/v1/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/signup` | Register new user | ❌ |
| POST | `/signin` | Login | ❌ |
| GET | `/verify-email?token=` | Verify email | ❌ |
| GET | `/google` | Google OAuth login | ❌ |
| GET | `/google/callback` | Google OAuth callback | ❌ |
| GET | `/refresh-token` | Refresh access token | ✅ |
| POST | `/signout` | Logout | ✅ |
| GET | `/dashboard` | User profile + tasks | ✅ |

### Tasks Routes `/api/v1/tasks`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create task | ✅ |
| GET | `/` | Get all tasks | ✅ |
| GET | `/:id` | Get task by ID | ✅ |
| PATCH | `/:id` | Update task | ✅ |
| DELETE | `/:id` | Delete task | ✅ |

### Admin Routes `/api/v1/admin`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | ✅ Admin |
| GET | `/users/:id` | Get user by ID | ✅ Admin |
| DELETE | `/users/:id` | Delete user | ✅ Admin |
| GET | `/stats` | System statistics | ✅ Admin |

---

## Response Format

All endpoints return a unified response structure:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "operation message",
  "data": {},
  "errors": null,
  "time": "2026-06-20T15:12:52.828Z"
}
```

### Examples

**POST** `/api/v1/auth/signup`
```json
// Request
{
  "username": "example",
  "email": "example@examail.com",
  "password": "secret123"
}

// Response 201
{
  "success": true,
  "statusCode": 201,
  "message": "user registered successfully, please verify your email",
  "data": null,
  "errors": null,
  "time": "2026-06-20T15:12:52.828Z"
}
```

**POST** `/api/v1/tasks`
```json
// Request (Authorization: Bearer <token>)
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "todo",
  "priority": "high",
  "dueDate": "2026-12-01T10:00:00.000Z"
}

// Response 201
{
  "success": true,
  "statusCode": 201,
  "message": "task created successfully",
  "data": {
    "id": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-12-01T10:00:00.000Z",
    "userId": "uuid-here"
  },
  "errors": null,
  "time": "2026-06-20T15:12:52.828Z"
}
```

**Validation Error**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "validation errors",
  "data": null,
  "errors": [
    {
      "field": "password",
      "message": "Too small: expected string to have >=6 characters"
    }
  ],
  "time": "2026-06-20T15:18:56.828Z"
}
```

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/IrbadAbdeldjelil/task-management-api.git
cd task-management-api/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `backend/` directory:

```env
# ENVIRONMENT
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# DATABASE
DB_URL=your_postgresql_url
DB_DIALECT=postgres

# ADMIN
ADMIN_NAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=yourpassword

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXP=30m
JWT_REFRESH_EXP=12d

# MAIL
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password

# GOOGLE OAUTH
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

### 4. Create admin account

```bash
npm run setup:admin
```

### 5. Run the server

```bash
# Development
npm run dev

# Production
npm start
```

---

## Authentication

This API uses **Bearer Token** authentication.

Include the token in the request header:

```
Authorization: Bearer <your_access_token>
```

---

## Project Structure

```
backend/
├── server.js
└── src/
    ├── app.js
    ├── config/
    │   ├── db.config.js
    │   ├── mail.config.js
    │   ├── passport.config.js
    │   └── createAdmin.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── tasks.controller.js
    │   └── admin.controller.js
    ├── helpers/
    │   ├── createToken.js
    │   ├── responses.js
    │   └── sendVerificationEmail.js
    ├── middlewares/
    │   ├── auth.middleware.js
    │   ├── validation.middleware.js
    │   └── limit.middleware.js
    ├── models/
    │   ├── user.model.js
    │   ├── task.model.js
    │   └── relation.model.js
    └── routes/
        ├── auth.routes.js
        ├── tasks.routes.js
        └── admin.routes.js
```

---

## License

ISC
