# Library Management Frontend

A modern React frontend for the Library Management System built with Vite, React, and Tailwind CSS.

## Features

- 📚 **Book Management** - Browse, search, and manage books
- ✍️ **Author Management** - View and manage authors
- 👤 **User Authentication** - Secure login and registration with OTP verification
- 🔐 **Role-based Access** - Admin-only features for managing content
- 📱 **Responsive Design** - Works on all devices

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API client and endpoints
│   ├── components/    # Reusable React components
│   ├── context/       # React context (Auth)
│   ├── pages/         # Page components
│   ├── App.jsx        # Main app component
│   ├── main.jsx       # Entry point
│   └── index.css      # Tailwind CSS imports
├── index.html         # HTML entry point
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
└── package.json       # Dependencies
```

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Build

```bash
npm run build
```

## Components

### Authentication

- **Login** - User login with email and password
- **Register** - User registration with OTP verification

### Books

- **BooksList** - View all books with search functionality
- **AddBook** - Admin feature to add new books with cover images

### Authors

- **AuthorsList** - View all authors
- **AddAuthor** - Admin feature to add new authors

### Navigation

- **Navbar** - Main navigation with user profile and logout

## Environment Setup

Make sure your backend is running on `http://localhost:5000`

The frontend uses an API client configured to connect to the backend at `http://localhost:5000/api/v1`

## API Integration

API calls are centralized in `src/api/client.js` with proper error handling and token management.
