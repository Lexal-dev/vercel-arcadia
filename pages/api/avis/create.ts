import { NextApiRequest, NextApiResponse } from 'next';
import Avis, { AvisAttributes } from '@/models/avis';
import { ValidationError } from 'sequelize';

export default async function createAvis(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            await Avis.sync({ alter: true }); // Synchronisation du modèle avec la base de données si nécessaire

            const { pseudo, comment } = req.body;

            if (!pseudo || !comment) {
                res.status(400).json({ success: false, message: 'Le pseudo et le commentaire sont requis.' });
                return;
            }

            // Création d'une nouvelle instance d'Avis en spécifiant les propriétés requises
            const newAvis = await Avis.create({ pseudo, comment, isValid: false } as AvisAttributes);

            res.status(200).json({ success: true, message: 'Avis créé avec succès.', avis: newAvis });
        } catch (error) {
            if (error instanceof ValidationError) {
                const errorMessages = error.errors.map((err) => err.message);
                res.status(400).json({ success: false, message: errorMessages.join(', ') });
            } else {
                console.error('Error creating avis:', error);
                res.status(500).json({ success: false, message: 'Échec de la création de l\'avis.', error: String(error) });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Méthode ${req.method} non autorisée.`);
    }
}