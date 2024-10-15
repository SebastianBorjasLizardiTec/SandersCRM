import express, { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToMongo } from '../index';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configura el transporte del correo
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
      user: 'c58918046f0d8b',
      pass: 'c9b7b9c6d28ce7',
  },
});


const sendEmail = async (donorName: string, donationAmount: string, donationDate: string, contactEmail: string, organizationName: string, year: string) => {

  const donation_email = `
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
    
    <div style="display: flex; align-items: center; padding: 10px 0; background-color: #003366; color: white;"> <!-- Cambié el color aquí -->
      <img src="https://pbs.twimg.com/profile_images/1562606977930432512/UiOSwS5F_400x400.jpg" alt="Logo" style="width: 100px; height: 100px; margin-right: 10px; margin-left: 10px;">
      <h1 style="margin-left: 30;">Confirmación de Donación</h1>
    </div>

    <p>Estimado(a) ${donorName},</p>

    <p>Nos complace confirmar que hemos recibido su donación de <strong>${parseFloat(donationAmount).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</strong> el <strong>${new Date(donationDate).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>.</p>

    <p>Queremos expresarle nuestro más sincero agradecimiento por su generosidad y apoyo a nuestra causa. Su donación hará una gran diferencia en nuestra misión y en la vida de muchas familias.</p>

    <p>Si requiere de más información, no dude en poner en contacto con nosotros a través de Sanders@gmail.com</p>

    <p>Una vez más, le agradecemos su valiosa contribución.</p>

    <p>Saludos cordiales,</p>

    <p><strong>${organizationName}</strong></p>

    <div style="text-align: center; font-size: 12px; color: #777; margin-top: 20px;">
      <p>&copy; ${year} ${organizationName}. Todos los derechos reservados.</p>
    </div>
  </div>
</body>`;



  try {
      await transporter.sendMail(
        {
          from: 'Sanders@gmail.com',
          to: "pruebas@gmail.com",
          subject: 'Prueba de Envío',
          html: donation_email,
      });
      console.log('Correo enviado exitosamente');
  } catch (error) {
      console.error('Error al enviar el correo:', error);
  }
};



// Schema de Donación basado en los datos del punto 2
const donationSchema = new mongoose.Schema({
  mesDonacion: { type: String, required: true },
  nombre: { type: String, required: true },  // Corrección: "required"
  apellido: { type: String, required: true }, // Corrección: "required"
  email: { type: String, required: true },    // Nuevo campo de email
  monto: { type: Number, required: true },
  moneda: { type: String, required: true },
  metodoPago: { type: String, required: true },
  frecuencia: { type: String, required: true }, // Única, mensual, etc.
  campana: { type: String, required: true },  // Proyecto o campaña a la que se destinó la donación
  comentarios: { type: String },  // Comentarios del donante, si los hay
  estado: { type: String },  // Confirmada, Pendiente, etc.
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
      nombre: donation.nombre,
      apellido: donation.apellido,
      email: donation.email,  // Agregar email
      mesDonacion: donation.mesDonacion,
      monto: donation.monto,
      moneda: donation.moneda,
      metodoPago: donation.metodoPago,
      frecuencia: donation.frecuencia,
      campana: donation.campana,
      comentarios: donation.comentarios,
      estado: donation.estado,
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
      nombre: donation.nombre,
      apellido: donation.apellido,
      email: donation.email,  // Agregar email
      mesDonacion: donation.mesDonacion,
      monto: donation.monto,
      moneda: donation.moneda,
      metodoPago: donation.metodoPago,
      frecuencia: donation.frecuencia,
      campana: donation.campana,
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
      const { _id, nombre, apellido, email, monto, createdAt, ...donationWithoutId } = createdDonation;

      sendEmail(nombre+" "+apellido, monto, createdAt, email, "Fundación Sanders", "2024");

      res.status(201).json({ id: _id, ...donationWithoutId });
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
    const { nombre, apellido, email, mesDonacion, monto, moneda, metodoPago, frecuencia, campana, comentarios, estado, reciboEmitido, fechaRecibo, asignacionFondos } = req.body;
    
    if (nombre) updateObj.nombre = nombre;
    if (apellido) updateObj.apellido = apellido;
    if (email) updateObj.email = email;
    if (mesDonacion) updateObj.mesDonacion = mesDonacion;
    if (monto) updateObj.monto = monto;
    if (moneda) updateObj.moneda = moneda;
    if (metodoPago) updateObj.metodoPago = metodoPago;
    if (frecuencia) updateObj.frecuencia = frecuencia;
    if (campana) updateObj.campaña = campana;
    if (comentarios) updateObj.comentarios = comentarios;
    if (estado) updateObj.estado = estado;
    if (fechaRecibo) updateObj.fechaRecibo = fechaRecibo;


    const result = await donationsCollection.updateOne(
      { _id: new ObjectId(donationId) },
      { $set: updateObj }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'No changes made' });
    }

    res.json({  id: donationId, ...updateObj});
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

    res.json({id: donationId });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

export default router;
