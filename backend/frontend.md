# Frontend UI Architecture & Integration Guide

Based on the robust AI backend we have built, here is a complete blueprint for how you should structure your frontend UI to integrate these features seamlessly. This will turn your "AI Code Editor" into a truly next-gen developer experience.

---

## 1. Intent Mode & Code Optimization
**Backend Endpoint:** `POST /api/ai/intent/:projectId`

**UI Layout:**
- **Intent Panel (Sidebar):** A chat-like interface or a structured form where the user can type what they want to achieve (e.g., "Refactor this function to be more scalable").
- **Editor Integration:** Highlight the code block the user wants to optimize.
- **Action:** Clicking "Optimize" sends the highlighted code to the endpoint.
- **Result:** The AI's suggested code appears in a **Diff Viewer** (side-by-side comparison of old code vs. new code) so the user can review before accepting.

## 2. Explain My Codebase (Visual Graph + Flow)
**Backend Endpoints:** 
- `GET /api/ai/explain/:projectId` (Raw Graph Data)
- `GET /api/ai/explain-ai/:projectId` (Graph + AI Explanation)

**UI Layout:**
- **Architecture Tab:** A dedicated tab next to the main editor.
- **Visual Nodes:** Use a library like `react-flow` to draw the dependency graph (boxes for files, arrows for imports).
- **AI Explanation Sidebar:** Next to the visual graph, display the AI's breakdown of "File Responsibilities", "Data Flow", and "Potential Improvements". 
- **Interactivity:** Clicking a node (file) in the graph should update the AI explanation sidebar to focus solely on that file's context.

## 3. Decision Memory (History Intelligence)
**Backend Endpoints:**
- `POST /api/memory/:projectId`
- `GET /api/memory/:projectId`

**UI Layout:**
- **Decision Log Modal:** A dashboard showing all past architectural decisions, their tags (e.g., `#performance`, `#security`), and the reasoning.
- **"Save Decision" Button:** When a user writes a complex block of code, they can highlight it, right-click, and select "Log Decision". A small modal prompts them for a "Title" and "Reasoning".
- **Context Hover:** If a user hovers over code that has an associated Decision Memory, a small tooltip appears explaining *why* it was written that way.

## 4. Automated TDD Agent (Test-Driven Development)
**Backend Endpoint:** `POST /api/ai/test/:projectId`

**UI Layout:**
- **"Generate Tests" Button:** Located in the top action bar of the active editor, or in a context menu when right-clicking a function.
- **Test Generation Modal/Panel:** Allows the user to select the testing framework (Jest, Mocha) or type an intent if there is no code yet.
- **Result Tab:** Upon generation, a new editor tab opens automatically (e.g., `filename.test.js`) containing the generated positive, negative, and edge-case unit tests.

## 5. Team Conventions & Automated Code Reviewer
**Backend Endpoint:** `POST /api/ai/review/:projectId`

**UI Layout:**
- **"Review Code" Button:** Prominently placed in a "Pull Request" or "Commit" staging view within the app.
- **Review Dashboard:** A split-screen view. On the left, the code diff. On the right, the AI's review formatted exactly like a GitHub PR comment.
- **Enforcement Badges:** If the code violates a Decision Memory, show a red "Convention Warning" badge next to the specific line of code, along with the AI's suggested fix.

## 6. NL to DB Schema & ER Diagram Generator
**Backend Endpoint:** `POST /api/ai/schema/:projectId`

**UI Layout:**
- **Database Designer Hub:** A specific page or massive modal for database planning.
- **Input Area:** A large text area for natural language input ("I need an e-commerce schema...").
- **Split-Pane Output:**
  - **Left Pane (Code):** The generated Mongoose/Prisma models in a syntax-highlighted editor.
  - **Right Pane (Visual):** Use a library like `react-mermaid` or `mermaid.js` to render the returned Mermaid string into a beautiful visual ER diagram.
- **Export/Save Options:** Buttons to "Download Schema Files" or "Inject into Project".

---

### Core UI Component Libraries Recommended
- **Code Editor:** `@monaco-editor/react` (Same editor VS Code uses).
- **Graphs/Flows:** `react-flow-renderer` (For Explain My Codebase).
- **Diagrams:** `mermaid` (For the DB Schema visualizer).
- **Diff Viewer:** `react-diff-viewer` (For showing changes in Intent Mode and Code Reviews).
- **Animations:** `framer-motion` (To make panel transitions feel premium).
