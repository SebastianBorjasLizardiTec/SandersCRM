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
      res.set('X-Total-Count', "1");
    res.json(donorWithId);
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const donorsCollection = db.collection('donors');
    const newDonor = new Donor(req.body);
    
    // Insert the new donor into the collection
    const result = await donorsCollection.insertOne({
      ...newDonor.toObject(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Fetch the newly created donor document
    const createdDonor = await donorsCollection.findOne({ _id: result.insertedId });
    // Respond with the newly created donor's full data
    if (createdDonor) {
      res.status(201).json( {id: createdDonor._id, ...createdDonor });
    } else {
      res.status(500).json({ message: 'Failed to create donor' });
    }
  } catch (error) {
    console.error('Error creating donor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const donorsCollection = db.collection('donors');
    
    // Validate donor ID
    const donorId = req.params.id;
    if (!ObjectId.isValid(donorId)) {
      return res.status(400).json({ message: 'Invalid donor ID format' });
    }

    // Check if donor exists
    const donor = await donorsCollection.findOne({ _id: new ObjectId(donorId) });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Prepare update object
    const updateObj: any = {};
    const { nombre, apellido, email, donationsAmount, telefono, frequency, tier } = req.body;
    if (nombre) updateObj.nombre = nombre;
    if (apellido) updateObj.apellido = apellido;
    if (email) updateObj.email = email;
    if (donationsAmount) updateObj.donationsAmount = donationsAmount;
    if (telefono) updateObj.telefono = telefono;
    if (frequency) updateObj.frequency = frequency;
    if (tier) updateObj.tier = tier;

    // Update donor information
    const result = await donorsCollection.updateOne(
      { _id: new ObjectId(donorId) },
      { $set: updateObj }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'No changes made' });
    }

    // Respond with the updated donor's ID
    res.json({id: donorId, nombre: updateObj.nombre, apellido: updateObj.apellido, email: updateObj.email, 
      donationsAmount: updateObj.donationsAmount, telefono: updateObj.telefono, frequency: updateObj.frequency, tier: updateObj.tier });
  } catch (error) {
    console.error('Error updating donor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const donorsCollection = db.collection('donors');
    
    // Validate donor ID
    const donorId = req.params.id;
    if (!ObjectId.isValid(donorId)) {
      return res.status(400).json({ message: 'Invalid donor ID format' });
    }

    // Check if donor exists
    const donor = await donorsCollection.findOne({ _id: new ObjectId(donorId) });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Delete donor
    const result = await donorsCollection.deleteOne({ _id: new ObjectId(donorId) });

    if (result.deletedCount === 0) {
      return res.status(400).json({ message: 'Failed to delete donor' });
    }

    // Respond with the deleted donor's ID
    res.json({ data: { id: donorId } });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
