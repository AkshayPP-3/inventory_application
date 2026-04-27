# Frontend & Backend Connection Guide

## What You Need to Connect Frontend & Backend

### CORS is NOT Enough! You Need:

1. **CORS Headers** ✅ (Already configured on backend)
   - Allows browser to make requests across different ports/domains
   - Backend has: `app.use(cors())`

2. **Environment Variables** ✅ (Just added)
   - Frontend needs to know where the backend is
   - File: `client/.env.local`
   - Contains: `VITE_API_URL=http://localhost:3000`

3. **Matching API Endpoints** ✅ (All connected)
   - All frontend fetch calls now use `VITE_API_URL` environment variable
   - Examples:
     - Sign In: `/api/auth/login`
     - Sign Up: `/api/auth/register`
     - OAuth: `/api/auth/google` and `/api/auth/github`
     - Add Product: `/api/products`

---

## How to Run Both Backend & Frontend

### **Step 1: Start the Backend**
```bash
cd server
npm install  # if not already done
npm run dev
```
- Backend runs on: `http://localhost:3000`
- You'll see: "Server running on port 3000"

### **Step 2: Start the Frontend** (in NEW terminal)
```bash
cd client
npm install  # if not already done
npm run dev
```
- Frontend runs on: `http://localhost:5173` (or similar)
- You'll see Vite dev server running

### **Step 3: Test Connection**
1. Open browser to `http://localhost:5173`
2. Click "Sign Up" button
3. Enter email and password
4. If you see "User created" or email error → **Connection works!** ✅

---

## Connection Flow Diagram

```
Browser (localhost:5173)
    ↓ HTTPS Request
    ├─ Sign Up → POST /api/auth/register
    ├─ Sign In → POST /api/auth/login
    ├─ OAuth → GET /api/auth/google (redirects to Google)
    └─ Add Product → POST /api/products
    ↓
Backend (localhost:3000)
    ├─ CORS allows cross-origin
    ├─ Validates request
    ├─ Queries database
    └─ Returns JSON response
    ↓
Browser receives response (JSON with token or error)
```

---

## Environment Variables Explained

### Frontend (client/.env.local)
```
VITE_API_URL=http://localhost:3000
```
- `VITE_` prefix means Vite will inject it at build time
- Used in code: `import.meta.env.VITE_API_URL`
- Change to production URL when deploying

### Backend (server/.env) - Already Set
```
PORT=3000
DATABASE_URL=postgresql://...  (Neon PostgreSQL)
ARCJET_KEY=...  (Rate limiting)
```

---

## For Production (Deployment)

When deploying to production, update:

### Frontend .env.local → .env.production
```
VITE_API_URL=https://your-api.com
```

### Backend .env
```
PORT=3000
DATABASE_URL=your-production-db
CORS_ORIGIN=https://your-frontend.com
```

### Update CORS on backend (production safe):
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
```

---

## Common Issues & Fixes

### "Cannot reach backend" Error
- ❌ Backend not running?
- ✅ Fix: `npm run dev` in server folder

### "CORS Error"
- ❌ Frontend and backend on different ports?
- ✅ Already fixed! Backend has `app.use(cors())`

### "Token not saving"
- ❌ localStorage blocked?
- ✅ Verify in browser DevTools → Application → localStorage

### OAuth not working
- ❌ Need to configure Google/GitHub OAuth apps
- See: `server/config/passport.ts`

---

## Verification Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 5173 (or similar)
- [ ] `client/.env.local` exists with `VITE_API_URL=http://localhost:3000`
- [ ] Can click Sign Up button
- [ ] Can fill in email/password
- [ ] Can submit form without CORS error
- [ ] See response from backend (success or validation error)

---

## Current API Endpoints

```
POST   /api/auth/register      → Create account
POST   /api/auth/login         → Sign in
GET    /api/auth/google        → Google OAuth
GET    /api/auth/github        → GitHub OAuth
POST   /api/products           → Add product (requires token)
GET    /api/products           → List all products
GET    /api/products/:id       → Get one product
```

All endpoints require proper CORS headers and authentication where applicable.
