import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToMongo } from '../index';
import mongoose from 'mongoose';

const router = express.Router();

const donorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true },
  donationsAmount: { type: Number, required: true },
  telefono: { type: String, required: true },
  frequency: { type: String, required: true },
  tier: { type: String, required: true }
});
const Donor = mongoose.model('donors', donorSchema);

router.get('/', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const donorsCollection = db.collection('donors');
    const donors = await donorsCollection.find({}).toArray();
    const donorsWithId = donors.map(donor => ({
      id: donor._id, // Transformar _id a id para React-Admin
      nombre: donor.nombre,
      apellido: donor.apellido,
      email: donor.email,
      donationsAmount: donor.donationsAmount,
      telefono: donor.telefono,
      frequency: donor.frequency,
      tier: donor.tier
  }));
    res.set('X-Total-Count', donors.length.toString());
    res.json(donorsWithId);
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
    const donorWithId = {
      id: donor?._id,
      nombre: donor?.nombre,
      apellido: donor?.apellido,
      email: donor?.email,
      donationsAmount: donor?.donationsAmount,
      telefono: donor?.telefono,
      frequency: donor?.frequency,
      tier: donor?.tier}
      res.set('X-Total-Count', donor.length.toString());
    res.json(donorWithId);
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
    const newDonor = new Donor(req.body);
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


