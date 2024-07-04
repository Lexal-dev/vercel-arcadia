import { NextApiRequest, NextApiResponse } from 'next';
import Animal from '@/models/animal';
import { UniqueConstraintError, ValidationError } from 'sequelize';

export default async function createAnimal(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Synchroniser le modèle avec la base de données si nécessaire
            await Animal.sync({ alter: true });

            const { name, etat, raceId } = req.body;

            if (!name || !etat || !raceId) {
                res.status(400).json({ success: false, message: 'Le nom, l\'état et l\'identifiant de la race sont requis.' });
                return;
            }

            const newAnimal = await Animal.create({ name, etat, raceId });

            res.status(200).json({ success: true, message: 'Animal créé avec succès.', animal: newAnimal });
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                res.status(409).json({ success: false, message: 'Le nom de l\'animal existe déjà.' });
            } else if (error instanceof ValidationError) {
                const errorMessages = error.errors.map((err) => err.message);
                res.status(400).json({ success: false, message: errorMessages.join(', ') });
            } else if (error instanceof Error) {
                res.status(500).json({ success: false, message: 'Échec de la création de l\'animal.', error: String(error) });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Méthode ${req.method} non autorisée.`);
    }
}