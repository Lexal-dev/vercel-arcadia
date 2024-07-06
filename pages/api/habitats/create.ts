import { NextApiRequest, NextApiResponse } from 'next';
import Habitat, { HabitatAttributes } from '@/models/habitat';
import { ValidationError } from 'sequelize';

export default async function createHabitat(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            await Habitat.sync({ alter: true }); // Synchronisation du modèle avec la base de données si nécessaire

            const { name, description, comment } = req.body;

            if (!name || !description) {
                res.status(400).json({ success: false, message: 'habitat et la description sont requis.' });
                return;
            }

            // Création d'une nouvelle instance d'Avis en spécifiant les propriétés requises
            const newHabitat = await Habitat.create({ name, description, comment } as HabitatAttributes);

            res.status(200).json({ success: true, message: 'habitat créé avec succès.', avis: newHabitat });
        } catch (error) {
            if (error instanceof ValidationError) {
                const errorMessages = error.errors.map((err) => err.message);
                res.status(400).json({ success: false, message: errorMessages.join(', ') });
            } else {
                console.error('Erreur lors de la création habitat', error);
                res.status(500).json({ success: false, message: 'Échec de la création habitat', error: String(error) });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Méthode ${req.method} non autorisée.`);
    }
}