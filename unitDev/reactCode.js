function responseDownload() {

    console.log("Download response")

    var blobParts = [];

    document.querySelectorAll('[id^="input_"]').forEach(function (node){
            console.log(node.id);
            console.log(node.value);
            var s = "<div id=" + node.id + ">" + node.value + "</div>"
            blobParts.push(s)
        }
    );

    var blob = new Blob(blobParts);
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