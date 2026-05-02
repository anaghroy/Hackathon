import React from 'react';
import { Folder, Plus, GitCompare, Trash2, ExternalLink } from 'lucide-react';

const DashboardProjects = ({ 
  projects, 
  projectLoading, 
  navigate, 
  setIsCreateModalOpen, 
  openDeleteModal 
}) => {
  return (
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
  );
};

export default DashboardProjects;
