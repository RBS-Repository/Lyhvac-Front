# Backend and Frontend Separation - Complete

## ✅ What Was Done

### 1. **Created Separate Backend Package**
- Created `backend/package.json` with backend-only dependencies:
  - Express, Mongoose, Cloudinary, Multer, CORS
  - Backend TypeScript types
  - Backend-specific scripts

### 2. **Updated Root Package.json**
- Removed all backend dependencies
- Kept only frontend dependencies (Next.js, React, Tailwind, etc.)
- Updated scripts to work with separated structure

### 3. **Created API Configuration Utility**
- Created `src/lib/api.ts` with centralized API configuration
- Uses environment variables (`NEXT_PUBLIC_API_URL`)
- Provides typed endpoint helpers for all API routes
- Includes error handling wrapper

### 4. **Replaced All Hardcoded URLs**
- Updated **14+ frontend files** to use `API_ENDPOINTS` instead of hardcoded URLs
- All API calls now use the centralized configuration
- Easy to change API URL via environment variable

### 5. **Environment Variable Setup**
- Frontend: Use `NEXT_PUBLIC_API_URL` in `.env.local`
- Backend: Use existing `.env` in `backend/` folder

## 📁 Project Structure

```
hvac-website/
├── backend/                    # Backend API (Express + MongoDB)
│   ├── package.json           # ✅ NEW: Backend-only dependencies
│   ├── server.ts
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── routes/
│
├── src/                       # Frontend (Next.js)
│   ├── app/
│   ├── components/
│   └── lib/
│       └── api.ts             # ✅ NEW: API configuration utility
│
├── package.json               # ✅ UPDATED: Frontend-only dependencies
└── .env.local                 # Frontend environment variables
```

## 🚀 Next Steps

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies (if needed)
```bash
npm install
```

### 3. Set Up Environment Variables

**Frontend** (create `.env.local` in root):
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

**Backend** (create `.env` in `backend/` folder):
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hvac-website
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run Development Servers

**Option 1: Run Separately**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

**Option 2: Run Together (from root)**
```bash
npm run dev:all
```

## 📝 API Endpoints Available

All endpoints are now accessed via `API_ENDPOINTS`:

```typescript
import { API_ENDPOINTS } from '@/lib/api';

// Products
API_ENDPOINTS.products
API_ENDPOINTS.productById(id)

// Categories
API_ENDPOINTS.categories
API_ENDPOINTS.categoryById(id)

// Users
API_ENDPOINTS.users
API_ENDPOINTS.userById(id)
API_ENDPOINTS.userByUid(uid)
API_ENDPOINTS.userDisable(id)
API_ENDPOINTS.userEnable(id)

// Upload
API_ENDPOINTS.upload
```

## ✅ Benefits

1. **Clear Separation**: Backend and frontend are now properly separated
2. **Easy Configuration**: Change API URL via environment variable
3. **Type Safety**: Typed endpoint helpers prevent errors
4. **Maintainability**: Single source of truth for API URLs
5. **Deployment Ready**: Easy to configure for production environments

## 🔧 Production Deployment

For production, set:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

The frontend will automatically use this URL for all API calls.

