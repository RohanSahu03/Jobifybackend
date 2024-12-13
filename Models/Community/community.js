const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const communitySchema = new mongoose.Schema(
    {
    userId:{
        type: String,
       required:true
    },
    postImg:{
        type: String,
    },
      caption: {
        type: String,
      },
      comments: [{
        userId: {
            type:String,
            required: true
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
      reactions:[
        {
            reaction:{
                type:String
            },
            reactorId:{
              type:String
            },
            createdAt: {
              type: Date,
              default: Date.now
          }
        }
      ]
    },
    {
      timestamps: true,
    }
  );

  let Community = mongoose.model("Community", communitySchema);

module.exports = Community;