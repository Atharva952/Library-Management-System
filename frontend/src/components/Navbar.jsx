import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, user]);

  const navClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition md:text-center ${
      isActive
        ? "bg-emerald-100 text-emerald-800"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <nav className="glass-nav">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link to={user ? "/dashboard" : "/login"} className="brand-title">
            LibraryDex
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span className="text-xl leading-none">{menuOpen ? "×" : "☰"}</span>
          </button>
        </div>

        <div
          className={`${
            menuOpen ? "mt-4 flex" : "hidden"
          } flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:mt-0 md:flex md:flex-row md:items-center md:justify-between md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          <div className="grid gap-2 md:flex md:flex-wrap md:items-center md:gap-2">
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

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {user ? (
              <>
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 md:inline-block">
                  {user.name}
                </span>
                <button
                  onClick={onLogout}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary w-full md:w-auto">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
