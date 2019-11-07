import React, { Component } from 'react';
import Visualizer from './Visualizer';
import BurgerMenu from 'react-burger-menu';
import { List, ListItem } from 'react-mdl';
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";
import getInfo from '../parser/XMLParser';

class App extends Component {
    constructor(){
        super();
        this.state = {
            beats: 4,
            beatLength: 64,
            radius: 20,
            height: 320,
            widthRatio: 2,
            barsPerLine: 2,
            incrementMultiplier: 100,
            handDiff: 250,
            selectedFile: null,
            left: [],
            right: [],
            hidden: true,
            file_name: '',
            linesInPdf: 3,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.resetScreen();
        }
    }

    resetScreen() {
        const { beats, beatLength } = this.props;
        const bars = window.innerWidth < 800 ? 1 : 2;
        const width = window.innerWidth / (beats * beatLength * bars);
        const radius = window.innerWidth / (beats * bars * 8);
        const height = window.innerHeight / 2;
        this.setState({
            widthRatio: width,
            barsPerLine: bars,
            radius: radius,
            height: height,
            incrementMultiplier: 100,
            handDiff: height * 0.35,
            linesInPdf: 3,
            beatLength: beatLength,
        });
    }

    createSlider(label, value, min, max, step) {
        return (
            <ListItem>
                <label>{label}
                    <input type="range" min={min} max={max} step={step} value={this.state[value]}
                           onChange={e => this.setState({[value]: e.target.value})} />

                </label>
            </ListItem>
        )
    }

    takeScreenshot() {
        const node = document.getElementById('capture');
        const self = this;
        domtoimage.toPng(node)
            .then(src => {
                var img = new Image();
                img.src = src;
                img.onload = function() {
                    const width = img.width;
                    const height = self.state.height * self.state.linesInPdf;
                    const pdf = new jsPDF("l", "mm", "a4");
                    for (var i = 0; i < img.height / height; i++) {
                        var canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        var context = canvas.getContext('2d');
                        context.drawImage(img, 0, height*i, width, height, 0, 0, width, height);
                        let splitImage = new Image();
                        splitImage.src = canvas.toDataURL();
                        pdf.addImage(splitImage, 'png', 10, 10, 280, 202);  // 180x150 mm @ (10,10)mm
                        if (i+1 < img.height/height) {
                            pdf.addPage();
                        }
                    }
                    console.log(self.props.file_name);
                    pdf.save(self.props.file_name + '.pdf');
                }

            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });

    }

    render() {
        const Menu = BurgerMenu['slide'];
        const styles = {
            bmBurgerButton: {
                position: 'absolute',
                width: '36px',
                height: '30px',
                left: '24px',
                top: '24px'
            },
            bmBurgerBars: {
                background: '#373a47'
            },
            bmCrossButton: {
                height: '24px',
                width: '24px'
            },
            bmCross: {
                background: '#bdc3c7'
            },
            bmMenu: {
                background: '#373a47',
                padding: '2.5em 1.5em 0',
                fontSize: '1.15em'
            },
            bmMorphShape: {
                fill: '#373a47'
            },
            bmItemList: {
                color: '#b8b7ad',
                padding: '0.8em'
            },
            bmOverlay: {
                background: 'rgba(0, 0, 0, 0.3)'
            }
        };
        const { left, right, beats } = this.props;
        const {radius, height, widthRatio, barsPerLine, incrementMultiplier, handDiff, file_name, beatLength} = this.state;
        console.log(widthRatio);
        const sliders = <div>
            <h1 style={{ width: '150%', marginLeft: '-30%', textAlign: 'center'}}>Customize notes:</h1>
            {this.createSlider("Size of Notes", 'radius', 5, 50, 1)}
            {this.createSlider("Gap between hands", 'handDiff', 20, 300, 1)}
            {this.createSlider("Line Height", 'height', 100, 1000, 1)}
            {this.createSlider("Line Width", 'widthRatio', 50, 400, 1)}
            {this.createSlider("Bars per line", 'barsPerLine', 1, 5, 1)}
            {this.createSlider("Pitch Difference", 'incrementMultiplier', 0, 300, 1)}
            <button style={{marginLeft: '15%', marginTop: '10%', marginBottom: '25%'}} onClick={() => this.resetScreen()}>Reset sizes</button>
            <h1 style={{ width: '150%', marginLeft: '-30%', textAlign: 'center'}}>Download:</h1>
            {this.createSlider("Lines per page in pdf", 'linesInPdf', 1, 7, 1)}
            <button style={{marginLeft: '12%', marginTop: '10%'}} onClick={() => this.takeScreenshot()}>Download music</button>

        </div>;
        return (
                <div id="outer-container" style={{height: '90%', position: 'absolute', top: 0, left: 0, zIndex: -2}}>
                    <Menu
                        styles={styles}
                        noOverlay id={'slide'}
                        pageWrapId={'page-wrap'}
                        outerContainerId={'outer-container'}
                    >
                        <List>
                            {sliders}
                        </List>
                    </Menu>
                    <div id="page-wrap" >
                        <Visualizer style={{zIndex: -1}} beats={beats} beatLength={beatLength}
                                    multiplier={barsPerLine} incrementMultiplier={incrementMultiplier}
                                    handDiff={parseInt(handDiff)} radius={radius}
                                    height={parseInt(height)} widthRatio={widthRatio}
                                    rightNotes={right} leftNotes={left} file_name={file_name}
                        />
                    </div>



                </div>

        );
    }
}

export default App;
