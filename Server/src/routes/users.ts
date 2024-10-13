import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToMongo } from '../index';

const router = express.Router();

// Get all users (accessible by everyone)
router.get('/', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    const usersWithId = users.map(user => ({
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role
    }));
    res.set('X-Total-Count', users.length.toString());
    res.json(usersWithId);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
