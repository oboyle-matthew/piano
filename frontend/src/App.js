import React, { Component } from 'react';
import './App.css'
import MainView from './components/MainView';
import FileSaver from './components/FileSaver';
import FileLoader from './new_components/FileLoader';

//Here's a comment from test branch
class App extends Component {
    constructor() {
        super();
        this.state = {
            left: [],
            right: [],
            beats: 4,
            name: '',
            beatLength: 64,
        };
        this.setNotes = this.setNotes.bind(this);
    }

    normalizeNotes(notes) {

    }

    setNotes(notes, name) {
        console.log(notes.left);
        console.log(notes.beats);
        console.log(notes.beatLength);
        this.setState({left: notes.left, right: notes.right, beats: notes.beats, name: name, beatLength: notes.beatLength})
    }
    
  render() {
    const { left, right, beats, beatLength, name } = this.state;
    return (
        <div>
            <FileLoader updateNotes={this.setNotes} />
            {/*<FileSaver loadFile={this.loadFile}/>*/}
            <MainView file_name={name} left={left} right={right} beats={beats} beatLength={beatLength} />
        </div>
    );
  }
}

export default App;
