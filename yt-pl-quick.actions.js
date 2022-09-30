class TreeItem {
    id;
    tagName;
    parent;
    child;
    content;

    constructor(id, tagName, content, parent, child) {
        this.id = id;
        this.tagName = tagName;
        this.parent = parent;
        this.child = child;
        this.content = content;
    }

    static withId(tagName, id) {
        return new TreeItem(id, tagName, null, null, null);
    }

    static withContent(tagName, content) {
        return new TreeItem(null, tagName, content, null, null);
    }

    addChild(treeItem) {
        treeItem.parent = this;
        this.child = treeItem;
    }
}

function connectTreeItems(treeItems) {
    for (let i = 0; i < treeItems.length - 1; i++) {
        let parent = treeItems[i];
        let child = treeItems[i + 1];

        parent.addChild(child);
    }
}

function setupButtonToPlaylistHolderTree() {
    const treeToPlaylistHolder = [
        TreeItem.withId('ytd-app', null),
        TreeItem.withId('div', 'content'),
        TreeItem.withId('ytd-page-manager', 'page-manager'),
        TreeItem.withId('ytd-browse', null),
        TreeItem.withId('ytd-two-column-browse-results-renderer', null),
        TreeItem.withId('div', 'primary'),
        TreeItem.withId('ytd-section-list-renderer', null),
        TreeItem.withId('div', 'contents'),
        TreeItem.withId('ytd-item-section-renderer', null),
        TreeItem.withId('div', 'contents'),
        TreeItem.withId('ytd-playlist-video-list-renderer', null),
        TreeItem.withId('div', 'contents')
    ];

    connectTreeItems(treeToPlaylistHolder);
    return treeToPlaylistHolder;
}

function setupPlaylistItemToMenuButtonTree() {
    const playlistItemTree = [
        TreeItem.withId('div', 'menu'),
        TreeItem.withId('ytd-menu-renderer', null),
        TreeItem.withId('yt-icon-button', 'button'),
    ];

    connectTreeItems(playlistItemTree);
    return playlistItemTree;
}

function setupPopupContainerToMenuDeleteTree() {
    const popupTree = [
        TreeItem.withId('ytd-app', null),
        TreeItem.withId('ytd-popup-container', null),
        TreeItem.withId('tp-yt-iron-dropdown', null),
        TreeItem.withId('div', 'contentWrapper'),
        TreeItem.withId('ytd-menu-popup-renderer', null),
        TreeItem.withId('tp-yt-paper-listbox', 'items'),
    ];

    connectTreeItems(popupTree);
    return popupTree;
}

function setupMenuPopupToDeleteItem() {
    const menuPopupTree = [
        // TreeItem.withId('ytd-menu-service-item-renderer', null),
        TreeItem.withId('tp-yt-paper-item', null),
        TreeItem.withId('yt-formatted-string', null),
        TreeItem.withContent('span', 'Remove from'),
    ];

    connectTreeItems(menuPopupTree);
    return menuPopupTree;
}

function getNextTreeItem(parentElement, treeItem) {
    const elements = parentElement.getElementsByTagName(treeItem.tagName);

    for (const element of elements) {
        let elementTagName = element.tagName.toLowerCase();

        if (!treeItem.id) {
            if (elementTagName === treeItem.tagName && element.innerText === treeItem.content) {
                return element;
            } else if (elementTagName === treeItem.tagName) {
                return element;
            }
        } else {
            if (element.id === treeItem.id && elementTagName === treeItem.tagName) {
                return element;
            }
        }
    }
    return null;
}

function navigateTreeToFinalElement(element, treeItem) {
    const foundElement = getNextTreeItem(element, treeItem);

    if (!!treeItem.child && !!foundElement) {
        return navigateTreeToFinalElement(foundElement, treeItem.child)
    }

    return foundElement;
}

const bodyToPlaylistHolderTree = setupButtonToPlaylistHolderTree();
const playlistItemToMenuButtonTree = setupPlaylistItemToMenuButtonTree();
const popupContainerToMenuDeleteTree = setupPopupContainerToMenuDeleteTree();
const menuPopupToDeleteItemTree = setupMenuPopupToDeleteItem();

function getPlaylistItems() {
    const videoPlaylist = navigateTreeToFinalElement(document.body, bodyToPlaylistHolderTree[0]);
    const videoPlaylistItems = videoPlaylist.getElementsByTagName('ytd-playlist-video-renderer');

    return videoPlaylistItems;
}

function openItemMenu(playlistItem) {
    const button = navigateTreeToFinalElement(playlistItem, playlistItemToMenuButtonTree[0]);
    button.click();
}

function triggerDelete() {
    const menuItemsHolder = navigateTreeToFinalElement(document.body, popupContainerToMenuDeleteTree[0]);
    const menuItems = menuItemsHolder.getElementsByTagName('ytd-menu-service-item-renderer');
    console.log('menu items', menuItems);

    const span = navigateTreeToFinalElement(menuItems[2], menuPopupToDeleteItemTree[0]);
    console.log('span', span);
}

function main() {
    const videoPlaylist = navigateTreeToFinalElement(document.body, bodyToPlaylistHolderTree[0]);
    const videoPlaylistItems = videoPlaylist.getElementsByTagName('ytd-playlist-video-renderer');

    const firstItem = videoPlaylistItems[0];
    const firstItemMenu = navigateTreeToFinalElement(firstItem, playlistItemToMenuButtonTree[0]);
    console.log('button', firstItemMenu);

    // This cause the popup HTML to be loaded.
    firstItemMenu.click();
    firstItemMenu.click();

    const myButton = document.createElement('button');
    myButton.innerText = 'Remove';
    myButton.onclick = () => {
        firstItemMenu.click();
        triggerDelete();
    };

    firstItemMenu.parentElement.parentElement.insertBefore(myButton, firstItemMenu.parentElement);
}

// main();

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.nodeName.toLowerCase() === 'ytd-browse') {
            console.log('node', mutation);
            main();
        }
    })
})

observer.observe(document.body, {
    childList: true, subtree: true, attributes: false, characterData: false
})

