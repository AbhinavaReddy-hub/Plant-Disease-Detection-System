import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Blogs.css"; // Import the CSS file for styling

const Myblog = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
    }
  }, []);

  const fetchUserBlogs = async () => {
    try {
      const response = await fetch(`http://localhost:5770/posts/${username}`);
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching user blogs:", error);
    }
  };

  useEffect(() => {
    if (username) {
      fetchUserBlogs(); // Fetch user blogs on initial load
    }
  }, [username]);

  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`http://localhost:5770/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        alert("Blog deleted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error deleting blog:", errorData.message);
        alert("Failed to delete the blog. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("An error occurred while trying to delete the blog.");
    }
  };

  return (
    <div>
      <div>{username}</div>
      <div className="container">
        {blogs.map((blog) => (
          <div className="card" key={blog.id}>
            <h3 className="username">{blog.username}</h3>
            {blog.title && <h2 className="postTitle">{blog.title}</h2>}

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

        {/* Show All Posts Button */}
        <button
          onClick={() => navigate("/blogs")} // Redirect to /blogs
          className="showAllPostsButton"
        >
          Show All Posts
        </button>
      </div>
    </div>
  );
};

export default Myblog;
