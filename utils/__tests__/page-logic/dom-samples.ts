export const homeRowTopicsSectionHtml = `
<ytd-rich-section-renderer class="style-scope ytd-rich-grid-renderer"><!--css-build:shady-->
  <!--css_build_scope:ytd-rich-section-renderer-->
  <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
  <div id="content" class="style-scope ytd-rich-section-renderer">
    <ytd-chips-shelf-with-video-shelf-renderer class="ytdChipsShelfWithVideoShelfRendererHost">
      <div>
        <div class="ytdChipsShelfWithVideoShelfRendererHeader">
          <yt-section-header-view-model class="ytSectionHeaderViewModelHost">
            <yt-shelf-header-layout class="yt-shelf-header-layout yt-shelf-header-layout--disable-horizontal-padding">
              <div class="yt-shelf-header-layout__header-row">
                <div class="yt-shelf-header-layout__label-container">
                  <div class="yt-shelf-header-layout__title-row"><h2 class="yt-shelf-header-layout__title"><span
                    style="" class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                    role="text">Explore more topics</span></h2></div>
                </div>
                <div class="yt-shelf-header-layout__trailing-actions">
                  <yt-flexible-actions-view-model
                    class="ytFlexibleActionsViewModelHost ytFlexibleActionsViewModelInline">
                    <div class="ytFlexibleActionsViewModelAction ytFlexibleActionsViewModelActionIconOnlyButton">
                      <button-view-model class="ytSpecButtonViewModelHost">
                        <button
                          class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                          title="" style="" aria-label="More actions" aria-disabled="false">
                          <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                            class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                            class="yt-icon-shape ytSpecIconShapeHost"><div
                            style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                            focusable="false" aria-hidden="true"
                            style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                            d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                          </div>
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                          </yt-touch-feedback-shape>
                        </button>
                      </button-view-model>
                    </div>
                  </yt-flexible-actions-view-model>
                </div>
              </div>
            </yt-shelf-header-layout>
          </yt-section-header-view-model>
        </div>
        <div class="ytdChipsShelfWithVideoShelfRendererChipsShelf">
          <chips-shelf-view-model class="ytChipsShelfViewModelHost">
            <div>
              <div class="ytChipsShelfViewModelChipsShelfContent ytChipsShelfViewModelGradientButton">
                <div class="ytChipsShelfViewModelLeftArrowContainer ytChipsShelfViewModelLeftArrowContainerIsHidden">
                  <button-view-model class="ytSpecButtonViewModelHost ytChipsShelfViewModelLeftArrow">
                    <button
                      class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                      title="" style="" aria-label="Previous" aria-disabled="false">
                      <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span class="ytIconWrapperHost"
                                                                                            style="width: 24px; height: 24px;"><span
                        class="yt-icon-shape ytSpecIconShapeHost"><div
                        style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                        xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false"
                        aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                        d="M13.793 5.293 7.086 12l6.707 6.707a1 1 0 101.414-1.414L9.914 12l5.293-5.293a1 1 0 10-1.414-1.414Z"></path></svg></div></span></span>
                      </div>
                      <yt-touch-feedback-shape aria-hidden="true"
                                               class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                        <div class="yt-spec-touch-feedback-shape__stroke"></div>
                        <div class="yt-spec-touch-feedback-shape__fill"></div>
                      </yt-touch-feedback-shape>
                    </button>
                  </button-view-model>
                </div>
                <div
                  class="ytChipsShelfViewModelChipsScrollContainer ytChipsShelfViewModelChipsScrollContainerIsHorizontallyScrollable">
                  <div role="tablist"
                       class="ytChipsShelfViewModelChipsContainer ytChipsShelfViewModelChipsContainerIsHorizontallyScrollable">
                    <div class="ytChipsShelfViewModelChipWrapper">
                      <chip-view-model class="ytChipViewModelHost">
                        <chip-shape class="ytChipShapeHost">
                          <button class="ytChipShapeButtonReset" role="tab" aria-label="Deadlock" aria-selected="true">
                            <div class="ytChipShapeChip ytChipShapeActive ytChipShapeOnlyTextPadding">Deadlock
                              <yt-touch-feedback-shape aria-hidden="true"
                                                       class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                <div class="yt-spec-touch-feedback-shape__stroke" style="border-radius: 8px;"></div>
                                <div class="yt-spec-touch-feedback-shape__fill" style="border-radius: 8px;"></div>
                              </yt-touch-feedback-shape>
                            </div>
                          </button>
                        </chip-shape>
                      </chip-view-model>
                    </div>
                    <div class="ytChipsShelfViewModelChipWrapper">
                      <chip-view-model class="ytChipViewModelHost">
                        <chip-shape class="ytChipShapeHost">
                          <button class="ytChipShapeButtonReset" role="tab" aria-label="Streamer chat interactions"
                                  aria-selected="false">
                            <div class="ytChipShapeChip ytChipShapeInactive ytChipShapeOnlyTextPadding">Streamer chat
                              interactions
                              <yt-touch-feedback-shape aria-hidden="true"
                                                       class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                <div class="yt-spec-touch-feedback-shape__stroke" style="border-radius: 8px;"></div>
                                <div class="yt-spec-touch-feedback-shape__fill" style="border-radius: 8px;"></div>
                              </yt-touch-feedback-shape>
                            </div>
                          </button>
                        </chip-shape>
                      </chip-view-model>
                    </div>
                    <div class="ytChipsShelfViewModelChipWrapper">
                      <chip-view-model class="ytChipViewModelHost">
                        <chip-shape class="ytChipShapeHost">
                          <button class="ytChipShapeButtonReset" role="tab" aria-label="Alan Wake II insights"
                                  aria-selected="false">
                            <div class="ytChipShapeChip ytChipShapeInactive ytChipShapeOnlyTextPadding">Alan Wake II
                              insights
                              <yt-touch-feedback-shape aria-hidden="true"
                                                       class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                <div class="yt-spec-touch-feedback-shape__stroke" style="border-radius: 8px;"></div>
                                <div class="yt-spec-touch-feedback-shape__fill" style="border-radius: 8px;"></div>
                              </yt-touch-feedback-shape>
                            </div>
                          </button>
                        </chip-shape>
                      </chip-view-model>
                    </div>
                    <div class="ytChipsShelfViewModelChipWrapper">
                      <chip-view-model class="ytChipViewModelHost">
                        <chip-shape class="ytChipShapeHost">
                          <button class="ytChipShapeButtonReset" role="tab" aria-label="Indie horror adaptation"
                                  aria-selected="false">
                            <div class="ytChipShapeChip ytChipShapeInactive ytChipShapeOnlyTextPadding">Indie horror
                              adaptation
                              <yt-touch-feedback-shape aria-hidden="true"
                                                       class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                <div class="yt-spec-touch-feedback-shape__stroke" style="border-radius: 8px;"></div>
                                <div class="yt-spec-touch-feedback-shape__fill" style="border-radius: 8px;"></div>
                              </yt-touch-feedback-shape>
                            </div>
                          </button>
                        </chip-shape>
                      </chip-view-model>
                    </div>
                    <div class="ytChipsShelfViewModelChipWrapper">
                      <chip-view-model class="ytChipViewModelHost">
                        <chip-shape class="ytChipShapeHost">
                          <button class="ytChipShapeButtonReset" role="tab" aria-label="Terraria game mods"
                                  aria-selected="false">
                            <div class="ytChipShapeChip ytChipShapeInactive ytChipShapeOnlyTextPadding">Terraria game
                              mods
                              <yt-touch-feedback-shape aria-hidden="true"
                                                       class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                <div class="yt-spec-touch-feedback-shape__stroke" style="border-radius: 8px;"></div>
                                <div class="yt-spec-touch-feedback-shape__fill" style="border-radius: 8px;"></div>
                              </yt-touch-feedback-shape>
                            </div>
                          </button>
                        </chip-shape>
                      </chip-view-model>
                    </div>
                    <div class="ytChipsShelfViewModelChipWrapper">
                      <chip-view-model class="ytChipViewModelHost">
                        <chip-shape class="ytChipShapeHost">
                          <button class="ytChipShapeButtonReset" role="tab" aria-label="Indie boomer shooters"
                                  aria-selected="false">
                            <div class="ytChipShapeChip ytChipShapeInactive ytChipShapeOnlyTextPadding">Indie boomer
                              shooters
                              <yt-touch-feedback-shape aria-hidden="true"
                                                       class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                <div class="yt-spec-touch-feedback-shape__stroke" style="border-radius: 8px;"></div>
                                <div class="yt-spec-touch-feedback-shape__fill" style="border-radius: 8px;"></div>
                              </yt-touch-feedback-shape>
                            </div>
                          </button>
                        </chip-shape>
                      </chip-view-model>
                    </div>
                    <div class="ytChipsShelfViewModelChipWrapper">
                      <chip-view-model class="ytChipViewModelHost">
                        <chip-shape class="ytChipShapeHost">
                          <button class="ytChipShapeButtonReset" role="tab" aria-label="Minecraft mod spotlights"
                                  aria-selected="false">
                            <div class="ytChipShapeChip ytChipShapeInactive ytChipShapeOnlyTextPadding">Minecraft mod
                              spotlights
                              <yt-touch-feedback-shape aria-hidden="true"
                                                       class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                <div class="yt-spec-touch-feedback-shape__stroke" style="border-radius: 8px;"></div>
                                <div class="yt-spec-touch-feedback-shape__fill" style="border-radius: 8px;"></div>
                              </yt-touch-feedback-shape>
                            </div>
                          </button>
                        </chip-shape>
                      </chip-view-model>
                    </div>
                    <div class="ytChipsShelfViewModelChipWrapper">
                      <chip-view-model class="ytChipViewModelHost">
                        <chip-shape class="ytChipShapeHost">
                          <button class="ytChipShapeButtonReset" role="tab" aria-label="Comic book deep dives"
                                  aria-selected="false">
                            <div class="ytChipShapeChip ytChipShapeInactive ytChipShapeOnlyTextPadding">Comic book deep
                              dives
                              <yt-touch-feedback-shape aria-hidden="true"
                                                       class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                <div class="yt-spec-touch-feedback-shape__stroke" style="border-radius: 8px;"></div>
                                <div class="yt-spec-touch-feedback-shape__fill" style="border-radius: 8px;"></div>
                              </yt-touch-feedback-shape>
                            </div>
                          </button>
                        </chip-shape>
                      </chip-view-model>
                    </div>
                  </div>
                </div>
                <div class="ytChipsShelfViewModelRightArrowContainer">
                  <button-view-model class="ytSpecButtonViewModelHost ytChipsShelfViewModelRightArrow">
                    <button
                      class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                      title="" style="" aria-label="Next" aria-disabled="false">
                      <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span class="ytIconWrapperHost"
                                                                                            style="width: 24px; height: 24px;"><span
                        class="yt-icon-shape ytSpecIconShapeHost"><div
                        style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                        xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false"
                        aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                        d="M8.793 5.293a1 1 0 000 1.414L14.086 12l-5.293 5.293a1 1 0 101.414 1.414L16.914 12l-6.707-6.707a1 1 0 00-1.414 0Z"></path></svg></div></span></span>
                      </div>
                      <yt-touch-feedback-shape aria-hidden="true"
                                               class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                        <div class="yt-spec-touch-feedback-shape__stroke"></div>
                        <div class="yt-spec-touch-feedback-shape__fill"></div>
                      </yt-touch-feedback-shape>
                    </button>
                  </button-view-model>
                </div>
              </div>
            </div>
          </chips-shelf-view-model>
        </div>
        <div>
          <ytd-rich-shelf-renderer elements-per-row="3" is-inner-shelf="" is-header-hidden="" show-bottom-divider=""
                                   restrict-contents-overflow=""
                                   style="--ytd-rich-shelf-items-count: 6; --ytd-rich-grid-items-per-row: 3; --ytd-rich-grid-item-margin: 16px;"
                                   has-expansion-button=""><!--css-build:shady-->
            <!--css_build_scope:ytd-rich-shelf-renderer-->
            <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
            <div id="dismissible" class="style-scope ytd-rich-shelf-renderer">
              <div id="rich-shelf-header-container" class="style-scope ytd-rich-shelf-renderer">
                <div id="rich-shelf-header" class="style-scope ytd-rich-shelf-renderer">
                  <h2 class="style-scope ytd-rich-shelf-renderer">

                    <yt-icon id="icon" class="style-scope ytd-rich-shelf-renderer" disable-upgrade="" hidden="">
                    </yt-icon>
                    <yt-img-shadow id="avatar" class="style-scope ytd-rich-shelf-renderer no-transition" hidden="">
                      <!--css-build:shady--><!--css_build_scope:yt-img-shadow-->
                      <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_img_shadow.yt.img.shadow.css.js--><img
                      id="img" draggable="false" class="style-scope yt-img-shadow" alt=""></yt-img-shadow>
                    <div id="title-container" class="style-scope ytd-rich-shelf-renderer">
                      <div id="title-text" class="style-scope ytd-rich-shelf-renderer">
                        <span id="title" class="style-scope ytd-rich-shelf-renderer"></span>
                        <ytd-badge-supported-renderer id="featured-badge" class="style-scope ytd-rich-shelf-renderer"
                                                      system-icons="" use-badge-shape="" hidden="">
                          <!--css-build:shady--><!--css_build_scope:ytd-badge-supported-renderer-->
                          <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
                          <dom-repeat id="repeat" as="badge" class="style-scope ytd-badge-supported-renderer">
                            <template is="dom-repeat"></template>
                          </dom-repeat>
                        </ytd-badge-supported-renderer>
                      </div>
                      <div id="subtitle-text" class="style-scope ytd-rich-shelf-renderer">
                        <ytd-badge-supported-renderer id="paygated-featured-badge"
                                                      class="style-scope ytd-rich-shelf-renderer" system-icons=""
                                                      use-badge-shape="" hidden=""><!--css-build:shady-->
                          <!--css_build_scope:ytd-badge-supported-renderer-->
                          <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
                          <dom-repeat id="repeat" as="badge" class="style-scope ytd-badge-supported-renderer">
                            <template is="dom-repeat"></template>
                          </dom-repeat>
                        </ytd-badge-supported-renderer>
                        <yt-formatted-string id="subtitle" class="style-scope ytd-rich-shelf-renderer" is-empty="">
                          <!--css-build:shady--><!--css_build_scope:yt-formatted-string-->
                          <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_formatted_string.yt.formatted.string.css.js-->
                          <yt-attributed-string class="style-scope yt-formatted-string"></yt-attributed-string>
                        </yt-formatted-string>
                      </div>
                    </div>
                    <dom-if class="style-scope ytd-rich-shelf-renderer">
                      <template is="dom-if"></template>
                    </dom-if>
                    <dom-if class="style-scope ytd-rich-shelf-renderer">
                      <template is="dom-if"></template>
                    </dom-if>
                  </h2>
                  <div id="menu-container" class="style-scope ytd-rich-shelf-renderer">
                    <div class="cta-button-container style-scope ytd-rich-shelf-renderer" hidden="">
                      <ytd-button-renderer class="cta-button style-scope ytd-rich-shelf-renderer" button-renderer=""
                                           button-next=""><!--css-build:shady-->
                        <yt-button-shape></yt-button-shape>
                        <tp-yt-paper-tooltip offset="8" disable-upgrade=""></tp-yt-paper-tooltip>
                      </ytd-button-renderer>
                    </div>
                    <div id="menu" class="style-scope ytd-rich-shelf-renderer"></div>
                    <yt-button-view-model id="previous-button" class="style-scope ytd-rich-shelf-renderer">
                    </yt-button-view-model>
                    <yt-button-view-model id="next-button" class="style-scope ytd-rich-shelf-renderer">
                    </yt-button-view-model>
                  </div>
                </div>
                <div id="cta-bottom-button-container" class="style-scope ytd-rich-shelf-renderer" hidden="">
                  <ytd-button-renderer class="cta-button style-scope ytd-rich-shelf-renderer" button-renderer=""
                                       button-next=""><!--css-build:shady-->
                    <yt-button-shape></yt-button-shape>
                    <tp-yt-paper-tooltip offset="8" disable-upgrade=""></tp-yt-paper-tooltip>
                  </ytd-button-renderer>
                </div>
              </div>
              <div id="contents-container" class="style-scope ytd-rich-shelf-renderer">
                <div id="contents" class="style-scope ytd-rich-shelf-renderer"
                     style="visibility: visible; transform: translateX(0px); height: auto;">
                  <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                          is-shelf-item="" is-responsive-grid="STANDARD" is-in-first-column=""
                                          half-bottom-margin=""><!--css-build:shady-->
                    <!--css_build_scope:ytd-rich-item-renderer-->
                    <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
                    <div id="content" class="style-scope ytd-rich-item-renderer" name="test-setup-name">
                      <yt-lockup-view-model class="ytd-rich-item-renderer lockup yt-lockup-view-model--wrapper">
                        <div
                          class="yt-lockup-view-model yt-lockup-view-model--vertical content-id-gXSDXGgYBxI yt-lockup-view-model--rich-grid-legacy-margin yt-lockup-view-model--flex-none">
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response yt-spec-touch-feedback-shape--thumbnail-size-large yt-spec-touch-feedback-shape--trigger-events">
                            <div class="yt-spec-touch-feedback-shape__hover-effect"
                                 style="background: rgba(69, 99, 201, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__stroke"
                                 style="border-color: rgba(69, 99, 201, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"
                                 style="background-color: rgba(69, 99, 201, 0.17);"></div>
                          </yt-touch-feedback-shape>
                          <a href="/watch?v=gXSDXGgYBxI&amp;pp=0gcJCZEKAYcqIYzv"
                             class="yt-lockup-view-model__content-image" style="" aria-haspopup="false" tabindex="-1"
                             aria-hidden="true">
                            <yt-thumbnail-view-model
                              class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio16By9 ytThumbnailViewModelLarge">
                              <div class="ytThumbnailViewModelImage"><img alt=""
                                                                          class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                          src="https://i.ytimg.com/vi/gXSDXGgYBxI/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&amp;rs=AOn4CLDBZi41eEFZJIOqz3gmycAXKf1xSQ">
                              </div>
                              <yt-thumbnail-bottom-overlay-view-model class="ytThumbnailBottomOverlayViewModelHost">
                                <div
                                  class="ytThumbnailBottomOverlayViewModelBadgeContainer ytThumbnailBottomOverlayViewModelBadgeContainerLarge">
                                  <yt-thumbnail-badge-view-model
                                    class="ytThumbnailBadgeViewModelHost ytThumbnailBottomOverlayViewModelBadge">
                                    <badge-shape
                                      class="yt-badge-shape yt-badge-shape--thumbnail-default yt-badge-shape--thumbnail-badge yt-badge-shape--typography">
                                      <div class="yt-badge-shape__text">1:06</div>
                                    </badge-shape>
                                  </yt-thumbnail-badge-view-model>
                                </div>
                              </yt-thumbnail-bottom-overlay-view-model><!----></yt-thumbnail-view-model>
                          </a>
                          <div class="yt-lockup-view-model__metadata">
                            <yt-lockup-metadata-view-model
                              class="yt-lockup-metadata-view-model yt-lockup-metadata-view-model--vertical yt-lockup-metadata-view-model--standard yt-lockup-metadata-view-model--rich-grid-legacy-typography">
                              <div class="yt-lockup-metadata-view-model__avatar">
                                <yt-decorated-avatar-view-model class="ytDecoratedAvatarViewModelHost">
                                  <yt-avatar-shape>
                                    <div
                                      class="yt-spec-avatar-shape yt-spec-avatar-shape__button yt-spec-avatar-shape__button--button-medium yt-spec-avatar-shape__button--tappable"
                                      aria-label="Go to channel Jermoments" role="button" tabindex="0">
                                      <div class="">
                                        <div class="yt-spec-avatar-shape--avatar-size-medium"><img alt=""
                                                                                                   class="ytCoreImageHost yt-spec-avatar-shape__image ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleToFill ytCoreImageLoaded"
                                                                                                   src="https://yt3.ggpht.com/d5r3U2xS1n7Ta94XuZOVFbVy5e3tybPHXqukql8cbp_TrJV7zGyh5aFiwsKi253zEptUJqEXxw=s68-c-k-c0x00ffffff-no-rj">
                                          <div
                                            class="yt-spec-avatar-shape__image-overlays yt-spec-avatar-shape__image"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </yt-avatar-shape>
                                </yt-decorated-avatar-view-model>
                              </div>
                              <div class="yt-lockup-metadata-view-model__text-container"><h3
                                class="yt-lockup-metadata-view-model__heading-reset" title="Jerma HATES Deadlock"><a
                                href="/watch?v=gXSDXGgYBxI&amp;pp=0gcJCZEKAYcqIYzv"
                                class="yt-lockup-metadata-view-model__title" style="" aria-haspopup="false"
                                aria-label="Jerma HATES Deadlock 1 minute, 6 seconds"><span style=""
                                                                                            class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                                                                            dir="auto" role="text">Jerma HATES Deadlock</span></a>
                              </h3>
                                <div class="yt-lockup-metadata-view-model__metadata" style="">
                                  <yt-content-metadata-view-model
                                    class="yt-content-metadata-view-model yt-content-metadata-view-model--medium-text">
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"><span
                                      class="" style="font-weight: 400;" dir="auto"><a
                                      class="yt-core-attributed-string__link yt-core-attributed-string__link--call-to-action-color yt-core-attributed-string--link-inherit-color"
                                      tabindex="0" href="/@Jermoments" target=""
                                      force-new-state="true">Jermoments</a></span></span></div>
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"
                                                                                                    role="text">9.2K views</span><span
                                      aria-hidden="true"
                                      class="yt-content-metadata-view-model__delimiter"> • </span><span style=""
                                                                                                        class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                        dir="auto"
                                                                                                        role="text">19 hours ago</span>
                                    </div>
                                  </yt-content-metadata-view-model>
                                </div>
                              </div>
                              <div class="yt-lockup-metadata-view-model__menu-button">
                                <button-view-model class="ytSpecButtonViewModelHost">
                                  <button
                                    class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                                    title="" style="" aria-label="More actions" aria-disabled="false">
                                    <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                                      class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                                      class="yt-icon-shape ytSpecIconShapeHost"><div
                                      style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                                      xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                                      focusable="false" aria-hidden="true"
                                      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                                      d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                                    </div>
                                    <yt-touch-feedback-shape aria-hidden="true"
                                                             class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                      <div class="yt-spec-touch-feedback-shape__stroke"></div>
                                      <div class="yt-spec-touch-feedback-shape__fill"></div>
                                    </yt-touch-feedback-shape>
                                  </button>
                                </button-view-model>
                              </div>
                            </yt-lockup-metadata-view-model>
                          </div>
                        </div>
                      </yt-lockup-view-model>
                    </div>
                    <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer"
                                    hidden=""><!--css-build:shady--><!--css_build_scope:yt-interaction-->
                      <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                      <div class="stroke style-scope yt-interaction"></div>
                      <div class="fill style-scope yt-interaction"></div>
                    </yt-interaction>
                  </ytd-rich-item-renderer>
                  <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                          is-shelf-item="" is-responsive-grid="STANDARD" half-bottom-margin="">
                    <!--css-build:shady--><!--css_build_scope:ytd-rich-item-renderer-->
                    <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
                    <div id="content" class="style-scope ytd-rich-item-renderer">
                      <yt-lockup-view-model class="ytd-rich-item-renderer lockup yt-lockup-view-model--wrapper">
                        <div
                          class="yt-lockup-view-model yt-lockup-view-model--vertical content-id-gPhhfv33SQs yt-lockup-view-model--rich-grid-legacy-margin yt-lockup-view-model--flex-none">
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response yt-spec-touch-feedback-shape--thumbnail-size-large yt-spec-touch-feedback-shape--trigger-events">
                            <div class="yt-spec-touch-feedback-shape__hover-effect"
                                 style="background: rgba(64, 99, 206, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__stroke"
                                 style="border-color: rgba(64, 99, 206, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"
                                 style="background-color: rgba(64, 99, 206, 0.17);"></div>
                          </yt-touch-feedback-shape>
                          <a href="/watch?v=gPhhfv33SQs" class="yt-lockup-view-model__content-image" style=""
                             aria-haspopup="false" tabindex="-1" aria-hidden="true">
                            <yt-thumbnail-view-model
                              class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio16By9 ytThumbnailViewModelLarge">
                              <div class="ytThumbnailViewModelImage"><img alt=""
                                                                          class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                          src="https://i.ytimg.com/vi/gPhhfv33SQs/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&amp;rs=AOn4CLBT4m1P88VpNV5bA8Jfo5EilQssxg">
                              </div>
                              <yt-thumbnail-bottom-overlay-view-model class="ytThumbnailBottomOverlayViewModelHost">
                                <div
                                  class="ytThumbnailBottomOverlayViewModelBadgeContainer ytThumbnailBottomOverlayViewModelBadgeContainerLarge">
                                  <yt-thumbnail-badge-view-model
                                    class="ytThumbnailBadgeViewModelHost ytThumbnailBottomOverlayViewModelBadge">
                                    <badge-shape
                                      class="yt-badge-shape yt-badge-shape--thumbnail-default yt-badge-shape--thumbnail-badge yt-badge-shape--typography">
                                      <div class="yt-badge-shape__text">8:47</div>
                                    </badge-shape>
                                  </yt-thumbnail-badge-view-model>
                                </div>
                              </yt-thumbnail-bottom-overlay-view-model><!----></yt-thumbnail-view-model>
                          </a>
                          <div class="yt-lockup-view-model__metadata">
                            <yt-lockup-metadata-view-model
                              class="yt-lockup-metadata-view-model yt-lockup-metadata-view-model--vertical yt-lockup-metadata-view-model--standard yt-lockup-metadata-view-model--rich-grid-legacy-typography">
                              <div class="yt-lockup-metadata-view-model__avatar">
                                <yt-decorated-avatar-view-model class="ytDecoratedAvatarViewModelHost">
                                  <yt-avatar-shape>
                                    <div
                                      class="yt-spec-avatar-shape yt-spec-avatar-shape__button yt-spec-avatar-shape__button--button-medium yt-spec-avatar-shape__button--tappable"
                                      aria-label="Go to channel bodaciousBassist" role="button" tabindex="0">
                                      <div class="">
                                        <div class="yt-spec-avatar-shape--avatar-size-medium"><img alt=""
                                                                                                   class="ytCoreImageHost yt-spec-avatar-shape__image ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleToFill ytCoreImageLoaded"
                                                                                                   src="https://yt3.ggpht.com/6rGUFbbkWCh4Pv2-JrRFCtS5bWGfozvFQfIUlEKEP8FatunYH1Gqk-ZX31bWaTFBGUWM0O3kdw=s68-c-k-c0x00ffffff-no-rj">
                                          <div
                                            class="yt-spec-avatar-shape__image-overlays yt-spec-avatar-shape__image"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </yt-avatar-shape>
                                </yt-decorated-avatar-view-model>
                              </div>
                              <div class="yt-lockup-metadata-view-model__text-container"><h3
                                class="yt-lockup-metadata-view-model__heading-reset" title="victor's rising power"><a
                                href="/watch?v=gPhhfv33SQs" class="yt-lockup-metadata-view-model__title" style=""
                                aria-haspopup="false" aria-label="victor's rising power 8 minutes, 47 seconds"><span
                                style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                dir="auto" role="text">victor's rising power</span></a></h3>
                                <div class="yt-lockup-metadata-view-model__metadata" style="">
                                  <yt-content-metadata-view-model
                                    class="yt-content-metadata-view-model yt-content-metadata-view-model--medium-text">
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"><span
                                      class="" style="font-weight: 400;" dir="auto"><a
                                      class="yt-core-attributed-string__link yt-core-attributed-string__link--call-to-action-color yt-core-attributed-string--link-inherit-color"
                                      tabindex="0" href="/@bodaciousBassist" target="" force-new-state="true">bodaciousBassist</a></span></span>
                                    </div>
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"
                                                                                                    role="text">301 views</span><span
                                      aria-hidden="true"
                                      class="yt-content-metadata-view-model__delimiter"> • </span><span style=""
                                                                                                        class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                        dir="auto"
                                                                                                        role="text">3 hours ago</span>
                                    </div>
                                  </yt-content-metadata-view-model>
                                </div>
                              </div>
                              <div class="yt-lockup-metadata-view-model__menu-button">
                                <button-view-model class="ytSpecButtonViewModelHost">
                                  <button
                                    class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                                    title="" style="" aria-label="More actions" aria-disabled="false">
                                    <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                                      class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                                      class="yt-icon-shape ytSpecIconShapeHost"><div
                                      style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                                      xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                                      focusable="false" aria-hidden="true"
                                      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                                      d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                                    </div>
                                    <yt-touch-feedback-shape aria-hidden="true"
                                                             class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                      <div class="yt-spec-touch-feedback-shape__stroke"></div>
                                      <div class="yt-spec-touch-feedback-shape__fill"></div>
                                    </yt-touch-feedback-shape>
                                  </button>
                                </button-view-model>
                              </div>
                            </yt-lockup-metadata-view-model>
                          </div>
                        </div>
                      </yt-lockup-view-model>
                    </div>
                    <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer"
                                    hidden=""><!--css-build:shady--><!--css_build_scope:yt-interaction-->
                      <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                      <div class="stroke style-scope yt-interaction"></div>
                      <div class="fill style-scope yt-interaction"></div>
                    </yt-interaction>
                  </ytd-rich-item-renderer>
                  <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                          is-shelf-item="" is-responsive-grid="STANDARD" half-bottom-margin="">
                    <!--css-build:shady--><!--css_build_scope:ytd-rich-item-renderer-->
                    <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
                    <div id="content" class="style-scope ytd-rich-item-renderer">
                      <yt-lockup-view-model class="ytd-rich-item-renderer lockup yt-lockup-view-model--wrapper">
                        <div
                          class="yt-lockup-view-model yt-lockup-view-model--vertical content-id-yVa6XY5zkaY yt-lockup-view-model--rich-grid-legacy-margin yt-lockup-view-model--flex-none">
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response yt-spec-touch-feedback-shape--thumbnail-size-large yt-spec-touch-feedback-shape--trigger-events">
                            <div class="yt-spec-touch-feedback-shape__hover-effect"
                                 style="background: rgba(132, 69, 201, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__stroke"
                                 style="border-color: rgba(132, 69, 201, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"
                                 style="background-color: rgba(132, 69, 201, 0.17);"></div>
                          </yt-touch-feedback-shape>
                          <a href="/watch?v=yVa6XY5zkaY&amp;pp=ugUEEgJlbg%3D%3D"
                             class="yt-lockup-view-model__content-image" style="" aria-haspopup="false" tabindex="-1"
                             aria-hidden="true">
                            <yt-thumbnail-view-model
                              class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio16By9 ytThumbnailViewModelLarge">
                              <div class="ytThumbnailViewModelImage"><img alt=""
                                                                          class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                          src="https://i.ytimg.com/vi/yVa6XY5zkaY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&amp;rs=AOn4CLBPtM910SCQftYTTm38vJIDhcmsuA">
                              </div>
                              <yt-thumbnail-bottom-overlay-view-model class="ytThumbnailBottomOverlayViewModelHost">
                                <div
                                  class="ytThumbnailBottomOverlayViewModelBadgeContainer ytThumbnailBottomOverlayViewModelBadgeContainerLarge">
                                  <yt-thumbnail-badge-view-model
                                    class="ytThumbnailBadgeViewModelHost ytThumbnailBottomOverlayViewModelBadge">
                                    <badge-shape
                                      class="yt-badge-shape yt-badge-shape--thumbnail-default yt-badge-shape--thumbnail-badge yt-badge-shape--typography">
                                      <div class="yt-badge-shape__text">1:13</div>
                                    </badge-shape>
                                  </yt-thumbnail-badge-view-model>
                                </div>
                              </yt-thumbnail-bottom-overlay-view-model><!----></yt-thumbnail-view-model>
                          </a>
                          <div class="yt-lockup-view-model__metadata">
                            <yt-lockup-metadata-view-model
                              class="yt-lockup-metadata-view-model yt-lockup-metadata-view-model--vertical yt-lockup-metadata-view-model--standard yt-lockup-metadata-view-model--rich-grid-legacy-typography">
                              <div class="yt-lockup-metadata-view-model__avatar">
                                <yt-decorated-avatar-view-model class="ytDecoratedAvatarViewModelHost">
                                  <yt-avatar-shape>
                                    <div
                                      class="yt-spec-avatar-shape yt-spec-avatar-shape__button yt-spec-avatar-shape__button--button-medium yt-spec-avatar-shape__button--tappable"
                                      aria-label="Go to channel Marbix" role="button" tabindex="0">
                                      <div class="">
                                        <div class="yt-spec-avatar-shape--avatar-size-medium"><img alt=""
                                                                                                   class="ytCoreImageHost yt-spec-avatar-shape__image ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleToFill ytCoreImageLoaded"
                                                                                                   src="https://yt3.ggpht.com/ytc/AIdro_lpe6LFf2OEtGhiPC0wEf2CyHowlrBzcO4yl8VYYZpi6w=s68-c-k-c0x00ffffff-no-rj">
                                          <div
                                            class="yt-spec-avatar-shape__image-overlays yt-spec-avatar-shape__image"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </yt-avatar-shape>
                                </yt-decorated-avatar-view-model>
                              </div>
                              <div class="yt-lockup-metadata-view-model__text-container"><h3
                                class="yt-lockup-metadata-view-model__heading-reset"
                                title="Sniper as Vindicta mod Deadlock"><a
                                href="/watch?v=yVa6XY5zkaY&amp;pp=ugUEEgJlbg%3D%3D"
                                class="yt-lockup-metadata-view-model__title" style="" aria-haspopup="false"
                                aria-label="Sniper as Vindicta mod Deadlock 1 minute, 13 seconds"><span style=""
                                                                                                        class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                                                                                        dir="auto"
                                                                                                        role="text">Sniper as Vindicta mod Deadlock</span></a>
                              </h3>
                                <div class="yt-lockup-metadata-view-model__metadata" style="">
                                  <yt-content-metadata-view-model
                                    class="yt-content-metadata-view-model yt-content-metadata-view-model--medium-text">
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"><span
                                      class="" style="font-weight: 400;" dir="auto"><a
                                      class="yt-core-attributed-string__link yt-core-attributed-string__link--call-to-action-color yt-core-attributed-string--link-inherit-color"
                                      tabindex="0" href="/@ModderMarbix" target=""
                                      force-new-state="true">Marbix</a></span></span></div>
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"
                                                                                                    role="text">4.1K views</span><span
                                      aria-hidden="true"
                                      class="yt-content-metadata-view-model__delimiter"> • </span><span style=""
                                                                                                        class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                        dir="auto"
                                                                                                        role="text">3 weeks ago</span>
                                    </div>
                                  </yt-content-metadata-view-model>
                                </div>
                              </div>
                              <div class="yt-lockup-metadata-view-model__menu-button">
                                <button-view-model class="ytSpecButtonViewModelHost">
                                  <button
                                    class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                                    title="" style="" aria-label="More actions" aria-disabled="false">
                                    <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                                      class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                                      class="yt-icon-shape ytSpecIconShapeHost"><div
                                      style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                                      xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                                      focusable="false" aria-hidden="true"
                                      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                                      d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                                    </div>
                                    <yt-touch-feedback-shape aria-hidden="true"
                                                             class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                      <div class="yt-spec-touch-feedback-shape__stroke"></div>
                                      <div class="yt-spec-touch-feedback-shape__fill"></div>
                                    </yt-touch-feedback-shape>
                                  </button>
                                </button-view-model>
                              </div>
                            </yt-lockup-metadata-view-model>
                          </div>
                        </div>
                      </yt-lockup-view-model>
                    </div>
                    <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer"
                                    hidden=""><!--css-build:shady--><!--css_build_scope:yt-interaction-->
                      <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                      <div class="stroke style-scope yt-interaction"></div>
                      <div class="fill style-scope yt-interaction"></div>
                    </yt-interaction>
                  </ytd-rich-item-renderer>
                  <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                          is-shelf-item="" is-responsive-grid="STANDARD" half-bottom-margin="">
                    <!--css-build:shady--><!--css_build_scope:ytd-rich-item-renderer-->
                    <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
                    <div id="content" class="style-scope ytd-rich-item-renderer">
                      <yt-lockup-view-model class="ytd-rich-item-renderer lockup yt-lockup-view-model--wrapper">
                        <div
                          class="yt-lockup-view-model yt-lockup-view-model--vertical content-id-fgwKWEdA7rU yt-lockup-view-model--rich-grid-legacy-margin yt-lockup-view-model--flex-none">
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response yt-spec-touch-feedback-shape--thumbnail-size-large yt-spec-touch-feedback-shape--trigger-events">
                            <div class="yt-spec-touch-feedback-shape__hover-effect"
                                 style="background: rgba(211, 163, 60, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__stroke"
                                 style="border-color: rgba(211, 163, 60, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"
                                 style="background-color: rgba(211, 163, 60, 0.17);"></div>
                          </yt-touch-feedback-shape>
                          <a href="/watch?v=fgwKWEdA7rU" class="yt-lockup-view-model__content-image" style=""
                             aria-haspopup="false" tabindex="-1" aria-hidden="true">
                            <yt-thumbnail-view-model
                              class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio16By9 ytThumbnailViewModelLarge">
                              <div class="ytThumbnailViewModelImage"><img alt=""
                                                                          class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                          src="https://i.ytimg.com/vi/fgwKWEdA7rU/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&amp;rs=AOn4CLAMUBuoziMRWk7_TpNaAGfx_6fJmQ">
                              </div>
                              <yt-thumbnail-bottom-overlay-view-model class="ytThumbnailBottomOverlayViewModelHost">
                                <div
                                  class="ytThumbnailBottomOverlayViewModelBadgeContainer ytThumbnailBottomOverlayViewModelBadgeContainerLarge">
                                  <yt-thumbnail-badge-view-model
                                    class="ytThumbnailBadgeViewModelHost ytThumbnailBottomOverlayViewModelBadge">
                                    <badge-shape
                                      class="yt-badge-shape yt-badge-shape--thumbnail-default yt-badge-shape--thumbnail-badge yt-badge-shape--typography">
                                      <div class="yt-badge-shape__text">6:38</div>
                                    </badge-shape>
                                  </yt-thumbnail-badge-view-model>
                                </div>
                              </yt-thumbnail-bottom-overlay-view-model><!----></yt-thumbnail-view-model>
                          </a>
                          <div class="yt-lockup-view-model__metadata">
                            <yt-lockup-metadata-view-model
                              class="yt-lockup-metadata-view-model yt-lockup-metadata-view-model--vertical yt-lockup-metadata-view-model--standard yt-lockup-metadata-view-model--rich-grid-legacy-typography">
                              <div class="yt-lockup-metadata-view-model__avatar">
                                <yt-decorated-avatar-view-model class="ytDecoratedAvatarViewModelHost">
                                  <yt-avatar-shape>
                                    <div
                                      class="yt-spec-avatar-shape yt-spec-avatar-shape__button yt-spec-avatar-shape__button--button-medium yt-spec-avatar-shape__button--tappable"
                                      aria-label="Go to channel Dead Air" role="button" tabindex="0">
                                      <div class="">
                                        <div class="yt-spec-avatar-shape--avatar-size-medium"><img alt=""
                                                                                                   class="ytCoreImageHost yt-spec-avatar-shape__image ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleToFill ytCoreImageLoaded"
                                                                                                   src="https://yt3.ggpht.com/9r5bHE9bGct0XtzXUYQESEvDhNZOT3h_2l-jJji421OI6_TpaqIwijO_ocb7evxsKJUuXxYVxQ=s68-c-k-c0x00ffffff-no-rj">
                                          <div
                                            class="yt-spec-avatar-shape__image-overlays yt-spec-avatar-shape__image"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </yt-avatar-shape>
                                </yt-decorated-avatar-view-model>
                              </div>
                              <div class="yt-lockup-metadata-view-model__text-container"><h3
                                class="yt-lockup-metadata-view-model__heading-reset"
                                title="Deadlock Update: Graves Nerfed, Bebop Changes &amp; Rem is Extra Sleepy!"><a
                                href="/watch?v=fgwKWEdA7rU" class="yt-lockup-metadata-view-model__title" style=""
                                aria-haspopup="false"
                                aria-label="Deadlock Update: Graves Nerfed, Bebop Changes &amp; Rem is Extra Sleepy! 6 minutes, 38 seconds"><span
                                style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                dir="auto" role="text">Deadlock Update: Graves Nerfed, Bebop Changes &amp; Rem is Extra Sleepy!</span></a>
                              </h3>
                                <div class="yt-lockup-metadata-view-model__metadata">
                                  <yt-content-metadata-view-model
                                    class="yt-content-metadata-view-model yt-content-metadata-view-model--medium-text">
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"><span
                                      class="" style="font-weight: 400;" dir="auto"><a
                                      class="yt-core-attributed-string__link yt-core-attributed-string__link--call-to-action-color yt-core-attributed-string--link-inherit-color"
                                      tabindex="0" href="/@DeadlockAir" target=""
                                      force-new-state="true">Dead Air</a></span></span></div>
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"
                                                                                                    role="text">47K views</span><span
                                      aria-hidden="true"
                                      class="yt-content-metadata-view-model__delimiter"> • </span><span style=""
                                                                                                        class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                        dir="auto"
                                                                                                        role="text">1 day ago</span>
                                    </div>
                                  </yt-content-metadata-view-model>
                                </div>
                              </div>
                              <div class="yt-lockup-metadata-view-model__menu-button">
                                <button-view-model class="ytSpecButtonViewModelHost">
                                  <button
                                    class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                                    title="" style="" aria-label="More actions" aria-disabled="false">
                                    <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                                      class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                                      class="yt-icon-shape ytSpecIconShapeHost"><div
                                      style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                                      xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                                      focusable="false" aria-hidden="true"
                                      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                                      d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                                    </div>
                                    <yt-touch-feedback-shape aria-hidden="true"
                                                             class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                      <div class="yt-spec-touch-feedback-shape__stroke"></div>
                                      <div class="yt-spec-touch-feedback-shape__fill"></div>
                                    </yt-touch-feedback-shape>
                                  </button>
                                </button-view-model>
                              </div>
                            </yt-lockup-metadata-view-model>
                          </div>
                        </div>
                      </yt-lockup-view-model>
                    </div>
                    <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer"
                                    hidden=""><!--css-build:shady--><!--css_build_scope:yt-interaction-->
                      <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                      <div class="stroke style-scope yt-interaction"></div>
                      <div class="fill style-scope yt-interaction"></div>
                    </yt-interaction>
                  </ytd-rich-item-renderer>
                  <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                          is-shelf-item="" is-responsive-grid="STANDARD" half-bottom-margin="">
                    <!--css-build:shady--><!--css_build_scope:ytd-rich-item-renderer-->
                    <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
                    <div id="content" class="style-scope ytd-rich-item-renderer">
                      <yt-lockup-view-model class="ytd-rich-item-renderer lockup yt-lockup-view-model--wrapper">
                        <div
                          class="yt-lockup-view-model yt-lockup-view-model--vertical content-id-lrH7x3dYao4 yt-lockup-view-model--rich-grid-legacy-margin yt-lockup-view-model--flex-none">
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response yt-spec-touch-feedback-shape--thumbnail-size-large yt-spec-touch-feedback-shape--trigger-events">
                            <div class="yt-spec-touch-feedback-shape__hover-effect"
                                 style="background: rgba(201, 69, 85, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__stroke"
                                 style="border-color: rgba(201, 69, 85, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"
                                 style="background-color: rgba(201, 69, 85, 0.17);"></div>
                          </yt-touch-feedback-shape>
                          <a href="/watch?v=lrH7x3dYao4" class="yt-lockup-view-model__content-image" style=""
                             aria-haspopup="false" tabindex="-1" aria-hidden="true">
                            <yt-thumbnail-view-model
                              class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio16By9 ytThumbnailViewModelLarge">
                              <div class="ytThumbnailViewModelImage"><img alt=""
                                                                          class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                          src="https://i.ytimg.com/vi/lrH7x3dYao4/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&amp;rs=AOn4CLAuz8ppl1Q_ohAXF5CzzODcOQzlPA">
                              </div>
                              <yt-thumbnail-bottom-overlay-view-model class="ytThumbnailBottomOverlayViewModelHost">
                                <div
                                  class="ytThumbnailBottomOverlayViewModelBadgeContainer ytThumbnailBottomOverlayViewModelBadgeContainerLarge">
                                  <yt-thumbnail-badge-view-model
                                    class="ytThumbnailBadgeViewModelHost ytThumbnailBottomOverlayViewModelBadge">
                                    <badge-shape
                                      class="yt-badge-shape yt-badge-shape--thumbnail-default yt-badge-shape--thumbnail-badge yt-badge-shape--typography">
                                      <div class="yt-badge-shape__text">14:25</div>
                                    </badge-shape>
                                  </yt-thumbnail-badge-view-model>
                                </div>
                              </yt-thumbnail-bottom-overlay-view-model><!----></yt-thumbnail-view-model>
                          </a>
                          <div class="yt-lockup-view-model__metadata">
                            <yt-lockup-metadata-view-model
                              class="yt-lockup-metadata-view-model yt-lockup-metadata-view-model--vertical yt-lockup-metadata-view-model--standard yt-lockup-metadata-view-model--rich-grid-legacy-typography">
                              <div class="yt-lockup-metadata-view-model__avatar">
                                <yt-decorated-avatar-view-model class="ytDecoratedAvatarViewModelHost">
                                  <yt-avatar-shape>
                                    <div
                                      class="yt-spec-avatar-shape yt-spec-avatar-shape__button yt-spec-avatar-shape__button--button-medium yt-spec-avatar-shape__button--tappable"
                                      aria-label="Go to channel frogguap" role="button" tabindex="0">
                                      <div class="">
                                        <div class="yt-spec-avatar-shape--avatar-size-medium"><img alt=""
                                                                                                   class="ytCoreImageHost yt-spec-avatar-shape__image ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleToFill ytCoreImageLoaded"
                                                                                                   src="https://yt3.ggpht.com/G4XofK58tHIX_2xC-YsM6axUTwYzTiqcY77gYPJ0hgzMBe1zm4mS3CEEbLqOID4I8Nd_mrtlrQ=s68-c-k-c0x00ffffff-no-rj">
                                          <div
                                            class="yt-spec-avatar-shape__image-overlays yt-spec-avatar-shape__image"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </yt-avatar-shape>
                                </yt-decorated-avatar-view-model>
                              </div>
                              <div class="yt-lockup-metadata-view-model__text-container"><h3
                                class="yt-lockup-metadata-view-model__heading-reset"
                                title="Becoming Silver's WORST Nightmare As Sinclair | Deadlock"><a
                                href="/watch?v=lrH7x3dYao4" class="yt-lockup-metadata-view-model__title" style=""
                                aria-haspopup="false"
                                aria-label="Becoming Silver's WORST Nightmare As Sinclair | Deadlock 14 minutes, 25 seconds"><span
                                style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                dir="auto"
                                role="text">Becoming Silver's WORST Nightmare As Sinclair | Deadlock</span></a></h3>
                                <div class="yt-lockup-metadata-view-model__metadata" style="">
                                  <yt-content-metadata-view-model
                                    class="yt-content-metadata-view-model yt-content-metadata-view-model--medium-text">
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"><span
                                      class="" style="font-weight: 400;" dir="auto"><a
                                      class="yt-core-attributed-string__link yt-core-attributed-string__link--call-to-action-color yt-core-attributed-string--link-inherit-color"
                                      tabindex="0" href="/@frogguap" target=""
                                      force-new-state="true">frogguap</a></span></span></div>
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"
                                                                                                    role="text">406 views</span><span
                                      aria-hidden="true"
                                      class="yt-content-metadata-view-model__delimiter"> • </span><span style=""
                                                                                                        class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                        dir="auto"
                                                                                                        role="text">21 hours ago</span>
                                    </div>
                                  </yt-content-metadata-view-model>
                                </div>
                              </div>
                              <div class="yt-lockup-metadata-view-model__menu-button">
                                <button-view-model class="ytSpecButtonViewModelHost">
                                  <button
                                    class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                                    title="" style="" aria-label="More actions" aria-disabled="false">
                                    <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                                      class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                                      class="yt-icon-shape ytSpecIconShapeHost"><div
                                      style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                                      xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                                      focusable="false" aria-hidden="true"
                                      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                                      d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                                    </div>
                                    <yt-touch-feedback-shape aria-hidden="true"
                                                             class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                      <div class="yt-spec-touch-feedback-shape__stroke"></div>
                                      <div class="yt-spec-touch-feedback-shape__fill"></div>
                                    </yt-touch-feedback-shape>
                                  </button>
                                </button-view-model>
                              </div>
                            </yt-lockup-metadata-view-model>
                          </div>
                        </div>
                      </yt-lockup-view-model>
                    </div>
                    <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer"
                                    hidden=""><!--css-build:shady--><!--css_build_scope:yt-interaction-->
                      <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                      <div class="stroke style-scope yt-interaction"></div>
                      <div class="fill style-scope yt-interaction"></div>
                    </yt-interaction>
                  </ytd-rich-item-renderer>
                  <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                          is-shelf-item="" is-responsive-grid="STANDARD" half-bottom-margin="">
                    <!--css-build:shady--><!--css_build_scope:ytd-rich-item-renderer-->
                    <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
                    <div id="content" class="style-scope ytd-rich-item-renderer">
                      <yt-lockup-view-model class="ytd-rich-item-renderer lockup yt-lockup-view-model--wrapper">
                        <div
                          class="yt-lockup-view-model yt-lockup-view-model--vertical content-id-DSBsNsTa-JA yt-lockup-view-model--rich-grid-legacy-margin yt-lockup-view-model--flex-none">
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response yt-spec-touch-feedback-shape--thumbnail-size-large yt-spec-touch-feedback-shape--trigger-events">
                            <div class="yt-spec-touch-feedback-shape__hover-effect"
                                 style="background: rgba(201, 143, 69, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__stroke"
                                 style="border-color: rgba(201, 143, 69, 0.17);"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"
                                 style="background-color: rgba(201, 143, 69, 0.17);"></div>
                          </yt-touch-feedback-shape>
                          <a href="/watch?v=DSBsNsTa-JA" class="yt-lockup-view-model__content-image" style=""
                             aria-haspopup="false" tabindex="-1" aria-hidden="true">
                            <yt-thumbnail-view-model
                              class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio16By9 ytThumbnailViewModelLarge">
                              <div class="ytThumbnailViewModelImage"><img alt=""
                                                                          class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                          src="https://i.ytimg.com/vi/DSBsNsTa-JA/hq720.jpg?sqp=-oaymwE2CNAFEJQDSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gmAAtAFigIMCAAQARhlIFsoTTAP&amp;rs=AOn4CLDTsYKQ4kHj9aXzKIb2AYSqWxqW1w">
                              </div>
                              <yt-thumbnail-bottom-overlay-view-model class="ytThumbnailBottomOverlayViewModelHost">
                                <div
                                  class="ytThumbnailBottomOverlayViewModelBadgeContainer ytThumbnailBottomOverlayViewModelBadgeContainerLarge">
                                  <yt-thumbnail-badge-view-model
                                    class="ytThumbnailBadgeViewModelHost ytThumbnailBottomOverlayViewModelBadge">
                                    <badge-shape
                                      class="yt-badge-shape yt-badge-shape--thumbnail-default yt-badge-shape--thumbnail-badge yt-badge-shape--typography">
                                      <div class="yt-badge-shape__text">0:19</div>
                                    </badge-shape>
                                  </yt-thumbnail-badge-view-model>
                                </div>
                              </yt-thumbnail-bottom-overlay-view-model><!----></yt-thumbnail-view-model>
                          </a>
                          <div class="yt-lockup-view-model__metadata">
                            <yt-lockup-metadata-view-model
                              class="yt-lockup-metadata-view-model yt-lockup-metadata-view-model--vertical yt-lockup-metadata-view-model--standard yt-lockup-metadata-view-model--rich-grid-legacy-typography">
                              <div class="yt-lockup-metadata-view-model__avatar">
                                <yt-decorated-avatar-view-model class="ytDecoratedAvatarViewModelHost">
                                  <yt-avatar-shape>
                                    <div
                                      class="yt-spec-avatar-shape yt-spec-avatar-shape__button yt-spec-avatar-shape__button--button-medium yt-spec-avatar-shape__button--tappable"
                                      aria-label="Go to channel Hoxdolum" role="button" tabindex="0">
                                      <div class="">
                                        <div class="yt-spec-avatar-shape--avatar-size-medium"><img alt=""
                                                                                                   class="ytCoreImageHost yt-spec-avatar-shape__image ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleToFill ytCoreImageLoaded"
                                                                                                   src="https://yt3.ggpht.com/ytc/AIdro_ndNLMaObLOdOFZZ4cbIZQVQXERIJcjujYJDm21Vo9Uwlk=s68-c-k-c0x00ffffff-no-rj">
                                          <div
                                            class="yt-spec-avatar-shape__image-overlays yt-spec-avatar-shape__image"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </yt-avatar-shape>
                                </yt-decorated-avatar-view-model>
                              </div>
                              <div class="yt-lockup-metadata-view-model__text-container"><h3
                                class="yt-lockup-metadata-view-model__heading-reset"
                                title="Deadlock : The Lash ASCENDS"><a href="/watch?v=DSBsNsTa-JA"
                                                                       class="yt-lockup-metadata-view-model__title"
                                                                       style="" aria-haspopup="false"
                                                                       aria-label="Deadlock : The Lash ASCENDS 19 seconds"><span
                                style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                dir="auto" role="text">Deadlock : The Lash ASCENDS</span></a></h3>
                                <div class="yt-lockup-metadata-view-model__metadata" style="">
                                  <yt-content-metadata-view-model
                                    class="yt-content-metadata-view-model yt-content-metadata-view-model--medium-text">
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"><span
                                      class="" style="font-weight: 400;" dir="auto"><a
                                      class="yt-core-attributed-string__link yt-core-attributed-string__link--call-to-action-color yt-core-attributed-string--link-inherit-color"
                                      tabindex="0" href="/@Hoxdolum" target=""
                                      force-new-state="true">Hoxdolum</a></span></span></div>
                                    <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                                    class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                    dir="auto"
                                                                                                    role="text">44K views</span><span
                                      aria-hidden="true"
                                      class="yt-content-metadata-view-model__delimiter"> • </span><span style=""
                                                                                                        class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                        dir="auto"
                                                                                                        role="text">1 year ago</span>
                                    </div>
                                  </yt-content-metadata-view-model>
                                </div>
                              </div>
                              <div class="yt-lockup-metadata-view-model__menu-button">
                                <button-view-model class="ytSpecButtonViewModelHost">
                                  <button
                                    class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                                    title="" style="" aria-label="More actions" aria-disabled="false">
                                    <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                                      class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                                      class="yt-icon-shape ytSpecIconShapeHost"><div
                                      style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                                      xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                                      focusable="false" aria-hidden="true"
                                      style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                                      d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                                    </div>
                                    <yt-touch-feedback-shape aria-hidden="true"
                                                             class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                                      <div class="yt-spec-touch-feedback-shape__stroke"></div>
                                      <div class="yt-spec-touch-feedback-shape__fill"></div>
                                    </yt-touch-feedback-shape>
                                  </button>
                                </button-view-model>
                              </div>
                            </yt-lockup-metadata-view-model>
                          </div>
                        </div>
                      </yt-lockup-view-model>
                    </div>
                    <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer"
                                    hidden=""><!--css-build:shady--><!--css_build_scope:yt-interaction-->
                      <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                      <div class="stroke style-scope yt-interaction"></div>
                      <div class="fill style-scope yt-interaction"></div>
                    </yt-interaction>
                  </ytd-rich-item-renderer>
                </div>
              </div>
              <div class="button-container style-scope ytd-rich-shelf-renderer" hidden="">
                <ytd-button-renderer class="expand-collapse-button style-scope ytd-rich-shelf-renderer"
                                     button-renderer="" button-next=""><!--css-build:shady-->
                  <yt-button-shape>
                    <button
                      class="yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-trailing yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                      title="" aria-label="Show more">
                      <div class="yt-spec-button-shape-next__button-text-content"><span style=""
                                                                                        class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap"
                                                                                        role="text">Show more</span>
                      </div>
                      <div class="yt-spec-button-shape-next__icon"><span class="ytIconWrapperHost"
                                                                         style="width: 24px; height: 24px;"><span
                        class="yt-icon-shape ytSpecIconShapeHost"><div
                        style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                        xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false"
                        aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                        d="M18.707 8.793a1 1 0 00-1.414 0L12 14.086 6.707 8.793a1 1 0 10-1.414 1.414L12 16.914l6.707-6.707a1 1 0 000-1.414Z"></path></svg></div></span></span>
                      </div>
                      <yt-touch-feedback-shape aria-hidden="true"
                                               class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                        <div class="yt-spec-touch-feedback-shape__stroke"></div>
                        <div class="yt-spec-touch-feedback-shape__fill"></div>
                      </yt-touch-feedback-shape>
                    </button>
                  </yt-button-shape>
                  <tp-yt-paper-tooltip offset="8" disable-upgrade=""></tp-yt-paper-tooltip>
                </ytd-button-renderer>
              </div>
              <div class="button-container style-scope ytd-rich-shelf-renderer">
                <ytd-button-renderer class="expand-collapse-button style-scope ytd-rich-shelf-renderer"
                                     button-renderer="" button-next=""><!--css-build:shady-->
                  <yt-button-shape>
                    <button
                      class="yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-trailing yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                      title="" aria-label="Show less">
                      <div class="yt-spec-button-shape-next__button-text-content"><span style=""
                                                                                        class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap"
                                                                                        role="text">Show less</span>
                      </div>
                      <div class="yt-spec-button-shape-next__icon"><span class="ytIconWrapperHost"
                                                                         style="width: 24px; height: 24px;"><span
                        class="yt-icon-shape ytSpecIconShapeHost"><div
                        style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                        xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false"
                        aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                        d="M5.293 15.207a1 1 0 001.414 0L12 9.914l5.293 5.293a1 1 0 101.414-1.414L12 7.086l-6.707 6.707a1 1 0 000 1.414Z"></path></svg></div></span></span>
                      </div>
                      <yt-touch-feedback-shape aria-hidden="true"
                                               class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                        <div class="yt-spec-touch-feedback-shape__stroke"></div>
                        <div class="yt-spec-touch-feedback-shape__fill"></div>
                      </yt-touch-feedback-shape>
                    </button>
                  </yt-button-shape>
                  <tp-yt-paper-tooltip offset="8" disable-upgrade=""></tp-yt-paper-tooltip>
                </ytd-button-renderer>
              </div>
            </div>
            <div id="dismissed" class="style-scope ytd-rich-shelf-renderer"></div>
          </ytd-rich-shelf-renderer>
        </div>
      </div>
    </ytd-chips-shelf-with-video-shelf-renderer>
  </div>
</ytd-rich-section-renderer>
  `;

export const homeItemHtml = `
<ytd-rich-item-renderer class="style-scope ytd-rich-grid-renderer" items-per-row="3" lockup="true"
                        rendered-from-rich-grid="" is-in-first-column=""><!--css-build:shady-->
  <!--css_build_scope:ytd-rich-item-renderer-->
  <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
  <div id="content" class="style-scope ytd-rich-item-renderer" name="test-setup-name">
    <yt-lockup-view-model class="ytd-rich-item-renderer lockup yt-lockup-view-model--wrapper">
      <div
        class="yt-lockup-view-model yt-lockup-view-model--vertical content-id-Ev34MwRzJPo yt-lockup-view-model--rich-grid-legacy-margin yt-lockup-view-model--flex-none">
        <yt-touch-feedback-shape aria-hidden="true"
                                 class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response yt-spec-touch-feedback-shape--thumbnail-size-large yt-spec-touch-feedback-shape--trigger-events">
          <div class="yt-spec-touch-feedback-shape__hover-effect" style="background: rgba(201, 123, 69, 0.17);"></div>
          <div class="yt-spec-touch-feedback-shape__stroke" style="border-color: rgba(201, 123, 69, 0.17);"></div>
          <div class="yt-spec-touch-feedback-shape__fill" style="background-color: rgba(201, 123, 69, 0.17);"></div>
        </yt-touch-feedback-shape>
        <a href="/watch?v=Ev34MwRzJPo" class="yt-lockup-view-model__content-image" style="" aria-haspopup="false"
           tabindex="-1" aria-hidden="true">
          <yt-thumbnail-view-model
            class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio16By9 ytThumbnailViewModelLarge">
            <div class="ytThumbnailViewModelImage"><img alt=""
                                                        class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                        src="https://i.ytimg.com/vi/Ev34MwRzJPo/hqdefault.jpg?sqp=-oaymwE2COADEI4CSFXyq4qpAygIARUAAIhCGAFwAcABBvABAfgB_gSAAuADigIMCAAQARhyIFEoOjAP&amp;rs=AOn4CLDxXAujEe9j61SZT_ku9EKtnTsQGw">
            </div>
            <yt-thumbnail-bottom-overlay-view-model class="ytThumbnailBottomOverlayViewModelHost">
              <div
                class="ytThumbnailBottomOverlayViewModelBadgeContainer ytThumbnailBottomOverlayViewModelBadgeContainerLarge">
                <yt-thumbnail-badge-view-model
                  class="ytThumbnailBadgeViewModelHost ytThumbnailBottomOverlayViewModelBadge">
                  <badge-shape
                    class="yt-badge-shape yt-badge-shape--thumbnail-default yt-badge-shape--thumbnail-badge yt-badge-shape--typography">
                    <div class="yt-badge-shape__text">0:51</div>
                  </badge-shape>
                </yt-thumbnail-badge-view-model>
              </div>
            </yt-thumbnail-bottom-overlay-view-model><!----></yt-thumbnail-view-model>
        </a>
        <div class="yt-lockup-view-model__metadata">
          <yt-lockup-metadata-view-model
            class="yt-lockup-metadata-view-model yt-lockup-metadata-view-model--vertical yt-lockup-metadata-view-model--standard yt-lockup-metadata-view-model--rich-grid-legacy-typography">
            <div class="yt-lockup-metadata-view-model__avatar">
              <yt-decorated-avatar-view-model class="ytDecoratedAvatarViewModelHost">
                <yt-avatar-shape>
                  <div
                    class="yt-spec-avatar-shape yt-spec-avatar-shape__button yt-spec-avatar-shape__button--button-medium yt-spec-avatar-shape__button--tappable"
                    aria-label="Go to channel Grimtou" role="button" tabindex="0">
                    <div class="">
                      <div class="yt-spec-avatar-shape--avatar-size-medium"><img alt=""
                                                                                 class="ytCoreImageHost yt-spec-avatar-shape__image ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleToFill ytCoreImageLoaded"
                                                                                 src="https://yt3.ggpht.com/tPlIYQ5op5net3SGRONhUAH6HlcB7Zfht7hTixxs0aiiO3XYsEqZOrtNHxM0JqWnMABd-CJhog=s68-c-k-c0x00ffffff-no-rj">
                        <div class="yt-spec-avatar-shape__image-overlays yt-spec-avatar-shape__image"></div>
                      </div>
                    </div>
                  </div>
                </yt-avatar-shape>
              </yt-decorated-avatar-view-model>
            </div>
            <div class="yt-lockup-metadata-view-model__text-container"><h3
              class="yt-lockup-metadata-view-model__heading-reset" title="Finch hops around desk and demands scratches">
              <a href="/watch?v=Ev34MwRzJPo" class="yt-lockup-metadata-view-model__title" style="" aria-haspopup="false"
                 aria-label="Finch hops around desk and demands scratches 51 seconds"><span style=""
                                                                                            class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                                                                            dir="auto" role="text">Finch hops around desk and demands scratches</span></a>
            </h3>
              <div class="yt-lockup-metadata-view-model__metadata" style="">
                <yt-content-metadata-view-model
                  class="yt-content-metadata-view-model yt-content-metadata-view-model--medium-text">
                  <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                  class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                  dir="auto"><span class=""
                                                                                                   style="font-weight: 400;"
                                                                                                   dir="auto"><a
                    class="yt-core-attributed-string__link yt-core-attributed-string__link--call-to-action-color yt-core-attributed-string--link-inherit-color"
                    tabindex="0" href="/@Grimtou" target="" force-new-state="true">Grimtou</a></span></span></div>
                  <div class="yt-content-metadata-view-model__metadata-row"><span style=""
                                                                                  class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                  dir="auto"
                                                                                  role="text">1.2M views</span><span
                    aria-hidden="true" class="yt-content-metadata-view-model__delimiter"> • </span><span style=""
                                                                                                         class="yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color"
                                                                                                         dir="auto"
                                                                                                         role="text">14 years ago</span>
                  </div>
                </yt-content-metadata-view-model>
              </div>
            </div>
            <div class="yt-lockup-metadata-view-model__menu-button">
              <button-view-model class="ytSpecButtonViewModelHost">
                <button
                  class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                  title="" style="" aria-label="More actions" aria-disabled="false">
                  <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span class="ytIconWrapperHost"
                                                                                        style="width: 24px; height: 24px;"><span
                    class="yt-icon-shape ytSpecIconShapeHost"><div
                    style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                    xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false"
                    aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                    d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                  </div>
                  <yt-touch-feedback-shape aria-hidden="true"
                                           class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                    <div class="yt-spec-touch-feedback-shape__stroke"></div>
                    <div class="yt-spec-touch-feedback-shape__fill"></div>
                  </yt-touch-feedback-shape>
                </button>
              </button-view-model>
            </div>
          </yt-lockup-metadata-view-model>
        </div>
      </div>
    </yt-lockup-view-model>
  </div>
  <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer" hidden="">
    <!--css-build:shady--><!--css_build_scope:yt-interaction-->
    <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
    <div class="stroke style-scope yt-interaction"></div>
    <div class="fill style-scope yt-interaction"></div>
  </yt-interaction>
</ytd-rich-item-renderer>
  `;

export const homeRowShortsSectionItemHtml = `
<ytd-rich-section-renderer class="style-scope ytd-rich-grid-renderer"><!--css-build:shady-->
  <!--css_build_scope:ytd-rich-section-renderer-->
  <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
  <div id="content" class="style-scope ytd-rich-section-renderer">
    <ytd-rich-shelf-renderer class="style-scope ytd-rich-section-renderer" elements-per-row="5" is-shorts=""
                             show-bottom-divider="" is-truncated=""
                             style="--ytd-rich-grid-items-per-row: 5; --ytd-rich-grid-item-margin: 16px; --ytd-rich-shelf-items-count: 9;"
                             restrict-contents-overflow=""><!--css-build:shady-->
      <!--css_build_scope:ytd-rich-shelf-renderer-->
      <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
      <div id="dismissible" class="style-scope ytd-rich-shelf-renderer">
        <div id="rich-shelf-header-container" class="style-scope ytd-rich-shelf-renderer">
          <div id="rich-shelf-header" class="style-scope ytd-rich-shelf-renderer">
            <h2 class="style-scope ytd-rich-shelf-renderer">

              <yt-icon id="icon" class="style-scope ytd-rich-shelf-renderer"><!--css-build:shady-->
                <!--css_build_scope:yt-icon-->
                <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.core.yt_icon.yt.icon.css.js--><span
                  class="yt-icon-shape style-scope yt-icon ytSpecIconShapeHost"><div
                  style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" focusable="false"
                  aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;">
  <path
    d="m19.45,3.88c1.12,1.82.48,4.15-1.42,5.22l-1.32.74.94.41c1.36.58,2.27,1.85,2.35,3.27.08,1.43-.68,2.77-1.97,3.49l-8,4.47c-1.91,1.06-4.35.46-5.48-1.35-1.12-1.82-.48-4.15,1.42-5.22l1.33-.74-.94-.41c-1.36-.58-2.27-1.85-2.35-3.27-.08-1.43.68-2.77,1.97-3.49l8-4.47c1.91-1.06,4.35-.46,5.48,1.35Z"
    fill="#f03"></path>
  <path d="m10,15l5-3-5-3v6Z" fill="#fff"></path>
</svg></div></span></yt-icon>
              <yt-img-shadow id="avatar" class="style-scope ytd-rich-shelf-renderer no-transition" hidden="">
                <!--css-build:shady--><!--css_build_scope:yt-img-shadow-->
                <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_img_shadow.yt.img.shadow.css.js--><img
                id="img" draggable="false" class="style-scope yt-img-shadow" alt=""></yt-img-shadow>
              <div id="title-container" class="style-scope ytd-rich-shelf-renderer">
                <div id="title-text" class="style-scope ytd-rich-shelf-renderer">
                  <span id="title" class="style-scope ytd-rich-shelf-renderer">Shorts</span>
                  <ytd-badge-supported-renderer id="featured-badge" class="style-scope ytd-rich-shelf-renderer"
                                                system-icons="" use-badge-shape="" hidden=""><!--css-build:shady-->
                    <!--css_build_scope:ytd-badge-supported-renderer-->
                    <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
                    <dom-repeat id="repeat" as="badge" class="style-scope ytd-badge-supported-renderer">
                      <template is="dom-repeat"></template>
                    </dom-repeat>
                  </ytd-badge-supported-renderer>
                </div>
                <div id="subtitle-text" class="style-scope ytd-rich-shelf-renderer">
                  <ytd-badge-supported-renderer id="paygated-featured-badge" class="style-scope ytd-rich-shelf-renderer"
                                                system-icons="" use-badge-shape="" hidden=""><!--css-build:shady-->
                    <!--css_build_scope:ytd-badge-supported-renderer-->
                    <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
                    <dom-repeat id="repeat" as="badge" class="style-scope ytd-badge-supported-renderer">
                      <template is="dom-repeat"></template>
                    </dom-repeat>
                  </ytd-badge-supported-renderer>
                  <yt-formatted-string id="subtitle" class="style-scope ytd-rich-shelf-renderer" is-empty="">
                    <!--css-build:shady--><!--css_build_scope:yt-formatted-string-->
                    <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_formatted_string.yt.formatted.string.css.js-->
                    <yt-attributed-string class="style-scope yt-formatted-string"></yt-attributed-string>
                  </yt-formatted-string>
                </div>
              </div>
              <dom-if class="style-scope ytd-rich-shelf-renderer">
                <template is="dom-if"></template>
              </dom-if>
              <dom-if class="style-scope ytd-rich-shelf-renderer">
                <template is="dom-if"></template>
              </dom-if>
            </h2>
            <div id="menu-container" class="style-scope ytd-rich-shelf-renderer">
              <div class="cta-button-container style-scope ytd-rich-shelf-renderer" hidden="">
                <ytd-button-renderer class="cta-button style-scope ytd-rich-shelf-renderer" button-renderer=""
                                     button-next=""><!--css-build:shady-->
                  <yt-button-shape></yt-button-shape>
                  <tp-yt-paper-tooltip offset="8" disable-upgrade=""></tp-yt-paper-tooltip>
                </ytd-button-renderer>
              </div>
              <div id="menu" class="style-scope ytd-rich-shelf-renderer">
                <ytd-menu-renderer class="style-scope ytd-rich-shelf-renderer" safe-area="" menu-active="">
                  <!--css-build:shady--><!--css_build_scope:ytd-menu-renderer-->
                  <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
                  <div id="top-level-buttons-computed" class="top-level-buttons style-scope ytd-menu-renderer"></div>
                  <div id="flexible-item-buttons" class="style-scope ytd-menu-renderer"></div>
                  <yt-icon-button id="button" class="dropdown-trigger style-scope ytd-menu-renderer"
                                  style-target="button"><!--css-build:shady--><!--css_build_scope:yt-icon-button-->
                    <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_icon_button.yt.icon.button.css.js-->
                    <button id="button" class="style-scope yt-icon-button" aria-label="Shorts - More actions">
                      <yt-icon class="style-scope ytd-menu-renderer"><!--css-build:shady-->
                        <!--css_build_scope:yt-icon-->
                        <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.core.yt_icon.yt.icon.css.js--><span
                          class="yt-icon-shape style-scope yt-icon ytSpecIconShapeHost"><div
                          style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                          xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                          focusable="false" aria-hidden="true"
                          style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                          d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span>
                      </yt-icon>
                    </button>
                    <yt-interaction id="interaction" class="circular style-scope yt-icon-button"><!--css-build:shady-->
                      <!--css_build_scope:yt-interaction-->
                      <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                      <div class="stroke style-scope yt-interaction"></div>
                      <div class="fill style-scope yt-interaction"></div>
                    </yt-interaction>
                  </yt-icon-button>
                  <yt-button-shape id="button-shape" class="style-scope ytd-menu-renderer" hidden=""></yt-button-shape>
                </ytd-menu-renderer>
              </div>
              <yt-button-view-model id="previous-button" class="style-scope ytd-rich-shelf-renderer">
              </yt-button-view-model>
              <yt-button-view-model id="next-button" class="style-scope ytd-rich-shelf-renderer">
              </yt-button-view-model>
            </div>
          </div>
          <div id="cta-bottom-button-container" class="style-scope ytd-rich-shelf-renderer" hidden="">
            <ytd-button-renderer class="cta-button style-scope ytd-rich-shelf-renderer" button-renderer=""
                                 button-next=""><!--css-build:shady-->
              <yt-button-shape></yt-button-shape>
              <tp-yt-paper-tooltip offset="8" disable-upgrade=""></tp-yt-paper-tooltip>
            </ytd-button-renderer>
          </div>
        </div>
        <div id="contents-container" class="style-scope ytd-rich-shelf-renderer">
          <div id="contents" class="style-scope ytd-rich-shelf-renderer"
               style="transform: translateX(0px); visibility: visible;">
            <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                    is-shelf-item="" is-responsive-grid="EXTRA_COMPACT" no-bottom-margin=""
                                    is-slim-media="" rich-grid-hover-highlight="" is-in-first-column="">
              <!--css-build:shady--><!--css_build_scope:ytd-rich-item-renderer-->
              <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
              <div id="content" class="style-scope ytd-rich-item-renderer" style="position: relative;" name="test-setup-name">
                <ytm-shorts-lockup-view-model-v2 class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer">
                  <ytm-shorts-lockup-view-model class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer"><a
                    href="/shorts/7FvYSwf40bc" class="shortsLockupViewModelHostEndpoint reel-item-endpoint" style=""
                    aria-haspopup="false" tabindex="-1" aria-hidden="true">
                    <div
                      class="shortsLockupViewModelHostThumbnailParentContainer shortsLockupViewModelHostThumbnailParentContainerRounded">
                      <yt-thumbnail-view-model
                        class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio2By3 ytThumbnailViewModelMedium">
                        <div class="ytThumbnailViewModelImage"><img alt=""
                                                                    class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                    src="https://i.ytimg.com/vi/7FvYSwf40bc/oardefault.jpg?sqp=-oaymwEdCJUDENAFSFWQAgHyq4qpAwwIARUAAIhCcAHAAQY=&amp;rs=AOn4CLDVI2fbzG4nsS31KyAxg2cSQ0I6Xg&amp;usqp=CCk">
                        </div>
                      </yt-thumbnail-view-model>
                    </div>
                  </a>
                    <div role="presentation"
                         class="shortsLockupViewModelHostOutsideMetadata shortsLockupViewModelHostMetadataRounded shortsLockupViewModelHostOutsideMetadataHasMenu">
                      <div><h3 role="presentation"
                               class="shortsLockupViewModelHostMetadataTitle shortsLockupViewModelHostOutsideMetadataTitle">
                        <a href="/shorts/7FvYSwf40bc"
                           class="shortsLockupViewModelHostEndpoint shortsLockupViewModelHostOutsideMetadataEndpoint"
                           style="" aria-haspopup="false" title="The SECRET To Push-Ups!😳"><span style=""
                                                                                                 class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                                                                                 role="text">The SECRET To Push-Ups!😳</span></a>
                      </h3>
                        <div
                          class="shortsLockupViewModelHostOutsideMetadataSubhead shortsLockupViewModelHostMetadataSubhead">
                          <span style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                role="text">21M views</span></div>
                      </div>
                      <div
                        class="shortsLockupViewModelHostOutsideMetadataMenu shortsLockupViewModelHostShowOverPlayer image-overlay-text">
                        <button
                          class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                          title="" aria-label="More actions">
                          <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                            class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                            class="yt-icon-shape ytSpecIconShapeHost"><div
                            style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                            focusable="false" aria-hidden="true"
                            style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                            d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                          </div>
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                          </yt-touch-feedback-shape>
                        </button>
                      </div>
                    </div>
                  </ytm-shorts-lockup-view-model>
                </ytm-shorts-lockup-view-model-v2>
                <div data-wxt-integrated=""
                     style="overflow: visible; position: relative; width: 0px; height: 100%; display: block;"
                     data-v-app="">
                  <div id="qa-watch-later-home-button-container" class="qa-home-watch-later">
                    <button id="qa-watch-later-home-button" class="qa-btn"><i class="fa-solid fa-clock fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer">
                <!--css-build:shady--><!--css_build_scope:yt-interaction-->
                <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                <div class="stroke style-scope yt-interaction"></div>
                <div class="fill style-scope yt-interaction"></div>
              </yt-interaction>
            </ytd-rich-item-renderer>
            <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                    is-shelf-item="" is-responsive-grid="EXTRA_COMPACT" no-bottom-margin=""
                                    is-slim-media="" rich-grid-hover-highlight=""><!--css-build:shady-->
              <!--css_build_scope:ytd-rich-item-renderer-->
              <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
              <div id="content" class="style-scope ytd-rich-item-renderer" style="position: relative;">
                <ytm-shorts-lockup-view-model-v2 class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer">
                  <ytm-shorts-lockup-view-model class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer"><a
                    href="/shorts/R204TcPUlTU" class="shortsLockupViewModelHostEndpoint reel-item-endpoint" style=""
                    aria-haspopup="false" tabindex="-1" aria-hidden="true">
                    <div
                      class="shortsLockupViewModelHostThumbnailParentContainer shortsLockupViewModelHostThumbnailParentContainerRounded">
                      <yt-thumbnail-view-model
                        class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio2By3 ytThumbnailViewModelMedium">
                        <div class="ytThumbnailViewModelImage"><img alt=""
                                                                    class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                    src="https://i.ytimg.com/vi/R204TcPUlTU/oar2.jpg?sqp=-oaymwEdCJUDENAFSFWQAgHyq4qpAwwIARUAAIhCcAHAAQY=&amp;rs=AOn4CLAiOHRyN0hIsKzZwNzyyF50AHouZQ&amp;usqp=CCk">
                        </div>
                      </yt-thumbnail-view-model>
                    </div>
                  </a>
                    <div role="presentation"
                         class="shortsLockupViewModelHostOutsideMetadata shortsLockupViewModelHostMetadataRounded shortsLockupViewModelHostOutsideMetadataHasMenu">
                      <div><h3 role="presentation"
                               class="shortsLockupViewModelHostMetadataTitle shortsLockupViewModelHostOutsideMetadataTitle">
                        <a href="/shorts/R204TcPUlTU"
                           class="shortsLockupViewModelHostEndpoint shortsLockupViewModelHostOutsideMetadataEndpoint"
                           style="" aria-haspopup="false"
                           title="Pet squid attack looks like this 😲🦑                            🎥: Instagram / sunege100"><span
                          style="" class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                          role="text">Pet squid attack looks like this 😲🦑                            🎥: Instagram / sunege100</span></a>
                      </h3>
                        <div
                          class="shortsLockupViewModelHostOutsideMetadataSubhead shortsLockupViewModelHostMetadataSubhead">
                          <span style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                role="text">22M views</span></div>
                      </div>
                      <div
                        class="shortsLockupViewModelHostOutsideMetadataMenu shortsLockupViewModelHostShowOverPlayer image-overlay-text">
                        <button
                          class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                          title="" aria-label="More actions">
                          <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                            class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                            class="yt-icon-shape ytSpecIconShapeHost"><div
                            style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                            focusable="false" aria-hidden="true"
                            style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                            d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                          </div>
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                          </yt-touch-feedback-shape>
                        </button>
                      </div>
                    </div>
                  </ytm-shorts-lockup-view-model>
                </ytm-shorts-lockup-view-model-v2>
                <div data-wxt-integrated=""
                     style="overflow: visible; position: relative; width: 0px; height: 100%; display: block;"
                     data-v-app="">
                  <div id="qa-watch-later-home-button-container" class="qa-home-watch-later">
                    <button id="qa-watch-later-home-button" class="qa-btn"><i class="fa-solid fa-clock fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer">
                <!--css-build:shady--><!--css_build_scope:yt-interaction-->
                <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                <div class="stroke style-scope yt-interaction"></div>
                <div class="fill style-scope yt-interaction"></div>
              </yt-interaction>
            </ytd-rich-item-renderer>
            <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                    is-shelf-item="" is-responsive-grid="EXTRA_COMPACT" no-bottom-margin=""
                                    is-slim-media="" rich-grid-hover-highlight=""><!--css-build:shady-->
              <!--css_build_scope:ytd-rich-item-renderer-->
              <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
              <div id="content" class="style-scope ytd-rich-item-renderer" style="position: relative;">
                <ytm-shorts-lockup-view-model-v2 class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer">
                  <ytm-shorts-lockup-view-model class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer"><a
                    href="/shorts/kFtOBk67s-g" class="shortsLockupViewModelHostEndpoint reel-item-endpoint" style=""
                    aria-haspopup="false" tabindex="-1" aria-hidden="true">
                    <div
                      class="shortsLockupViewModelHostThumbnailParentContainer shortsLockupViewModelHostThumbnailParentContainerRounded">
                      <yt-thumbnail-view-model
                        class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio2By3 ytThumbnailViewModelMedium">
                        <div class="ytThumbnailViewModelImage"><img alt=""
                                                                    class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                    src="https://i.ytimg.com/vi/kFtOBk67s-g/oardefault.jpg?sqp=-oaymwEdCJUDENAFSFWQAgHyq4qpAwwIARUAAIhCcAHAAQY=&amp;rs=AOn4CLCjfuaRgCIwqpk_RFBVh4A5eVlmYg&amp;usqp=CCk">
                        </div>
                      </yt-thumbnail-view-model>
                    </div>
                  </a>
                    <div role="presentation"
                         class="shortsLockupViewModelHostOutsideMetadata shortsLockupViewModelHostMetadataRounded shortsLockupViewModelHostOutsideMetadataHasMenu">
                      <div><h3 role="presentation"
                               class="shortsLockupViewModelHostMetadataTitle shortsLockupViewModelHostOutsideMetadataTitle">
                        <a href="/shorts/kFtOBk67s-g"
                           class="shortsLockupViewModelHostEndpoint shortsLockupViewModelHostOutsideMetadataEndpoint"
                           style="" aria-haspopup="false"
                           title="Agartha Needs Him! #cs2 #csgo #gaming #viral #memes #counterstrike #agartha #yakub #ai #sora #viral"><span
                          style="" class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                          role="text">Agartha Needs Him! #cs2 #csgo #gaming #viral #memes #counterstrike #agartha #yakub #ai #sora #viral</span></a>
                      </h3>
                        <div
                          class="shortsLockupViewModelHostOutsideMetadataSubhead shortsLockupViewModelHostMetadataSubhead">
                          <span style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                role="text">127K views</span></div>
                      </div>
                      <div
                        class="shortsLockupViewModelHostOutsideMetadataMenu shortsLockupViewModelHostShowOverPlayer image-overlay-text">
                        <button
                          class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                          title="" aria-label="More actions">
                          <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                            class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                            class="yt-icon-shape ytSpecIconShapeHost"><div
                            style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                            focusable="false" aria-hidden="true"
                            style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                            d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                          </div>
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                          </yt-touch-feedback-shape>
                        </button>
                      </div>
                    </div>
                  </ytm-shorts-lockup-view-model>
                </ytm-shorts-lockup-view-model-v2>
                <div data-wxt-integrated=""
                     style="overflow: visible; position: relative; width: 0px; height: 100%; display: block;"
                     data-v-app="">
                  <div id="qa-watch-later-home-button-container" class="qa-home-watch-later">
                    <button id="qa-watch-later-home-button" class="qa-btn"><i class="fa-solid fa-clock fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer">
                <!--css-build:shady--><!--css_build_scope:yt-interaction-->
                <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                <div class="stroke style-scope yt-interaction"></div>
                <div class="fill style-scope yt-interaction"></div>
              </yt-interaction>
            </ytd-rich-item-renderer>
            <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                    is-shelf-item="" is-responsive-grid="EXTRA_COMPACT" no-bottom-margin=""
                                    is-slim-media="" rich-grid-hover-highlight="" style=""><!--css-build:shady-->
              <!--css_build_scope:ytd-rich-item-renderer-->
              <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
              <div id="content" class="style-scope ytd-rich-item-renderer" style="position: relative;">
                <ytm-shorts-lockup-view-model-v2 class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer">
                  <ytm-shorts-lockup-view-model class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer"><a
                    href="/shorts/Avt7net-b2s" class="shortsLockupViewModelHostEndpoint reel-item-endpoint" style=""
                    aria-haspopup="false" tabindex="-1" aria-hidden="true">
                    <div
                      class="shortsLockupViewModelHostThumbnailParentContainer shortsLockupViewModelHostThumbnailParentContainerRounded">
                      <yt-thumbnail-view-model
                        class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio2By3 ytThumbnailViewModelMedium">
                        <div class="ytThumbnailViewModelImage"><img alt=""
                                                                    class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                    src="https://i.ytimg.com/vi_webp/Avt7net-b2s/oar3.webp?usqp=CCk">
                        </div>
                      </yt-thumbnail-view-model>
                    </div>
                  </a>
                    <div role="presentation"
                         class="shortsLockupViewModelHostOutsideMetadata shortsLockupViewModelHostMetadataRounded shortsLockupViewModelHostOutsideMetadataHasMenu">
                      <div><h3 role="presentation"
                               class="shortsLockupViewModelHostMetadataTitle shortsLockupViewModelHostOutsideMetadataTitle">
                        <a href="/shorts/Avt7net-b2s"
                           class="shortsLockupViewModelHostEndpoint shortsLockupViewModelHostOutsideMetadataEndpoint"
                           style="" aria-haspopup="false"
                           title="THE CAMERA TURN😭✌️#jjk#jujutsukaisen#gojo#gojosatoru#yujiitadori#yutaokkotsu#shorts#jjkseason3"><span
                          style="" class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                          role="text">THE CAMERA TURN😭✌️#jjk#jujutsukaisen#gojo#gojosatoru#yujiitadori#yutaokkotsu#shorts#jjkseason3</span></a>
                      </h3>
                        <div
                          class="shortsLockupViewModelHostOutsideMetadataSubhead shortsLockupViewModelHostMetadataSubhead">
                          <span style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                role="text">1.1M views</span></div>
                      </div>
                      <div
                        class="shortsLockupViewModelHostOutsideMetadataMenu shortsLockupViewModelHostShowOverPlayer image-overlay-text">
                        <button
                          class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                          title="" aria-label="More actions">
                          <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                            class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                            class="yt-icon-shape ytSpecIconShapeHost"><div
                            style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                            focusable="false" aria-hidden="true"
                            style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                            d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                          </div>
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                          </yt-touch-feedback-shape>
                        </button>
                      </div>
                    </div>
                  </ytm-shorts-lockup-view-model>
                </ytm-shorts-lockup-view-model-v2>
                <div data-wxt-integrated=""
                     style="overflow: visible; position: relative; width: 0px; height: 100%; display: block;"
                     data-v-app="">
                  <div id="qa-watch-later-home-button-container" class="qa-home-watch-later">
                    <button id="qa-watch-later-home-button" class="qa-btn"><i class="fa-solid fa-clock fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer">
                <!--css-build:shady--><!--css_build_scope:yt-interaction-->
                <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                <div class="stroke style-scope yt-interaction"></div>
                <div class="fill style-scope yt-interaction"></div>
              </yt-interaction>
            </ytd-rich-item-renderer>
            <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                    is-shelf-item="" is-responsive-grid="EXTRA_COMPACT" no-bottom-margin=""
                                    is-slim-media="" rich-grid-hover-highlight="" style=""><!--css-build:shady-->
              <!--css_build_scope:ytd-rich-item-renderer-->
              <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
              <div id="content" class="style-scope ytd-rich-item-renderer" style="position: relative;">
                <ytm-shorts-lockup-view-model-v2 class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer">
                  <ytm-shorts-lockup-view-model class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer"><a
                    href="/shorts/ENRJ0OXXBXo" class="shortsLockupViewModelHostEndpoint reel-item-endpoint" style=""
                    aria-haspopup="false" tabindex="-1" aria-hidden="true">
                    <div
                      class="shortsLockupViewModelHostThumbnailParentContainer shortsLockupViewModelHostThumbnailParentContainerRounded">
                      <yt-thumbnail-view-model
                        class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio2By3 ytThumbnailViewModelMedium">
                        <div class="ytThumbnailViewModelImage"><img alt=""
                                                                    class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                    src="https://i.ytimg.com/vi/ENRJ0OXXBXo/oardefault.jpg?sqp=-oaymwEdCJUDENAFSFWQAgHyq4qpAwwIARUAAIhCcAHAAQY=&amp;rs=AOn4CLAui_E351HAaE-pK19ZDkBfcaHWfQ&amp;usqp=CCk">
                        </div>
                      </yt-thumbnail-view-model>
                    </div>
                  </a>
                    <div role="presentation"
                         class="shortsLockupViewModelHostOutsideMetadata shortsLockupViewModelHostMetadataRounded shortsLockupViewModelHostOutsideMetadataHasMenu">
                      <div><h3 role="presentation"
                               class="shortsLockupViewModelHostMetadataTitle shortsLockupViewModelHostOutsideMetadataTitle">
                        <a href="/shorts/ENRJ0OXXBXo"
                           class="shortsLockupViewModelHostEndpoint shortsLockupViewModelHostOutsideMetadataEndpoint"
                           style="" aria-haspopup="false"
                           title="Did you Know This About Venator's Gun? | The Armory"><span style=""
                                                                                             class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                                                                             role="text">Did you Know This About Venator's Gun? | The Armory</span></a>
                      </h3>
                        <div
                          class="shortsLockupViewModelHostOutsideMetadataSubhead shortsLockupViewModelHostMetadataSubhead">
                          <span style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                role="text">131K views</span></div>
                      </div>
                      <div
                        class="shortsLockupViewModelHostOutsideMetadataMenu shortsLockupViewModelHostShowOverPlayer image-overlay-text">
                        <button
                          class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                          title="" aria-label="More actions">
                          <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                            class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                            class="yt-icon-shape ytSpecIconShapeHost"><div
                            style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                            focusable="false" aria-hidden="true"
                            style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                            d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                          </div>
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                          </yt-touch-feedback-shape>
                        </button>
                      </div>
                    </div>
                  </ytm-shorts-lockup-view-model>
                </ytm-shorts-lockup-view-model-v2>
                <div data-wxt-integrated=""
                     style="overflow: visible; position: relative; width: 0px; height: 100%; display: block;"
                     data-v-app="">
                  <div id="qa-watch-later-home-button-container" class="qa-home-watch-later">
                    <button id="qa-watch-later-home-button" class="qa-btn"><i class="fa-solid fa-clock fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer">
                <!--css-build:shady--><!--css_build_scope:yt-interaction-->
                <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                <div class="stroke style-scope yt-interaction"></div>
                <div class="fill style-scope yt-interaction"></div>
              </yt-interaction>
            </ytd-rich-item-renderer>
            <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                    is-shelf-item="" is-responsive-grid="EXTRA_COMPACT" no-bottom-margin=""
                                    is-slim-media="" rich-grid-hover-highlight="" hidden=""><!--css-build:shady-->
              <!--css_build_scope:ytd-rich-item-renderer-->
              <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
              <div id="content" class="style-scope ytd-rich-item-renderer" style="position: relative;">
                <ytm-shorts-lockup-view-model-v2 class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer">
                  <ytm-shorts-lockup-view-model class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer"><a
                    href="/shorts/O0xxngqVN3Q" class="shortsLockupViewModelHostEndpoint reel-item-endpoint" style=""
                    aria-haspopup="false" tabindex="-1" aria-hidden="true">
                    <div
                      class="shortsLockupViewModelHostThumbnailParentContainer shortsLockupViewModelHostThumbnailParentContainerRounded">
                      <yt-thumbnail-view-model
                        class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio2By3 ytThumbnailViewModelMedium">
                        <div class="ytThumbnailViewModelImage"><img alt=""
                                                                    class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                    src="https://i.ytimg.com/vi/O0xxngqVN3Q/oardefault.jpg?sqp=-oaymwEdCJUDENAFSFWQAgHyq4qpAwwIARUAAIhCcAHAAQY=&amp;rs=AOn4CLB2XHilz8az3cl6icLFiJlVYbUPEw&amp;usqp=CCk">
                        </div>
                      </yt-thumbnail-view-model>
                    </div>
                  </a>
                    <div role="presentation"
                         class="shortsLockupViewModelHostOutsideMetadata shortsLockupViewModelHostMetadataRounded shortsLockupViewModelHostOutsideMetadataHasMenu">
                      <div><h3 role="presentation"
                               class="shortsLockupViewModelHostMetadataTitle shortsLockupViewModelHostOutsideMetadataTitle">
                        <a href="/shorts/O0xxngqVN3Q"
                           class="shortsLockupViewModelHostEndpoint shortsLockupViewModelHostOutsideMetadataEndpoint"
                           style="" aria-haspopup="false"
                           title="Can’t feel your chest during push-ups? Shoulder pain? This is why. ✅❌"><span style=""
                                                                                                               class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                                                                                               role="text">Can’t feel your chest during push-ups? Shoulder pain? This is why. ✅❌</span></a>
                      </h3>
                        <div
                          class="shortsLockupViewModelHostOutsideMetadataSubhead shortsLockupViewModelHostMetadataSubhead">
                          <span style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                role="text">1.9K views</span></div>
                      </div>
                      <div
                        class="shortsLockupViewModelHostOutsideMetadataMenu shortsLockupViewModelHostShowOverPlayer image-overlay-text">
                        <button
                          class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                          title="" aria-label="More actions">
                          <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                            class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                            class="yt-icon-shape ytSpecIconShapeHost"><div
                            style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                            focusable="false" aria-hidden="true"
                            style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                            d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                          </div>
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                          </yt-touch-feedback-shape>
                        </button>
                      </div>
                    </div>
                  </ytm-shorts-lockup-view-model>
                </ytm-shorts-lockup-view-model-v2>
                <div data-wxt-integrated=""
                     style="overflow: visible; position: relative; width: 0px; height: 100%; display: block;"
                     data-v-app="">
                  <div id="qa-watch-later-home-button-container" class="qa-home-watch-later">
                    <button id="qa-watch-later-home-button" class="qa-btn"><i class="fa-solid fa-clock fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer">
                <!--css-build:shady--><!--css_build_scope:yt-interaction-->
                <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                <div class="stroke style-scope yt-interaction"></div>
                <div class="fill style-scope yt-interaction"></div>
              </yt-interaction>
            </ytd-rich-item-renderer>
            <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                    is-shelf-item="" is-responsive-grid="EXTRA_COMPACT" no-bottom-margin=""
                                    is-slim-media="" rich-grid-hover-highlight="" hidden=""><!--css-build:shady-->
              <!--css_build_scope:ytd-rich-item-renderer-->
              <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
              <div id="content" class="style-scope ytd-rich-item-renderer" style="position: relative;">
                <ytm-shorts-lockup-view-model-v2 class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer">
                  <ytm-shorts-lockup-view-model class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer"><a
                    href="/shorts/o-8Rjw2u5WE" class="shortsLockupViewModelHostEndpoint reel-item-endpoint" style=""
                    aria-haspopup="false" tabindex="-1" aria-hidden="true">
                    <div
                      class="shortsLockupViewModelHostThumbnailParentContainer shortsLockupViewModelHostThumbnailParentContainerRounded">
                      <yt-thumbnail-view-model
                        class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio2By3 ytThumbnailViewModelMedium">
                        <div class="ytThumbnailViewModelImage"><img alt=""
                                                                    class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                    src="https://i.ytimg.com/vi/o-8Rjw2u5WE/oar3.jpg?sqp=-oaymwEdCJUDENAFSFWQAgHyq4qpAwwIARUAAIhCcAHAAQY=&amp;rs=AOn4CLBsEOo3cWwCUKVgbtMnojbB8yFQGQ&amp;usqp=CCk">
                        </div>
                      </yt-thumbnail-view-model>
                    </div>
                  </a>
                    <div role="presentation"
                         class="shortsLockupViewModelHostOutsideMetadata shortsLockupViewModelHostMetadataRounded shortsLockupViewModelHostOutsideMetadataHasMenu">
                      <div><h3 role="presentation"
                               class="shortsLockupViewModelHostMetadataTitle shortsLockupViewModelHostOutsideMetadataTitle">
                        <a href="/shorts/o-8Rjw2u5WE"
                           class="shortsLockupViewModelHostEndpoint shortsLockupViewModelHostOutsideMetadataEndpoint"
                           style="" aria-haspopup="false"
                           title="best team in the world🥀 #deadlock #gaming #twitch"><span style=""
                                                                                           class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                                                                           role="text">best team in the world🥀 #deadlock #gaming #twitch</span></a>
                      </h3>
                        <div
                          class="shortsLockupViewModelHostOutsideMetadataSubhead shortsLockupViewModelHostMetadataSubhead">
                          <span style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                role="text">61K views</span></div>
                      </div>
                      <div
                        class="shortsLockupViewModelHostOutsideMetadataMenu shortsLockupViewModelHostShowOverPlayer image-overlay-text">
                        <button
                          class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                          title="" aria-label="More actions">
                          <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                            class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                            class="yt-icon-shape ytSpecIconShapeHost"><div
                            style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                            focusable="false" aria-hidden="true"
                            style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                            d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                          </div>
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                          </yt-touch-feedback-shape>
                        </button>
                      </div>
                    </div>
                  </ytm-shorts-lockup-view-model>
                </ytm-shorts-lockup-view-model-v2>
                <div data-wxt-integrated=""
                     style="overflow: visible; position: relative; width: 0px; height: 100%; display: block;"
                     data-v-app="">
                  <div id="qa-watch-later-home-button-container" class="qa-home-watch-later">
                    <button id="qa-watch-later-home-button" class="qa-btn"><i class="fa-solid fa-clock fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer">
                <!--css-build:shady--><!--css_build_scope:yt-interaction-->
                <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                <div class="stroke style-scope yt-interaction"></div>
                <div class="fill style-scope yt-interaction"></div>
              </yt-interaction>
            </ytd-rich-item-renderer>
            <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                    is-shelf-item="" is-responsive-grid="EXTRA_COMPACT" no-bottom-margin=""
                                    is-slim-media="" rich-grid-hover-highlight="" hidden=""><!--css-build:shady-->
              <!--css_build_scope:ytd-rich-item-renderer-->
              <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
              <div id="content" class="style-scope ytd-rich-item-renderer" style="position: relative;">
                <ytm-shorts-lockup-view-model-v2 class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer">
                  <ytm-shorts-lockup-view-model class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer"><a
                    href="/shorts/iPkXw_1ghoY" class="shortsLockupViewModelHostEndpoint reel-item-endpoint" style=""
                    aria-haspopup="false" tabindex="-1" aria-hidden="true">
                    <div
                      class="shortsLockupViewModelHostThumbnailParentContainer shortsLockupViewModelHostThumbnailParentContainerRounded">
                      <yt-thumbnail-view-model
                        class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio2By3 ytThumbnailViewModelMedium">
                        <div class="ytThumbnailViewModelImage"><img alt=""
                                                                    class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                    src="https://i.ytimg.com/vi/iPkXw_1ghoY/oardefault.jpg?sqp=-oaymwEdCJUDENAFSFWQAgHyq4qpAwwIARUAAIhCcAHAAQY=&amp;rs=AOn4CLAQBLwVYp1xMx0MrJSOyPtGrLAYLA&amp;usqp=CCk">
                        </div>
                      </yt-thumbnail-view-model>
                    </div>
                  </a>
                    <div role="presentation"
                         class="shortsLockupViewModelHostOutsideMetadata shortsLockupViewModelHostMetadataRounded shortsLockupViewModelHostOutsideMetadataHasMenu">
                      <div><h3 role="presentation"
                               class="shortsLockupViewModelHostMetadataTitle shortsLockupViewModelHostOutsideMetadataTitle">
                        <a href="/shorts/iPkXw_1ghoY"
                           class="shortsLockupViewModelHostEndpoint shortsLockupViewModelHostOutsideMetadataEndpoint"
                           style="" aria-haspopup="false" title="He thought it was an average result😱#anime"><span
                          style="" class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                          role="text">He thought it was an average result😱#anime</span></a></h3>
                        <div
                          class="shortsLockupViewModelHostOutsideMetadataSubhead shortsLockupViewModelHostMetadataSubhead">
                          <span style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                role="text">8.5M views</span></div>
                      </div>
                      <div
                        class="shortsLockupViewModelHostOutsideMetadataMenu shortsLockupViewModelHostShowOverPlayer image-overlay-text">
                        <button
                          class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                          title="" aria-label="More actions">
                          <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                            class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                            class="yt-icon-shape ytSpecIconShapeHost"><div
                            style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                            focusable="false" aria-hidden="true"
                            style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                            d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                          </div>
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                          </yt-touch-feedback-shape>
                        </button>
                      </div>
                    </div>
                  </ytm-shorts-lockup-view-model>
                </ytm-shorts-lockup-view-model-v2>
                <div data-wxt-integrated=""
                     style="overflow: visible; position: relative; width: 0px; height: 100%; display: block;"
                     data-v-app="">
                  <div id="qa-watch-later-home-button-container" class="qa-home-watch-later">
                    <button id="qa-watch-later-home-button" class="qa-btn"><i class="fa-solid fa-clock fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer">
                <!--css-build:shady--><!--css_build_scope:yt-interaction-->
                <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                <div class="stroke style-scope yt-interaction"></div>
                <div class="fill style-scope yt-interaction"></div>
              </yt-interaction>
            </ytd-rich-item-renderer>
            <ytd-rich-item-renderer class="style-scope ytd-rich-shelf-renderer" items-per-row="3" lockup="true"
                                    is-shelf-item="" is-responsive-grid="EXTRA_COMPACT" no-bottom-margin=""
                                    is-slim-media="" rich-grid-hover-highlight="" hidden=""><!--css-build:shady-->
              <!--css_build_scope:ytd-rich-item-renderer-->
              <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js-->
              <div id="content" class="style-scope ytd-rich-item-renderer" style="position: relative;">
                <ytm-shorts-lockup-view-model-v2 class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer">
                  <ytm-shorts-lockup-view-model class="shortsLockupViewModelHost style-scope ytd-rich-item-renderer"><a
                    href="/shorts/pVtggeYYC_Q" class="shortsLockupViewModelHostEndpoint reel-item-endpoint" style=""
                    aria-haspopup="false" tabindex="-1" aria-hidden="true">
                    <div
                      class="shortsLockupViewModelHostThumbnailParentContainer shortsLockupViewModelHostThumbnailParentContainerRounded">
                      <yt-thumbnail-view-model
                        class="ytThumbnailViewModelHost ytThumbnailViewModelAspectRatio2By3 ytThumbnailViewModelMedium">
                        <div class="ytThumbnailViewModelImage"><img alt=""
                                                                    class="ytCoreImageHost ytCoreImageFillParentHeight ytCoreImageFillParentWidth ytCoreImageContentModeScaleAspectFill ytCoreImageLoaded"
                                                                    src="https://i.ytimg.com/vi/pVtggeYYC_Q/oar2.jpg?sqp=-oaymwEdCJUDENAFSFWQAgHyq4qpAwwIARUAAIhCcAHAAQY=&amp;rs=AOn4CLBu6GsX_t2Iixdo9SjW5DLpF6NWug&amp;usqp=CCk">
                        </div>
                      </yt-thumbnail-view-model>
                    </div>
                  </a>
                    <div role="presentation"
                         class="shortsLockupViewModelHostOutsideMetadata shortsLockupViewModelHostMetadataRounded shortsLockupViewModelHostOutsideMetadataHasMenu">
                      <div><h3 role="presentation"
                               class="shortsLockupViewModelHostMetadataTitle shortsLockupViewModelHostOutsideMetadataTitle">
                        <a href="/shorts/pVtggeYYC_Q"
                           class="shortsLockupViewModelHostEndpoint shortsLockupViewModelHostOutsideMetadataEndpoint"
                           style="" aria-haspopup="false" title="Boxer tries to take a leg kick"><span style=""
                                                                                                       class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                                                                                       role="text">Boxer tries to take a leg kick</span></a>
                      </h3>
                        <div
                          class="shortsLockupViewModelHostOutsideMetadataSubhead shortsLockupViewModelHostMetadataSubhead">
                          <span style=""
                                class="yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap"
                                role="text">3.3M views</span></div>
                      </div>
                      <div
                        class="shortsLockupViewModelHostOutsideMetadataMenu shortsLockupViewModelHostShowOverPlayer image-overlay-text">
                        <button
                          class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-button yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                          title="" aria-label="More actions">
                          <div aria-hidden="true" class="yt-spec-button-shape-next__icon"><span
                            class="ytIconWrapperHost" style="width: 24px; height: 24px;"><span
                            class="yt-icon-shape ytSpecIconShapeHost"><div
                            style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                            xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"
                            focusable="false" aria-hidden="true"
                            style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                            d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z"></path></svg></div></span></span>
                          </div>
                          <yt-touch-feedback-shape aria-hidden="true"
                                                   class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                            <div class="yt-spec-touch-feedback-shape__stroke"></div>
                            <div class="yt-spec-touch-feedback-shape__fill"></div>
                          </yt-touch-feedback-shape>
                        </button>
                      </div>
                    </div>
                  </ytm-shorts-lockup-view-model>
                </ytm-shorts-lockup-view-model-v2>
                <div data-wxt-integrated=""
                     style="overflow: visible; position: relative; width: 0px; height: 100%; display: block;"
                     data-v-app="">
                  <div id="qa-watch-later-home-button-container" class="qa-home-watch-later">
                    <button id="qa-watch-later-home-button" class="qa-btn"><i class="fa-solid fa-clock fa-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
              <yt-interaction id="interaction" class="extended rounded-large style-scope ytd-rich-item-renderer">
                <!--css-build:shady--><!--css_build_scope:yt-interaction-->
                <!--css_build_styles:video.youtube.src.web.polymer.shared.ui.styles.yt_base_styles.yt.base.styles.css.js,video.youtube.src.web.polymer.shared.ui.yt_interaction.yt.interaction.css.js-->
                <div class="stroke style-scope yt-interaction"></div>
                <div class="fill style-scope yt-interaction"></div>
              </yt-interaction>
            </ytd-rich-item-renderer>
          </div>
        </div>
        <div class="button-container style-scope ytd-rich-shelf-renderer" hidden="">
          <ytd-button-renderer class="expand-collapse-button style-scope ytd-rich-shelf-renderer" button-renderer=""
                               button-next=""><!--css-build:shady-->
            <yt-button-shape>
              <button
                class="yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-trailing yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                title="" aria-label="Show more">
                <div class="yt-spec-button-shape-next__button-text-content"><span style=""
                                                                                  class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap"
                                                                                  role="text">Show more</span></div>
                <div class="yt-spec-button-shape-next__icon"><span class="ytIconWrapperHost"
                                                                   style="width: 24px; height: 24px;"><span
                  class="yt-icon-shape ytSpecIconShapeHost"><div
                  style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                  xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false"
                  aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                  d="M18.707 8.793a1 1 0 00-1.414 0L12 14.086 6.707 8.793a1 1 0 10-1.414 1.414L12 16.914l6.707-6.707a1 1 0 000-1.414Z"></path></svg></div></span></span>
                </div>
                <yt-touch-feedback-shape aria-hidden="true"
                                         class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                  <div class="yt-spec-touch-feedback-shape__stroke"></div>
                  <div class="yt-spec-touch-feedback-shape__fill"></div>
                </yt-touch-feedback-shape>
              </button>
            </yt-button-shape>
            <tp-yt-paper-tooltip offset="8" disable-upgrade=""></tp-yt-paper-tooltip>
          </ytd-button-renderer>
        </div>
        <div class="button-container style-scope ytd-rich-shelf-renderer" hidden="">
          <ytd-button-renderer class="expand-collapse-button style-scope ytd-rich-shelf-renderer" button-renderer=""
                               button-next=""><!--css-build:shady-->
            <yt-button-shape>
              <button
                class="yt-spec-button-shape-next yt-spec-button-shape-next--outline yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-trailing yt-spec-button-shape-next--enable-backdrop-filter-experiment"
                title="" aria-label="Show less">
                <div class="yt-spec-button-shape-next__button-text-content"><span style=""
                                                                                  class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap"
                                                                                  role="text">Show less</span></div>
                <div class="yt-spec-button-shape-next__icon"><span class="ytIconWrapperHost"
                                                                   style="width: 24px; height: 24px;"><span
                  class="yt-icon-shape ytSpecIconShapeHost"><div
                  style="width: 100%; height: 100%; display: block; fill: currentcolor;"><svg
                  xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false"
                  aria-hidden="true" style="pointer-events: none; display: inherit; width: 100%; height: 100%;"><path
                  d="M5.293 15.207a1 1 0 001.414 0L12 9.914l5.293 5.293a1 1 0 101.414-1.414L12 7.086l-6.707 6.707a1 1 0 000 1.414Z"></path></svg></div></span></span>
                </div>
                <yt-touch-feedback-shape aria-hidden="true"
                                         class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                  <div class="yt-spec-touch-feedback-shape__stroke"></div>
                  <div class="yt-spec-touch-feedback-shape__fill"></div>
                </yt-touch-feedback-shape>
              </button>
            </yt-button-shape>
            <tp-yt-paper-tooltip offset="8" disable-upgrade=""></tp-yt-paper-tooltip>
          </ytd-button-renderer>
        </div>
      </div>
      <div id="dismissed" class="style-scope ytd-rich-shelf-renderer"></div>
    </ytd-rich-shelf-renderer>
  </div>
</ytd-rich-section-renderer>
`;