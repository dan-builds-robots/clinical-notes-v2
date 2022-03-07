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
        var wikiUrl = "https://en.wikipedia.org/wiki/";
        var createData = {
            "url": wikiUrl,
            "type": "popup",
            "top": 5,
            "left": 5,
            // "width": Math.round(window.screen.availWidth / 2),
            // "height": Math.round(window.screen.availHeight / 2)
        };
        // chrome.windows.create(createData, function(){});
        chrome.tabs.create({ url: wikiUrl });
    }
})