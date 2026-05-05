import React from "react";
import { Link } from "react-router-dom";

const Dashboard = ({ user }) => {
  if (!user) {
    return (
      <section className="content-wrap">
        <div className="panel p-10 text-center">
          <h1 className="page-title">Loading Dashboard</h1>
          <p className="page-subtitle">
            Fetching your personalized library experience.
          </p>
        </div>
      </section>
    );
  }

  const isAdmin = user.role === "admin";

  return (
    <section className="content-wrap">
      <div className="panel p-6 sm:p-8">
        <span className="pill">
          {isAdmin ? "Admin Workspace" : "Reader Space"}
        </span>
        <h1 className="page-title mt-4">
          <span>{isAdmin ? "Control Center" : "Your Library Hub"}</span>
        </h1>
        <p className="page-subtitle max-w-2xl">
          {isAdmin
            ? "Manage books, add new ones, and update authors in one place."
            : "Browse books, discover authors, and keep reading."}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="catalog-card stagger-item">
          <h2 className="text-xl font-bold text-slate-800">Browse Books</h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse titles, preview covers, and explore your collection.
          </p>
          <Link to="/books" className="btn-primary mt-5 inline-flex w-full sm:w-auto">
            Open Books
          </Link>
        </div>

        <div className="catalog-card stagger-item">
          <h2 className="text-xl font-bold text-slate-800">Explore Authors</h2>
          <p className="mt-2 text-sm text-slate-600">
            Find authors behind your favorite books.
          </p>
          <Link to="/authors" className="btn-primary mt-5 inline-flex w-full sm:w-auto">
            Open Authors
          </Link>
        </div>

        {isAdmin && (
          <>
            <div className="catalog-card stagger-item">
              <h2 className="text-xl font-bold text-slate-800">Add New Book</h2>
              <p className="mt-2 text-sm text-slate-600">
                Publish books with cover and release date
              </p>
              <Link to="/add-book" className="btn-outline mt-5 inline-flex w-full sm:w-auto">
                Add Book
              </Link>
            </div>

            <div className="catalog-card stagger-item">
              <h2 className="text-xl font-bold text-slate-800">
                Add New Author
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Create and manage author profiles with clear details.
              </p>
              <Link to="/add-author" className="btn-outline mt-5 inline-flex w-full sm:w-auto">
                Add Author
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
