import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { toggleSidebar } from "../../redux/slices/uiSlice";
import ThemeToggle from "../../components/ThemeToggle";
import AmbientBackground from "../../components/AmbientBackground";
import Loader from "../../components/Loader";
import { HiOutlineBookOpen, HiOutlineClipboardDocumentCheck, HiOutlineMegaphone, HiOutlineArrowRightOnRectangle, HiOutlineCalendarDays, HiOutlineBanknotes } from "react-icons/hi2";

const StudentPortal = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/student").then((res) => setData(res.data.data));
  }, []);

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <div className="mx-auto max-w-5xl p-4">
        <header className="mb-6 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-ink-700 dark:bg-ink-900">
          <div>
            <p className="label-eyebrow">Student portal</p>
            <h1 className="font-display text-xl font-semibold">Hey, {user?.name?.split(" ")[0]} 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => dispatch(logout())} className="btn-secondary !px-3 !py-2">
              <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
            </button>
          </div>
        </header>

        {!data ? <Loader label="Loading your portal" /> : !data.student ? (
          <div className="glass-card text-center">No student profile linked to this account yet.</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                <p className="label-eyebrow">Class</p>
                <p className="mt-1 font-display text-xl font-semibold">{data.student.class?.name} - {data.student.section}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card">
                <p className="label-eyebrow">Attendance (last 30 records)</p>
                <p className="mt-1 font-display text-xl font-semibold">{data.attendancePercent}%</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
                <p className="label-eyebrow">Admission No.</p>
                <p className="mt-1 font-display text-xl font-semibold font-mono">{data.student.admissionNo}</p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card">
                <div className="mb-3 flex items-center gap-2">
                  <HiOutlineBookOpen className="h-5 w-5 text-violet-500" />
                  <h3 className="font-display text-base font-semibold">Homework</h3>
                </div>
                <div className="space-y-2">
                  {data.homeworks?.length ? data.homeworks.map((hw) => (
                    <div key={hw._id} className="rounded-xl border border-ink-700/10 dark:border-white/10 p-3">
                      <p className="text-sm font-medium">{hw.title}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-ink-600/50 dark:text-mist-200/40">
                        <HiOutlineCalendarDays className="h-3.5 w-3.5" /> Due {new Date(hw.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )) : <p className="text-sm text-ink-600/50">No homework assigned yet.</p>}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
                <div className="mb-3 flex items-center gap-2">
                  <HiOutlineMegaphone className="h-5 w-5 text-amber-500" />
                  <h3 className="font-display text-base font-semibold">Notices</h3>
                </div>
                <div className="space-y-2">
                  {data.announcements?.length ? data.announcements.map((a) => (
                    <div key={a._id} className="rounded-xl border border-ink-700/10 dark:border-white/10 p-3">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-ink-600/50 dark:text-mist-200/40">{a.message}</p>
                    </div>
                  )) : <p className="text-sm text-ink-600/50">No notices yet.</p>}
                </div>
              </motion.div>
            </div>

            {data.pendingFees?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="glass-card">
                <div className="mb-3 flex items-center gap-2">
                  <HiOutlineBanknotes className="h-5 w-5 text-rose-500" />
                  <h3 className="font-display text-base font-semibold">Pending fees</h3>
                </div>
                <div className="space-y-2">
                  {data.pendingFees.map((f) => (
                    <div key={f._id} className="flex items-center justify-between rounded-xl border border-ink-700/10 dark:border-white/10 p-3">
                      <div>
                        <p className="text-sm font-medium">{f.category}</p>
                        <p className="text-xs text-ink-600/50 dark:text-mist-200/40">Due {new Date(f.dueDate).toLocaleDateString()}</p>
                      </div>
                      <p className="font-mono text-sm font-semibold text-rose-500">₹{(f.amount - f.discount + f.fine).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
