import express from 'express';

const router = express.Router();

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

// GET /clients
router.get('/', (req, res) => {
  res.status(200).json(clients);
});

// GET /clients/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  const client = clients.find(client => client.id === id);

  if (!client) {
    return res.status(404).json({
      message: 'Klijent nije pronađen.'
    });
  }

  res.status(200).json(client);
});

// POST /clients
router.post('/', (req, res) => {
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

// PATCH /clients/:id
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);

  const client = clients.find(client => client.id === id);

  if (!client) {
    return res.status(404).json({
      message: 'Klijent nije pronađen.'
    });
  }

  const {
    firstName,
    lastName,
    email,
    height,
    targetWeight,
    goal
  } = req.body;

  if (firstName !== undefined) {
    client.firstName = firstName;
  }

  if (lastName !== undefined) {
    client.lastName = lastName;
  }

  if (email !== undefined) {
    client.email = email;
  }

  if (height !== undefined) {
    client.height = height;
  }

  if (targetWeight !== undefined) {
    client.targetWeight = targetWeight;
  }

  if (goal !== undefined) {
    client.goal = goal;
  }

  res.status(200).json(client);
});

// DELETE /clients/:id
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);

  const clientIndex = clients.findIndex(client => client.id === id);

  if (clientIndex === -1) {
    return res.status(404).json({
      message: 'Klijent nije pronađen.'
    });
  }

  const deletedClient = clients.splice(clientIndex, 1);

  res.status(200).json({
    message: 'Klijent je uspješno obrisan.',
    client: deletedClient[0]
  });
});

export default router;