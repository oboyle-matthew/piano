function get_attribute(note, att) {
    return note.querySelector(att) === null ? null : note.querySelector(att).innerHTML;
}

function is_rest(note) {
    return false;
}

function get_staff(note) {
    return note.querySelector('staff').innerHTML;
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

function get_notes(xml) {
    const notes = xml.querySelectorAll("note");
    let left = [];
    let right = [];
    notes.forEach(note => {
        const note_obj = get_note_object(note);
        if (get_attribute(note, 'staff') === '1') {
            right.push(note_obj);
        } else {
            left.push(note_obj);
        }
    })
    const beats = xml.querySelector("beats").innerHTML;
    return {left: left, right: right, beats: beats};
}


export default function getInfo(file) {
    const reader = new FileReader();

    reader.readAsText(file);
    return new Promise(resolve => {
        reader.onloadend = (evt) => {
            const readerData = evt.target.result;

            const parser = new DOMParser();
            const xml = parser.parseFromString(readerData, 'text/xml');
            const notes = get_notes(xml);
            console.log(notes);

            resolve(notes);
        };
    });


}