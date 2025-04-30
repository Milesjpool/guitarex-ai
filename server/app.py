from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import random
import os
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static', static_url_path='')

# Configure CORS
CORS(app, resources={
    r"/generate": {
        "origins": ["http://localhost:5173"],
        "methods": ["POST"],
        "allow_headers": ["Content-Type"]
    }
})

# Define musical notes and scale intervals
NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
ALL_SCALE_POSITIONS = ['Root', '2nd', '3rd', '4th', '5th', '6th', '7th']

def generate_exercise():
    root_note = random.choice(NOTES)
    
    # Generate scale positions, starting with Root and moving up with random intervals
    num_positions = random.randint(3, 4)
    current_pos = 0  # Start at Root
    scale_positions = [ALL_SCALE_POSITIONS[current_pos]]
    
    # Add random ascending intervals
    for _ in range(num_positions - 1):
        # Choose a random interval to move up (at least 1 step)
        interval = random.randint(1, 3)
        current_pos = min(current_pos + interval, len(ALL_SCALE_POSITIONS) - 1)
        scale_positions.append(ALL_SCALE_POSITIONS[current_pos])
    
    return {
        'root_note': root_note,
        'scale_positions': scale_positions
    }

@app.route('/generate', methods=['POST'])
def get_exercise():
    try:
        exercise = generate_exercise()
        logger.debug(f"Generated exercise: {exercise}")
        return jsonify(exercise)
    except Exception as e:
        logger.error(f"Error generating exercise: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True) 