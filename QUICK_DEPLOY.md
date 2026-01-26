# 🚀 Guide de Déploiement Rapide

## Prérequis (5 minutes)

### 1. MongoDB Atlas
```
1. Aller sur: https://www.mongodb.com/cloud/atlas/register
2. Créer cluster gratuit (M0)
3. Network Access → Add IP: 0.0.0.0/0
4. Database Access → Add User: username + password
5. Copier URI: mongodb+srv://username:password@cluster.mongodb.net/water_quality
```

### 2. Upstash Redis
```
1. Aller sur: https://upstash.com
2. Create Database
3. Copier URL: rediss://default:password@region.upstash.io:6379
```

### 3. The Things Network (LoRaWAN)
```
1. Aller sur: https://console.cloud.thethings.network
2. Create Application
3. Add Device (ESP32-S3)
4. Copier:
   - MQTT URL: mqtts://eu1.cloud.thethings.network:8883
   - Username: <app-id>@ttn
   - Password: <api-key>
```

---

## Déploiement Backend (5 minutes)

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Aller dans backend
cd backend

# 3. Déployer
vercel --prod

# 4. Configurer les variables d'environnement
vercel env add MONGODB_URI
# Coller: mongodb+srv://...

vercel env add REDIS_URL
# Coller: rediss://...

vercel env add MQTT_BROKER
# Coller: mqtts://eu1.cloud.thethings.network:8883

vercel env add MQTT_USERNAME
# Coller: <app-id>@ttn

vercel env add MQTT_PASSWORD
# Coller: <api-key>

vercel env add MQTT_TOPIC
# Coller: application/+/device/+/event/up

vercel env add CORS_ORIGIN
# Coller: *

# 5. Redéployer avec les variables
vercel --prod

# 6. Noter l'URL du backend
# Exemple: https://your-backend-xyz.vercel.app
```

**Test:**
```bash
curl https://your-backend-xyz.vercel.app/api/health
# Réponse: {"status":"ok","timestamp":"..."}
```

---

## Déploiement Frontend (3 minutes)

```bash
# 1. Aller dans frontend
cd ../frontend

# 2. Configurer l'API URL
vercel env add NEXT_PUBLIC_API_URL
# Coller: https://your-backend-xyz.vercel.app/api

# 3. Déployer
vercel --prod

# 4. Noter l'URL du frontend
# Exemple: https://your-frontend-xyz.vercel.app
```

**Test:**
Ouvrir `https://your-frontend-xyz.vercel.app` dans le navigateur.

---

## Test Local (Optionnel)

### Backend
```bash
cd backend
cp .env.example .env

# Éditer .env avec vos credentials:
# MONGODB_URI=mongodb+srv://...
# REDIS_URL=rediss://...
# MQTT_BROKER=mqtts://...
# etc.

npm install
npm run dev
# Backend sur http://localhost:3001
```

### Frontend
```bash
cd frontend
cp .env.example .env.local

# Éditer .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

npm install
npm run dev
# Frontend sur http://localhost:3000
```

---

## Configuration ESP32-S3

### Payload LoRaWAN

```cpp
// Message Type 0x01: Water Quality
uint8_t payload[6];
payload[0] = 0x01;                    // Type
payload[1] = (uint16_t)(ph * 100) >> 8;    // pH high byte
payload[2] = (uint16_t)(ph * 100) & 0xFF;  // pH low byte
payload[3] = (uint16_t)tds >> 8;           // TDS high byte
payload[4] = (uint16_t)tds & 0xFF;         // TDS low byte
payload[5] = battery;                      // Battery %

// Message Type 0x02: Fall Detection
uint8_t payload[1];
payload[0] = 0x02;                    // Type
```

### The Things Network Configuration

```
Device EUI: (from ESP32 chip)
App Key: (generate in TTN console)
Frequency Plan: Europe 863-870 MHz (ou votre région)
LoRaWAN Version: 1.0.3
Regional Parameters: RP001 Regional Parameters 1.0.3 revision A
```

---

## Vérification Rapide

### ✅ Backend Deployed
```bash
curl https://your-backend.vercel.app/api/health
# ✅ {"status":"ok"}

curl https://your-backend.vercel.app/api/water-quality
# ✅ [] (vide au début)
```

### ✅ Frontend Deployed
```
1. Ouvrir: https://your-frontend.vercel.app
2. Dashboard visible avec métriques (pH, TDS, etc.)
3. DevTools > Network: Requêtes API toutes les 30s
4. Pages /devices et /alerts accessibles
```

### ✅ MQTT Connected
```
1. TTN Console > Applications > Live Data
2. Envoyer uplink depuis ESP32
3. Message visible dans TTN
4. Backend logs (vercel logs): "Received MQTT message"
5. MongoDB Atlas > Collections: Données insérées
```

---

## Dépannage Rapide

### Backend 503 Error
```bash
# Vérifier les variables d'environnement
vercel env ls

# Vérifier les logs
vercel logs

# Vérifier MongoDB Atlas Network Access
# IP 0.0.0.0/0 doit être autorisé
```

### Frontend ne charge pas
```
# Vérifier NEXT_PUBLIC_API_URL
vercel env ls

# Vérifier CORS backend
# CORS_ORIGIN doit être *
```

### MQTT ne reçoit rien
```bash
# Tester manuellement
npm install -g mqtt
mqtt sub -h eu1.cloud.thethings.network -p 8883 \
  -t 'application/+/device/+/event/up' \
  -u '<app-id>@ttn' -P '<api-key>' --protocol mqtts

# Vérifier ESP32 join status dans TTN Console
```

---

## Commandes Utiles

```bash
# Redéployer
vercel --prod --force

# Logs en temps réel
vercel logs --follow

# Lister déploiements
vercel ls

# Supprimer déploiement
vercel rm <deployment-url>

# Variables d'environnement
vercel env add <NAME>
vercel env rm <NAME>
vercel env pull .env.local
```

---

## 📊 Architecture

```
Internet
   │
   ├─ ESP32-S3 (LoRaWAN)
   │     └─> The Things Network (MQTT)
   │              └─> Vercel Backend (Serverless)
   │                       ├─> MongoDB Atlas
   │                       └─> Upstash Redis
   │
   └─ Browser
         └─> Vercel Frontend (Next.js)
                └─> API polling (30s)
```

---

## 🎯 Checklist Final

- [ ] MongoDB Atlas: Cluster créé, IP autorisé
- [ ] Upstash Redis: Database créée
- [ ] The Things Network: Application + Device créés
- [ ] Backend déployé sur Vercel
- [ ] Variables d'environnement backend configurées
- [ ] Frontend déployé sur Vercel
- [ ] Variable NEXT_PUBLIC_API_URL configurée
- [ ] Test /api/health: OK
- [ ] Dashboard accessible: OK
- [ ] ESP32 join TTN: OK
- [ ] MQTT messages reçus: OK

---

**Temps total:** ~15 minutes  
**Coût:** Gratuit (Free tiers)  
**Production-ready:** ✅ Oui

Pour plus de détails: Voir `VERCEL_DEPLOYMENT_UPDATED.md` et `VERIFICATION_CHECKLIST.md`
