import { Ids, Tags } from "./element-data";

export type QaButtonClickCallback = () => void;

export class QaButtonInContainer {
  constructor(public completeHtmlElement: HTMLElement, public buttonElement: HTMLButtonElement) {}
}

export class QaHtmlElements {
  static removeButton(): HTMLButtonElement {
    const button = document.createElement(Tags.BUTTON);
    button.id = Ids.QA_REMOVE_BUTTON;
    button.innerHTML = `<i class="fa-solid fa-trash fa-lg"></i>`;
    button.setAttribute("class", "qa-btn");
    return button;
  }

  static removeButtonInWatchingPlaylist(): HTMLButtonElement {
    const button = document.createElement(Tags.BUTTON);
    button.id = Ids.QA_REMOVE_BUTTON;
    button.innerHTML = `<i class="fa-solid fa-trash fa-lg"></i>`;
    button.setAttribute("class", "qa-btn qa-watching-playlist-remove");
    return button;
  }

  static watchLaterUnderVideoButton(clickCallback: QaButtonClickCallback): HTMLButtonElement {
    const button = document.createElement(Tags.BUTTON);
    button.id = Ids.QA_VIDEO_WATCH_LATER;
    button.innerHTML = `<i class="fa-solid fa-clock fa-lg"></i>`;
    button.setAttribute("class", "qa-btn qa-btn-pill");
    button.onclick = clickCallback;
    return button;
  }

  static watchLaterHomeVideoButton(clickCallback: QaButtonClickCallback): QaButtonInContainer {
    const flexContainer = document.createElement("div");
    flexContainer.id = Ids.QA_FLEX_CONTAINER_REMOVE_BUTTON;
    flexContainer.setAttribute("class", "qa-home-watch-later");

    const button = document.createElement(Tags.BUTTON);
    button.id = Ids.QA_HOME_WATCH_LATER;
    button.innerHTML = `<i class="fa-solid fa-clock fa-lg"></i>`;
    button.setAttribute("class", "qa-btn");
    button.onclick = clickCallback;

    flexContainer.append(button);
    return new QaButtonInContainer(flexContainer, button);
  }
}

export function qaMoveTopButton(clickCallback: QaButtonClickCallback) {
  const button = document.createElement(Tags.BUTTON);
  button.id = Ids.QA_MOVE_TOP;
  button.innerHTML = `<i class="fa-solid fa-chevron-up fa-lg"></i>`;
  button.setAttribute("class", "qa-btn move-btn");
  button.onclick = clickCallback;
  return button;
}

export function qaMoveBottomButton(clickCallback: QaButtonClickCallback) {
  const button = document.createElement(Tags.BUTTON);
  button.id = Ids.QA_MOVE_BOTTOM;
  button.innerHTML = `<i class="fa-solid fa-chevron-down fa-lg"></i>`;
  button.setAttribute("class", "qa-btn move-btn");
  button.onclick = clickCallback;
  return button;
}

export function qaMoveButtonsContainer(buttons: HTMLButtonElement[]) {
  const flexContainer = document.createElement("div");
  flexContainer.id = Ids.QA_FLEX_CONTAINER_MOVE_BUTTONS;
  flexContainer.setAttribute("class", "qa-drag-container-overlay");

  flexContainer.append(...buttons);
  return flexContainer;
}
