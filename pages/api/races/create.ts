import { NextApiRequest, NextApiResponse } from 'next';
import Race from '@/models/race';
import { UniqueConstraintError, ValidationError } from 'sequelize';

export default async function createRace(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Synchroniser le modèle avec la base de données si nécessaire
            await Race.sync({ alter: true });

            const { name } = req.body;

            if (!name) {
                res.status(400).json({ success: false, message: 'Le nom de la race est requis.' });
                return;
            }

            const newRace = await Race.create({ name });

            res.status(200).json({ success: true, message: 'Race créée avec succès.', race: newRace });
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                res.status(409).json({ success: false, message: 'Le nom de la race existe déjà.' });
            } else if (error instanceof ValidationError) {
                const errorMessages = error.errors.map((err) => err.message);
                res.status(400).json({ success: false, message: errorMessages.join(', ') });
            } else if (error instanceof Error) {
                res.status(500).json({ success: false, message: 'Échec de la création de la race.', error: String(error) });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Méthode ${req.method} non autorisée.`);
    }
}