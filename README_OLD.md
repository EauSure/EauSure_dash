# Water Quality Monitoring Dashboard

> 🌊 Système IoT autonome de surveillance de la qualité de l'eau pour puits et réservoirs profonds avec LoRaWAN

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

## 📋 Description

Système IoT de monitoring en temps réel de la qualité de l'eau avec:
- **Capteurs**: pH, TDS (Total Dissolved Solids)
- **Sécurité**: Détection de chute avec accéléromètre MPU6050
- **Communication**: LoRaWAN (ESP32-S3) via The Things Network
- **Dashboard**: Interface web temps réel avec Next.js
- **Alertes**: Notifications automatiques pour anomalies

## 🏗️ Architecture

### Stack Technique

**Frontend (Next.js 16)**
- Framework: Next.js avec App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Charts: Recharts
- Maps: React-Leaflet
- Déploiement: Vercel Edge

**Backend (Express Serverless)**
- Runtime: Node.js + Express
- Language: TypeScript
- API: REST (HTTP Polling 30s)
- MQTT: Client pour LoRaWAN uplinks
- Déploiement: Vercel Functions

**Database & Cache**
- MongoDB Atlas (Cloud)
  - Time-series collections pour IoT data
  - Indexes optimisés
- Upstash Redis (Cloud)
  - Cache des métriques
  - Rate limiting

**IoT Infrastructure**
- LoRaWAN: The Things Network v3
- Device: ESP32-S3 + pH sensor + TDS sensor + MPU6050
- Protocol: LoRaWAN 1.0.3
- Frequency: EU868 / US915

### Fonctionnalités

- ✅ Surveillance pH et TDS en temps réel (polling 30s)
- ✅ Détection de chute avec alerte critique (MPU6050)
- ✅ Dashboard responsive avec métriques
- ✅ Gestion multi-dispositifs LoRaWAN
- ✅ Système d'alertes multi-niveaux (info, warning, critical)
- ✅ Stockage optimisé MongoDB Time-Series
- ✅ Auto-scaling Vercel serverless
- ✅ HTTPS et CDN global

## 🚀 Déploiement Rapide (15 minutes)

### Option 1: Déploiement Cloud (Recommandé)

**Suivre le guide:** [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

```bash
# 1. Créer comptes cloud (5 min)
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Upstash Redis: https://upstash.com
- The Things Network: https://console.cloud.thethings.network

# 2. Déployer backend (5 min)
cd backend
vercel --prod
# Configurer variables d'environnement via Vercel dashboard

# 3. Déployer frontend (3 min)
cd frontend
vercel --prod
# Configurer NEXT_PUBLIC_API_URL

# 4. Configurer ESP32-S3 (2 min)
# Voir QUICK_DEPLOY.md section "Configuration ESP32-S3"
```

### Option 2: Développement Local
cp .env.example .env
# Éditer .env avec vos configurations
```

### 3. Démarrer l'infrastructure Docker

```bash
# Démarrer tous les services (ChirpStack, MongoDB, Redis, Mosquitto, Grafana)
docker-compose up -d

# Vérifier que tous les conteneurs sont en cours d'exécution
docker-compose ps
```

**Services disponibles:**
- ChirpStack UI: http://localhost:8080
- Grafana: http://localhost:3001 (admin/admin)
- MongoDB: localhost:27017
- Redis: localhost:6379
- MQTT Broker: localhost:1883

### 4. Installer les dépendances

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 5. Lancer l'application

**Backend (en mode développement):**
```bash
cd backend
npm run dev
```

**Frontend (en mode développement):**
```bash
cd frontend
npm run dev
```

L'application sera accessible sur:
- Frontend: http://localhost:5173
- Backend API: http://localho3000
- Backend API: http://localhost:3000/api
## 📁 Structure du Projet

```
pfedash/
├── frontend/                 # Application React
│   ├── src/Next.js
│   ├── app/                 # App Router (pages)
│   ├── components/          # Composants réutilisables
│   ├── lib/                 # Services (API, WebSocket)
│   └── package.json
│
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── models/          # Modèles Mongooseroutes/          # Routes API
│   │   ├── services/        # Services (MQTT, Database)
│   │   └── index.ts
│   └── package.json
│
├── docker/                   # Configurations Docker
│   ├── chirpstack/          # Config ChirpStack
│   ├── mosquitto/           # Config MQTT
│   └── grafana/             # Provisioning Grafana
│
└── docker-compose.yml        # Orchestration des services
```

## 🔧 Configuration LoRaWAN

### Option 1 : The Things Network (Gratuit)
1. Créez un compte sur https://www.thethingsnetwork.org/
2. Créez une application
3. Enregistrez vos dispositifs avec leur DevEUI
4. Configurez l'intégration MQTT

### Option 2 : ChirpStack Cloud
1. Utilisez ChirpStack Cloud (payant)
2. Ou déployez ChirpStack localement avec un tunnel (ngrok)

### Ajouter vos dispositifs
1. Enregistrez le DevEUI de votre ESP32-S3
2. Configurez le Device Profile (LoRaWAN 1.0.3 ou 1.1)
3. Notez les clés AppKey et NwkKey

### 4. Format des données

**Message de qualité d'eau (0x01):**
```
Byte 0: 0x01 (Type de message)
Byte 1-2: pH × 100 (uint16, big-endian)
Byte 3-4: TDS en ppm (uint16, big-endian)
Byte 5: Batterie % (uint8)
```

**Alerte de chute (0x02):**
```
Byte 0: 0x02 (Type de message)
Byte 1-6: Données accéléromètre (optionnel)
```

## 📊 Utilisation de Grafana

1. Accédez à http://localhost:3001
2. Login: `admin` / `admin`
3. Les datasources sont déjà configurées (InfluxDB + PostgreSQL)
4. Configurez la datasource MongoDB
4. Créez vos propres dashboard
## 🔌 API Endpoints

### Qualité de l'eau
- `GET /api/water-quality?deviceId=xxx&limit=50` - Récupérer l'historique

### Dispositifs
- `GET /api/devices` - Liste des dispositifs

### Alertes
- `GET /api/alerts?severity=critical` - Liste des alertes
- `PATCH /api/alerts/:id/acknowledge` - Acquitter une alerte

### WebSocket Events
- `waterQuality` - Nouvelles données de qualité
- `alert` - Nouvelle alerte
- `deviceStatus` - Changement de statut

## 🛠️ Développement

### Build local

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Déploiement automatique
Chaque push sur GitHub déclenche un déploiement automatique sur Vercel.

## 📱 Dispositif IoT (ESP32-S3)

### Composants requis
- ESP32-S3 avec support LoRaWAN
- Module LoRa (SX1276/SX1262)
- Capteur TDS
- Capteur pH
- MPU6050 (accéléromètre)
- Batterie Li-SOCl2

### Librairies Arduino
- LMIC (LoRaWAN)
- Adafruit MPU6050
- DFRobot pH/TDS sensors

## 🔐 Sécurité

- Utiliser HTTPS en production
- Changer les mots de passe par défaut
- Configurer l'authentification ChirpStack
- Activer le chiffrement LoRaWAN (AppKey, NwkKey)

## 📝 Licence

Ce projet est sous licence MIT.

## 👥 Contributeurs

Projet PFE - Surveillance IoT de la qualité de l'eau

## 🆘 Support

Pour toute question ou problème:
1. Vérifier les logs: `docker-compose logs -f`
2. Consulter la documentation ChirpStack
3. Vérifier les connexions MQTT avec un client MQTT

---

**Bon monitoring! 💧📊**
