export interface YtdMenuServiceItemRendererStructure {
  path: HTMLElement;
  g: HTMLElement;
  svg: HTMLElement;
  ytIcon: HTMLElement;
  tpYtPaperItem: HTMLElement;
  ytdMenuServiceItemRenderer: HTMLElement;
}

export function setupYtdMenuServiceItemRendererSample(): YtdMenuServiceItemRendererStructure {
  const ytdMenuServiceItemRenderer = document.createElement(
    "ytd-menu-service-item-renderer"
  );
  const tpYtPaperItem = document.createElement("tp-yt-paper-item");
  const ytIcon = document.createElement("yt-icon");
  const svg = document.createElement("svg");
  const g = document.createElement("g");
  const path = document.createElement("path");

  g.appendChild(path);
  svg.appendChild(g);
  ytIcon.appendChild(svg);
  tpYtPaperItem.appendChild(ytIcon);
  ytdMenuServiceItemRenderer.appendChild(tpYtPaperItem);

  return {
    g,
    path,
    svg,
    tpYtPaperItem,
    ytIcon,
    ytdMenuServiceItemRenderer,
  };
}
