const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");
const passportLocalMongoose = require("passport-local-mongoose");
const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    joinedGame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
    createdGame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
  },
  { timestamps: true } // This option adds created_at and updated_at fields
);

UserSchema.plugin(autopopulate);
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email", // Use 'email' field for authentication instead of 'username'
});
module.exports = mongoose.model("User", UserSchema);
