import { useEffect, useState } from "react";
import api from "../../services/api";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import { HiOutlineBuildingLibrary, HiOutlineUserGroup, HiOutlineAcademicCap, HiOutlineClock } from "react-icons/hi2";

const SuperAdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/schools/analytics").then((res) => setData(res.data.data));
  }, []);

  if (!data) return <Loader label="Loading platform analytics" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={HiOutlineBuildingLibrary} label="Total Schools" value={data.totalSchools} accent="violet" />
        <StatCard icon={HiOutlineClock} label="Pending Approval" value={data.pendingSchools} accent="amber" delay={0.05} />
        <StatCard icon={HiOutlineUserGroup} label="Total Students" value={data.totalStudents} accent="emerald" delay={0.1} />
        <StatCard icon={HiOutlineAcademicCap} label="Total Teachers" value={data.totalTeachers} accent="rose" delay={0.15} />
      </div>

      <div className="glass-card">
        <p className="label-eyebrow">Breakdown</p>
        <h3 className="mt-1 font-display text-lg font-semibold">Schools by status</h3>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-emerald-500/10 p-4">
            <p className="font-display text-2xl font-semibold text-emerald-500">{data.approvedSchools}</p>
            <p className="mt-1 text-xs text-ink-600/50 dark:text-mist-200/40">Approved</p>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-4">
            <p className="font-display text-2xl font-semibold text-amber-500">{data.pendingSchools}</p>
            <p className="mt-1 text-xs text-ink-600/50 dark:text-mist-200/40">Pending</p>
          </div>
          <div className="rounded-xl bg-rose-500/10 p-4">
            <p className="font-display text-2xl font-semibold text-rose-500">{data.suspendedSchools}</p>
            <p className="mt-1 text-xs text-ink-600/50 dark:text-mist-200/40">Suspended</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
