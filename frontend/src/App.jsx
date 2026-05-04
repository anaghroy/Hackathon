import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { useEffect } from "react";

import { useAuth } from "./hooks/useAuth";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EditorPage from "./pages/EditorPage";
import EditorIntent from "./pages/EditorIntent";
import EditorExplainAI from "./pages/EditorExplainAI";
import EditorSchema from "./pages/EditorSchema";
import EditorMemory from "./pages/EditorMemory";
import EditorTests from "./pages/EditorTests";
import EditorReview from "./pages/EditorReview";
import EditorSecurity from "./pages/EditorSecurity";
import EditorPerformance from "./pages/EditorPerformance";
import Profile from "./pages/Profile";
import ConnectRepo from "./pages/ConnectRepo";
import DeploymentPanel from "./pages/DeploymentPanel";
import LogsViewer from "./pages/LogsViewer";
import RollbackTimeline from "./pages/RollbackTimeline";
import EnvManager from "./pages/EnvManager";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyPending from "./pages/VerifyPending";
import Landing from "./pages/Landing/Landing";
import Documentation from "./pages/Documentation";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import Loading from "./components/Loading";

function App() {
  const { handleGetMe, loading } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, []);

  if (loading) {
    return <Loading fullScreen message="Authenticating..." />;
  }

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        gutter={8}
        toastOptions={{
          className: 'squadra-toast',
          duration: 4000,
          icon: null, // Force remove icons globally
          style: {
            background: '#111318',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '6px',
            fontSize: '14px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
          },
          success: {
            className: 'squadra-toast squadra-success',
          },
          error: {
            className: 'squadra-toast squadra-error',
          },
          loading: {
            className: 'squadra-toast squadra-loading',
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<Documentation />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-pending"
          element={
            <PublicRoute>
              <VerifyPending />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connect-repo"
          element={
            <ProtectedRoute>
              <ConnectRepo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:projectId/deploy"
          element={
            <ProtectedRoute>
              <DeploymentPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:projectId/env"
          element={
            <ProtectedRoute>
              <EnvManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:projectId/logs"
          element={
            <ProtectedRoute>
              <LogsViewer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:projectId/history"
          element={
            <ProtectedRoute>
              <RollbackTimeline />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:projectId"
          element={
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:projectId/intent"
          element={
            <ProtectedRoute>
              <EditorIntent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:projectId/explain-ai"
          element={
            <ProtectedRoute>
              <EditorExplainAI />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:projectId/schema"
          element={
            <ProtectedRoute>
              <EditorSchema />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:projectId/memory"
          element={
            <ProtectedRoute>
              <EditorMemory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:projectId/tests"
          element={
            <ProtectedRoute>
              <EditorTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:projectId/review"
          element={
            <ProtectedRoute>
              <EditorReview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor/:projectId/security"
          element={
            <ProtectedRoute>
              <EditorSecurity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/editor/:projectId/performance"
          element={
            <ProtectedRoute>
              <EditorPerformance />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
