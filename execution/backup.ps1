$projectDir = "C:\Users\USUARIO\Desktop\Medicando"
$backupRoot = "$projectDir\Backup"
$dateStr = Get-Date -Format "dd-MM-yyyy; HH-mm-ss"
$backupPath = "$backupRoot\Backup em $dateStr"

if (-not (Test-Path $backupRoot)) { New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null }
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

Copy-Item -Path "$projectDir\*" -Destination $backupPath -Recurse -Force -Exclude "node_modules",".next",".git","Backup",".tmp"

Write-Output "Backup concluido: $backupPath"
