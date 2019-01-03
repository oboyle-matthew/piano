function get_attribute(note, att) {
    return note.querySelector(att) === null ? null : note.querySelector(att).innerHTML;
}

function is_chord(note) {
    return note.querySelector('chord') !== null;
}

function get_note_object(note) {
    return {
        note: get_attribute(note, 'step'),
        octave: get_attribute(note, 'octave'),
        alter: get_attribute(note, 'alter'),
        duration: get_attribute(note, 'duration'),
        type: get_attribute(note, 'type')
    }
}

export default function get_notes(xml) {
    const notes = xml.querySelectorAll("note");
    console.log(notes);
    let left = [];
    let right = [];
    let toAddLeft = [];
    let toAddRight = [];
    notes.forEach(note => {
        const note_obj = get_note_object(note);
        if (get_attribute(note, 'staff') === '1') {
            if (!is_chord(note) && toAddRight.length > 0) {
                right.push(toAddRight);
                toAddRight = [];
            }
            toAddRight.push(note_obj);
        } else {
            if (!is_chord(note) && toAddLeft.length > 0) {
                left.push(toAddLeft);
                toAddLeft = [];
            }
            toAddLeft.push(note_obj);
        }
    })
    const beats = xml.querySelector("beats").innerHTML;
    const firstMeasure = xml.querySelector("measure");
    let firstMeasureDuration = 0;
    firstMeasure.querySelectorAll('note').forEach(note => {
        if (note.querySelector('staff').innerHTML === '1') {
            console.log(note.innerHTML);
            firstMeasureDuration += parseInt(note.querySelector('duration').innerHTML);
        }
    })
    console.log(firstMeasureDuration);
    const secondMeasure = xml.querySelectorAll("measure")[1];
    let secondMeasureDuration = 0;
    secondMeasure.querySelectorAll('note').forEach(note => {
        if (note.querySelector('staff').innerHTML === '1') {
            console.log(note.innerHTML);
            secondMeasureDuration += parseInt(note.querySelector('duration').innerHTML);
        }
    });
    const measureDiff = secondMeasureDuration - firstMeasureDuration;
    if (measureDiff > 0) {
        left.unshift([{note: null, octave: null, alter: null, duration: measureDiff, type: null }])
        right.unshift([{note: null, octave: null, alter: null, duration: measureDiff, type: null }])
    }
    return {left: left, right: right, beats: beats, beatLength: secondMeasureDuration / beats};
}

function getInfo(file) {
    const reader = new FileReader();

    reader.readAsText(file);
    return new Promise(resolve => {
        reader.onloadend = (evt) => {
            const readerData = evt.target.result;

            const parser = new DOMParser();
            const xml = parser.parseFromString(readerData, 'text/xml');
            const notes = get_notes(xml);

            resolve(notes);
        };
    });


}