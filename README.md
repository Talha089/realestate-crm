# CRM System - MERN Stack Developer Assessment Task

## Overview

This project is a simple CRM (Customer Relationship Management) system built using the MERN stack. The application allows users to manage leads by performing CRUD operations and updating their statuses. Additionally, Redux Saga has been used for state management on the frontend. The backend provides a RESTful API to handle all data-related operations.

---

## Features

### Backend
- **Endpoints**:
  - `POST /leads`: Create a new lead.
  - `GET /leads`: Retrieve all leads.
  - `GET /leads/:id`: Retrieve a specific lead by ID.
  - `PUT /leads/:id`: Update a lead by ID.
  - `DELETE /leads/:id`: Delete a lead by ID.

- **Database Schema**:
  - `name` (String, required): Full name of the lead.
  - `email` (String, required): Email address of the lead.
  - `phone` (String, optional): Contact number of the lead.
  - `status` (String, required): One of the following values:
    - "New"
    - "Contacted"
    - "Qualified"
    - "Lost"
    - "Closed"
  - `createdAt` (Date, auto-generated): The creation date of the lead.
  - `updatedAt` (Date, auto-generated): The last update date of the lead.

- **Technologies**:
  - Express.js for backend framework.
  - MongoDB for database.
  - Mongoose for schema definition and database operations.
  - Proper error handling for validation and missing resources.

### Frontend
- **Leads List Page**:
  - Displays all leads with details such as name, email, phone, status, and creation date.
  - Includes buttons for editing or deleting leads.
  - Allows filtering or sorting leads.

- **Add Lead Page**:
  - Form to create a new lead with fields for name, email, phone, and status.

- **Edit Lead Page**:
  - Form to update an existing lead.

- **Other Features**:
  - Proper loading and error states for API requests.
  - Redux Saga for state management.

---

## Installation

### Prerequisites
- Node.js and npm installed on your system.
- MongoDB installed and running locally or accessible via a connection string.

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/crm
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The server will run at `http://localhost:4000`.

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm start
   ```
   The application will run at `http://localhost:3000`.

---

## Usage

1. Start the backend server and frontend application.
2. Open `http://localhost:3000` in your browser.
3. Use the dashboard to:
   - Add a new lead.
   - Edit or delete existing leads.
   - Filter leads by status.
4. The backend API can be tested separately using tools like Postman.


## Project Structure

### Backend
- **Folder Structure**:
  ```
  backend/
  ├── controllers/
  ├── models/
  ├── routes/
  ├── app.js
  └── server.js
  ```

- **Technologies**:
  - Express.js
  - Mongoose
  - dotenv for environment variables
  - nodemon for development

### Frontend
- **Folder Structure**:
  ```
  frontend/
  ├── src/
      ├── components/
      ├── redux/
          ├── actions/
          ├── reducers/
          ├── sagas/
      ├── pages/
      └── App.js
  ```

- **Technologies**:
  - React
  - Redux + Redux Saga
  - Axios for API requests
  - Material-UI for UI components

---

## Acknowledgments
This project is built as part of a MERN Stack Developer Assessment. It demonstrates the core functionalities of a CRM system and showcases expertise in full-stack development with the MERN stack.