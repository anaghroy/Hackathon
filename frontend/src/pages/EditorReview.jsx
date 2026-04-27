import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const EditorReview = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="editor-page">
      <header className="editor-header">
        <div className="editor-header__left">
          <button className="editor-header__btn" onClick={() => navigate(`/editor/${projectId}`)}>
            <ArrowLeft size={16} /> Back to Editor
          </button>
          <div className="editor-header__title">Code Review</div>
        </div>
      </header>
      <div className="editor-placeholder">
        <h2>Code Review Page</h2>
        <p>This is a placeholder for the Code Review page.</p>
      </div>
    </div>
  );
};

export default EditorReview;
