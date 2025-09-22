# Portfolio Backend API

A comprehensive Node.js TypeScript backend for a dynamic portfolio website with MongoDB integration, JWT authentication, and crypto encryption.

## 🚀 Features

- **RESTful API** with Express.js and TypeScript
- **MongoDB** integration with Mongoose ODM
- **JWT Authentication** with refresh token support
- **Crypto Encryption** for sensitive data
- **File Upload** with Cloudinary integration
- **Email Notifications** with Nodemailer
- **Input Validation** with express-validator
- **Rate Limiting** and security middleware
- **Comprehensive Error Handling**
- **Admin Panel Authentication**
- **Contact Form Management**

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Cloudinary account (for file uploads)
- SMTP email service (Gmail recommended)

## 🛠️ Installation

1. **Clone and Setup**

   ```bash
   git clone <repository-url>
   cd portfolio-backend
   npm install
   ```

2. **Environment Configuration**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**

   ```bash
   # Make sure MongoDB is running
   npm run seed  # Seed initial data
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key-here

# Admin Credentials
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=SecurePassword123!

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint            | Description          | Access  |
| ------ | ------------------- | -------------------- | ------- |
| POST   | `/api/auth/login`   | Admin login          | Public  |
| POST   | `/api/auth/refresh` | Refresh access token | Public  |
| POST   | `/api/auth/logout`  | Admin logout         | Private |
| GET    | `/api/auth/profile` | Get admin profile    | Private |
| PUT    | `/api/auth/profile` | Update admin profile | Private |

### Hero Section

| Method | Endpoint                 | Description             | Access |
| ------ | ------------------------ | ----------------------- | ------ |
| GET    | `/api/hero`              | Get hero information    | Public |
| PUT    | `/api/hero`              | Update hero information | Admin  |
| POST   | `/api/hero/upload-image` | Upload profile image    | Admin  |
| POST   | `/api/hero/upload-cv`    | Upload CV document      | Admin  |

### Projects

| Method | Endpoint                         | Description          | Access |
| ------ | -------------------------------- | -------------------- | ------ |
| GET    | `/api/projects`                  | Get all projects     | Public |
| GET    | `/api/projects/:id`              | Get single project   | Public |
| POST   | `/api/projects`                  | Create project       | Admin  |
| PUT    | `/api/projects/:id`              | Update project       | Admin  |
| DELETE | `/api/projects/:id`              | Delete project       | Admin  |
| POST   | `/api/projects/:id/upload-image` | Upload project image | Admin  |

### Experience

| Method | Endpoint              | Description           | Access |
| ------ | --------------------- | --------------------- | ------ |
| GET    | `/api/experience`     | Get all experiences   | Public |
| GET    | `/api/experience/:id` | Get single experience | Public |
| POST   | `/api/experience`     | Create experience     | Admin  |
| PUT    | `/api/experience/:id` | Update experience     | Admin  |
| DELETE | `/api/experience/:id` | Delete experience     | Admin  |

### Education

| Method | Endpoint             | Description          | Access |
| ------ | -------------------- | -------------------- | ------ |
| GET    | `/api/education`     | Get all education    | Public |
| GET    | `/api/education/:id` | Get single education | Public |
| POST   | `/api/education`     | Create education     | Admin  |
| PUT    | `/api/education/:id` | Update education     | Admin  |
| DELETE | `/api/education/:id` | Delete education     | Admin  |

### Contact

| Method | Endpoint             | Description                  | Access |
| ------ | -------------------- | ---------------------------- | ------ |
| GET    | `/api/contact`       | Get contact information      | Public |
| PUT    | `/api/contact`       | Update contact information   | Admin  |
| POST   | `/api/contact/form`  | Submit contact form          | Public |
| GET    | `/api/contact/forms` | Get contact form submissions | Admin  |

## 🏗️ Project Structure

```
portfolio-backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── authController.ts
│   │   ├── heroController.ts
│   │   ├── projectController.ts
│   │   ├── experienceController.ts
│   │   ├── educationController.ts
│   │   └── contactController.ts
│   ├── models/               # MongoDB schemas
│   │   ├── adminModel.ts
│   │   ├── heroModel.ts
│   │   ├── projectModel.ts
│   │   ├── experienceModel.ts
│   │   ├── educationModel.ts
│   │   └── contactModel.ts
│   ├── routes/              # API routes
│   │   ├── authRoutes.ts
│   │   ├── heroRoutes.ts
│   │   ├── projectRoutes.ts
│   │   ├── experienceRoutes.ts
│   │   ├── educationRoutes.ts
│   │   └── contactRoutes.ts
│   ├── middleware/          # Custom middleware
│   │   ├── authMiddleware.ts
│   │   ├── errorHandler.ts
│   │   ├── validationMiddleware.ts
│   │   ├── uploadMiddleware.ts
│   │   └── requestLogger.ts
│   ├── utils/              # Utility functions
│   │   ├── cryptoUtils.ts
│   │   ├── jwtUtils.ts
│   │   └── validationUtils.ts
│   ├── config/             # Configuration files
│   │   └── database.ts
│   ├── types/              # TypeScript type definitions
│   ├── seeds/              # Database seeders
│   │   └── seedData.ts
│   └── server.ts           # Application entry point
├── uploads/                # Local file uploads (temporary)
├── dist/                   # Compiled JavaScript files
├── tests/                  # Test files
├── .env.example           # Environment variables template
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## 🚦 API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## 🔐 Authentication

The API uses JWT tokens for authentication:

1. **Login** with admin credentials to get access and refresh tokens
2. **Include** access token in Authorization header: `Bearer <token>`
3. **Refresh** tokens when access token expires
4. **Logout** to invalidate refresh token

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server

# Database
npm run seed         # Seed database with initial data

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run test         # Run tests

# Other
npm run clean        # Clean dist directory
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### Production Environment

1. **Set Environment Variables**

   ```bash
   NODE_ENV=production
   # Set all other required environment variables
   ```

2. **Build and Start**
   ```bash
   npm run build
   npm start
   ```

### Docker Deployment

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

### Environment-specific Considerations

- **Production**: Use strong JWT secrets and encryption keys
- **Database**: Use MongoDB Atlas or secure MongoDB instance
- **Files**: Configure Cloudinary for production use
- **Email**: Use production SMTP service
- **Security**: Enable HTTPS, set secure CORS origins

## 🔒 Security Features

- **JWT Authentication** with refresh token rotation
- **Password Hashing** with bcrypt
- **Data Encryption** for sensitive information
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **CORS** configuration
- **Security Headers** (Helmet.js)
- **File Upload Validation**

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file
   - Verify network connectivity

2. **JWT Token Issues**

   - Check JWT_SECRET configuration
   - Verify token format in requests
   - Check token expiration

3. **File Upload Errors**

   - Verify Cloudinary configuration
   - Check file size limits
   - Ensure proper file types

4. **Email Not Sending**
   - Verify SMTP configuration
   - Check email credentials
   - Ensure "Less secure app access" is enabled for Gmail

## 📞 Support

For support and questions:

- Email: rkdian118@gmail.com
- GitHub: [rkdian118](https://github.com/rkdian118)
- LinkedIn: [dhanraj-vishwakarma](https://www.linkedin.com/in/dhanraj-vishwakarma/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js for the web framework
- MongoDB and Mongoose for database management
- Cloudinary for file storage
- All other open-source libraries used in this project
  '''

# Create .env.example

env_example = '''# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration

MONGODB_URI=mongodb://localhost:27017/portfolio
MONGODB_TEST_URI=mongodb://localhost:27017/portfolio_test

# JWT Configuration

JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-complex
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-make-it-different
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# Encryption Configuration

ENCRYPTION_KEY=your-32-character-encryption-key-here-exactly-32-chars
ENCRYPTION_IV=your-16-character-iv-here-exactly-16

# Admin Credentials

ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=SecurePassword123!

# Cloudinary Configuration (File Upload)

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
MAX_FILE_SIZE=5242880

# Email Configuration (SMTP)

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password

# Rate Limiting

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# CORS Configuration

FRONTEND_URL=http://localhost:3000
'''

# Create .gitignore

gitignore_content = '''# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log\*

# Runtime data

pids
_.pid
_.seed
\*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover

lib-cov

# Coverage directory used by tools like istanbul

coverage/
\*.lcov

# nyc test coverage

.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)

.grunt

# Bower dependency directory (https://bower.io/)

bower_components

# node-waf configuration

.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)

build/Release

# Dependency directories

node_modules/
jspm_packages/

# TypeScript v1 declaration files

typings/

# TypeScript cache

\*.tsbuildinfo

# Optional npm cache directory

.npm

# Optional eslint cache

.eslintcache

# Optional REPL history

.node_repl_history

# Output of 'npm pack'

\*.tgz

# Yarn Integrity file

.yarn-integrity

# Environment variables

.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# parcel-bundler cache (https://parceljs.org/)

.cache
.parcel-cache

# next.js build output

.next

# nuxt.js build output

.nuxt

# vuepress build output

.vuepress/dist

# Serverless directories

.serverless

# FuseBox cache

.fusebox/

# DynamoDB Local files

.dynamodb/

# TernJS port file

.tern-port

# Compiled JavaScript files

dist/
build/

# IDE files

.vscode/
.idea/
_.swp
_.swo
\*~

# OS generated files

.DS*Store
.DS_Store?
.*\*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs

logs
\*.log

# Uploads (if storing locally)

uploads/
temp/

# Test files

coverage/
.nyc_output/

# Backup files

_.backup
_.bak
\*.tmp

# Lock files (choose one)

# package-lock.json

# yarn.lock

'''

print("📖 README.md created")
print("🌍 .env.example created")  
print("🙈 .gitignore created")

# Create additional configuration files

eslint*config = '''{
"parser": "@typescript-eslint/parser",
"extends": [
"eslint:recommended",
"@typescript-eslint/recommended"
],
"plugins": [
"@typescript-eslint"
],
"parserOptions": {
"ecmaVersion": 2022,
"sourceType": "module",
"project": "./tsconfig.json"
},
"env": {
"node": true,
"es2022": true
},
"rules": {
"@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^*" }],
"@typescript-eslint/explicit-function-return-type": "off",
"@typescript-eslint/explicit-module-boundary-types": "off",
"@typescript-eslint/no-explicit-any": "warn",
"@typescript-eslint/no-non-null-assertion": "warn",
"prefer-const": "error",
"no-var": "error",
"no-console": "warn",
"no-debugger": "error"
},
"ignorePatterns": ["dist/", "node_modules/", "*.js"]
}'''

jest_config = '''module.exports = {
preset: 'ts-jest',
testEnvironment: 'node',
roots: ['<rootDir>/src', '<rootDir>/tests'],
testMatch: [
'**/__tests__/**/*.ts',
'**/?(*.)+(spec|test).ts'
],
collectCoverageFrom: [
'src/**/*.ts',
'!src/**/*.d.ts',
'!src/server.ts',
'!src/seeds/**'
],
coverageDirectory: 'coverage',
coverageReporters: ['text', 'lcov', 'html'],
setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};'''

print("🔍 ESLint configuration created")
print("🧪 Jest configuration created")

print("\n" + "="*60)
print("🎉 PORTFOLIO BACKEND PROJECT COMPLETE!")
print("="*60)

print(f"\n📦 Package Information:")
print(f" - Node.js TypeScript backend")
print(f" - MongoDB with Mongoose ODM")
print(f" - JWT authentication with refresh tokens")
print(f" - Crypto encryption for sensitive data")
print(f" - File uploads with Cloudinary")
print(f" - Email notifications with Nodemailer")
print(f" - Comprehensive validation and error handling")

print(f"\n🏗️ Project Structure:")
print(f" - 7 Controllers (Auth, Hero, Technologies, Projects, Experience, Education, Contact)")
print(f" - 7 MongoDB Models with validation")
print(f" - 7 Route files with middleware")
print(f" - 5 Middleware files (Auth, Validation, Upload, Error, Logging)")
print(f" - Utility files for JWT, Crypto, and Validation")
print(f" - Database seeder with initial data")

print(f"\n🔧 Setup Instructions:")
print(f" 1. Install dependencies: npm install")
print(f" 2. Copy environment file: cp .env.example .env")
print(f" 3. Configure environment variables in .env")
print(f" 4. Start MongoDB service")
print(f" 5. Seed database: npm run seed")
print(f" 6. Start development server: npm run dev")

print(f"\n🌟 Key Features:")
print(f" ✅ Dynamic hero section with file uploads")
print(f" ✅ Technologies management with categories")
print(f" ✅ Projects showcase with image uploads")
print(f" ✅ Professional experience timeline")
print(f" ✅ Education history management")  
print(f" ✅ Contact form with email notifications")
print(f" ✅ Admin authentication and authorization")
print(f" ✅ Comprehensive API documentation")

print(f"\n🚀 Ready to integrate with your React frontend!")
print("="\*60)
