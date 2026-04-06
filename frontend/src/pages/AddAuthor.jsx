import React, { useState } from "react";
import { authorApi } from "../api/client";

const AddAuthor = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    bio: "",
    birthDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authorApi.create(formData);
      setSuccess(true);
      setFormData({ firstname: "", lastname: "", bio: "", birthDate: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create author");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="content-wrap">
      <div className="panel p-6 sm:p-8">
        <h1 className="page-title">Add New Author</h1>
        <p className="page-subtitle">Build rich author profiles for your library database.</p>

        {success && <div className="status-success mt-5">Author created successfully.</div>}
        {error && <div className="status-error mt-5">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">First Name</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="field-input"
                required
              />
            </div>

            <div>
              <label className="field-label">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="field-input"
                required
              />
            </div>
          </div>

          <div>
            <label className="field-label">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="field-input min-h-28"
              placeholder="Short author biography"
            />
          </div>

          <div>
            <label className="field-label">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Create Author"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddAuthor;
