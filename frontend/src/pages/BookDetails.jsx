import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { bookApi } from "../api/client";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await bookApi.getById(id);
        setBook(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <section className="content-wrap">
        <div className="panel p-6 text-sm text-slate-600">Loading book details...</div>
      </section>
    );
  }

  if (error || !book) {
    return (
      <section className="content-wrap">
        <div className="status-error">{error || "Book not found."}</div>
        <Link to="/books" className="btn-outline mt-6 inline-flex">
          Back to books
        </Link>
      </section>
    );
  }

  const authorName = `${book.authorID?.firstname || "Unknown"} ${book.authorID?.lastname || "Author"}`;

  return (
    <section className="content-wrap">
      <Link to="/books" className="btn-outline inline-flex">
        Back to books
      </Link>

      <div className="panel mt-6 overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,360px)_1fr]">
          <div className="min-h-[320px] bg-slate-100">
            {book.coverImage?.cloudinary?.url ? (
              <img
                src={book.coverImage.cloudinary.url}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-slate-500">
                No cover image available
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <span className="pill">Book Details</span>
            <h1 className="page-title mt-4">{book.title}</h1>
            <p className="page-subtitle mt-3">
              A closer look at this book and the author behind it.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Author
                </p>
                <p className="mt-2 text-base font-semibold text-slate-800">{authorName}</p>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Publish Date
                </p>
                <p className="mt-2 text-base font-semibold text-slate-800">
                  {book.publishDate ? new Date(book.publishDate).toLocaleDateString() : "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Book ID
                </p>
                <p className="mt-2 break-all text-sm text-slate-700">{book._id}</p>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Added On
                </p>
                <p className="mt-2 text-base font-semibold text-slate-800">
                  {book.createdAt ? new Date(book.createdAt).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-800">Author Information</h2>
              <p className="mt-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Name:</span> {authorName}
              </p>
              <p className="mt-3 text-sm text-slate-600">
                <span className="font-semibold text-slate-700">Birth Date:</span>{" "}
                {book.authorID?.birthDate
                  ? new Date(book.authorID.birthDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                <span className="font-semibold text-slate-700">Bio:</span>{" "}
                {book.authorID?.bio || "No author bio is available for this book yet."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDetails;
