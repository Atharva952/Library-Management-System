import React, { useEffect, useState } from "react";
import { authorApi, bookApi } from "../api/client";

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: "",
    authorID: "",
    publishedDate: "",
  });
  const [authors, setAuthors] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await authorApi.getAll();
      setAuthors(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch authors");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("authorID", formData.authorID);
      data.append("publishedDate", formData.publishedDate);
      if (file) {
        data.append("coverImage", file);
      }

      await bookApi.create(data);
      setSuccess(true);
      setFormData({ title: "", authorID: "", publishedDate: "" });
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content-wrap">
      <div className="panel p-6 sm:p-8">
        <h1 className="page-title">Add New Book</h1>
        <p className="page-subtitle">Create a polished catalog entry for your readers.</p>

        {success && <div className="status-success mt-5">Book created successfully.</div>}
        {error && <div className="status-error mt-5">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="field-label">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>

          <div>
            <label className="field-label">Author</label>
            <select
              name="authorID"
              value={formData.authorID}
              onChange={handleChange}
              className="field-input"
              required
            >
              <option value="">Select an author</option>
              {authors.map((author) => (
                <option key={author._id} value={author._id}>
                  {author.firstname} {author.lastname}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Published Date</label>
            <input
              type="date"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              className="field-input"
            />
          </div>

          <div>
            <label className="field-label">Cover Image</label>
            <input type="file" onChange={handleFileChange} accept="image/*" className="field-input" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Create Book"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddBook;
