import { useEffect, useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { HiOutlinePlus, HiOutlineBanknotes, HiOutlineCreditCard } from "react-icons/hi2";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";
import Badge from "../../components/Badge";
import StatCard from "../../components/StatCard";

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState({});
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState(false);
  const [payModal, setPayModal] = useState(null); // holds the fee being paid
  const [assignTo, setAssignTo] = useState("student"); // "student" | "class"

  const assignForm = useForm();
  const payForm = useForm();

  const load = async () => {
    setLoading(true);
    const [f, s, c] = await Promise.all([
      api.get("/fees"),
      api.get("/students", { params: { limit: 500 } }),
      api.get("/classes"),
    ]);
    setFees(f.data.data.fees);
    setSummary(f.data.data.summary);
    setStudents(s.data.data.students);
    setClasses(c.data.data.classes);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submitAssign = async (values) => {
    try {
      await api.post("/fees", values);
      toast.success("Fee assigned successfully");
      assignForm.reset();
      setAssignModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign fee");
    }
  };

  const submitPayment = async (values) => {
    try {
      await api.post(`/fees/${payModal._id}/pay`, values);
      toast.success("Payment recorded successfully");
      payForm.reset();
      setPayModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to record payment");
    }
  };

  const payable = (f) => f.amount - f.discount + f.fine;
  const paid = (f) => f.payments.reduce((s, p) => s + p.amount, 0);

  if (loading) return <Loader label="Loading fees" />;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={HiOutlineBanknotes} label="Total Billed" value={`₹${summary.totalBilled?.toLocaleString() || 0}`} accent="violet" />
        <StatCard icon={HiOutlineCreditCard} label="Collected" value={`₹${summary.totalCollected?.toLocaleString() || 0}`} accent="emerald" delay={0.05} />
        <StatCard icon={HiOutlineBanknotes} label="Pending Records" value={summary.pendingCount || 0} accent="amber" delay={0.1} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-600/60 dark:text-mist-200/50">{fees.length} fee records</p>
        <button onClick={() => setAssignModal(true)} className="btn-primary">
          <HiOutlinePlus className="h-4 w-4" /> Assign fee
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-x-auto">
        {fees.length ? (
          <table className="data-table">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-ink-600/50 dark:text-mist-200/40">
                <th className="pb-3">Student</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Paid</th>
                <th className="pb-3">Due date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f._id} className="border-t border-ink-700/10 dark:border-white/10">
                  <td className="py-3">{f.student?.user?.name || "—"}</td>
                  <td className="py-3">{f.category}</td>
                  <td className="py-3 font-mono">₹{payable(f).toLocaleString()}</td>
                  <td className="py-3 font-mono">₹{paid(f).toLocaleString()}</td>
                  <td className="py-3">{new Date(f.dueDate).toLocaleDateString()}</td>
                  <td className="py-3"><Badge status={f.status} /></td>
                  <td className="py-3 text-right">
                    {f.status !== "paid" && (
                      <button onClick={() => setPayModal(f)} className="rounded-lg px-3 py-1 text-xs font-medium text-violet-600 hover:bg-violet-500/10">
                        Record payment
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState icon={HiOutlineBanknotes} title="No fee records yet" message="Assign fees to a student or a whole class to get started." />
        )}
      </motion.div>

      <Modal open={assignModal} onClose={() => setAssignModal(false)} title="Assign fee" wide>
        <form onSubmit={assignForm.handleSubmit(submitAssign)} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 flex gap-2">
            <button type="button" onClick={() => setAssignTo("student")} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${assignTo === "student" ? "bg-violet-500 text-white" : "bg-ink-700/5 dark:bg-white/5"}`}>Single student</button>
            <button type="button" onClick={() => setAssignTo("class")} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${assignTo === "class" ? "bg-violet-500 text-white" : "bg-ink-700/5 dark:bg-white/5"}`}>Whole class + section</button>
          </div>

          {assignTo === "student" ? (
            <div className="sm:col-span-2">
              <select {...assignForm.register("studentId", { required: assignTo === "student" })} className="input-field">
                <option value="">Select student</option>
                {students.map((s) => <option key={s._id} value={s._id}>{s.user?.name} — {s.class?.name} {s.section}</option>)}
              </select>
            </div>
          ) : (
            <>
              <select {...assignForm.register("classId", { required: assignTo === "class" })} className="input-field">
                <option value="">Select class</option>
                {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input {...assignForm.register("section", { required: assignTo === "class" })} className="input-field" placeholder="Section e.g. A" />
            </>
          )}

          <select {...assignForm.register("category", { required: true })} className="input-field">
            <option value="">Fee category</option>
            <option value="Tuition Fee">Tuition Fee</option>
            <option value="Transport Fee">Transport Fee</option>
            <option value="Library Fee">Library Fee</option>
            <option value="Exam Fee">Exam Fee</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
          <input {...assignForm.register("amount", { required: true })} type="number" className="input-field" placeholder="Amount (₹)" />
          <input {...assignForm.register("discount")} type="number" className="input-field" placeholder="Discount (₹, optional)" />
          <input {...assignForm.register("fine")} type="number" className="input-field" placeholder="Fine (₹, optional)" />
          <div className="sm:col-span-2">
            <input {...assignForm.register("dueDate", { required: true })} type="date" className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full">Assign fee</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Record payment">
        {payModal && (
          <form onSubmit={payForm.handleSubmit(submitPayment)} className="space-y-4">
            <div className="rounded-xl bg-ink-700/5 dark:bg-white/5 p-3 text-sm">
              <p className="font-medium">{payModal.student?.user?.name}</p>
              <p className="text-xs text-ink-600/50 dark:text-mist-200/40">
                {payModal.category} · Payable ₹{payable(payModal).toLocaleString()} · Paid so far ₹{paid(payModal).toLocaleString()}
              </p>
            </div>
            <input {...payForm.register("amount", { required: true })} type="number" className="input-field" placeholder="Amount received (₹)" />
            <select {...payForm.register("mode")} className="input-field">
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="cheque">Cheque</option>
              <option value="card">Card</option>
            </select>
            <input {...payForm.register("receiptNo")} className="input-field" placeholder="Receipt No. (optional)" />
            <button type="submit" className="btn-primary w-full">Record payment</button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Fees;
