import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToMongo } from '../index';
import mongoose from 'mongoose';

const router = express.Router();

// Schema de Donación basado en los datos del punto 2
const donationSchema = new mongoose.Schema({
  donorId: { type: ObjectId, required: true },  // Referencia al donante
  fechaDonacion: { type: Date, required: true },
  monto: { type: Number, required: true },
  moneda: { type: String, required: true },
  metodoPago: { type: String, required: true },
  frecuencia: { type: String, required: true }, // Única, mensual, etc.
  campana: { type: String },  // Proyecto o campaña a la que se destinó la donación
  comentarios: { type: String },  // Comentarios del donante, si los hay
  estado: { type: String, default: 'Confirmada' },  // Confirmada, Pendiente, etc.
  reciboEmitido: { type: Boolean, default: false },  // Si se emitió recibo
  fechaRecibo: { type: Date },  // Fecha en que se emitió el recibo (si aplica)
  asignacionFondos: { type: String },  // Detalle de cómo se usaron los fondos (si aplica)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model('donations', donationSchema);

// GET: Obtener todas las donaciones
router.get('/', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const donationsCollection = db.collection('donations');
    const donations = await donationsCollection.find({}).toArray();
    
    const donationsWithId = donations.map(donation => ({
      id: donation._id,  // Transformar _id a id para React-Admin
      donorId: donation.donorId,
      fechaDonacion: donation.fechaDonacion,
      monto: donation.monto,
      moneda: donation.moneda,
      metodoPago: donation.metodoPago,
      frecuencia: donation.frecuencia,
      campana: donation.campaña,
      comentarios: donation.comentarios,
      estado: donation.estado,
      reciboEmitido: donation.reciboEmitido,
      fechaRecibo: donation.fechaRecibo,
      asignacionFondos: donation.asignacionFondos
    }));
    
    res.set('X-Total-Count', donations.length.toString());
    res.json(donationsWithId);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET: Obtener una donación por ID
router.get('/:id', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const donationsCollection = db.collection('donations');
    const donation = await donationsCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const donationWithId = {
      id: donation._id,
      donorId: donation.donorId,
      fechaDonacion: donation.fechaDonacion,
      monto: donation.monto,
      moneda: donation.moneda,
      metodoPago: donation.metodoPago,
      frecuencia: donation.frecuencia,
      campana: donation.campaña,
      comentarios: donation.comentarios,
      estado: donation.estado,
      reciboEmitido: donation.reciboEmitido,
      fechaRecibo: donation.fechaRecibo,
      asignacionFondos: donation.asignacionFondos
    };

    res.set('X-Total-Count', "1");
    res.json(donationWithId);
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST: Crear una nueva donación
router.post('/', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const donationsCollection = db.collection('donations');
    const newDonation = new Donation(req.body);
    
    // Insert the new donation into the collection
    const result = await donationsCollection.insertOne({
      ...newDonation.toObject(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Fetch the newly created donation document
    const createdDonation = await donationsCollection.findOne({ _id: result.insertedId });
    if (createdDonation) {
      res.status(201).json({ data: { id: createdDonation._id, ...createdDonation } });
    } else {
      res.status(500).json({ message: 'Failed to create donation' });
    }
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT: Actualizar una donación existente
router.put('/:id', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const donationsCollection = db.collection('donations');
    
    const donationId = req.params.id;
    if (!ObjectId.isValid(donationId)) {
      return res.status(400).json({ message: 'Invalid donation ID format' });
    }

    const donation = await donationsCollection.findOne({ _id: new ObjectId(donationId) });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const updateObj: any = {};
    const { fechaDonacion, monto, moneda, metodoPago, frecuencia, campana, comentarios, estado, reciboEmitido, fechaRecibo, asignacionFondos } = req.body;
    
    if (fechaDonacion) updateObj.fechaDonacion = fechaDonacion;
    if (monto) updateObj.monto = monto;
    if (moneda) updateObj.moneda = moneda;
    if (metodoPago) updateObj.metodoPago = metodoPago;
    if (frecuencia) updateObj.frecuencia = frecuencia;
    if (campana) updateObj.campaña = campana;
    if (comentarios) updateObj.comentarios = comentarios;
    if (estado) updateObj.estado = estado;
    if (reciboEmitido !== undefined) updateObj.reciboEmitido = reciboEmitido;
    if (fechaRecibo) updateObj.fechaRecibo = fechaRecibo;
    if (asignacionFondos) updateObj.asignacionFondos = asignacionFondos;

    const result = await donationsCollection.updateOne(
      { _id: new ObjectId(donationId) },
      { $set: updateObj }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'No changes made' });
    }

    res.json({ data: { id: donationId, ...updateObj } });
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE: Eliminar una donación
router.delete('/:id', async (req: Request, res: Response) => {
  let db;
  try {
    db = await connectToMongo();
    const donationsCollection = db.collection('donations');
    
    const donationId = req.params.id;
    if (!ObjectId.isValid(donationId)) {
      return res.status(400).json({ message: 'Invalid donation ID format' });
    }

    const donation = await donationsCollection.findOne({ _id: new ObjectId(donationId) });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    const result = await donationsCollection.deleteOne({ _id: new ObjectId(donationId) });

    if (result.deletedCount === 0) {
      return res.status(400).json({ message: 'Failed to delete donation' });
    }

    res.json({ data: { id: donationId } });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
