# SecureSight CCTV Dashboard

## What does this project do?

SecureSight is a CCTV monitoring dashboard for up to 3 camera feeds. It uses computer vision models to detect and display security incidents (e.g., unauthorized access, gun threats, face recognition, etc.) in a user-friendly dashboard. The dashboard features a video player, incident list, and camera thumbnails, and allows users to resolve incidents. Data is stored in Firebase Firestore, and an Express backend provides REST API endpoints for incident management.

## Cloning the Repository

To get started, clone the repository and install dependencies:

```sh
git clone https://github.com/priyankahotkar/CCTV-software-system.git
cd CCTV-software-system/project
```

## Overview

SecureSight is a fictional CCTV monitoring dashboard. It allows you to connect up to 3 CCTV feeds and uses computer vision models to detect activities such as unauthorized access, gun threats, and more. This project includes a React frontend, Firestore backend, and an Express API layer.

## Features

- **Navbar**
- **Incident Player** (left-side): Large video frame (static image/MP4/GIF stub) and mini strip of camera thumbnails
- **Incident List** (right-side): Thumbnail, colored type icon, camera location, start–end time, resolve button with optimistic UI
- **Seed Script**: Populates Firestore with sample cameras and incidents
- **Express API**: REST endpoints for incidents

## Data Model

- **Camera**: `id`, `name`, `location`
- **Incident**: `id`, `cameraId`, `type`, `tsStart`, `tsEnd`, `thumbnailUrl`, `resolved`

## Setup Instructions

### 1. Install Dependencies

```sh
npm install
npm install express cors
npm install --save-dev @types/express @types/cors
```

### 2. Firebase Setup

- Add your Firebase config to `src/config/firebase.ts`
- Enable Firestore and Authentication (Email/Google) in Firebase Console

### 3. Seed the Database

- To seed Firestore, temporarily call `seedDatabase()` from `src/utils/seedData.ts` in your app entry point and run the app once.

### 4. Run the Express API

```sh
node src/api/server.js
```

Or, if using TypeScript:

```sh
npx ts-node src/api/server.ts
```

### 5. Run the Frontend

```sh
npm run dev
```

## API Endpoints

- `GET /api/incidents?resolved=false` — Get incidents filtered by resolved status
- `PATCH /api/incidents/:id/resolve` — Mark an incident as resolved

## Optional/Extra Credit

- Incident timeline (bottom)
- 3D front-end features

## Folder Structure

```
project/
  src/
    api/
      server.ts
    components/
    config/
    services/
    types/
    utils/
  README.md
```

## License

This project is for technical assessment purposes only.
