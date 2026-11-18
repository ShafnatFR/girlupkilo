#!/bin/bash
# Auto-sync GirlUpKilo dari GitHub ke VPS
# Jalankan via crontab setiap 5 menit

set -e

REPO_DIR="/home/ubuntu/girlupkilo"
LOG_FILE="/home/ubuntu/girlupkilo/logs/auto-sync.log"
BRANCH="main"

mkdir -p "$(dirname "$LOG_FILE")"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

cd "$REPO_DIR" || { log "ERROR: tidak bisa cd ke $REPO_DIR"; exit 1; }

# Fetch terbaru dari origin
git fetch origin "$BRANCH" >> "$LOG_FILE" 2>&1

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" = "$REMOTE" ]; then
  log "Sudah sinkron (HEAD=$LOCAL)"
  exit 0
fi

log "Deteksi perubahan: lokal=$LOCAL remote=$REMOTE -> pull & rebuild"

# Pull perubahan
git pull origin "$BRANCH" >> "$LOG_FILE" 2>&1

# Hapus build lama, build ulang
rm -rf .next
npm run build >> "$LOG_FILE" 2>&1

# Restart PM2 dengan env baru
pm2 restart girlupkilo --update-env >> "$LOG_FILE" 2>&1

log "Deploy selesai"
