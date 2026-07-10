import { useEffect, useState } from "react";
import api from "../../services/api";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";
import {
  HiOutlineUserGroup,
  HiOutlineAcademicCap,
  HiOutlineBuildingLibrary,
  HiOutlineClipboardDocumentCheck,
} from "react-icons/hi2";
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip } from "chart.js";
import { Line as LineChart } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const SchoolAdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/school-admin").then((res) => setData(res.data.data));
  }, []);

  if (!data) return <Loader label="Loading dashboard" />;

  const chartData = {
    labels: data.weeklyAttendance?.map((d) => d._id.slice(5)) || [],
    datasets: [
      {
        label: "Present",
        data: data.weeklyAttendance?.map((d) => d.present) || [],
        borderColor: "#6C5CE7",
        backgroundColor: "rgba(108,92,231,0.15)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Absent",
        data: data.weeklyAttendance?.map((d) => d.absent) || [],
        borderColor: "#F5A623",
        backgroundColor: "rgba(245,166,35,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={HiOutlineUserGroup} label="Total Students" value={data.totalStudents} accent="violet" delay={0} />
        <StatCard icon={HiOutlineAcademicCap} label="Total Teachers" value={data.totalTeachers} accent="amber" delay={0.05} />
        <StatCard icon={HiOutlineBuildingLibrary} label="Total Classes" value={data.totalClasses} accent="emerald" delay={0.1} />
        <StatCard icon={HiOutlineClipboardDocumentCheck} label="Today's Attendance" value={`${data.attendanceRate}%`} sub={`${data.presentToday}/${data.totalMarkedToday} marked`} accent="rose" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card xl:col-span-2">
          <p className="label-eyebrow">Last 7 days</p>
          <h3 className="mt-1 font-display text-lg font-semibold">Attendance trend</h3>
          <div className="mt-4 h-64">
            <LineChart
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: "#8891A5" } } },
                scales: {
                  x: { grid: { display: false }, ticks: { color: "#8891A5" } },
                  y: { grid: { color: "rgba(136,145,165,0.1)" }, ticks: { color: "#8891A5" } },
                },
              }}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card">
          <p className="label-eyebrow">Latest</p>
          <h3 className="mt-1 font-display text-lg font-semibold">Announcements</h3>
          <div className="mt-4 space-y-3">
            {data.recentAnnouncements?.length ? data.recentAnnouncements.map((a) => (
              <div key={a._id} className="rounded-xl border border-ink-700/10 dark:border-white/10 p-3">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-ink-600/60 dark:text-mist-200/50">{a.message}</p>
              </div>
            )) : <p className="text-sm text-ink-600/50">No announcements yet.</p>}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
        <p className="label-eyebrow">Due soon</p>
        <h3 className="mt-1 font-display text-lg font-semibold">Upcoming homework</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-ink-600/50 dark:text-mist-200/40">
                <th className="pb-2">Title</th>
                <th className="pb-2">Subject</th>
                <th className="pb-2">Due date</th>
              </tr>
            </thead>
            <tbody>
              {data.upcomingHomework?.map((hw) => (
                <tr key={hw._id} className="border-t border-ink-700/10 dark:border-white/10">
                  <td className="py-2.5">{hw.title}</td>
                  <td className="py-2.5">{hw.subject?.name || "—"}</td>
                  <td className="py-2.5">{new Date(hw.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data.upcomingHomework?.length && <p className="py-4 text-sm text-ink-600/50">No upcoming homework.</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default SchoolAdminDashboard;
