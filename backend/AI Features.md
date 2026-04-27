# AI Features & API Integration Guide

This document outlines all the AI-powered features available in the backend, their associated API endpoints, and the UI components/pages they relate to. It also details how these features are connected from the main Dashboard page.

---

## 1. AI Features & Their APIs

### A. Intent Mode & Code Optimization
**Description:** Analyzes the user's intent to optimize or refactor a specific block of code.
- **API Endpoint:** `POST /api/ai/intent/:projectId`
- **Related Page/Component:** Editor Page (Intent Panel / Sidebar)
- **UI Interaction:** The user highlights code and types what they want to achieve (e.g., "Make this function faster"). The AI returns suggested code, which should be displayed in a side-by-side Diff Viewer.

### B. Explain My Codebase (Visual Graph + Flow)
**Description:** Generates a visual dependency graph of the project architecture and provides an AI explanation of file responsibilities and data flow.
- **API Endpoints:** 
  - `GET /api/ai/explain/:projectId` (Fetches the raw dependency graph)
  - `GET /api/ai/explain-ai/:projectId` (Fetches the graph along with AI-generated explanations)
- **Related Page/Component:** Editor Page (Architecture / Graph Tab)
- **UI Interaction:** Renders nodes and edges using a library like `react-flow`. Clicking a file node shows the AI's explanation for that specific file.

### C. Decision Memory (History Intelligence)
**Description:** Logs and retrieves past architectural decisions made by the team, providing context on why certain code was written a specific way.
- **API Endpoints:**
  - `POST /api/memory/:projectId` (Logs a new decision)
  - `GET /api/memory/:projectId` (Fetches all memories for a project)
  - `GET /api/memory/:projectId/:filePath` (Fetches memory for a specific file)
- **Related Page/Component:** Editor Page (Decision Log Modal / Context Hover)
- **UI Interaction:** Users can save decisions by highlighting code. Hovering over code with an associated memory shows a tooltip explaining the decision.

### D. Automated TDD Agent (Test-Driven Development)
**Description:** Generates comprehensive unit and integration tests based on a function signature, code intent, or the visual execution flow.
- **API Endpoint:** `POST /api/ai/test/:projectId`
- **Related Page/Component:** Editor Page (Test Generation Modal / Context Menu)
- **UI Interaction:** The user clicks "Generate Tests" for a file. The generated test code opens in a new editor tab (e.g., `filename.test.js`).

### E. NL to DB Schema & ER Diagram Generator
**Description:** Translates natural language requirements (e.g., "e-commerce with users and products") into ORM models (Mongoose/Prisma) and a visual ER diagram.
- **API Endpoint:** `POST /api/ai/schema/:projectId`
- **Related Page/Component:** Editor Page (Database Designer Hub)
- **UI Interaction:** A split-pane view where the user enters a prompt. The left pane shows the generated DB code, and the right pane renders a Mermaid ER diagram using a library like `react-mermaid`.

### F. Team Conventions & Automated Code Reviewer
**Description:** Acts as an automated reviewer that ensures new code aligns with the team's past coding style and architectural decisions (Decision Memory).
- **API Endpoint:** `POST /api/ai/review/:projectId`
- **Related Page/Component:** Project Details Page / Pull Request View
- **UI Interaction:** A split-screen review dashboard. Code diffs are on the left, and AI comments (with suggested fixes for convention violations) are on the right.

---

## 2. Connecting APIs via the Dashboard Page

The Dashboard serves as the central hub and gateway to all projects, but **it does not directly call the AI features**. Instead, it passes the necessary context (the `projectId`) to the specific Editor/Project pages where the AI APIs are utilized.

Here is the exact flow of how to connect these APIs starting from the Dashboard:

### Step 1: Dashboard Loading & Authentication
When the user arrives at the Dashboard (`/dashboard`), the app should:
1. Verify the user: `GET /api/auth/get-me`
2. Load their projects: `GET /api/projects/`

### Step 2: Project Selection & Routing
The Dashboard displays a grid of Project Cards. Each card represents a project and contains a unique `_id` (the `projectId`).
- When a user clicks a Project Card (e.g., ID: `64a7b8f9e...`), the Dashboard routes the user to the Code Editor page using React Router or Next.js routing:
  - `navigate('/editor/64a7b8f9e...')` or `<Link href="/editor/64a7b8f9e...">`

### Step 3: API Execution in the Editor Page
Once inside the Editor Page (`/editor/:projectId`), the frontend extracts the `projectId` from the URL parameters (e.g., using `useParams()` in React). 

You will then use this `projectId` to connect to all the AI APIs:
- **Load Project Files:** `GET /api/projects/:projectId`
- **Trigger Intent Mode:** When the user asks for code optimization, call `POST /api/ai/intent/:projectId` passing the selected code in the body.
- **Load Architecture:** When the user switches to the Graph tab, call `GET /api/ai/explain-ai/:projectId` to render the visualization.
- **Generate Tests:** When the user clicks "Generate Tests", call `POST /api/ai/test/:projectId`.
- **Design Schema:** In the DB panel, call `POST /api/ai/schema/:projectId`.
- **Memory Decisions:** Call `GET /api/memory/:projectId` to load previous architectural context for the project.

**Summary:** The Dashboard is responsible for fetching the project list and passing the `projectId` via the URL. The Editor Page is responsible for extracting that `projectId` and using it to communicate with all the `/api/ai/.../:projectId` and `/api/memory/.../:projectId` endpoints.

---

## 3. The Editor Page Layout & Architecture

When the user clicks a project and navigates to `/editor/:projectId`, the **Editor Page** loads. This page is the core workspace and acts as the client for all the AI endpoints. 

### A. Page Structure
The Editor Page should be divided into the following main panels:

1. **Top Action Bar (Header):**
   - Displays the current Project Name.
   - Contains global actions like **"Generate Tests"** and **"Review Code"**.

2. **Left Sidebar (File Explorer & Memory):**
   - **File Tree:** Displays all files and folders associated with the project.
   - **Decision Log:** A dedicated tab or accordion where the user can view all past architectural decisions (fetched via `GET /api/memory/:projectId`).

3. **Main Coding Area (Center):**
   - The primary code editor (e.g., using Monaco Editor / VS Code web editor).
   - This is where the user writes code and highlights sections for intent analysis.

4. **Right Sidebar / Auxiliary Panel (AI Tools):**
   This dynamic panel switches between different AI context views:
   - **Intent Panel:** A chat-like UI where the user types what they want to change in the highlighted code.
   - **Architecture Graph:** A visual canvas showing the node-based file dependency graph.
   - **Database Schema Designer:** The split-pane view for NL-to-Schema generation.

### B. Connecting the APIs within the Editor

Once the Editor Page mounts, the integration flow is as follows:

1. **Initialization:**
   - Immediately call `GET /api/projects/:projectId` to populate the File Tree.
   - Call `GET /api/memory/:projectId` to populate the Decision Log sidebar.

2. **Using Intent Mode:**
   - User highlights code in the Main Coding Area.
   - User types a prompt in the Right Sidebar (Intent Panel) and hits submit.
   - Frontend calls `POST /api/ai/intent/:projectId` with the prompt and highlighted code.
   - Response is shown in a Diff Viewer modal or directly inside the editor for review.

3. **Using Explain My Codebase:**
   - User clicks the "Architecture" tab in the Right Sidebar.
   - Frontend calls `GET /api/ai/explain-ai/:projectId`.
   - Frontend uses a library like `react-flow` to map the returned JSON into a visual node graph.
   - Clicking a node displays the specific AI explanation for that file.

4. **Using DB Schema Generator:**
   - User clicks the "Database" tab in the Right Sidebar.
   - User types the schema requirements.
   - Frontend calls `POST /api/ai/schema/:projectId`.
   - The returned models and Mermaid diagram string are rendered (e.g., using `react-mermaid`).
