import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import useProject from '../hooks/useProject';
import { useMemory } from '../hooks/useMemory';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, FileCode2, TestTube, CheckCircle, Folder, FolderOpen,
  FileJson, Cpu, Database, BrainCircuit, Activity, ChevronRight, ChevronDown, Plus, Save,
  FilePlus, FolderPlus, Trash2, X, Check, FileText, Image as ImageIcon, FileCode, Hash, Info, Settings,
  Type, ShieldAlert, Rocket, Lock, Terminal, History, Users, Share2
} from 'lucide-react';

const EditorPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { selectedProject, getProject, updateProject, addCollaborator, fetchRecentCollaborators, loading: projectLoading, error: projectError } = useProject();
  const { memories, fetchMemories, loading: memoryLoading } = useMemory();

  // State for Editor
  const [activeFile, setActiveFile] = useState(null);
  const [openTabs, setOpenTabs] = useState([]); // Array of file objects
  const [modifiedContents, setModifiedContents] = useState({}); // { [filename]: content }
  const [expandedFolders, setExpandedFolders] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = React.useRef(null);

  // State for Sharing
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [collaboratorEmail, setCollaboratorEmail] = useState("");
  const [collaboratorRole, setCollaboratorRole] = useState("viewer");
  const [recentCollaborators, setRecentCollaborators] = useState([]);
  const [isSharing, setIsSharing] = useState(false);

  // State for Explorer
  const [selectedPath, setSelectedPath] = useState(null); 
  const [selectedType, setSelectedType] = useState(null); 
  const [creationType, setCreationType] = useState(null); 
  const [newItemName, setNewItemName] = useState('');

  // Helper to get file icon
  const getFileIcon = (filename, size = 14) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return <FileCode2 size={size} className="icon-js" style={{ color: '#f7df1e' }} />;
      case 'ts':
      case 'tsx':
        return <FileCode size={size} className="icon-ts" style={{ color: '#3178c6' }} />;
      case 'css':
      case 'scss':
        return <Hash size={size} className="icon-css" style={{ color: '#264de4' }} />;
      case 'html':
        return <FileCode2 size={size} className="icon-html" style={{ color: '#e34c26' }} />;
      case 'json':
        return <FileJson size={size} className="icon-json" style={{ color: '#fbc02d' }} />;
      case 'md':
        return <Info size={size} className="icon-md" style={{ color: '#0366d6' }} />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'svg':
      case 'gif':
        return <ImageIcon size={size} className="icon-img" style={{ color: '#4caf50' }} />;
      default:
        return <FileText size={size} className="icon-file" style={{ color: '#8b9eb7' }} />;
    }
  };

  useEffect(() => {
    if (projectId) {
      getProject(projectId);
      fetchMemories(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (isShareModalOpen) {
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
  }, [isShareModalOpen]);

  // Set first file as active when project loads
  useEffect(() => {
    if (selectedProject?.files?.length > 0 && openTabs.length === 0) {
      const firstFile = selectedProject.files[0];
      setOpenTabs([firstFile]);
      setActiveFile(firstFile);
      setModifiedContents({ [firstFile.filename]: firstFile.content || '' });
    }
  }, [selectedProject]);

  const handleFileClick = (file) => {
    setSelectedPath(file.filename);
    setSelectedType('file');
    
    // Add to tabs if not already open
    if (!openTabs.find(t => t.filename === file.filename)) {
      setOpenTabs(prev => [...prev, file]);
    }
    
    // Switch active file
    setActiveFile(file);
    
    // Initialize modified content if not already there
    if (modifiedContents[file.filename] === undefined) {
      setModifiedContents(prev => ({
        ...prev,
        [file.filename]: file.content || ''
      }));
    }
  };

  const handleCloseTab = (e, filename) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t.filename !== filename);
    setOpenTabs(newTabs);

    // If closing the active tab
    if (activeFile?.filename === filename) {
      if (newTabs.length > 0) {
        const lastTab = newTabs[newTabs.length - 1];
        setActiveFile(lastTab);
        setSelectedPath(lastTab.filename);
      } else {
        setActiveFile(null);
        setSelectedPath(null);
      }
    }

    // Clean up modified content if not unsaved? 
    // Actually VS Code keeps them in memory for a bit but for simplicity:
    // Only remove if it matches original content? 
    // Let's just keep it for now to avoid losing work if user reopens.
  };

  const handleEditorChange = (value) => {
    if (!activeFile) return;
    setModifiedContents(prev => ({
      ...prev,
      [activeFile.filename]: value
    }));
  };

  const handleFolderClick = (path) => {
    setSelectedPath(path);
    setSelectedType('folder');
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    // Format on initial mount if it's a js/ts file
    if (activeFile && (activeFile.filename.endsWith('.js') || activeFile.filename.endsWith('.jsx'))) {
      setTimeout(() => {
        editor.getAction('editor.action.formatDocument')?.run();
      }, 300);
    }
  };

  useEffect(() => {
    if (activeFile && editorRef.current) {
      const ext = activeFile.filename.split('.').pop().toLowerCase();
      if (['js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css'].includes(ext)) {
        setTimeout(() => {
          editorRef.current?.getAction('editor.action.formatDocument')?.run();
        }, 300);
      }
    }
  }, [activeFile]);

  const isImageFile = (filename) => {
    if (!filename) return false;
    const ext = filename.split('.').pop().toLowerCase();
    return ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp', 'ico'].includes(ext);
  };

  const getImageUrl = (file) => {
    if (file.content && file.content.startsWith('data:image/')) {
      return file.content;
    }
    if (selectedProject?.repoName) {
      return `https://raw.githubusercontent.com/${selectedProject.repoName}/${selectedProject.branch || 'main'}/${file.filename}`;
    }
    return '';
  };

  const getLanguageFromFilename = (filename) => {
    if (!filename) return 'plaintext';
    const ext = filename.split('.').pop().toLowerCase();
    const map = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      html: 'html',
      css: 'css',
      scss: 'scss',
      json: 'json',
      md: 'markdown',
      sql: 'sql',
      py: 'python',
      rb: 'ruby',
      php: 'php',
      go: 'go',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      sh: 'shell',
      yml: 'yaml',
      yaml: 'yaml',
      xml: 'xml'
    };
    return map[ext] || 'plaintext';
  };

  const toggleFolder = (path) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleCreateItem = async (e) => {
    if (e.key === 'Enter') {
      if (!newItemName.trim()) {
        setCreationType(null);
        return;
      }

      let parentPath = '';
      if (selectedPath) {
        if (selectedType === 'folder') {
          parentPath = selectedPath;
        } else {
          // If file selected, use its parent
          const parts = selectedPath.split('/');
          if (parts.length > 1) {
            parentPath = parts.slice(0, -1).join('/');
          }
        }
      }

      const fullPath = parentPath ? `${parentPath}/${newItemName}` : newItemName;
      const currentFiles = selectedProject?.files || [];

      if (creationType === 'file') {
        if (currentFiles.some(f => f.filename === fullPath)) {
          toast.error('File already exists');
          return;
        }

        const newFile = { filename: fullPath, content: '// New File' };
        try {
          const updatedFiles = [...currentFiles, newFile];
          await updateProject(projectId, { files: updatedFiles });
          toast.success('File created');
          setCreationType(null);
          setNewItemName('');
          handleFileClick(newFile);
          getProject(projectId);
        } catch (error) {
          toast.error('Failed to create file');
        }
      } else {
        // Folder creation - add a .keep file to persist the folder
        const keepFilePath = `${fullPath}/.keep`;
        if (currentFiles.some(f => f.filename.startsWith(fullPath))) {
          toast.error('Folder already exists');
          return;
        }

        try {
          const updatedFiles = [...currentFiles, { filename: keepFilePath, content: '' }];
          await updateProject(projectId, { files: updatedFiles });
          toast.success('Folder created');
          setCreationType(null);
          setNewItemName('');
          setExpandedFolders(prev => ({ ...prev, [fullPath]: true }));
          setSelectedPath(fullPath);
          setSelectedType('folder');
          getProject(projectId);
        } catch (error) {
          toast.error('Failed to create folder');
        }
      }
    } else if (e.key === 'Escape') {
      setCreationType(null);
      setNewItemName('');
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedPath || selectedType !== 'folder') return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete the folder "${selectedPath}" and all its contents?`);
    if (!confirmDelete) return;

    try {
      const currentFiles = selectedProject?.files || [];
      const updatedFiles = currentFiles.filter(f => !f.filename.startsWith(`${selectedPath}/`) && f.filename !== selectedPath);
      
      await updateProject(projectId, { files: updatedFiles });
      toast.success('Folder deleted');
      setSelectedPath(null);
      setSelectedType(null);
      
      // If active file was in the deleted folder, clear it
      if (activeFile && (activeFile.filename.startsWith(`${selectedPath}/`) || activeFile.filename === selectedPath)) {
        setActiveFile(null);
        setFileContent('');
      }
      
      getProject(projectId);
    } catch (error) {
      toast.error('Failed to delete folder');
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!collaboratorEmail) return toast.error("Email is required");
    
    setIsSharing(true);
    try {
      await addCollaborator(projectId, { 
        email: collaboratorEmail, 
        role: collaboratorRole 
      });
      toast.success("Collaborator added successfully!");
      setCollaboratorEmail("");
      setIsShareModalOpen(false);
      // Refresh project to show new collaborators
      getProject(projectId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add collaborator");
    } finally {
      setIsSharing(false);
    }
  };

  const handleSaveFile = async () => {
    if (!activeFile) return;
    setIsSaving(true);
    try {
      const currentContent = modifiedContents[activeFile.filename];
      const updatedFiles = selectedProject.files.map(f => 
        f.filename === activeFile.filename ? { ...f, content: currentContent } : f
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

    const items = sortedItems.map((item) => {
      if (item.name === '.keep' && item.type === 'file') return null;

      const isExpanded = expandedFolders[item.path];
      const isSelected = selectedPath === item.path;

      if (item.type === 'folder') {
        let showInputUnderThis = false;
        if (creationType) {
          if (selectedPath === item.path) {
            showInputUnderThis = true;
          } else if (selectedType === 'file' && selectedPath.startsWith(item.path + '/')) {
            // Check if this is the immediate parent
            const relativePath = selectedPath.replace(item.path + '/', '');
            if (!relativePath.includes('/')) {
              showInputUnderThis = true;
            }
          }
        }
        
        return (
          <div key={item.path}>
            <div 
              className={`editor-file-tree__item folder ${isExpanded ? 'expanded' : ''} ${isSelected ? 'active' : ''}`}
              onClick={() => handleFolderClick(item.path)}
              style={{ paddingLeft: `${depth * 16 + 12}px` }}
            >
              <div className="chevron">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
              {isExpanded ? (
                <FolderOpen size={16} className="icon-folder" style={{ color: '#e2b340' }} />
              ) : (
                <Folder size={16} className="icon-folder" style={{ color: '#e2b340' }} />
              )}
              <span style={{ marginLeft: '4px' }}>{item.name}</span>
            </div>
            {isExpanded && (
              <>
                {showInputUnderThis && (
                  <div className="explorer-input-container" style={{ paddingLeft: `${(depth + 1) * 16 + 12}px` }}>
                    <div className="icon">
                      {creationType === 'file' ? getFileIcon('new.file', 14) : <Folder size={14} className="icon-folder" style={{ color: '#e2b340' }} />}
                    </div>
                    <input
                      autoFocus
                      placeholder={`New ${creationType}...`}
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyDown={handleCreateItem}
                      onBlur={() => {
                        if (!newItemName) setCreationType(null);
                      }}
                    />
                  </div>
                )}
                {renderTree(item, depth + 1)}
              </>
            )}
          </div>
        );
      }

      return (
        <div 
          key={item.path}
          className={`editor-file-tree__item file ${isSelected ? 'active' : ''}`}
          onClick={() => handleFileClick(item)}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          <div className="chevron" style={{ width: 16 }}></div>
          {getFileIcon(item.name, 16)}
          <span style={{ marginLeft: '4px' }}>{item.name}</span>
        </div>
      );
    });

    return (
      <>
        {depth === 0 && creationType && (!selectedPath || (selectedType === 'file' && !selectedPath.includes('/'))) && (
          <div className="explorer-input-container" style={{ paddingLeft: '16px', marginBottom: '4px' }}>
            <div className="icon">
              {creationType === 'file' ? getFileIcon('new.file', 14) : <Folder size={14} className="icon-folder" style={{ color: '#e2b340' }} />}
            </div>
            <input
              autoFocus
              placeholder={`New ${creationType}...`}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={handleCreateItem}
              onBlur={() => {
                if (!newItemName) setCreationType(null);
              }}
            />
          </div>
        )}
        {items}
      </>
    );
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
            <h1 className="editor-header__title" title={projectTitle}>{projectTitle}</h1>
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
            className="editor-btn editor-btn--ghost" 
            onClick={() => navigate(`/editor/${projectId}/security`)}
          >
            <ShieldAlert size={16} /> Security Fixer
          </button>
          <button 
            className="editor-btn editor-btn--ghost" 
            onClick={() => navigate(`/editor/${projectId}/history`)}
          >
            <History size={16} /> History
          </button>
          <button 
            className="editor-btn editor-btn--ghost" 
            onClick={() => navigate(`/editor/${projectId}/logs`)}
          >
            <Terminal size={16} /> Logs
          </button>
          <button 
            className="editor-btn editor-btn--ghost" 
            onClick={() => navigate(`/editor/${projectId}/performance`)}
          >
            <Activity size={16} /> Profiler
          </button>
          <button 
            className="editor-btn editor-btn--ghost" 
            onClick={() => navigate(`/editor/${projectId}/debugger`)}
          >
            <History size={16} /> Debugger
          </button>
          <button 
            className="editor-btn editor-btn--ghost" 
            onClick={() => navigate(`/editor/${projectId}/env`)}
          >
            <Lock size={16} /> Secrets
          </button>
          <button 
            className="editor-btn editor-btn--ghost" 
            onClick={() => setIsShareModalOpen(true)}
          >
            <Share2 size={16} /> Share
          </button>
          <button 
            className="editor-btn editor-btn--primary" 
            onClick={() => navigate(`/editor/${projectId}/deploy`)}
            style={{ background: '#3b82f6', color: '#fff' }}
          >
            <Rocket size={16} /> Deploy
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
            <div className="editor-sidebar__header">
              <h3 className="editor-sidebar__title">EXPLORER</h3>
              <div className="actions">
                <button 
                  className="explorer-action-btn" 
                  onClick={() => {
                    setCreationType('file');
                    if (selectedType === 'folder' && selectedPath) {
                      setExpandedFolders(prev => ({ ...prev, [selectedPath]: true }));
                    } else if (selectedType === 'file' && selectedPath.includes('/')) {
                      const parent = selectedPath.split('/').slice(0, -1).join('/');
                      setExpandedFolders(prev => ({ ...prev, [parent]: true }));
                    }
                  }}
                  title="New File"
                >
                  <FilePlus size={14} />
                </button>
                <button 
                  className="explorer-action-btn" 
                  onClick={() => {
                    setCreationType('folder');
                    if (selectedType === 'folder' && selectedPath) {
                      setExpandedFolders(prev => ({ ...prev, [selectedPath]: true }));
                    } else if (selectedType === 'file' && selectedPath.includes('/')) {
                      const parent = selectedPath.split('/').slice(0, -1).join('/');
                      setExpandedFolders(prev => ({ ...prev, [parent]: true }));
                    }
                  }}
                  title="New Folder"
                >
                  <FolderPlus size={14} />
                </button>
                {selectedType === 'folder' && (
                  <button 
                    className="explorer-action-btn explorer-action-btn--delete" 
                    onClick={handleDeleteFolder}
                    title="Delete Folder"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="editor-file-tree-container">
              {renderTree(fileTree)}
              {!selectedProject?.files?.length && !creationType && (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  No files in project.
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
                  <li 
                    key={mem._id || index} 
                    className="editor-memory-list__item"
                    onClick={() => navigate(`/editor/${projectId}/memory`, { state: { highlightId: mem._id } })}
                    title="Click to view details"
                  >
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
          <div className="editor-main__header">
            <div className="editor-tabs-container">
              {openTabs.map(tab => {
                const originalFile = selectedProject.files.find(f => f.filename === tab.filename);
                const isUnsaved = originalFile && modifiedContents[tab.filename] !== undefined && modifiedContents[tab.filename] !== originalFile.content;
                
                return (
                  <div 
                    key={tab.filename}
                    className={`editor-tab ${activeFile?.filename === tab.filename ? 'active' : ''} ${isUnsaved ? 'unsaved' : ''}`}
                    onClick={() => handleFileClick(tab)}
                  >
                    <div className="tab-icon">
                      {getFileIcon(tab.filename, 14)}
                    </div>
                    <span>{tab.filename.split('/').pop()}</span>
                    {isUnsaved ? (
                      <div className="tab-indicator"></div>
                    ) : null}
                    <div className="tab-close" onClick={(e) => handleCloseTab(e, tab.filename)}>
                      <X size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {activeFile && (
              <div className="editor-save-wrapper">
                <button 
                  className="editor-btn editor-btn--ghost" 
                  onClick={handleSaveFile}
                  disabled={isSaving}
                >
                  {isSaving ? <span className="editor-loader__spinner" style={{ width: 10, height: 10, marginRight: 6, display: 'inline-block' }}></span> : <Save size={12} style={{ marginRight: '6px' }} />}
                  Save
                </button>
              </div>
            )}
          </div>
          <div className="editor-code-panel">
            {activeFile ? (
              isImageFile(activeFile.filename) ? (
                <div className="editor-image-preview" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#0f0f10', overflow: 'auto', padding: '20px' }}>
                  <img 
                    src={getImageUrl(activeFile)} 
                    alt={activeFile.filename}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style="color: #ef4444; text-align: center;"><p>Failed to load image.</p><p style="font-size: 12px; opacity: 0.7;">Make sure it exists in the repository.</p></div>';
                    }}
                  />
                </div>
              ) : (
                <Editor
                  height="100%"
                  language={getLanguageFromFilename(activeFile.filename)}
                  value={modifiedContents[activeFile.filename] || ''}
                  theme="vs-dark"
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontFamily: 'JetBrains Mono, monospace',
                    wordWrap: 'on',
                    bracketPairColorization: { enabled: true },
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    cursorSmoothCaretAnimation: 'on',
                    cursorBlinking: 'smooth',
                    renderWhitespace: 'selection',
                    padding: { top: 10, bottom: 10 },
                    formatOnType: true,
                    formatOnPaste: true
                  }}
                />
              )
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

              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/security`)}
              >
                <ShieldAlert size={20} />
                <span>Security Fixer</span>
              </button>

              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/performance`)}
              >
                <Activity size={20} />
                <span>Profiler</span>
              </button>

              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/deploy`)}
              >
                <Rocket size={20} />
                <span>Deployments</span>
              </button>

              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/env`)}
              >
                <Lock size={20} />
                <span>Env Secrets</span>
              </button>

              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/logs`)}
              >
                <Terminal size={20} />
                <span>Runtime Logs</span>
              </button>

              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/history`)}
              >
                <History size={20} />
                <span>Rollback History</span>
              </button>
              <button 
                className="editor-tool-card" 
                onClick={() => navigate(`/editor/${projectId}/debugger`)}
              >
                <History size={20} />
                <span>Debugger</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Share Project Modal */}
      {isShareModalOpen && (
        <div className="modal-overlay" onClick={() => setIsShareModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <header className="modal-header">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-primary" />
                <h2>Project Collaboration</h2>
              </div>
              <button className="close-btn" onClick={() => setIsShareModalOpen(false)}>
                <X size={20} />
              </button>
            </header>
            
            <div className="modal-body p-6">
              <form onSubmit={handleShare} className="space-y-4">
                <div className="input-group">
                  <label className="input-label mono">INVITE BY EMAIL</label>
                  <input 
                    type="email" 
                    placeholder="colleague@company.com" 
                    className="input-field"
                    list="recent-share-emails"
                    value={collaboratorEmail}
                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                    required
                  />
                  <datalist id="recent-share-emails">
                    {recentCollaborators.map(collab => (
                      <option key={collab.email} value={collab.email}>{collab.username}</option>
                    ))}
                  </datalist>
                </div>
                
                <div className="input-group">
                  <label className="input-label mono">ASSIGN ROLE</label>
                  <select 
                    className="input-field"
                    value={collaboratorRole}
                    onChange={(e) => setCollaboratorRole(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.05)', color: 'white' }}
                  >
                    <option style={{background: "#1a1a1a"}} value="viewer">Viewer (Read-only)</option>
                    <option style={{background: "#1a1a1a"}} value="editor">Editor (Can edit code)</option>
                    <option style={{background: "#1a1a1a"}} value="admin">Admin (Manage team)</option>
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-full mt-4"
                  disabled={isSharing}
                >
                  {isSharing ? "Adding..." : "Invite Collaborator"}
                </button>
              </form>

              {selectedProject?.collaborators?.length > 0 && (
                <div className="mt-8">
                  <h3 className="mono text-xs text-gray-500 mb-3 tracking-widest">CURRENT COLLABORATORS</h3>
                  <div className="space-y-3">
                    {selectedProject.collaborators.map((collab, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-white/[0.03] rounded-md border border-white/10 hover:border-primary/40 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {collab.user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-white/90">{collab.user?.username || 'User'}</span>
                            <span className="text-sm text-white/20">,</span>
                            <span className={`text-[11px] font-mono uppercase tracking-tight ${
                              collab.role === 'admin' ? 'text-yellow-500/90' : 
                              collab.role === 'editor' ? 'text-blue-400/90' : 
                              'text-white/40'
                            }`}>
                              {collab.role}
                            </span>
                          </div>
                        </div>
                        <div className="text-[10px] text-white/20 mono opacity-0 group-hover:opacity-100 transition-opacity">
                          {collab.user?.email ? collab.user.email.split('@')[0] + '@...' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;
