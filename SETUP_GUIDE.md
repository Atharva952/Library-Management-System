# Full Stack Library Management System - Setup Guide

## Project Structure

```
project-1/
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── router/
│   │   ├── utils/
│   │   └── index.js
│   ├── package.json
│   └── ...
│
└── frontend/             # React + Vite + Tailwind
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── ...
```

## Backend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create .env file

```
PORT=5000
DB_CONNECTION=mongodb://your_connection_string
SALT=10
TOKEN_SECRET_KEY=your_secret_key
EMAIL=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start Backend

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Create .env file

```
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### User Endpoints

- `POST /api/v1/user` - Register
- `POST /api/v1/user/login` - Login
- `POST /api/v1/user/verify-otp` - Verify OTP
- `POST /api/v1/user/resend-otp` - Resend OTP
- `POST /api/v1/user/forgot-password` - Forgot Password
- `POST /api/v1/user/reset-password` - Reset Password
- `PUT /api/v1/user/update` - Update Profile (Auth required)
- `DELETE /api/v1/user/delete` - Delete Account (Auth required)

### Book Endpoints

- `GET /api/v1/book` - Get all books
- `GET /api/v1/book/:id` - Get single book
- `POST /api/v1/book` - Create book (Admin only)
- `PUT /api/v1/book/:id` - Update book (Admin only)
- `DELETE /api/v1/book/:id` - Delete book (Admin only)

### Author Endpoints

- `GET /api/v1/author` - Get all authors
- `GET /api/v1/author/:id` - Get single author
- `POST /api/v1/author` - Create author (Admin only)
- `PUT /api/v1/author/:id` - Update author (Admin only)
- `DELETE /api/v1/author/:id` - Delete author (Admin only)
- `POST /api/v1/author/restore/:id` - Restore author (Admin only)

## Frontend Features

### Public Pages

- 🏠 Home - Landing page
- 📚 Books - Browse all books
- ✍️ Authors - Browse all authors
- 🔐 Login - User login
- 📝 Register - User registration with OTP

### Protected Pages (Authenticated Users)

- 👤 Profile - Update user profile
- 🔒 Delete Account - Account management

### Admin Pages (Admin Users Only)

- ➕ Add Book - Create new books
- ➕ Add Author - Create new authors
- ✏️ Edit Book - Modify existing books
- ✏️ Edit Author - Modify existing authors

## Key Features

✅ Complete user authentication with OTP verification
✅ Role-based access control (User/Admin)
✅ Book management with cover image upload
✅ Author management
✅ Search and filtering
✅ Responsive design with Tailwind CSS
✅ Token-based API authentication
✅ Error handling and validation

## Running Both Frontend and Backend

### Terminal 1 - Backend

```bash
npm run dev
```

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Both should now be running:

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Nodemailer
- Cloudinary
- Multer

### Frontend

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- JavaScript ES6+

## Testing the Application

1. Register a new user
2. Verify the OTP (check email)
3. Login with your credentials
4. If admin role - access admin features
5. Browse books and authors
6. Create, edit, delete books/authors (if admin)
7. Update your profile
8. Logout

## Troubleshooting

### Backend won't start

- Check MongoDB connection string
- Verify PORT is not in use
- Check .env variables

### Frontend won't connect to backend

- Ensure backend is running on port 5000
- Check VITE_API_URL in .env
- Check browser console for errors

### CORS errors

- Backend already has CORS configured
- If issues, add CORS middleware to Express

## Next Steps

- Add more filtering options
- Implement pagination
- Add user reviews/ratings
- Add book categories
- Implement wishlist feature
- Add admin dashboard with analytics
