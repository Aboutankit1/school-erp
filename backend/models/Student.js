import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    admissionNo: { type: String, required: true },
    rollNo: { type: String },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    section: { type: String, required: true },
    dob: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    bloodGroup: { type: String },
    address: { type: String },
    admissionDate: { type: Date, default: Date.now },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" },
    photo: { type: String, default: "" },
    documents: [{ name: String, url: String }],
    status: {
      type: String,
      enum: ["active", "promoted", "transferred", "graduated"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
