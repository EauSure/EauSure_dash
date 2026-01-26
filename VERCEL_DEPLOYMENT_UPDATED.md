# Guide de Déploiement Vercel (Mis à Jour)

## ✅ Changements Appliqués

Le projet a été optimisé pour Vercel avec les modifications suivantes:

### 1. Backend - Suppression de Socket.IO
- ❌ Socket.IO retiré (incompatible avec les fonctions serverless Vercel à cause des timeouts)
- ✅ API REST pure avec Express
- ✅ Export serverless pour Vercel Functions
- ✅ Polling côté client pour les mises à jour en temps réel

### 2. Frontend - Polling au lieu de WebSocket
- ✅ Rafraîchissement automatique toutes les 30 secondes
- ✅ Header avec vérification des alertes par polling
- ✅ Dashboard avec rechargement périodique des données

### 3. Configuration Serverless
- ✅ Backend adapté pour cold starts (initialisation singleton)
- ✅ CORS configuré pour tous les domaines (`*`)
- ✅ Routes API optimisées pour Vercel Functions

---

## 📋 Prérequis Cloud

### 1. MongoDB Atlas (Base de données)
1. Créer un compte: https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit (M0)
3. Network Access: Autoriser `0.0.0.0/0` (tous les IPs)
4. Database Access: Créer un utilisateur avec mot de passe
5. Copier l'URI de connexion

### 2. Upstash Redis (Cache)
1. Créer un compte: https://upstash.com
2. Créer une base Redis
3. Copier l'URL de connexion (format `rediss://...`)

### 3. HiveMQ Cloud (MQTT Broker)
1. Option 1 - HiveMQ Cloud:
   - Créer un compte: https://console.hivemq.cloud
   - Créer un cluster gratuit
   - Noter les credentials MQTT

2. Option 2 - The Things Network:
   - Créer un compte: https://www.thethingsnetwork.org
   - Créer une application
   - Configurer votre device LoRaWAN (ESP32-S3)
   - Noter l'URL MQTT et les credentials

---

## 🚀 Déploiement Vercel

### Backend (API Serverless)

1. **Installer Vercel CLI**
```bash
npm install -g vercel
```

2. **Naviguer vers le backend**
```bash
cd backend
```

3. **Configurer les variables d'environnement**
Dans le dashboard Vercel ou via CLI:
```bash
vercel env add MONGODB_URI
vercel env add REDIS_URL
vercel env add MQTT_BROKER
vercel env add MQTT_USERNAME
vercel env add MQTT_PASSWORD
vercel env add MQTT_TOPIC
vercel env add CORS_ORIGIN
```

Valeurs recommandées:
- `MONGODB_URI`: `mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/water-quality`
- `REDIS_URL`: `rediss://default:<pass>@region.upstash.io:6379`
- `MQTT_BROKER`: `mqtts://eu1.cloud.thethings.network:8883`
- `MQTT_USERNAME`: Votre username TTN/HiveMQ
- `MQTT_PASSWORD`: Votre password TTN/HiveMQ
- `MQTT_TOPIC`: `application/+/device/+/event/up`
- `CORS_ORIGIN`: `*` (ou votre domaine frontend)

4. **Déployer le backend**
```bash
vercel --prod
```

5. **Noter l'URL du backend** (ex: `https://your-backend.vercel.app`)

---

### Frontend (Next.js)

1. **Naviguer vers le frontend**
```bash
cd ../frontend
```

2. **Configurer les variables d'environnement**
```bash
vercel env add NEXT_PUBLIC_API_URL
```

Valeur: `https://your-backend.vercel.app/api`

3. **Déployer le frontend**
```bash
vercel --prod
```

4. **Accéder à votre dashboard**
Votre application sera disponible à: `https://your-frontend.vercel.app`

---

## 🧪 Test Local (Avant Déploiement)

### Backend Local
```bash
cd backend
cp .env.example .env
# Éditer .env avec vos credentials cloud
npm install
npm run dev
```

Le backend sera sur `http://localhost:3001`

### Frontend Local
```bash
cd frontend
cp .env.example .env.local
# Éditer .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm install
npm run dev
```

Le frontend sera sur `http://localhost:3000`

---

## 📊 Architecture Vercel

```
┌─────────────────────────────────────────────────┐
│              Vercel Edge Network                │
│  ┌──────────────┐         ┌─────────────────┐  │
│  │  Frontend    │         │  Backend API    │  │
│  │  (Next.js)   │────────▶│  (Serverless)   │  │
│  │  Edge Pages  │         │  Functions      │  │
│  └──────────────┘         └─────────────────┘  │
└─────────────────────────────────────────────────┘
           │                        │
           │                        │
           ▼                        ▼
    ┌─────────────┐         ┌──────────────┐
    │   Browser   │         │  Cloud DBs   │
    │   Polling   │         │  • MongoDB   │
    │  (30s/req)  │         │  • Redis     │
    └─────────────┘         │  • MQTT      │
                            └──────────────┘
```

---

## ⚙️ Configuration Spécifique

### Polling au lieu de WebSocket

**Frontend (page.tsx, alerts/page.tsx, Header.tsx)**
```typescript
useEffect(() => {
  loadData();
  const interval = setInterval(loadData, 30000); // 30s
  return () => clearInterval(interval);
}, []);
```

**Avantages**:
- ✅ Compatible avec Vercel serverless
- ✅ Pas de limite de timeout (10s)
- ✅ Pas besoin de serveur WebSocket persistant

**Inconvénients**:
- ⚠️ Latence max de 30s pour les nouvelles données
- ⚠️ Plus de requêtes HTTP (mais négligeable avec Vercel)

---

## 🔧 Dépannage

### Erreur "Service temporarily unavailable"
- Vérifier que `MONGODB_URI` est correctement configuré
- Vérifier que l'IP de Vercel est autorisée dans MongoDB Atlas (utiliser `0.0.0.0/0`)

### Données non actualisées
- Vérifier que MQTT broker reçoit les messages (logs Vercel)
- Vérifier le topic MQTT: `application/<app-id>/device/<dev-eui>/event/up`
- Tester avec un message MQTT manuel

### Timeout errors
- Les fonctions Vercel (free tier) ont un timeout de 10s
- Les fonctions Pro ont un timeout de 60s
- Vérifier que les requêtes MongoDB sont rapides (<5s)

---

## 📝 Commandes Utiles

```bash
# Voir les logs backend
vercel logs <deployment-url>

# Redéployer backend
cd backend && vercel --prod

# Redéployer frontend
cd frontend && vercel --prod

# Lister les déploiements
vercel ls

# Variables d'environnement
vercel env ls
vercel env add <NAME>
vercel env rm <NAME>
```

---

## 🎯 Checklist de Déploiement

Backend:
- [ ] MongoDB Atlas configuré avec IP 0.0.0.0/0
- [ ] Upstash Redis créé
- [ ] MQTT broker configuré (TTN ou HiveMQ)
- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] Backend déployé avec `vercel --prod`
- [ ] Tester `/api/health` endpoint

Frontend:
- [ ] `NEXT_PUBLIC_API_URL` configuré avec l'URL du backend
- [ ] Frontend déployé avec `vercel --prod`
- [ ] Tester le dashboard dans le navigateur
- [ ] Vérifier le polling (DevTools > Network)

IoT Device (ESP32-S3):
- [ ] LoRaWAN configuré avec TTN
- [ ] Device EUI enregistré
- [ ] Payload format: `[messageType(1), pH(2), TDS(2), battery(1)]`
- [ ] Tester l'envoi de données

---

## 🚀 Prochaines Étapes

1. **Monitoring**: Ajouter Vercel Analytics
2. **Alertes**: Configurer notifications email/SMS via SendGrid
3. **Authentication**: Ajouter NextAuth.js
4. **Database**: Optimiser les indexes MongoDB
5. **IoT**: Ajouter plus de devices et tests de charge

---

## 📚 Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Atlas](https://docs.atlas.mongodb.com)
- [The Things Network](https://www.thethingsnetwork.org/docs)
