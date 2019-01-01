import React, { Component } from 'react';
const noteToScore = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11};
const scoreToColor = {0: "red", 1: "black", 2: "pink", 3: "purple", 4: "green", 5: "cyan", 6: "orange",
    7: "blue", 8: "grey", 9: "yellow", 10: "navy", 11: "brown"};
const triangle = (size, color) => {
    return {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: size * 1,
        borderRightWidth: size * 1,
        borderBottomWidth: size * 2,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'transparent',
        borderBottomColor: color
    };
};

const circle = (size, color) => {
    return {
        width: size * 2,
        height: size * 2,
        borderRadius: size * 2,
        backgroundColor: color
    };
};

class Visualizer extends Component {

    constructor() {
        super();
        this.state = {
            img: null
        }
    }

    sumUpTo(arr, index) {
        return arr.filter((note, i) => i < index).map(note => parseInt(note.duration)).reduce((a, b) => a + b, 0);
    }

    getScore(note) {
        let score = note.octave * 12 + noteToScore[note.note];
        return note.alter ? score + parseInt(note.alter) : score;
    }

    getMinScore(notes) {
        //arr.filter(Boolean) removes "false-y" values Eg. NaN in this case
        return Math.min(...notes.map(note => this.getScore(note)).filter(Boolean));
    }

    getMaxScore(notes) {
        return Math.max(...notes.map(note => this.getScore(note)).filter(Boolean));
    }

    convertToVisual(note, top, left, width) {
        const { radius } = this.props;
        const color = scoreToColor[this.getScore(note) % 12];
        if (note.octave === '4') {
            return <div style={{position: 'absolute', width: width, top: top, left: left} }>
                <div style={circle(radius, color)}/>
            </div>
        } else if (note.octave === '5') {
            return <div style={{position: 'absolute', width: width, top: top, left: left }}>
                <div style={triangle(radius, color)}/>
            </div>
        }
        else {
            let text = note.note;
            let x = 0;
            if (note.alter === '1') {
                text += "#"
            } else if (note.alter === '-1') {
                text += 'b'
            } else {
                x = this.props.radius/2
            }
            return <div style={{position: 'absolute', width: width, top: top, left: left+x }}>
                <p style={{fontSize: this.props.radius*2}}>{text}</p>
            </div>
        }
    }

    render() {
        const {beats, beatLength, multiplier, height, widthRatio, incrementMultiplier, leftNotes, rightNotes} = this.props;
        const lineLength = beats * beatLength * multiplier;
        const rightMax = this.getMaxScore(rightNotes);
        const rightMin = this.getMinScore(rightNotes);
        const leftMax = this.getMaxScore(leftNotes);
        const leftMin = this.getMinScore(leftNotes);
        console.log(rightMax);
        console.log(rightMin);
        return (
            <div style={{width: lineLength, overflowX: 'none', marginTop: 100}}>
                <div id="capture" >
                    <div style={{position: 'relative'}}>
                        {rightNotes.map((note, i) => {
                            let top = (height * Math.floor(this.sumUpTo(rightNotes, i) / lineLength));
                            console.log(top);
                            top += (1 - ((this.getScore(note) - rightMin) / (rightMax - rightMin))) * incrementMultiplier;
                            console.log(top);
                            let left = widthRatio * (this.sumUpTo(rightNotes, i) % lineLength);
                            const width = note.duration * widthRatio;
                            // return (
                            //     <svg style={{overflow: 'visible', position: 'absolute',
                            //         width: note.duration * widthRatio, height: this.props.radius*2, top: top, left: left}}>
                            //         {this.convertToVisual(note)}
                            // </svg>)
                            return this.convertToVisual(note, top, left, width);
                        })}
                    </div>
                    <div style={{position: 'relative'}}>
                        {leftNotes.map((note, i) => {
                            let top = this.props.handDiff + (height * Math.floor(this.sumUpTo(leftNotes, i) / lineLength));
                            top += (1 - ((this.getScore(note) - leftMin) / (leftMax - leftMin))) * incrementMultiplier;
                            let left = widthRatio * (this.sumUpTo(leftNotes, i) % lineLength);
                            const width = note.duration * widthRatio;
                            return (this.convertToVisual(note, top, left, width))
                        })}
                    </div>
                    <div style={{position: 'relative'}}>
                        {rightNotes.map((note, i) => {
                            let top = (height * Math.floor(this.sumUpTo(rightNotes, i) / lineLength));
                            top -= this.props.radius;
                            return <hr style={{position: 'absolute', top: top, left: 0, width: lineLength*widthRatio}}/>
                        })}
                    </div>
                </div>
                <div id={"test"}> </div>
            </div>
        );
    }
}

export default Visualizer;
