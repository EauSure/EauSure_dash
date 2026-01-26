# Water Quality Monitoring Dashboard

## 📋 Description
Système IoT autonome de surveillance de la qualité de l'eau pour puits et réservoirs profonds, avec détection de chute et analyse en temps réel.

## 🏗️ Architecture

### Stack Technique
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Bases de données**:
  - InfluxDB - Données de séries temporelles (capteurs)
  - PostgreSQL - Données relationnelles (dispositifs, alertes)
  - Redis - Cache et gestion temps réel
- **IoT**: ChirpStack LoRaWAN + Mosquitto MQTT
- **Monitoring**: Grafana
- **DevOps**: Docker Compose

### Fonctionnalités
- ✅ Surveillance en temps réel du pH et TDS
- ✅ Détection de chute avec alerte critique (MPU6050)
- ✅ Dashboard interactif avec graphiques temps réel
- ✅ Gestion des dispositifs LoRaWAN
- ✅ Système d'alertes multi-niveaux
- ✅ Communication WebSocket pour notifications instantanées
- ✅ Historique des données avec InfluxDB
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
# Démarrer tous les services (ChirpStack, InfluxDB, PostgreSQL, Redis, Mosquitto, Grafana)
docker-compose up -d

# Vérifier que tous les conteneurs sont en cours d'exécution
docker-compose ps
```

**Services disponibles:**
- ChirpStack UI: http://localhost:8080
- Grafana: http://localhost:3001 (admin/admin)
- InfluxDB: http://localhost:8086
- PostgreSQL: localhost:5432
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
- Backend API: http://localhost:3000

## 📁 Structure du Projet

```
pfedash/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages principales
│   │   ├── services/        # API et WebSocket
│   │   └── App.tsx
│   └── package.json
│
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── routes/          # Routes API
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

## 🔧 Configuration ChirpStack

### 1. Accéder à ChirpStack
Ouvrez http://localhost:8080 et connectez-vous:
- Username: `admin`
- Password: `admin`

### 2. Créer une Application
1. Allez dans Applications → Add Application
2. Nom: "Water Quality Monitoring"
3. Configurez l'intégration MQTT

### 3. Ajouter vos dispositifs
1. Dans votre application, cliquez sur "Add Device"
2. Entrez le DevEUI de votre ESP32-S3
3. Configurez le Device Profile (LoRaWAN 1.0.3 ou 1.1)

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
4. Créez vos propres dashboards ou importez des templates

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

### Build pour production

**Frontend:**
```bash
cd frontend
npm run build
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
