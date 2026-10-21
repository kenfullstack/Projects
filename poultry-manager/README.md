# Poultry Manager

A full-stack web application designed to help poultry farm owners manage poultry batches, monitor egg production, and track farm finances in one place.

## Features

- **Dashboard** — View farm statistics, monthly financial summaries, and egg production reports.
- **Poultry Management** — Create and manage poultry batches, including breed, birthday, batch size, and culling information.
- **Egg Production Tracking** — Record daily egg production and monitor monthly egg production efficiency by poultry batch.
- **Finance Management** — Record income and expenses, track payment status, and review monthly financial summaries.
- **User Authentication** — Log in securely to access the application.
- **Role-Based Access Control** — Owners can access all application features and create worker accounts. Workers can access poultry and production features only.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS Modules
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

### Additional Services
- Cloudinary for image storage
- Vercel for frontend deployment
- Render for backend deployment
- MongoDB Atlas for database hosting

## Project Structure

```text
Poultry-Manager/
├── frontend/       # React application
├── backend/        # Express API and database models
├── README.md
└── .gitignore
```

## Live Demo

- **Frontend:** Add your Vercel deployment URL here.
- **Backend API:** Add your Render deployment URL here.

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database
- A Cloudinary account if using poultry image uploads

### 1. Clone the Repository

```bash
git clone https://github.com/kenfullstack/Poultry-Manager.git
cd Poultry-Manager
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Make sure the environment variable names match those used in your backend code. Add any additional variables your application requires.

Start the backend:

```bash
npm run dev
```

The backend should run at `http://localhost:3000`, assuming port 3000 is available.

### 3. Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal by Vite.

## Environment Variables

Keep your actual `.env` files private. Never commit database credentials, passwords, JWT secrets, or API keys to GitHub.

For deployment, configure the required environment variables in the settings of your hosting services. Render provides the `PORT` environment variable for the deployed backend.

## Future Improvements

- Additional form validation and error handling
- Further improvements to mobile responsiveness
- More detailed production and financial analytics using charts and graphs
- Notifications and daily task reminders
- AI-powered farm management insights and assistance
- Improved pagination

## Author

Developed as a full-stack web development project to practice building a complete application using React, Node.js, Express, MongoDB, and authentication.