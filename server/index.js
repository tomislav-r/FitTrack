import express from 'express';
import createClientsRouter from './routes/clients.js';
import createProgressRouter from './routes/progress.js';
import { connectToDatabase } from './db.js';
import createExerciseRouter from './routes/exercises.js';
import createCaloriesRouter from './routes/calories.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('FitTrack backend radi!');
});

// Spajanje na MongoDB
const db = await connectToDatabase();

// Dodavanje clients routera
app.use('/clients', createClientsRouter(db));
app.use('/progress', createProgressRouter(db));
app.use('/exercises', createExerciseRouter(db));
app.use('/calories', createCaloriesRouter(db));

app.listen(PORT, () => {
  console.log(`FitTrack server radi na http://localhost:${PORT}`);
});