# [1.2.0](https://github.com/Compile-Time/yt-quick-actions/compare/1.1.7...1.2.0) (2026-01-21)


### Bug Fixes

* `video` script fails when opening a video in a new tab ([004a3aa](https://github.com/Compile-Time/yt-quick-actions/commit/004a3aaebb6b3d80e64d47890df6337e0ba8385b))
* Bugs in video script ([8e502ed](https://github.com/Compile-Time/yt-quick-actions/commit/8e502edf631a807641f2cd180be1f98408623ac2))
* eslint config wasn't working ([29b9b3e](https://github.com/Compile-Time/yt-quick-actions/commit/29b9b3e038dcaed7a44f38e36d610026f0dd7eb1))
* Home page watch later elements should not be cleaned up ([0651725](https://github.com/Compile-Time/yt-quick-actions/commit/0651725a6d901cf0c3645ebaae9358f461fc7272))
* Improve popup detection and observer initialization in video script ([b4cd49d](https://github.com/Compile-Time/yt-quick-actions/commit/b4cd49d4ef4f7f7a3c6bfac834f436e1d0789345))
* Improve scroll-to button placement on even lower screen widths ([e44b5fa](https://github.com/Compile-Time/yt-quick-actions/commit/e44b5fa0cf6591d6d786198e19d843f7328c2511))
* Increase scroll to elements bottom distance ([1e1f944](https://github.com/Compile-Time/yt-quick-actions/commit/1e1f944733dabd2b6c493ef804374f59e5e11c2b))
* Manifest error in chrome ([83d7662](https://github.com/Compile-Time/yt-quick-actions/commit/83d76626d910b19a8c22df53202cf37c42d1c4ab))
* Playlist scroll to breaks after return from home page ([c38025f](https://github.com/Compile-Time/yt-quick-actions/commit/c38025f4fa5ecdd41781d702fe3f986835415ab9))
* Playlist scroll to buttons are not responsive ([4ff6b53](https://github.com/Compile-Time/yt-quick-actions/commit/4ff6b530f57d2c3080567f2890da1b66cafe8091))
* Popups don't work in playlist content script ([5f18dd9](https://github.com/Compile-Time/yt-quick-actions/commit/5f18dd9ea94c19d772a2e156511824ad03ae8545))
* Resolve eslint warnings/errors ([11d06fa](https://github.com/Compile-Time/yt-quick-actions/commit/11d06fa46607c18de3dece8b028620985a6fdae2))
* Resolve type errors ([95976fe](https://github.com/Compile-Time/yt-quick-actions/commit/95976fec615d220e5c1267d420418a8cad282e99))
* Use `textContent` over `innerText` for possibly hidden elements ([7110c5a](https://github.com/Compile-Time/yt-quick-actions/commit/7110c5a09c828fd66c7e14119946aeeb3e2829b3))
* Video script needs to read both playlist and video search strings ([bb209bc](https://github.com/Compile-Time/yt-quick-actions/commit/bb209bce16bd07698c91847df4d46b6f80d6e2a3))
* Video script watch later action can break ([6caf7c9](https://github.com/Compile-Time/yt-quick-actions/commit/6caf7c9342d816aee27850ff1d9b96e8143385df))
* Watch later elements leak into other playlists (e.g. likes) ([8be16a9](https://github.com/Compile-Time/yt-quick-actions/commit/8be16a916a850a10266ef3a26ea40bf7188b5eb2))
* Watch later icon is added inconsistently in video script ([59f8acc](https://github.com/Compile-Time/yt-quick-actions/commit/59f8acc47b60e6efce61a5808986ecd0e4783331))


### Features

* Add button for scrolling to end of playlist ([5bba050](https://github.com/Compile-Time/yt-quick-actions/commit/5bba0500af1fba6ebd5652519025d6aa85b7dee8))
* Add options UI for disabling extension features in the future ([8e6d6ad](https://github.com/Compile-Time/yt-quick-actions/commit/8e6d6ad90365c70c7fc3aaa1df4d1ff2f9cb4582))
* Add translation support and translate search strings component ([12d08ef](https://github.com/Compile-Time/yt-quick-actions/commit/12d08ef1a9ab363d192bfde0cb89b10e6a594b65))
* Disable content script when all of its features are disabled ([47d0c73](https://github.com/Compile-Time/yt-quick-actions/commit/47d0c7364830db794cad7e249a8429d6170aed72))
* Integrate disabling of specific page features ([7ec4762](https://github.com/Compile-Time/yt-quick-actions/commit/7ec4762318a055a619c2c3f01d8916182b734cec))
* Logging support during runtime ([729d910](https://github.com/Compile-Time/yt-quick-actions/commit/729d91072f0be12fda48ebcfa5ab816dd60df9ae))
* Move to top or bottom quick action for playlist ([d624842](https://github.com/Compile-Time/yt-quick-actions/commit/d6248429d212761b28c8a181c91d32273bf78d29))
* Place playlist scroll to end button closer to scrollable content ([e5b812d](https://github.com/Compile-Time/yt-quick-actions/commit/e5b812d1b9fa013be82c97af78278dc10029a3fb))
* Scroll to top/bottom in playlist and watching-playlist scripts ([5b3d3c1](https://github.com/Compile-Time/yt-quick-actions/commit/5b3d3c105f1d174e3bf5f55f551159caad909174))
* Search string can be used for home/subscription page ([2eb1e61](https://github.com/Compile-Time/yt-quick-actions/commit/2eb1e61076b9ac5b7a0e8910aa241b49edb26958))
* Search string can be used for playlist page ([fd8afde](https://github.com/Compile-Time/yt-quick-actions/commit/fd8afde6abc773db3a2998c9831490092626f5d6))
* Search strings settings for actions ([5ea5c28](https://github.com/Compile-Time/yt-quick-actions/commit/5ea5c28500d7a0d918e4788f275f80cbd0c2b67b))
* Split home and subscription watch later disabled states ([da6e1c1](https://github.com/Compile-Time/yt-quick-actions/commit/da6e1c1e9526edccb730af406b5cdcee1bb604ae))
* Use search strings for vidoe content script ([21212c3](https://github.com/Compile-Time/yt-quick-actions/commit/21212c35295b4726aa053dca9ff83c3c95d396f3))
* Use search strings for watching playlist script ([e9ba948](https://github.com/Compile-Time/yt-quick-actions/commit/e9ba9485202b85f2083f34d40b83b4798e0fbbb4))

## [1.1.7](https://github.com/Compile-Time/yt-quick-actions/compare/1.1.6...1.1.7) (2025-10-26)


### Bug Fixes

* Home page script fails when clicking on YouTube logo ([d3bf390](https://github.com/Compile-Time/yt-quick-actions/commit/d3bf390633c0f0f0df52eadbed37bf80b0ea71c8))

## [1.1.6](https://github.com/Compile-Time/yt-quick-actions/compare/1.1.5...1.1.6) (2025-10-26)


### Bug Fixes

* Close observers if they are not needed anymore or an error occurred ([24807ae](https://github.com/Compile-Time/yt-quick-actions/commit/24807ae4f5b1cbdf98bfbd8ad219e4a4c73cc327))
* Deletion of playlist items not working when watching the watch later playlist ([dcbc428](https://github.com/Compile-Time/yt-quick-actions/commit/dcbc428f181063517c3d6e26d4fe0fda1f7c646b))
* Implement save from dedicated save playlist button in video script ([4c9cb63](https://github.com/Compile-Time/yt-quick-actions/commit/4c9cb63d1bcbed498de5d783924f58b7b3083be1))
* New home script was broken by new playlist script changes ([b8766cf](https://github.com/Compile-Time/yt-quick-actions/commit/b8766cf0847aec41a379d1032e34f52a9eca344a))
* Re-work home page script for new design ([131d2c4](https://github.com/Compile-Time/yt-quick-actions/commit/131d2c49a4dd227566df85cddc4b18a7f1fb7767))
* Remove button is being added to video actions when watching a playlist ([9f3d474](https://github.com/Compile-Time/yt-quick-actions/commit/9f3d4744f287a08bf6dd93961fb4769be8615e33))
* Subscription page watch later action not working ([fc607a5](https://github.com/Compile-Time/yt-quick-actions/commit/fc607a5d4c406e3a1f96be8e1748001a6ca75240))
* Watch later button under videos is not working for menu flow ([f7bf55f](https://github.com/Compile-Time/yt-quick-actions/commit/f7bf55f248978dbd78ce5fbd5f321e2821dc12a9))

## [1.1.5](https://github.com/Compile-Time/yt-quick-actions/compare/1.1.4...1.1.5) (2025-10-24)


### Bug Fixes

* Support the latest trash icon for the playlist view ([b9c34ea](https://github.com/Compile-Time/yt-quick-actions/commit/b9c34eaca66cd8d80507eae2f06c2228364ef470))

## [1.1.4](https://github.com/Compile-Time/yt-quick-actions/compare/1.1.3...1.1.4) (2025-06-07)


### Bug Fixes

* Bump manifest*.json version on release ([34d4106](https://github.com/Compile-Time/yt-quick-actions/commit/34d410666d72bed57d3c2696de01b25c4f91caa3))

## [1.1.3](https://github.com/Compile-Time/yt-quick-actions/compare/1.1.2...1.1.3) (2025-06-07)


### Bug Fixes

* Release commit fails because of too long body ([da1c6dc](https://github.com/Compile-Time/yt-quick-actions/commit/da1c6dcd3db53ba90c119518cf049fca7482473f))
* Set a specific node version in the commitlint workflow ([97b3a00](https://github.com/Compile-Time/yt-quick-actions/commit/97b3a00ed4025a4847dfc992f6620c9d1d8fb47d))
