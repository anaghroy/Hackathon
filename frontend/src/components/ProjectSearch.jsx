import React, { useState, useMemo } from 'react';
import { Search, Info, Bug, AlertCircle, ChevronRight } from 'lucide-react';

const ProjectSearch = ({ projects, onProjectClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDebugMode, setIsDebugMode] = useState(false);

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  // AI "Debugging" / Diagnostic Function
  const getSearchDiagnostic = () => {
    if (!searchTerm.trim()) return null;
    
    const diagnostics = [];
    
    if (filteredProjects.length === 0) {
      diagnostics.push({
        type: 'info',
        message: `No exact matches for "${searchTerm}".`,
        suggestion: 'Try searching for keywords like "API", "Frontend", or "Database".'
      });

      // Simple fuzzy logic for "debug" help
      const similar = projects.find(p => 
        p.title.toLowerCase().includes(searchTerm.substring(0, 3).toLowerCase())
      );
      if (similar) {
        diagnostics.push({
          type: 'debug',
          message: `Found similar project: "${similar.title}".`,
          suggestion: 'Is this what you were looking for?'
        });
      }
    } else {
      diagnostics.push({
        type: 'success',
        message: `Found ${filteredProjects.length} matching projects.`,
        suggestion: 'Click on a project to open it in the AI Editor.'
      });
    }

    return diagnostics;
  };

  const diagnostics = getSearchDiagnostic();

  return (
    <div className="project-search-container" style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
      <div className="search-bar">
        <div className="search-bar__icon">
          <Search size={16} />
        </div>
        <input
          type="text"
          className="search-bar__input"
          placeholder="Search projects or debug queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className={`search-debug-toggle ${isDebugMode ? 'active' : ''}`}
          onClick={() => setIsDebugMode(!isDebugMode)}
          title="Toggle Search Debugger"
          style={{
            background: 'transparent',
            border: 'none',
            color: isDebugMode ? '#3b82f6' : 'rgba(255,255,255,0.2)',
            padding: '0 12px',
            cursor: 'pointer',
            transition: 'color 0.2s'
          }}
        >
          <Bug size={14} />
        </button>
      </div>

      {/* Search Results Dropdown */}
      {searchTerm.trim() && (
        <div className="search-results-dropdown" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#0f0f0f',
          border: '1px solid rgba(255,255,255,0.1)',
          marginTop: '8px',
          zIndex: 1000,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {/* Debug Panel */}
          {isDebugMode && diagnostics && (
            <div className="search-debug-panel" style={{
              padding: '12px',
              background: 'rgba(59, 130, 246, 0.05)',
              borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '8px', fontWeight: 'bold' }}>
                <Bug size={12} /> SEARCH DIAGNOSTICS
              </div>
              {diagnostics.map((d, i) => (
                <div key={i} style={{ marginBottom: '6px', color: 'rgba(255,255,255,0.7)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {d.type === 'debug' ? <Info size={10} color="#3b82f6" /> : <AlertCircle size={10} color="#f59e0b" />}
                    <span>{d.message}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginLeft: '16px' }}>{d.suggestion}</div>
                </div>
              ))}
            </div>
          )}

          {/* Results List */}
          <div className="search-results-list">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div 
                  key={project._id} 
                  className="search-result-item"
                  onClick={() => {
                    onProjectClick(project._id);
                    setSearchTerm('');
                  }}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div>
                    <div style={{ fontWeight: '500', color: '#fff', fontSize: '14px' }}>{project.title}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      {project.description || 'No description'}
                    </div>
                  </div>
                  <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
                </div>
              ))
            ) : !isDebugMode && (
              <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                No projects found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSearch;
