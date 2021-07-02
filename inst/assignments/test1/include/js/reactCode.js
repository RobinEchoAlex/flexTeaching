function responseDownload() {

    //a new doc containing all responses and to be downloaded
    let doc = document.implementation.createHTMLDocument("Assignment Response");
    //stu_id, {id} will be replaced by real id int at runtime, see loadScript()
    let id = {id};
    let idDiv = doc.createElement('div')
    idDiv.id = "id"
    idDiv.textContent = id
    doc.body.appendChild(idDiv)

    //fetch the value of all input fields (whose id starts with "input") //TODO easy violation
    document.querySelectorAll('[id^="input_"]').forEach(function (node){
            console.log(node.id);
            console.log(node.value);

            let div = doc.createElement('div')
            div.id=node.id
            div.textContent= node.id + ":" + node.value
            doc.body.appendChild(div);
        }
    );

    // Adding the head and body tag enables title (the argu in the creHTMLdoc()) display
    // But now the downloaded file is encoded as "&lt;head&gt;", which prevents rendering properly
    // Not resolved yet
    /*
    var serialized =
        '<head>' +
        doc.getElementsByTagName('head')[0].innerHTML +
        '</head><body>' +
        doc.body.innerHTML +
        '</body>';
    */

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

ReactDOM.render(
    <div>
        <input id='input_q1'/>
        <br/>
        <button onClick={responseDownload}>
            Download your response
        </button>
    </div>
    ,
    document.getElementById("app2")
)

