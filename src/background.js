chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        console.log('A new page has been loaded:', tab.url);
    }
});



console.log("background.js loaded")
