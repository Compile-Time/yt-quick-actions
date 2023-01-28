#!/usr/bin/env bash

SCRIPT_PATH="$(dirname -- "$0")"
ARCHIVE_DESTINATION='release-management/archives'

rm -rf "$SCRIPT_PATH"/archives/*.zip

pushd ../"$SCRIPT_PATH" || exit

rm -rf dist/

npm run build
npm run build-ch

pushd dist || exit
pushd firefox-prod || exit

zip -r -FS ../../"$ARCHIVE_DESTINATION"/yt-quick-actions-firefox.zip *

popd || exit
pushd chrome-prod || exit

zip -r -FS ../../"$ARCHIVE_DESTINATION"/yt-quick-actions-chrome.zip *

echo 'Successfully created archives!'
