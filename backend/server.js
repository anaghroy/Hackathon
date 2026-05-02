import http from "http";
import app from "./src/app.js"
import connectDB from "./src/config/database.js"
import { connectRedis } from "./src/config/redis.js"
import { initSocket } from "./src/services/socket.service.js";

await connectDB()
await connectRedis()

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Initialize Socket.io via service
initSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
