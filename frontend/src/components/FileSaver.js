import React, { Component } from 'react';
import firebase from 'firebase';
import get_notes from '../parser/XMLParser';
import axios from 'axios';
import JSZip from 'node-zip';

var config = {
    apiKey: "AIzaSyCdwRJgEWCP60ZcRflV-VE_LMHarUC_ifs",
    authDomain: "piano-ea315.firebaseapp.com",
    databaseURL: "https://piano-ea315.firebaseio.com",
    projectId: "piano-ea315",
    storageBucket: "piano-ea315.appspot.com",
    messagingSenderId: "167789733462"
};
firebase.initializeApp(config);

class App extends Component {
    constructor(){
        super();
        this.state = {
            selectedFile: null,
            file_name: '',
            title: '',
        };
    }

    handleSelectedFile = event => {
        this.setState({
            selectedFile: event.target.files[0],
            file_name: event.target.files[0].name,
        })
    };

    async viewFile(title) {
        const self = this;
        const storageRef = firebase.storage().ref();
        storageRef.child(title).getDownloadURL().then(function(url) {
            axios.get(url).then(res => {
                const parser = new DOMParser();
                console.log(res.data);
                const xml = parser.parseFromString(res.data, 'text/xml');
                const notes = get_notes(xml);
                console.log(notes);
                self.props.loadFile(notes, title.split(".xml")[0]);
            });
            console.log(url);
        }).catch(function(error) {
            console.log(error);
            // Handle any errors
        });
    }

    async handleUpload() {
        let { selectedFile, file_name } = this.state;
        var storageRef = firebase.storage().ref();
        var ref = storageRef.child(file_name);
        ref.put(selectedFile).then(() => {
            this.setState({title: file_name});
            this.viewFile(file_name);
        });


    };

    render() {
        return (
            <div>
                <div style={{marginLeft: "20%", display: 'flex', flexDirection: 'row'}}>
                    <input style={{width: '20%'}} type="file" name="" id="" onChange={this.handleSelectedFile} />
                    <div style={{width: '20%'}}>
                        <button  onClick={() => this.handleUpload()}>Upload</button>
                    </div>
                    <div style={{width: '20%'}}>
                        <input style={{marginLeft: '5%', width: '85%'}} type="text" value={this.state.title} onChange={e => this.setState({title: e.target.value})}/>
                    </div>

                    <div style={{width: '20%'}}>
                        <button onClick={() => this.viewFile(this.state.title)}>View</button>
                    </div>
                </div>
                <div id="linkbox">

                </div>

            </div>
        );
    }
}

export default App;
