import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import "./NewPost.css";

const NewPost = () => {
  const [formData, setFormData] = useState({
    username: "",
    content: "",
    image: null,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();  // Initialize useNavigate

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
    form.append("username", formData.username);
    form.append("content", formData.content);
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      const response = await fetch("http://localhost:5770/new-post", {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        setMessage("Post created successfully!");
        setFormData({
          username: "",
          content: "",
          image: null,
        });

        // Redirect to the posts page after successful submission
        navigate("/blogs");  // This will take the user to the /blogs page
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
              name="username"
              placeholder="Your Name"
              value={formData.username}
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
