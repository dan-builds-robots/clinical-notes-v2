// chrome.runtime.onMessage.addListener(replace);

// function replace(message, sender, sendresponse) {
//     console.log(message);
//     console.log("about to replace text")
//     let inputBox = document.getElementById("original_text");
//     inputBox.value = message;
// }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    console.log("about to replace text")
    let inputBox = document.getElementById("original_text");
    inputBox.value = message;
});