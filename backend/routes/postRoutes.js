const express = require("express");
const { upload } = require("../utils/multerConfig");
const postController = require("../controllers/postController");
const router = express.Router();

router.post("/new-post", upload.single("image"), postController.createPost);
router.get("/", postController.getAllPosts);
router.put("/:id", upload.single("image"), postController.updatePost);
router.delete("/:id", postController.deletePost);
router.put("/:id/like", postController.toggleLike);
// router.get("/:id", postController.getPostById);
// router.get("/:username", postController.getPostsByUser);
router.get("/user/:username", postController.getPostsByUser);
router.get("/:id", postController.getPostById);



module.exports = router;
