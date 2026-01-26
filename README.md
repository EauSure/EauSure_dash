# Water Quality Monitoring Dashboard

## 📋 Description
Système IoT autonome de surveillance de la qualité de l'eau pour puits et réservoirs profonds, avec détection de chute et analyse en temps réel.

## 🏗️ Architecture

### Stack Technique
- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS (Vercel)
- **Backend**: Node.js + Express + TypeScript (Vercel Serverless)
- **Base de données**: MongoDB Atlas (Cloud)
- **Cache**: Redis Cloud / Upstash
- **IoT**: ChirpStack Cloud ou The Things Network + MQTT Cloud
- **Déploiement**: Vercel (Frontend + Backend)

### Fonctionnalités
- ✅ Surveillance en temps réel du pH et TDS
- ✅ Détection de chute avec alerte critique (MPU6050)
- ✅ Dashboard Next.js avec Server Components et Client Components
- ✅ Gestion des dispositifs LoRaWAN
- ✅ Système d'alertes multi-niveaux
- ✅ Communication WebSocket pour notifications instantanées
- ✅ Stockage optimisé avec MongoDB Time-Series Collections
- ✅ Support FUOTA (Firmware Update Over The Air)

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm
- Docker & Docker Compose
- Git

### 1. Cloner le projet
```bash
git clone <repository-url>
cd pfedash
```

### 2. Configuration des variables d'environnement

**Backend:**
```bash
cd backend
cp .env.example .env
# Éditer .env avec vos configurations
```

**Frontend:**
```bash
cd frontend
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
