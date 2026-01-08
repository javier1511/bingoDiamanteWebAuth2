// models/LoginDaily.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const loginDailySchema = new Schema(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },

    // snapshot (por si cambian después)
    name: { type: String, required: true },
    mobile: { type: String, required: true },

    loginDate: { type: String, required: true }, // YYYY-MM-DD
    loginHour: { type: String, required: true }, // HH:mm:ss
    loginAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

// 1 login por día por jugador
loginDailySchema.index({ player: 1, loginDate: 1 }, { unique: true });

export default mongoose.model("LoginDaily", loginDailySchema);
