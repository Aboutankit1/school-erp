import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, label, value, sub, accent = "violet", delay = 0 }) => {
  const accents = {
    violet: "bg-violet-600",
    amber: "bg-amber-500",
    emerald: "bg-emerald-600",
    rose: "bg-rose-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className="glass-card flex items-center gap-4"
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${accents[accent]} text-white`}>
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <div className="min-w-0">
        <p className="label-eyebrow">{label}</p>
        <p className="mt-1 truncate font-display text-2xl font-semibold text-ink-900 dark:text-white">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-ink-500 dark:text-mist-200/50">{sub}</p>}
      </div>
    </motion.div>
  );
};

export default StatCard;
