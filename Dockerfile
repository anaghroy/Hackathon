# ---------- FRONTEND BUILD ----------
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Install dependencies first (better caching)
COPY ./frontend/package*.json /app

RUN npm install

# Copy rest and build
COPY ./frontend /app

RUN npm run build


# ---------- BACKEND BUILD ----------
FROM node:20-alpine

WORKDIR /app

# Install backend dependencies
COPY ./backend/package*.json /app

RUN npm install

# Copy backend source
COPY ./backend /app

# Build JavaScript → dist/
RUN npm run build

# Copy frontend build into backend public folder
COPY --from=frontend-builder /app/dist /app/public

EXPOSE 3000

# Run compiled JavaScript
CMD ["node", "dist/server.js"]