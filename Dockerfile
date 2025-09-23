FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY client/package*.json ./client/
COPY admin/package*.json ./admin/
RUN npm run install:all
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
