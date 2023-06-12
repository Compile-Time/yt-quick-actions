#!/usr/bin/env bash

SCRIPT_PATH="$(dirname -- "$0")"

ARCHIVE_DESTINATION='release-management/archives'
ARCHIVE_FIREFOX='yt-quick-actions-firefox.zip'
ARCHIVE_FIREFOX_CHECKSUM='yt-quick-actions-firefox.sha512sum'
ARCHIVE_CHROME='yt-quick-actions-chrome.zip'
ARCHIVE_CHROME_CHECKSUM='yt-quick-actions-chrome.sha512sum'

rm -f "$SCRIPT_PATH"/archives/"$ARCHIVE_FIREFOX"
rm -f "$SCRIPT_PATH"/archives/"$ARCHIVE_CHROME_CHECKSUM"
rm -f "$SCRIPT_PATH"/archives/"$ARCHIVE_CHROME"
rm -f "$SCRIPT_PATH"/archives/"$ARCHIVE_CHROME_CHECKSUM"

pushd ../"$SCRIPT_PATH" || exit

rm -rf dist/

npm run build
npm run build-ch

pushd dist || exit
pushd firefox-prod || exit

zip -r -FS ../../"$ARCHIVE_DESTINATION"/"$ARCHIVE_FIREFOX" *

popd || exit
pushd chrome-prod || exit

zip -r -FS ../../"$ARCHIVE_DESTINATION"/"$ARCHIVE_CHROME" *

popd || exit
popd || exit

pushd "$ARCHIVE_DESTINATION" || exit
sha512sum "$ARCHIVE_FIREFOX" > "$ARCHIVE_FIREFOX_CHECKSUM"
sha512sum "$ARCHIVE_CHROME"  > "$ARCHIVE_CHROME_CHECKSUM"

echo 'Successfully created archives!'
