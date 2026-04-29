import Project from "../models/project.model.js";

/**
 * @desc Connect a repository and initialize a new project
 * @route POST /api/repos/connect
 * @access Private
 * @body { provider, repoName, branch, buildCommand }
 */
export const connectRepo = async (req, res) => {
  try {
    const { provider, repoName, branch, buildCommand } = req.body;

    if (!provider || !repoName) {
      return res.status(400).json({
        success: false,
        message: "Provider and repoName are required.",
      });
    }

    // Fetch repository tree and files
    let initialFiles = [];
    try {
      let currentBranch = branch || "main";
      let repoTreeRes = await fetch(`https://api.github.com/repos/${repoName}/git/trees/${currentBranch}?recursive=1`);
      
      // Fallback to master if main doesn't exist
      if (!repoTreeRes.ok && repoTreeRes.status === 404 && currentBranch === "main") {
         currentBranch = "master";
         repoTreeRes = await fetch(`https://api.github.com/repos/${repoName}/git/trees/${currentBranch}?recursive=1`);
      }

      if (repoTreeRes.ok) {
         const treeData = await repoTreeRes.json();
         // Filter to only blobs (files) and limit to 40 files to avoid rate limiting
         const blobs = treeData.tree.filter(t => t.type === 'blob').slice(0, 40);
         
         // Fetch contents in parallel
         initialFiles = await Promise.all(blobs.map(async b => {
             const rawRes = await fetch(`https://raw.githubusercontent.com/${repoName}/${currentBranch}/${b.path}`);
             const content = rawRes.ok ? await rawRes.text() : "// Failed to load content";
             return {
                 filename: b.path,
                 content
             };
         }));
      } else {
         console.warn(`Failed to fetch tree for ${repoName}:`, repoTreeRes.statusText);
      }
    } catch (e) {
      console.error("Failed to fetch repo contents:", e);
    }

    // Initialize a new project record in the database for the repo
    const newProject = await Project.create({
      title: repoName,
      user: req.user.id || req.user._id, 
      repoProvider: provider,
      repoName: repoName,
      branch: branch || "main",
      buildCommand: buildCommand || "",
      description: `Connected ${provider} repository: ${repoName}`,
      files: initialFiles,
    });

    // Dummy logic to represent setting up webhooks
    console.log(
      `[DevOps] Setting up webhook for ${provider} repo: ${repoName}`,
    );

    return res.status(201).json({
      success: true,
      message: "Repository connected and project initialized successfully.",
      project: newProject,
    });
  } catch (error) {
    console.error("Error in connectRepo:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while connecting repository.",
    });
  }
};

/**
 * @desc Get list of repositories for a given provider
 * @route GET /api/repos/:provider/list
 * @access Private
 */
export const getRepos = async (req, res) => {
  try {
    const { provider } = req.params;
    const { search } = req.query;
    
    let repos = [];

    if (provider === "github") {
      let urlToFetch = "";
      
      if (search) {
        let query = search.trim();
        // Extract owner/repo if user pasted a URL
        if (query.includes("github.com/")) {
          const parts = query.split("github.com/")[1].split("/");
          query = `${parts[0]}/${parts[1]}`;
        }

        if (query.includes("/")) {
          // Specific repo query: owner/repo
          urlToFetch = `https://api.github.com/repos/${query}`;
        } else {
          // Username query
          urlToFetch = `https://api.github.com/users/${query}/repos?sort=updated&per_page=30`;
        }
      } else {
        // No search query. Try to fetch repos for the logged-in user.
        // We need the user's githubId from the DB.
        const dbUser = await Project.db.model("User").findById(req.user.id);
        
        // We need a fallback in case the user isn't logged in with GitHub
        let githubUsername = "anaghroy"; 
        
        if (dbUser && dbUser.githubId) {
            try {
              // Fetch GitHub username from ID
              const userRes = await fetch(`https://api.github.com/user/${dbUser.githubId}`);
              if (userRes.ok) {
                 const ghUser = await userRes.json();
                 if (ghUser.login) githubUsername = ghUser.login;
              }
            } catch (e) {
              console.error("Failed to fetch github user by ID:", e);
            }
        }
        
        urlToFetch = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=30`;
      }

      if (urlToFetch) {
        try {
          const ghRes = await fetch(urlToFetch);
          if (ghRes.ok) {
            const ghData = await ghRes.json();
            // Wrap in array if it's a single repo object (from 'owner/repo' search)
            repos = Array.isArray(ghData) ? ghData : [ghData];
          } else {
            console.warn("GitHub API returned error:", ghRes.statusText);
          }
        } catch (e) {
          console.error("Failed to fetch from GitHub API:", e);
        }
      }
    }

    // Fallback to mock data for other providers or if fetch completely failed
    if (repos.length === 0 && provider !== "github") {
      repos = [
        { id: 1, name: "my-awesome-app", full_name: "testuser/my-awesome-app" },
        { id: 2, name: "backend-api", full_name: "testuser/backend-api" },
        { id: 3, name: "frontend-react", full_name: "testuser/frontend-react" },
        { id: 4, name: "ai-service", full_name: "testuser/ai-service" },
        { id: 5, name: "devops-scripts", full_name: "testuser/devops-scripts" },
      ];
    }

    return res.status(200).json({
      success: true,
      repositories: repos
    });
  } catch (error) {
    console.error("Error in getRepos:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch repositories."
    });
  }
};
