import { useState } from "react";

export default function StudentDashboard({ currentUser, assignments, submissions, onSubmit }) {
  // 1. Filter assignments assigned to this specific student
  const studentAssignments = assignments.filter((asg) =>
    asg.assignedTo.includes(currentUser.id)
  );

  // 2. Calculate Progress
  const totalAssigned = studentAssignments.length;
  const submittedCount = studentAssignments.filter((asg) => {
    const sub = submissions.find(
      (s) => s.assignmentId === asg.id && s.studentId === currentUser.id
    );
    return sub && sub.status === "Submitted";
  }).length;

  const progressPercentage = totalAssigned === 0 ? 0 : Math.round((submittedCount / totalAssigned) * 100);

  // 3. Modal State (Two-Step Confirmation)
  const [modalStep, setModalStep] = useState(0); // 0: Closed, 1: First Confirm, 2: Final Confirm
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const initiateSubmission = (assignment) => {
    setSelectedAssignment(assignment);
    setModalStep(1);
  };

  const confirmStepOne = () => setModalStep(2);
  
  const confirmFinalStep = () => {
    onSubmit(selectedAssignment.id, currentUser.id);
    setModalStep(0);
    setSelectedAssignment(null);
  };

  const cancelModal = () => {
    setModalStep(0);
    setSelectedAssignment(null);
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Your Progress</h3>
          <p className="text-slate-400 text-sm mt-1">
            {submittedCount} of {totalAssigned} submitted
          </p>
        </div>
        <div className="w-full sm:w-1/2 md:w-1/3">
          <div className="flex justify-between text-xs mb-1 text-slate-300 font-medium">
            <span>Completion</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5">
            <div
              className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {studentAssignments.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500 border border-slate-800 border-dashed rounded-xl">
            No assignments assigned to you yet.
          </div>
        ) : (
          studentAssignments.map((asg) => {
            const sub = submissions.find(
              (s) => s.assignmentId === asg.id && s.studentId === currentUser.id
            );
            const isSubmitted = sub?.status === "Submitted";
            const isOverdue = new Date(asg.dueDate) < new Date() && !isSubmitted;

            return (
              <div key={asg.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-semibold text-slate-100 line-clamp-1" title={asg.title}>
                      {asg.title}
                    </h4>
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${isSubmitted ? 'bg-emerald-900/50 text-emerald-400 border-emerald-800/50' : isOverdue ? 'bg-rose-900/50 text-rose-400 border-rose-800/50' : 'bg-amber-900/50 text-amber-400 border-amber-800/50'}`}>
                      {isSubmitted ? "Submitted" : isOverdue ? "Overdue" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2" title={asg.description}>
                    {asg.description}
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-slate-300 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">📅 Due:</span> {new Date(asg.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">🔗 Link:</span> 
                      <a href={asg.driveLink} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
                        Open Drive Folder
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => initiateSubmission(asg)}
                  disabled={isSubmitted}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isSubmitted
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {isSubmitted ? "Already Submitted" : "Submit Assignment"}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Two-Step Modal Overlay */}
      {modalStep > 0 && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">
              {modalStep === 1 ? "Confirm Submission" : "Final Warning"}
            </h3>
            <p className="text-slate-300 mb-6 text-sm leading-relaxed">
              {modalStep === 1
                ? `Are you sure you want to mark "${selectedAssignment?.title}" as submitted? Ensure your files are uploaded to the Drive link.`
                : "This action is final. You cannot un-submit this assignment once confirmed. Do you want to proceed?"}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={cancelModal} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={modalStep === 1 ? confirmStepOne : confirmFinalStep}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                {modalStep === 1 ? "Yes, I have submitted" : "Confirm Final Submission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}