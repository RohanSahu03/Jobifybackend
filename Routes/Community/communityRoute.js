const express = require("express");
const router = express.Router();
const communityController=require("../../Controller/Community/communityController")
const multer = require("multer");
const auth = require("../../middlewares/auth")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "Public/SocialPost");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });


// Route to create a new post
router.post("/post",upload.any(),auth,communityController.createPost);

// Route to delete a post by user id
router.delete("/post/:id",auth,communityController.deletePost);

// Route for fetching all post
router.get("/post", auth,communityController.getAllPosts);

// Route to add Comment
router.post("/post/comment",auth,communityController.addComment);

router.post('/post/reaction',auth, communityController.addReaction);

module.exports = router;