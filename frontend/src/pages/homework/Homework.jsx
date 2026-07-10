import { useEffect, useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { HiOutlinePlus, HiOutlineBookOpen, HiOutlineCalendarDays } from "react-icons/hi2";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";

const Homework = () => {
  const { user } = useSelector((s) => s.auth);
  const [homeworks, setHomeworks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    const [hw, c, s] = await Promise.all([
      api.get("/homework"),
      api.get("/classes"),
      api.get("/classes/subjects/all"),
    ]);
    setHomeworks(hw.data.data.homeworks);
    setClasses(c.data.data.classes);
    setSubjects(s.data.data.subjects);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (values) => {
    try {
      await api.post("/homework", values);
      toast.success("Homework assigned successfully");
      reset();
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create homework");
    }
  };

  const canCreate = user?.role === "teacher" || user?.role === "schooladmin";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-600/60 dark:text-mist-200/50">{homeworks.length} assignments</p>
        {canCreate && (
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <HiOutlinePlus className="h-4 w-4" /> Assign homework
          </button>
        )}
      </div>

      {loading ? (
        <Loader label="Loading homework" />
      ) : homeworks.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {homeworks.map((hw, i) => (
            <motion.div key={hw._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card">
              <p className="label-eyebrow">{hw.subject?.name || "General"}</p>
              <h4 className="mt-1 font-display text-base font-semibold">{hw.title}</h4>
              <p className="mt-1.5 line-clamp-2 text-xs text-ink-600/60 dark:text-mist-200/50">{hw.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-600/50 dark:text-mist-200/40">
                <span className="flex items-center gap-1"><HiOutlineCalendarDays className="h-4 w-4" /> Due {new Date(hw.dueDate).toLocaleDateString()}</span>
                <span>{hw.submissions?.length || 0} submitted</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card"><EmptyState icon={HiOutlineBookOpen} title="No homework yet" message="Assign your first homework to get started." /></div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Assign homework" wide>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <input {...register("title", { required: true })} className="input-field" placeholder="Homework title" />
          </div>
          <div className="sm:col-span-2">
            <textarea {...register("description")} rows={3} className="input-field" placeholder="Description / instructions" />
          </div>
          <select {...register("class", { required: true })} className="input-field">
            <option value="">Select class</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input {...register("section", { required: true })} className="input-field" placeholder="Section e.g. A" />
          <select {...register("subject")} className="input-field">
            <option value="">Select subject</option>
            {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <input {...register("dueDate", { required: true })} type="date" className="input-field" />
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full">Assign homework</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Homework;
