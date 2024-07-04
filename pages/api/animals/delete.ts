import { NextApiRequest, NextApiResponse } from 'next';
import Animal from '@/lib/models/animal'; // Assurez-vous que le chemin d'import est correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id = typeof req.query.id === 'string' ? req.query.id : undefined;

    if (!id) {
        res.status(400).json({ success: false, message: 'Un paramètre id est requis' });
        return;
    }

    if (req.method === 'DELETE') {
        try {
            const animal = await Animal.findByPk(parseInt(id, 10));
            if (!animal) {
                res.status(404).json({ success: false, message: 'Animal non trouvé' });
                return;
            }

            await animal.destroy();

            res.status(200).json({ success: true, message: 'Animal supprimé avec succès' });
        } catch (error) {
            console.error('Échec de la suppression de l\'animal:', error);
            res.status(500).json({ success: false, message: 'Échec de la suppression de l\'animal', error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}