# 🧪 Guide de Test du Projet

## 🚀 Démarrage Rapide (Automatique)

### Windows

**Double-cliquez sur:** `start-dev.bat`

ou

**Dans PowerShell:**
```powershell
.\start-dev.ps1
```

Le script va automatiquement:
1. ✅ Lancer le backend (port 3001)
2. ✅ Lancer le frontend (port 3000)  
3. ✅ Ouvrir votre navigateur sur http://localhost:3000

---

## 🔧 Démarrage Manuel

### Option 1: Deux Terminaux Séparés

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

Puis ouvrir: http://localhost:3000

---

## ✅ Ce qui fonctionne en mode test (sans DB)

- ✅ Backend démarre sur port 3001
- ✅ Frontend démarre sur port 3000
- ✅ Interface Dashboard s'affiche correctement
- ✅ Navigation entre pages (/, /devices, /alerts)
- ✅ Polling HTTP (toutes les 30s)
- ✅ Endpoint `/api/health` retourne `{"status":"ok"}`

## ⚠️ Limitations en mode test

- ⚠️ Pas de données dans les graphiques (MongoDB non connecté)
- ⚠️ API retourne `[]` (tableaux vides)
- ⚠️ Pas de cache Redis
- ⚠️ Pas de messages MQTT

---

## 📊 Test avec Vraies Données (Optionnel)

Pour tester avec de vraies données, configurer:

### 1. MongoDB Atlas (Gratuit)

```powershell
# Éditer backend\.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/water_quality
```

1. Créer compte: https://www.mongodb.com/cloud/atlas
2. Créer cluster M0 (gratuit)
3. Network Access: Ajouter `0.0.0.0/0`
4. Copier URI de connexion

### 2. Upstash Redis (Optionnel)

```powershell
# Éditer backend\.env
REDIS_URL=rediss://default:password@region.upstash.io:6379
```

1. Créer compte: https://upstash.com
2. Créer Redis database
3. Copier URL

### 3. Redémarrer le Backend

```powershell
cd backend
npm run dev
```

---

## 🧪 Tests de l'API

### Backend Health Check

```powershell
curl http://localhost:3001/api/health
# {"status":"ok","timestamp":"2026-01-26..."}
```

### Water Quality Data

```powershell
curl http://localhost:3001/api/water-quality
# [] (vide sans MongoDB)
```

### Devices

```powershell
curl http://localhost:3001/api/devices
# [] (vide sans MongoDB)
```

### Alerts

```powershell
curl http://localhost:3001/api/alerts
# [] (vide sans MongoDB)
```

---

## 🌐 Pages Frontend

Après démarrage, tester:

- **Dashboard**: http://localhost:3000
- **Devices**: http://localhost:3000/devices
- **Alerts**: http://localhost:3000/alerts

---

## 🛑 Arrêter les Serveurs

### Via Script

Fermer les fenêtres PowerShell du backend et frontend

### Manuel

Dans chaque terminal: `Ctrl + C`

---

## 🐛 Dépannage

### "Port 3000 déjà utilisé"

```powershell
# Trouver le processus
netstat -ano | findstr :3000

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

### "Port 3001 déjà utilisé"

```powershell
# Trouver le processus
netstat -ano | findstr :3001

# Tuer le processus
taskkill /PID <PID> /F
```

### Backend ne démarre pas

```powershell
cd backend
npm install
npm run build
npm run dev
```

### Frontend ne démarre pas

```powershell
cd frontend
npm install
npm run build
npm run dev
```

---

## 📸 Captures d'Écran Attendues

### Dashboard
- 4 cartes de métriques (pH, TDS, Status, Alertes)
- Graphique historique (vide sans données)
- Couleurs: vert (bon), jaune (warning), rouge (danger)

### Devices
- Tableau vide (sans MongoDB)
- Bouton "Ajouter dispositif"

### Alerts
- Liste vide (sans MongoDB)
- Message "Aucune alerte active"

---

## ✅ Checklist de Test

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] http://localhost:3000 accessible
- [ ] Dashboard s'affiche correctement
- [ ] Navigation vers /devices fonctionne
- [ ] Navigation vers /alerts fonctionne
- [ ] Console navigateur: Pas d'erreurs critiques
- [ ] Polling toutes les 30s visible dans DevTools > Network

---

## 🚀 Prochaines Étapes

Après test local réussi:

1. **Déployer sur Vercel**: Voir [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
2. **Configurer MongoDB Atlas**: Pour vraies données
3. **Configurer ESP32-S3**: Pour capteurs IoT
4. **Configurer The Things Network**: Pour LoRaWAN

---

**Date:** 2026-01-26  
**Mode:** Test Local (Sans DB)  
**Statut:** ✅ Prêt à tester
