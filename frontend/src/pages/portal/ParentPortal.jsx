import { useEffect, useState } from "react";
import api from "../../services/api";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import ThemeToggle from "../../components/ThemeToggle";
import AmbientBackground from "../../components/AmbientBackground";
import Loader from "../../components/Loader";
import { HiOutlineArrowRightOnRectangle, HiOutlineUserGroup } from "react-icons/hi2";

const ParentPortal = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/parent").then((res) => setData(res.data.data));
  }, []);

  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <div className="mx-auto max-w-5xl p-4">
        <header className="mb-6 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 dark:border-ink-700 dark:bg-ink-900">
          <div>
            <p className="label-eyebrow">Parent portal</p>
            <h1 className="font-display text-xl font-semibold">Welcome, {user?.name?.split(" ")[0]}</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={() => dispatch(logout())} className="btn-secondary !px-3 !py-2">
              <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
            </button>
          </div>
        </header>

        {!data ? <Loader label="Loading your portal" /> : !data.parent?.children?.length ? (
          <div className="glass-card text-center">No children linked to this account yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data.parent.children.map((child, i) => (
              <motion.div key={child._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 font-display font-semibold text-white">
                    {child.user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display text-base font-semibold">{child.user?.name}</p>
                    <p className="text-xs text-ink-600/50 dark:text-mist-200/40">{child.class?.name} - {child.section}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-ink-700/5 dark:bg-white/5 p-3">
                    <p className="label-eyebrow">Admission No.</p>
                    <p className="mt-1 font-mono text-sm font-semibold">{child.admissionNo}</p>
                  </div>
                  <div className="rounded-xl bg-ink-700/5 dark:bg-white/5 p-3">
                    <p className="label-eyebrow">Status</p>
                    <p className="mt-1 text-sm font-semibold capitalize">{child.status}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentPortal;
