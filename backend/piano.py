from xml.dom.minidom import parse, parseString
from flask import Flask, jsonify, request
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

def get_step(note):
    stepNode = note.getElementsByTagName("step")[0]
    #get the text from the Text Node within the <step>,
    #and convert it from unicode to ascii
    return str(stepNode.childNodes[0].nodeValue)

def get_alter(note):
    alters = note.getElementsByTagName("alter")
    if len(alters) == 0:
        return None
    return str(alters[0].childNodes[0].nodeValue)

def get_octave(note):
    octaveNode = note.getElementsByTagName("octave")[0]
    return str(octaveNode.childNodes[0].nodeValue)

def get_duration(note):
    durationNode = note.getElementsByTagName("duration")[0]
    return str(durationNode.childNodes[0].nodeValue)

def get_type(note):
    typeNode = note.getElementsByTagName("type")[0]
    return str(typeNode.childNodes[0].nodeValue)

def is_rest(note):
    return len(note.getElementsByTagName("rest")) > 0

def is_accidental(note):
    return get_alter(note) != None

def get_staff(note):
    staffNode = note.getElementsByTagName("staff")[0]
    return str(staffNode.childNodes[0].nodeValue)

def get_note_object(notes):
    res = []
    for note in notes:
        res.append({"note": get_step(note), "octave": get_octave(note),
        "alter": get_alter(note), "duration": get_duration(note),
        "type": get_type(note)})
    return res

def get_info(dom):
    parts = dom.getElementsByTagName("part")

    notes = dom.getElementsByTagName("note")
    beats = dom.getElementsByTagName("beats")[0].childNodes[0].nodeValue
    beatType = dom.getElementsByTagName("beat-type")[0].childNodes[0].nodeValue

    #rests don't have steps or alters, so we don't care about them. Filter them out.
    notes = filter(lambda note: not is_rest(note), notes)
    right_notes = filter(lambda note: get_staff(note) == '1', notes)
    left_notes = filter(lambda note: get_staff(note) == '2', notes)
    left = get_note_object(left_notes)
    right = get_note_object(right_notes)
    return {'left': left, 'right': right, 'beats': beats, 'beatType': beatType}


@app.route('/post', methods = ['GET', 'POST'])
def post():
    res = []
    upload_file = request.files.getlist("file")[0]
    dom = parse(upload_file)
    return jsonify(get_info(dom))


if __name__ == '__main__':
    app.run()
