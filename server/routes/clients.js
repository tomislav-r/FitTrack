import express from 'express';
import { ObjectId } from 'mongodb';
import { body, validationResult } from 'express-validator';

export default function createClientsRouter(db) {
  const router = express.Router();

  const clientsCollection = db.collection('clients');
  const progressCollection = db.collection('progress');
  const exercisesCollection = db.collection('exercises');
  const caloriesCollection = db.collection('calories');

  // dohvaćanje svih klijenata
  router.get('/', async (req, res) => {
    try {
      const clients = await clientsCollection.find().toArray();

      res.status(200).json(clients);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: 'Greška prilikom dohvaćanja klijenata.'
      });
    }
  });

  // dohvaćanje jednog klijenta
  router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Neispravan ID klijenta.'
      });
    }

    try {
      const client = await clientsCollection.findOne({
        _id: new ObjectId(id)
      });

      if (!client) {
        return res.status(404).json({
          message: 'Klijent nije pronađen.'
        });
      }

      res.status(200).json(client);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: 'Greška prilikom dohvaćanja klijenta.'
      });
    }
  });

  // dodavanje novog klijenta
  router.post(
  '/',
  [
    body('firstName')
      .notEmpty()
      .withMessage('Ime je obavezno.'),

    body('lastName')
      .notEmpty()
      .withMessage('Prezime je obavezno.'),

    body('email')
      .notEmpty()
      .withMessage('Email je obavezan.')
      .isEmail()
      .withMessage('Email nije ispravnog formata.'),

    body('height')
      .optional()
      .isNumeric()
      .withMessage('Visina mora biti broj.'),

    body('targetWeight')
      .optional()
      .isNumeric()
      .withMessage('Ciljana težina mora biti broj.')
  ],
  async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
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

    const newClient = {
      firstName,
      lastName,
      email,
      height,
      targetWeight,
      goal,
      createdAt: new Date()
    };

    try {
      const result = await clientsCollection.insertOne(newClient);

      res.status(201).json({
        _id: result.insertedId,
        ...newClient
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: 'Greška prilikom dodavanja klijenta.'
      });
    }
  });

  router.patch('/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Neispravan ID klijenta.'
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

    const updatedData = {};

    if (firstName !== undefined) updatedData.firstName = firstName;
    if (lastName !== undefined) updatedData.lastName = lastName;
    if (email !== undefined) updatedData.email = email;
    if (height !== undefined) updatedData.height = height;
    if (targetWeight !== undefined) updatedData.targetWeight = targetWeight;
    if (goal !== undefined) updatedData.goal = goal;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        message: 'Nema podataka za ažuriranje.'
      });
    }

    try {
      const result = await clientsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      if (!result.matchedCount) {
        return res.status(404).json({
          message: 'Klijent nije pronađen.'
        });
      }

      res.status(200).json({
        message: 'Klijent uspješno ažuriran.'
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: 'Greška prilikom ažuriranja klijenta.'
      });
    }
  });


  // Brisanje klijenta

  router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Neispravan ID klijenta.'
      });
    }

    try {
      const clientObjectId = new ObjectId(id);

      const result = await clientsCollection.deleteOne({
        _id: clientObjectId
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: 'Klijent nije pronađen.'
        });
      }

      await progressCollection.deleteMany({
        clientId: clientObjectId
      });

      await exercisesCollection.deleteMany({
        clientId: clientObjectId
      });

      await caloriesCollection.deleteMany({
        clientId: clientObjectId
      });

      res.status(200).json({
        message: 'Klijent i svi njegovi podaci su uspješno obrisani.'
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: 'Greška prilikom brisanja klijenta.'
      });
    }
  });

  return router;
}