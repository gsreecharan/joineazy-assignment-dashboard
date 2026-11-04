import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  INITIAL_USERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
} from "./data/seedData";
import Navbar from "./components/Navbar";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  const [users, setUsers] = useLocalStorage("joineazy_users", INITIAL_USERS);
  const [assignments, setAssignments] = useLocalStorage(
    "joineazy_assignments",
    INITIAL_ASSIGNMENTS
  );
  const [submissions, setSubmissions] = useLocalStorage(
    "joineazy_submissions",
    INITIAL_SUBMISSIONS
  );
  const [currentUserId, setCurrentUserId] = useLocalStorage(
    "joineazy_current_user_id",
    INITIAL_USERS[2].id // Default to student-1 ("Charan")
  );

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  // Reset all state to seed defaults
  const handleResetData = () => {
    if (window.confirm("Reset all assignments and submissions back to initial demo data?")) {
      setUsers(INITIAL_USERS);
      setAssignments(INITIAL_ASSIGNMENTS);
      setSubmissions(INITIAL_SUBMISSIONS);
      setCurrentUserId(INITIAL_USERS[2].id);
    }
  };

  // Student Submission Handler (2-step confirmed)
  const handleStudentSubmit = (assignmentId, studentId) => {
    setSubmissions((prevSubmissions) => {
      const filtered = prevSubmissions.filter(
        (s) => !(s.assignmentId === assignmentId && s.studentId === studentId)
      );
      return [
        ...filtered,
        {
          assignmentId,
          studentId,
          status: "Submitted",
          submittedAt: new Date().toISOString(),
        },
      ];
    });
  };

  // Admin Create / Update Handler
  const handleSaveAssignment = (assignmentData) => {
    if (assignmentData.id) {
      setAssignments((prev) =>
        prev.map((asg) => (asg.id === assignmentData.id ? assignmentData : asg))
      );
    } else {
      const newId = `asg-${Date.now()}`;
      const newAssignment = {
        ...assignmentData,
        id: newId,
      };

      setAssignments((prev) => [...prev, newAssignment]);

      const newSubmissions = assignmentData.assignedTo.map((studentId) => ({
        assignmentId: newId,
        studentId,
        status: "Pending",
        submittedAt: null,
      }));

      setSubmissions((prev) => [...prev, ...newSubmissions]);
    }
  };

  // Admin Delete Handler
  const handleDeleteAssignment = (assignmentId) => {
    setAssignments((prev) => prev.filter((asg) => asg.id !== assignmentId));
    setSubmissions((prev) =>
      prev.filter((sub) => sub.assignmentId !== assignmentId)
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar
        users={users}
        currentUser={currentUser}
        onSelectUser={setCurrentUserId}
        onResetData={handleResetData}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Welcome, {currentUser.name}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Viewing role:{" "}
                <span className="font-semibold text-indigo-400 uppercase">
                  {currentUser.role}
                </span>{" "}
                | Email: {currentUser.email}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                currentUser.role === "admin"
                  ? "bg-purple-950 text-purple-300 border-purple-800"
                  : "bg-emerald-950 text-emerald-300 border-emerald-800"
              }`}
            >
              Active Workspace:{" "}
              {currentUser.role === "admin"
                ? "Admin Management"
                : "Student Portal"}
            </span>
          </div>
        </div>

        {currentUser.role === "student" ? (
          <StudentDashboard
            currentUser={currentUser}
            assignments={assignments}
            submissions={submissions}
            onSubmit={handleStudentSubmit}
          />
        ) : (
          <AdminDashboard
            currentUser={currentUser}
            users={users}
            assignments={assignments}
            submissions={submissions}
            onSaveAssignment={handleSaveAssignment}
            onDeleteAssignment={handleDeleteAssignment}
          />
        )}
      </main>
    </div>
  );
}