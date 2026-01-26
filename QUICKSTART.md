# Guide de Démarrage Rapide

## 🎯 Démarrer le projet en 5 minutes

### 1. Configurer les services cloud (une seule fois)

**MongoDB Atlas** (gratuit) :
1. https://www.mongodb.com/cloud/atlas
2. Créez un cluster M0 (gratuit)
3. Copiez l'URI de connexion

**Upstash Redis** (gratuit) :
1. https://upstash.com/
2. Créez une base Redis
3. Copiez l'URL Redis

### 2. Copier les fichiers d'environnement
```bash
# Backend
cd backend
copy .env.example .env

# Frontend
cd ..\frontend
copy .env.example .env
```

### 3. Installer les dépendances
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 4. Démarrer en développement

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Accéder à l'application

- **Dashboard Web**: http://localhost:3000
- **API Backend**: http://localhost:3000/api

## ✅ Vérification

Ouvrez http://localhost:3000 - Vous devriez voir le dashboard de surveillance de la qualité de l'eau.

## 🔧 Configuration ChirpStack (Optionnel)
� Déployer sur Vercel

### Déploiement en 2 commandes

```bash
# Frontend
cd frontend
vercel

# Backend
cd backend
vercel
```

Configurez les variables d'environnement dans le dashboard Vercel.

📖 **Guide détaillé** : [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

## 🐛 Dépannage

### Le backend ne se connecte pas à MongoDB
- Vérifiez votre URI MongoDB Atlas
- Autorisez l'IP 0.0.0.0/0 dans MongoDB Atlas Network Access

### Erreur de connexion Redis
- Vérifiez l'URL Upstash Redis
- Testez la connexion depuis le dashboard Upstash

### Le frontend ne peut pas se connecter au backend
- Vérifiez que `NEXT_PUBLIC_API_URL` est correctement configuré
- Vérifiez le CORS dans le backend
### Le backend ne se connecte pas aux bases de données
Vérifiez que tous les conteneurs Docker sont en cours d'exécution:
```bash
docker-compose ps
```

### Le frontend ne peut pas se connecter au backend
Vérifiez que le backend est bien démarré sur le port 3000.

## 📚 Documentation complète

Consultez le [README.md](README.md) pour la documentation complète.
