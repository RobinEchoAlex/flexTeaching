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
$(document).on('shiny:value', function(event) {
    if (event.target.id==='responseBox'){
        // student response html to DOM
        let doc = new DOMParser().parseFromString(event.value.html,"text/html");
        // append input box
        doc.querySelectorAll("[id^='stu_ans_']").forEach(function (node){
            let input = document.createElement("input")
            input.id = "mark_" + node.id
            node.appendChild(input);
        })
        // update the html string to be rendered
        event.value.html = doc.body.innerHTML;
    }
});

