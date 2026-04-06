import React from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-emerald-100 text-emerald-800"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <nav className="glass-nav">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link to={user ? "/dashboard" : "/login"} className="brand-title">
          LibraryDex
        </Link>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>
              <NavLink to="/books" className={navClass}>
                Books
              </NavLink>
              <NavLink to="/authors" className={navClass}>
                Authors
              </NavLink>
              {user.role === "admin" && (
                <>
                  <NavLink to="/add-book" className={navClass}>
                    Add Book
                  </NavLink>
                  <NavLink to="/add-author" className={navClass}>
                    Add Author
                  </NavLink>
                </>
              )}
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navClass}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 sm:inline-block">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
