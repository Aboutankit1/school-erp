import { useEffect, useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { HiOutlinePlus, HiOutlineBuildingLibrary } from "react-icons/hi2";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";

const ClassesSubjects = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classModal, setClassModal] = useState(false);
  const [subjectModal, setSubjectModal] = useState(false);
  const classForm = useForm();
  const subjectForm = useForm();

  const load = async () => {
    setLoading(true);
    const [c, s] = await Promise.all([api.get("/classes"), api.get("/classes/subjects/all")]);
    setClasses(c.data.data.classes);
    setSubjects(s.data.data.subjects);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submitClass = async (values) => {
    try {
      await api.post("/classes", { name: values.name, sections: values.sections.split(",").map((s) => s.trim()) });
      toast.success("Class created");
      classForm.reset();
      setClassModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create class");
    }
  };

  const submitSubject = async (values) => {
    try {
      await api.post("/classes/subjects", values);
      toast.success("Subject created");
      subjectForm.reset();
      setSubjectModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create subject");
    }
  };

  if (loading) return <Loader label="Loading classes" />;

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Classes</h3>
          <button onClick={() => setClassModal(true)} className="btn-secondary"><HiOutlinePlus className="h-4 w-4" /> New class</button>
        </div>
        {classes.length ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {classes.map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card">
                <p className="font-display text-base font-semibold">{c.name}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.sections?.map((s) => (
                    <span key={s} className="rounded-lg bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-600 dark:text-violet-300">Sec {s}</span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-ink-600/50 dark:text-mist-200/40">
                  Class teacher: {c.classTeacher?.user?.name || "Not assigned"}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card"><EmptyState icon={HiOutlineBuildingLibrary} title="No classes yet" message="Create your first class to begin structuring sections." /></div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold">Subjects</h3>
          <button onClick={() => setSubjectModal(true)} className="btn-secondary"><HiOutlinePlus className="h-4 w-4" /> New subject</button>
        </div>
        <div className="glass-card overflow-x-auto">
          {subjects.length ? (
            <table className="data-table">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-ink-600/50 dark:text-mist-200/40">
                  <th className="pb-2">Subject</th><th className="pb-2">Code</th><th className="pb-2">Class</th><th className="pb-2">Teacher</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((s) => (
                  <tr key={s._id} className="border-t border-ink-700/10 dark:border-white/10">
                    <td className="py-2.5">{s.name}</td>
                    <td className="py-2.5 font-mono text-xs">{s.code}</td>
                    <td className="py-2.5">{s.class?.name || "—"}</td>
                    <td className="py-2.5">{s.teacher?.user?.name || "Not assigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="py-4 text-sm text-ink-600/50">No subjects yet.</p>}
        </div>
      </div>

      <Modal open={classModal} onClose={() => setClassModal(false)} title="New class">
        <form onSubmit={classForm.handleSubmit(submitClass)} className="space-y-4">
          <input {...classForm.register("name", { required: true })} className="input-field" placeholder="e.g. Class 10" />
          <input {...classForm.register("sections", { required: true })} className="input-field" placeholder="Sections, comma separated e.g. A, B, C" />
          <button type="submit" className="btn-primary w-full">Create class</button>
        </form>
      </Modal>

      <Modal open={subjectModal} onClose={() => setSubjectModal(false)} title="New subject">
        <form onSubmit={subjectForm.handleSubmit(submitSubject)} className="space-y-4">
          <input {...subjectForm.register("name", { required: true })} className="input-field" placeholder="e.g. Mathematics" />
          <input {...subjectForm.register("code", { required: true })} className="input-field" placeholder="e.g. MATH10" />
          <select {...subjectForm.register("class")} className="input-field">
            <option value="">Assign to class</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <button type="submit" className="btn-primary w-full">Create subject</button>
        </form>
      </Modal>
    </div>
  );
};

export default ClassesSubjects;
