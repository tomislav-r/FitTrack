import express from 'express';
import { ObjectId } from 'mongodb';
import { body, validationResult } from 'express-validator';

export default function createProgressRouter(db) {
  const router = express.Router();

  const progressCollection = db.collection('progress');
  const clientsCollection = db.collection('clients');


  // Dohvaćanje svih godina za koje klijent ima zapise napretka
  router.get('/:clientId/years', async (req, res) => {
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

      const years = await progressCollection
        .aggregate([
          {
            $match: {
              clientId: new ObjectId(clientId)
            }
          },
          {
            $group: {
              _id: {
                $year: '$date'
              }
            }
          },
          {
            $sort: {
              _id: -1
            }
          }
        ])
        .toArray();

      res.status(200).json(
        years.map(year => year._id)
      );

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: 'Greška prilikom dohvaćanja godina.'
      });
    }
  });


  // Dohvaćanje svih zapisa o napretku za određenog klijenta
  router.get('/:clientId', async (req, res) => {
    const clientId = req.params.clientId;

    const period = req.query.period;
    const value = req.query.value;

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

      const filter = {
        clientId: new ObjectId(clientId)
      };


      // Ako period nije odabran, vraćamo sve zapise
      if (period) {

        if (!value) {
          return res.status(400).json({
            message: 'Vrijednost razdoblja nije odabrana.'
          });
        }

        let startDate;
        let endDate;


        // DAN
        if (period === 'day') {
          const parts = value.split('-');

          if (parts.length !== 3) {
            return res.status(400).json({
              message: 'Neispravan format datuma.'
            });
          }

          const year = Number(parts[0]);
          const month = Number(parts[1]);
          const day = Number(parts[2]);

          startDate = new Date(
            Date.UTC(
              year,
              month - 1,
              day
            )
          );

          endDate = new Date(
            Date.UTC(
              year,
              month - 1,
              day + 1
            )
          );
        }


        // TJEDAN
        else if (period === 'week') {
          const parts = value.split('-');

          if (parts.length !== 3) {
            return res.status(400).json({
              message: 'Neispravan format datuma.'
            });
          }

          const year = Number(parts[0]);
          const month = Number(parts[1]);
          const day = Number(parts[2]);

          const selectedDate = new Date(
            Date.UTC(
              year,
              month - 1,
              day
            )
          );

          const currentDay =
            selectedDate.getUTCDay();

          const daysSinceMonday =
            currentDay === 0
              ? 6
              : currentDay - 1;

          startDate = new Date(selectedDate);

          startDate.setUTCDate(
            selectedDate.getUTCDate() -
            daysSinceMonday
          );

          endDate = new Date(startDate);

          endDate.setUTCDate(
            startDate.getUTCDate() + 7
          );
        }


        // MJESEC
        else if (period === 'month') {
          const parts = value.split('-');

          if (parts.length !== 2) {
            return res.status(400).json({
              message: 'Neispravan format mjeseca.'
            });
          }

          const year = Number(parts[0]);
          const month = Number(parts[1]);

          startDate = new Date(
            Date.UTC(
              year,
              month - 1,
              1
            )
          );

          endDate = new Date(
            Date.UTC(
              year,
              month,
              1
            )
          );
        }


        // GODINA
        else if (period === 'year') {
          const year = Number(value);

          if (!year) {
            return res.status(400).json({
              message: 'Neispravna godina.'
            });
          }

          startDate = new Date(
            Date.UTC(
              year,
              0,
              1
            )
          );

          endDate = new Date(
            Date.UTC(
              year + 1,
              0,
              1
            )
          );
        }


        // NEISPRAVAN PERIOD
        else {
          return res.status(400).json({
            message:
              'Period mora biti day, week, month ili year.'
          });
        }


        filter.date = {
          $gte: startDate,
          $lt: endDate
        };
      }


      const progress = await progressCollection
        .find(filter)
        .sort({
          date: -1
        })
        .toArray();


      res.status(200).json(progress);

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          'Greška prilikom dohvaćanja napretka.'
      });
    }
  });


  // Dodavanje novog zapisa o napretku
  router.post(
    '/:clientId',
    [
      body('date')
        .notEmpty()
        .withMessage('Datum je obavezan.')
        .isISO8601()
        .withMessage('Datum mora biti ispravnog formata.'),

      body('weight')
        .notEmpty()
        .withMessage('Težina je obavezna.')
        .isFloat({ gt: 0 })
        .withMessage('Težina mora biti broj veći od 0.'),

      body('waist')
        .optional()
        .isFloat({ gt: 0 })
        .withMessage(
          'Vrijednost struka mora biti broj veći od 0.'
        ),

      body('bodyFat')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage(
          'Vrijednost tjelesne masti mora biti između 0 i 100.'
        )
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
        weight,
        waist,
        bodyFat,
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

        const newProgress = {
          clientId: new ObjectId(clientId),
          date: new Date(date),
          weight,
          waist,
          bodyFat,
          notes,
          createdAt: new Date()
        };

        const result =
          await progressCollection.insertOne(
            newProgress
          );

        res.status(201).json({
          _id: result.insertedId,
          ...newProgress
        });

      } catch (error) {
        console.error(error);

        res.status(500).json({
          message:
            'Greška prilikom dodavanja napretka.'
        });
      }
    }
  );


  // Uređivanje zapisa o napretku
  router.patch(
    '/:id',
    [
      body('date')
        .optional()
        .isISO8601(),

      body('weight')
        .optional()
        .isFloat({ gt: 0 }),

      body('waist')
        .optional({ nullable: true })
        .isFloat({ gt: 0 }),

      body('bodyFat')
        .optional({ nullable: true })
        .isFloat({ min: 0, max: 100 })
    ],

    async (req, res) => {
      const id = req.params.id;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({
          message:
            'Neispravan ID zapisa napretka.'
        });
      }

      try {
        const updatedData = {};

        if (req.body.date !== undefined) {
          updatedData.date =
            new Date(req.body.date);
        }

        if (req.body.weight !== undefined) {
          updatedData.weight =
            req.body.weight;
        }

        if (req.body.waist !== undefined) {
          updatedData.waist =
            req.body.waist;
        }

        if (req.body.bodyFat !== undefined) {
          updatedData.bodyFat =
            req.body.bodyFat;
        }

        if (req.body.notes !== undefined) {
          updatedData.notes =
            req.body.notes;
        }


        if (
          Object.keys(updatedData).length === 0
        ) {
          return res.status(400).json({
            message:
              'Nema podataka za ažuriranje.'
          });
        }


        const result =
          await progressCollection.updateOne(
            {
              _id: new ObjectId(id)
            },
            {
              $set: updatedData
            }
          );


        if (result.matchedCount === 0) {
          return res.status(404).json({
            message:
              'Zapis napretka nije pronađen.'
          });
        }


        res.status(200).json({
          message:
            'Napredak je uspješno ažuriran.'
        });

      } catch (error) {
        console.error(error);

        res.status(500).json({
          message:
            'Greška prilikom ažuriranja napretka.'
        });
      }
    }
  );


  // Brisanje zapisa o napretku
  router.delete('/:id', async (req, res) => {
    const progressId = req.params.id;

    if (!ObjectId.isValid(progressId)) {
      return res.status(400).json({
        message:
          'Neispravan ID zapisa o napretku.'
      });
    }

    try {
      const result =
        await progressCollection.deleteOne({
          _id: new ObjectId(progressId)
        });


      if (result.deletedCount === 0) {
        return res.status(404).json({
          message:
            'Zapis o napretku nije pronađen.'
        });
      }


      res.status(200).json({
        message:
          'Zapis o napretku uspješno obrisan.'
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          'Greška prilikom brisanja zapisa o napretku.'
      });
    }
  });


  return router;
}