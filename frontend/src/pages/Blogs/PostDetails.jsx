  // import React, { useEffect, useState } from "react";
  // import { useParams, useNavigate } from "react-router-dom";
  // import "./BlogDetail.css";

  // const BlogDetail = () => {
  //   const { id } = useParams();
  //   const [post, setPost] = useState(null);
  //   const [loading, setLoading] = useState(true);
  //   const [username, setUsername] = useState("");
  //   const navigate = useNavigate();

  //   useEffect(() => {
  //     const storedUser = sessionStorage.getItem("user");
  //     if (storedUser) {
        
  //       setUsername(storedUser);
  //     }
  //   }, []);

  //   const fetchPost = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/post/${id}?viewer=${username}`);
  //       if (response.ok) {
  //         const data = await response.json();
  //         setPost(data);
  //       } else {
  //         throw new Error("Post not found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching post:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     if (username) fetchPost();
  //   }, [id, username]);

  //   const toggleLike = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/posts/${id}/like`, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ username }),
  //       });

  //       if (response.ok) {
  //         const updatedPost = await response.json();
  //         setPost((prevPost) => ({
  //           ...prevPost,
  //           likesCount: updatedPost.likesCount,
  //           userLiked: !prevPost.userLiked,
  //         }));
  //       } else {
  //         console.error("Failed to toggle like");
  //       }
  //     } catch (error) {
  //       console.error("Error toggling like:", error);
  //     }
  //   };

  //   if (loading) return <div>Loading...</div>;
  //   if (!post) return <div>Post not found</div>;

  //   return (
  //     <div className="postDetail">
  //       <h1>{post.username}'s Post</h1>
  //       {post.image && <img src={post.image} alt="Post" className="postImage" />}
  //       {post.title && <h2 className="postTitle">{post.title}</h2>}
  //       <p className="postContent">{post.content}</p>
  //       <p className="postDate">{new Date(post.createdAt).toLocaleDateString()}</p>

  //       <div className="likes-section">
  //         <button
  //           className={`likeButton ${post.userLiked ? "liked" : "not-liked"}`}
  //           onClick={toggleLike}
  //         >
  //           👍 Like
  //         </button>
  //         <span>{post.likesCount || 0} Likes</span>
  //       </div>

  //       <button onClick={() => navigate("/blogs")} className="backToBlogsButton">
  //         Back to Posts
  //       </button>
  //     </div>
  //   );
  // };

  // export default BlogDetail;
  import React, { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import "./BlogDetail.css";

  const BlogDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUsername(storedUser);
      }
    }, []);

    const fetchPost = async () => {
      try {
        const viewer = username; // Corrected viewer without quotes
        const response = await fetch(`http://localhost:5000/posts/${id}?viewer=${viewer}`);
        if (!response.ok) {
          throw new Error("Post not found1");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    
    useEffect(() => {
      if (username) fetchPost();
    }, [id, username]);

    const toggleLike = async () => {
      try {
        const response = await fetch(`http://localhost:5000/posts/${id}/like`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        if (response.ok) {
          const updatedPost = await response.json();
          setPost((prevPost) => ({
            ...prevPost,
            likesCount: updatedPost.likesCount,
            userLiked: !prevPost.userLiked,
          }));
        } else {
          console.error("Failed to toggle like");
        }
      } catch (error) {
        console.error("Error toggling like:", error);
      }
    };

    if (loading) return <div>Loading...</div>;
    if (!post) return <div>Post not found</div>;

    return (
      <div className="postDetail">
        <h1>{post.username}'s Post</h1>
        {post.image && <img src={post.image} alt="Post" className="postImage" />}
        {post.title && <h2 className="postTitle">{post.title}</h2>}
        <p className="postContent">{post.content}</p>
        <p className="postDate">{new Date(post.createdAt).toLocaleDateString()}</p>

        <div className="likes-section">
          <button
            className={`likeButton ${post.userLiked ? "liked" : "not-liked"}`}
            onClick={toggleLike}
          >
            👍 Like
          </button>
          <span>{post.likesCount || 0} Likes</span>
        </div>

        <button onClick={() => navigate("/blogs")} className="backToBlogsButton">
          Back to Posts
        </button>
      </div>
    );
  };

  export default BlogDetail;
