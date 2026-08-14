import express from "express";
import { ObjectId } from "mongodb";

export default function createExerciseRouter(db) {
    const router = express.Router();

    const exerciseCollection = db.collection("exercises");
    const clientsCollection = db.collection("clients");


    //Dodavanje vježbi i rezultata vježbi za određenog klijenta
    router.post('/:clientId', async (req, res) => {
        const clientId = req.params.clientId;

        if (!ObjectId.isValid(clientId)) {
            return res.status(400).json({
                message: 'Neispravan ID klijenta.'
            });
        }

        const {
            exerciseName,
            date,
            sets,
            reps,
            weight,
            notes
        } = req.body;

        if (!exerciseName || !date || sets === undefined || reps === undefined) {
            return res.status(400).json({
            message: 'Naziv vježbe, datum, broj serija i broj ponavljanja su obavezni.'
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

        const newExercise = {
            clientId: new ObjectId(clientId),
            exerciseName,
            date: new Date(date),
            sets,
            reps,
            weight,
            notes,
            createdAt: new Date()
        };

        const result = await exerciseCollection.insertOne(newExercise);

        res.status(201).json({
            _id: result.insertedId,
            ...newExercise
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Greška prilikom dodavanja vježbi.'
        });
    }
    });

    // Dohvaćanje svih vježbi i rezultata vježbi za određenog klijenta
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

            const exercises = await exerciseCollection
            .find({
                clientId: new ObjectId(clientId)
            })
            .sort({ 
                date: -1 
            })
            .toArray();

            res.status(200).json(exercises);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: 'Greška prilikom dohvaćanja vježbi.'
            });
        }
    });

    //Brisanje vježbi i rezultata vježbi za određenog klijenta

    router.delete('/:id', async (req, res) => {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Neispravan ID vježbe.'
            });
        }

        try {
            const result = await exerciseCollection.deleteOne({
                _id: new ObjectId(id)
            });

            if (result.deletedCount === 0) {
                return res.status(404).json({
                    message: 'Vježba nije pronađena.'
                });
            }

            res.status(200).json({
                message: 'Vježba uspješno obrisana'
            });
        } catch (error){
            console.error(error);

            res.status(500).json({
                message: 'Greška prilikom brisanja vježbe.'
            })
        }
    });

        return router;
}