# COMP 4513 - Assignment #2

## AI Usage

> The landing page styles were created primarily with AI. I personally read and audited all the code myself. Additionally, the README documentation was generated with AI assistance. I have linked the threads below:
>
> - Landing page styles: https://ampcode.com/threads/T-019d745e-00c2-74df-9000-87518a08cb69
> - README documentation: https://ampcode.com/threads/T-019d8531-1d3e-71ed-943c-0c09e8c32c08

## Overview

This is a React single-page application (SPA) built with Vite and TypeScript that provides an interactive music exploration and playlist management interface. The application consumes song, artist, and genre data from the Assignment 1 API and presents it through multiple views with filtering, searching, and playlist persistence features.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/matthew-hre/comp-4513-asg-2.git
   cd comp-4513-asg-2
   ```

2. Install dependencies:

   > A couple notes here:
   >
   > 1. I run NixOS as my main OS, so I use Nix for development environments. If you don't use Nix, you can skip the `nix develop` step.
   > 2. I use `bun` over `npm`, as I find it's faster and it plays nicer on my system.
   > 3. There is an `.envrc` file for `direnv` to automatically load the development environment. If you don't know what that is, you can ignore it.

   ```bash
   nix develop
   bun install
   ```

3. Run the development server:

   ```bash
   bun dev
   ```

4. Build for production:

   ```bash
   bun run build
   ```

## Technology Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Routing:** React Router 7
- **Styling:** Pico CSS + custom SCSS
- **Charting:** Recharts (for song analytics visualization)
- **Backend Integration:** Supabase (playlist persistence)
- **Data Source:** Assignment 1 API

## Features

### Required Views & Functionality

1. **Header/Footer**
   - Persistent navigation across all views
   - Dynamic login state display (playlist name/icon, item count, Logout button)
   - GitHub repository link in footer

2. **Home View**
   - Custom landing page with hero content
   - Featured content and navigation to other sections

3. **Artists/Genres Landing**
   - Browse available artists and genres
   - Click through to dedicated browse view for each selection

4. **Browse View (Songs)**
   - **Filters:** Title (text search), Year, Artist, Genre (all additive)
   - **Controls:** Clear individual filters or reset all; sort by title, year, or artist
   - **List Display:** Song links to single view and "Add to Playlist" functionality

5. **Single Song View**
   - Complete song details (Title, Artist, Year, Genre, BPM, etc.)
   - **Radar Chart Visualizer:** Display song analytics (valence, energy, danceability, etc.)
   - **Related Songs:** List of songs matching the song's top 3 analytic categories

6. **Single Artist/Genre View**
   - Detailed information for selection
   - List of songs within that artist/genre

7. **Playlist Management**
   - View all playlists
   - Create new playlists
   - Delete playlists
   - Add/remove songs from playlists
   - Playlist data persists across sessions

8. **Login View**
   - Authentication system (minimum: simulated login state)
   - Track logged-in user and associated playlist

9. **About Dialog**
   - Assignment information
   - Technologies used
   - Developer names
   - GitHub repository link


