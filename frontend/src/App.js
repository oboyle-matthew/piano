import React, { Component } from 'react';
import './App.css'
import MainView from './components/MainView';
import FileSaver from './components/FileSaver';

class App extends Component {
    
  render() {
    return (
        <div>
            <FileSaver/>
            {/*<MainView/>*/}
        </div>
    );
  }
}

export default App;
