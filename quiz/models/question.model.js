const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      require: true,
    },
    options: {
      type: [String],
      require: true,
    },

    correctAnswer: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

questionSchema.plugin(autopopulate);

module.exports = mongoose.model("Question", questionSchema);
