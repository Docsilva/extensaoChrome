function isGoogleMeet(url) {
    return url.startsWith("https://meet.google.com/");
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && isGoogleMeet(tab.url)) {
        console.log("Google Meet tab detected. Injecting content.js");
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        });
    }
});
