export function getYtPopupFromDom(): HTMLElement {
  return document.evaluate(
    '/html/body/ytd-app/ytd-popup-container',
    document,
    null,
    XPathResult.ANY_UNORDERED_NODE_TYPE,
    null,
  ).singleNodeValue as HTMLElement;
}
