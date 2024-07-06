import { NextApiRequest, NextApiResponse } from 'next';
import Service from '@/models/service';


interface UpdateBody {
  name: string;
  description: string;

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id } = req.query as { id: string }; // Assurez-vous que id est de type string
    const { name, description } = req.body as UpdateBody; // Assurez-vous que req.body est de type UpdateBody

    try {
      // Vérifier si l'utilisateur existe
      const service = await Service.findByPk(id);

      if (!service) {
        return res.status(404).json({ success: false, message: 'Service non trouvé.' });
      }

      service.name = name;
      service.description = description;

      await service.save();

      return res.status(200).json({ success: true, message: 'Service mis à jour avec succès.', service });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du service :', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur. Veuillez réessayer plus tard.', error: String(error) });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}