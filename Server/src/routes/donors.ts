import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToMongo } from '../index';

const router = express.Router();

interface Donor {
  nombre: string;
  apellido: string;
  email: string;
  donationsAmount: number;
  telefono: string;
  frequency: string;
  tier: string;
}

router.get('/', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const donorsCollection = db.collection('donors');
    const donors = await donorsCollection.find({}).toArray();
    res.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const donorsCollection = db.collection('donors');
    const donor = await donorsCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }
    res.json(donor);
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  let db
  try {
    db = await connectToMongo();
    const donorsCollection = db.collection('donors');
    const newDonor: Donor = req.body;
    const result = await donorsCollection.insertOne({
      ...newDonor,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({ id: result.insertedId, ...newDonor });
  } catch (error) {
    console.error('Error creating donor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;


