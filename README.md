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
- _Tip:_ You can manage your personal details and security settings anytime in the **Profile** section.

### 2. Creating Your First Project

Your codebase lives inside a "Project."

- On your central **Dashboard**, click the **Create Project** button.
- Give your project a name and description. This acts as the container for your deployments, logs, and AI memory.

### 3. Connecting Your Repository

CogniCode needs access to your code to deploy it and analyze it.

- Navigate to the **Connect Repo** panel.
- Authorize CogniCode to access your GitHub account or if you are using github email address for signup then it will automatically connect to your github account.
- Select the repository and the specific branch (e.g., `main` or `staging`) you want to work with.

---

## Phase 2: The DevOps Deployment Pipeline

Let's get your application live on the internet.

### 4. Managing Environment Variables

Never hardcode your API keys.

- Open the **EnvManager** (Environment Manager) tab.
- Add your secret keys (like Database URIs, Stripe Keys, or API tokens).
- These are heavily encrypted and will be securely injected into your application at runtime.

### 5. Triggering a Deployment

- Go to the **Deployment Panel**.
- Click the **Deploy** button. CogniCode automatically detects your tech stack, containerizes your app using Docker, and deploys it to our secure cloud.

### 6. Monitoring & Logs

- **Logs Viewer**: If your app crashes or a build fails, open the **Logs Viewer**. Here you will see a real-time, streaming terminal output of both your build process and runtime errors.

### 7. Instant Rollbacks

- Made a mistake that broke production? Don't panic.
- Open the **Rollback Timeline**. You will see a visual history of every deployment you've made.
- Click on any previous green (stable) deployment to instantly revert your live application to that state with zero downtime.

---

## Phase 3: The AI Code Editor Suite

Now that your app is deployed, let's use the CogniCode AI Editor to write better, faster, and more secure code directly from the platform.

### 8. Architecture Explanation (Explain AI)

- Inherited a messy codebase or don't understand a complex file?
- Open the **Editor Explain AI** module.
- Highlight the confusing code, and the AI will provide a plain-English, line-by-line breakdown of the logic and architecture.

### 9. Visual Architecture Graph

- Need to see the big picture? Open the **Architecture Graph** feature.
- The AI scans your entire codebase and generates a visual representation of how your components, modules, and microservices interact, allowing you to understand the system flow instantly.

### 10. Intent-Driven Development

- Want to build a new feature fast? Open **Editor Intent**.
- Describe what you want in plain English (e.g., _"Create an Express.js middleware that verifies JWT tokens and checks user roles"_).
- The AI generates production-ready code that you can immediately insert into your project.

### 11. Database Schema Design

- Planning a new database structure? Open **Editor Schema**.
- Describe your data relationships. The AI will output a fully typed ORM schema (like Mongoose or Prisma) along with a visual **Mermaid.js Entity-Relationship diagram** so you can see how your tables connect.

### 12. Context-Aware Security & Code Review

- Before you push code, open **Editor Security** and **Editor Review**.
- The AI will parse your code's Abstract Syntax Tree (AST) to identify OWASP top 10 vulnerabilities (like SQL injection or XSS) and bad practices.
- It doesn't just warn you—it provides a one-click button to automatically apply the fix.

### 13. Code Optimization (Performance)

- Is your app running slow? Open **Editor Performance**.
- The AI profiles your codebase to find memory leaks, inefficient loops, or heavy algorithmic complexity, and rewrites the function to be highly optimized.

### 14. Automated Test Generation

- Hate writing unit tests? Go to **Editor Tests**.
- Select any file or function. The AI acts as a Test-Driven Development (TDD) agent, automatically writing comprehensive unit and integration tests covering edge cases you might have missed.

### 15. Project Decision Memory

- Over time, your team makes hundreds of architectural choices.
- Open **Editor Memory**. CogniCode remembers the context of your entire project. If a new developer asks, _"Why did we use Redis instead of Memcached here?"_, the AI retrieves the historical context and explains the decision.

---

## You're Ready to Build!

You now know the entire CogniCode workflow. From connecting a repo and deploying, to letting the AI write tests, fix security flaws, and explain architecture.

Head back to your **Dashboard** and start your first deployment!
