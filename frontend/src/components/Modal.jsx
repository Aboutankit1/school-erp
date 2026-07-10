import { AnimatePresence, motion } from "framer-motion";
import { HiXMark } from "react-icons/hi2";

const Modal = ({ open, onClose, title, children, wide = false }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`glass-panel max-h-[88vh] w-full ${wide ? "max-w-2xl" : "max-w-md"} overflow-y-auto bg-white/90 dark:bg-ink-800/95 p-6`}
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-ink-700/5 dark:hover:bg-white/10">
              <HiXMark className="h-5 w-5" />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;
