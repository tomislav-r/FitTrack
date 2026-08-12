import express from 'express';
import createClientsRouter from './routes/clients.js';
import createProgressRouter from './routes/progress.js';
import { connectToDatabase } from './db.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('FitTrack backend radi!');
});

// Spajanje na MongoDB
const db = await connectToDatabase();

// Dodavanje clients routera
app.use('/clients', createClientsRouter(db));
app.use('/progress', createProgressRouter(db));

app.listen(PORT, () => {
  console.log(`FitTrack server radi na http://localhost:${PORT}`);
});