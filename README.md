# AI Music Separator

A full-stack web application for separating audio tracks into stems using Meta's Demucs model via a Node.js/Express backend and a React frontend.

## Features

- **Stem Separation:** Splits uploaded audio tracks into individual stems using Demucs (`htdemucs` / `htdemucs_6s`)
- **Real-Time Progress:** Live job status and progress updates
- **Audio Preview & Batch Download:** Preview stems in the browser and download individual stems or all stems as a `.zip` archive
- **Responsive UI:** Works across desktop and mobile screen sizes

## Project Structure

```text
music-separator-mern/
├── backend/
│   ├── server.js          # Express API server & Demucs job runner
│   ├── package.json
│   ├── uploads/           # Temporary uploaded audio files
│   └── outputs/           # Generated separated stems
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md