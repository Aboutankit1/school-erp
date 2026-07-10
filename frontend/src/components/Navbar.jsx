import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/slices/uiSlice";
import { logout } from "../redux/slices/authSlice";
import ThemeToggle from "./ThemeToggle";
import { HiOutlineBars3, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const roleLabels = {
  superadmin: "Super Admin",
  schooladmin: "School Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

const pageTitles = {
  "/dashboard": "Overview",
  "/students": "Students",
  "/parents": "Parents",
  "/teachers": "Teachers",
  "/classes": "Classes & Subjects",
  "/fees": "Fees",
  "/attendance": "Attendance",
  "/homework": "Homework",
  "/announcements": "Announcements",
  "/superadmin": "Platform Overview",
  "/superadmin/schools": "Manage Schools",
};

const Navbar = ({ title }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const location = useLocation();
  const resolvedTitle = pageTitles[location.pathname] || title;

  useEffect(() => {
    const handler = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200 bg-white px-5 py-3.5 dark:border-ink-700 dark:bg-ink-900">
      <button onClick={() => dispatch(toggleSidebar())} className="rounded-md p-1.5 hover:bg-mist-100 dark:hover:bg-white/10 lg:hidden">
        <HiOutlineBars3 className="h-6 w-6" />
      </button>

      <div className="min-w-0">
        <p className="label-eyebrow">{roleLabels[user?.role]}</p>
        <h1 className="truncate font-display text-lg font-semibold">{resolvedTitle}</h1>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-md border border-slate-200 dark:border-ink-600 bg-white dark:bg-ink-800 py-1.5 pl-1.5 pr-3 hover:bg-mist-50 dark:hover:bg-ink-700">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600 font-display text-xs font-semibold text-white">
              {user?.name?.charAt(0) || "U"}
            </div>
            <span className="hidden text-sm font-medium sm:block">{user?.name?.split(" ")[0]}</span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
                className="glass-panel absolute right-0 mt-2 w-48 bg-white p-1.5 shadow-popover dark:bg-ink-800"
              >
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-medium">{user?.name}</p>
                  <p className="truncate text-xs text-ink-500 dark:text-mist-200/40">{user?.email}</p>
                </div>
                <button
                  onClick={() => dispatch(logout())}
                  className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                >
                  <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
