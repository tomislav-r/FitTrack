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

  // Uređivanje postojećeg kalorijskog zapisa

    router.patch(
    '/:id',
    [
      body('date')
        .optional()
        .isISO8601(),

      body('calorieTarget')
        .optional()
        .isFloat({ gt: 0 }),

      body('caloriesConsumed')
        .optional()
        .isFloat({ min: 0 })
    ],

    async (req, res) => {
      const id = req.params.id

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        })
      }

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          message: 'Neispravan ID kalorijskog zapisa.'
        })
      }

      try {
        const updatedData = {}

        if (req.body.date !== undefined) {
          updatedData.date = new Date(req.body.date)
        }

        if (req.body.calorieTarget !== undefined) {
          updatedData.calorieTarget = req.body.calorieTarget
        }

        if (req.body.caloriesConsumed !== undefined) {
          updatedData.caloriesConsumed = req.body.caloriesConsumed
        }

        if (req.body.notes !== undefined) {
          updatedData.notes = req.body.notes
        }

        if (
          updatedData.calorieTarget !== undefined ||
          updatedData.caloriesConsumed !== undefined
        ) {
          const existingEntry = await caloriesCollection.findOne({
            _id: new ObjectId(id)
          })

          if (!existingEntry) {
            return res.status(404).json({
              message: 'Kalorijski zapis nije pronađen.'
            })
          }

          const calorieTarget =
            updatedData.calorieTarget ??
            existingEntry.calorieTarget

          const caloriesConsumed =
            updatedData.caloriesConsumed ??
            existingEntry.caloriesConsumed

          const difference = Math.abs(
            caloriesConsumed - calorieTarget
          )

          const deviationPercentage = Number(
            ((difference / calorieTarget) * 100).toFixed(2)
          )

          let rating

          if (deviationPercentage <= 10) {
            rating = 'Dobar unos'
          } else if (deviationPercentage <= 20) {
            rating = 'Prosječan unos'
          } else {
            rating = 'Loš unos'
          }

          updatedData.deviationPercentage =
            deviationPercentage

          updatedData.rating = rating
        }

        if (Object.keys(updatedData).length === 0) {
          return res.status(400).json({
            message: 'Nema podataka za ažuriranje.'
          })
        }

        const result = await caloriesCollection.updateOne(
          {
            _id: new ObjectId(id)
          },
          {
            $set: updatedData
          }
        )

        if (result.matchedCount === 0) {
          return res.status(404).json({
            message: 'Kalorijski zapis nije pronađen.'
          })
        }

        res.status(200).json({
          message: 'Kalorijski zapis je uspješno ažuriran.'
        })

      } catch (error) {
        console.error(error)

        res.status(500).json({
          message: 'Greška prilikom ažuriranja kalorijskog zapisa.'
        })
      }
    }
  )

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