# CogniCode: The Complete User Guide

Welcome to CogniCode! Whether you are a solo developer or part of an enterprise team, this guide will take you from a complete beginner to a power user. CogniCode unifies your coding and deployment workflow by combining an intelligent AI Editor with a robust DevOps pipeline.

Follow this step-by-step tutorial to test and master the platform.

---

## Phase 1: Onboarding & Setup

### 1. Sign Up & Authentication

Before you can deploy, you need an account.

- Navigate to the **Register** page and sign up using your email.
- You will be redirected to the **Verify Pending** screen. Check your inbox and click the verification link.
- For better connection use your github email address.
- Head to the **Login** page and enter your credentials.
- **Account Management:** Manage your personal details and profile picture anytime in the **Account Settings** section. The platform features a permanent, high-contrast **Premium Dark Theme** for maximum focus and coding comfort.

### 2. Creating Your First Project

Your codebase lives inside a "Project."

- Give your project a name and description. 
- **Project Tracking:** Each project displays its **Last Updated Date**, helping you keep track of your most active repositories at a glance.

### 3. AI-Powered Project Search & Diagnostics
- Managing dozens of repositories? Use the **Search Bar** in the dashboard navigation.
- **Search Diagnostics:** Click the **Bug Icon** inside the search bar to enable **Debug Mode**. The AI will analyze your query and project list, providing suggestions if no exact matches are found and explaining search relevance in real-time.

### 3. Connecting Your Repository

CogniCode needs access to your code to deploy it and analyze it.

- Navigate to the **Connect Repo** panel.
- Authorize CogniCode to access your GitHub account or if you are using github email address for signup then it will automatically connect to your github account.
- Select the repository and the specific branch (e.g., `main` or `staging`) you want to work with.

---

## Phase 2: Team Collaboration & Sharing

CogniCode is designed for seamless collaboration. You can invite team members to individual projects or entire suites of repositories.

### 4. Bulk Project Invitations (Dashboard)
- Need to onboard a team member to multiple projects at once?
- On your **Dashboard**, click the **Invite Team** button in the project actions area.
- A modern modal will appear allowing you to:
  - **Multi-Select Projects:** Tick checkboxes for every project you want to share.
  - **Assign Roles:** Choose between **Viewer** (Read-only), **Editor** (Can modify code), or **Admin** (Full management).
  - **Smart Suggestions:** Use the **Recent Collaborator Autocomplete** to instantly select emails of colleagues you have invited before.

### 5. Individual Project Sharing (Editor)
- Working inside the **AI Editor** and need immediate help?
- Click the **Share** button in the top navigation bar.
- Enter the email address and set the permissions. The collaborator will instantly see the project in their shared dashboard.

### 6. Managing "Shared with Me" Projects
- Projects shared by others appear in a dedicated **Shared with Me** section.
- This keeps your dashboard organized, separating your personal repositories from collaborative work.
- You can see the **Project Owner** and your **Assigned Role** directly on the project card.

---

## Phase 3: The DevOps Deployment Pipeline

Let's get your application live on the internet.

### 7. Managing Environment Variables

Never hardcode your API keys.

- Open the **EnvManager** (Environment Manager) tab.
- Add your secret keys (like Database URIs, Stripe Keys, or API tokens).
- These are heavily encrypted and will be securely injected into your application at runtime.

### 8. Triggering a Deployment
- Go to the **Deployment Panel**.
- Click the **Deploy** button. CogniCode now uses a **Production-Hardened Docker Infrastructure**:
  - **Isolated Containers:** Each project is built and run in a completely isolated Docker container for maximum security.
  - **Self-Healing Manifests:** If your project is missing a `package.json` or `Dockerfile`, the platform automatically generates production-ready templates to ensure a successful build.
  - **Automatic Routing:** Traffic is routed through a custom **Subdomain Reverse Proxy**, mapping your project ID to its running container instantly.
  - **Simulation Fallback:** In environments where Docker Desktop is not active, the platform gracefully switches to a high-fidelity simulation mode so you can continue testing your workflow.

### 9. Monitoring & Logs

- **Logs Viewer**: If your app crashes or a build fails, open the **Logs Viewer**. Here you will see a real-time, streaming terminal output of both your build process and runtime errors.

### 10. Instant Rollbacks

- Made a mistake that broke production? Don't panic.
- Open the **Rollback Timeline**. You will see a visual history of every deployment you've made.
- Click on any previous green (stable) deployment to instantly revert your live application to that state with zero downtime.

---

## Phase 4: The AI Code Editor Suite

Now that your app is deployed, let's use the CogniCode AI Editor to write better, faster, and more secure code directly from the platform.

### 11. Architecture Explanation (Explain AI)

- Inherited a messy codebase or don't understand a complex file?
- Open the **Editor Explain AI** module.
- Highlight the confusing code, and the AI will provide a plain-English, line-by-line breakdown of the logic and architecture.

### 12. Visual Architecture Graph

- Need to see the big picture? Open the **Architecture Graph** feature.
- The AI scans your entire codebase and generates a visual representation of how your components, modules, and microservices interact, allowing you to understand the system flow instantly.

### 13. Intent-Driven Development

- Want to build a new feature fast? Open **Editor Intent**.
- Describe what you want in plain English (e.g., _"Create an Express.js middleware that verifies JWT tokens and checks user roles"_).
- The AI generates production-ready code that you can immediately insert into your project.

### 14. Database Schema Design

- Planning a new database structure? Open **Editor Schema**.
- Describe your data relationships. The AI will output a fully typed ORM schema (like Mongoose or Prisma) along with a visual **Mermaid.js Entity-Relationship diagram** so you can see how your tables connect.

### 15. Context-Aware Security & Code Review

- Before you push code, open **Editor Security** and **Editor Review**.
- The AI will parse your code's Abstract Syntax Tree (AST) to identify OWASP top 10 vulnerabilities (like SQL injection or XSS) and bad practices.
- It doesn't just warn you—it provides a one-click button to automatically apply the fix.

### 16. Code Optimization (Performance)

- Is your app running slow? Open **Editor Performance**.
- The AI profiles your codebase to find memory leaks, inefficient loops, or heavy algorithmic complexity, and rewrites the function to be highly optimized.

### 17. Automated Test Generation

- Hate writing unit tests? Go to **Editor Tests**.
- Select any file or function. The AI acts as a Test-Driven Development (TDD) agent, automatically writing comprehensive unit and integration tests covering edge cases you might have missed.

### 18. Project Decision Memory

- Over time, your team makes hundreds of architectural choices.
- Open **Editor Memory**. CogniCode remembers the context of your entire project. If a new developer asks, _"Why did we use Redis instead of Memcached here?"_, the AI retrieves the historical context and explains the decision.

### 19. Time-Travel Debugging (Root Cause Analyzer)

- Tired of chasing ghost bugs? Open **Editor Debugger**.
- Paste a stack trace or a crash log from any environment.
- The AI traverses your project's dependency graph to identify the exact origin of the error and provides a detailed root cause analysis with a suggested fix.

---

## You're Ready to Build!

You now know the entire CogniCode workflow. From connecting a repo and deploying, to collaborating with your team using bulk invitations and letting the AI write tests, fix security flaws, and explain architecture.

Head back to your **Dashboard** and start your first deployment!
