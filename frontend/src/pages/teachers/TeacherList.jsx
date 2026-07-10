import { useEffect, useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { HiOutlinePlus, HiOutlineAcademicCap, HiOutlineTrash } from "react-icons/hi2";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import CredentialsModal from "../../components/CredentialsModal";
import EmptyState from "../../components/EmptyState";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const load = async () => {
    setLoading(true);
    const [t, c] = await Promise.all([api.get("/teachers"), api.get("/classes")]);
    setTeachers(t.data.data.teachers);
    setClasses(c.data.data.classes);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (values) => {
    try {
      const res = await api.post("/teachers", { ...values, classes: values.classes ? [values.classes] : [] });
      toast.success("Teacher added successfully");
      reset();
      setModalOpen(false);
      setCredentials(res.data.data.credentials);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add teacher");
    }
  };

  const remove = async (id) => {
    if (!confirm("Remove this teacher?")) return;
    await api.delete(`/teachers/${id}`);
    toast.success("Teacher removed");
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-600/60 dark:text-mist-200/50">{teachers.length} teachers on staff</p>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <HiOutlinePlus className="h-4 w-4" /> Add teacher
        </button>
      </div>

      {loading ? (
        <Loader label="Loading teachers" />
      ) : teachers.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {teachers.map((t, i) => (
            <motion.div key={t._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 font-display font-semibold text-white">
                    {t.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{t.user?.name}</p>
                    <p className="text-xs text-ink-600/50 dark:text-mist-200/40">{t.employeeId}</p>
                  </div>
                </div>
                <button onClick={() => remove(t._id)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10">
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 space-y-1 text-xs text-ink-600/60 dark:text-mist-200/50">
                <p>{t.qualification || "Qualification not set"}</p>
                <p>{t.classes?.map((c) => c.name).join(", ") || "No class assigned"}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-card">
          <EmptyState icon={HiOutlineAcademicCap} title="No teachers yet" message="Add your first teacher to start building the timetable." />
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add teacher">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input {...register("name", { required: true })} className="input-field" placeholder="Full name" />
          <input {...register("email", { required: true })} type="email" className="input-field" placeholder="Email" />
          <input {...register("employeeId", { required: true })} className="input-field" placeholder="Employee ID" />
          <input {...register("qualification")} className="input-field" placeholder="Qualification" />
          <select {...register("classes")} className="input-field">
            <option value="">Assign class (optional)</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input {...register("salary")} type="number" className="input-field" placeholder="Monthly salary" />
          <input {...register("password")} type="text" className="input-field" placeholder="Password (optional — leave blank to auto-generate)" />
          <button type="submit" className="btn-primary w-full">Add teacher</button>
        </form>
      </Modal>

      <CredentialsModal
        open={!!credentials}
        onClose={() => setCredentials(null)}
        credentials={credentials}
        personLabel="this teacher"
      />
    </div>
  );
};

export default TeacherList;
