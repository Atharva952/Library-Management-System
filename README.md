# Library Management System

This project is a full-stack library app built with Node.js, Express, MongoDB, React, and Vite.

The idea is simple: users can explore books and authors, while admins can manage the catalog from the same interface. It started as a learning project, but it already covers a lot of real-world pieces like authentication, role-based access, image uploads, and a clean frontend flow.

## What This Project Does

- Users can register and log in
- OTP verification is included in the auth flow
- Anyone can browse books and authors
- Admins can add books and authors
- Admins can delete books and authors
- Book covers can be uploaded
- Search is available for books and authors

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Bcrypt
- Nodemailer
- Multer
- Cloudinary

### Frontend

- React
- Vite
- React Router
- Axios
- Tailwind CSS

## Project Structure

```text
project-1/
├── src/                # Backend source code
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── router/
│   ├── seed/
│   └── index.js
├── frontend/           # React frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
├── uploads/            # Uploaded files
└── package.json        # Backend dependencies
```

## Main Features

### Authentication

Users can register, log in, and go through OTP verification. Session data is stored on the frontend so logged-in users stay signed in after refresh.

### Books

The books page lets users browse the catalog, search by title or author, and view cover images when available.

Admins can:

- Add new books
- Upload cover images
- Delete books from the catalog

### Authors

The authors page shows author profiles with bio and birth date details.

Admins can:

- Add new authors
- Delete authors from the catalog

### Admin Experience

Admin-only actions are protected both in the backend and the frontend UI. Non-admin users can browse the system, but they won’t see management actions.

## Running The Project

### 1. Install backend dependencies

```bash
npm install
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Create your environment file

Create a `.env` file in the root of the project and add your own values for:

```env
PORT=
DB_CONNECTION=
DB_NAME=
SALT=
TOKEN_SECRET_KEY=
EMAIL=
EMAIL_PASS=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Start The App

### Run the backend

From the project root:

```bash
npm run dev
```

The backend runs on:

`http://localhost:8000`

### Run the frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on:

`http://localhost:3000`

## API Base URL

The frontend is currently configured to call:

`http://localhost:8000/api/v1`

## Notes

- The backend seeds some default library data when the database is empty
- CORS is currently configured for local frontend development
- Uploaded files are stored locally and image support also uses Cloudinary

## Why I Built This

This project was a way to practice full-stack development in a more complete, realistic way instead of building isolated examples. The goal was not just to make pages look good, but to connect frontend and backend logic in a way that feels like an actual product.

There are still plenty of things that could be improved over time, but the current version already gives a solid base for a real library management app.

## Future Improvements

- Edit book and author details from the UI
- Better admin dashboard insights
- Pagination for larger catalogs
- Profile management for users
- Better form validation and error handling
- Deployment setup for production

## Author

Built by Atharva.
