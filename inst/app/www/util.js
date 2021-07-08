// shinyjs.addMarkingComponent = function (params){
//     alert("fds");
//     let doc = new DOMParser().parseFromString(params.htmlString,"text/html")
//     doc.querySelectorAll("div").forEach(function (node){
//         let input = doc.createElement("input")
//         input.id="mark_"+node.id
//         node.appendChild(input);
//     })
// };

// For testing only
/*
$(document).on('shiny:connected', function(event) {
    alert('Connected to the server');
});
*/
const STU_ANS_TAG_PREFIX = "student_ans_"
const STU_ATP_TAG_PREFIX = "student_attempt_"

/**
 * When the responseBox receives new student response file,
 * append a inputBox for mark into every <div> answer section, whose id is regulated to start with "stu_ans"
 */
$(document).on('shiny:value', function (event) {
    if (event.target.id === 'responseBox') {

        // student response html to DOM
        let doc = new DOMParser().parseFromString(event.value.html, "text/html");

        //TODO not working properly // If the solutions is not shown (so the std_ans is not calculated), check the box
        if (!document.getElementById('solutions').checked) {
            document.getElementById('solutions').checked = true
            Shiny.setInputValue("solutions", true, {priority: "event"})
        }

        // Match the id field with current student's, hence load the correct dataset for him.
        if (document.getElementById("id").value !== doc.getElementById("id").innerText) {
            Shiny.setInputValue("id", doc.getElementById("id").innerText);
            document.getElementById("id").value = doc.getElementById("id").innerText;
        }

        // Append objective questions' correctness and mark awarding field to every student_ans div tag
        doc.querySelectorAll("div.student_ans").forEach(function (node) {
            debugger;
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
        // Update the html string to be rendered
        event.value.html = doc.body.innerHTML;
    }
});

Shiny.addCustomMessageHandler("marking_download_onClick",
    function (message) {
        var responses = $("#responseBox").clone(true);
        responses.find(":input").each(function () {
            console.log(this.id + this.value);
            debugger;
            let dd = $('<dd>')
                .attr("id", this.id)
                .text(this.value);
            $(this).replaceWith(dd);
        })

        //TODO redundant code with test2_response_download.js
        var h = $('<html></html>')
        var b = $('<body></body>')

        b.appendTo(h)
            .append(responses);

        $('<a></a>')
            .attr('id', 'marking_download')
            .attr('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(h[0].outerHTML))
            .attr('download', 'marks.html')
            .hide()
            .appendTo('body')[0]
            .click()

        $('#marking_download').remove()
    }
);

Shiny.addCustomMessageHandler("response_download_onClick", {
    function(id) {
        responseDownload(id);
    }
});

function responseDownload(id) {
    //TODO pass id when called from js
    if (id == null) {
        id = "Warning: ID is not defined"
    }

    //a new doc containing all responses and to be downloaded
    let doc = document.implementation.createHTMLDocument("Assignment Response");

    let idDiv = doc.createElement('div');
    idDiv.id = "id";
    idDiv.textContent = id;
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
    let filename = 'response.html';

    // Trigger auto download
    let aDownload = document.createElement('a');
    aDownload.href = url;
    aDownload.download = filename;
    aDownload.click();
}


