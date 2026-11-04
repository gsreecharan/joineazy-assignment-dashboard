import { useState } from "react";

export default function AdminDashboard({
  currentUser,
  users,
  assignments,
  submissions,
  onSaveAssignment,
  onDeleteAssignment,
}) {
  const students = users.filter((u) => u.role === "student");

  // Admin Isolation: only show assignments created by this admin
  const adminAssignments = assignments.filter(
    (asg) => asg.createdBy === currentUser.id
  );

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    driveLink: "",
    assignAll: true,
    assignedTo: [],
  });

  const openCreateModal = () => {
    setEditingAssignment(null);
    setFormData({
      title: "",
      description: "",
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
      driveLink: "https://drive.google.com",
      assignAll: true,
      assignedTo: students.map((s) => s.id),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (assignment) => {
    setEditingAssignment(assignment);
    const isAll = assignment.assignedTo.length === students.length;
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      driveLink: assignment.driveLink,
      assignAll: isAll,
      assignedTo: assignment.assignedTo,
    });
    setIsModalOpen(true);
  };

  const handleStudentToggle = (studentId) => {
    if (formData.assignAll) {
      setFormData((prev) => ({
        ...prev,
        assignAll: false,
        assignedTo: [studentId],
      }));
      return;
    }

    const currentAssigned = [...formData.assignedTo];
    const exists = currentAssigned.includes(studentId);
    const updated = exists
      ? currentAssigned.filter((id) => id !== studentId)
      : [...currentAssigned, studentId];

    setFormData((prev) => ({
      ...prev,
      assignedTo: updated,
      assignAll: updated.length === students.length,
    }));
  };

  const handleAssignAllToggle = () => {
    if (formData.assignAll) {
      setFormData((prev) => ({ ...prev, assignAll: false, assignedTo: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        assignAll: true,
        assignedTo: students.map((s) => s.id),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSaveAssignment({
      id: editingAssignment ? editingAssignment.id : undefined,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      driveLink: formData.driveLink,
      createdBy: currentUser.id,
      assignedTo: formData.assignedTo,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-white">Course Management</h3>
          <p className="text-slate-400 text-sm mt-1">
            Managing {adminAssignments.length} assignment{adminAssignments.length === 1 ? "" : "s"} created by {currentUser.name}
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <span>➕</span> Create Assignment
        </button>
      </div>

      {/* Assignment List */}
      {adminAssignments.length === 0 ? (
        <div className="p-12 text-center text-slate-500 border border-slate-800 border-dashed rounded-xl bg-slate-900/40">
          <p className="text-base font-medium text-slate-400">No assignments created yet.</p>
          <p className="text-sm text-slate-500 mt-1">Click "Create Assignment" above to draft your first task.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {adminAssignments.map((asg) => {
            const assignedStudents = students.filter((s) => asg.assignedTo.includes(s.id));
            const totalAssigned = assignedStudents.length;

            const submittedStudents = assignedStudents.filter((s) => {
              const sub = submissions.find(
                (item) => item.assignmentId === asg.id && item.studentId === s.id
              );
              return sub && sub.status === "Submitted";
            });

            const completionRate =
              totalAssigned === 0
                ? 0
                : Math.round((submittedStudents.length / totalAssigned) * 100);

            const isExpanded = expandedAssignmentId === asg.id;

            return (
              <div
                key={asg.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-lg font-semibold text-white">{asg.title}</h4>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        📅 Due: {new Date(asg.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2 max-w-3xl">{asg.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-3">
                      <span>
                        Target: <strong className="text-slate-200">{totalAssigned}</strong> students
                      </span>
                      <span>•</span>
                      <a
                        href={asg.driveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 underline"
                      >
                        Drive Link ↗
                      </a>
                    </div>
                  </div>

                  {/* Metrics & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:w-96 justify-end">
                    {/* Progress Bar */}
                    <div className="w-full sm:w-44">
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>Completion</span>
                        <span className="font-semibold">{completionRate}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            completionRate === 100 ? "bg-emerald-500" : "bg-indigo-500"
                          }`}
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 text-right">
                        {submittedStudents.length}/{totalAssigned} submitted
                      </p>
                    </div>

                    {/* Button Group */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setExpandedAssignmentId(isExpanded ? null : asg.id)
                        }
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                      >
                        {isExpanded ? "Hide Details" : "View Roster"}
                      </button>
                      <button
                        onClick={() => openEditModal(asg)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(asg.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Student Roster Breakdown */}
                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <h5 className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-3">
                      Student Submission Roster
                    </h5>
                    <div className="divide-y divide-slate-800/60 bg-slate-950/60 rounded-lg border border-slate-800 overflow-hidden">
                      {assignedStudents.map((student) => {
                        const sub = submissions.find(
                          (item) => item.assignmentId === asg.id && item.studentId === student.id
                        );
                        const isSubmitted = sub && sub.status === "Submitted";

                        return (
                          <div
                            key={student.id}
                            className="px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-200">{student.name}</span>
                              <span className="text-slate-500 hidden sm:inline">({student.email})</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {isSubmitted && sub.submittedAt && (
                                <span className="text-slate-400 text-xs hidden md:inline">
                                  {new Date(sub.submittedAt).toLocaleDateString()}
                                </span>
                              )}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                  isSubmitted
                                    ? "bg-emerald-950 text-emerald-300 border-emerald-800"
                                    : "bg-amber-950 text-amber-300 border-amber-800"
                                }`}
                              >
                                {isSubmitted ? "Submitted" : "Pending"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {editingAssignment ? "Edit Assignment" : "Create New Assignment"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Next.js SSR Architecture"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe requirements and expectations..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Submission Drive Link
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.driveLink}
                    onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Target Audience Assignment */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase">
                    Assign To Students
                  </label>
                  <button
                    type="button"
                    onClick={handleAssignAllToggle}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    {formData.assignAll ? "Unselect All" : "Select All Students"}
                  </button>
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-slate-800">
                  {students.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer hover:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={formData.assignedTo.includes(student.id)}
                        onChange={() => handleStudentToggle(student.id)}
                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{student.name}</span>
                    </label>
                  ))}
                </div>
                {formData.assignedTo.length === 0 && (
                  <p className="text-rose-400 text-xs mt-1">Please select at least one student.</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formData.assignedTo.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {editingAssignment ? "Update Assignment" : "Publish Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">Delete Assignment?</h4>
            <p className="text-slate-300 text-sm mb-5">
              This will permanently remove this assignment and all associated student submission records.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteAssignment(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}