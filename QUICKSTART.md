# Guide de Démarrage Rapide

## 🎯 Démarrer le projet en 5 minutes

### 1. Lancer l'infrastructure Docker
```bash
docker-compose up -d
```

Attendez que tous les services démarrent (environ 30-60 secondes).

### 2. Copier les fichiers d'environnement
```bash
# Backend
cd backend
copy .env.example .env

# Frontend
cd ..\frontend
copy .env.example .env
```

### 3. Démarrer le Backend
```bash
cd backend
npm run dev
```

Le backend démarrera sur http://localhost:3000

### 4. Démarrer le Frontend (nouveau terminal)
```bash
cd frontend
npm run dev
```

Le frontend démarrera sur http://localhost:5173

### 5. Accéder aux interfaces

- **Dashboard Web**: http://localhost:5173
- **ChirpStack (LoRaWAN)**: http://localhost:8080 (admin/admin)
- **Grafana**: http://localhost:3001 (admin/admin)

## ✅ Vérification

Ouvrez http://localhost:5173 - Vous devriez voir le dashboard de surveillance de la qualité de l'eau.

## 🔧 Configuration ChirpStack (Optionnel)

Si vous avez des dispositifs LoRaWAN:

1. Accédez à http://localhost:8080
2. Créez une application "Water Quality"
3. Ajoutez vos dispositifs avec leurs DevEUI
4. Les données apparaîtront automatiquement dans le dashboard

## 🐛 Dépannage

### Les services Docker ne démarrent pas
```bash
docker-compose logs -f
```

### Le backend ne se connecte pas aux bases de données
Vérifiez que tous les conteneurs Docker sont en cours d'exécution:
```bash
docker-compose ps
```

### Le frontend ne peut pas se connecter au backend
Vérifiez que le backend est bien démarré sur le port 3000.

## 📚 Documentation complète

Consultez le [README.md](README.md) pour la documentation complète.
