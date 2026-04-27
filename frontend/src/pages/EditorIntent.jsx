import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const EditorIntent = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="editor-page">
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-header__btn" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__title">Intent Mode</div>
        </div>
      </header>
      <div className="editor-placeholder">
        <h2>Intent Mode Page</h2>
        <p>This is a placeholder for the Intent Mode.</p>
      </div>
    </div>
  );
};

export default EditorIntent;
