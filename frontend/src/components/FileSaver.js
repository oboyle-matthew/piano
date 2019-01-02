import React, { Component } from 'react';
import firebase from 'firebase';
import get_notes from '../parser/XMLParser';
import axios from 'axios';

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

    async getTest() {
        const { selectedFile, file_name } = this.state;
        var storageRef = firebase.storage().ref();
        const ref = storageRef.child('test.xml');
        storageRef.child(this.state.title).getDownloadURL().then(function(url) {
            axios.get(url).then(res => {
                console.log(res.data);
                const parser = new DOMParser();
                const xml = parser.parseFromString(res.data, 'text/xml');
                const notes = get_notes(xml);
                console.log(notes);

            })
            console.log(url);
        }).catch(function(error) {
            console.log(error);
            // Handle any errors
        });
    }

    async handleUpload() {
        const { selectedFile, file_name } = this.state;
        var storageRef = firebase.storage().ref();
        var ref = storageRef.child(file_name);
        ref.put(selectedFile).then(function(snapshot) {
            console.log('Uploaded a blob or file!');
            console.log(snapshot);
        });


    };

    render() {
        return (
            <div>
                <div style={{display: 'flex', flexDirection: 'row'}} >
                    <input type="file" name="" id="" onChange={this.handleSelectedFile} />
                    <input type="text" value={this.state.title} onChange={e => this.setState({title: e.target.value})}/>
                    <button onClick={() => this.handleUpload()}>Upload</button>
                    <button onClick={() => this.getTest()}>Test</button>
                </div>
                <div id="linkbox">

                </div>

            </div>
        );
    }
}

export default App;
