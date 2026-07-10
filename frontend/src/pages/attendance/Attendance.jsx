import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const statusOptions = [
  { value: "present", label: "Present", color: "emerald" },
  { value: "absent", label: "Absent", color: "rose" },
  { value: "late", label: "Late", color: "amber" },
  { value: "leave", label: "Leave", color: "sky" },
];

const colorMap = {
  emerald: "bg-emerald-500 text-white border-emerald-500",
  rose: "bg-rose-500 text-white border-rose-500",
  amber: "bg-amber-500 text-white border-amber-500",
  sky: "bg-sky-500 text-white border-sky-500",
};

const Attendance = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/classes").then((res) => setClasses(res.data.data.classes));
  }, []);

  useEffect(() => {
    if (!classId || !section) return;
    setLoading(true);
    api.get("/students", { params: { classId, section } }).then((res) => {
      setStudents(res.data.data.students);
      const existing = {};
      res.data.data.students.forEach((s) => (existing[s._id] = "present"));
      setMarks(existing);
      setLoading(false);
    });
  }, [classId, section]);

  const selectedClass = classes.find((c) => c._id === classId);

  const submit = async () => {
    setSaving(true);
    try {
      await api.post("/attendance/mark", {
        classId,
        section,
        date,
        records: Object.entries(marks).map(([studentId, status]) => ({ studentId, status })),
      });
      toast.success("Attendance saved successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save attendance");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Class</label>
            <select value={classId} onChange={(e) => { setClassId(e.target.value); setSection(""); }} className="input-field">
              <option value="">Select class</option>
              {classes.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Section</label>
            <select value={section} onChange={(e) => setSection(e.target.value)} className="input-field" disabled={!selectedClass}>
              <option value="">Select section</option>
              {selectedClass?.sections?.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <Loader label="Loading students" />
      ) : students.length ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
          <div className="space-y-2">
            {students.map((s) => (
              <div key={s._id} className="flex flex-col gap-3 rounded-xl border border-ink-700/10 dark:border-white/10 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 text-xs font-semibold text-white">
                    {s.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.user?.name}</p>
                    <p className="text-xs text-ink-600/50 dark:text-mist-200/40">Roll {s.rollNo || "—"}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMarks((m) => ({ ...m, [s._id]: opt.value }))}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${marks[s._id] === opt.value ? colorMap[opt.color] : "border-ink-700/10 dark:border-white/10 text-ink-600/60 dark:text-mist-200/50 hover:bg-ink-700/5 dark:hover:bg-white/5"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={submit} disabled={saving} className="btn-primary mt-5 w-full sm:w-auto">
            <HiOutlineCheckCircle className="h-4 w-4" /> {saving ? "Saving..." : "Save attendance"}
          </button>
        </motion.div>
      ) : classId && section ? (
        <div className="glass-card"><EmptyState title="No students in this section" message="Add students to this class and section first." /></div>
      ) : (
        <div className="glass-card"><EmptyState title="Select a class & section" message="Choose a class, section, and date to mark attendance." /></div>
      )}
    </div>
  );
};

export default Attendance;
