# GuitarEx

A web application for guitar practice and learning, featuring an interactive guitar neck visualization and exercise tools.

## Project Structure

The project is organized into two main components:

```
guitarex/
├── server/           # Backend Flask server
│   ├── app.py       # Main server application
│   ├── templates/   # Server-side templates
│   └── requirements.txt  # Python dependencies
│
└── web-client/      # Frontend React application
    ├── src/         # React source code
    │   ├── components/  # React components
    │   ├── App.jsx     # Main React component
    │   └── App.css     # Main styles
    ├── public/      # Static assets
    ├── package.json # Node.js dependencies
    └── vite.config.js  # Vite configuration
```

## Setup Instructions

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Create a Python virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the web-client directory:
   ```bash
   cd web-client
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- The backend server runs on Flask and handles API requests
- The frontend is built with React and uses Vite as the build tool
- Components are organized in the `web-client/src/components` directory
- Static assets should be placed in the `web-client/public` directory 