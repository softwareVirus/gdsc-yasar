const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const roomSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      require: true,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

roomSchema.plugin(autopopulate);

module.exports = mongoose.model("RoomCode", roomSchema);
