# Employee Management App

This project was implemented as a case study for a job interview (ING Hubs).  
The goal was to build a simple employee management web application using **LitElement (JavaScript version)**.

## Features

- List all employees (with option to switch between table view and list view)
- pagination for all view types
- Add new employee
- Edit employee record
- Delete employee record
- Validation for edit and create form
- Navigation menu with routing
- Responsive design (without bootstrap or similar libs)
- Localization support (English / Turkish)
- Data persisted in browser memory (custom state management)
- Achieved 74% average test coverage ratio

## Tech Stack

- LitElement
- Router: Vaadin Router
- State management: custom store (I didn’t use Redux, made my own simple one)
- Unit Test: Vitest

## Installation


npm install -> install dependecies
npm run dev -> run dev
npm test -> testing
npm run test:coverage -> display coverage ratio
