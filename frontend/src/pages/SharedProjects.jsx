import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
import { 
  Users, ArrowLeft, ExternalLink, 
  Search, Clock, User
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const SharedProjects = ({ onBack }) => {
  const navigate = useNavigate();
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
    project.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <h1 className="shared-projects__title">Shared with Me</h1>
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
            <p>Projects that others share with you will appear here.</p>
            <button onClick={onBack || (() => navigate('/dashboard'))} className="btn btn-primary">
              Back to My Projects
            </button>
          </div>
        ) : (
          <div className="shared-projects__grid">
            {filteredProjects.map((project) => (
              <div 
                key={project._id} 
                className="shared-card"
                onClick={() => navigate(`/editor/${project._id}`)}
              >
                <div className="shared-card__header">
                  <h3 className="shared-card__title">{project.title}</h3>
                  <div className="shared-card__owner">
                    <User size={12} />
                    <span>{project.user?.username || 'Unknown Owner'}</span>
                  </div>
                </div>
                
                <p className="shared-card__description">
                  {project.description || "No description provided."}
                </p>
                
                <div className="shared-card__footer">
                  <span className="shared-card__date">
                    Shared {new Date(project.updatedAt || project.createdAt || Date.now()).toLocaleDateString('en-US', {
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedProjects;
