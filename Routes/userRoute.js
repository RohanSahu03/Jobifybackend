const express=require("express");
const router=express.Router();
const userController=require("../Controller/userController");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "Public/Profilepic");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });

// ---------register route---------------
  router.post("/register",userController.register);

  // ---------login route---------------
router.post("/login",userController.login);

module.exports=router;
