const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    {Icon && (
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
        <Icon className="h-7 w-7" />
      </div>
    )}
    <p className="font-display text-base font-semibold">{title}</p>
    <p className="max-w-xs text-sm text-ink-600/60 dark:text-mist-200/50">{message}</p>
  </div>
);

export default EmptyState;
