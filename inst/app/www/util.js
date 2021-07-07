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
        debugger;

        // student response html to DOM
        let doc = new DOMParser().parseFromString(event.value.html, "text/html");

        //TODO not working // If the solutions is not shown (so the std_ans is not calculated), check the box
        if (!document.getElementById('solutions').checked){
            Shiny.setInputValue("solutions",true)
            document.getElementById('solutions').checked = true
        }

        // Match the id field with current student's, hence load the correct dataset for him.
        if (document.getElementById("id").value!==doc.getElementById("id").innerText){
            Shiny.setInputValue("id", doc.getElementById("id").innerText);
            document.getElementById("id").value = doc.getElementById("id").innerText;
        }

        // Append objective questions' correctness and mark awarding field to every student_ans div tag
        doc.querySelectorAll("div.student_ans").forEach(function (node) {
            let questionNumber = node.id.substring(12,node.id.length); //TODO hardcode
            let ans = parseFloat(node.querySelector("dd").innerText)
            let standardAnsId = "#"+"standard_ans_"+questionNumber
            let standard_ans = parseFloat(document.querySelector(standardAnsId).textContent)
            let isCorrect = Math.abs(standard_ans-ans)<0.1 //TODO hardcode threshold

            let isCorrectOutput = document.createElement("p")
            let textNode = document.createTextNode( isCorrect ? "Correct" : "Incorrect");
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
