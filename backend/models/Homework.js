import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    title: { type: String, required: true },
    description: { type: String },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    section: { type: String, required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
    attachments: [{ name: String, url: String, type: String }],
    dueDate: { type: Date, required: true },
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        submittedAt: { type: Date, default: Date.now },
        attachment: { name: String, url: String },
        status: { type: String, enum: ["submitted", "late", "graded"], default: "submitted" },
        grade: { type: String },
        feedback: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Homework", homeworkSchema);
