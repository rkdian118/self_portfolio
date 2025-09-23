# Cloudinary Setup Instructions

## Option 1: Use Cloudinary (Recommended for Production)

1. **Create a Cloudinary Account**
   - Go to [https://cloudinary.com](https://cloudinary.com)
   - Sign up for a free account

2. **Get Your Credentials**
   - Go to your [Cloudinary Console](https://cloudinary.com/console)
   - Copy your Cloud Name, API Key, and API Secret

3. **Update Environment Variables**
   ```env
   CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   CLOUDINARY_API_KEY=your_actual_api_key
   CLOUDINARY_API_SECRET=your_actual_api_secret
   ```

## Option 2: Use Local Storage (Development Only)

If you don't want to set up Cloudinary, the application will automatically fall back to local file storage:

- Files will be stored in the `backend/uploads/` directory
- Images: `backend/uploads/images/`
- Documents: `backend/uploads/documents/`

**Note**: Local storage is not recommended for production as files will be lost when the server restarts in cloud deployments.

## Current Status

The application is currently configured to use **local storage** because Cloudinary credentials are not set up.

To switch to Cloudinary, simply add your credentials to the `.env` file and restart the server.