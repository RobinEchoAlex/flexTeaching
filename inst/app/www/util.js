const STU_ANS_TAG_PREFIX = "student_ans_"
const STU_ATP_TAG_PREFIX = "student_attempt_"

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

Shiny.addCustomMessageHandler("response_download_onClick",
    function(id) {
       responseDownload();
    }
);

function responseDownload() {
    //a new doc containing all responses and to be downloaded
    let doc = document.implementation.createHTMLDocument("Assignment Response");
    let link = doc.createElement("link");

    link.rel ="stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css";
    link.integrity = "sha384-Um5gpz1odJg5Z4HAmzPtgZKdTBHZdw8S29IecapCSB31ligYPhHQZMIlWLYQGVoc";
    link.crossOrigin= "anonymous";
    doc.body.appendChild(link);

    let id = document.querySelector('#id');
    let idDiv = doc.createElement('div');
    idDiv.id = "id";
    idDiv.textContent = (id!=null && id!=="") ? id.value : "ID IS NOT DEFINED";
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

// For testing only
/*
$(document).on('shiny:connected', function(event) {
    alert('Connected to the server');
});
*/

