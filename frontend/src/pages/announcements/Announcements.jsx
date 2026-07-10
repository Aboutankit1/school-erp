import { useEffect, useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { HiOutlinePlus, HiOutlineMegaphone, HiOutlineTrash } from "react-icons/hi2";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";

const typeStyles = {
  notice: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
  event: "bg-amber-500/10 text-amber-600",
  holiday: "bg-emerald-500/10 text-emerald-600",
};

const Announcements = () => {
  const { user } = useSelector((s) => s.auth);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    const res = await api.get("/announcements");
    setItems(res.data.data.announcements);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (values) => {
    try {
      await api.post("/announcements", { ...values, audience: [values.audience || "all"] });
      toast.success("Announcement published");
      reset();
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    await api.delete(`/announcements/${id}`);
    toast.success("Announcement deleted");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-600/60 dark:text-mist-200/50">{items.length} published</p>
        {(user?.role === "schooladmin" || user?.role === "teacher") && (
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <HiOutlinePlus className="h-4 w-4" /> New announcement
          </button>
        )}
      </div>

      {loading ? (
        <Loader label="Loading announcements" />
      ) : items.length ? (
        <div className="space-y-3">
          {items.map((a, i) => (
            <motion.div key={a._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card flex items-start justify-between gap-4">
              <div>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${typeStyles[a.type]}`}>{a.type}</span>
                <h4 className="mt-2 font-display text-base font-semibold">{a.title}</h4>
                <p className="mt-1 text-sm text-ink-600/60 dark:text-mist-200/50">{a.message}</p>
                <p className="mt-2 text-xs text-ink-600/40 dark:text-mist-200/30">
                  By {a.createdBy?.name} · {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>
              {user?.role === "schooladmin" && (
                <button onClick={() => remove(a._id)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10">
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card"><EmptyState icon={HiOutlineMegaphone} title="No announcements yet" message="Publish a notice, event, or holiday for your school." /></div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New announcement">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("title", { required: true })} className="input-field" placeholder="Title" />
          <textarea {...register("message", { required: true })} rows={3} className="input-field" placeholder="Message" />
          <select {...register("type")} className="input-field">
            <option value="notice">Notice</option>
            <option value="event">Event</option>
            <option value="holiday">Holiday</option>
          </select>
          <select {...register("audience")} className="input-field">
            <option value="all">Everyone</option>
            <option value="teacher">Teachers</option>
            <option value="student">Students</option>
            <option value="parent">Parents</option>
          </select>
          <button type="submit" className="btn-primary w-full">Publish</button>
        </form>
      </Modal>
    </div>
  );
};

export default Announcements;
