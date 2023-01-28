#!/usr/bin/env bash

SCRIPT_DIR="$(dirname -- "$0")"

RELEASE_DIR='release-management'
ARCHIVE_DESTINATION="$RELEASE_DIR/archives"
ARCHIVE_NAME="yt-quick-actions-source-code-firefox.zip"

rm -f "$SCRIPT_DIR/archives/$ARCHIVE_NAME"

pushd "../$SCRIPT_DIR" || exit

zip -r -FS \
  "$ARCHIVE_DESTINATION"/"$ARCHIVE_NAME" \
  * \
  -x@"$RELEASE_DIR"/firefox-exclude.lst
