# Sweet Shop Management System – Backend

This is a backend REST API for managing a sweet shop inventory.  
It supports inventory management, purchase flow, authentication, authorization, and automated testing.

The project is built with clean architecture principles, proper error handling, role-based access control, and tests.

---

## Features

- View sweets inventory
- Add new sweets (Admin only)
- Purchase sweets
- Restock sweets (Admin only)
- Delete sweets (Admin only)
- JWT-based authentication
- Role-based authorization (Admin / User)
- Automated API tests

---

## Tech Stack

- Node.js
- Express.js
- JWT (jsonwebtoken) – authentication
- bcryptjs – password hashing
- dotenv – environment variables
- Jest & Supertest – automated testing

---

## Project Structure

backend/
├── src/
│ ├── auth/
│ │ ├── auth.routes.js
│ │ └── auth.service.js
│ ├── middleware/
│ │ └── auth.middleware.js
│ ├── routes/
│ │ └── sweets.routes.js
│ ├── services/
│ │ └── sweets.service.js
│ ├── tests/
│ │ └── sweets.test.js
│ └── server.js
├── .env
├── package.json
└── README.md

---

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

---

### Installation
cd backend
npm install


---

## Environment Variables

Create a `.env` file inside the `backend` folder:

JWT_SECRET=your_secret_key
PORT=3000


The `.env` file is ignored by Git and should not be committed.

---

## Run the Server

npm run dev

Server runs on:
http://localhost:3000


---

## Run Tests  
npm test 
All inventory, authentication, and authorization tests should pass.

---

## Authentication

### Register User  
POST /auth/register 


### Example request body:
{
"username": "admin",
"password": "admin123",
"role": "admin"
}


---

### Login User

POST /auth/login

Response: 
{
"token": "<JWT_TOKEN>"
} 


---

### Using the Token

For protected routes, include the token in request headers:

Authorization: Bearer <JWT_TOKEN>

---

## API Endpoints

### Public Endpoints

- GET /api/sweets
- POST /api/sweets/:id/purchase

---

### Admin-Only Endpoints

- POST /api/sweets
- POST /api/sweets/:id/restock
- DELETE /api/sweets/:id

Admin access is enforced using JWT authentication and role-based middleware.

---

## Testing

- Automated tests are written using Jest and Supertest
- Tests cover:
  - Inventory operations
  - Error cases
  - Auth-protected routes
- Environment variables are loaded during tests using dotenv

---

## Notes

- Data is stored in-memory for simplicity
- Restarting the server resets all data
- The focus of this project is backend logic, security, and testability

---

## AI Usage Disclosure

AI tools (ChatGPT) were used for guidance, explanations, and refactoring suggestions.  
All implementation decisions, understanding, and final code integration were done by the author.

---

## Author

Prakhar Bhagat



