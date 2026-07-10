import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeId: { type: String, required: true },
    qualification: { type: String },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
    joiningDate: { type: Date, default: Date.now },
    salary: { type: Number },
    photo: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
