import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useProject from "../hooks/useProject";
import useForm from "../hooks/useForm";
import { authValidator } from "../utils/validators";
import ProjectSearch from "../components/ProjectSearch";
import AccountSettings from "./AccountSettings";
import SharedProjects from "./SharedProjects";
import {
  Plus,
  Folder,
  Users,
  Settings,
  LogOut,
  Search,
  Trash2,
  ExternalLink,
  X,
  Layout,
  GitCompare,
  Menu,
  Rocket,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";
import brandLogo from "../assets/Brand logo.png";

const DashboardOverview = React.lazy(() => import("../components/dashboard/DashboardOverview"));
const DashboardProjects = React.lazy(() => import("../components/dashboard/DashboardProjects"));
const Dashboard = () => {
  const navigate = useNavigate();
  const {
    user,
    handleUpdateProfile,
    handleLogout,
    loading: authLoading,
  } = useAuth();
  const {
    projects,
    fetchProjects,
    createProject,
    deleteProject,
    addCollaborator,
    bulkInvite,
    fetchRecentCollaborators,
    loading: projectLoading,
    updateProject,
  } = useProject();

  const [activeTab, setActiveTab] = useState("projects");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBulkInviteOpen, setIsBulkInviteOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [editProjectData, setEditProjectData] = useState({ title: "", description: "" });
  const [bulkInviteData, setBulkInviteData] = useState({
    email: "",
    selectedProjectIds: [],
    role: "viewer"
  });
  const [recentCollaborators, setRecentCollaborators] = useState([]);

  const { values, errors, handleChange, handleBlur, validateAll } = useForm(
    {
      username: user?.username || "",
      city: user?.city || "",
      bio: user?.bio || "",
      dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    },
    authValidator,
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      await handleUpdateProfile(values);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      await createProject(newProject);
      toast.success("Project created successfully");
      setIsCreateModalOpen(false);
      setNewProject({ title: "", description: "" });
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const openDeleteModal = (e, project) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject(projectToDelete._id);
      toast.success("Project deleted successfully");
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const openEditModal = (e, project) => {
    e.stopPropagation();
    setProjectToEdit(project);
    setEditProjectData({
      title: project.title,
      description: project.description || ""
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editProjectData.title.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      await updateProject(projectToEdit._id, editProjectData);
      setIsEditModalOpen(false);
      setProjectToEdit(null);
    } catch (error) {
      // Toast error is handled in hook
    }
  };

  const handleBulkInvite = async (e) => {
    e.preventDefault();
    if (!bulkInviteData.email) return toast.error("Email is required");
    if (bulkInviteData.selectedProjectIds.length === 0) return toast.error("Select at least one project");

    try {
      await bulkInvite({
        email: bulkInviteData.email,
        projectIds: bulkInviteData.selectedProjectIds,
        role: bulkInviteData.role
      });
      toast.success("Team invitation sent!");
      setIsBulkInviteOpen(false);
      setBulkInviteData({ email: "", selectedProjectIds: [], role: "viewer" });
      fetchProjects(); // Refresh to update collaborators
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send invitations");
    }
  };

  const toggleProjectSelection = (id) => {
    setBulkInviteData(prev => ({
      ...prev,
      selectedProjectIds: prev.selectedProjectIds.includes(id)
        ? prev.selectedProjectIds.filter(pid => pid !== id)
        : [...prev.selectedProjectIds, id]
    }));
  };

  useEffect(() => {
    if (isBulkInviteOpen) {
      const loadRecent = async () => {
        try {
          const collabs = await fetchRecentCollaborators();
          setRecentCollaborators(collabs || []);
        } catch (err) {
          console.error("Failed to load recent collaborators", err);
        }
      };
      loadRecent();
    }
  }, [isBulkInviteOpen]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="dashboard">
      {/* Top Navbar */}
      <header className="dashboard__nav navbar">
        <div className="navbar__left">
          <div
            className="navbar__brand"
            onClick={() => navigate("/dashboard")}
            style={{ cursor: "pointer" }}
          >
            <img
              src={brandLogo}
              alt="CogniCode Logo"
              style={{ width: "32px", height: "32px", objectFit: "contain" }}
            />
            <span>CogniCode</span>
          </div>
        </div>

        <div className="navbar__center">
          <ProjectSearch
            projects={projects}
            onProjectClick={(id) => navigate(`/editor/${id}`)}
          />
        </div>

        <div className="navbar__right">
          <div
            className="navbar__user"
            onClick={() => navigate("/profile")}
            style={{ cursor: "pointer" }}
          >
            <div className="navbar__user-avatar">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.username}
                  className="navbar__user-img"
                />
              ) : (
                user?.username?.charAt(0).toUpperCase() || "U"
              )}
              <div className="status-indicator status-indicator--online"></div>
            </div>
            <div className="navbar__user-info">
              <span className="navbar__user-name">
                {user?.username || "Developer"}
              </span>
            </div>
          </div>
          <button
            className="hamburger"
            onClick={toggleSidebar}
            style={{ marginLeft: "8px" }}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`dashboard__sidebar sidebar ${isSidebarOpen ? "sidebar--open" : ""}`}
      >
        <div className="sidebar__menu">
          <div
            className={`sidebar__item ${activeTab === "overview" ? "sidebar__item--active" : ""}`}
            onClick={() => {
              setActiveTab("overview");
              setIsSidebarOpen(false);
            }}
          >
            <Layout size={20} />
            Overview
          </div>
          <div
            className={`sidebar__item ${activeTab === "projects" ? "sidebar__item--active" : ""}`}
            onClick={() => {
              setActiveTab("projects");
              setIsSidebarOpen(false);
            }}
          >
            <Folder size={20} />
            My Projects
          </div>
          <div
            className={`sidebar__item ${activeTab === "shared" ? "sidebar__item--active" : ""}`}
            onClick={() => {
              setActiveTab("shared");
              setIsSidebarOpen(false);
            }}
          >
            <Users size={20} />
            Shared Projects
          </div>
          <div
            className={`sidebar__item ${activeTab === "settings" ? "sidebar__item--active" : ""}`}
            onClick={() => {
              setActiveTab("settings");
              setIsSidebarOpen(false);
            }}
          >
            <Settings size={20} />
            Settings
          </div>
          <div
            className={`sidebar__item ${activeTab === "deployment" ? "sidebar__item--active" : ""}`}
            onClick={() => {
              navigate("/connect-repo");
              setIsSidebarOpen(false);
            }}
          >
            <Rocket size={20} />
            Deployment
          </div>
        </div>

        <div
          className="sidebar__footer"
          style={{
            padding: "2rem 1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="sidebar__item logout-btn"
            onClick={async () => {
              await handleLogout();
              navigate("/");
            }}
            style={{ width: "100%", justifyContent: "center" }}
          >
            <LogOut size={20} />
            Logout
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard__main dashboard-page">
        {activeTab === "overview" && (
          <div className="overview-docs">
            <header className="docs-header">
              <h1 className="docs-title">Platform Documentation</h1>
              <p className="docs-lead">
                Welcome to CogniCode, the premium AI-powered development environment.
                Our platform provides institutional-grade tools to build, manage, and scale your mission-critical applications.
              </p>
            </header>

            <div className="docs-content">
              <section className="docs-section">
                <h2 className="docs-subtitle">Core Capabilities</h2>
                <div className="docs-grid">
                  <div className="docs-item">
                    <h3>Smart Dashboard</h3>
                    <p>Centralized control center for all your projects and active deployments.</p>
                  </div>
                  <div className="docs-item">
                    <h3>Project Management</h3>
                    <p>Create, organize, and manage your repositories with a streamlined interface.</p>
                  </div>
                  <div className="docs-item">
                    <h3>Code Review</h3>
                    <p>Automated AI-driven code analysis for bugs, performance, and best practices.</p>
                  </div>
                  <div className="docs-item">
                    <h3>Graph & Analytics</h3>
                    <p>Interactive visual representations of your system architecture and schemas.</p>
                  </div>
                  <div className="docs-item">
                    <h3>Deployment System</h3>
                    <p>Connect GitHub repositories and push to production with zero friction.</p>
                  </div>
                  <div className="docs-item">
                    <h3>Shared Workspace</h3>
                    <p>Collaborate with your team securely on projects and live codebases.</p>
                  </div>
                  <div className="docs-item">
                    <h3>DevOps Integration</h3>
                    <p>Built-in CI/CD, environment variables, and scalable infrastructure tools.</p>
                  </div>
                  <div className="docs-item">
                    <h3>AI Productivity Tools</h3>
                    <p>Context-aware editor, intent-based modifications, and memory timeline.</p>
                  </div>
                  <div className="docs-item">
                    <h3>Security & Reliability</h3>
                    <p>Vulnerability scanning and robust error handling across all features.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === "shared" && (
          <div className="dashboard-shared-container">
            <SharedProjects onBack={() => setActiveTab("projects")} />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="dashboard-settings-container">
            <AccountSettings onBack={() => setActiveTab("projects")} />
          </div>
        )}

        {activeTab === "projects" && (
          <>
            <header className="dashboard-page__header">
              <div className="dashboard-page__title-group">
                <h1 className="dashboard-page__title">My Projects</h1>
                <p className="dashboard-page__subtitle" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
                  Manage and organize your AI code projects.
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  className="project-card__btn project-card__btn--ghost"
                  onClick={() => navigate("/connect-repo")}
                >
                  <GitCompare size={18} /> Connect Repo
                </button>
                <button
                  className="project-card__btn project-card__btn--primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <Plus size={18} /> Create New Project
                </button>
              </div>
            </header>

            {projectLoading && projects.length === 0 ? (
              <div className="dashboard-page__loading">
                <div className="loader"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="dashboard-page__empty" style={{ background: "rgba(10,10,10,0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "0" }}>
                <div className="dashboard-page__empty-icon" style={{ opacity: 0.5 }}>
                  <Folder size={48} strokeWidth={1} />
                </div>
                <p className="dashboard-page__empty-text" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem" }}>
                  You haven't created any projects yet.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Start Your First Project
                </button>
              </div>
            ) : (
              <div className="dashboard-page__grid">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="project-card"
                    onClick={() => navigate(`/editor/${project._id}`)}
                  >
                    <div className="project-card__header">
                      <h3 className="project-card__title">{project.title}</h3>
                      <span className="project-card__date">
                        {new Date(
                          project.updatedAt || project.createdAt,
                        ).toLocaleString("en-US", {
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="project-card__content">
                      <p className="project-card__description">
                        {project.description || "No description provided."}
                      </p>
                    </div>
                    <div className="project-card__actions">
                      <button
                        className="project-card__btn project-card__btn--edit"
                        onClick={(e) => openEditModal(e, project)}
                        title="Edit Project"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="project-card__btn project-card__btn--delete"
                        onClick={(e) => openDeleteModal(e, project)}
                        title="Delete Project"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button className="project-card__btn" title="Open Project">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div className="modal-standard-v3 create-project-modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Initialize Project</h2>
              <button
                className="close-btn"
                onClick={() => setIsCreateModalOpen(false)}
              >
                <X size={20} />
              </button>
            </header>
            <form onSubmit={handleCreateProject} className="modal-form">
              <div className="input-group">
                <label className="input-label mono">PROJECT NAME</label>
                <input
                  type="text"
                  placeholder="e.g. CogniCode Core Engine"
                  className="input-field"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  autoFocus
                />
              </div>
              <div className="input-group">
                <label className="input-label mono">
                  DESCRIPTION (OPTIONAL)
                </label>
                <textarea
                  placeholder="What is this project about?"
                  className="input-field textarea"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={projectLoading}
                >
                  {projectLoading ? "Initializing..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div className="modal-standard-v3 create-project-modal" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Edit Project</h2>
              <button
                className="close-btn"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={20} />
              </button>
            </header>
            <form onSubmit={handleUpdateProject} className="modal-form">
              <div className="input-group">
                <label className="input-label mono">PROJECT NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Updated Project Name"
                  className="input-field"
                  value={editProjectData.title}
                  onChange={(e) =>
                    setEditProjectData({ ...editProjectData, title: e.target.value })
                  }
                  autoFocus
                />
              </div>
              <div className="input-group">
                <label className="input-label mono">
                  DESCRIPTION (OPTIONAL)
                </label>
                <textarea
                  placeholder="What is this project about?"
                  className="input-field textarea"
                  value={editProjectData.description}
                  onChange={(e) =>
                    setEditProjectData({
                      ...editProjectData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={projectLoading}
                >
                  {projectLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="modal-content modal-content--danger"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Delete Project</h2>
              <button
                className="close-btn"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong className="white">"{projectToDelete?.title}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteConfirm}
                disabled={projectLoading}
              >
                {projectLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Bulk Invite Modal */}
      {isBulkInviteOpen && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invite Team</h2>
              <button
                className="close-btn"
                onClick={() => setIsBulkInviteOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleBulkInvite} className="modal-form">
              <div className="input-group">
                <label className="input-label">COLLABORATOR EMAIL</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Enter colleague's email..."
                  list="recent-emails"
                  value={bulkInviteData.email}
                  onChange={(e) => setBulkInviteData({ ...bulkInviteData, email: e.target.value })}
                  required
                />
                <datalist id="recent-emails">
                  {recentCollaborators.map(collab => (
                    <option key={collab.email} value={collab.email}>{collab.username}</option>
                  ))}
                </datalist>
              </div>

              <div className="input-group">
                <label className="input-label">SELECT PROJECTS</label>
                <div className="projects-selection-list">
                  {projects.map(project => (
                    <label
                      key={project._id}
                      className={`project-selection-item ${bulkInviteData.selectedProjectIds.includes(project._id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={bulkInviteData.selectedProjectIds.includes(project._id)}
                        onChange={() => toggleProjectSelection(project._id)}
                      />
                      <span>{project.title}</span>
                    </label>
                  ))}
                  {projects.length === 0 && <p className="empty-text">No projects found</p>}
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">ASSIGN ROLE</label>
                <select
                  className="input-field"
                  value={bulkInviteData.role}
                  onChange={(e) => setBulkInviteData({ ...bulkInviteData, role: e.target.value })}
                >
                  <option value="viewer">Viewer (Read-only)</option>
                  <option value="editor">Editor (Can edit)</option>
                  <option value="admin">Admin (Full access)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsBulkInviteOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Invites
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
