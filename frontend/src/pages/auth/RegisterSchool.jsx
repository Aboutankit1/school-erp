import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineArrowRight, HiOutlineArrowLeft } from "react-icons/hi2";
import { registerSchool } from "../../redux/slices/authSlice";
import AmbientBackground from "../../components/AmbientBackground";
import ThemeToggle from "../../components/ThemeToggle";
import { useState } from "react";

const RegisterSchool = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setSubmitting(true);
    const result = await dispatch(registerSchool(values));
    setSubmitting(false);
    if (registerSchool.fulfilled.match(result)) navigate("/login");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <AmbientBackground />
      <div className="absolute right-6 top-6"><ThemeToggle /></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel w-full max-w-lg bg-white/90 p-8 dark:bg-ink-800/95 sm:p-10"
      >
        <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-xs text-ink-600/60 hover:text-violet-600 dark:text-mist-200/50">
          <HiOutlineArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        <p className="label-eyebrow">Get started</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">Register your school</h1>
        <p className="mt-1 text-sm text-ink-600/60 dark:text-mist-200/50">
          Your school will be reviewed and approved by our platform team before login is enabled.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">School name</label>
              <input {...register("schoolName", { required: "Required" })} className="input-field" placeholder="Greenfield International School" />
              {errors.schoolName && <p className="mt-1 text-xs text-rose-500">{errors.schoolName.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">School phone</label>
              <input {...register("schoolPhone", { required: "Required" })} className="input-field" placeholder="9876543210" />
              {errors.schoolPhone && <p className="mt-1 text-xs text-rose-500">{errors.schoolPhone.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">School email</label>
            <input {...register("schoolEmail", { required: "Required" })} type="email" className="input-field" placeholder="admin@school.edu" />
            {errors.schoolEmail && <p className="mt-1 text-xs text-rose-500">{errors.schoolEmail.message}</p>}
          </div>

          <div className="border-t border-ink-700/10 pt-4 dark:border-white/10">
            <p className="label-eyebrow mb-3">Admin account</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Full name</label>
                <input {...register("adminName", { required: "Required" })} className="input-field" placeholder="Anjali Mehra" />
                {errors.adminName && <p className="mt-1 text-xs text-rose-500">{errors.adminName.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Admin email</label>
                <input {...register("adminEmail", { required: "Required" })} type="email" className="input-field" placeholder="you@school.edu" />
                {errors.adminEmail && <p className="mt-1 text-xs text-rose-500">{errors.adminEmail.message}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-medium text-ink-600/70 dark:text-mist-200/50">Password</label>
              <input {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 characters" } })} type="password" className="input-field" placeholder="••••••••" />
              {errors.password && <p className="mt-1 text-xs text-rose-500">{errors.password.message}</p>}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Submitting..." : "Register school"}
            <HiOutlineArrowRight className="h-4 w-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterSchool;
