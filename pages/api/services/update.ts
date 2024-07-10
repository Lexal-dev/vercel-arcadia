import { NextApiRequest, NextApiResponse } from 'next';
import Service, { ServiceAttributes } from '@/models/service';
import { ValidationError } from 'sequelize';

interface UpdateBody {
  name: string;
  description: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id } = req.query as { id: string };
    const { name, description } = req.body as UpdateBody;

    try {
      // Vérifier si l'ID est un nombre entier valide
      if (!/^\d+$/.test(id)) {
        return res.status(400).json({ success: false, message: "L'ID du service n'est pas valide." });
      }

      // Vérifier si le service existe
      const service = await Service.findByPk(parseInt(id, 10));

      if (!service) {
        return res.status(404).json({ success: false, message: 'Service non trouvé.' });
      }

      // Vérifier la longueur du nom
      if (name.length < 3 || name.length > 30) {
        return res.status(400).json({ success: false, message: 'Le nom doit être compris entre 3 et 30 caractères.' });
      }

      // Vérifier la longueur de la description
      if (description.length < 3 || description.length > 150) {
        return res.status(400).json({ success: false, message: 'La description doit être comprise entre 3 et 150 caractères.' });
      }

      // Mettre à jour les propriétés du service
      service.name = name;
      service.description = description;

      // Valider les modifications
      await service.validate();

      // Sauvegarder les modifications dans la base de données
      await service.save();

      return res.status(200).json({ success: true, message: 'Service mis à jour avec succès.', service });
    } catch (error) {
      if (error instanceof ValidationError) {
        const errorMessages = error.errors.map((err) => err.message);
        return res.status(400).json({ success: false, message: errorMessages.join(', ') });
      } else {
        console.error('Erreur lors de la mise à jour du service :', error);
        return res.status(500).json({ success: false, message: 'Erreur serveur. Veuillez réessayer plus tard.', error: String(error) });
      }
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}