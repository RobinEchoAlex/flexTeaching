function a() {
    console.log("clicked")
}

ReactDOM.render(<button onClick={a}>Powered By React/JSX</button>, document.getElementById("app2"))