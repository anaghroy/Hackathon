# DevOps Deployment Panel Implementation Plan

This document outlines the frontend and backend implementation strategy for the DevOps deployment features, connecting our existing AI intelligence features to automated DevOps actions.

## 1. Frontend Features & Screens

The frontend will introduce a new "Deployments" module within the dashboard to handle the following functionalities:

### 1.1 Repository Connect Page
*   **Purpose:** Allow users to authenticate with GitHub/GitLab and select repositories for deployment.
*   **UI Components:**
    *   OAuth login buttons (GitHub, GitLab, Bitbucket).
    *   Searchable list of user repositories.
    *   Configuration form (branch selection, root directory, build command, install command).
    *   "Connect & Initialize" button.
*   **Integration:** Calls `POST /api/repos/connect` upon form submission.

### 1.2 Deployment Status Panel
*   **Purpose:** Provide real-time visibility into the deployment lifecycle (Building, Deploying, Success, Failed).
*   **UI Components:**
    *   Status indicators (spinners, checkmarks, error badges).
    *   Progress bar tracking pipeline stages.
    *   Quick actions: "Trigger Manual Deploy", "Cancel Build".
    *   Live URL link (if successful).
*   **Integration:** Calls `POST /api/deploy/:projectId` to trigger deployments and listens to WebSockets/polling for status updates.

### 1.3 Environment Variables Manager
*   **Purpose:** Securely manage `.env` variables required for the deployed application.
*   **UI Components:**
    *   Key-value pair input fields with masking for sensitive values.
    *   "Add Variable", "Edit", "Delete" actions.
    *   Bulk import/export from `.env` file functionality.
*   **Integration:** 
    *   Fetches existing variables via `GET /api/env/:projectId`.
    *   Saves updates via `POST /api/env/:projectId`.

### 1.4 Logs Viewer
*   **Purpose:** Display real-time build and runtime logs for debugging.
*   **UI Components:**
    *   Terminal-like dark-themed text area.
    *   Filters (Build Logs, Runtime Logs, Error Level).
    *   "Follow log", "Clear", "Download" actions.
*   **Integration:** Fetches logs via `GET /api/deploy/:projectId/logs` and handles continuous streams (WebSockets or Server-Sent Events).

### 1.5 Rollback History Timeline
*   **Purpose:** View past deployments and allow rolling back to previous stable versions.
*   **UI Components:**
    *   Vertical timeline of deployment events (Date, Commit Hash, Status, Triggered By).
    *   "Rollback to this version" action button on historical successful deployments.
*   **Integration:** Calls `POST /api/deploy/:projectId/rollback` with the target deployment ID.

---

## 2. Backend Features & API Endpoints

The backend will expose the following RESTful API endpoints to orchestrate DevOps workflows, integrating seamlessly with our existing architecture.

### 2.1 `POST /api/repos/connect`
*   **Description:** Authenticates user VCS (Version Control System) account, retrieves the repository details, sets up webhooks for auto-deploy on push, and initializes a new project record in the database.
*   **Payload:** `{ provider: 'github', repoName: 'user/repo', branch: 'main', buildCommand: 'npm run build' }`
*   **Action:** Stores repository metadata and configures the CI/CD pipeline listener.

### 2.2 `POST /api/deploy/:projectId`
*   **Description:** Triggers a new manual deployment for the specified project. 
*   **Payload:** Optional `{ commitHash: 'latest' }`
*   **Action:** Clones the repository, installs dependencies, runs build commands, and spins up the container/service. Updates the deployment status in the database.

### 2.3 `GET /api/deploy/:projectId/logs`
*   **Description:** Retrieves the build or application logs for a specific deployment.
*   **Query Parameters:** `?type=build|runtime&lines=100`
*   **Action:** Streams or fetches log outputs from the container orchestration engine (e.g., Docker/Kubernetes) or log storage system.

### 2.4 `POST /api/deploy/:projectId/rollback`
*   **Description:** Reverts the current live environment to a previously successful deployment.
*   **Payload:** `{ targetDeploymentId: 'deploy_xyz123' }`
*   **Action:** Stops the current container and restarts the image associated with the specified previous deployment ID. Updates routing/DNS if necessary.

### 2.5 `GET /api/env/:projectId`
*   **Description:** Retrieves the current environment variables for the project.
*   **Action:** Fetches decrypted environment variables from the secure vault or database. Returns masked values if necessary depending on user roles.

### 2.6 `POST /api/env/:projectId`
*   **Description:** Updates the environment variables for the project.
*   **Payload:** `{ variables: { DATABASE_URL: '...', API_KEY: '...' } }`
*   **Action:** Encrypts and securely stores the new environment variables. Often triggers a soft restart or redeployment to apply the new variables.

---

## 3. Integration with AI Intelligence

These new DevOps endpoints will be integrated with our existing AI features:
*   **AI Auto-Fixer:** If `POST /api/deploy/:projectId` fails during the build step, the logs (`GET /api/deploy/:projectId/logs`) will be automatically analyzed by the AI to suggest or apply fixes.
*   **Security Scanning:** Before a deployment is finalized, the code can be scanned for vulnerabilities, and the deployment halted if high-risk issues are found.
