# Script de Demarrage du Projet IoT Water Quality Dashboard
# Ce script lance automatiquement le backend et le frontend

Write-Host "Water Quality Monitoring Dashboard - Demarrage..." -ForegroundColor Cyan
Write-Host ""

# Vérifier que nous sommes dans le bon dossier
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# 1. Lancer le Backend dans une nouvelle fenêtre PowerShell
Write-Host "Backend Server - Demarrage (Port 3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; Write-Host 'Backend Server' -ForegroundColor Green; npm run dev"

# Attendre que le backend démarre
Write-Host "Attente du demarrage du backend (5 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 2. Lancer le Frontend dans une nouvelle fenêtre PowerShell
Write-Host "Frontend Server - Demarrage (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; Write-Host 'Frontend Server' -ForegroundColor Cyan; npm run dev"

# Attendre que le frontend démarre
Write-Host "Attente du demarrage du frontend (10 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 3. Ouvrir le navigateur
Write-Host "Ouverture du navigateur..." -ForegroundColor Magenta
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Projet demarre avec succes!" -ForegroundColor Green
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:3001/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Le backend fonctionne sans base de donnees (mode test)" -ForegroundColor Yellow
Write-Host "   Les API retourneront des donnees vides mais l'interface fonctionnera." -ForegroundColor Yellow
Write-Host ""
Write-Host "Pour arreter les serveurs: Fermez les fenetres PowerShell du backend et frontend" -ForegroundColor Red
Write-Host ""
Write-Host "Appuyez sur une touche pour fermer cette fenetre..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
