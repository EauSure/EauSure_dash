# Merged Frontend + Backend Deployment Guide

## ✅ What Changed

- **Eliminated CORS issues** by merging backend API into the Next.js frontend
- Backend code now lives in `frontend/server/` directory
- API routes moved to `frontend/app/api/` as Next.js API routes
- Everything runs on the same domain - no more cross-origin requests!
- **The `backend/` folder is now obsolete** - you can delete it

## 🚀 Vercel Deployment

Deploy **ONLY the `frontend` folder**. The backend is integrated!

### Vercel Configuration

When importing to Vercel:
1. Connect your GitHub repository
2. **Set Root Directory to: `frontend`**
3. Framework Preset: Next.js (auto-detected)
4. Build Command: `npm run build` (auto-detected)
5. Output Directory: `.next` (auto-detected)

### Step 1: Delete Old Backend Deployment (Optional)

Since the backend is now integrated into the frontend, you can delete the `eau-sureback` deployment from Vercel if you want.

### Step 2: Configure Environment Variables

Go to Vercel Dashboard → `eau-sure-front` project → Settings → Environment Variables

Add these variables:

```env
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<generate-using-command-below>
NEXTAUTH_SECRET=<generate-using-command-below>
NEXTAUTH_URL=https://eau-sure-front.vercel.app
NODE_ENV=production
```

### Step 3: Generate Secrets

Run in PowerShell:

```powershell
Write-Host "`nJWT_SECRET:"; $bytes = New-Object byte[] 32; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [Convert]::ToBase64String($bytes); Write-Host "`nNEXTAUTH_SECRET:"; $bytes2 = New-Object byte[] 32; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes2); [Convert]::ToBase64String($bytes2)
```

### Step 4: Redeploy

The code is already pushed! Vercel should auto-deploy. If not:

1. Go to Deployments tab
2. Click ⋯ on latest deployment
3. Click **Redeploy**
4. **Uncheck** "Use existing build cache"
5. Click **Redeploy**

## 🧪 Local Development

```powershell
cd frontend
npm install
npm run dev
```

Make sure you have a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 📁 New Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API routes (NEW!)
│   │   ├── auth/
│   │   │   ├── login/route.js
│   │   │   ├── register/route.js
│   │   │   └── [...nextauth]/route.js
│   │   ├── devices/route.js
│   │   ├── water-quality/route.js
│   │   └── alerts/
│   ├── login/page.jsx
│   └── ...
├── server/                # Backend business logic (NEW!)
│   ├── models/           # Mongoose models
│   ├── services/         # Database, MQTT services
│   ├── middleware/       # Auth middleware
│   └── utils/            # Logger, helpers
├── lib/
│   └── api.js            # Updated to use relative paths
└── package.json          # Includes backend dependencies
```

## ✨ Benefits

1. **No CORS issues** - Same origin for frontend and backend
2. **Simpler deployment** - One project instead of two
3. **Easier development** - Everything in one place
4. **Better performance** - No extra network hops
5. **Vercel optimizations** - Built-in caching, edge functions

## 🔍 Testing

Once deployed, try:

1. Go to https://eau-sure-front.vercel.app
2. Register a new account
3. Login
4. Should work without CORS errors!

All API calls now go to `/api/*` (same domain) instead of `https://eau-sureback.vercel.app/api/*`
