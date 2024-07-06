import { NextApiRequest, NextApiResponse } from 'next';
import Animal from '@/models/animal';
import { UniqueConstraintError, ValidationError } from 'sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, raceId, habitatId, etat } = req.body;

      if (!name || !raceId || !habitatId || !etat) {
        res.status(400).json({ success: false, message: 'Le nom, raceId, habitatId et l\'état sont requis.' });
        return;
      }

      // Vérifier si habitatId est bien un nombre
      const parsedHabitatId = parseInt(habitatId, 10);
      if (isNaN(parsedHabitatId)) {
        res.status(400).json({ success: false, message: 'L\'ID de l\'habitat doit être un nombre.' });
        return;
      }

      // Créer un nouvel animal avec les données reçues
      const animal = await Animal.create({
        name,
        raceId,
        habitatId: parsedHabitatId, // Assurez-vous que habitatId est bien un nombre
        etat
      });

      res.status(201).json({ success: true, message: 'Animal créé avec succès.', animal });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        res.status(409).json({ success: false, message: 'Le nom de l\'animal existe déjà.' });
      } else if (error instanceof ValidationError) {
        const errorMessages = error.errors.map((err) => err.message);
        res.status(400).json({ success: false, message: errorMessages.join(', ') });
      } else {
        res.status(500).json({ success: false, message: 'Erreur lors de la création de l\'animal.', error: String(error) });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, message: `Méthode ${req.method} non autorisée.` });
  }
}