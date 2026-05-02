import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineDocumentText, HiOutlineArrowDownTray } from "react-icons/hi2";
import CognicodePDF from "../assets/docs/Cognicode.pdf";

import "./Documentation.scss";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: `Welcome to CogniCode, the next-generation developer platform designed to bridge the gap between AI-assisted coding and automated DevOps. This documentation hub provides everything you need to build, optimize, and deploy your applications with lightning speed.`,
  },
  {
    id: "what-is-this",
    title: "2. What is this platform",
    content: `CogniCode is an institutional-grade SaaS platform that combines a high-performance AI code editor with a robust deployment engine. Unlike traditional CI/CD tools, CogniCode understands your code's context, allowing for intelligent rollbacks, automated security patching, and real-time performance optimizations.`,
  },
  {
    id: "core-features",
    title: "3. Core Features",
    items: [
      "AI-Powered Code Generation: Intent-driven code creation based on project context.",
      "Automated Security Scanning: Real-time vulnerability detection and AST parsing.",
      "One-Click Deployment: Seamless integration with GitHub and GitLab.",
      "Environment Management: Isolated staging and production environments.",
      "Performance Insights: In-depth metrics on memory usage and execution speed.",
    ],
  },
  {
    id: "getting-started",
    title: "4. Getting Started",
    content: `To get started, follow these simple steps:`,
    code: `npm install -g cognicode-cli
cognicode login
cognicode init`,
  },
  {
    id: "deployment-workflow",
    title: "5. Deployment Workflow",
    content: `Our deployment engine uses Dockerized runners to ensure environment parity. Every time you push code or trigger a manual build, CogniCode:`,
    items: [
      "Pulls the latest changes from your branch.",
      "Runs automated security and linting checks.",
      "Builds an optimized Docker image.",
      "Deploys the image to our global edge network.",
    ],
  },
  {
    id: "ai-features",
    title: "6. AI Features",
    content: `The CogniCode AI suite is integrated directly into the deployment pipeline. Key features include:`,
    items: [
      "Intent Generation: Describe what you want to build, and let the AI scaffold the logic.",
      "Decision Memory: The AI remembers previous architectural choices to ensure consistency.",
      "Test Generation: Automatically generate unit and integration tests for your functions.",
    ],
  },
  {
    id: "env-management",
    title: "7. Environment Management",
    content: `Manage multiple environments with ease. You can define specific environment variables for development, staging, and production. All secrets are encrypted at rest using AES-256 and never exposed in build logs.`,
  },
  {
    id: "logs-monitoring",
    title: "8. Logs & Monitoring",
    content: `Access real-time streaming logs from your active deployments. Our monitoring dashboard provides:`,
    items: [
      "Build Logs: Live output from the Docker build process.",
      "Runtime Logs: Console output from your running applications.",
      "Metrics: Basic CPU and Memory usage tracking.",
    ],
  },
  {
    id: "pricing-overview",
    title: "9. Pricing Overview",
    content: `CogniCode offers flexible plans tailored to your needs:`,
    items: [
      "Developer (Free): 3 active projects, 1GB RAM, basic AI features.",
      "Pro Squad ($29/mo): Unlimited projects, 4GB RAM, full AI suite, priority support.",
      "Enterprise (Custom): Dedicated compute, SSO/RBAC, and custom SLA.",
    ],
  },
  {
    id: "faq",
    title: "10. FAQ",
    content: `Here are some frequently asked questions:`,
    items: [
      "Q: Which languages are supported?\nA: We currently support Node.js, Python, Go, and Rust natively.",
      "Q: Can I use my own Dockerfile?\nA: Yes, CogniCode will automatically detect and use your Dockerfile if present.",
      "Q: Is my code shared with AI models?\nA: We use private instances of LLMs and your code is never used for training external models.",
    ],
  },
];

const Documentation = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="docs-layout">
      {/* Header */}
      <header className="docs-header">
        <RouterLink to="/" className="back-btn">
          <HiOutlineArrowLeft size={16} />
          <span>Back to Home</span>
        </RouterLink>
        <a
          href={CognicodePDF}
          download="Cognicode_User_Guide.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
          }
        >
          <HiOutlineDocumentText size={16} />
          Documentation
          <HiOutlineArrowDownTray
            size={16}
            style={{ marginLeft: "4px", opacity: 0.8 }}
          />
        </a>
      </header>

      <div className="docs-main">
        {/* Sidebar */}
        <aside className="docs-sidebar">
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`nav-item ${activeSection === section.id ? "active" : ""}`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Content Area */}
        <main className="docs-content-wrapper">
          <div className="docs-content">
            <h1>Platform Documentation</h1>
            <p>
              Technical specifications and workflow guides for the CogniCode
              platform.
            </p>

            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2>{section.title}</h2>

                {section.content && <p>{section.content}</p>}

                {section.code && (
                  <pre>
                    <code>{section.code}</code>
                  </pre>
                )}

                {section.items && (
                  <ul>
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Documentation;
