// shinyjs.addMarkingComponent = function (params){
//     alert("fds");
//     let doc = new DOMParser().parseFromString(params.htmlString,"text/xml")
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


$(document).on('shiny:value', function(event) {
    if (event.target.id==='responseBox'){
        let doc = new DOMParser().parseFromString(event.value.html,"text/html");
        debugger;
        doc.querySelectorAll("[id^='stu_ans_']").forEach(function (node){
            let input = document.createElement("input")
            input.id = "mark_" + node.id
            node.appendChild(input);
        })
        event.value.html = doc.body.innerHTML;
    }
});

