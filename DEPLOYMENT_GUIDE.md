# 🚀 Guide de Déploiement Vercel - Water Quality Dashboard

## 📋 Prérequis

- ✅ Compte Vercel (gratuit sur vercel.com)
- ✅ Compte GitHub (pour connecter le repo)
- ✅ MongoDB Atlas configuré (déjà fait)
- ✅ Git installé localement

---

## 🔧 Étape 1 : Préparer le Projet Git

### 1.1 Initialiser Git (si pas déjà fait)
```bash
cd C:\Users\HerrRayen\Desktop\pfedash
git init
git add .
git commit -m "Initial commit - Water Quality Dashboard"
```

### 1.2 Créer un Repository GitHub
1. Allez sur https://github.com/new
2. Nom du repo : `water-quality-dashboard` (ou autre)
3. **Privé ou Public** selon préférence
4. Ne pas initialiser avec README (déjà fait localement)
5. Créer le repository

### 1.3 Pousser le Code
```bash
git remote add origin https://github.com/VOTRE_USERNAME/water-quality-dashboard.git
git branch -M main
git push -u origin main
```

---

## 🌐 Étape 2 : Déployer le Backend

### 2.1 Importer dans Vercel
1. Allez sur https://vercel.com/new
2. Cliquez sur **"Import Git Repository"**
3. Sélectionnez votre repo GitHub
4. Cliquez sur **"Import"**

### 2.2 Configurer le Backend
**Settings du Projet Backend** :
- **Project Name** : `water-quality-backend`
- **Framework Preset** : `Other`
- **Root Directory** : `backend`
- **Build Command** : (laisser vide)
- **Output Directory** : (laisser vide)
- **Install Command** : `npm install`

### 2.3 Variables d'Environnement Backend
Allez dans **Settings** → **Environment Variables** et ajoutez :

```env
MONGODB_URI=mongodb+srv://rayen:pfe2026istic@cluster0.paakjum.mongodb.net/water_quality?retryWrites=true&w=majority
JWT_SECRET=your-backend-jwt-secret-key
PORT=3001
NODE_ENV=production
```

**Générer JWT_SECRET** :
```powershell
$bytes = New-Object byte[] 32; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [Convert]::ToBase64String($bytes)
```

### 2.4 Déployer
1. Cliquez sur **"Deploy"**
2. Attendez la fin du build (2-3 minutes)
3. **Notez l'URL** : `https://water-quality-backend.vercel.app`

---

## 💻 Étape 3 : Déployer le Frontend

### 3.1 Créer un Nouveau Projet Vercel
1. Retournez sur https://vercel.com/new
2. Importez le **même repository GitHub**
3. Cliquez sur **"Import"**

### 3.2 Configurer le Frontend
**Settings du Projet Frontend** :
- **Project Name** : `water-quality-dashboard` (ou autre nom)
- **Framework Preset** : `Next.js`
- **Root Directory** : `frontend`
- **Build Command** : `npm run build`
- **Output Directory** : `.next`
- **Install Command** : `npm install`

### 3.3 Variables d'Environnement Frontend
Allez dans **Settings** → **Environment Variables** et ajoutez :

```env
NEXT_PUBLIC_API_URL=https://water-quality-backend.vercel.app/api
NEXTAUTH_URL=https://VOTRE-FRONTEND-URL.vercel.app
NEXTAUTH_SECRET=ZXAfMc+oddPJnWdSkh6MAYCtbLuIHpyHydXnizxDUtU=
```

**⚠️ Important** : 
- Pour `NEXTAUTH_URL`, utilisez l'URL qui sera générée après le premier déploiement
- Vous pouvez la modifier après dans Settings

**Générer un nouveau NEXTAUTH_SECRET pour production** :
```powershell
$bytes = New-Object byte[] 32; (New-Object Security.Cryptography.RNGCryptoServiceProvider).GetBytes($bytes); [Convert]::ToBase64String($bytes)
```

### 3.4 Déployer
1. Cliquez sur **"Deploy"**
2. Attendez la fin du build (3-5 minutes)
3. **Notez l'URL générée** : `https://water-quality-dashboard-xxx.vercel.app`

### 3.5 Mettre à jour NEXTAUTH_URL
1. Copiez l'URL générée
2. Allez dans **Settings** → **Environment Variables**
3. Modifiez `NEXTAUTH_URL` avec l'URL exacte
4. Cliquez sur **"Redeploy"** → **"Redeploy with same settings"**

---

## 🔐 Étape 4 : Configurer MongoDB Atlas (si pas déjà fait)

### 4.1 Whitelist Vercel IPs
1. Allez sur MongoDB Atlas → **Network Access**
2. Cliquez sur **"Add IP Address"**
3. Sélectionnez **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Confirmez

### 4.2 Vérifier la Connection String
```
mongodb+srv://rayen:pfe2026istic@cluster0.paakjum.mongodb.net/water_quality?retryWrites=true&w=majority
```

---

## ✅ Étape 5 : Vérifier le Déploiement

### 5.1 Tester le Backend
Ouvrez : `https://water-quality-backend.vercel.app/api/health`

Devrait retourner :
```json
{
  "status": "ok",
  "timestamp": "2026-01-27T..."
}
```

### 5.2 Tester le Frontend
1. Ouvrez : `https://VOTRE-FRONTEND-URL.vercel.app`
2. Devrait afficher la page de login
3. Connectez-vous avec : `admin@waterquality.com` / `admin123`

### 5.3 Créer un Compte Admin (via Backend)
Si le compte admin n'existe pas :

1. Créez un fichier temporaire `create-admin-vercel.js` localement
2. Modifiez `MONGODB_URI` pour pointer vers Atlas
3. Exécutez : `node create-admin-vercel.js`

Ou utilisez MongoDB Compass pour créer l'utilisateur directement.

---

## 🔄 Étape 6 : Déploiements Futurs

### Déploiement Automatique
Vercel redéploie automatiquement à chaque push sur `main` :

```bash
git add .
git commit -m "Update: description des changements"
git push
```

### Déploiement Manuel
Dans le Dashboard Vercel :
1. Allez sur le projet
2. Cliquez sur **"Deployments"**
3. Cliquez sur **"Redeploy"**

---

## 🐛 Dépannage

### Problème : 404 Error
- Vérifiez que **Root Directory** = `frontend` (pas la racine)
- Vérifiez que les routes Next.js sont bien dans `app/`

### Problème : Build Failed
- Vérifiez les logs de build dans Vercel
- Vérifiez que `npm run build` fonctionne localement
- Vérifiez les variables d'environnement

### Problème : Cannot Connect to Database
- Vérifiez que MongoDB Atlas autorise les connexions (0.0.0.0/0)
- Vérifiez `MONGODB_URI` dans les variables d'environnement

### Problème : NextAuth Errors
- Vérifiez que `NEXTAUTH_URL` correspond exactement à l'URL du site
- Vérifiez que `NEXTAUTH_SECRET` est défini
- Redéployez après modification des variables

---

## 📝 Résumé des URLs

| Service | URL | Variables d'Environnement |
|---------|-----|---------------------------|
| **Frontend** | `https://VOTRE-APP.vercel.app` | NEXT_PUBLIC_API_URL, NEXTAUTH_URL, NEXTAUTH_SECRET |
| **Backend** | `https://VOTRE-BACKEND.vercel.app` | MONGODB_URI, JWT_SECRET, PORT, NODE_ENV |
| **MongoDB** | `cluster0.paakjum.mongodb.net` | Configuré dans MONGODB_URI |

---

## 🎉 C'est Terminé !

Votre application est maintenant déployée et accessible en ligne !

**Prochaines étapes** :
- ✅ Tester toutes les fonctionnalités
- ✅ Configurer un domaine personnalisé (optionnel)
- ✅ Activer les analytics Vercel
- ✅ Configurer les alertes de monitoring

---

## 🔗 Liens Utiles

- **Vercel Dashboard** : https://vercel.com/dashboard
- **Documentation Next.js** : https://nextjs.org/docs
- **MongoDB Atlas** : https://cloud.mongodb.com
- **Vercel CLI** : `npm i -g vercel`

---

**Besoin d'aide ?** Consultez les logs de déploiement dans Vercel Dashboard → Deployments → [Votre Déploiement] → Build Logs
