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
         │ Internet
         ▼
┌─────────────────┐
│ The Things      │◄──── Console Web (gratuit)
│ Network / TTN   │
└────────┬────────┘
         │ MQTT / Webhooks
         ▼
┌─────────────────┐      ┌──────────────┐
│   Backend API   │◄────►│ MongoDB Atlas│
│  (Vercel        │      │   (Cloud)    │
│   Serverless)   │      └──────────────┘
└────────┬────────┘      ┌──────────────┐
         └──────────────►│ Upstash Redis│
                         │   (Cloud)    │
                         └──────────────┘
         │
         ▼
┌─────────────────┐
│    Next.js      │
│   Dashboard     │
│ (Vercel Deploy) │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ MongoDB Atlas   │◄──── Monitoring intégré
│   Dashboard     │
└─────────────────┘
```

## Flux de Données

### 1. Données de Capteurs (Mesure normale)
```
ESP32 → LoRa → Gateway → ChirpStack → MQTT → Backend → MongoDB
                                               ↓
                                           WebSocket → Next.js
```

### 2. Alerte de Chute Détectée
```
MPU6050 → ESP32 → LoRa → Gateway → ChirpStack → MQTT → Backend
                                                          ↓
                                                    MongoDB (alerte)
                                                          ↓
                                                      WebSocket
                                                          ↓
                                                     Next.js (notification)
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

### Infrastructure Cloud
- **The Things Network**: Serveur LoRaWAN gratuit (gestion devices)
- **HiveMQ Cloud / MQTT Cloud**: Broker MQTT cloud
- **Node.js API (Vercel Serverless)**: 
  - Routes REST pour données historiques
  - Décodage des payloads LoRa
  - Logique d'alertes
  - Alternative WebSocket : Pusher ou Ably
- **Bases de données Cloud**:
  - MongoDB Atlas: Collections time-series pour données capteurs
  - MongoDB Atlas: Collections classiques pour devices et alertes
  - Upstash Redis: Cache, sessions

### Frontend
- **Next.js + TypeScript**: App Router moderne
- **Server Components**: Optimisation des performances
- **Client Components**: Interactivité (charts, WebSocket)
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

- MongoDB time-series optimisé pour IoT
- Redis pour mise en cache
- Docker Compose pour déploiement simple
- Next.js avec edge runtime readynts
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
