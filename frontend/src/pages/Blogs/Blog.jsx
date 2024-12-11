// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Blogs.css"; // Import the CSS file for styling

// const Blog = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [username, setUsername] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = sessionStorage.getItem("user");
//     if (storedUser) {
      
//       setUsername(storedUser);
//     }

//     const getBlogs = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/posts?username=${username}`);
//         const data = await response.json();
//         setBlogs(data);
//       } catch (error) {
//         console.error("Error fetching blogs:", error);
//       }
//     };

//     if (username) getBlogs(); // Fetch blogs only when username is available
//   }, [username]);

//   const toggleLike = async (postId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/posts/${postId}/like`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username }),
//       });

//       if (response.ok) {
//         const updatedData = await response.json();

//         // Update likes and userLiked locally
//         setBlogs(prevBlogs =>
//           prevBlogs.map(blog =>
//             blog.id === postId
//               ? { ...blog, likesCount: updatedData.likesCount, userLiked: !blog.userLiked }
//               : blog
//           )
//         );
//       } else {
//         console.error("Failed to update likes");
//       }
//     } catch (error) {
//       console.error("Error toggling like:", error);
//     }
//   };

//   return (
//     <div>
//       <div>{username}</div>

//       <div className="container">
//         {blogs.map(blog => (
//           <div className="card" key={blog.id}>
//             <h3 className="username">{blog.username}</h3>
//             {blog.title && <h2 className="postTitle">{blog.title}</h2>}

//             {blog.image && (
//               <img
//                 src={blog.image}
//                 alt="Blog"
//                 className="image"
//                 style={{ width: "100%", height: "auto", borderRadius: "8px" }}
//               />
//             )}
//             <p className="content">{blog.contentPreview}  <a href={`/blogs/${blog.id}`} className="readMore">
//             ....Read More
//           </a></p>

//             {/* Likes Section */}
//             <div className="likes-section">
//               <button
//                 className={`likeButton ${blog.userLiked ? "liked" : "not-liked"}`}
//                 onClick={() => toggleLike(blog.id)}
//               >
//                 👍 Like
//               </button>
//               <span>{blog.likesCount || 0} Likes</span>
//             </div>

//             <p className="date">{new Date(blog.createdAt).toLocaleDateString()}</p>
//           </div>
//         ))}
//       </div>

//       <div className="footer-buttons">
//         <img
//           src="https://www.svgrepo.com/show/161075/add-round-button.svg"
//           alt="Create New Post"
//           className="create-new-post-image"
//           onClick={() => navigate("/blogs/new")}
//         />
//         <button
//           onClick={() => navigate("/blogs/my")}
//           className="showUserPostsButton"
//         >
//           Show My Posts
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Blog;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Blogs.css"; // Import the CSS file for styling

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUsername(storedUser);
    }

    const getBlogs = async () => {
      try {
        const response = await fetch(`http://${LOCAL_IP}:5000/posts?username=${username}`);
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    if (username) getBlogs(); // Fetch blogs only when username is available
  }, [username]);

  const toggleLike = async (postId) => {
    // Optimistically update the UI
    setBlogs(prevBlogs =>
      prevBlogs.map(blog =>
        blog.id === postId
          ? {
              ...blog,
              likesCount: blog.userLiked ? blog.likesCount - 1 : blog.likesCount + 1,
              userLiked: !blog.userLiked,
            }
          : blog
      )
    );

    // Synchronize with backend
    try {
      const response = await fetch(`http://${LOCAL_IP}:5000/posts/${postId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) throw new Error("Failed to update likes");

      const updatedData = await response.json();

      // Revert changes if necessary (if backend validation fails, etc.)
      setBlogs(prevBlogs =>
        prevBlogs.map(blog =>
          blog.id === postId
            ? {
                ...blog,
                likesCount: updatedData.likesCount,
                userLiked: updatedData.userLiked,
              }
            : blog
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div>
      <div>{username}</div>

      <div className="blogContainer">
        {blogs.map(blog => (
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
            <p className="content">
              {blog.contentPreview}{" "}
              <a href={`/blogs/${blog.id}`} className="readMore">
                ....Read More
              </a>
            </p>

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
          className="createBlogButton"
          onClick={() => navigate("/blogs/new")}
        />
        <button
          onClick={() => navigate("/blogs/my")}
          className="showUserPostsButton"
        >
          Show My Posts
        </button>
      </div>
    </div>
  );
};

export default Blog;
