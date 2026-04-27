import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useProject from "../hooks/useProject";
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  Trash2, 
  Layout, 
  Clock, 
  Shield, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import toast from "react-hot-toast";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, selectedProject, updateProject, deleteProject, loading } = useProject();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editValues, setEditValues] = useState({ title: "", description: "" });
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your Squadra AI assistant. How can I help you with your project today?" }
  ]);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (projectId) {
      getProject(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedProject) {
      setEditValues({
        title: selectedProject.title || "",
        description: selectedProject.description || "",
      });
    }
  }, [selectedProject]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && selectedProject) {
      setEditValues({
        title: selectedProject.title,
        description: selectedProject.description || "",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editValues.title.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      await updateProject(projectId, editValues);
      toast.success("Project updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
      setIsDeleteModalOpen(false);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: chatMessage }
    ];
    setMessages(newMessages);
    setChatMessage("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "I've received your message. Currently, my AI brain is being initialized. Soon I will be able to analyze your project code and help you build faster!" }
      ]);
    }, 1000);
  };

  if (loading && !selectedProject) {
    return (
      <div className="project-detail-loading">
        <div className="loader"></div>
      </div>
    );
  }

  if (!selectedProject && !loading) {
    return (
      <div className="project-detail-error">
        <h1>Project not found</h1>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="project-detail-page">
      <header className="project-header">
        <div className="header-left">
          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={20} />
          </Link>
          <div className="breadcrumb">
            <span className="mono">DASHBOARD</span>
            <ChevronRight size={14} />
            <span className="mono">PROJECTS</span>
            <ChevronRight size={14} />
            <span className="current">{selectedProject?.title}</span>
          </div>
        </div>

        <div className="header-actions">
          {isEditing ? (
            <>
              <button className="btn-minimal" onClick={handleEditToggle}>
                <X size={16} /> Cancel
              </button>
              <button className="btn-minimal btn-minimal--primary" onClick={handleUpdate}>
                <Save size={16} /> Save Changes
              </button>
            </>
          ) : (
            <>
              <button className="btn-minimal" onClick={handleEditToggle}>
                <Edit2 size={16} /> Edit
              </button>
              <button className="btn-minimal btn-minimal--danger" onClick={() => setIsDeleteModalOpen(true)}>
                <Trash2 size={16} /> Delete
              </button>
            </>
          )}
        </div>
      </header>

      <main className="project-main-layout">
        <section className="project-content-area">
          <div className="project-hero">
            <div className="project-info-main">
              {isEditing ? (
                <div className="edit-fields">
                  <input
                    type="text"
                    className="edit-title-input"
                    value={editValues.title}
                    onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                    placeholder="Project Title"
                    autoFocus
                  />
                  <textarea
                    className="edit-desc-textarea"
                    value={editValues.description}
                    onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                    placeholder="Describe your project mission..."
                  />
                </div>
              ) : (
                <>
                  <h1 className="project-display-title">{selectedProject?.title}</h1>
                  <p className="project-display-desc">
                    {selectedProject?.description || "No mission description provided for this project."}
                  </p>
                </>
              )}
            </div>

            <div className="project-meta-grid">
              <div className="meta-item">
                <Clock size={16} />
                <div>
                  <label className="mono">UPDATED</label>
                  <span>{new Date(selectedProject?.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="meta-item">
                <Layout size={16} />
                <div>
                  <label className="mono">NODES</label>
                  <span>SQUADRA-V4-ALPHA</span>
                </div>
              </div>
              <div className="meta-item">
                <Shield size={16} />
                <div>
                  <label className="mono">SECURITY</label>
                  <span>ENCRYPTED</span>
                </div>
              </div>
            </div>
          </div>

          <div className="editor-placeholder">
            <div className="placeholder-content">
              <Sparkles size={40} className="glow-icon" />
              <h3>Project Environment</h3>
              <p>The institutional AI code editor is being prepared for this project node.</p>
              <div className="loading-bar">
                <div className="progress"></div>
              </div>
            </div>
          </div>
        </section>

        <aside className="ai-chat-sidebar">
          <header className="chat-header">
            <div className="title">
              <Bot size={20} />
              <span className="mono">SQUADRA ASSISTANT</span>
            </div>
            <div className="status-dot"></div>
          </header>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="avatar">
                  {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className="bubble">
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <div className="input-wrapper">
              <input 
                type="text" 
                placeholder="Ask something about your project..." 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
              <button type="submit" className="send-btn" disabled={!chatMessage.trim()}>
                <Send size={18} />
              </button>
            </div>
          </form>
        </aside>
      </main>

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
                Are you sure you want to delete <strong className="white">"{selectedProject?.title}"</strong>? 
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
                disabled={loading}
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
