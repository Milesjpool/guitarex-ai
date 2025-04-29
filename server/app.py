from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

# Define musical notes and scale intervals
NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
ALL_SCALE_POSITIONS = ['Root', '2nd', '3rd', '4th', '5th', '6th', '7th']

def generate_exercise():
    root_note = random.choice(NOTES)
    
    # Generate ascending scale positions
    num_positions = random.randint(3, 4)
    start_pos = random.randint(0, len(ALL_SCALE_POSITIONS) - num_positions)
    scale_positions = ALL_SCALE_POSITIONS[start_pos:start_pos + num_positions]
    
    return {
        'root_note': root_note,
        'scale_positions': scale_positions
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def get_exercise():
    return jsonify(generate_exercise())

if __name__ == '__main__':
    app.run(debug=True) 