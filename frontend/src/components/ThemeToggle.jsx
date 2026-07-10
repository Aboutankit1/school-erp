import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.theme.mode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label="Toggle theme"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-ink-700/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md transition-colors hover:bg-white/90 dark:hover:bg-white/10"
    >
      <motion.div
        key={mode}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {mode === "dark" ? (
          <HiOutlineSun className="h-5 w-5 text-amber-400" />
        ) : (
          <HiOutlineMoon className="h-5 w-5 text-violet-600" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
