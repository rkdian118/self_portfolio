# Portfolio Monorepo

Full-stack portfolio application with unified deployment on a single port.

## Architecture

- **Client** (`/`): Main portfolio website (React)
- **Admin** (`/admin`): Admin panel for content management (React + TypeScript)
- **Backend** (`/api`): REST API server (Node.js + Express + MongoDB)

## Quick Start

### Development (Multiple Ports)
```bash
# Install all dependencies
npm run install:all

# Run all services in development mode
npm run dev
```

This will start:
- Client: http://localhost:3000
- Admin: http://localhost:3001  
- Backend: http://localhost:5000

### Production (Single Port)
```bash
# Build and deploy everything
./deploy.sh

# Start the unified server
npm start
```

This serves everything on http://localhost:3000:
- Main site: http://localhost:3000/
- Admin panel: http://localhost:3000/admin
- API: http://localhost:3000/api

## Project Structure

```
portfolio/
├── client/          # Main portfolio website
├── admin/           # Admin panel
├── backend/         # API server
├── server.js        # Production server
├── package.json     # Root package.json
└── deploy.sh        # Deployment script
```

## Environment Variables

### Client (.env)
```
REACT_APP_API_URL=/api
REACT_APP_ENV=production
REACT_APP_BACKEND_UPLOAD_URL=/api/uploads
```

### Admin (.env)
```
VITE_API_URL=/api
VITE_BACKEND_UPLOAD_URL=/api/uploads
```

### Backend (.env)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## Deployment

### GitHub Pages / Netlify / Vercel
1. Run `./deploy.sh` to build all projects
2. Deploy the entire root directory
3. Set build command: `npm run build`
4. Set start command: `npm start`

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN ./deploy.sh
EXPOSE 3000
CMD ["npm", "start"]
```

## Scripts

- `npm run dev` - Start all services in development
- `npm run build` - Build all projects
- `npm start` - Start production server
- `npm run install:all` - Install dependencies for all projects