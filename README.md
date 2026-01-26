# 🌊 Water Quality Monitoring Dashboard

> Système IoT autonome de surveillance de la qualité de l'eau pour puits et réservoirs profonds avec LoRaWAN

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)
[![LoRaWAN](https://img.shields.io/badge/LoRaWAN-1.0.3-orange)](https://lora-alliance.org/)

---

## 📋 Description

Système IoT de monitoring en temps réel de la qualité de l'eau avec:

- **Capteurs**: pH, TDS (Total Dissolved Solids)
- **Sécurité**: Détection de chute avec accéléromètre MPU6050
- **Communication**: LoRaWAN (ESP32-S3) via The Things Network
- **Dashboard**: Interface web temps réel avec Next.js
- **Alertes**: Notifications automatiques pour anomalies critiques

---

## 🏗️ Architecture

### Stack Technique

<table>
<tr>
<td width="50%">

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (graphiques)
- React-Leaflet (cartes)
- Déploiement: Vercel Edge

</td>
<td width="50%">

**Backend**
- Node.js + Express
- TypeScript
- API REST (Polling 30s)
- MQTT Client (LoRaWAN)
- Déploiement: Vercel Serverless

</td>
</tr>
<tr>
<td width="50%">

**Database & Cache**
- MongoDB Atlas (Time-series)
- Upstash Redis (Cache)
- Indexes optimisés

</td>
<td width="50%">

**IoT Infrastructure**
- The Things Network v3
- ESP32-S3 LoRaWAN
- pH + TDS sensors + MPU6050
- Frequency: EU868 / US915

</td>
</tr>
</table>

### Architecture Cloud

```
┌─────────────────────────────────────────────┐
│            Vercel Edge Network              │
│  ┌──────────────┐      ┌────────────────┐  │
│  │  Next.js 16  │─────▶│  Express API   │  │
│  │  (Frontend)  │      │  (Serverless)  │  │
│  └──────────────┘      └────────────────┘  │
└─────────────────────────────────────────────┘
         │                        │
         │                        ▼
         │              ┌──────────────────┐
         │              │  Cloud Services  │
         │              │  • MongoDB Atlas │
         │              │  • Upstash Redis │
         │              │  • TTN MQTT      │
         │              └──────────────────┘
         │                        ▲
         ▼                        │
   ┌──────────┐          ┌───────────────┐
   │ Browser  │          │  ESP32-S3     │
   │ Polling  │          │  LoRaWAN      │
   │ (30s)    │          │  pH+TDS+MPU   │
   └──────────┘          └───────────────┘
```

---

## 🚀 Déploiement Rapide (15 minutes)

### Option A: Production (Vercel Cloud) - Recommandé

📖 **Suivre le guide:** [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

```bash
# 1. Créer comptes cloud (5 min)
MongoDB Atlas:  https://www.mongodb.com/cloud/atlas
Upstash Redis:  https://upstash.com
The Things Network: https://console.cloud.thethings.network

# 2. Déployer backend (5 min)
cd backend
vercel --prod
# Configurer variables d'environnement dans Vercel dashboard

# 3. Déployer frontend (3 min)
cd frontend
vercel --prod
# Configurer NEXT_PUBLIC_API_URL

# 4. Configurer ESP32-S3 (2 min)
# Voir QUICK_DEPLOY.md
```

### Option B: Développement Local

**Prérequis:**
- Node.js 18+
- Comptes cloud (MongoDB Atlas, Upstash, TTN)

**Backend:**
```bash
cd backend
cp .env.example .env
# Éditer .env avec credentials cloud
npm install
npm run dev
# → http://localhost:3001
```

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm install
npm run dev
# → http://localhost:3000
```

---

## 📚 Documentation

| Document | Description | Temps de lecture |
|----------|-------------|------------------|
| [QUICK_DEPLOY.md](QUICK_DEPLOY.md) | 🚀 Guide de déploiement rapide | 5 min |
| [VERIFICATION_CHECKLIST.md](VERIFICATION_CHECKLIST.md) | ✅ Checklist complète | 10 min |
| [VERCEL_DEPLOYMENT_UPDATED.md](VERCEL_DEPLOYMENT_UPDATED.md) | 📖 Documentation détaillée | 20 min |
| [MODIFICATIONS_SUMMARY.md](MODIFICATIONS_SUMMARY.md) | 📝 Résumé changements | 5 min |
| [RAPPORT_FINAL.md](RAPPORT_FINAL.md) | 📊 Rapport de vérification | 15 min |

---

## 📡 API Endpoints

### Backend (Vercel Serverless Functions)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/health` | Health check du backend |
| `GET` | `/api/water-quality` | Données qualité eau (time-series) |
| `POST` | `/api/water-quality` | Ajouter une mesure |
| `GET` | `/api/devices` | Liste dispositifs LoRaWAN |
| `GET` | `/api/devices/:id` | Détails d'un dispositif |
| `POST` | `/api/devices` | Enregistrer un dispositif |
| `GET` | `/api/alerts` | Liste des alertes |
| `POST` | `/api/alerts/:id/acknowledge` | Acquitter une alerte |

### Frontend (HTTP Polling)

Le frontend utilise du **polling HTTP** toutes les **30 secondes** au lieu de WebSocket pour compatibilité Vercel:

```javascript
useEffect(() => {
  loadData();
  const interval = setInterval(loadData, 30000); // 30s
  return () => clearInterval(interval);
}, []);
```

---

## 🔧 Configuration ESP32-S3 (LoRaWAN)

### Payload Format (Uplink)

| Byte | Field | Type | Description |
|------|-------|------|-------------|
| 0 | Message Type | uint8 | 0x01=water quality, 0x02=fall |
| 1-2 | pH | uint16 BE | pH * 100 (ex: 7.00 = 700) |
| 3-4 | TDS | uint16 BE | TDS in ppm (ex: 500) |
| 5 | Battery | uint8 | Battery % (0-100) |

**Exemple de payload:**
```
01 02 BC 01 F4 64
│  │     │     │
│  │     │     └─ Battery: 100%
│  │     └─ TDS: 500 ppm
│  └─ pH: 7.00 (700 / 100)
└─ Type: Water quality (0x01)
```

### Code Arduino (ESP32-S3)

```cpp
#include <TheThingsNetwork.h>

// Encoder payload
uint8_t payload[6];
payload[0] = 0x01;                       // Type: Water quality
payload[1] = (uint16_t)(ph * 100) >> 8;  // pH high byte
payload[2] = (uint16_t)(ph * 100) & 0xFF; // pH low byte
payload[3] = (uint16_t)tds >> 8;         // TDS high byte
payload[4] = (uint16_t)tds & 0xFF;       // TDS low byte
payload[5] = battery;                    // Battery %

// Envoyer via LoRaWAN
ttn.sendBytes(payload, sizeof(payload));
```

### The Things Network Setup

1. **Create Application** sur https://console.cloud.thethings.network
2. **Register Device** (ESP32-S3)
   - Device EUI: (from chip)
   - App Key: (generate)
   - Frequency Plan: Europe 863-870 MHz
3. **Copy MQTT credentials**
   - URL: `mqtts://eu1.cloud.thethings.network:8883`
   - Username: `<app-id>@ttn`
   - Password: `<api-key>`

---

## 🧪 Tests

### Build Tests

**Backend:**
```bash
cd backend
npm run build
# ✅ TypeScript compilation successful
```

**Frontend:**
```bash
cd frontend
npm run build
# ✅ Next.js build successful
# ✅ Static pages generated: /, /devices, /alerts
```

### API Tests

```bash
# Health check
curl https://your-backend.vercel.app/api/health
# {"status":"ok","timestamp":"2024-01-XX..."}

# Water quality data
curl https://your-backend.vercel.app/api/water-quality
# [{"ph":7.2,"tds":450,"timestamp":"..."}]
```

### Local Tests

**Backend:**
```bash
cd backend
npm run dev
# Test: http://localhost:3001/api/health
```

**Frontend:**
```bash
cd frontend
npm run dev
# Test: http://localhost:3000
```

---

## 📊 Fonctionnalités

### Dashboard Principal

- ✅ **Métriques en temps réel** (pH, TDS, battery, status)
- ✅ **Graphiques historiques** (Recharts line charts)
- ✅ **Status indicators** (good/warning/danger)
- ✅ **Auto-refresh** (polling 30s)

### Gestion des Dispositifs

- ✅ **Liste des devices** LoRaWAN
- ✅ **Statut en ligne/hors ligne**
- ✅ **Informations techniques** (EUI, battery, location)
- ✅ **Enregistrement** de nouveaux devices

### Système d'Alertes

- ✅ **Multi-niveaux**: info, warning, critical
- ✅ **Types d'alertes**:
  - Water quality (pH hors limites, TDS élevé)
  - Fall detection (MPU6050)
  - Device offline (timeout)
- ✅ **Acknowledgement** des alertes
- ✅ **Historique** complet

---

## 🛠️ Technologies

### Frontend

- **Next.js 16**: React framework avec App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **Recharts**: Charts & graphiques
- **React-Leaflet**: Maps interactives
- **Axios**: HTTP client
- **Lucide React**: Icons

### Backend

- **Express**: Web framework
- **Mongoose**: MongoDB ODM
- **MQTT.js**: MQTT client
- **Redis**: Caching
- **Winston**: Logging
- **Joi**: Validation
- **Helmet**: Security

### DevOps

- **Vercel**: Hosting & serverless
- **MongoDB Atlas**: Cloud database
- **Upstash Redis**: Cloud cache
- **The Things Network**: LoRaWAN network server
- **GitHub**: Version control

---

## 🔐 Sécurité

### Variables d'Environnement

- ✅ Jamais commiter `.env` dans Git
- ✅ Utiliser Vercel Secrets pour production
- ✅ Rotation régulière des credentials
- ✅ HTTPS uniquement (automatique sur Vercel)

### MongoDB Atlas

- ✅ IP Whitelist: `0.0.0.0/0` (requis pour Vercel)
- ✅ Utilisateur avec mot de passe fort
- ✅ Connection string sécurisé

### MQTT (The Things Network)

- ✅ MQTTS (TLS) pour communication chiffrée
- ✅ Credentials stockés dans env vars
- ✅ API keys avec permissions limitées

---

## 📈 Performance

### Vercel Free Tier

- **Function timeout**: 10 secondes
- **Build time**: 5 minutes max
- **Bandwidth**: 100GB/mois
- **Deployments**: Illimités
- **Edge Network**: CDN global

### Optimisations

- ✅ MongoDB time-series collections
- ✅ Redis caching (Upstash)
- ✅ Next.js static generation
- ✅ Image optimization automatique
- ✅ Code splitting automatique

---

## 🐛 Dépannage

### Backend 503 Error

```bash
# Vérifier variables d'environnement
vercel env ls

# Vérifier logs
vercel logs

# Vérifier MongoDB Network Access (0.0.0.0/0)
```

### Frontend ne charge pas

```bash
# Vérifier NEXT_PUBLIC_API_URL
vercel env ls

# Vérifier CORS backend (doit être *)
```

### MQTT ne reçoit rien

```bash
# Tester manuellement
mqtt sub -h eu1.cloud.thethings.network -p 8883 \
  -t 'application/+/device/+/event/up' \
  -u '<app-id>@ttn' -P '<api-key>' --protocol mqtts

# Vérifier join status ESP32 dans TTN Console
```

---

## 🚦 Roadmap

### Court terme
- [x] Refactoring serverless Vercel
- [x] Polling HTTP au lieu de WebSocket
- [x] Documentation complète
- [ ] Tests unitaires (Jest)
- [ ] CI/CD (GitHub Actions)

### Moyen terme
- [ ] Authentification (NextAuth.js)
- [ ] Notifications email (SendGrid)
- [ ] Monitoring (Vercel Analytics)
- [ ] Rate limiting avancé
- [ ] API documentation (Swagger)

### Long terme
- [ ] Multi-tenancy (plusieurs puits)
- [ ] Mobile app (React Native)
- [ ] Machine learning (anomaly detection)
- [ ] FUOTA (Firmware Update Over The Air)
- [ ] Upgrade Vercel Pro

---

## 📞 Support

### Documentation Officielle

- **Vercel**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **The Things Network**: https://www.thethingsnetwork.org/docs
- **Upstash**: https://docs.upstash.com/redis

### Communauté

- **The Things Network Forum**: https://www.thethingsnetwork.org/forum
- **Next.js Discord**: https://nextjs.org/discord
- **Vercel Community**: https://vercel.com/support

---

## 📄 License

MIT License - Voir fichier `LICENSE`

---

## 👥 Authors

### 👤 **Adam Farjeoui** 

- 🌐 Website: [https://farjeoui-portfolio.vercel.app](https://farjeoui-portfolio.vercel.app)
- 💻 Github: [@adam-dev-hub](https://github.com/adam-dev-hub)
- 💼 LinkedIn: [@Adam Al Farjeoui](https://linkedin.com/in/adam-al-farjeoui)

### 👤 **Med Rayen Trabelsi**

- 🌐 Website: [https://www.trabelsimedrayen.tech](https://www.trabelsimedrayen.tech)
- 💻 Github: [@Mohamed Rayen Trabelsi](https://github.com/Mohamed-Rayen-Trabelsi)
- 💼 LinkedIn: [@Mohamed Rayen Trabelsi](https://linkedin.com/in/mohamed-rayen-trabelsi)

---

## ⭐ Show Your Support

- **The Things Network** pour l'infrastructure LoRaWAN gratuite
- **Vercel** pour l'hébergement serverless
- **MongoDB Atlas** pour la base de données cloud
- **Upstash** pour Redis cloud

---

**Status:** ✅ Production Ready  
**Version:** 1.0 Serverless  
**Dernière mise à jour:** 2026-01-26
