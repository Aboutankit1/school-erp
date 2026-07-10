const Loader = ({ label = "Loading" }) => (
  <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-3 py-10">
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
    </div>
    <span className="label-eyebrow">{label}</span>
  </div>
);

export default Loader;
