#!/usr/bin/env bash

SCRIPT_PATH="$(dirname -- "$0")"

ARCHIVE_DESTINATION='release-management/archives'
ARCHIVE_FIREFOX_NAME='yt-quick-actions-firefox.zip'
ARCHIVE_CHROME_NAME='yt-quick-actions-chrome.zip'

rm -f "$SCRIPT_PATH"/archives/"$ARCHIVE_FIREFOX_NAME"
rm -f "$SCRIPT_PATH"/archives/"$ARCHIVE_CHROME_NAME"

pushd ../"$SCRIPT_PATH" || exit

rm -rf dist/

npm run build
npm run build-ch

pushd dist || exit
pushd firefox-prod || exit

zip -r -FS ../../"$ARCHIVE_DESTINATION"/"$ARCHIVE_FIREFOX_NAME" *

popd || exit
pushd chrome-prod || exit

zip -r -FS ../../"$ARCHIVE_DESTINATION"/"$ARCHIVE_CHROME_NAME" *

echo 'Successfully created archives!'
