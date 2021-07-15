/*
 * Simple editor component that takes placeholder text as a prop
 */

class Editor extends React.Component {
    constructor (props) {
        super(props)
        this.state = { editorHtml: '', theme: 'snow' }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (html) {
        this.setState({ editorHtml: html });
    }

    handleThemeChange (newTheme) {
        if (newTheme === "core") newTheme = null;
        this.setState({ theme: newTheme })
    }

    render () {
        let boundString = "."+ this.props.container;

        return (
            <div>
                <ReactQuill
                    theme={this.state.theme}
                    onChange={this.handleChange}
                    value={this.state.editorHtml}
                    modules={Editor.modules}
                    //formats={Editor.formats}
                    //bounds={boundString}
                    placeholder={this.props.placeholder}
                />
            </div>
        )
    }
}

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['image', 'formula','code-block']
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    }
}
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
]

/*
 * PropType validation
 */
Editor.propTypes = {
    placeholder: PropTypes.string,
    container: PropTypes.string
}

$(document).on('shiny:value', function(event) {

});


function addQuill(){
    console.log("addQuill() is triggered");

    document.querySelectorAll(".rtfInput").forEach(function(e){
        ReactDOM.render(
            <Editor placeholder={"Write something"} container={e.id}/>,
            e
        )
    });
}

const targetNode = document.getElementById('assignmentBox');
const config = { attributes: true, childList: true, subtree: true };
const callback = function(mutationsList, observer) {
    addQuill();
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

