import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useProject from "../hooks/useProject";
import useForm from "../hooks/useForm";
import { authValidator } from "../utils/validators";
import { Plus, Folder, Users, Settings, LogOut, Search, Trash2, ExternalLink, X, Layout } from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, handleUpdateProfile, handleLogout, loading: authLoading } = useAuth();
  const { projects, fetchProjects, createProject, deleteProject, loading: projectLoading } = useProject();
  
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
    authValidator
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
          <button className="hamburger" onClick={toggleSidebar}>
            <X size={24} className={isSidebarOpen ? "" : "hidden"} />
            <Plus size={24} className={isSidebarOpen ? "hidden" : "rotate-45"} />
          </button>
          <div className="navbar__brand" onClick={() => navigate("/dashboard")} style={{ cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>SQUADRA</span>
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
          <div className="navbar__user" onClick={() => navigate("/profile")} style={{ cursor: 'pointer' }}>
            <div className="navbar__user-avatar">
              {user?.picture ? (
                <img src={user.picture} alt={user.username} className="navbar__user-img" />
              ) : (
                user?.username?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div className="navbar__user-info">
              <span className="navbar__user-name">{user?.username || "Developer"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`dashboard__sidebar sidebar ${isSidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__menu">
          <div 
            className={`sidebar__item ${activeTab === 'overview' ? 'sidebar__item--active' : ''}`}
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
          >
            <Layout size={20} />
            Overview
          </div>
          <div 
            className={`sidebar__item ${activeTab === 'projects' ? 'sidebar__item--active' : ''}`}
            onClick={() => { setActiveTab('projects'); setIsSidebarOpen(false); }}
          >
            <Folder size={20} />
            My Projects
          </div>
          <div 
            className={`sidebar__item ${activeTab === 'shared' ? 'sidebar__item--active' : ''}`}
            onClick={() => { setActiveTab('shared'); setIsSidebarOpen(false); }}
          >
            <Users size={20} />
            Shared with Me
          </div>
          <div 
            className={`sidebar__item ${activeTab === 'settings' ? 'sidebar__item--active' : ''}`}
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
          >
            <Settings size={20} />
            Settings
          </div>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar__item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard__main dashboard-page">
        {activeTab === 'settings' ? (
          <div className="profile-card">
            <header className="dashboard-page__header">
              <div className="dashboard-page__title-group">
                <h1 className="dashboard-page__title">Profile Settings</h1>
                <p className="dashboard-page__subtitle">Manage your account information and bio.</p>
              </div>
            </header>

            <form onSubmit={handleSubmitProfile} className="profile-form">
              <div className="input-group">
                <label className="input-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className={`input-field ${errors.username ? "input-error" : ""}`}
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.username && <p className="error-text">{errors.username}</p>}
              </div>

              <div className="input-group">
                <label className="input-label">City</label>
                <input
                  type="text"
                  name="city"
                  className={`input-field ${errors.city ? "input-error" : ""}`}
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. New York"
                />
                {errors.city && <p className="error-text">{errors.city}</p>}
              </div>

              <div className="input-group">
                <label className="input-label">Bio</label>
                <textarea
                  name="bio"
                  className={`input-field textarea ${errors.bio ? "input-error" : ""}`}
                  value={values.bio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && <p className="error-text">{errors.bio}</p>}
              </div>

              <div className="input-group">
                <label className="input-label">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  className={`input-field ${errors.dob ? "input-error" : ""}`}
                  value={values.dob}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.dob && <p className="error-text">{errors.dob}</p>}
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={authLoading}>
                {authLoading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <header className="dashboard-page__header">
              <div className="dashboard-page__title-group">
                <h1 className="dashboard-page__title">
                  {activeTab === 'projects' ? 'My Projects' : activeTab === 'overview' ? 'Welcome Back' : 'Shared with Me'}
                </h1>
                <p className="dashboard-page__subtitle">Manage and organize your AI code projects</p>
              </div>
              <button 
                className="project-card__btn project-card__btn--primary"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus size={18} /> Create New Project
              </button>
            </header>

            {projectLoading && projects.length === 0 ? (
                <div className="dashboard-page__loading">
                    <div className="loader"></div>
                </div>
            ) : projects.length === 0 ? (
                <div className="dashboard-page__empty">
                    <div className="dashboard-page__empty-icon">
                        <Folder size={48} strokeWidth={1} />
                    </div>
                    <p className="dashboard-page__empty-text">
                        {activeTab === 'shared' ? 'No projects shared with you.' : 'You haven\'t created any projects yet.'}
                    </p>
                    {activeTab !== 'shared' && (
                        <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                            Start Your First Project
                        </button>
                    )}
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
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </span>
                      </div>
                      <div className="project-card__content">
                          <p className="project-card__description">
                            {project.description || "No description provided."}
                          </p>
                      </div>
                      <div className="project-card__actions">
                          <button 
                            className="project-card__btn project-card__btn--delete"
                            onClick={(e) => openDeleteModal(e, project)}
                          >
                            <Trash2 size={14} />
                          </button>
                          <button className="project-card__btn">
                            <ExternalLink size={14} /> Open
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
        <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Initialize Project</h2>
              <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>
                <X size={20} />
              </button>
            </header>
            <form onSubmit={handleCreateProject} className="modal-form">
              <div className="input-group">
                <label className="input-label mono">PROJECT NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Squadra Core Engine"
                  className="input-field"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="input-group">
                <label className="input-label mono">DESCRIPTION (OPTIONAL)</label>
                <textarea
                  placeholder="What is this project about?"
                  className="input-field textarea"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
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
                <button type="submit" className="btn btn-primary" disabled={projectLoading}>
                  {projectLoading ? "Initializing..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="modal-content modal-content--danger" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Delete Project?</h2>
              <button className="close-btn" onClick={() => setIsDeleteModalOpen(false)}>
                <X size={20} />
              </button>
            </header>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong className="white">"{projectToDelete?.title}"</strong>? 
                This action cannot be undone and all mission data will be permanently erased.
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
    </div>
  );
};

export default Dashboard;

