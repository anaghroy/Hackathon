import React from "react";
import { useAuth } from "../hooks/useAuth";
import useForm from "../hooks/useForm";
import { authValidator } from "../utils/validators";

const Dashboard = () => {
  const { user, handleUpdateProfile, handleLogout, loading } = useAuth();

  const { values, errors, handleChange, handleBlur, validateAll } = useForm(
    {
      username: user?.username || "",
      city: user?.city || "",
      bio: user?.bio || "",
      dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
    },
    authValidator
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    try {
      await handleUpdateProfile(values);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="logo">MediaHunt</div>
        <button onClick={handleLogout} className="btn btn-outline btn-sm">
          Logout
        </button>
      </nav>

      <main className="dashboard-content">
        <div className="profile-card">
          <header className="card-header">
            <h2>Profile Settings</h2>
            <p>Manage your account information and bio.</p>
          </header>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                type="text"
                name="username"
                className={`input-field ${errors.username ? "input-error" : ""}`}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.username && <p className="error-text">{errors.username}</p>}
            </div>

            <div className="input-group">
              <label className="input-label">City</label>
              <input
                type="text"
                name="city"
                className={`input-field ${errors.city ? "input-error" : ""}`}
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. New York"
              />
              {errors.city && <p className="error-text">{errors.city}</p>}
            </div>

            <div className="input-group">
              <label className="input-label">Bio</label>
              <textarea
                name="bio"
                className={`input-field textarea ${errors.bio ? "input-error" : ""}`}
                value={values.bio}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Tell us about yourself..."
              />
              {errors.bio && <p className="error-text">{errors.bio}</p>}
            </div>

            <div className="input-group">
              <label className="input-label">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className={`input-field ${errors.dob ? "input-error" : ""}`}
                value={values.dob}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.dob && <p className="error-text">{errors.dob}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
