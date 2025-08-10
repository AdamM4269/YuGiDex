# Ouvrir deux consoles séparées pour tsc -w et npx serve .
Start-Process powershell -ArgumentList "tsc -w"
Start-Process powershell -ArgumentList "npx serve ."

# Attendre un peu que le serveur démarre (ajuster si nécessaire)
Start-Sleep -Seconds 2

# Ouvrir Firefox sur l'URL locale
Start-Process "firefox.exe" "http://localhost:3000"
