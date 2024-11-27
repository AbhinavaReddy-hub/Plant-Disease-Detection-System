
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors=require("cors")

const app = express();
app.use(express.json());
app.use(cors())

app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // Serve static files like CSS

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true })
   .then(() => console.log("MongoDB connected successfully"))
   .catch(err => console.error("MongoDB connection error:", err));

// Define Blog Post Schema
const postSchema = new mongoose.Schema({
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



app.post("/new-post", upload.single("image"), async (req, res) => {
  console.log("Request body:", req.body); // Logs form data (username, content)
  console.log("Uploaded file:", req.file); // Logs file if uploaded

  const { username, content } = req.body;
  const newPost = new Post({
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
 
 app.get("/posts", async (req, res) => {
    try {
       const posts = await Post.find();
 
       // Truncate content and format posts
       const formattedPosts = posts.map(post => ({
          id: post._id,
          username: post.username,
          contentPreview: post.content.length > 100 
             ? post.content.slice(0, 100) + "..." 
             : post.content, // Limit to 100 characters
          contentFull: post.content, // Full content for "Read More"
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
 





 

 app.get("/new-post", (req, res) => {
    res.render("new-post");
 });
 
 
// Start Server
const PORT = 5770; // Change this to 3000 if required
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




app.get("/post/:id", async (req, res) => {
   try {
      const post = await Post.findById(req.params.id);

      if (!post) {
         return res.status(404).send("Post not found");
      }

      console.log(post);  // Log the post to check the data
      const formattedPost = {
         id: post._id,
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

 app.get("/profile/:username", (req, res) => {
   const { username } = req.params;
   res.send(`<h1>Profile Page for ${username}</h1>`); // Replace with actual profile rendering logic
 });
 


 app.delete("/posts/:id", async (req, res) => {
   const { id } = req.params; // Extract the blog post ID from URL params
 
   try {
     // Find and delete the blog post by ID
     const deletedPost = await Post.findByIdAndDelete(id);
 
     // If no post was found with the given ID, send a 404 response
     if (!deletedPost) {
       return res.status(404).json({ message: "Blog not found" });
     }
 
     // If deletion is successful, return a success message
     res.status(200).json({ message: "Blog deleted successfully" });
   } catch (error) {
     console.error("Error deleting blog:", error);
     res.status(500).json({ message: "Error deleting blog" });
   }
 });
 