import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Plus } from 'lucide-react';
import { useMemory } from '../hooks/useMemory';

const EditorMemory = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { memories, fetchMemories, createMemory, loading } = useMemory();
  const [title, setTitle] = useState('');
  const [decision, setDecision] = useState('');
  const [filePath, setFilePath] = useState('Global');

  useEffect(() => {
    fetchMemories(projectId);
  }, [projectId]);

  const handleAddMemory = async () => {
    if (!title.trim() || !decision.trim() || !filePath.trim()) return;
    try {
      await createMemory(projectId, { 
        title, 
        description: decision, 
        filePath: filePath 
      });
      setTitle('');
      setDecision('');
      setFilePath('Global');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="editor-layout" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-btn editor-btn--ghost" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__title" style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BrainCircuit size={18} /> Project Memory
          </div>
        </div>
      </header>
      
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '2rem', gap: '2rem' }}>
        {/* Left Side: Add Memory Form */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid var(--border-color)', paddingRight: '2rem' }}>
          <h3 style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>Record a Decision</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Decision Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g., "Switched to React Flow"'
              style={{
                backgroundColor: 'var(--bg-darker)',
                color: 'var(--text-light)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Related File Path</label>
            <input
              type="text"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder='e.g., "src/components/Graph.jsx" or "Global"'
              style={{
                backgroundColor: 'var(--bg-darker)',
                color: 'var(--text-light)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <label style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Reason / Context (Description)</label>
            <textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder='Explain why this decision was made...'
              style={{
                flex: 1,
                backgroundColor: 'var(--bg-darker)',
                color: 'var(--text-light)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1rem',
                fontFamily: 'Inter, sans-serif',
                resize: 'none'
              }}
            />
          </div>

          <button 
            className="editor-btn editor-btn--primary" 
            onClick={handleAddMemory}
            disabled={loading || !title.trim() || !decision.trim() || !filePath.trim()}
            style={{ alignSelf: 'flex-start', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading ? <span className="editor-loader__spinner" style={{ width: 16, height: 16, display: 'inline-block' }}></span> : <Plus size={16} />}
            {loading ? 'Adding...' : 'Add Memory'}
          </button>
        </div>

        {/* Right Side: Timeline */}
        <div style={{ flex: 2, overflowY: 'auto', paddingRight: '1rem' }}>
          <h3 style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>Decision Timeline</h3>
          {loading && memories.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading timeline...</p>
          ) : memories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {memories.map((mem, index) => (
                <div key={mem._id || index} style={{ 
                  backgroundColor: 'var(--bg-darker)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '8px', 
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <h4 style={{ color: 'var(--primary-color)', fontSize: '1.1rem', margin: 0 }}>{mem.title || 'Decision Recorded'}</h4>
                      <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{mem.filePath}</code>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {mem.createdAt ? new Date(mem.createdAt).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                    {mem.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              backgroundColor: 'var(--bg-darker)', 
              border: '1px dashed var(--border-color)', 
              borderRadius: '8px', 
              padding: '3rem',
              textAlign: 'center',
              color: 'var(--text-muted)'
            }}>
              No decisions have been recorded yet. Start building your project memory!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorMemory;
