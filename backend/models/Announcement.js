import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: {
      type: [String],
      enum: ["all", "teacher", "student", "parent"],
      default: ["all"],
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["notice", "event", "holiday"], default: "notice" },
    eventDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
