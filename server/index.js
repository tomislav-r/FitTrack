import express from 'express';
import clientsRouter from './routes/clients.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('FitTrack backend radi!');
});

app.use('/clients', clientsRouter);

app.listen(PORT, () => {
  console.log(`FitTrack server radi na http://localhost:${PORT}`);
});