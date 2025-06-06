# YT Quick Actions

YT Quick Actions is a web extension for YouTube making actions related to watch later playlist management quicker
to access.

Concretely, YT Quick Actions offers the following features:

- Add a remove button in playlists next to the more options button
- Add a watch later button as an action under videos
- Add a watch later button as an action in home page videos
- Add a watch later button as an action in the subscriptions feed
- Add a remove button for playlists being watched

Having problems with the extension? See the [FAQ](#faq) section for more
information.

## Permissions

The following permissions are required for the extension to work:

- Firefox
  - Host: `https://www.youtube.com/*`
    <br>Modify the YouTube web page to add custom elements and access the URL from YouTube tabs.
  - storage
    <br>Store extension settings in browser storage.
- Chrome
  - Host: `https://www.youtube.com/*`
    <br>Modify the YouTube web page to add custom elements.
  - storage
    <br>Store extension settings in browser storage.
  - tabs
    <br>Access the URL from YouTube tabs

## Screenshots

### Watch later button for home page video

![Home page watch later button](documentation/images/home_page_sample.png "Home page watch later button")

### Watch later button under playing video

![Watch later button under playing video](documentation/images/video_watch_later_sample.png "Watch later button under playing video")

### Remove button in watch later playlist

![Remove button in watch later playlist](documentation/images/watch_later_remove_sample.png "Remove button in watch later playlist")

### Remove button in currently playing playlist

![Remove button in currently playing playlist](documentation/images/watching_playlist_remove_sample.png "Remove button in currently playing playlist")

## Installation

- Firefox
  - From addons.mozilla.org: [AMO](https://addons.mozilla.org/en-US/firefox/addon/yt-quick-actions/)
  - From release page (manual): [Releases](https://github.com/Compile-Time/yt-quick-actions/releases)
- Google Chrome
  - From Chrome Web Store:
    [Chrome web store](https://chrome.google.com/webstore/detail/yt-quick-actions/lopaoogidddnpogjngfhbaklhdecmcii)
  - From release page (manual): [Releases](https://github.com/Compile-Time/yt-quick-actions/releases)

## Building

To build an unsigned extension for development testing, with or without hot
module reloading (HMR), run one of the `start` scripts mentioned below.

```sh
# Firefox
npm run start
npm run start-no-hmr

# Chrome
npm run start-ch
npm run start-no-hmr-ch
```

These script will produce the following directories under the `dist` directory
respectively:

- `/dist/firefox-dev`
- `/dist/chrome-dev`

For production builds that can be zipped for upload to [AMO](https://addons.mozilla.org/en-US/firefox/) or the
[Chrome web store](https://chrome.google.com/webstore/category/extensions) use the `build` scripts.

```sh
# Firefox
npm run build

# Chrome
npm run build-ch
```

The production builds can also be found under `/dist`:

- `/dist/firefox-prod`
- `/dist/chrome-prod`

## Build / CI tools

- `act` - The tool [`act`](https://nektosact.com/introduction.html) can be used to
  test the Github Action workflows of this project.
- `husky` - Run CI tasks locally (`commitlint`).
- `semantic-release` - Version bumping & release management.

## Changelog

Version changes can be found here: 
- Obsolete manual change log: [Obsolete CHANGELOG.md](manual-CHANGELOG-obsolete.md)
- [CHANGELOG.md](CHANGELOG.md)

## FAQ

### The extension is not working!

YT Quick Actions relies on existing icons present on the YouTube page to
perform the different quick actions it provides. If these icons are changed
in minor or major ways, the extension will fail to function.

Therefore, if the extension does not work for you, it would be nice if you
create an issue on this Github or write an E-Mail to `socialcoms@posteo.de`
or `socialcoms.ch@gmail.com` (E-Mail for the Chrome Webstore version).

### YouTube has a new design

In the case that YouTube updates their design or changes it in major ways,
it should be assumed that the extension will probably not function. The
reason why the extension might not function can be read up on in
[The extension is not working!](#the-extension-is-not-working)
