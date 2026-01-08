import { Schema, model } from "mongoose";

const smsSchema = new Schema(
    {
    from: { type: String, required: true },
    to:   { type: String, required: true },
    text: { type: String, required: true },
    providerResponse: { type: Object }, // respuesta cruda del proveedor
    status: { type: String, default: "unknown" } // delivered, queued, failed, etc.
  },
  { timestamps: true }
);

export default model("Sms", smsSchema);
