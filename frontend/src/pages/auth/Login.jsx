import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineArrowRight } from "react-icons/hi2";
import { loginUser } from "../../redux/slices/authSlice";
import AmbientBackground from "../../components/AmbientBackground";
import ThemeToggle from "../../components/ThemeToggle";

const roleHome = {
  superadmin: "/superadmin",
  schooladmin: "/dashboard",
  teacher: "/dashboard",
  student: "/portal",
  parent: "/portal",
};

const demoAccounts = [
  { role: "School Admin", email: "schooladmin@greenfield.edu", password: "Admin@123" },
  { role: "Teacher", email: "teacher@greenfield.edu", password: "Teacher@123" },
  { role: "Student", email: "student@greenfield.edu", password: "Student@123" },
  { role: "Parent", email: "parent@greenfield.edu", password: "Parent@123" },
  { role: "Super Admin", email: "superadmin@schoolerp.com", password: "Super@123" },
];

const Login = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status } = useSelector((s) => s.auth);

  if (user) return <Navigate to={roleHome[user.role]} replace />;

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values));
    if (loginUser.fulfilled.match(result)) {
      navigate(roleHome[result.payload.user.role]);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <AmbientBackground />
      <div className="absolute right-6 top-6"><ThemeToggle /></div>

      <div className="grid w-full max-w-5xl overflow-hidden rounded-xl2 shadow-glass lg:grid-cols-2">
        {/* Hero panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="relative hidden flex-col justify-between bg-ink-900 p-10 text-white lg:flex"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-md bg-violet-600 font-display text-xl font-bold">E</div>
              <span className="font-display text-xl font-semibold">EduSphere</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">School ERP Pro</p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight">
              One campus.<br />Every classroom,<br />on one screen.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Attendance, homework, fees, and results — synced in real time for admins, teachers, students, and parents.
            </p>
          </div>

          <div className="flex gap-6 border-t border-white/10 pt-5 text-xs text-slate-400">
            <div><p className="font-display text-lg font-semibold text-white">5</p>role dashboards</div>
            <div><p className="font-display text-lg font-semibold text-white">24/7</p>portal access</div>
            <div><p className="font-display text-lg font-semibold text-white">Live</p>attendance sync</div>
          </div>
        </motion.div>

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-panel flex flex-col justify-center bg-white p-8 dark:bg-ink-800 sm:p-12"
        >
          <p className="label-eyebrow">Welcome back</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">Sign in to your account</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Email</label>
              <div className="relative">
                <HiOutlineEnvelope className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-600/40" />
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="you@school.edu"
                  className="input-field pl-11"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-600/40" />
                <input
                  {...register("password", { required: "Password is required" })}
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-11"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
              {status === "loading" ? "Signing in..." : "Sign in"}
              <HiOutlineArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-600/60 dark:text-mist-200/50">
            New school?{" "}
            <Link to="/register-school" className="font-medium text-violet-600 dark:text-violet-400">
              Register here
            </Link>
          </p>

          <div className="mt-8 border-t border-ink-700/10 pt-5 dark:border-white/10">
            <p className="label-eyebrow mb-2">Try a demo account</p>
            <div className="flex flex-wrap gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setValue("email", acc.email);
                    setValue("password", acc.password);
                  }}
                  className="rounded-lg border border-ink-700/10 dark:border-white/10 px-2.5 py-1 text-[11px] text-ink-600/70 dark:text-mist-200/50 hover:border-violet-500 hover:text-violet-600"
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
