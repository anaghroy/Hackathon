import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GitGraph,
  Globe,
  Search,
  ArrowRight,
  Settings,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  RefreshCcw,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import { useRepo } from "../hooks/useRepo";
import brandLogo from "../assets/Brand logo.png";

const deploymentStyles = `
  @media (max-width: 640px) {
    .deployment-header {
      height: 64px !important;
      padding: 0 1rem !important;
    }
    .deployment-branding span {
      font-size: 1rem !important;
    }
    .deployment-back-btn span {
      display: none !important;
    }
    .deployment-back-btn::after {
      content: 'Back' !important;
      font-size: 0.8125rem !important;
    }
    .deployment-back-btn {
      padding: 0.5rem 0 !important;
      border: none !important;
      background: transparent !important;
      left: 1rem !important;
    }
    .deployment-main {
      padding: 1.5rem 1rem !important;
    }
    .deployment-content {
      gap: 1.5rem !important;
    }
    .deployment-grid {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
    }
  }
`;

const ConnectRepo = () => {
  const navigate = useNavigate();
  const { fetchRepos, connectRepo, repos, loading } = useRepo();
  const [provider, setProvider] = useState("github");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [config, setConfig] = useState({
    branch: "main",
    buildCommand: "npm run build",
    installCommand: "npm install",
    rootDir: "./",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRepos(provider, searchQuery);
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [provider, searchQuery, fetchRepos]);

  const displayRepos = repos;

  const handleConnect = async () => {
    if (!selectedRepo) return;
    try {
      await connectRepo({
        provider,
        repoName: selectedRepo.full_name || selectedRepo.name,
        branch: config.branch,
        buildCommand: config.buildCommand,
        installCommand: config.installCommand,
        rootDir: config.rootDir,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="dashboard"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <style>{deploymentStyles}</style>
      {/* Top Navbar */}
      <header
        className="navbar deployment-header"
        style={{
          padding: "0 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          flexShrink: 0,
        }}
      >
        <div
          className="deployment-branding"
          style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
        >
          <img
            src={brandLogo}
            alt="CogniCode Logo"
            style={{ width: "28px", height: "28px", objectFit: "contain" }}
          />
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: "800",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            CogniCode
          </span>
        </div>

        <button
          className="btn btn-ghost deployment-back-btn"
          onClick={() => navigate("/dashboard")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.02)",
            fontSize: "0.8125rem",
            fontWeight: "600",
            borderRadius: "0",
          }}
        >
          <ChevronLeft size={16} /> <span>Back to Dashboard</span>
        </button>
      </header>

      <main
        className="dashboard-page deployment-main"
        style={{
          flex: 1,
          padding: "1.5rem 2rem",
          display: "flex",
          justifyContent: "center",
          overflowY: "visible",
        }}
      >
        <div
          className="deployment-content"
          style={{
            width: "100%",
            maxWidth: "1000px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <header
            className="dashboard-page__header"
            style={{ borderBottom: "none", paddingBottom: 0 }}
          >
            <div className="dashboard-page__title-group">
              <h1 className="dashboard-page__title">Connect Repository</h1>
              <p className="dashboard-page__subtitle">
                Integrate your version control system to enable automated
                workflows and live deployments.
              </p>
            </div>
          </header>

          <div
            className="deployment-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              alignItems: "start",
            }}
          >
            {/* Left Side: Setup Steps */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                background: "rgba(255,255,255,0.02)",
                padding: "2rem",
                borderRadius: "0",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "0",
                      background: provider
                        ? "rgba(54, 118, 222, 0.1)"
                        : "rgba(255,255,255,0.05)",
                      color: provider ? "#3676de" : "rgba(255,255,255,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      border: provider
                        ? "1px solid rgba(54, 118, 222, 0.2)"
                        : "1px solid transparent",
                      flexShrink: 0,
                    }}
                  >
                    1
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#fff",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Choose Provider
                    </h3>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.5)",
                        margin: 0,
                        lineHeight: "1.5",
                      }}
                    >
                      Select GitHub, GitLab, or Bitbucket.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "0",
                      background: selectedRepo
                        ? "rgba(54, 118, 222, 0.1)"
                        : "rgba(255,255,255,0.05)",
                      color: selectedRepo ? "#3676de" : "rgba(255,255,255,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      border: selectedRepo
                        ? "1px solid rgba(54, 118, 222, 0.2)"
                        : "1px solid transparent",
                      flexShrink: 0,
                    }}
                  >
                    2
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#fff",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Select Repository
                    </h3>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.5)",
                        margin: 0,
                        lineHeight: "1.5",
                      }}
                    >
                      Choose the project you want to connect.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "0",
                      background: "rgba(255,255,255,0.05)",
                      color: "rgba(255,255,255,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      flexShrink: 0,
                    }}
                  >
                    3
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#fff",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Configure Build
                    </h3>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.5)",
                        margin: 0,
                        lineHeight: "1.5",
                      }}
                    >
                      Define build and installation commands.
                    </p>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "rgba(54, 118, 222, 0.03)",
                  borderRadius: "0",
                  border: "1px solid rgba(54, 118, 222, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <ShieldCheck size={16} style={{ color: "#3676de" }} />
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: "600",
                      color: "#3676de",
                    }}
                  >
                    AI-Security Ready
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.6)",
                    lineHeight: "1.6",
                    margin: 0,
                  }}
                >
                  Once connected, our DevSecOps agent automatically scans every
                  push for vulnerabilities.
                </p>
              </div>
            </div>

            {/* Right Side: Main Interface */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
            >
              {/* Step 1: Provider Selection */}
              <section>
                <label
                  className="input-label"
                  style={{ marginBottom: "0.75rem", display: "block" }}
                >
                  VCS Provider
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    className={`btn ${provider === "github" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setProvider("github")}
                    style={{
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      border:
                        provider !== "github"
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "none",
                      height: "auto",
                      borderRadius: "0",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    <span style={{ fontSize: "0.8125rem", fontWeight: "600" }}>
                      GitHub
                    </span>
                  </button>
                  <div style={{ position: "relative" }}>
                    <button
                      className="btn btn-ghost"
                      disabled
                      style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        border: "1px solid rgba(255,255,255,0.05)",
                        height: "auto",
                        width: "100%",
                        opacity: 0.5,
                        borderRadius: "0",
                        cursor: "not-allowed",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M15.117 8.626 8 15.75.883 8.626a1.51 1.51 0 0 1-.47-1.47L1.96 1.84a.75.75 0 0 1 1.445-.048l1.33 4.127h6.53l1.33-4.127a.75.75 0 0 1 1.445.048l1.547 5.316a1.51 1.51 0 0 1-.47 1.47z" />
                      </svg>
                      <span
                        style={{ fontSize: "0.8125rem", fontWeight: "600" }}
                      >
                        GitLab
                      </span>
                    </button>
                    <span
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "rgba(54, 118, 222, 0.1)",
                        color: "#3676de",
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "2px 6px",
                        border: "1px solid rgba(54, 118, 222, 0.2)",
                        textTransform: "uppercase",
                      }}
                    >
                      Soon
                    </span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <button
                      className="btn btn-ghost"
                      disabled
                      style={{
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        border: "1px solid rgba(255,255,255,0.05)",
                        height: "auto",
                        width: "100%",
                        opacity: 0.5,
                        borderRadius: "0",
                        cursor: "not-allowed",
                      }}
                    >
                      <Globe size={20} />
                      <span
                        style={{ fontSize: "0.8125rem", fontWeight: "600" }}
                      >
                        Bitbucket
                      </span>
                    </button>
                    <span
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "rgba(54, 118, 222, 0.1)",
                        color: "#3676de",
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "2px 6px",
                        border: "1px solid rgba(54, 118, 222, 0.2)",
                        textTransform: "uppercase",
                      }}
                    >
                      Soon
                    </span>
                  </div>
                </div>
              </section>

              {/* Step 2: Repository List */}
              <section>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <label className="input-label" style={{ margin: 0 }}>
                    Repository
                  </label>
                  <div
                    style={{ position: "relative", flex: 1, maxWidth: "280px" }}
                  >
                    <Search
                      size={14}
                      style={{
                        position: "absolute",
                        left: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "rgba(255,255,255,0.4)",
                        zIndex: 1,
                      }}
                    />
                    <input
                      className="input-field"
                      placeholder="Search repositories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        paddingLeft: "2.75rem",
                        height: "40px",
                        fontSize: "0.875rem",
                        width: "100%",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    maxHeight: "240px",
                    overflowY: "auto",
                    paddingRight: "0.25rem",
                  }}
                >
                  {loading ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "2rem 0",
                      }}
                    >
                      <RefreshCcw
                        size={20}
                        className="animate-spin"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      />
                    </div>
                  ) : displayRepos.length > 0 ? (
                    displayRepos.map((repo) => (
                      <button
                        key={repo.id}
                        onClick={() => setSelectedRepo(repo)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.75rem 1rem",
                          background:
                            selectedRepo?.id === repo.id
                              ? "rgba(54, 118, 222, 0.08)"
                              : "rgba(255, 255, 255, 0.02)",
                          border: `1px solid ${selectedRepo?.id === repo.id ? "rgba(54, 118, 222, 0.3)" : "rgba(255, 255, 255, 0.05)"}`,
                          borderRadius: "0",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          color:
                            selectedRepo?.id === repo.id
                              ? "#fff"
                              : "rgba(255,255,255,0.7)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                          }}
                        >
                          <Terminal
                            size={14}
                            style={{
                              color:
                                selectedRepo?.id === repo.id
                                  ? "#3676de"
                                  : "rgba(255,255,255,0.3)",
                            }}
                          />
                          <span
                            style={{ fontSize: "0.8125rem", fontWeight: "500" }}
                          >
                            {repo.full_name || repo.name}
                          </span>
                        </div>
                        {selectedRepo?.id === repo.id && (
                          <Check size={16} style={{ color: "#3676de" }} />
                        )}
                      </button>
                    ))
                  ) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "2rem 0",
                        color: "rgba(255,255,255,0.4)",
                      }}
                    >
                      <AlertCircle
                        size={24}
                        style={{ margin: "0 auto 0.5rem", opacity: 0.5 }}
                      />
                      <p style={{ fontSize: "0.8125rem", margin: 0 }}>
                        No repositories found.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* Step 3: Build Configuration */}
              {selectedRepo && (
                <section style={{ animation: "fadeIn 0.3s ease-out" }}>
                  <label
                    className="input-label"
                    style={{ marginBottom: "0.75rem", display: "block" }}
                  >
                    Build Configuration
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div className="input-group">
                      <label
                        className="input-label"
                        style={{ fontSize: "0.75rem", opacity: 0.8 }}
                      >
                        Branch
                      </label>
                      <input
                        className="input-field"
                        value={config.branch}
                        onChange={(e) =>
                          setConfig({ ...config, branch: e.target.value })
                        }
                      />
                    </div>
                    <div className="input-group">
                      <label
                        className="input-label"
                        style={{ fontSize: "0.75rem", opacity: 0.8 }}
                      >
                        Root Directory
                      </label>
                      <input
                        className="input-field"
                        value={config.rootDir}
                        onChange={(e) =>
                          setConfig({ ...config, rootDir: e.target.value })
                        }
                      />
                    </div>
                    <div className="input-group">
                      <label
                        className="input-label"
                        style={{ fontSize: "0.75rem", opacity: 0.8 }}
                      >
                        Install Command
                      </label>
                      <input
                        className="input-field"
                        value={config.installCommand}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            installCommand: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="input-group">
                      <label
                        className="input-label"
                        style={{ fontSize: "0.75rem", opacity: 0.8 }}
                      >
                        Build Command
                      </label>
                      <input
                        className="input-field"
                        value={config.buildCommand}
                        onChange={(e) =>
                          setConfig({ ...config, buildCommand: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={handleConnect}
                    disabled={loading}
                    style={{
                      width: "100%",
                      marginTop: "1.5rem",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {loading ? "Initializing..." : "Connect & Initialize"}
                    {!loading && (
                      <ArrowRight size={16} style={{ marginLeft: "0.5rem" }} />
                    )}
                  </button>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConnectRepo;
