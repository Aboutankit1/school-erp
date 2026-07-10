import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    mode: { type: String, enum: ["cash", "online", "cheque", "card"], default: "cash" },
    receiptNo: { type: String },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const feeSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    category: { type: String, required: true }, // e.g. Tuition Fee, Transport Fee, Library Fee
    amount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    fine: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "partial", "paid"], default: "pending" },
    payments: [paymentSchema],
  },
  { timestamps: true }
);

feeSchema.methods.recalculateStatus = function () {
  const payable = this.amount - this.discount + this.fine;
  const paid = this.payments.reduce((sum, p) => sum + p.amount, 0);
  if (paid <= 0) this.status = "pending";
  else if (paid < payable) this.status = "partial";
  else this.status = "paid";
};

export default mongoose.model("Fee", feeSchema);
