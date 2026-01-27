# Project Restructuring

## Current Structure (Messy)
```
pfedash/
├── backend/          ❌ Old, redundant
├── frontend/         ✅ Contains everything now
└── docs...
```

## Recommended Actions

**Option 1: Keep Current Structure (Simplest)**
- Keep `frontend/` folder as-is (contains everything)
- Delete `backend/` folder manually when no processes are using it
- Deploy only the `frontend/` folder to Vercel

**Option 2: Clean Root Structure (Better)**
Move everything from `frontend/` to root:
```
pfedash/
├── app/              # Next.js app
├── server/           # Backend code
├── components/       # React components
├── lib/              # Utilities
├── public/           # Static files
├── package.json      # Combined dependencies
└── ...
```

## For Vercel Deployment

With current structure, make sure Vercel is configured to:
- **Root Directory**: `frontend`

Or manually set the root directory when importing the project.

## To Clean Up Backend Folder

```powershell
# Close any terminals in backend directory first
# Then run:
Remove-Item -Path "backend" -Recurse -Force
```
