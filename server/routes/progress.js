import express from 'express';
import { ObjectId } from 'mongodb';
import { body, validationResult } from 'express-validator';

export default function createProgressRouter(db) {
    const router = express.Router();

    const progressCollection = db.collection("progress");
    const clientsCollection = db.collection("clients");

//Dohvaćanje svih zapisa o napretku za određenog klijenta
router.get('/:clientId', async (req, res) => {
  const clientId = req.params.clientId;
  const period = req.query.period;

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

    // Osnovni filter - dohvaćamo samo zapise ovog klijenta
    const filter = {
      clientId: new ObjectId(clientId)
    };

    // Ako je korisnik poslao period, dodajemo filtriranje po datumu
    if (period) {
      const now = new Date();
      let startDate;

      if (period === 'day') {
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
      }

      else if (period === 'week') {
        startDate = new Date(now);

        const currentDay = startDate.getDay();

        const daysSinceMonday =
          currentDay === 0 ? 6 : currentDay - 1;

        startDate.setDate(
          startDate.getDate() - daysSinceMonday
        );

        startDate.setHours(0, 0, 0, 0);
      }

      else if (period === 'month') {
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );
      }

      else if (period === 'year') {
        startDate = new Date(
          now.getFullYear(),
          0,
          1
        );
      }

      else {
        return res.status(400).json({
          message: 'Period mora biti dan, tjedan, mjesec ili godina.'
        });
      }

      filter.date = {
        $gte: startDate,
        $lte: now
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
      message: 'Greška prilikom dohvaćanja napretka.'
    });
  }
});

//Dodavanje novog zapisa o napretku

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
      .withMessage('Vrijednost struka mora biti broj veći od 0.'),

    body('bodyFat')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Vrijednost tjelesne masti mora biti između 0 i 100.')
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
    const id = req.params.id

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      })
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'Neispravan ID zapisa napretka.'
      })
    }

    try {
      const updatedData = {}

      if (req.body.date !== undefined) {
        updatedData.date = new Date(req.body.date)
      }

      if (req.body.weight !== undefined) {
        updatedData.weight = req.body.weight
      }

      if (req.body.waist !== undefined) {
        updatedData.waist = req.body.waist
      }

      if (req.body.bodyFat !== undefined) {
        updatedData.bodyFat = req.body.bodyFat
      }

      if (req.body.notes !== undefined) {
        updatedData.notes = req.body.notes
      }

      if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({
          message: 'Nema podataka za ažuriranje.'
        })
      }

      const result = await progressCollection.updateOne(
        {
          _id: new ObjectId(id)
        },
        {
          $set: updatedData
        }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: 'Zapis napretka nije pronađen.'
        })
      }

      res.status(200).json({
        message: 'Napredak je uspješno ažuriran.'
      })

    } catch (error) {
      console.error(error)

      res.status(500).json({
        message: 'Greška prilikom ažuriranja napretka.'
      })
    }
  }
)

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