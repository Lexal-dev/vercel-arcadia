import { NextApiRequest, NextApiResponse } from 'next';
import Avis from '@/models/avis';

interface UpdateBody {
    isValid: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id } = req.query as { id: string };
        const { isValid } = req.body as UpdateBody;

        try {
            const avis = await Avis.findByPk(id);

            if (!avis) {
                return res.status(404).json({ success: false, message: 'Avis non trouvé.' });
            }

            avis.isValid = isValid;
            await avis.save();

            return res.status(200).json({ success: true, message: 'Avis mis à jour avec succès.', avis });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'avis :', error);
            return res.status(500).json({ success: false, message: 'Erreur serveur. Veuillez réessayer plus tard.', error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Méthode ${req.method} non utilisée`);
    }
}