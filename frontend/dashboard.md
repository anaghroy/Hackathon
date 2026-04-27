# Dashboard UI & Backend Integration Guide

This document outlines the architecture and UI layout for your AI Code Editor Dashboard. The Dashboard serves as the central hub where authenticated users manage their projects before entering the actual code editor.

---

## 1. Page Layout & Structure

The dashboard should be clean, modern, and split into three main visual areas:

### A. Top Navigation Bar (Header)
- **Brand/Logo:** Left-aligned.
- **Global Search:** A search bar to quickly find projects by name.
- **User Profile Menu:** Right-aligned. Displays the user's avatar and username. Clicking it opens a dropdown (Profile Settings, Logout).

### B. Left Sidebar (Quick Links)
- **Home/Overview:** The default view showing recent projects.
- **My Projects:** A dedicated view for all projects.
- **Shared with Me:** (Future feature) Projects where the user is a collaborator.
- **Settings:** General application settings.

### C. Main Content Area
- **Action Banner:** A prominent area at the top featuring a **"Create New Project"** button.
- **Project Grid:** A responsive grid displaying individual **Project Cards**.
  - **Project Card Details:** Project Title, Last Modified Date, Tech Stack (if applicable), and a "Delete" icon.

---

## 2. API Integration Mapping

To make the dashboard fully functional, it needs to communicate with the backend using the exact endpoints you have already built.

### User Data (Authentication)
When the dashboard mounts, verify the user and fetch their profile.
- **Endpoint:** `GET /api/auth/get-me`
- **Headers:** `Authorization: Bearer <token>`
- **UI Action:** Populates the Top Navigation Bar with the user's avatar, email, and name.

### Fetching Projects
Immediately after auth verification, load the user's workspace.
- **Endpoint:** `GET /api/projects/`
- **Headers:** `Authorization: Bearer <token>`
- **UI Action:** Populates the Main Content Area with an array of project objects. If the array is empty, show an "Empty State" graphic with a "Create your first project" button.

### Creating a New Project
When the user clicks "Create New Project".
- **Endpoint:** `POST /api/projects/create`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ "title": "My New App", "description": "AI generated app" }`
- **UI Action:** Opens a small modal to ask for the project name. Upon success, immediately redirect the user to the Code Editor view for that specific project ID.

### Deleting a Project
When the user clicks the trash icon on a Project Card.
- **Endpoint:** `DELETE /api/projects/:id`
- **Headers:** `Authorization: Bearer <token>`
- **UI Action:** Shows a confirmation modal ("Are you sure?"). Upon success, remove the card from the UI grid without reloading the page.

### Logging Out
When the user clicks Logout in the profile dropdown.
- **Endpoint:** `POST /api/auth/logout`
- **UI Action:** Clears the JWT token from localStorage/cookies and redirects the user back to the Login page.

---

## 3. Navigation Flow to AI Features

The Dashboard itself does **not** directly call the AI features (like Intent Mode, DB Schema, or Code Review). Instead, the Dashboard is the gateway.

1. User views the **Dashboard**.
2. User clicks on a **Project Card** (e.g., Project ID: `12345`).
3. Frontend uses React Router (or Next.js Link) to navigate to `/editor/12345`.
4. The **Editor Page** loads.
5. *Inside the Editor Page*, the frontend uses `12345` to call all the advanced backend features:
   - `GET /api/projects/12345` (Loads the files)
   - `POST /api/ai/intent/12345` (Intent Mode)
   - `GET /api/ai/explain/12345` (Visual Graph)
   - `POST /api/ai/schema/12345` (DB Schema Generator)
   - `POST /api/ai/test/12345` (TDD Agent)

By keeping the Dashboard focused strictly on Project Management and Authentication, your application remains fast, organized, and scalable!
