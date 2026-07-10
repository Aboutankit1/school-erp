const styles = {
  present: "bg-emerald-500/10 text-emerald-500",
  absent: "bg-rose-500/10 text-rose-500",
  late: "bg-amber-500/10 text-amber-600",
  leave: "bg-sky-500/10 text-sky-500",
  active: "bg-emerald-500/10 text-emerald-500",
  pending: "bg-amber-500/10 text-amber-600",
  approved: "bg-emerald-500/10 text-emerald-500",
  suspended: "bg-rose-500/10 text-rose-500",
  submitted: "bg-sky-500/10 text-sky-500",
  graded: "bg-violet-500/10 text-violet-500",
  partial: "bg-amber-500/10 text-amber-600",
  paid: "bg-emerald-500/10 text-emerald-500",
};

const Badge = ({ status, children }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status] || "bg-ink-700/10 text-ink-600"}`}>
    {children || status}
  </span>
);

export default Badge;
