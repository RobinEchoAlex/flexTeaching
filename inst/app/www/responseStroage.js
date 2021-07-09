//import {JSZip} from './jszip-3.6.0/dist/jszip.min.js'
//import JSZip from 'jszip-3.6.0';

var responseStorage = Array();
var currentResponseNum =0;

function displayNextResponse() {
    saveCurrentResponse();
    if (currentResponseNum+1>=responseStorage.length){
        alert("the last response!");
        return;
    }
    displayResponse(++currentResponseNum);
}

function displayPreviousResponse() {
    saveCurrentResponse();
    if (currentResponseNum<=0){
        alert("the first response!");
        return;
    }
    displayResponse(--currentResponseNum);
}

function initStorage(htmlStrings) {
    currentResponseNum = 0;
    responseStorage =Array();

    for (let i = 0; i < htmlStrings.length; i++) {
        let htmlString = htmlStrings[i];

        // student response html to DOM
        let docLoaded = new DOMParser().parseFromString(htmlString, "text/html");

        if (!document.getElementById('solutions').checked) {
            document.getElementById('solutions').checked = true
            Shiny.setInputValue("solutions", true, {priority: "event"})
        }

        // Match the id field with current student's, hence load the correct dataset for him.
        if (document.getElementById("id").value !== docLoaded.getElementById("id").innerText) {
            Shiny.setInputValue("id", docLoaded.getElementById("id").innerText);
            document.getElementById("id").value = docLoaded.getElementById("id").innerText;
        }

        debugger;
        // Append objective questions' correctness and mark awarding field to every student_ans div tag
        docLoaded.querySelectorAll("div.student_ans").forEach(function (node) {
            let questionNumber = node.id.substring(12, node.id.length); //TODO hardcode
            let ans = parseFloat(node.querySelector("dd").innerText)
            if (node.querySelector(".ql-editor") !=null) {
                return;
            }
            let standardAnsId = "#" + "standard_ans_" + questionNumber
            let standard_ans = parseFloat(document.querySelector(standardAnsId).textContent)
            let isCorrect = Math.abs(standard_ans - ans) < 0.1 //TODO hardcode threshold

            let isCorrectOutput = document.createElement("p")
            let textNode = document.createTextNode(isCorrect ? "Correct" : "Incorrect");
            isCorrectOutput.appendChild(textNode);
            node.appendChild(isCorrectOutput)

            let input = document.createElement("input")
            input.id = "mark_" + node.id
            node.appendChild(input);
        })

        responseStorage.push(docLoaded);
    }
    displayResponse(0);

}

function saveCurrentResponse() {
    let responseRegionHtmlString = document.getElementById("responseBox").innerHTML;
    let docToSave = new DOMParser().parseFromString(responseRegionHtmlString, "text/html");
    document.getElementById("responseBox").querySelectorAll("input").forEach(function (node) {
        if(docToSave.getElementById(node.id)==null){
            throw 'cannot find the corresponding node in the document to save'
        }
        docToSave.getElementById(node.id).defaultValue = node.value;
    });

    responseStorage[currentResponseNum] = docToSave;
}

function displayResponse(i) {
    if (!document.getElementById('solutions').checked) {
        document.getElementById('solutions').checked = true
        Shiny.setInputValue("solutions", true, {priority: "event"})
    }

    // Match the id field with current student's, hence load the correct dataset for him.
    if (document.getElementById("id").value !== responseStorage[i].getElementById("id").innerText) {
        Shiny.setInputValue("id", responseStorage[i].getElementById("id").innerText);
        document.getElementById("id").value = responseStorage[i].getElementById("id").innerText;
    }

    document.getElementById("responseBox").innerHTML = responseStorage[i].body.innerHTML;
}

function setCorrespondingDataset(i){
    if (!document.getElementById('solutions').checked) {
        document.getElementById('solutions').checked = true
        Shiny.setInputValue("solutions", true, {priority: "event"})
    }

    // Match the id field with current student's, hence load the correct dataset for him.
    if (document.getElementById("id").value !== responseStorage[i].getElementById("id").innerText) {
        Shiny.setInputValue("id", responseStorage[i].getElementById("id").innerText);
        document.getElementById("id").value = responseStorage[i].getElementById("id").innerText;
    }
}

//todo extract message name
Shiny.addCustomMessageHandler("init_response_storage",
    function (htmlStrings) {
        initStorage(htmlStrings);
    }
)

Shiny.addCustomMessageHandler("next_response_onclick",
    function (message){
        displayNextResponse();
    })

Shiny.addCustomMessageHandler("previous_response_onclick",
    function (message){
        displayPreviousResponse();
    })