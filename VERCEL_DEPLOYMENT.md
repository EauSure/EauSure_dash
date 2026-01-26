# Vercel Deployment Guide

## 🚀 Déploiement sur Vercel

### Prérequis
- Compte Vercel (gratuit)
- Compte MongoDB Atlas (gratuit)
- Compte Redis Cloud / Upstash (gratuit)
- Compte MQTT Cloud (HiveMQ Cloud gratuit ou équivalent)

---

## 📦 Étape 1 : Configuration des Services Cloud

### MongoDB Atlas
1. Allez sur https://www.mongodb.com/cloud/atlas
2. Créez un cluster gratuit (M0)
3. Configurez un utilisateur de base de données
4. Autorisez l'accès depuis n'importe où (0.0.0.0/0) pour Vercel
5. Copiez votre URI de connexion :
   ```
   mongodb+srv://username:password@cluster.mongodb.net/water_quality
   ```

### Redis Cloud (Upstash - Recommandé pour Vercel)
1. Allez sur https://upstash.com/
2. Créez une base Redis gratuite
3. Copiez l'URL de connexion :
   ```
   redis://default:password@region.upstash.io:port
   ```

### MQTT Broker Cloud (HiveMQ Cloud)
1. Allez sur https://www.hivemq.com/mqtt-cloud-broker/
2. Créez un cluster gratuit
3. Configurez les credentials
4. Notez l'URL du broker :
   ```
   mqtt://your-instance.hivemq.cloud:1883
   ```

---

## 🔧 Étape 2 : Déploiement Backend

### Via Vercel CLI
```bash
cd backend

# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel
```

### Via Vercel Dashboard
1. Allez sur https://vercel.com/new
2. Importez votre repository GitHub
3. Sélectionnez le dossier `/backend`
4. Configurez les variables d'environnement :
   - `MONGODB_URI`
   - `REDIS_URL`
   - `MQTT_BROKER`
   - `MQTT_USERNAME`
   - `MQTT_PASSWORD`
   - `CORS_ORIGIN` (URL de votre frontend)
   - `NODE_ENV=production`

5. Déployez !

---

## 🎨 Étape 3 : Déploiement Frontend

### Via Vercel CLI
```bash
cd frontend

# Déployer
vercel
```

### Via Vercel Dashboard
1. Importez le même repository
2. Sélectionnez le dossier `/frontend`
3. Framework Preset : **Next.js**
4. Configurez les variables d'environnement :
   - `NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api`
   - `NEXT_PUBLIC_SOCKET_URL=https://your-backend.vercel.app`

5. Déployez !

---

## ⚙️ Étape 4 : Configuration Post-Déploiement

### Mettre à jour le CORS
Dans votre backend Vercel, ajoutez l'URL de votre frontend :
```env
CORS_ORIGIN=https://your-frontend.vercel.app
```

### ChirpStack Cloud (Alternative à Docker)
Pour la gateway LoRaWAN :
- Option 1 : **The Things Network** (gratuit) - https://www.thethingsnetwork.org/
- Option 2 : **ChirpStack Cloud** - https://www.chirpstack.io/
- Option 3 : Garder ChirpStack en local avec tunnel (ngrok)

---

## 🔄 Déploiement Continu

Vercel se met automatiquement à jour à chaque push sur GitHub :
- `main` branch → Production
- Autres branches → Preview deployments

---

## 📊 Monitoring

### Logs Vercel
```bash
vercel logs <deployment-url>
```

### MongoDB Atlas Monitoring
- Utilisez le dashboard MongoDB Atlas pour surveiller les requêtes

### Upstash Monitoring
- Dashboard Upstash pour voir l'utilisation Redis

---

## 💰 Coûts (Tier Gratuit)

| Service | Limite Gratuite |
|---------|----------------|
| Vercel | 100 GB bandwidth/mois |
| MongoDB Atlas | 512 MB storage |
| Upstash Redis | 10,000 commandes/jour |
| HiveMQ Cloud | 25 connexions simultanées |

---

## 🚨 Limitations Vercel Serverless

⚠️ **WebSocket Limitations** : Vercel serverless functions ont un timeout de 10s (hobby) / 60s (pro).

**Solution recommandée pour WebSocket** :
1. Utiliser **Pusher** (https://pusher.com/) - Gratuit jusqu'à 100 connexions
2. Utiliser **Ably** (https://ably.com/) - Gratuit jusqu'à 6M messages/mois
3. Déployer le serveur WebSocket séparé sur **Railway** ou **Render**

### Adapter le code pour Pusher (Exemple)
```typescript
// Backend : Envoyer événements via Pusher au lieu de Socket.io
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
});

// Au lieu de io.emit()
pusher.trigger('water-quality', 'alert', alertData);
```

---

## ✅ Checklist de Déploiement

- [ ] MongoDB Atlas configuré
- [ ] Redis Upstash configuré  
- [ ] MQTT Cloud configuré
- [ ] Backend déployé sur Vercel
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] Tests effectués sur production
- [ ] Alternative WebSocket configurée (Pusher/Ably)

---

## 🆘 Dépannage

### Erreur de connexion MongoDB
- Vérifiez que l'IP 0.0.0.0/0 est autorisée dans MongoDB Atlas
- Vérifiez le format de l'URI (doit inclure `?retryWrites=true&w=majority`)

### Erreur CORS
- Assurez-vous que `CORS_ORIGIN` correspond exactement à l'URL frontend

### Timeout Vercel
- Les fonctions serverless ont un timeout de 10s (hobby)
- Optimisez les requêtes lourdes
- Utilisez des services externes pour tâches longues

---

Bon déploiement ! 🚀
