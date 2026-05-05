import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const BooksList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bookApi.getAll({ search });
      setBooks(response.data.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setBooks([]);
        setError(null);
      } else {
        setError(err.response?.data?.message || "Failed to fetch books");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!bookToDelete) {
      return;
    }

    try {
      setDeletingId(bookToDelete._id);
      setError(null);
      setSuccess("");
      await bookApi.delete(bookToDelete._id);
      setBooks((currentBooks) =>
        currentBooks.filter((book) => book._id !== bookToDelete._id),
      );
      setSuccess("Book deleted successfully.");
      setBookToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete book");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="content-wrap">
      <div className="panel p-6 sm:p-8">
        <h1 className="page-title">Book Collection</h1>
        {/* <p className="page-subtitle">
          Search by title or author name and discover your next read.
        </p> */}

        <div className="mt-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books or authors"
            className="field-input"
          />
        </div>
      </div>

      {loading && (
        <div className="panel mt-6 p-6 text-sm text-slate-600">
          Loading books...
        </div>
      )}
      {error && <div className="status-error mt-6">{error}</div>}
      {success && <div className="status-success mt-6">{success}</div>}

      {!loading && !error && books.length === 0 && (
        <div className="panel mt-6 p-6 text-sm text-slate-600">
          No books found. Try a different search keyword.
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="catalog-grid mt-6">
          {books.map((book) => (
            <article
              key={book._id}
              className="catalog-card stagger-item overflow-hidden p-0"
            >
              <button
                type="button"
                onClick={() => navigate(`/books/${book._id}`)}
                className="block w-full text-left"
              >
                <div className="h-44 w-full bg-slate-100">
                  {book.coverImage?.cloudinary?.url ? (
                    <img
                      src={book.coverImage.cloudinary.url}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500">
                      No cover image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-slate-800 transition hover:text-emerald-700">
                      {book.title}
                    </h3>
                    {isAdmin && (
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        Open
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    {book.authorID?.firstname || "Unknown"}{" "}
                    {book.authorID?.lastname || "Author"}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Published:{" "}
                    {book.publishDate
                      ? new Date(book.publishDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </button>

              {isAdmin && (
                <div className="border-t border-slate-200 px-5 pb-5 pt-4">
                  <button
                    type="button"
                    onClick={() => setBookToDelete(book)}
                    disabled={deletingId === book._id}
                    className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === book._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {bookToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="panel w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900">Delete book?</h2>
            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{bookToDelete.title}</span>?
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setBookToDelete(null)}
                disabled={deletingId === bookToDelete._id}
                className="btn-outline w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId === bookToDelete._id}
                className="w-full rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {deletingId === bookToDelete._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BooksList;
