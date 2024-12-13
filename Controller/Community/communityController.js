// const Application = require("../../Models/Candidate/Application");
const Community = require("../../Models/Community/community");
const asynHandler = require("express-async-handler");
const { genToken } = require("../../utils/generateToken");
const Token = require("../../Models/Token");
const bcrypt = require("bcryptjs");


exports.createPost = asynHandler(async (req, res) => {
  try{
    const {
        userId,
        caption,

    } = req.body;

    if (!userId ) {
      return res.status(400).json({ message: 'User ID is required.' });
    }
  
    if (req.files && req.files.length != 0) {
      let arr = req.files;
      let i;
      for (i = 0; i < arr.length; i++) {
        if (arr[i].fieldname == "postImg") {
         postImg = arr[i].filename;
        }
      }
    }

    let newPost = await Community.create({
        userId,
        postImg,
        caption,
    });
  
    let token = await genToken(newPost._id);
    if (!token) {
      await newPost.deleteOne({ _id: newPost._id });
    }
  
    newPost = await Community.findById(newPost._id);
    res.status(201).json({
      status: "Success",
      data: newPost,
      token,
    });
  }catch(error){
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
  });

// ------------get applied jobs-----------
exports.getAllPosts = async (req, res) => {
    try {
      const allpost = await Community.find();
      if (!allpost) {
        return res.status(204).json({
          status: "Post  Not Found",
        });
      }
  
    //   let token = await genToken(allpost);

      return res.status(200).json({
        status: "Success",
        data: allpost
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to retrieve Posts", error: error.message });
    }
  };


// -----------add comment--------------
  exports.addComment = asynHandler(async (req, res) => {
    try {
      const { postId, userId, comment } = req.body;
  
      // Validate input
      if (!postId || !userId || !comment) {
        return res.status(400).json({ message: 'Post ID, User ID, and comment are required.' });
      }
  
      // Check if the post exists
      const post = await Community.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }
  
       // Create the comment object
    const newComment = {
      userId,
      comment,
    };

    // Push the new comment to the comments array
    post.comments.push(newComment);

    await post.save();
  
      // Return success response with the saved comment
      res.status(201).json({
        message: 'Comment added successfully.',
        comments: post.comments, // Return updated comments array
      });
  
    } catch (error) {
      console.error('Error adding comment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

// ------------add reactions----------------
  exports.addReaction = asynHandler(async (req, res) => {
    try {
     
      const {postId, reactorId, reaction } = req.body; // Get reactorId and reaction from request body
  
      // Validate input
      if (!postId || !reactorId || !reaction) {
        return res.status(400).json({ message: 'Post ID, Reactor ID, and reaction are required.' });
      }
  
      // Find the community post by postId
      const communityPost = await Community.findById(postId);
      if (!communityPost) {
        return res.status(404).json({ message: 'Post not found.' });
      }
  
      // Create the reaction object
      const newReaction = {
        reactorId,
        reaction,
      };
  
      // Optionally check if the user already reacted
      const existingReactionIndex = communityPost.reactions.findIndex(r => r.reactorId === reactorId);
      if (existingReactionIndex !== -1) {
        // Update the existing reaction
        communityPost.reactions[existingReactionIndex].reaction = reaction;
      } else {
        // Push the new reaction to the reactions array
        communityPost.reactions.push(newReaction);
      }
  
      // Save the updated community post
      await communityPost.save();
  
      // Return success response
      res.status(201).json({
        message: 'Reaction added successfully.',
        reactions: communityPost.reactions, // Return updated reactions array
      });
  
    } catch (error) {
      console.error('Error adding reaction:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });


//----------delete post------------------
  exports.deletePost = async (req, res) => {
    const userId = req.params.id;
    try {
      // Find vendor by ID and delete
      const deletedPost = await Community.findByIdAndDelete(userId);
  
      if (!deletedPost) {
        return res.status(204).json({ message: "Post not found" });
      }
  
      return res
        .status(200)
        .json({ message: "Post deleted successfully", data: deletedPost });
    } catch (error) {
     return res
        .status(500)
        .json({ message: "Failed to delete Post", error: error.message });
    }
  };
  




