import express from 'express';
import { ObjectId } from 'mongodb';
import { body, validationResult } from 'express-validator';

export default function createCaloriesRouter(db) {
  const router = express.Router();

  const caloriesCollection = db.collection('calories');
  const clientsCollection = db.collection('clients');

  // Dodavanje kalorijskog zapisa za određenog klijenta
  router.post(
    '/:clientId',
    [
      body('date')
        .notEmpty()
        .withMessage('Datum je obavezan.')
        .isISO8601()
        .withMessage('Datum mora biti ispravnog formata.'),

      body('calorieTarget')
        .notEmpty()
        .withMessage('Kalorijski cilj je obavezan.')
        .isFloat({ gt: 0 })
        .withMessage('Kalorijski cilj mora biti broj veći od 0.'),

      body('caloriesConsumed')
        .notEmpty()
        .withMessage('Unesene kalorije su obavezne.')
        .isFloat({ min: 0 })
        .withMessage('Unesene kalorije moraju biti broj jednak ili veći od 0.')
    ],

    async (req, res) => {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      const clientId = req.params.clientId;

      if (!ObjectId.isValid(clientId)) {
        return res.status(400).json({
          message: 'Neispravan ID klijenta.'
        });
      }

      const {
        date,
        calorieTarget,
        caloriesConsumed,
        notes
      } = req.body;

      try {
        const client = await clientsCollection.findOne({
          _id: new ObjectId(clientId)
        });

        if (!client) {
          return res.status(404).json({
            message: 'Klijent nije pronađen.'
          });
        }

        const difference = Math.abs(
          caloriesConsumed - calorieTarget
        );

        const deviationPercentage = Number(
          ((difference / calorieTarget) * 100).toFixed(2)
        );

        let rating;

        if (deviationPercentage <= 10) {
          rating = 'Dobar unos';
        } else if (deviationPercentage <= 20) {
          rating = 'Prosječan unos';
        } else {
          rating = 'Loš unos';
        }

        const newCaloriesEntry = {
          clientId: new ObjectId(clientId),
          date: new Date(date),
          calorieTarget,
          caloriesConsumed,
          deviationPercentage,
          rating,
          notes,
          createdAt: new Date()
        };

        const result = await caloriesCollection.insertOne(
          newCaloriesEntry
        );

        res.status(201).json({
          _id: result.insertedId,
          ...newCaloriesEntry
        });

      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: 'Greška prilikom dodavanja kalorijskog zapisa.'
        });
      }
    }
  );
  
  // Dohvaćanje svih kalorijskih zapisa određenog klijenta
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

      const calories = await caloriesCollection
        .find({
          clientId: new ObjectId(clientId)
        })
        .sort({
          date: -1
        })
        .toArray();

      res.status(200).json(calories);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: 'Greška prilikom dohvaćanja kalorijskih zapisa.'
      });
    }
    });

  // Brisanje jednog kalorijskog zapisa
    router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
        message: 'Neispravan ID kalorijskog zapisa.'
        });
    }

    try {
        const result = await caloriesCollection.deleteOne({
        _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
        return res.status(404).json({
            message: 'Kalorijski zapis nije pronađen.'
        });
        }

        res.status(200).json({
        message: 'Kalorijski zapis je uspješno obrisan.'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
        message: 'Greška prilikom brisanja kalorijskog zapisa.'
        });
    }
    });

  return router;
}