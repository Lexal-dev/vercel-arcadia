import { NextApiRequest, NextApiResponse } from 'next';
import Animal from '@/models/animal';
import { UniqueConstraintError, ValidationError } from 'sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = typeof req.query.id === 'string' ? req.query.id : undefined;

  if (!id) {
    res.status(400).json({ success: false, message: 'Un paramètre id est requis.' });
    return;
  }

  if (req.method === 'PUT') {
    try {
      const { name, raceId, habitatId, etat } = req.body;

      if (!name || !raceId || !habitatId || !etat) {
        res.status(400).json({ success: false, message: 'Le nom, raceId, habitatId et l\'état sont requis.' });
        return;
      }

      const animal = await Animal.findByPk(parseInt(id, 10));
      if (!animal) {
        res.status(404).json({ success: false, message: 'Animal non trouvé.' });
        return;
      }

      // Mettre à jour les attributs de l'animal avec les IDs de race et d'habitat
      animal.name = name;
      animal.raceId = raceId;
      animal.habitatId = habitatId;
      animal.etat = etat;
      await animal.save();

      res.status(200).json({ success: true, message: 'Animal mis à jour avec succès.', animal });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        res.status(409).json({ success: false, message: 'Le nom de l\'animal existe déjà.' });
      } else if (error instanceof ValidationError) {
        const errorMessages = error.errors.map((err) => err.message);
        res.status(400).json({ success: false, message: errorMessages.join(', ') });
      } else if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de l\'animal.' });
      }
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ success: false, message: `Méthode ${req.method} non autorisée.` });
  }
}