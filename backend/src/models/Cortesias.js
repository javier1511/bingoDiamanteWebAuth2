// models/LoginDaily.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const cortesiasSchema = new Schema(
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
    cortesias:{ type: Number, required: true}
  },
  { versionKey: false }
);



export default mongoose.model("Cortesias", cortesiasSchema);
