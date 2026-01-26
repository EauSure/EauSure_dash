# Architecture du Système

## Vue d'ensemble

```
┌─────────────────┐
│   ESP32-S3      │
│  (Capteurs +    │
│   LoRaWAN)      │
└────────┬────────┘
         │ LoRaWAN
         ▼
┌─────────────────┐
│   Gateway DIY   │
│   (LoRaWAN)     │
└────────┬────────┘
         │ IP/Ethernet
         ▼
┌─────────────────┐
│  ChirpStack     │◄──── Configuration Web UI
│  LoRa Server    │
└────────┬────────┘
         │ MQTT
         ▼
┌─────────────────┐
│   Mosquitto     │
│   MQTT Broker   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│   Backend API   │◄────►│  InfluxDB    │
│  (Node.js +     │      │  (Séries     │
│   WebSocket)    │      │   temp.)     │
└────────┬────────┘      └──────────────┘
         │               ┌──────────────┐
         ├──────────────►│  PostgreSQL  │
         │               │  (Relational)│
         │               └──────────────┘
         │               ┌──────────────┐
         └──────────────►│    Redis     │
                         │   (Cache)    │
                         └──────────────┘
         │
         ▼
┌─────────────────┐
│   Frontend      │
│   Dashboard     │
│  (React + WS)   │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│    Grafana      │◄──── Dashboards avancés
│   Monitoring    │
└─────────────────┘
```

## Flux de Données

### 1. Données de Capteurs (Mesure normale)
```
ESP32 → LoRa → Gateway → ChirpStack → MQTT → Backend → InfluxDB
                                               ↓
                                           WebSocket → Frontend
```

### 2. Alerte de Chute Détectée
```
MPU6050 → ESP32 → LoRa → Gateway → ChirpStack → MQTT → Backend
                                                          ↓
                                                    PostgreSQL (alerte)
                                                          ↓
                                                      WebSocket
                                                          ↓
                                                    Frontend (notification)
```

## Composants

### Dispositif IoT (Sphère flottante)
- **MCU**: ESP32-S3
- **Communication**: LoRaWAN (868MHz EU / 915MHz US)
- **Capteurs**:
  - TDS (Total Dissolved Solids)
  - pH
  - MPU6050 (Accéléromètre 3 axes)
- **Alimentation**: Batteries Li-SOCl2 (8-10 ans)
- **Mode**: Deep-sleep avec Wake-on-Motion

### Infrastructure Backend
- **ChirpStack**: Serveur LoRaWAN (gestion devices, FUOTA)
- **Mosquitto**: Broker MQTT pour communication temps réel
- **Node.js API**: 
  - Routes REST pour données historiques
  - WebSocket pour notifications temps réel
  - Décodage des payloads LoRa
  - Logique d'alertes
- **Bases de données**:
  - InfluxDB: Stockage optimisé séries temporelles
  - PostgreSQL: Dispositifs, alertes, utilisateurs
  - Redis: Cache, sessions, pub/sub

### Frontend
- **React + TypeScript**: Interface utilisateur
- **Recharts**: Graphiques temps réel
- **React-Leaflet**: Carte des puits
- **WebSocket**: Mises à jour en direct
- **Tailwind CSS**: Styling moderne

### Monitoring
- **Grafana**: Dashboards personnalisés
- **Winston Logger**: Logs centralisés

## Protocole LoRaWAN

### Format des Messages

**Type 0x01 - Données de qualité d'eau (régulier)**
```
Offset | Length | Type   | Description
-------|--------|--------|-------------
0      | 1      | uint8  | Type (0x01)
1      | 2      | uint16 | pH × 100
3      | 2      | uint16 | TDS (ppm)
5      | 1      | uint8  | Batterie (%)
```

**Type 0x02 - Alerte de chute (urgent)**
```
Offset | Length | Type   | Description
-------|--------|--------|-------------
0      | 1      | uint8  | Type (0x02)
1      | 6      | int16  | Accel X,Y,Z (optionnel)
```

### Gestion Énergétique
- **Deep-sleep**: 99% du temps
- **Transmission**: Toutes les 30 min (qualité eau)
- **Wake-on-Motion**: MPU6050 réveille ESP32
- **Alerte immédiate**: En cas de chute détectée

## Sécurité

### LoRaWAN
- Chiffrement AES-128
- AppKey + NwkKey unique par device
- Authentification OTAA (Over-The-Air Activation)

### API
- CORS configuré
- Helmet.js (headers sécurisés)
- Rate limiting
- Validation des entrées (Joi)

## Scalabilité

- Multi-dispositifs supporté
- MQTT pub/sub pour distribution
- InfluxDB optimisé pour millions de points
- Redis pour mise en cache
- Docker Compose pour déploiement simple

## Maintenance

### FUOTA (Firmware Update Over The Air)
ChirpStack supporte la mise à jour firmware à distance via LoRaWAN.

### Anti-Fouling
Algorithmes dans le firmware pour protéger les sondes pH/TDS.

### Monitoring
- Grafana dashboards
- Alertes automatiques (qualité, batterie faible, device offline)
- Logs centralisés
