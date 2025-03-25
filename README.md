# Product Management Back Office App

This project is a back-office interface built with React, TypeScript, Vite, and Ant Design. It allows users to manage products categorized in a tree structure, including attribute management and user authentication.

---

## 📦 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/mithunsalinda/home24BXPFrontend.git
   cd main
Install dependencies:

bash
Copy
Edit
npm install
Start the mock backend server:

bash
Copy
Edit
npx json-server --watch db.json --port 4000
Start the development server:

bash
Copy
Edit
npm run dev
🛠️ Pre-requisites
Node.js >= 18.x

npm >= 9.x

json-server for mocking backend API

Key Features
 - Login/logout with mock credentials

 - Product category tree navigation

 - Product listing with pagination and sorting

 - Product detail view

 - Add/modify product attributes (number, text, url, tags, boolean)

 - Custom widget for last modified product

 - Protected routes (no page refresh)

 - Build & Development

 
Run dev server: npm run dev

Build for production: npm run build

Preview production build: npm run preview

✅ Code Quality
Fully typed with TypeScript

Folder structure follows separation of concerns (features, shared, hooks)

ESLint + Prettier configured

GitHub Actions (optional) for lint/test pipelines

🖥️ Technologies Used for Front End
React + Vite

TypeScript

Ant Design (UI framework)

Redux Toolkit for state management

React Router DOM for navigation

json-server for API mocking

🧪 Testing & Mocking
Vitest for unit testing

@testing-library/react for component tests

Mocked API requests using MSW (optional enhancement)

Separate test cases for:

Login flow

Category tree

Product list behavior

Attribute form components

📦 Development Dependencies
vite

react

typescript

antd

redux toolkit

react-router-dom

json-server

vitest

@testing-library/react

🧠 Conclusion
This project demonstrates a well-structured product management dashboard using modern React practices. It meets all the required use cases and can be extended with features like real authentication, backend integration, role-based access, and analytics tracking.

✨ Suggestions for improvement:

Replace mock login with JWT-based real backend auth

Add role-based permissions (Admin, Editor)

Support for CSV/Excel import/export

Add drag-and-drop support in category tree

Use WebSockets or polling to update “last modified” product in real-time