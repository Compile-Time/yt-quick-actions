export function getYtPopupFromDom(): HTMLElement {
  return document.evaluate(
    '/html/body/ytd-app/ytd-popup-container',
    document,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null,
  ).singleNodeValue as HTMLElement;
}

export function getTpYtIronDropDownFromDom() {
  return document.evaluate(
    '/html/body/ytd-app/ytd-popup-container/tp-yt-iron-dropdown',
    document,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null,
  ).singleNodeValue as HTMLElement;
}
