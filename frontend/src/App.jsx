import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { useEffect } from "react";

import { useAuth } from "./hooks/useAuth";

import Login from "./pages/Login";
import Register from "./pages/Register";
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const EditorPage = React.lazy(() => import("./pages/EditorPage"));
const EditorIntent = React.lazy(() => import("./pages/EditorIntent"));
const EditorExplainAI = React.lazy(() => import("./pages/EditorExplainAI"));
const EditorSchema = React.lazy(() => import("./pages/EditorSchema"));
const EditorMemory = React.lazy(() => import("./pages/EditorMemory"));
const EditorTests = React.lazy(() => import("./pages/EditorTests"));
const EditorReview = React.lazy(() => import("./pages/EditorReview"));
const EditorSecurity = React.lazy(() => import("./pages/EditorSecurity"));
const EditorPerformance = React.lazy(() => import("./pages/EditorPerformance"));
const Profile = React.lazy(() => import("./pages/Profile"));
const ConnectRepo = React.lazy(() => import("./pages/ConnectRepo"));
const DeploymentPanel = React.lazy(() => import("./pages/DeploymentPanel"));
const LogsViewer = React.lazy(() => import("./pages/LogsViewer"));
const RollbackTimeline = React.lazy(() => import("./pages/RollbackTimeline"));
const EnvManager = React.lazy(() => import("./pages/EnvManager"));
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyPending from "./pages/VerifyPending";
import Landing from "./pages/Landing/Landing";
import Documentation from "./pages/Documentation";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await handleGetMe();
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };

    init();
  }, []);
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
