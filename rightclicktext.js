var menuItem = {
    "id": "clinicalnotes",
    "title": "Clinical Notes AI",
    "contexts": ['selection']
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        "id": "clinicalnotes",
        "title": "Clinical Notes AI",
        "contexts": ['selection']
    });
});

chrome.contextMenus.onClicked.addListener(function(clickData) {
    if (clickData.menuItemId == "clinicalnotes") {
        console.log(clickData);
        console.log("Made a search");
        var clinicalNotesURL = "https://dan-builds-robots.github.io/clinical-notes-website/";

        // create the tab, send text to the tab
        chrome.tabs.create({url: clinicalNotesURL}, function(newTab) {
            console.log("created tab, about to send message");
            chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
                if (tabId == newTab.id) {
                    chrome.tabs.sendMessage(tabId, clickData.selectionText, function(response) {
                        console.log(response.farewell);
                    });
                }
            });
            console.log("message sent");
        });

    }
})