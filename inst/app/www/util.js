// shinyjs.addMarkingComponent = function (params){
//     alert("fds");
//     let doc = new DOMParser().parseFromString(params.htmlString,"text/xml")
//     doc.querySelectorAll("div").forEach(function (node){
//         let input = doc.createElement("input")
//         input.id="mark_"+node.id
//         node.appendChild(input);
//     })
// };

$(document).on('shiny:connected', function(event) {
    alert('Connected to the server');
});

$(document).on('shiny:value', function(event) {
    // cancel the output of the element with id 'foo'
    if (event.target.id==='responseBox'){
        alert(event.name+event.value+event.binding);
    }
});

