import React, { Component } from 'react';
import './App.css'
import MainView from './components/MainView';
import FileSaver from './components/FileSaver';

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
        this.loadFile = this.loadFile.bind(this);
    }

    loadFile(notes, name) {
        console.log(name);
        this.setState({left: notes.left, right: notes.right, beats: notes.beats, name: name, beatLength: notes.beatLength})
    }
    
  render() {
    const { left, right, beats, beatLength, name } = this.state;
    return (
        <div>
            <FileSaver loadFile={this.loadFile}/>
            <MainView file_name={name} left={left} right={right} beats={beats} beatLength={beatLength} />
        </div>
    );
  }
}

export default App;
