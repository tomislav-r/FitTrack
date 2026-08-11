import express from 'express';

const app = express();
app.use(express.json());
const PORT = 3000;

// Privremeni podaci o klijentima
const clients = [
  {
    id: 1,
    firstName: 'Ivan',
    lastName: 'Ivić',
    email: 'ivan@email.com',
    height: 182,
    targetWeight: 80,
    goal: 'Gubitak tjelesne mase'
  },
  {
    id: 2,
    firstName: 'Ana',
    lastName: 'Anić',
    email: 'ana@email.com',
    height: 168,
    targetWeight: 60,
    goal: 'Povećanje mišićne mase'
  },
  {
    id: 3,
    firstName: 'Marko',
    lastName: 'Marić',
    email: 'marko@email.com',
    height: 190,
    targetWeight: 90,
    goal: 'Održavanje tjelesne mase'
  }
];

app.get('/', (req, res) => {
  res.send('FitTrack backend radi!');
});

// GET /clients - dohvaćanje svih klijenata
app.get('/clients', (req, res) => {
  res.json(clients);
});

app.listen(PORT, () => {
  console.log(`FitTrack server radi na http://localhost:${PORT}`);
});

app.get('/clients/:id', (req, res) => {
    const id = Number(req.params.id);
    const client = clients.find(client => client.id === id);

    if(!client) {
        return res.status(404).json({ error: 'Klijent nije pronađen' });
    }

    res.status(200).json(client);
});

// POST /clients - dodavanje novog klijenta
app.post('/clients', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    height,
    targetWeight,
    goal
  } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({
      message: 'Ime, prezime i email su obavezni.'
    });
  }

  const newClient = {
    id: clients.length + 1,
    firstName,
    lastName,
    email,
    height,
    targetWeight,
    goal
  };

  clients.push(newClient);

  res.status(201).json(newClient);
});
