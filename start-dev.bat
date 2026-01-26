@echo off
REM Script de démarrage simplifié (Windows Batch)
REM Lance le script PowerShell

powershell -ExecutionPolicy Bypass -File "%~dp0start-dev.ps1"
