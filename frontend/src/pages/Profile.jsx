import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  ArrowLeft, 
  Camera, 
  Mail, 
  User, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  Shield,
  Upload,
  ChevronRight,
  Globe
} from "lucide-react";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { user, handleUpdateProfile, handleUploadProfilePicture, loading } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    city: user?.city || "",
    location: user?.location || "",
    dob: user?.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
  });
  
  const fileInputRef = useRef(null);

  // Sync form data when user state updates from backend
  React.useEffect(() => {
    if (!isEditing && user) {
      setFormData({
        username: user.username || "",
        bio: user.bio || "",
        city: user.city || "",
        location: user.location || "",
        dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
      });
    }
  }, [user, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await handleUpdateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      // Error is handled in useAuth
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);

    try {
      await handleUploadProfilePicture(data);
    } catch (error) {
      // Error handled in useAuth
    }
  };

  if (loading && !user) {
    return (
      <div className="profile-loading-screen">
        <div className="spinner-premium"></div>
        <p className="mono">Preparing Your Profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="profile-page">
      <header className="profile-header-nav">
        <div className="header-container">
          <Link to="/dashboard" className="back-btn">
            <ArrowLeft size={20} />
          </Link>
          <div className="breadcrumb">
            <span className="mono">DASHBOARD</span>
            <ChevronRight size={14} />
            <span className="current">SETTINGS</span>
          </div>
        </div>
      </header>

      <main className="profile-content">
        <div className="profile-layout">
          {/* Sidebar Info */}
          <aside className="profile-sidebar">
            <div className="avatar-section">
              <div 
                className="avatar-wrapper editable"
                onClick={handleImageClick}
              >
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.username} 
                    className="avatar-img"
                  />
                ) : (
                  <div className="avatar-initials">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="avatar-overlay">
                  <Camera size={20} />
                  <span>Change Photo</span>
                </div>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
                accept="image/*"
              />

              <div className="user-intro">
                <h1>{user?.username || "Developer"}</h1>
                <p className="email">{user?.email}</p>
              </div>
            </div>

            <div className="sidebar-stats">
              <div className="stat-item">
                <Shield size={16} />
                <span>Verified Account</span>
              </div>
              <div className="stat-item">
                <Calendar size={16} />
                <span>Joined {new Date(user?.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </aside>

          {/* Main Info Form */}
          <div className="profile-main">
            <div className="section-header">
              <div className="section-title">
                <h2 className="mono">PERSONAL INFORMATION</h2>
                <p>Manage your public profile and account details.</p>
              </div>
              {!isEditing ? (
                <button className="profile-btn profile-btn--edit" onClick={() => setIsEditing(true)}>
                  <Edit3 size={16} /> Edit
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="profile-btn profile-btn--cancel" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="profile-btn profile-btn--save" onClick={handleSave} disabled={loading}>
                    {loading ? (
                      <div className="spinner-mini"></div>
                    ) : (
                      <>
                        <Save size={16} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <form className="profile-form-layout" onSubmit={handleSave}>
              <div className="form-group">
                <label className="mono">DISPLAY NAME</label>
                <div className="input-with-icon">
                  <User size={18} />
                  <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter display name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="mono">EMAIL ADDRESS</label>
                <div className="input-with-icon disabled">
                  <Mail size={18} />
                  <input 
                    type="email" 
                    value={user?.email}
                    disabled
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="mono">LOCATION</label>
                <div className="input-with-icon">
                  <Globe size={18} />
                  <input 
                    type="text" 
                    name="location"
                    value={isEditing ? formData.location : (formData.location || "Not specified")}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g. California, USA"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="mono">CITY</label>
                <div className="input-with-icon">
                  <MapPin size={18} />
                  <input 
                    type="text" 
                    name="city"
                    value={isEditing ? formData.city : (formData.city || "Not specified")}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="e.g. San Francisco"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="mono">DATE OF BIRTH</label>
                <div className="input-with-icon">
                  <Calendar size={18} />
                  <input 
                    type="date" 
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label className="mono">BIO</label>
                <textarea 
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="A short description about yourself..."
                />
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
