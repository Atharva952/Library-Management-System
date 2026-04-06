import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-4">Library Management</h1>
        <p className="text-2xl mb-8">
          Organize, Search, and Manage Your Books and Authors
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-bold mb-2"> Books</h3>
            <p>
              Explore thousands of books with beautiful covers and detailed
              information
            </p>
            <a
              href="/books"
              className="mt-4 inline-block bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100"
            >
              Browse Books
            </a>
          </div>

          <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-bold mb-2">Authors</h3>
            <p>
              Discover information about your favorite authors and their works
            </p>
            <a
              href="/authors"
              className="mt-4 inline-block bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100"
            >
              Explore Authors
            </a>
          </div>

          <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur">
            <h3 className="text-2xl font-bold mb-2">Secure</h3>
            <p>
              Create an account and manage your library with complete security
            </p>
            <a
              href="/register"
              className="mt-4 inline-block bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
