import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "./Blogs.css"; // Import the CSS file for styling

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5770/posts");
        const data = await response.json();
        setBlogs(data); // Store the blogs in state
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    getBlogs();
  }, []);

  // Function to delete a blog
  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`http://localhost:5770/posts/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Remove the blog from state after successful deletion
        setBlogs(blogs.filter((blog) => blog.id !== id));
      } else {
        console.error("Error deleting the blog");
      }
    } catch (error) {
      console.error("Error deleting the blog:", error);
    }
  };

  return (
    <div className="container">
      {blogs.map((blog) => (
        <div className="card" key={blog.id}>
          <h3 className="username">{blog.username}</h3>
          {blog.image && (
            <img
              src={blog.image}
              alt="Blog"
              className="image"
              style={{ width: "100%", height: "auto", borderRadius: "8px" }}
            />
          )}
          <p className="content">{blog.contentPreview}</p>

          {/* Link to the detailed blog post page */}
          <a href={`/blogs/${blog.id}`} className="readMore">
            Read More
          </a>

          <p className="date">{new Date(blog.createdAt).toLocaleDateString()}</p>

          {/* Delete button */}
          <button
            className="deleteBlogButton"
            onClick={() => deleteBlog(blog.id)}
          >
            Delete Blog
          </button>
        </div>
      ))}

      {/* Add New Blog Button */}
      <button
        className="createBlogButton"
        onClick={() => navigate("/blogs/new")}
      >
        Create New Blog
      </button>
    </div>
  );
};

export default Blog;
