import React, { Component } from 'react';
import get_notes from "../parser/XMLParser";

class App extends Component {
    constructor(){
        super();
        this.state = {
            selectedFile: null,
        };
    }

    handleSelectedFile = event => {
        this.setState({
            selectedFile: event.target.files[0],
        })
    };

    handleFileRead = (fileReader) => {
        const { selectedFile } = this.state;
        const { updateNotes } = this.props;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(fileReader.target.result,"text/xml");
        const notes = get_notes(xmlDoc);
        updateNotes && updateNotes(notes, selectedFile.name);
    };

    async handleUpload() {
        let { selectedFile } = this.state;
        const fileReader = new FileReader();
        fileReader.onloadend = this.handleFileRead;
        fileReader.readAsText(selectedFile);
    };

    render() {
        return (
            <div style={{marginLeft: '40%'}}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <input style={{width: '30%'}} type="file" name="" id="" onChange={this.handleSelectedFile} />
                    <div style={{width: '10%'}}>
                        <button  onClick={() => this.handleUpload()}>Upload</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
