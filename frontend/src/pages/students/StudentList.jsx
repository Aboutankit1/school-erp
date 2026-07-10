import { useEffect, useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { HiOutlinePlus, HiOutlineMagnifyingGlass, HiOutlineUserGroup, HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import CredentialsModal from "../../components/CredentialsModal";
import EmptyState from "../../components/EmptyState";
import Badge from "../../components/Badge";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadStudents = async () => {
    setLoading(true);
    const res = await api.get("/students", { params: { search } });
    setStudents(res.data.data.students);
    setLoading(false);
  };

  const loadClasses = async () => {
    const res = await api.get("/classes");
    setClasses(res.data.data.classes);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    const t = setTimeout(loadStudents, 300);
    return () => clearTimeout(t);
  }, [search]);

  const onSubmit = async (values) => {
    try {
      const res = await api.post("/students", values);
      toast.success("Student admitted successfully");
      reset();
      setModalOpen(false);
      setCredentials(res.data.data.credentials);
      loadStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add student");
    }
  };

  const removeStudent = async (id) => {
    if (!confirm("Remove this student?")) return;
    await api.delete(`/students/${id}`);
    toast.success("Student removed");
    loadStudents();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-600/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="input-field pl-11" />
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary shrink-0">
          <HiOutlinePlus className="h-4 w-4" /> New admission
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-x-auto">
        {loading ? (
          <Loader label="Loading students" />
        ) : students.length ? (
          <table className="data-table">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-ink-600/50 dark:text-mist-200/40">
                <th className="pb-3">Name</th>
                <th className="pb-3">Admission No.</th>
                <th className="pb-3">Class</th>
                <th className="pb-3">Section</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t border-ink-700/10 dark:border-white/10">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 text-xs font-semibold text-white">
                        {s.user?.name?.charAt(0)}
                      </div>
                      {s.user?.name}
                    </div>
                  </td>
                  <td className="py-3 font-mono text-xs">{s.admissionNo}</td>
                  <td className="py-3">{s.class?.name}</td>
                  <td className="py-3">{s.section}</td>
                  <td className="py-3"><Badge status={s.status} /></td>
                  <td className="py-3 text-right">
                    <button onClick={() => removeStudent(s._id)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10">
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState icon={HiOutlineUserGroup} title="No students yet" message="Start by admitting your first student to this school." />
        )}
      </motion.div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New student admission" wide>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Full name</label>
            <input {...register("name", { required: true })} className="input-field" placeholder="Student name" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Email</label>
            <input {...register("email", { required: true })} type="email" className="input-field" placeholder="student@school.edu" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Admission No.</label>
            <input {...register("admissionNo", { required: true })} className="input-field" placeholder="ADM2026001" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Roll No.</label>
            <input {...register("rollNo")} className="input-field" placeholder="12" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Class</label>
            <select {...register("classId", { required: true })} className="input-field">
              <option value="">Select class</option>
              {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Section</label>
            <input {...register("section", { required: true })} className="input-field" placeholder="A" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Gender</label>
            <select {...register("gender")} className="input-field">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Password (optional)</label>
            <input {...register("password")} type="text" className="input-field" placeholder="Leave blank to auto-generate" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Date of birth</label>
            <input {...register("dob")} type="date" className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full">Admit student</button>
          </div>
        </form>
      </Modal>

      <CredentialsModal
        open={!!credentials}
        onClose={() => setCredentials(null)}
        credentials={credentials}
        personLabel="this student"
      />
    </div>
  );
};

export default StudentList;
