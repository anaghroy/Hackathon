# AI Intelligence & DevOps Integration Strategy

This document details the full-stack architecture for integrating our existing AI intelligence models (Auto-Fixer and Security Scanner) with the newly implemented DevOps deployment pipeline.

## 1. Feature Overview

We are introducing two major AI-driven automation workflows into the deployment lifecycle:
1.  **AI Auto-Fixer for Build Failures**: When a deployment fails, the backend automatically captures the build/runtime logs and feeds them to our AI engine. The AI generates actionable code fixes, which the frontend presents to the user for one-click resolution.
2.  **Pre-Deployment Security Scanning**: Before spinning up a container or executing build commands, an AST-based AI security scanner evaluates the codebase. If high-severity vulnerabilities (e.g., OWASP top 10) are detected, the deployment is aborted to prevent vulnerable code from reaching production.

---

## 2. Backend Integration

The backend requires new orchestration between the `Deployment` lifecycle and our `ai.service`.

### 2.1 Security Scanning (Pre-Deployment Phase)
**Modification to `deploy.controller.js`**:
Before transitioning a deployment to the `BUILDING` state, we inject an asynchronous security analysis step.

*   **Logic Flow:**
    1.  Deployment is triggered (`QUEUED`).
    2.  Backend calls the internal `ai.service` to run `analyzeCodeSecurity(projectId)`.
    3.  If the scanner returns `highRiskIssues > 0`, the deployment status changes to `FAILED` with a specific log entry: `[SYSTEM] Deployment halted due to critical security vulnerabilities.`
    4.  The vulnerabilities are saved to the deployment record (or a separate `SecurityAudit` collection) so the frontend can display them.
    5.  If no critical issues are found, the deployment proceeds to `BUILDING`.

### 2.2 AI Auto-Fixer (Post-Failure Phase)
**New Endpoint: `POST /api/ai/analyze-logs`**
*   **Description:** Triggered manually by the user or automatically upon deployment failure to analyze why a build crashed.
*   **Payload:** `{ deploymentId: "..." }`
*   **Action:** 
    1. Fetches the failed deployment and extracts the `logs` array.
    2. Constructs a prompt combining the project's technology stack context and the raw error logs.
    3. Calls the LLM (e.g., Gemini 3.1 Pro) to identify the root cause.
    4. Returns a structured JSON response containing the explanation and a proposed code patch (e.g., specific file and line replacements).

**New Endpoint: `POST /api/ai/apply-fix`**
*   **Description:** Applies the AI-generated patch to the repository/project files.
*   **Payload:** `{ projectId: "...", fileModifications: [{ filePath, content }] }`
*   **Action:**
    1. Updates the project's source files in the database.
    2. Optionally commits the change back to the connected Git repository.
    3. Automatically triggers a new `POST /api/deploy/:projectId` request to re-deploy the fixed code.

---

## 3. Frontend Integration

The frontend UI will be updated to expose these intelligent features seamlessly within the DevOps dashboard.

### 3.1 Security Scanner UI
*   **Deployment Timeline:** During the deployment process, a new progress stage "Security Audit" will appear before "Building".
*   **Halted State:** If the deployment fails due to security, the status badge turns red with a "Security Block" label.
*   **Vulnerability Report Modal:** A button appears on the failed deployment allowing the user to view the AI Security Report. This report lists the detected vulnerabilities, file paths, and AI-suggested remediations.

### 3.2 AI Auto-Fixer UI
*   **Log Viewer Enhancement:** If a deployment fails during the `BUILDING` or `DEPLOYING` stage, an "Analyze Failure with AI" button prominently appears above the terminal logs.
*   **AI Diagnosis Panel:** Clicking the button opens a side-panel or modal displaying:
    *   **Root Cause:** A human-readable explanation of the error (e.g., "Missing dependency in package.json").
    *   **Proposed Fix:** A diff-viewer showing exactly what lines of code the AI intends to change.
*   **One-Click Resolution:** A CTA button labeled "Apply Fix & Re-deploy". Clicking this sends a request to `POST /api/ai/apply-fix`, immediately patching the code and restarting the deployment tracker visually.

---

## 4. Example Data Flow

1. **User** clicks "Deploy".
2. **Backend** runs Security Scan -> Passes.
3. **Backend** runs `npm run build` -> Fails (Syntax Error).
4. **Backend** marks Deployment as `FAILED`.
5. **Frontend** shows "Build Failed" and highlights the "Ask AI to Fix" button.
6. **User** clicks "Ask AI to Fix".
7. **Frontend** calls `POST /api/ai/analyze-logs`.
8. **Backend AI** returns a patch fixing the syntax error.
9. **User** clicks "Apply Fix & Re-deploy".
10. **Backend** updates the file, creates a new Deployment, and successfully builds the app.
