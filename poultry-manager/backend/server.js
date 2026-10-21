import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './connectDB.js';
import poultryRoutes from './routes/poultryRoutes.js'
import financeRoutes from './routes/financeRoutes.js'
import productionRoutes from './routes/productionRoutes.js'
import authRoutes from './routes/authRoutes.js'
import workerRoutes from './routes/workerRoutes.js'
import errorHandler from './middlewares/errorHandler.js'

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
await connectDB();

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
app.get("/", (req, res) => {
  res.json({
    message: "Poultry Manager API is running"
  });
});

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
app.use('/api/workers', workerRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/poultry', poultryRoutes)
app.use('/api/finance', financeRoutes)
app.use('/api/production', productionRoutes)
app.use(errorHandler)

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});