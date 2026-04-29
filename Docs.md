# CogniCode Documentation Structure

*Welcome to the CogniCode developer hub. Below is the structure of our official documentation.*

---

## 1. Getting Started
- **Introduction to CogniCode**: What is it and why use it?
- **Quick Start Guide**: Connect a repo and deploy your first app in 5 minutes.
- **Account & Profile Setup**: Managing your user details, SSH keys, and tokens.

## 2. The AI Code Editor
*Detailed guides on maximizing the built-in intelligent editor.*
- **Using Intent-Driven Generation**: How to write effective prompts for code generation.
- **Navigating the Decision Memory**: How the AI remembers your project history and how to clear/update it.
- **Automated Code Review**: Understanding the AI's review metrics and applying one-click fixes.
- **Security Scans & AST Parsing**: How our vulnerability detection works and customizing rules.
- **Database Schema Generation**: Generating models and Mermaid.js diagrams from text.
- **Performance Profiling**: Identifying bottlenecks using the EditorPerformance tool.
- **Generating Tests**: Using the TDD agent for React and Node.js.

## 3. Deployment & DevOps
*Comprehensive guides for managing your CI/CD pipeline.*
- **Connecting Repositories**: Authorizing GitHub/GitLab and selecting branches.
- **Managing Environment Variables**: Safely injecting `.env` variables and secrets management.
- **Understanding Build Logs**: How to read live Docker build output and runtime logs.
- **The Rollback Timeline**: How to safely revert to a previous deployment.
- **Customizing `docker-compose.yml`**: Overriding the default CogniCode build configurations.

## 4. Project & Team Management
- **Project Details**: Managing project metadata, tech stack info, and domains.
- **Team Collaboration**: Inviting members and managing roles (Coming Soon).

## 5. API Reference
- **REST API Basics**: Authentication, rate limits, and pagination.
- **Project Endpoints**: `GET /api/projects`, `POST /api/projects`.
- **Deployment Endpoints**: Triggering builds via API (`POST /api/deployments/trigger`).
- **AI Analysis Endpoints**: Fetching security reports or intent generation programmatically.

## 6. Troubleshooting & FAQs
- **Common Deployment Errors**: Why your build failed and how to fix it.
- **AI Token Limits**: Understanding usage and upgrading.
- **Contacting Support**: How to reach out for technical help.
