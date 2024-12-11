import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './EditPost.css';


const EditPost = () => {
  const { id } = useParams(); // Post ID from URL
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // Uploaded image file
  const [preview, setPreview] = useState(null); // Image preview
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch post details
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://${LOCAL_IP}:5000/post/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post data");
        }
        const data = await response.json();

        console.log("Fetched Post Data:", data); // Debug fetched data
        setTitle(data.title || ""); // Set title
        setContent(data.content || ""); // Set content
        setPreview(data.image || null); // Set image preview
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Show a preview of the uploaded image
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`http://${LOCAL_IP}:5000/posts/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("Post updated successfully!");
        navigate("/blogs/my");
      } else {
        const errorData = await response.json();
        console.error("Error updating post:", errorData.message);
        alert("Failed to update the post.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post.");
    }
  };

  return (
    <div className="edit-post-container">
      <h1>Edit Post</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Content:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
          />
        </label>
        <label>
          Image:
          <input type="file" onChange={handleFileChange} />
        </label>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{ maxWidth: "300px", marginTop: "10px" }}
          />
        )}
        <div>
        <button type="submit">Save Changes</button>
        </div>
        
      </form>
    </div>
  );
  
};

export default EditPost;
