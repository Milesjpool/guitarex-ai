# GuitarEx<sup>AI</sup> 🎸

[![Deploy to GitHub Pages](https://github.com/Milesjpool/guitarex-ai/actions/workflows/deploy.yml/badge.svg)](https://github.com/Milesjpool/guitarex-ai/actions/workflows/deploy.yml)

A web application for guitar practice and learning, featuring an interactive guitar neck visualization and exercise tools.

## Development Process

This application was developed through a unique collaboration between human and AI:
- The AI handled the majority of the technical implementation, including:
  - Converting the original Flask backend to a pure frontend application
  - Implementing the TypeScript components and styling
  - Setting up the project structure and configuration
  - Generating this documentation and project setup instructions
- The human provided:
  - High-level direction and requirements
  - Minor refinements and adjustments
  - Testing and feedback

## Project Evolution

The project has evolved through several iterations:
1. Started as a CLI (Command Line Interface) tool for guitar practice
2. Evolved into a client/server architecture using Flask and React
3. Finally transformed into a pure web application for better accessibility and ease of use

## Project Structure

The project is organized as a pure web application built with React and TypeScript:

```
guitarex/
├── src/         # React source code
│   ├── components/  # React components
│   ├── App.tsx     # Main React component
│   └── App.css     # Main styles
├── public/      # Static assets
├── package.json # Node.js dependencies
└── vite.config.ts  # Vite configuration
```

## Setup Instructions

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- The application is built with React and TypeScript
- Vite is used as the build tool
- Components are organized in the `src/components` directory
- Static assets should be placed in the `public` directory 