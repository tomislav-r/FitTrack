import express from 'express';
import { ObjectId } from 'mongodb';

export default function createClientsRouter(db) {
  const router = express.Router();

  const clientsCollection = db.collection('clients');

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
  router.post('/', async (req, res) => {
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
      const result = await clientsCollection.deleteOne({
        _id: new ObjectId(id)
      });

      if (!result.deletedCount === 0) {
        return res.status(404).json({
          message: 'Klijent nije pronađen.'
        });
      }

      res.status(200).json({
        message: 'Klijent uspješno obrisan.'
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