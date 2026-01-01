import express from 'express';
import cors from 'cors';
import sightingRoutes from './routes/sighting.routes';
import userRoutes from './routes/user.routes';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Allow Vite frontend
  credentials: true
}) as any);
app.use(express.json());

// Routes
app.use('/sightings', sightingRoutes);
app.use('/users', userRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Observation System API is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;