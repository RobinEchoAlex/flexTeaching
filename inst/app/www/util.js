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

/**
 * When the responseBox receives new student response file,
 * append a inputBox for mark into every <div> answer section, whose id is regulated to start with "stu_ans"
 */
$(document).on('shiny:value', function (event) {
    if (event.target.id === 'responseBox') {
        // student response html to DOM
        let doc = new DOMParser().parseFromString(event.value.html, "text/html");
        // append input box
        doc.querySelectorAll("[id^='stu_ans_']").forEach(function (node) {
            let input = document.createElement("input")
            input.id = "mark_" + node.id
            node.appendChild(input);
        })
        // update the html string to be rendered
        event.value.html = doc.body.innerHTML;
    }
});

Shiny.addCustomMessageHandler("testmessage",
    function (message) {
        var responses = $("#responseBox").clone(true);
        responses.find(":input").each(function () {
            console.log(this.id+this.value);
            debugger;
            let dd= $('<dd>')
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
