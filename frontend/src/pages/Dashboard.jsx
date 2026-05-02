import React, { useState, useEffect, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useProject from "../hooks/useProject";
import useForm from "../hooks/useForm";
import { authValidator } from "../utils/validators";
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
} from "lucide-react";
import toast from "react-hot-toast";
import brandLogo from "../assets/Brand logo.png";
import Loader from "../components/ui/Loader";

const DashboardOverview = React.lazy(() => import("../components/dashboard/DashboardOverview"));
const DashboardShared = React.lazy(() => import("../components/dashboard/DashboardShared"));
const DashboardSettings = React.lazy(() => import("../components/dashboard/DashboardSettings"));
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
    loading: projectLoading,
  } = useProject();

  const [activeTab, setActiveTab] = useState("projects");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [newProject, setNewProject] = useState({ title: "", description: "" });

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
            <img src={brandLogo} alt="CogniCode Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
            <span>CogniCode</span>
          </div>
        </div>

        <div className="navbar__center">
          <div className="search-bar">
            <div className="search-bar__icon">
              <Search size={16} />
            </div>
            <input
              type="text"
              className="search-bar__input"
              placeholder="Search projects..."
            />
          </div>
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
          <button className="hamburger" onClick={toggleSidebar} style={{ marginLeft: "8px" }}>
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
            Shared with Me
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

        <div className="sidebar__footer" style={{ padding: '2rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="sidebar__item logout-btn" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={20} />
            Logout
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard__main dashboard-page">
        <Suspense fallback={<Loader />}>
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "shared" && <DashboardShared />}
          {activeTab === "settings" && <DashboardSettings />}
          {activeTab === "projects" && (
            <DashboardProjects
              projects={projects}
              projectLoading={projectLoading}
              navigate={navigate}
              setIsCreateModalOpen={setIsCreateModalOpen}
              openDeleteModal={openDeleteModal}
            />
          )}
        </Suspense>
      </main>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="modal-content modal-content--danger"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '400px' }}
          >
            <div className="modal-body" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
              <div style={{ color: '#ef4444', marginBottom: '1.5rem' }}>
                <Trash2 size={48} strokeWidth={1.5} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '0.75rem' }}>Delete Project</h2>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6', marginBottom: '2rem' }}>
                Are you sure you want to delete <strong style={{ color: '#fff' }}>"{projectToDelete?.title}"</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => setIsDeleteModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                  disabled={projectLoading}
                  style={{ flex: 1 }}
                >
                  {projectLoading ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
