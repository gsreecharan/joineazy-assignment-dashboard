export default function Navbar({ users, currentUser, onSelectUser, onResetData }) {
  const admins = users.filter((u) => u.role === "admin");
  const students = users.filter((u) => u.role === "student");

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-sm">
            J
          </div>
          <div>
            <h1 className="font-semibold text-base sm:text-lg tracking-tight">
              Joineazy
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Assignment & Review Dashboard
            </p>
          </div>
        </div>

        {/* User Switcher & Reset Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onResetData}
            title="Reset to default seed data"
            className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
          >
            🔄 <span className="hidden sm:inline">Reset Demo</span>
          </button>

          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-200">{currentUser.name}</p>
            <span
              className={`text-xs uppercase font-semibold px-2 py-0.5 rounded-full ${
                currentUser.role === "admin"
                  ? "bg-purple-900/60 text-purple-300 border border-purple-700/50"
                  : "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50"
              }`}
            >
              {currentUser.role}
            </span>
          </div>

          <div className="relative">
            <select
              value={currentUser.id}
              onChange={(e) => onSelectUser(e.target.value)}
              className="bg-slate-800 text-slate-100 text-sm rounded-lg border border-slate-700 px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <optgroup label="Admins (Professors)">
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    👨‍🏫 {admin.name} (Admin)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Students">
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    🎓 {student.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}