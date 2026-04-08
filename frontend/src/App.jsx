import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import BooksList from "./components/BooksList";
import AuthorsList from "./components/AuthorsList";
import AddBook from "./components/AddBook";
import AddAuthor from "./pages/AddAuthor";
import Dashboard from "./pages/Dashboard";
import BookDetails from "./pages/BookDetails";
import "./index.css";

const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <Router>
      <div className="app-shell">
        <Navbar user={user} onLogout={logout} />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
            }
          />
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <BooksList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/:id"
            element={
              <ProtectedRoute>
                <BookDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/authors"
            element={
              <ProtectedRoute>
                <AuthorsList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-book"
            element={
              <ProtectedRoute isAdmin={true}>
                <AddBook />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-author"
            element={
              <ProtectedRoute isAdmin={true}>
                <AddAuthor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
