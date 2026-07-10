import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import School from "../models/School.js";
import User from "../models/User.js";
import Class from "../models/Class.js";
import Subject from "../models/Subject.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Parent from "../models/Parent.js";
import Announcement from "../models/Announcement.js";

dotenv.config();

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    School.deleteMany(),
    User.deleteMany(),
    Class.deleteMany(),
    Subject.deleteMany(),
    Student.deleteMany(),
    Teacher.deleteMany(),
    Parent.deleteMany(),
    Announcement.deleteMany(),
  ]);

  console.log("Seeding Super Admin...");
  await User.create({
    name: "Platform Super Admin",
    email: "superadmin@schoolerp.com",
    password: "Super@123",
    role: "superadmin",
  });

  console.log("Seeding demo school...");
  const school = await School.create({
    name: "Greenfield International School",
    code: "GRE1001",
    email: "admin@greenfield.edu",
    phone: "9876543210",
    address: "123 Education Lane",
    city: "New Delhi",
    state: "Delhi",
    status: "approved",
    plan: "premium",
  });

  const admin = await User.create({
    name: "Anjali Mehra",
    email: "schooladmin@greenfield.edu",
    password: "Admin@123",
    role: "schooladmin",
    school: school._id,
  });

  console.log("Seeding class & subjects...");
  const class10 = await Class.create({
    school: school._id,
    name: "Class 10",
    sections: ["A", "B"],
  });

  const mathSubject = await Subject.create({
    school: school._id,
    name: "Mathematics",
    code: "MATH10",
    class: class10._id,
  });

  console.log("Seeding teacher...");
  const teacherUser = await User.create({
    name: "Rohan Verma",
    email: "teacher@greenfield.edu",
    password: "Teacher@123",
    role: "teacher",
    school: school._id,
  });

  const teacher = await Teacher.create({
    school: school._id,
    user: teacherUser._id,
    employeeId: "EMP1001",
    qualification: "M.Sc Mathematics",
    subjects: [mathSubject._id],
    classes: [class10._id],
    salary: 45000,
  });

  mathSubject.teacher = teacher._id;
  await mathSubject.save();
  class10.classTeacher = teacher._id;
  await class10.save();

  console.log("Seeding student & parent...");
  const parentUser = await User.create({
    name: "Suresh Kumar",
    email: "parent@greenfield.edu",
    password: "Parent@123",
    role: "parent",
    school: school._id,
  });

  const studentUser = await User.create({
    name: "Ananya Kumar",
    email: "student@greenfield.edu",
    password: "Student@123",
    role: "student",
    school: school._id,
  });

  const student = await Student.create({
    school: school._id,
    user: studentUser._id,
    admissionNo: "ADM2026001",
    rollNo: "10",
    class: class10._id,
    section: "A",
    gender: "female",
    admissionDate: new Date(),
  });

  const parent = await Parent.create({
    school: school._id,
    user: parentUser._id,
    children: [student._id],
    relation: "father",
  });

  student.parent = parent._id;
  await student.save();

  console.log("Seeding announcement...");
  await Announcement.create({
    school: school._id,
    title: "Welcome to the new academic session!",
    message: "Classes begin Monday. Please ensure all fee payments are up to date.",
    audience: ["all"],
    createdBy: admin._id,
    type: "notice",
  });

  console.log("\n✅ Seed complete! Demo credentials:\n");
  console.log("Super Admin   -> superadmin@schoolerp.com / Super@123");
  console.log("School Admin  -> schooladmin@greenfield.edu / Admin@123");
  console.log("Teacher       -> teacher@greenfield.edu / Teacher@123");
  console.log("Student       -> student@greenfield.edu / Student@123");
  console.log("Parent        -> parent@greenfield.edu / Parent@123");

  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
