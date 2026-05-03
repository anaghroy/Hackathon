import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import { useAuth } from '../hooks/useAuth';
import { 
  Users, ArrowLeft, ExternalLink, 
  Search, Clock, User, Share2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProjectCard = ({ project, navigate, isOwner }) => {
  return (
    <div 
      className="shared-card"
      onClick={() => navigate(`/editor/${project._id}`)}
    >
      <div className="shared-card__header">
        <h3 className="shared-card__title">{project.title}</h3>
        <div className="shared-card__owner">
          {isOwner ? (
            <div className="shared-card__collaborators">
              <Share2 size={12} />
              <span>Shared with {project.collaborators?.length || 0} users</span>
            </div>
          ) : (
            <>
              <User size={12} />
              <span>{project.user?.username || 'Unknown Owner'}</span>
            </>
          )}
        </div>
      </div>
      
      <p className="shared-card__description">
        {project.description || "No description provided."}
      </p>
      
      {isOwner && project.collaborators?.length > 0 && (
        <div className="shared-card__collab-list">
          {project.collaborators.slice(0, 3).map(c => (
            <span key={c.user?._id} className="collab-badge" title={c.user?.email}>
              {c.user?.username || c.user?.email?.split('@')[0]}
            </span>
          ))}
          {project.collaborators.length > 3 && (
            <span className="collab-badge collab-badge--more">
              +{project.collaborators.length - 3} more
            </span>
          )}
        </div>
      )}
      
      <div className="shared-card__footer">
        <span className="shared-card__date">
          {isOwner ? "Shared on " : "Shared "} {new Date(project.updatedAt || project.createdAt || Date.now()).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </span>
        <button className="shared-card__open">
          <ExternalLink size={14} />
          Open
        </button>
      </div>
    </div>
  );
};

const SharedProjects = ({ onBack }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { fetchSharedProjects, loading } = useProject();
  const [sharedProjects, setSharedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadSharedProjects();
  }, []);

  const loadSharedProjects = async () => {
    try {
      const projects = await fetchSharedProjects();
      setSharedProjects(projects);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load shared projects");
    }
  };

  const filteredProjects = sharedProjects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.collaborators?.some(c => c.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sharedWithMe = filteredProjects.filter(p => p.user?._id !== currentUser?.id && p.user?._id !== currentUser?._id);
  const sharedByMe = filteredProjects.filter(p => p.user?._id === currentUser?.id || p.user?._id === currentUser?._id);

  if (loading && sharedProjects.length === 0) {
    return (
      <div className="shared-projects__loading">
        <div className="loader-icon animate-spin">
          <Clock size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="shared-projects">
      <div className="shared-projects__container">
        {/* Header */}
        <header className="shared-projects__header">
          <div className="shared-projects__title-group">
            <button onClick={onBack || (() => navigate('/dashboard'))} className="shared-projects__back-btn">
              <ArrowLeft size={20} />
            </button>
            <h1 className="shared-projects__title">Shared Projects</h1>
          </div>
          
          <div className="shared-projects__controls">
            <div className="shared-projects__search">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search projects or owners..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {filteredProjects.length === 0 ? (
          <div className="shared-projects__empty">
            <Users size={48} strokeWidth={1} />
            <h3>No Shared Projects</h3>
            <p>Projects you share or others share with you will appear here.</p>
            <button onClick={onBack || (() => navigate('/dashboard'))} className="btn btn-primary">
              Back to My Projects
            </button>
          </div>
        ) : (
          <div className="shared-projects__sections">
            {sharedWithMe.length > 0 && (
              <section className="shared-projects__section">
                <h2 className="section-title">Shared with Me</h2>
                <div className="shared-projects__grid">
                  {sharedWithMe.map((project) => (
                    <ProjectCard key={project._id} project={project} navigate={navigate} isOwner={false} />
                  ))}
                </div>
              </section>
            )}

            {sharedByMe.length > 0 && (
              <section className="shared-projects__section">
                <h2 className="section-title">Shared by Me</h2>
                <div className="shared-projects__grid">
                  {sharedByMe.map((project) => (
                    <ProjectCard key={project._id} project={project} navigate={navigate} isOwner={true} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedProjects;
