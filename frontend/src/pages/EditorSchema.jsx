import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const EditorSchema = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="editor-page">
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-header__btn" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__title">DB Schema</div>
        </div>
      </header>
      <div className="editor-placeholder">
        <h2>DB Schema Designer</h2>
        <p>This is a placeholder for the DB Schema Designer.</p>
      </div>
    </div>
  );
};

export default EditorSchema;
