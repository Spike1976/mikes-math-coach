#!/bin/sh
set -eu
SRC_DIR="${1:-.}"
BACKUP_DIR="${2:-../mike_math_backups}"
mkdir -p "$BACKUP_DIR"
rm -f "$BACKUP_DIR/backup-05.zip"
[ ! -f "$BACKUP_DIR/backup-04.zip" ] || mv "$BACKUP_DIR/backup-04.zip" "$BACKUP_DIR/backup-05.zip"
[ ! -f "$BACKUP_DIR/backup-03.zip" ] || mv "$BACKUP_DIR/backup-03.zip" "$BACKUP_DIR/backup-04.zip"
[ ! -f "$BACKUP_DIR/backup-02.zip" ] || mv "$BACKUP_DIR/backup-02.zip" "$BACKUP_DIR/backup-03.zip"
[ ! -f "$BACKUP_DIR/backup-01.zip" ] || mv "$BACKUP_DIR/backup-01.zip" "$BACKUP_DIR/backup-02.zip"
(cd "$SRC_DIR" && zip -qr "$BACKUP_DIR/backup-01.zip" . -x 'app/build/*' '.gradle/*')
echo "Backup written to $BACKUP_DIR/backup-01.zip"