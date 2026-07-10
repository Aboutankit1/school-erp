import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    occupation: { type: String },
    relation: { type: String, enum: ["father", "mother", "guardian"], default: "father" },
  },
  { timestamps: true }
);

export default mongoose.model("Parent", parentSchema);
