const express = require("express");
const app = express();

const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files like CSS

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define Blog Post Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Add title field
  username: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: Buffer }, // Store image as binary data
  imageType: { type: String }, // Store image MIME type
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

// Multer Storage Configuration (Memory Storage for Buffers)
const storage = multer.memoryStorage();
const upload = multer(); // In-memory storage for file uploads

// Routes

// Create a new post
app.post("/new-post", upload.single("image"), async (req, res) => {
  const { title, username, content } = req.body;

  const newPost = new Post({
    title, // Save title
    username,
    content,
    image: req.file ? req.file.buffer : null, // Save file buffer if exists
    imageType: req.file ? req.file.mimetype : null,
  });

  try {
    await newPost.save();
    res.redirect("/posts"); // Redirect or send a success response
  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).send("Error creating post.");
  }
});

// Fetch all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();

    const formattedPosts = posts.map(post => ({
      id: post._id,
      title: post.title, // Include title
      username: post.username,
      contentPreview: post.content.length > 100
        ? post.content.slice(0, 100) + "..."
        : post.content,
      contentFull: post.content,
      image: post.image
        ? `data:${post.imageType};base64,${post.image.toString("base64")}`
        : null,
      createdAt: post.createdAt,
    }));

    return res.send(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error retrieving posts");
  }
});

// Fetch a single post by ID
app.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    const formattedPost = {
      id: post._id,
      title: post.title, // Include title
      username: post.username,
      content: post.content,
      image: post.image
        ? `data:${post.imageType};base64,${post.image.toString("base64")}`
        : null,
      createdAt: post.createdAt,
    };

    res.send(formattedPost);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Error retrieving post");
  }
});

// Delete a post by ID
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Error deleting blog" });
  }
});

// Render the form for creating a new post
app.get("/new-post", (req, res) => {
  res.render("new-post");
});

// Start Server
const PORT = 5770;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
   
 







app.get("/posts/:username", async (req, res) => {
   try {
     const { username } = req.params;  // Access the username from query parameters
     let posts;
 
     if (username) {
       // If username is provided, filter posts by that username
       posts = await Post.find({ username: username });
     } else {
       // If no username is provided, fetch all posts
       posts = await Post.find();
     }
 
     const formattedPosts = posts.map(post => ({
       id: post._id,
       title: post.title, // Include title
       username: post.username,
       contentPreview: post.content.length > 100
         ? post.content.slice(0, 100) + "..."
         : post.content,
       contentFull: post.content,
       image: post.image
         ? `data:${post.imageType};base64,${post.image.toString("base64")}`
         : null,
       createdAt: post.createdAt,
     }));
 
     return res.send(formattedPosts);
   } catch (error) {
     console.error("Error fetching posts:", error);
     res.status(500).send("Error retrieving posts");
   }
 });
  