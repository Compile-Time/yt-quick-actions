# More option changes in YouTube

This documentation attempts to give an insight about how YouTube modifies
its "ytd-popup-container" element for more option buttons ("...") when
watching for path element changes and hidden attribute changes. However,
note that the information here may not be 100% correct for every use-case
since the information presented here comes mostly from observation.

## Initialization changes

In general YouTube has three change patterns when observing changes for a
specific path element or hidden attribute with a MutationSummary.

### Initialization on the current page

This case occurs when reloading on the current page and opening the more
options menu. YouTube will then initialize all SVGs used in the drop-down.

### Initialization after moving from a different page

This case occurs when a drop-down is used on a different page (which causes
initialization for it) and then the user moves to a different page and opens
a drop-down there.

In this situation YouTube will first hide all menu options
("ytd-service-menu-item-renderer"), un-hide as many options as necessary for
the page and then add the required SVGs.

The above pattern has the undesired side effect that when watching for changes
to the hidden attribute as a baseline to perform automatic clicks the
underlying path element in the "ytd-service-menu-item-renderer" may still be
from the previous page that is also valid for the new page. So code that
processes each change individually will run into a false positive situation
where a click is triggered for a "ytd-service-menu-item-renderer" that looks
to be correct but in less than a few milliseconds will have its action and
path element be changed to a different action.

Here is a theoretical example: A user is moving from video A to video B. Video
A has three actions in the more options popup: save, report and show transcript.
Video B also has these actions, but they are ordered after share, thanks and
clip. The save action from video A will be converted to one of video B's
actions. So an automatic click could either trigger share, thanks or clip.

Note: The above is only an example. In some instances the report action was
also triggered instead of save, which would not explain the behaviour of the
example. The main takeaway is that for this use case changes need to be
accumulated in some form of state and processed as a whole, not in isolated
iterations. Alternatively, by opening and closing the more options button it
only is necessary to observe hidden changes like in the "No initialization"
section. However, this might not work on all pages.

### Changes to drop-down content on the same page

This case occurs when actions can be moved in and out of a more options menu.
An example for this would be the video page where actions are shown or
hidden under the video depending on browser window size.

Here the same change pattern can be observed as in the section "Initialization
after moving from a different page". However, the concrete behaviour might
not be the same. So while they appear to be equal, there are subtle
differences in how YouTube handles the changes.

### No initialization

This case occurs when a drop-down has already been opened once so all its
elements are loaded.

Here YouTube will simply hide and un-hide the
"ytd-service-menu-item-renderer" elements inside the more options menu.
