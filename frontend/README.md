README.md
# frontend

## Folder Structure
# Frontend Folder Structure

## Root Directory
- **README.md**: Documentation for the project.
- **package.json**: Project dependencies and scripts.
- **node_modules/**: Installed npm packages.
- **.next/**: Next.js build output (generated after running the app).
- **public/**: Static assets like images, icons, etc.
- **src/**: Main source code for the application.

## `src` Directory
- **lib/**: Shared utility functions, React Components or libraries.
- **app/**: Application-specific components, pages, and logic.
  - **layout.tsx**: Layout configuration for the app.
  - **page.tsx**: Main entry point for the app's homepage.
  - **api/**: API routes for server-side logic (if applicable).

## Local Setup
### Requirements
* Install NodeJS 22 (current LTS): https://nodejs.org/en
* React 19 - `npm install react@19 react-dom@19.1.0`
* NextJS 15 - https://nextjs.org/ - `npm install next@15.2.4`


### Skeleton
`npx create-next-app@latest`

### Commands
* Start local server: `npm run dev`. -> `http://localhost:3000`
* Lint project: `npm run lint`
