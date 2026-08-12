import express from "express";
import { ObjectId } from "mongodb";

export default function createProgressRouter(db) {
    const router = express.Router();

    const progressCollection = db.collection("progress");
    const clientsCollection = db.collection("clients");

//Dohvaćanje svih zapisa o napretku za određenog klijenta

  router.get('/:clientId', async (req, res) => {
    const clientId = req.params.clientId;

    if (!ObjectId.isValid(clientId)) {
        return res.status(400).json({
            message: 'Neispravan ID klijenta.'
        });
    }

    try {
        const client = await clientsCollection.findOne({
            _id: new ObjectId(clientId)
        });

        if (!client) {
            return res.status(404).json({
                message: 'Klijent nije pronađen.'
            });
        }

        const progressRecords = await progressCollection.find({
            clientId: new ObjectId(clientId)
        }).sort({ date: -1 }).toArray();

        res.status(200).json(progressRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Greška prilikom dohvaćanja zapisa o napretku.'
        });
    }
});

//Dodavanje novog zapisa o napretku

  router.post('/:clientId', async (req, res) => {
    const clientId = req.params.clientId;

    if (!ObjectId.isValid(clientId)) {
      return res.status(400).json({
        message: 'Neispravan ID klijenta.'
      });
    }

    const {
      date,
      weight,
      waist,
      bodyFat,
      notes
    } = req.body;

    if (!date || weight === undefined) {
      return res.status(400).json({
        message: 'Datum i tjelesna masa su obavezni.'
      });
    }

    try {
      const client = await clientsCollection.findOne({
        _id: new ObjectId(clientId)
      });

      if (!client) {
        return res.status(404).json({
          message: 'Klijent nije pronađen.'
        });
      }

      const newProgress = {
        clientId: new ObjectId(clientId),
        date: new Date(date),
        weight,
        waist,
        bodyFat,
        notes,
        createdAt: new Date()
      };

      const result = await progressCollection.insertOne(newProgress);

      res.status(201).json({
        _id: result.insertedId,
        ...newProgress
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: 'Greška prilikom dodavanja napretka.'
      });
    }
  });

  // Brisanje zapisa o napretku

  router.delete('/:id', async (req, res) => {
    const progressId = req.params.id;

    if (!ObjectId.isValid(progressId)) {
      return res.status(400).json({
        message: 'Neispravan ID zapisa o napretku.'
      });
    }

    try {
      const result = await progressCollection.deleteOne({
        _id: new ObjectId(progressId)
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: 'Zapis o napretku nije pronađen.'
        });
      }

      res.status(200).json({
        message: 'Zapis o napretku uspješno obrisan.'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Greška prilikom brisanja zapisa o napretku.'
      });
    }
  });

  return router;
}