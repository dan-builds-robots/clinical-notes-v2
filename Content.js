
// const titles = document.getElementsByTagName("span");
// const titles = document.querySelectorAll("span, div");
// // alert(titles.length);
// for (var i = 0; i < titles.length; i++) {
//     if (titles[i].tagName == "span" && titles[i].innerHTML.includes("Assessment and Plan:")) {
//         // alert(titles[i]);
//         onlyHighlight(0, titles[i].innerHTML.length, titles[i]);
//         titles = titles.splice(i);
//         highlightRelevantText(titles);
//         break;
//     }
// }

// const titles = document.getElementsByTagName("p");
const elems = document.querySelectorAll('span');
// const elems = document.querySelectorAll('span, p');
highlightRelevantText(elems);

let addedCSS = false;

function highlightRelevantText(texts) {
    let startHighlighting = false;
    // let startHighlighting = true;
    for (var i = 0; i < texts.length; i++) {
        // highlight(0, texts[i].innerHTML.length, texts[i]);
        // let num1 = randomNum(0, texts[i].innerHTML.length);
        // let num2 = randomNum(0, texts[i].innerHTML.length);
        // if (startHighlighting && texts[i].tagName == "P") {
        // if (startHighlighting && texts[i].tagName == "SPAN") {
        if (startHighlighting) {
            let num1 = randomSpace(texts[i].innerHTML);
            let num2 = randomSpace(texts[i].innerHTML);
            highlight(Math.min(num1, num2) + 1, Math.max(num1, num2), texts[i]);
        }

        // if (texts[i].tagName == "SPAN" && texts[i].innerText == "Career" && texts[i].id == "Career") {
        //     startHighlighting = true;
        // }

        // if (texts[i].tagName == "SPAN" && texts[i].innerText == "Early life") {
        //     startHighlighting = true;
        // }

        if (texts[i].innerText.includes("Assessment")) {
            startHighlighting = true;
        }


        // if (texts[i].tagName == "SPAN" && texts[i].innerText.includes("Assessment")) {
        //     startHighlighting = true;
        //     // alert("FOUND ASSESSMENT")
        //     // alert(h)
        // }
    }
}


// const texts = document.getElementsByTagName("p");
// for (var i = 0; i < texts.length; i++) {
//     // highlight(0, texts[i].innerHTML.length, texts[i]);
//     // let num1 = randomNum(0, texts[i].innerHTML.length);
//     // let num2 = randomNum(0, texts[i].innerHTML.length);
//     let num1 = randomSpace(texts[i].innerHTML);
//     let num2 = randomSpace(texts[i].innerHTML);
//     highlight(Math.min(num1, num2) + 1, Math.max(num1, num2), texts[i]);
// }



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    console.log("about to replace text")
    let inputBox = document.getElementById("original_text");
    inputBox.value = message;
});

function onlyHighlight(start_index, end_index, inputText) {
    var innerHTML = inputText.innerHTML;

    var before = innerHTML.substring(0, start_index);
    var important = innerHTML.substring(start_index, end_index);
    var after = innerHTML.substring(end_index);

    innerHTML = before + "<span style = 'background-color: #fff6b0;'>" + important + "</span>" + after;
    inputText.innerHTML = innerHTML;

}

function highlight(start_index, end_index, inputText) {
    var innerHTML = inputText.innerHTML;

    var before = innerHTML.substring(0, start_index);
    var important = innerHTML.substring(start_index, end_index);
    var after = innerHTML.substring(end_index);


    var popupHTML = "<span class='tooltiptext'>" + "Text" + "</span>";
    innerHTML = before + "<span class='highlight tooltip'>" + important + popupHTML + "</span>" + after;
    inputText.innerHTML = innerHTML;
    if (!addedCSS) {
        var popupCSS = `
            .tooltiptext {
                visibility: hidden;
                background-color: black;
                color: #fff;
                padding: 5px;
                border-radius: 6px;
                z-index: 2;
                position: absolute;
            }

            .tooltip {
                border: none;
                underline: none;
            }

            .tooltip:hover .tooltiptext {
                visibility: visible;
            }

            .highlight {
                background-color: #fff6b0;
            }
        `;
        var styleSheet = document.createElement("style");
        styleSheet.innerText = popupCSS;
        document.head.appendChild(styleSheet);
        addedCSS = true;
    }
}

function randomNum(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function randomSpace(innerHTML) {
    const indexes = [];
    var insideATag = false;

    for (let index = 0; index < innerHTML.length; index++) {
        if (innerHTML[index] == '<') {
            insideATag = true;
        } else if (innerHTML[index] == '>') {
            insideATag = false;
        }
        if (!insideATag && innerHTML[index] === ' ') {
            indexes.push(index);
        }

        if (!insideATag && innerHTML[index] === '.') {
            indexes.push(index);
        }
    }

    return indexes[Math.floor(Math.random() * (indexes.length))];
}




            // "matches": ["<all_urls>"],
            // "matches": ["<all_urls>"],https://www.dukemychart.org/Home/inside.asp?mode=visitsummary&submode=notes
            // "matches": ["https://en.wikipedia.org*"],