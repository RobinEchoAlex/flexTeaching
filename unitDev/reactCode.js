function responseDownload() {
    console.log("Download response")
    document.querySelectorAll('[id^="input_"]').forEach(function (node){
            console.log(node.id);
        }
    );
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