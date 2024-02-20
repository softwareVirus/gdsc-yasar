const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const gameSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      default: null,
    },
    participants: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            autopopulate: true,
          },
          score: {
            type: Number,
            default: 0,
          },
          answered: {
            type: Boolean,
            default: false,
          },
          strikeCount: {
            type: Number,
            default: 0,
          },
        },
      ],
      autopopulate: true,
      default: [],
    },
    active: {
      type: Boolean,
      default: false,
    },
    questions: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          autopopulate: true,
        },
      ],
      default: [],
    },
    currentQuestionNumber: {
      type: Number,
      default: 0,
    },
    questionTime: {
      type: Date,
      default: null,
    },
    isGameStarted: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

gameSchema.plugin(autopopulate);

module.exports = mongoose.model("Game", gameSchema);
