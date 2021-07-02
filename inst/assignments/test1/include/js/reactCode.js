function responseDownload() {

    console.log("Download response")
    var id = {id};
    console.log(id);

    var doc = document.implementation.createHTMLDocument("Assignment Response");
    var idDiv = doc.createElement('div')
    idDiv.id = "id"
    idDiv.textContent = id
    doc.body.appendChild(idDiv)

    document.querySelectorAll('[id^="input_"]').forEach(function (node){
            console.log(node.id);
            console.log(node.value);

            var div = doc.createElement('div')
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
    var blob = new Blob([doc.body.innerHTML]);
    var url = window.URL.createObjectURL(blob);
    var filename = 'response.html';

    var aDownload = document.createElement('a');
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

