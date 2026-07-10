import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// Classic ERP shell: fixed full-height sidebar flush to the edge,
// full-width top bar, content area with standard padding.
const DashboardLayout = ({ title }) => (
  <div className="min-h-screen bg-mist-50 dark:bg-ink-950">
    <Sidebar />
    <div className="lg:pl-64">
      <Navbar title={title} />
      <main className="p-5">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;
