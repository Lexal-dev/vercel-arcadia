import { NextApiRequest, NextApiResponse } from 'next';
import Service from '@/models/service'; // Assurez-vous d'importer votre modèle Service correctement

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { id } = req.query as { id: string }; // Assurez-vous que id est de type string

        try {
            // Vérifiez si le service existe
            const service = await Service.findByPk(id);

            if (!service) {
                return res.status(404).json({ success: false, message: 'Service non trouvé.' });
            }

            // Supprimez le service de la base de données
            await service.destroy();

            return res.status(200).json({ success: true, message: 'Service supprimé avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la suppression du service :', error);
            return res.status(500).json({ success: false, message: 'Erreur serveur. Veuillez réessayer plus tard.', error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}