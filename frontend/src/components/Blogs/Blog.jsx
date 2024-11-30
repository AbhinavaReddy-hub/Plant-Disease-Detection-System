import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/blogs/blogs.css"; // Import the CSS file for styling

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
    }

    // Fetch blogs
    const getBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5770/posts");
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    getBlogs();
  }, []);

  // Function to delete a blog post
  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`http://localhost:5770/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update the local state to remove the deleted blog
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
      
      <div className="blogContainer">
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
        <button onClick={() => navigate("/blogs/my")} className="showUserPostsButton">
         Show My Posts
        </button>
      </div>
    </div>
  );
};

export default Blog;
