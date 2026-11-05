# Joineazy Assignment & Review Dashboard

A role-based frontend dashboard built for the Joineazy Frontend Task 1. It features isolated views for Admins and Students, full CRUD capabilities, and persistent local state management.

## 🚀 Live Demo
**[View Live Application on Vercel](https://joineazy-assignment-dashboard-nu.vercel.app/)**

## 🛠️ Tech Stack
* **Framework:** React 19 + Vite
* **Styling:** Tailwind CSS v4
* **State Management:** Custom `useLocalStorage` hook (No external database)
* **Deployment:** Vercel

## ✨ Key Features
* **Role-Based Access:** Switch seamlessly between Admin (Professors) and Student views.
* **Data Isolation:** 
  * Admins only manage assignments they authored.
  * Students only see assignments specifically assigned to them.
* **Full CRUD Operations:** Admins can create, edit, delete, and target assignments to specific audiences.
* **Two-Step Submission:** Custom modal flow prevents accidental submissions from students.
* **Real-Time Analytics:** Admins can track class completion percentages and view detailed student rosters.
* **State Persistence:** All actions (mutations, submissions, deletions) survive a hard browser refresh.
* **Search & Filters:** Real-time title search and status filtering for better UX.

## 🧠 Architecture Notes
To keep the application highly scalable and the child components stateless, the core data (`users`, `assignments`, `submissions`) is lifted to the highest level in `App.jsx`. A custom `useLocalStorage` hook was built to mimic `useState` while actively syncing with the browser's storage API. Data is piped down to `AdminDashboard` and `StudentDashboard` strictly as props.

## 💻 Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/gsreecharan/joineazy-assignment-dashboard.git](https://github.com/gsreecharan/joineazy-assignment-dashboard.git)