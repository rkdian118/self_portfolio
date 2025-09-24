# ----------------------------
# Stage 1: Build frontend & admin
# ----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install root dependencies
RUN npm install

# Copy client & admin
COPY client ./client
COPY admin ./admin
COPY backend ./backend
COPY .env ./
COPY .env ./client/
COPY .env ./admin/
COPY .env ./backend/

# Build backend (TypeScript)
RUN npm --prefix backend install --legacy-peer-deps
RUN npm --prefix backend run build

# Build client & admin
RUN npm --prefix client install --legacy-peer-deps
RUN npm --prefix client run build

RUN npm --prefix admin install --legacy-peer-deps
RUN npm --prefix admin run build

# ----------------------------
# Stage 2: Run the server
# ----------------------------
FROM node:20-alpine

WORKDIR /app

# Copy built frontend/admin/backend and root server
COPY --from=builder /app/client/build ./client/build
COPY --from=builder /app/admin/dist ./admin/dist
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/.env ./
COPY server.js ./
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev
RUN npm --prefix backend install --omit=dev --legacy-peer-deps

# Set environment
ENV NODE_ENV=production
ENV PORT=10000
EXPOSE $PORT

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Start server
CMD ["node", "server.js"]