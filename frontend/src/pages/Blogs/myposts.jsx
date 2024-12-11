import React, { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import "./Blogs.css";

const Myblog = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUsername(storedUser);
    }
  }, []);

  const fetchUserBlogs = async () => {
    try {
      const viewer = username.trim().replace(/^"|"$/g, ''); // Trim any whitespace
      const apiUrl = `http://${LOCAL_IP}:5000/posts/user/${viewer}?`;
      console.log(`API URL: ${apiUrl}`); 
      const response = await fetch(apiUrl);
      
      // const response = await fetch(`http://localhost:5000/posts/user/${"abhi"}?`);
      const data = await response.json();
      setBlogs(data);
    } catch (er) {
      console.error("Error fetching user blogs:", er);
    }
  };

  useEffect(() => {
    if (username) {
      fetchUserBlogs(); // Fetch user blogs on initial load
    }
  }, [username]);

  const toggleLike = async (id) => {
    try {
      const response = await fetch(`http://${LOCAL_IP}:5000/posts/${id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        const updatedPost = await response.json();

        // Update likes and userLiked locally
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog.id === id
              ? { ...blog, likesCount: updatedPost.likesCount, userLiked: !blog.userLiked }
              : blog
          )
        );
      } else {
        console.error("Failed to update likes");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`http://${LOCAL_IP}:5000/posts/${id}`, {
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
      <div className="myBlogsContainer">
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
            <p className="content">{blog.contentPreview}<a href={`/blogs/${blog.id}`} className="readMore">
            ....Read More
          </a></p>

            
            
            <div>
              <button
                className="editBlogButton"
                onClick={() =>navigate(`/blogs/edit/${blog.id}`)}
              >
                Edit Post
              </button>
            </div>

            <button
              className="deleteBlogButton"
              onClick={() => deleteBlog(blog.id)}
            >
              Delete Blog
            </button>
            {/* Likes Section */}
            <div className="likes-section">
              <button
                className={`likeButton ${blog.userLiked ? "liked" : "not-liked"}`}
                onClick={() => toggleLike(blog.id)}
              >
                👍 Like
              </button>
              <span>{blog.likesCount || 0} Likes</span>
            </div>
            <p className="date">{new Date(blog.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      <div className="footer-buttons">
        <img
          src="https://www.svgrepo.com/show/161075/add-round-button.svg"
          alt="Create New Post"
          className="create-new-post-image"
          onClick={() => navigate("/blogs/new")}
        />
        <button
          onClick={() => navigate("/blogs")}
          className="showUserPostsButton"
        >
          Show All Posts
        </button>
      </div>
    </div>
  );
};

export default Myblog;
