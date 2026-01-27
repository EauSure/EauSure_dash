# Environment Configuration for Vercel Deployment

## Required Environment Variables

### MongoDB Connection
MONGODB_URI=<your-mongodb-atlas-connection-string>

### JWT Secret (Backend API Authentication)
JWT_SECRET=<generate-random-base64-string>

### NextAuth Configuration (Frontend Authentication)
NEXTAUTH_SECRET=<generate-random-base64-string>
NEXTAUTH_URL=<your-vercel-frontend-url>

## Optional Environment Variables

### MQTT Configuration (for IoT devices)
MQTT_BROKER=<mqtt-broker-url>
MQTT_USERNAME=<mqtt-username>
MQTT_PASSWORD=<mqtt-password>

### Redis Configuration (for caching)
REDIS_URL=<redis-connection-url>

---

## How to Generate Secrets

Run this in PowerShell:

```powershell
# Generate JWT_SECRET
$bytes = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes)
[Convert]::ToBase64String($bytes)

# Generate NEXTAUTH_SECRET
$bytes2 = New-Object byte[] 32
(New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes2)
[Convert]::ToBase64String($bytes2)
```

## Vercel Deployment Steps

1. **Deploy Frontend Only** (backend code is now integrated)
2. **Add Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all required variables above
   - Apply to Production, Preview, and Development
3. **Redeploy** the project after adding environment variables
