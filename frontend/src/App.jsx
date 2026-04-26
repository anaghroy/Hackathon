import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import { useAuth } from "./hooks/useAuth";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyPending from "./pages/VerifyPending";

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

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
