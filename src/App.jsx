import { useLocalStorage } from "./hooks/useLocalStorage";
import {
  INITIAL_USERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
} from "./data/seedData";
import Navbar from "./components/Navbar";

export default function App() {
  const [users] = useLocalStorage("joineazy_users", INITIAL_USERS);
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

  const currentUser =
    users.find((u) => u.id === currentUserId) || users[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar
        users={users}
        currentUser={currentUser}
        onSelectUser={setCurrentUserId}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
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
              Active Workspace: {currentUser.role === "admin" ? "Admin Management" : "Student Portal"}
            </span>
          </div>
        </div>

        {/* Temporary Placeholder - Next steps will replace this with role-specific dashboards */}
        <div className="mt-6 p-8 border border-dashed border-slate-800 rounded-xl text-center text-slate-500">
          Role-specific dashboard for <strong className="text-slate-300">{currentUser.name}</strong> will render here next.
        </div>
      </main>
    </div>
  );
}