function responseDownload() {

    console.log("Download response")
    var id = {id};
    console.log(id);

    var doc = document.implementation.createHTMLDocument("New Document");

    var blobParts = [];
    blobParts.push(id);

    var idDiv = doc.createElement('div')
    idDiv.id = "id"
    idDiv.textContent = id
    doc.body.appendChild(idDiv)

    document.querySelectorAll('[id^="input_"]').forEach(function (node){
            console.log(node.id);
            console.log(node.value);
            var s = "<div id=\"" + node.id + "\">" + node.value + "</div>"
            blobParts.push(s)

            var div = doc.createElement('div')
            div.id=node.id
            div.textContent= node.id + ":" + node.value
            doc.body.appendChild(div);
        }
    );

    console.log(doc.body.innerHTML)
    var blob = new Blob([doc.body.innerHTML]);
    var aDownload = document.createElement('a');
    var url = window.URL.createObjectURL(blob);
    var filename = 'response.html';
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

