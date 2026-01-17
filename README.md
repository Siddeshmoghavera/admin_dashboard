Below is a **clean, professional, submission-ready README.md** tailored **exactly** to your project and what you implemented.
You can **copy–paste this directly** into `README.md`.

---

# 🛠️ Admin Dashboard – Users Management

**Internship Take-Home Assignment**
**Tech Stack:** React, TypeScript, Vite, Material UI, Material React Table, TanStack React Query v5, MSW
**Deployment:** Vercel

---

## 📌 Overview

This project is a **Users Management Admin Dashboard** built as part of an internship technical assignment.
It demonstrates the ability to work with an existing codebase by:

* Fixing real bugs
* Completing incomplete features
* Implementing new features from scratch
* Handling strict TypeScript builds
* Deploying a production-ready application

The application displays a paginated list of users with search, filtering, optimistic status updates, and robust error handling — backed by a mocked API using **Mock Service Worker (MSW)**.

---

## 🚀 Live Demo

🔗 **Live URL:** `<https://admin-dashboard-psi-rosy-67.vercel.app/>`
🔗 **GitHub Repo:** `<PASTE GITHUB LINK HERE>`

---

## ✅ Assignment Completion Checklist

* [x] Fixed all 3 required bugs
* [x] Implemented debounced search
* [x] Added loading skeleton for table
* [x] Implemented optimistic UI for status updates
* [x] Improved actions column with confirmation dialog
* [x] Added global error handling with retry support
* [x] Used separate commits for each fix/feature
* [x] Successfully deployed to Vercel

---

## ✨ Features

* 📋 Paginated users table
* 🔍 Debounced search (name/email)
* 🏷 Status filter (All / Active / Inactive)
* ⚡ Optimistic Activate / Deactivate user
* 🔗 Pagination & filters synced with URL
* ⏳ Skeleton loaders for better UX
* 🔔 Snackbar notifications
* 🛡 Global error boundary with retry option

---

## 🧩 Tech Stack

* **React 18 + TypeScript**
* **Vite** (build tool)
* **Material UI (MUI)**
* **Material React Table**
* **TanStack React Query v5**
* **Mock Service Worker (MSW)**
* **React Router v6**
* **Notistack (Snackbar)**

---

## 📁 Project Structure

```txt
src/
├── api/               # API abstraction
├── components/
│   ├── tables/        # DynamicGrid, UserActions
│   └── ErrorBoundary
├── hooks/             # useUsers, useDebounce
├── layouts/           # MainLayout
├── mocks/             # MSW handlers & mock data
├── pages/
│   └── UsersPage
├── types/             # Global TypeScript types
├── utils/             # Column metadata & helpers
├── routes.tsx
├── App.tsx
└── main.tsx
```

---

## 🐞 Bug Fixes Implemented

### 🐛 Bug 1: Table Not Updating After Status Change

**Fix:**
Implemented **optimistic UI updates** using React Query v5 with proper cache management and rollback on error.

📍 `src/hooks/useUsers.ts`

---

### 🐛 Bug 2: Groups Column Showing `[object Object]`

**Fix:**
Rendered group names as Material UI chips using metadata-driven rendering.

📍 `src/components/tables/DynamicGrid.tsx`

---

### 🐛 Bug 3: Pagination & Filters Not Synced With URL

**Fix:**
Used `useSearchParams` to sync pagination and status filters with the URL and preserve state on refresh.

📍 `src/pages/UsersPage/UsersPage.tsx`

---

## ✨ Features Implemented

### 🔍 Debounced Search

* Implemented custom `useDebounce` hook
* API calls trigger only after 300ms pause
* Pagination resets on new search

---

### ⏳ Loading Skeleton

* Added skeleton placeholders matching table rows
* Improves perceived performance

---

### ⚡ Optimistic UI for Status Toggle

* Immediate UI update on click
* Rollback on API failure
* Snackbar feedback

---

### 🎯 Actions Column

* Activate / Deactivate buttons
* Confirmation dialog before deactivation
* Accessible ARIA labels

---

### 🚨 Error Handling

* Global `ErrorBoundary`
* User-friendly error message
* Retry button

---

## 🧪 Mock API (MSW)

All backend APIs are mocked using **Mock Service Worker**.

| Endpoint         | Method | Description           |
| ---------------- | ------ | --------------------- |
| `/api/users`     | GET    | Fetch paginated users |
| `/api/users/:id` | PATCH  | Update user status    |

Mock data includes:

* 100 users
* Random groups and roles
* Simulated network delays

---

## 🛠 Getting Started (Local Setup)

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Initialize MSW

```bash
npx msw init public --save
```

### 3️⃣ Run development server

```bash
npm run dev
```

Open: **[http://localhost:5173](http://localhost:5173)**

---

## 🏗 Build for Production

```bash
npm run build
```

✔ Passes strict TypeScript checks
✔ Vite production build succeeds

---

## 🌐 Deployment

* Deployed using **Vercel**
* GitHub integration enabled
* Client-side routing handled via rewrites
* Production build verified locally before deploy

---

## 📈 Key Learnings

* React Query v5 cache management
* Optimistic UI with rollback
* Strict TypeScript debugging
* URL state synchronization
* Production deployment troubleshooting

---

## 🙌 Conclusion

This project demonstrates:

* Strong React & TypeScript fundamentals
* Real-world debugging skills
* Clean, scalable architecture
* Production-ready frontend deployment