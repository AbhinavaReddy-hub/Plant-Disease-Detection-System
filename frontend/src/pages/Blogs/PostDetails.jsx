import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import "./BlogDetail.css"; // Import your CSS for styling (if you have one)

const BlogDetail = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5770/post/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
          setLoading(false); // Stop loading once data is fetched
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false); // Stop loading on error
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="postDetail">
      {/* Display title if it exists */}
     

      <h1>{post.username}'s Post</h1>
      {post.image && <img src={post.image} alt="Post" className="postImage" />}
      {post.title && <h2 className="postTitle">{post.title}</h2>}
      <p className="postContent">{post.content}</p>
      <p className="postDate">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* Button to navigate back to the posts list */}
      <button onClick={() => navigate("/blogs")} className="backToBlogsButton">
        Back to Posts
      </button>
    </div>
  );
};

export default BlogDetail;
