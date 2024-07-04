import { NextApiRequest, NextApiResponse } from 'next';
import Animal from '@/lib/models/animal'; // Assurez-vous que le chemin d'import est correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id = typeof req.query.id === 'string' ? req.query.id : undefined;

    if (!id) {
        res.status(400).json({ success: false, message: 'Un paramètre id est requis' });
        return;
    }

    if (req.method === 'PUT') {
        try {
            const { name, etat } = req.body;

            if (!name || !etat) {
                res.status(400).json({ success: false, message: 'Name and etat are required.' });
                return;
            }

            const animal = await Animal.findByPk(parseInt(id, 10));
            if (!animal) {
                res.status(404).json({ success: false, message: 'Animal not found' });
                return;
            }

            // Mettre à jour les attributs de l'animal
            animal.name = name;
            animal.etat = etat;
            await animal.save();

            res.status(200).json({ success: true, message: 'Animal updated successfully', animal });
        } catch (error) {
            console.error('Failed to update animal:', error);
            res.status(500).json({ success: false, message: 'Failed to update animal', error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}