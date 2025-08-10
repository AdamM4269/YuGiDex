# Nettoyage du dossier 'dist'
if (Test-Path "./dist") {
    Write-Host "Suppression du dossier dist/..."
    Remove-Item -Recurse -Force "./dist"
} else {
    Write-Host "Le dossier dist/ n'existe pas. Rien à supprimer."
}

# Transpilation TypeScript
Write-Host "Compilation TypeScript en cours..."
tsc

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Compilation réussie."
} else {
    Write-Host "❌ Erreur lors de la compilation."
}