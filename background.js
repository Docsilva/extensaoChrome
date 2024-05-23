//teste de comentario

function isGoogleMeet(url) {
    return url.startsWith("https://meet.google.com/");
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && isGoogleMeet(tab.url)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        });
    }
});
