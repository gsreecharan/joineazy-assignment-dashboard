export const INITIAL_USERS = [
  // 2 Admins
  { id: "admin-1", name: "Prof. Sharma", role: "admin", email: "sharma@joineazy.edu" },
  { id: "admin-2", name: "Prof. Rao", role: "admin", email: "rao@joineazy.edu" },

  // 5 Students
  { id: "student-1", name: "Charan", role: "student", email: "charan@joineazy.edu" },
  { id: "student-2", name: "Rahul Verma", role: "student", email: "rahul@joineazy.edu" },
  { id: "student-3", name: "Sneha Patel", role: "student", email: "sneha@joineazy.edu" },
  { id: "student-4", name: "Priya Nair", role: "student", email: "priya@joineazy.edu" },
  { id: "student-5", name: "Amit Kumar", role: "student", email: "amit@joineazy.edu" },
];

export const INITIAL_ASSIGNMENTS = [
  {
    id: "asg-101",
    title: "MERN Stack REST API Design",
    description: "Build standard CRUD routes with Express, Node.js, and MongoDB schema validation.",
    dueDate: "2026-11-06",
    driveLink: "https://drive.google.com",
    createdBy: "admin-1", // Prof. Sharma
    assignedTo: ["student-1", "student-2", "student-3", "student-4", "student-5"], // All students
  },
  {
    id: "asg-102",
    title: "React Component State & Hooks",
    description: "Implement interactive dashboard filters and modal dialogs using useState and useEffect.",
    dueDate: "2026-11-08",
    driveLink: "https://drive.google.com",
    createdBy: "admin-1", // Prof. Sharma
    assignedTo: ["student-1", "student-3", "student-5"], // Selected students
  },
  {
    id: "asg-103",
    title: "Database Indexing & Query Tuning",
    description: "Benchmark query execution times and build compound indexes for high-throughput collections.",
    dueDate: "2026-11-10",
    driveLink: "https://drive.google.com",
    createdBy: "admin-2", // Prof. Rao
    assignedTo: ["student-1", "student-2", "student-4"], // Selected students
  },
];

// Tracking each student's submission state per assignment
export const INITIAL_SUBMISSIONS = [
  // Format: { assignmentId, studentId, status: "Submitted" | "Pending", submittedAt: Date | null }
  { assignmentId: "asg-101", studentId: "student-1", status: "Submitted", submittedAt: "2026-11-03T10:00:00Z" },
  { assignmentId: "asg-101", studentId: "student-2", status: "Pending", submittedAt: null },
  { assignmentId: "asg-101", studentId: "student-3", status: "Submitted", submittedAt: "2026-11-02T15:30:00Z" },
  { assignmentId: "asg-101", studentId: "student-4", status: "Pending", submittedAt: null },
  { assignmentId: "asg-101", studentId: "student-5", status: "Submitted", submittedAt: "2026-11-03T09:15:00Z" },

  { assignmentId: "asg-102", studentId: "student-1", status: "Pending", submittedAt: null },
  { assignmentId: "asg-102", studentId: "student-3", status: "Pending", submittedAt: null },
  { assignmentId: "asg-102", studentId: "student-5", status: "Submitted", submittedAt: "2026-11-03T12:00:00Z" },

  { assignmentId: "asg-103", studentId: "student-1", status: "Pending", submittedAt: null },
  { assignmentId: "asg-103", studentId: "student-2", status: "Submitted", submittedAt: "2026-11-02T18:45:00Z" },
  { assignmentId: "asg-103", studentId: "student-4", status: "Pending", submittedAt: null },
];