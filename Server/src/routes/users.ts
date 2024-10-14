import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { connectToMongo } from '../index';

const router = express.Router();
const SALT_ROUNDS = 10;

// Get all users
router.get('/', async (req: Request, res: Response) => {
    let db;
    try {
        db = await connectToMongo();
        const usersCollection = db.collection('users');
        const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
        
        const usersWithId = users.map(user => ({
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
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

// Get a user by ID
router.get('/:id', async (req: Request, res: Response) => {
    let db;
    try {
        db = await connectToMongo();
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(req.params.id) }, { projection: { password: 0 } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userWithId = {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            role: user.role
        };
        res.json(userWithId);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new user
router.post('/', async (req: Request, res: Response) => {
    let db;
    try {
        db = await connectToMongo();
        const usersCollection = db.collection('users');

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            role: req.body.role,
        };

        const result = await usersCollection.insertOne(newUser);
        const createdUser = await usersCollection.findOne({ _id: result.insertedId }, { projection: { password: 0 } });

        if (createdUser) {
            res.status(201).json({id: createdUser._id, ...createdUser });
        } else {
            res.status(500).json({ message: 'Failed to create user' });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a user by ID
router.put('/:id', async (req: Request, res: Response) => {
    let db;
    try {
        db = await connectToMongo();
        const usersCollection = db.collection('users');
        const userId = req.params.id;

        // Validate user ID
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        // Check if user exists
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare update object
        const updateObj: any = {};
        const { nombre, apellido, email, role } = req.body;
        if (nombre) updateObj.nombre = nombre;
        if (apellido) updateObj.apellido = apellido;
        if (email) updateObj.email = email;
        if (role) updateObj.role = role;

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateObj }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'No changes made' });
        }

        // Respond with the updated user's ID
        res.json({id: userId, ...updateObj });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user information route (including password change)
router.put('/update', async (req: Request, res: Response) => {
    console.log('Update user attempt:', req.body.email);
    let db;
    try {
        db = await connectToMongo();
        const { userId, nombre, email, currentPassword, newPassword } = req.body;
        const usersCollection = db.collection('users');

        // Validate userId
        if (!ObjectId.isValid(userId)) {
            console.log('Update failed: Invalid userId');
            return res.status(400).json({ message: 'Invalid userId format' });
        }

        // Verify user exists
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            console.log('Update failed: User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare update object
        const updateObj: any = {};
        if (nombre) updateObj.nombre = nombre;
        if (email) updateObj.email = email;

        // Password change logic
        if (currentPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid current password' });
            }
            updateObj.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        } else if (currentPassword || newPassword) {
            return res.status(400).json({ message: 'Both current and new password are required to change password' });
        }

        // Only proceed with update if there are fields to update
        if (Object.keys(updateObj).length > 0) {
            const result = await usersCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: updateObj }
            );

            if (result.modifiedCount === 0) {
                return res.status(400).json({ message: 'No changes made' });
            }

            console.log('User updated successfully:', userId);
            res.json({ message: 'User updated successfully' });
        } else {
            res.status(400).json({ message: 'No valid fields to update' });
        }
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a user
router.delete('/:id', async (req: Request, res: Response) => {
    let db;
    try {
        db = await connectToMongo();
        const usersCollection = db.collection('users');
        const userId = req.params.id;

        // Validate user ID
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
