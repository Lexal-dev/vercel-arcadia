import { NextApiRequest, NextApiResponse } from 'next';
import Animal from '@/models/animal'; // Assurez-vous que le chemin d'import est correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id = typeof req.query.id === 'string' ? req.query.id : undefined;

    if (!id) {
        res.status(400).json({ success: false, message: 'Un paramètre id est requis' });
        return;
    }

    if (req.method === 'GET') {
        try {
            const animal = await Animal.findByPk(parseInt(id, 10));
            if (!animal) {
                res.status(404).json({ success: false, message: 'Animal non trouvé' });
            } else {
                res.status(200).json({ success: true, animal });
            }
        } catch (error) {
            console.error('Failed to fetch animal:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch animal.', error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}