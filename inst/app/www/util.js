const STU_ANS_TAG_PREFIX = "student_ans_"
const STU_ATP_TAG_PREFIX = "student_attempt_"


function markingDownload() {
    let zip = new JSZip();

    saveCurrentResponse();

    for (let i = 0; i < responseStorage.length; i++) {
        let markedDoc = responseStorage[i].cloneNode(true);
        markedDoc.querySelectorAll("input").forEach(function (node) {
            let dd = markedDoc.createElement("dd");
            dd.id = node.id;
            dd.innerText = node.value;
            node.replaceWith(dd);
        })

        //todo throw error/handle students with same id
        let filename = markedDoc.getElementById("id").innerText + ".html"
        zip.file(filename, markedDoc.body.innerHTML);
    }

    zip.generateAsync({type: "blob"})
        .then(function (content) {
            saveAs(content, "example.zip");
        });
}

function responseDownload() {
    //a new doc containing all responses and to be downloaded
    let doc = document.implementation.createHTMLDocument("Assignment Response");
    let link = doc.createElement("link");

    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css";
    link.integrity = "sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc";
    link.crossOrigin = "anonymous";
    doc.body.appendChild(link);

    let id = document.querySelector('#id');
    let idDiv = doc.createElement('div');
    idDiv.id = "id";
    idDiv.textContent = (id != null && id.value !== "") ? id.value : "ID IS NOT DEFINED";
    doc.body.appendChild(idDiv);

    let dl = doc.createElement("dl");
    doc.body.appendChild(dl);

    //fetch the value of all input fields (whose id starts with "input") //TODO easy violation
    document.querySelectorAll(`[id^=${STU_ATP_TAG_PREFIX}]`).forEach(function (node) {
            console.log(node.id);
            console.log(node.value);

            let div = doc.createElement('div');
            div.className = "student_ans"
            div.id = node.id.replace(STU_ATP_TAG_PREFIX, STU_ANS_TAG_PREFIX);
            let dt = doc.createElement("dt");
            let dd = doc.createElement("dd");
            if (node.nodeName === "INPUT") {
                dt.innerText = node.id;
                dd.innerText = node.value;
            } else if (node.nodeName === "DIV") {
                let ql_editor = node.querySelector(".ql-editor").cloneNode(true);
                dt.innerText = node.id;
                dd.appendChild(ql_editor);
            }
            div.appendChild(dt);
            div.appendChild(dd);
            dl.appendChild(div);
        }
    );

    //Assemble the blob that contains the HTML
    let blob = new Blob([doc.body.innerHTML]);
    let url = window.URL.createObjectURL(blob);
    let filename = 'response' + ((id != null && id.value !== "") ? id.value : "ID IS NOT DEFINED") + '.html';

    // Trigger auto download
    let aDownload = document.createElement('a');
    aDownload.href = url;
    aDownload.download = filename;
    aDownload.click();
}

Shiny.addCustomMessageHandler("response_download_onClick",
    function (id) {
        responseDownload();
    }
);

Shiny.addCustomMessageHandler("marking_download_onClick",
    function (message) {
        markingDownload();
    }
);

// For testing only
/*
$(document).on('shiny:connected', function(event) {
    alert('Connected to the server');
});
*/

window.onload = function (){
    $(window).off('resize');
}

