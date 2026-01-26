# ✅ Checklist de Vérification - Déploiement Vercel

## Changements Appliqués ✓

### 🔧 Backend (API Serverless)

- [x] **Socket.IO supprimé** - Incompatible avec Vercel serverless
- [x] **Export serverless** - `export default app` pour Vercel Functions
- [x] **Singleton pattern** - Initialisation unique des services (MongoDB, MQTT, Redis)
- [x] **CORS ouvert** - `origin: '*'` pour compatibilité multi-domaines
- [x] **Middleware d'init** - Services initialisés avant chaque requête
- [x] **Gestion d'erreurs** - Status 503 si services non disponibles
- [x] **Route /api/health** - Endpoint de santé du backend
- [x] **Package.json** - socket.io retiré des dépendances
- [x] **vercel.json** - Routes `/api/*` vers `src/index.ts`
- [x] **.env.example** - Variables cloud (MongoDB Atlas, Upstash Redis, TTN MQTT)

### 🎨 Frontend (Next.js 16)

- [x] **Polling HTTP** - Rafraîchissement toutes les 30 secondes
- [x] **Socket.IO client supprimé** - Plus de WebSocket
- [x] **Header polling** - Vérification des alertes toutes les 30s
- [x] **Dashboard polling** - Rechargement automatique des données
- [x] **Alerts page polling** - Liste des alertes mise à jour régulièrement
- [x] **socket.ts supprimé** - Fichier WebSocket retiré
- [x] **Package.json** - socket.io-client retiré
- [x] **next.config.ts** - Configuration optimisée pour production
- [x] **.env.example** - Variable `NEXT_PUBLIC_API_URL` uniquement
- [x] **Build réussi** - `npm run build` ✓

---

## 📋 Prérequis Cloud

### MongoDB Atlas
- [ ] Compte créé sur https://www.mongodb.com/cloud/atlas
- [ ] Cluster M0 (gratuit) créé
- [ ] Network Access configuré: `0.0.0.0/0` (tous les IPs autorisés)
- [ ] Database Access: Utilisateur avec mot de passe créé
- [ ] Connection String copié: `mongodb+srv://...`

### Upstash Redis
- [ ] Compte créé sur https://upstash.com
- [ ] Base Redis créée
- [ ] URL de connexion copiée: `rediss://...`

### MQTT Broker (Choisir une option)

**Option A: The Things Network (Recommandé pour LoRaWAN)**
- [ ] Compte créé sur https://www.thethingsnetwork.org
- [ ] Application créée
- [ ] Device ESP32-S3 enregistré avec LoRaWAN credentials
- [ ] Connection details copiés:
  - URL: `mqtts://eu1.cloud.thethings.network:8883`
  - Username: `<app-id>@ttn`
  - Password: `<api-key>`

**Option B: HiveMQ Cloud**
- [ ] Compte créé sur https://console.hivemq.cloud
- [ ] Cluster gratuit créé
- [ ] Credentials MQTT notés

---

## 🚀 Déploiement

### 1. Backend

```bash
cd backend
vercel --prod
```

**Variables d'environnement à configurer:**
```bash
vercel env add MONGODB_URI
# Valeur: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/water_quality

vercel env add REDIS_URL
# Valeur: rediss://default:password@region.upstash.io:6379

vercel env add MQTT_BROKER
# Valeur: mqtts://eu1.cloud.thethings.network:8883

vercel env add MQTT_USERNAME
# Valeur: your-app-id@ttn

vercel env add MQTT_PASSWORD
# Valeur: your-api-key

vercel env add MQTT_TOPIC
# Valeur: application/+/device/+/event/up

vercel env add CORS_ORIGIN
# Valeur: *
```

**Vérifier le déploiement:**
- [ ] Backend déployé: `https://your-backend.vercel.app`
- [ ] Tester: `https://your-backend.vercel.app/api/health`
- [ ] Réponse attendue: `{"status":"ok","timestamp":"..."}`

---

### 2. Frontend

```bash
cd frontend
vercel --prod
```

**Variables d'environnement:**
```bash
vercel env add NEXT_PUBLIC_API_URL
# Valeur: https://your-backend.vercel.app/api
```

**Vérifier le déploiement:**
- [ ] Frontend déployé: `https://your-frontend.vercel.app`
- [ ] Dashboard accessible et affiche l'interface
- [ ] DevTools > Network: Vérifier les requêtes API toutes les 30s

---

## 🧪 Tests Locaux

### Backend Local

```bash
cd backend
cp .env.example .env
# Éditer .env avec vos credentials MongoDB Atlas, Upstash, MQTT
npm install
npm run dev
```

**Tests:**
- [ ] Serveur démarre sur http://localhost:3001
- [ ] GET http://localhost:3001/api/health → `{"status":"ok"}`
- [ ] GET http://localhost:3001/api/water-quality → `[]` (vide au début)
- [ ] GET http://localhost:3001/api/devices → `[]`
- [ ] GET http://localhost:3001/api/alerts → `[]`

### Frontend Local

```bash
cd frontend
cp .env.example .env.local
# Éditer .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm install
npm run dev
```

**Tests:**
- [ ] Frontend démarre sur http://localhost:3000
- [ ] Dashboard affiche les métriques (pH, TDS, etc.)
- [ ] Page /devices accessible
- [ ] Page /alerts accessible
- [ ] Console navigateur: Pas d'erreurs de requête API

---

## 📡 Configuration ESP32-S3 (LoRaWAN)

### The Things Network

**Payload Format (uplink):**
```
Byte 0: Message Type (0x01 = water quality, 0x02 = fall detection)
Byte 1-2: pH * 100 (uint16, big-endian)
Byte 3-4: TDS in ppm (uint16, big-endian)
Byte 5: Battery percentage (uint8)
Byte 6-11: Accel data (optionnel pour fall detection)
```

**Exemple de payload:**
```
01 02 BC 01 F4 64
│  │     │     │
│  │     │     └─ Battery: 100%
│  │     └─ TDS: 500 ppm
│  └─ pH: 7.00 (700 / 100)
└─ Type: Water quality
```

**Configuration TTN:**
- [ ] Device EUI enregistré
- [ ] App Key configuré sur ESP32
- [ ] Join OTAA réussi
- [ ] Uplink messages visibles dans TTN Console

---

## 🔍 Dépannage

### Backend ne démarre pas localement
```bash
# Vérifier les variables d'environnement
cat backend/.env

# Tester la connexion MongoDB
# Remplacer MONGODB_URI par votre URI
mongosh "mongodb+srv://cluster.mongodb.net" --username <user>

# Vérifier les logs
npm run dev
```

### Frontend ne charge pas les données
```bash
# Ouvrir DevTools > Network
# Vérifier que les requêtes API sont faites vers la bonne URL
# Exemple: http://localhost:3001/api/water-quality

# Vérifier CORS
# Si erreur CORS, vérifier que CORS_ORIGIN=* dans backend/.env
```

### MQTT messages non reçus
```bash
# Tester avec MQTT client
npm install -g mqtt
mqtt sub -h eu1.cloud.thethings.network -p 8883 -t 'application/+/device/+/event/up' -u '<app-id>@ttn' -P '<api-key>' --protocol mqtts

# Vérifier les logs backend
# Les messages MQTT doivent apparaître dans les logs
```

### Vercel deployment fails
```bash
# Vérifier les logs
vercel logs <deployment-url>

# Redéployer
vercel --prod --force

# Vérifier les variables d'environnement
vercel env ls
```

---

## 📊 Monitoring

### Vercel Dashboard
- [ ] Visiter https://vercel.com/dashboard
- [ ] Vérifier les déploiements backend et frontend
- [ ] Vérifier les logs en temps réel
- [ ] Vérifier l'utilisation des ressources

### MongoDB Atlas
- [ ] Database > Collections > water_quality
- [ ] Vérifier que les données sont insérées
- [ ] Network Access: 0.0.0.0/0 autorisé

### The Things Network
- [ ] Application > Live Data
- [ ] Vérifier les uplink messages
- [ ] Vérifier le join status des devices

---

## ✅ Validation Finale

- [ ] Backend déployé et accessible
- [ ] Frontend déployé et accessible
- [ ] API /health retourne `{"status":"ok"}`
- [ ] Dashboard affiche l'interface correctement
- [ ] Polling fonctionne (toutes les 30s)
- [ ] MongoDB Atlas reçoit les données
- [ ] MQTT messages traités par le backend
- [ ] Alertes créées en cas d'anomalie (pH, TDS, chute)
- [ ] Pages devices et alerts accessibles

---

## 🎯 Prochaines Étapes (Optionnel)

- [ ] Ajouter authentification (NextAuth.js)
- [ ] Configurer notifications email (SendGrid)
- [ ] Ajouter monitoring (Vercel Analytics)
- [ ] Optimiser indexes MongoDB
- [ ] Ajouter tests unitaires (Jest)
- [ ] Configurer CI/CD (GitHub Actions)
- [ ] Ajouter rate limiting (Express rate limit)
- [ ] Documenter l'API (Swagger/OpenAPI)

---

## 📞 Support

- Documentation Vercel: https://vercel.com/docs
- Documentation Next.js: https://nextjs.org/docs
- Documentation MongoDB Atlas: https://docs.atlas.mongodb.com
- Documentation The Things Network: https://www.thethingsnetwork.org/docs
- Forum Vercel: https://vercel.com/support

---

**Date de dernière vérification:** $(Get-Date -Format "yyyy-MM-dd HH:mm")  
**Version:** 1.0 (Serverless sans WebSocket)
