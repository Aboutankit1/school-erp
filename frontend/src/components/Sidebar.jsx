import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { closeSidebar } from "../redux/slices/uiSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineClipboardDocumentCheck,
  HiOutlineBookOpen,
  HiOutlineMegaphone,
  HiOutlineBuildingLibrary,
  HiOutlineBanknotes,
  HiOutlineXMark,
} from "react-icons/hi2";

// Grouped nav config — each role gets sections with a label + links,
// which reads more like a real ERP sidebar than one flat list.
const navByRole = {
  schooladmin: [
    { section: null, links: [{ to: "/dashboard", label: "Overview", icon: HiOutlineSquares2X2 }] },
    {
      section: "People",
      links: [
        { to: "/students", label: "Students", icon: HiOutlineUserGroup },
        { to: "/parents", label: "Parents", icon: HiOutlineUsers },
        { to: "/teachers", label: "Teachers", icon: HiOutlineAcademicCap },
      ],
    },
    {
      section: "Academics",
      links: [
        { to: "/classes", label: "Classes & Subjects", icon: HiOutlineBuildingLibrary },
        { to: "/attendance", label: "Attendance", icon: HiOutlineClipboardDocumentCheck },
        { to: "/homework", label: "Homework", icon: HiOutlineBookOpen },
      ],
    },
    { section: "Finance", links: [{ to: "/fees", label: "Fees", icon: HiOutlineBanknotes }] },
    { section: "Communication", links: [{ to: "/announcements", label: "Announcements", icon: HiOutlineMegaphone }] },
  ],
  teacher: [
    { section: null, links: [{ to: "/dashboard", label: "Overview", icon: HiOutlineSquares2X2 }] },
    {
      section: "Academics",
      links: [
        { to: "/attendance", label: "Attendance", icon: HiOutlineClipboardDocumentCheck },
        { to: "/homework", label: "Homework", icon: HiOutlineBookOpen },
      ],
    },
    { section: "Communication", links: [{ to: "/announcements", label: "Announcements", icon: HiOutlineMegaphone }] },
  ],
  superadmin: [
    {
      section: null,
      links: [
        { to: "/superadmin", label: "Overview", icon: HiOutlineSquares2X2 },
        { to: "/superadmin/schools", label: "Schools", icon: HiOutlineBuildingLibrary },
      ],
    },
  ],
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
  const sections = navByRole[user?.role] || [];

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-600 font-display text-base font-bold text-white">
          E
        </div>
        <div>
          <p className="font-display text-sm font-semibold leading-none text-white">EduSphere</p>
          <p className="mt-1 text-[10px] text-slate-400">School ERP Pro</p>
        </div>
        <button onClick={() => dispatch(closeSidebar())} className="ml-auto rounded-md p-1.5 text-slate-300 hover:bg-white/10 lg:hidden">
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4">
        {sections.map((group, gi) => (
          <div key={gi}>
            {group.section && (
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {group.section}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/dashboard" || link.to === "/superadmin"}
                  onClick={() => dispatch(closeSidebar())}
                  className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link-active" : ""}`}
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Plan</p>
        <p className="mt-0.5 text-sm font-medium capitalize text-slate-200">{user?.school?.plan || "—"}</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink-900 lg:flex">
        {content}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink-950/60 lg:hidden"
              onClick={() => dispatch(closeSidebar())}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-ink-900 lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
