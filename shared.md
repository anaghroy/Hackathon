# "Shared With Me" Feature Architecture

This document provides a detailed breakdown of the backend and frontend implementation for the **"Shared With Me"** feature, which allows users to view and collaborate on projects that other developers have invited them to.

---

## 1. Feature Overview
The "Shared With Me" page (accessible via the Dashboard) displays projects where the current user is not the owner, but has been added as a collaborator. This requires a many-to-many relationship mapping between Users and Projects.

---

## 2. Backend Implementation Details

### A. Schema Updates (`project.model.js`)
To support sharing, the Project model needs an array of collaborators. We also define their role (e.g., "viewer", "editor", "admin") to manage permissions.

```javascript
// Add this to your existing Project schema
collaborators: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      enum: ["viewer", "editor", "admin"],
      default: "viewer"
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }
]
```

### B. Controller Logic (`project.controller.js`)
You need two primary controllers for this feature:

1. **`getSharedProjects`**: Fetches projects where the current user's ID exists in the `collaborators.user` array.
```javascript
export const getSharedProjects = async (req, res) => {
  try {
    const sharedProjects = await projectModel.find({
      "collaborators.user": req.user.id
    }).populate("owner", "username email picture"); // Populate owner details to show on frontend

    res.status(200).json({ success: true, projects: sharedProjects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching shared projects" });
  }
};
```

2. **`addCollaborator`**: Allows project owners to invite other users by their email or username.

### C. Routes (`project.routes.js`)
Add the following routes and protect them with your existing `authUser` middleware.

```javascript
import { getSharedProjects, addCollaborator } from "../controllers/project.controller.js";

// Must be placed BEFORE /:id routes so it doesn't get treated as an ID
router.get("/shared", authUser, getSharedProjects);
router.post("/:id/collaborators", authUser, addCollaborator);
```

---

## 3. Frontend Implementation Details

### A. UI/UX in `Dashboard.jsx`
In the Dashboard, you have a "Shared with me" button or tab. This acts as a filter or a separate view for the project grid.

**State Management:**
```javascript
const [activeTab, setActiveTab] = useState("my-projects"); // 'my-projects' | 'shared'
const [sharedProjects, setSharedProjects] = useState([]);

// Fetch shared projects when the tab is clicked
useEffect(() => {
  if (activeTab === "shared") {
    fetchSharedProjects();
  }
}, [activeTab]);
```

**UI Layout Structure:**
```jsx
{/* Sidebar / Top Navigation Toggle */}
<div className="dashboard-tabs">
  <button 
    className={activeTab === "my-projects" ? "active" : ""} 
    onClick={() => setActiveTab("my-projects")}
  >
    My Projects
  </button>
  <button 
    className={activeTab === "shared" ? "active" : ""} 
    onClick={() => setActiveTab("shared")}
  >
    Shared With Me
  </button>
</div>

{/* Project Grid */}
<div className="project-grid">
  {activeTab === "my-projects" 
    ? myProjects.map(project => <ProjectCard key={project._id} project={project} />)
    : sharedProjects.map(project => <SharedProjectCard key={project._id} project={project} />)
  }
</div>
```

### B. Shared Project Card Component
The `SharedProjectCard` should look slightly different from the standard card to provide context:
- **Owner Badge**: Display the avatar and username of the person who owns the project.
- **Role Badge**: Display the current user's role (e.g., "Editor", "Viewer") so they know their permissions.
- **Action Restrictions**: Remove the "Delete Project" button, as only the owner can delete it. Instead, provide a "Leave Project" button.

### C. The API Call (`project.service.js`)
Add the fetch call to your frontend services.

```javascript
import axios from 'axios';

export const fetchSharedProjectsAPI = async () => {
  const response = await axios.get('/api/projects/shared', {
    withCredentials: true // Important for passing JWT cookies
  });
  return response.data.projects;
};
```

---

## 4. Security & Edge Cases
- **Authorization**: Ensure your backend middleware checks if a user is either the `owner` OR exists in the `collaborators` array before allowing access to `GET /api/projects/:id`.
- **Role Permissions**: Only allow users with the "editor" or "admin" role to trigger Deployments, save Environment Variables, or use the AI Code Editor tools. "Viewers" should only be able to view code and logs.
