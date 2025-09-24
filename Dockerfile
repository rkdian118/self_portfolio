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
COPY server.js ./
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev
RUN npm --prefix backend install --omit=dev --legacy-peer-deps

# ✅ Create uploads directory with correct ownership
RUN mkdir -p /app/uploads && chown -R 1001:1001 /app/uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000
ENV NODE_PORT=5000
ENV MONGODB_URI=mongodb+srv://rkdian118_db_user:1xjPm0bwSBiqpkGX@cluster0.rmanpms.mongodb.net/portfolio
ENV JWT_SECRET=portfolio_secret_key_5647
ENV JWT_REFRESH_SECRET=portfolio_secret_key_5647
ENV CLOUDINARY_CLOUD_NAME=dzdtvv0jl
ENV CLOUDINARY_API_KEY=593395727585441
ENV CLOUDINARY_API_SECRET=I1vcWB3y1lE67Ppiqx78MpBSB5k
ENV RATE_LIMIT_WINDOW_MS=60000
ENV RATE_LIMIT_MAX=1000
EXPOSE $PORT

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

# Start server
CMD ["node", "server.js"]