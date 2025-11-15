import { getYtPopupFromDom } from '@/utils/yt-popup';

export function allowYtPopupVisibility(popup?: HTMLElement) {
  if (!popup) {
    popup = getYtPopupFromDom();
  }
  popup.style.visibility = 'visible';
}

export function hideYtPopup(popup?: HTMLElement) {
  if (!popup) {
    popup = getYtPopupFromDom();
  }
  popup.style.visibility = 'hidden';
}
