import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NewPost.css";
const NewPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Retrieve the username from sessionStorage
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
      setUsername(storedUser);
    } else {
      setMessage("Error: No user logged in.");
      // Optional: Redirect to login if no user is found
      navigate("/login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("username", username); // Use the username from sessionStorage
    form.append("title", formData.title); // Add title
    form.append("content", formData.content);
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      const response = await fetch(`http://${LOCAL_IP}:5000/posts/new-post`, {
        method: "POST",
        body: form, 
      });
      console.log(response.status);
      if (response.ok) {
        setMessage("Post created successfully!");
        setFormData({
          title: "",
          content: "",
          image: null,
        });

        // Redirect to the posts page after successful submission
        navigate("/blogs");
      } else {
        setMessage("Failed to create the post. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the post:", error);
      setMessage("An error occurred while creating the post.");
    }
  };

  return (
    <div className="newPostContainer">
      <header>
        <h1>Create a New Post</h1>
        <a href="/blogs" className="backLink">
          Back to posts
        </a>
      </header>
      <main>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="formGroup">
            <input
              type="text"
              name="title"
              placeholder="Post Title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="formInput"
            />
          </div>
          <div className="formGroup">
            <textarea
              name="content"
              placeholder="Write your post content here..."
              value={formData.content}
              onChange={handleInputChange}
              required
              className="formTextarea"
            ></textarea>
          </div>
          <div className="formGroup">
            <label htmlFor="image">Upload Post Image (optional):</label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleFileChange}
              className="formFileInput"
            />
          </div>
          <button type="submit" className="submitButton">
            Submit Post
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </main>
    </div>
  );
};

export default NewPost;
