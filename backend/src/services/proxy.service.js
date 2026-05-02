import httpProxy from 'http-proxy';
import portfinder from 'portfinder';
import Project from '../models/project.model.js';

const proxy = httpProxy.createProxyServer({});
const projectPortMap = new Map(); // projectId -> port

// Error handling for proxy
proxy.on('error', (err, req, res) => {
  console.error('Proxy Error:', err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Something went wrong with the proxy.');
});

/**
 * Assigns a free port to a project if not already assigned
 */
export const getProjectPort = async (projectId) => {
  if (projectPortMap.has(projectId)) {
    return projectPortMap.get(projectId);
  }

  // Find a free port starting from 8000
  portfinder.basePort = 8000;
  const port = await portfinder.getPortPromise();
  projectPortMap.set(projectId, port);
  return port;
};

/**
 * Middleware to handle subdomain-based proxying
 * project-id.localhost:3000 -> localhost:PORT
 */
export const proxyMiddleware = async (req, res, next) => {
  const host = req.headers.host;
  
  // Example: 69f46abfd2913aaf89e26712.localhost:3000
  const subdomain = host.split('.')[0];

  // Check if subdomain is a valid MongoDB ObjectId (project ID)
  if (subdomain.match(/^[0-9a-fA-C]{24}$/i)) {
    const projectId = subdomain;
    
    if (projectPortMap.has(projectId)) {
      const targetPort = projectPortMap.get(projectId);
      return proxy.web(req, res, { target: `http://localhost:${targetPort}` });
    } else {
      // Check database to see if project exists and is deployed
      const project = await Project.findById(projectId);
      if (project) {
        // Here we would ideally trigger a start if it's not running, 
        // but for now we'll just say it's not live.
        return res.status(404).send('Project is not currently running.');
      }
    }
  }

  next();
};

export const registerProjectPort = (projectId, port) => {
    projectPortMap.set(projectId, port);
};
