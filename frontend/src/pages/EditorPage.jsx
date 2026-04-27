import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import useProject from '../hooks/useProject';
import { useMemory } from '../hooks/useMemory';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, FileCode2, TestTube, CheckCircle, Folder, 
  FileJson, Cpu, Database, BrainCircuit, Activity, ChevronRight, ChevronDown, Plus, Save
} from 'lucide-react';

const EditorPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedProject, getProject, updateProject, loading: projectLoading, error: projectError } = useProject();
  const { memories, fetchMemories, loading: memoryLoading } = useMemory();

  // State for Editor
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [expandedFolders, setExpandedFolders] = useState({});
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFilePath, setNewFilePath] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (projectId) {
      getProject(projectId);
      fetchMemories(projectId);
    }
  }, [projectId]);

  // Set first file as active when project loads
  useEffect(() => {
    if (selectedProject?.files?.length > 0 && !activeFile) {
      setActiveFile(selectedProject.files[0]);
      setFileContent(selectedProject.files[0].content || '');
    }
  }, [selectedProject]);

  const handleFileClick = (file) => {
    setActiveFile(file);
    setFileContent(file.content || '');
  };

  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleCreateFile = async (e) => {
    if (e.key === 'Enter') {
      if (!newFilePath.trim()) {
        setIsCreatingFile(false);
        return;
      }
      
      const newFile = { filename: newFilePath, content: '// New File' };
      const currentFiles = selectedProject?.files || [];
      
      if (currentFiles.some(f => f.filename === newFilePath)) {
        toast.error('File already exists');
        return;
      }

      try {
        const updatedFiles = [...currentFiles, newFile];
        await updateProject(projectId, { files: updatedFiles });
        toast.success('File created');
        setIsCreatingFile(false);
        setNewFilePath('');
        setActiveFile(newFile);
        setFileContent('// New File');
        getProject(projectId); // refresh
      } catch (error) {
        toast.error('Failed to create file');
      }
    } else if (e.key === 'Escape') {
      setIsCreatingFile(false);
      setNewFilePath('');
    }
  };

  const handleSaveFile = async () => {
    if (!activeFile) return;
    setIsSaving(true);
    try {
      const updatedFiles = selectedProject.files.map(f => 
        f.filename === activeFile.filename ? { ...f, content: fileContent } : f
      );
      await updateProject(projectId, { files: updatedFiles });
      toast.success('File saved');
      getProject(projectId); // refresh
    } catch (error) {
      toast.error('Failed to save file');
    } finally {
      setIsSaving(false);
    }
  };

  // Convert flat files to tree structure
  const fileTree = useMemo(() => {
    const tree = { name: 'root', type: 'folder', children: {}, path: '' };
    if (!selectedProject?.files) return tree;

    selectedProject.files.forEach(file => {
      const parts = file.filename.split('/');
      let current = tree;
      
      parts.forEach((part, index) => {
        const path = parts.slice(0, index + 1).join('/');
        if (index === parts.length - 1) {
          // It's a file
          current.children[part] = { ...file, name: part, type: 'file', path };
        } else {
          // It's a folder
          if (!current.children[part]) {
            current.children[part] = { name: part, type: 'folder', children: {}, path };
          }
          current = current.children[part];
        }
      });
    });
    return tree;
  }, [selectedProject]);

  const renderTree = (node, depth = 0) => {
    const sortedItems = Object.values(node.children).sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'folder' ? -1 : 1;
    });

    return sortedItems.map((item) => {
      const isExpanded = expandedFolders[item.path];
      const isSelected = activeFile?.filename === item.path;

      if (item.type === 'folder') {
        return (
          <div key={item.path}>
            <div 
              className={`editor-file-tree__item folder ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleFolder(item.path)}
              style={{ paddingLeft: `${depth * 12 + 12}px` }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <Folder size={14} className="icon-folder" />
              <span>{item.name}</span>
            </div>
            {isExpanded && renderTree(item, depth + 1)}
          </div>
        );
      }

      return (
        <div 
          key={item.path}
          className={`editor-file-tree__item file ${isSelected ? 'active' : ''}`}
          onClick={() => handleFileClick(item)}
          style={{ paddingLeft: `${depth * 12 + 24}px` }}
        >
          {item.name.endsWith('.json') ? <FileJson size={14} className="icon-file" /> : <FileCode2 size={14} className="icon-file" />}
          <span>{item.name}</span>
        </div>
      );
    });
  };

  if (projectLoading) {
    return (
      <div className="editor-loader">
        <div className="editor-loader__spinner"></div>
        <p className="editor-loader__text">Loading Project...</p>
      </div>
    );
  }

  if (projectError) {
    return (
      <div className="editor-error">
        <p>Error loading project: {projectError}</p>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const projectTitle = selectedProject?.title || 'Untitled Project';
  const shortId = projectId.substring(0, 8);

  return (
    <div className="editor-layout">
      {/* 1. TOP HEADER BAR */}
      <header className="editor-header">
        <div className="editor-header__left">
          <div className="editor-header__info">
            <h1 className="editor-header__title">{projectTitle}</h1>
            <span className="editor-header__subtitle">ID: {shortId}</span>
          </div>
        </div>
        
        <div className="editor-header__right">
          <button 
            className="editor-btn editor-btn--ghost" 
            onClick={() => navigate(`/editor/${projectId}/tests`)}
          >
            <TestTube size={16} /> Generate Tests
          </button>
          <button 
            className="editor-btn editor-btn--ghost" 
            onClick={() => navigate(`/editor/${projectId}/review`)}
          >
            <CheckCircle size={16} /> Review Code
          </button>
          <button 
            className="editor-btn editor-btn--primary" 
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </header>

      <div className="editor-workspace">
        {/* 2. LEFT SIDEBAR */}
        <aside className="editor-sidebar editor-sidebar--left">
          <div className="editor-sidebar__section explorer">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="editor-sidebar__title" style={{ margin: 0 }}>EXPLORER</h3>
              <button 
                className="editor-btn editor-btn--ghost" 
                style={{ padding: '4px' }}
                onClick={() => setIsCreatingFile(true)}
                title="New File"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="editor-file-tree-container">
              {isCreatingFile && (
                <div style={{ padding: '0 12px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    onKeyDown={handleCreateFile}
                    onBlur={() => setIsCreatingFile(false)}
                    placeholder="filename (e.g. src/app.js)"
                    autoFocus
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--primary-color)',
                      color: 'var(--text-light)',
                      padding: '4px 8px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      outline: 'none'
                    }}
                  />
                </div>
              )}
              {renderTree(fileTree)}
              {!selectedProject?.files?.length && !isCreatingFile && (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  No files in project. Click + to create one.
                </div>
              )}
            </div>
          </div>

          <div className="editor-sidebar__section">
            <h3 className="editor-sidebar__title">DECISION MEMORY</h3>
            {memoryLoading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Loading memory...</p>
            ) : memories.length > 0 ? (
              <ul className="editor-memory-list">
                {memories.map((mem, index) => (
                  <li key={mem._id || index} className="editor-memory-list__item">
                    <span className="bullet"></span> {mem.title || mem.decision || "Memory recorded"}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', padding: '0 1rem' }}>No decisions recorded yet.</p>
            )}
          </div>
        </aside>

        {/* 3. CENTER MAIN AREA */}
        <main className="editor-main">
          <div className="editor-main__header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            {activeFile ? (
              <div className="editor-tab active">
                {activeFile.filename.endsWith('.json') ? <FileJson size={14} /> : <FileCode2 size={14} />}
                <span>{activeFile.filename}</span>
              </div>
            ) : (
              <div className="editor-tab active">
                <Activity size={14} />
                <span>No file selected</span>
              </div>
            )}
            
            {activeFile && (
              <button 
                className="editor-btn editor-btn--ghost" 
                onClick={handleSaveFile}
                disabled={isSaving}
                style={{ alignSelf: 'center', marginRight: '16px', padding: '4px 12px' }}
              >
                {isSaving ? <span className="editor-loader__spinner" style={{ width: 12, height: 12, marginRight: 8, display: 'inline-block' }}></span> : <Save size={14} style={{ marginRight: '8px' }} />}
                Save
              </button>
            )}
          </div>
          <div className="editor-code-panel">
            {activeFile ? (
              <Editor
                height="100%"
                defaultLanguage={activeFile.filename.split('.').pop() === 'jsx' ? 'javascript' : activeFile.filename.split('.').pop()}
                value={fileContent}
                theme="vs-dark"
                onChange={(value) => setFileContent(value)}
                options={{
                  fontSize: 14,
                  minimap: { enabled: true },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              />
            ) : (
              <div className="editor-empty-state">
                <div className="empty-content">
                  <FileCode2 size={48} />
                  <p>Select a file to start editing</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 4. RIGHT SIDEBAR (AI TOOLS PANEL) */}
        <aside className="editor-sidebar editor-sidebar--right">
          <div className="editor-sidebar__section">
            <h3 className="editor-sidebar__title">AI TOOLS</h3>
            <div className="editor-tools-grid">
              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/intent`)}
              >
                <Activity size={20} />
                <span>Intent Mode</span>
              </button>
              
              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/explain-ai`)}
              >
                <Cpu size={20} />
                <span>Architecture Graph</span>
              </button>
              
              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/schema`)}
              >
                <Database size={20} />
                <span>DB Schema</span>
              </button>
              
              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/memory`)}
              >
                <BrainCircuit size={20} />
                <span>Memory</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EditorPage;
