import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/auth/Login";
import RegisterSchool from "./pages/auth/RegisterSchool";
import NotFound from "./pages/NotFound";

import SchoolAdminDashboard from "./pages/dashboard/SchoolAdminDashboard";
import StudentList from "./pages/students/StudentList";
import ParentList from "./pages/parents/ParentList";
import TeacherList from "./pages/teachers/TeacherList";
import ClassesSubjects from "./pages/classes/ClassesSubjects";
import Attendance from "./pages/attendance/Attendance";
import Homework from "./pages/homework/Homework";
import Announcements from "./pages/announcements/Announcements";

import StudentPortal from "./pages/portal/StudentPortal";
import ParentPortal from "./pages/portal/ParentPortal";
import Fees from "./pages/fees/Fees";

import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import ManageSchools from "./pages/superadmin/ManageSchools";

const roleHome = {
  superadmin: "/superadmin",
  schooladmin: "/dashboard",
  teacher: "/dashboard",
  student: "/portal",
  parent: "/portal",
};

const RootRedirect = () => {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleHome[user.role]} replace />;
};

// A single /portal route shared by student & parent — picks the right view by role.
// (Previously this was two separate <Route path="/portal"> entries, which collided:
// React Router matches on path only, so the first-declared branch always won,
// leaving parents stuck being redirected to a route they weren't allowed into.)
const Portal = () => {
  const { user } = useSelector((s) => s.auth);
  if (user?.role === "parent") return <ParentPortal />;
  return <StudentPortal />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-school" element={<RegisterSchool />} />

      {/* School Admin + Teacher shared dashboard shell */}
      <Route element={<ProtectedRoute allowedRoles={["schooladmin", "teacher"]} />}>
        <Route element={<DashboardLayout title="Overview" />}>
          <Route path="/dashboard" element={<SchoolAdminDashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/homework" element={<Homework />} />
          <Route path="/announcements" element={<Announcements />} />
        </Route>
      </Route>

      {/* School Admin only */}
      <Route element={<ProtectedRoute allowedRoles={["schooladmin"]} />}>
        <Route element={<DashboardLayout title="Management" />}>
          <Route path="/students" element={<StudentList />} />
          <Route path="/parents" element={<ParentList />} />
          <Route path="/teachers" element={<TeacherList />} />
          <Route path="/classes" element={<ClassesSubjects />} />
          <Route path="/fees" element={<Fees />} />
        </Route>
      </Route>

      {/* Student & Parent portal — single route, view resolved by role */}
      <Route element={<ProtectedRoute allowedRoles={["student", "parent"]} />}>
        <Route path="/portal" element={<Portal />} />
      </Route>

      {/* Super Admin */}
      <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
        <Route element={<DashboardLayout title="Platform" />}>
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/schools" element={<ManageSchools />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
