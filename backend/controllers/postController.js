const Post = require("../models/Post");

// Create a new post
exports.createPost = async (req, res) => {
  const { title, username, content } = req.body;
  const newPost = new Post({
    title,
    username,
    content,
    image: req.file ? req.file.buffer : null,
    imageType: req.file ? req.file.mimetype : null,
  });

  try {
    await newPost.save();
    res.status(201).send("Post created successfully");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Error creating post");
  }
};

// Fetch all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    const { username } = req.query;

    const formattedPosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      username: post.username,
      contentPreview: post.content.length > 100
        ? post.content.slice(0, 100) + "..."
        : post.content,
      contentFull: post.content,
      image: post.image ? `data:${post.imageType};base64,${post.image.toString("base64")}` : null,
      createdAt: post.createdAt,
      likesCount: post.likes.length,
      userLiked: username ? post.likes.includes(username) : false,
    }));

    res.send(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error retrieving posts");
  }
};

// Fetch a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const { viewer } = req.query; // Viewer to determine if they liked the post
    
        const post = await Post.findById(id);
        if (!post) {
          return res.status(404).send("Post not found");
        }
    
        const formattedPost = {
          id: post._id,
          title: post.title,
          username: post.username,
          content: post.content,
          image: post.image
            ? `data:${post.imageType};base64,${post.image.toString("base64")}`
            : null,
          createdAt: post.createdAt,
          likesCount: post.likes.length,
          userLiked: viewer ? post.likes.includes(viewer) : false,
        };
    
        res.send(formattedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).send("Error retrieving post");
      }
};

// Fetch posts by a specific user
exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ username: req.params.username });
    const username=req.params.username;
    const formattedPosts = posts.map(post => ({
      id: post._id,
      title: post.title,
      username: post.username,
      contentPreview: post.content.length > 100
        ? post.content.slice(0, 100) + "..."
        : post.content,
      contentFull: post.content,
      image: post.image ? `data:${post.imageType};base64,${post.image.toString("base64")}` : null,
      createdAt: post.createdAt,
      likesCount: post.likes.length,
      userLiked: username ? post.likes.includes(username) : false,
    }));

    res.send(formattedPosts);

  } catch (error) {
    console.error("Error fetching user's posts:", error);
    res.status(500).send("Error retrieving posts");
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const updateData = { title: req.body.title, content: req.body.content };
    if (req.file) {
      updateData.image = req.file.buffer;
      updateData.imageType = req.file.mimetype;
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedPost) {
      return res.status(404).send("Post not found");
    }

    res.send("Post updated successfully");
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send("Error updating post");
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).send("Post not found");
    }
    res.send("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Error deleting post");
  }
};

// Toggle like for a post
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const hasLiked = post.likes.includes(req.body.username);
    if (hasLiked) {
      post.likes = post.likes.filter(user => user !== req.body.username);
    } else {
      post.likes.push(req.body.username);
    }

    await post.save();
    res.send("Like toggled successfully");
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).send("Error toggling like");
  }
};
