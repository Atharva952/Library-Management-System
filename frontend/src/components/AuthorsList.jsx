import React, { useEffect, useState } from "react";
import { authorApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

const AuthorsList = () => {
  const { user } = useAuth();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchAuthors();
  }, [search]);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authorApi.getAll({ search });
      setAuthors(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch authors");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!authorToDelete) {
      return;
    }

    try {
      setDeletingId(authorToDelete._id);
      setError(null);
      setSuccess("");
      await authorApi.delete(authorToDelete._id);
      setAuthors((currentAuthors) =>
        currentAuthors.filter((author) => author._id !== authorToDelete._id),
      );
      setSuccess("Author deleted successfully.");
      setAuthorToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete author");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="content-wrap">
      <div className="panel p-6 sm:p-8">
        <h1 className="page-title">Authors</h1>
        {/* <p className="page-subtitle">
          Explore writer profiles and the minds behind every title.
        </p> */}

        <div className="mt-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search authors"
            className="field-input"
          />
        </div>
      </div>

      {loading && (
        <div className="panel mt-6 p-6 text-sm text-slate-600">
          Loading authors...
        </div>
      )}
      {error && <div className="status-error mt-6">{error}</div>}
      {success && <div className="status-success mt-6">{success}</div>}

      {!loading && !error && authors.length === 0 && (
        <div className="panel mt-6 p-6 text-sm text-slate-600">
          No authors found.
        </div>
      )}

      {!loading && !error && authors.length > 0 && (
        <div className="catalog-grid mt-6">
          {authors.map((author) => (
            <article key={author._id} className="catalog-card stagger-item">
              <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-700">
                {author.firstname?.[0]}
                {author.lastname?.[0]}
              </div>

              <h3 className="text-lg font-bold text-slate-800">
                {author.firstname} {author.lastname}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                {author.bio || "No bio added yet."}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Born{" "}
                {author.birthDate
                  ? new Date(author.birthDate).toLocaleDateString()
                  : "N/A"}
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setAuthorToDelete(author)}
                  disabled={deletingId === author._id}
                  className="mt-4 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === author._id ? "Deleting..." : "Delete Author"}
                </button>
              )}
            </article>
          ))}
        </div>
      )}

      {authorToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="panel w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900">Delete author?</h2>
            <p className="mt-3 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {authorToDelete.firstname} {authorToDelete.lastname}
              </span>
              ?
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setAuthorToDelete(null)}
                disabled={deletingId === authorToDelete._id}
                className="btn-outline w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deletingId === authorToDelete._id}
                className="w-full rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {deletingId === authorToDelete._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AuthorsList;
