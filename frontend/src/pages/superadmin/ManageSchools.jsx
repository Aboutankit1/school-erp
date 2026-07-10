import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Loader from "../../components/Loader";
import Badge from "../../components/Badge";
import EmptyState from "../../components/EmptyState";
import { HiOutlineBuildingLibrary, HiOutlineCheck, HiOutlineNoSymbol } from "react-icons/hi2";

const ManageSchools = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await api.get("/schools");
    setSchools(res.data.data.schools);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    await api.put(`/schools/${id}/approve`);
    toast.success("School approved");
    load();
  };
  const suspend = async (id) => {
    await api.put(`/schools/${id}/suspend`);
    toast.success("School suspended");
    load();
  };

  if (loading) return <Loader label="Loading schools" />;

  return (
    <div className="glass-card overflow-x-auto">
      {schools.length ? (
        <table className="data-table">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-ink-600/50 dark:text-mist-200/40">
              <th className="pb-3">School</th><th className="pb-3">Code</th><th className="pb-3">Plan</th><th className="pb-3">Status</th><th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((s, i) => (
              <motion.tr key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-t border-ink-700/10 dark:border-white/10">
                <td className="py-3">
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-ink-600/50 dark:text-mist-200/40">{s.email}</p>
                </td>
                <td className="py-3 font-mono text-xs">{s.code}</td>
                <td className="py-3 capitalize">{s.plan}</td>
                <td className="py-3"><Badge status={s.status} /></td>
                <td className="py-3 text-right space-x-1.5">
                  {s.status !== "approved" && (
                    <button onClick={() => approve(s._id)} className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-500/10" title="Approve">
                      <HiOutlineCheck className="h-4 w-4" />
                    </button>
                  )}
                  {s.status !== "suspended" && (
                    <button onClick={() => suspend(s._id)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10" title="Suspend">
                      <HiOutlineNoSymbol className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyState icon={HiOutlineBuildingLibrary} title="No schools yet" message="Schools that register will appear here for approval." />
      )}
    </div>
  );
};

export default ManageSchools;
