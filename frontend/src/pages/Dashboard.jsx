import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useProject from "../hooks/useProject";
import useForm from "../hooks/useForm";
import { authValidator } from "../utils/validators";
import { Plus, Folder, Users, Settings, LogOut, Search, Trash2, ExternalLink, X, Layout, GitCompare, Menu } from "lucide-react";
import toast from "react-hot-toast";
import brandLogo from "../assets/Brand logo.png";
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-tab">
            <header className="dashboard-page__header">
              <div className="dashboard-page__title-group">
                <h1 className="dashboard-page__title" style={{ fontSize: '1.25rem' }}>CogniCode Documentation</h1>
                <p className="dashboard-page__subtitle" style={{ fontSize: '0.8125rem' }}>Platform Overview and Capabilities</p>
              </div>
            </header>
            
            <div className="overview-docs" style={{ maxWidth: '768px', paddingTop: '1rem', paddingBottom: '4rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              <section>
                <h2 style={{ fontSize: '1rem', color: '#fff', fontWeight: '600', marginBottom: '0.75rem' }}>Platform Overview</h2>
                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.7', margin: 0 }}>
                  CogniCode is a premium, intelligent engineering environment bridging the gap between AI-assisted development and robust infrastructure management. Explore the modules below to understand the full capabilities available within your workspace.
                </p>
              </section>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0' }} />

              <section>
                <h2 style={{ fontSize: '1rem', color: '#fff', fontWeight: '600', marginBottom: '1.25rem' }}>Core Modules</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#e4e4e7', fontWeight: '500', marginBottom: '0.375rem' }}>Smart Dashboard</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', margin: 0 }}>
                      Your central command center. Provides immediate project control, rapid workspace access, and intuitive quick-action navigation.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#e4e4e7', fontWeight: '500', marginBottom: '0.375rem' }}>Project Management</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', margin: 0 }}>
                      Create, organize, and seamlessly update multiple independent coding projects within securely isolated application states.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#e4e4e7', fontWeight: '500', marginBottom: '0.375rem' }}>Code Review System</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', margin: 0 }}>
                      Intelligently audit generated code. Improve base quality, detect hidden vulnerabilities, and receive automated optimization guidance.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#e4e4e7', fontWeight: '500', marginBottom: '0.375rem' }}>Graph & Analytics</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', margin: 0 }}>
                      Visualize architecture and monitor performance. Gain deep insights into your progress, statistics, and system relationships over time.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#e4e4e7', fontWeight: '500', marginBottom: '0.375rem' }}>Deployment Module</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', margin: 0 }}>
                      Streamline release pipelines. Manage build configurations, automated deployment workflows, and secure production launch controls.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#e4e4e7', fontWeight: '500', marginBottom: '0.375rem' }}>Shared Workspace</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', margin: 0 }}>
                      Scale your team-based productivity. Securely share project access and align distributed engineering efforts seamlessly.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#e4e4e7', fontWeight: '500', marginBottom: '0.375rem' }}>Settings & Configuration</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', margin: 0 }}>
                      Customize your development experience. Manage workspace preferences, strict account controls, and platform aesthetics.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#e4e4e7', fontWeight: '500', marginBottom: '0.375rem' }}>DevOps Integration</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', margin: 0 }}>
                      Build scalable infrastructure. Support robust CI/CD style processes and complex automation workflows out-of-the-box.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#e4e4e7', fontWeight: '500', marginBottom: '0.375rem' }}>AI Productivity Tools</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', margin: 0 }}>
                      Accelerate development cycles with smart assistance. Leverage intelligent agents to automate boilerplate and maximize coding efficiency.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '0.875rem', color: '#e4e4e7', fontWeight: '500', marginBottom: '0.375rem' }}>Security & Reliability</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6', margin: 0 }}>
                      Ensure safe project handling at every layer. Experience stable workflows backed by an organized, enterprise-grade infrastructure.
                    </p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        );
      case 'projects':
        return (
          <div className="projects-tab">
            <header className="dashboard-page__header">
              <div className="dashboard-page__title-group">
                <h1 className="dashboard-page__title">My Projects</h1>
                <p className="dashboard-page__subtitle">Manage and organize your AI code projects</p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="project-card__btn project-card__btn--ghost"
                  onClick={() => navigate('/connect-repo')}
                  style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '0 16px' }}
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
                <div className="dashboard-page__empty">
                    <div className="dashboard-page__empty-icon">
                        <Folder size={48} strokeWidth={1} />
                    </div>
                    <p className="dashboard-page__empty-text">You haven't created any projects yet.</p>
                    <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)}>
                        Start Your First Project
                    </button>
                </div>
            ) : (
                <div className="dashboard-page__grid">
                {projects.map((project) => {
                    const words = project.title.split(" ");
                    const truncatedTitle = words.length > 2 ? words.slice(0, 2).join(" ") + "..." : project.title;
                    
                    return (
                    <div 
                      key={project._id} 
                      className="project-card"
                      onClick={() => navigate(`/editor/${project._id}`)}
                    >
                      <div className="project-card__header">
                          <h3 className="project-card__title" title={project.title}>{truncatedTitle}</h3>
                          <span className="project-card__date">
                            {new Date(project.updatedAt || project.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
                )})}
                </div>
            )}
          </div>
        );
      case 'shared':
        return (
          <div className="shared-tab">
            <header className="dashboard-page__header">
              <div className="dashboard-page__title-group">
                <h1 className="dashboard-page__title">Shared with Me</h1>
                <p className="dashboard-page__subtitle">Projects shared with your account</p>
              </div>
            </header>
            <div className="dashboard-page__empty" style={{ border: 'none', background: 'transparent' }}>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="settings-tab">
            <header className="dashboard-page__header">
              <div className="dashboard-page__title-group">
                <h1 className="dashboard-page__title">Settings</h1>
                <p className="dashboard-page__subtitle">Configure your platform preferences</p>
              </div>
            </header>
            <div className="dashboard-page__empty" style={{ border: 'none', background: 'transparent' }}>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {/* Top Navbar */}
      <header className="dashboard__nav navbar">
        <div className="navbar__left">

          <div className="navbar__brand" onClick={() => navigate("/dashboard")} style={{ cursor: 'pointer' }}>
            <div className="navbar__brand-logo">
              <img src={brandLogo} alt="CogniCode Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <span className="navbar__brand-text">CogniCode</span>
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
          <button className="hamburger" onClick={toggleSidebar} aria-label="Toggle sidebar">
            <Menu size={20} />
          </button>
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
          <div 
            className={`sidebar__item ${activeTab === 'deployments' ? 'sidebar__item--active' : ''}`}
            onClick={() => { navigate('/connect-repo'); setIsSidebarOpen(false); }}
          >
            <GitCompare size={20} />
            Deployments
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
        {renderTabContent()}
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
                  placeholder="e.g. CogniCode Core Engine"
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
