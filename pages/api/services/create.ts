import { NextApiRequest, NextApiResponse } from 'next';
import Service, { ServiceAttributes } from '@/models/service';
import { ValidationError } from 'sequelize';

export default async function createService(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            await Service.sync({ alter: true }); // Synchronisation du modèle avec la base de données si nécessaire

            const { name, description } = req.body;

            if (!name || !description) {
                res.status(400).json({ success: false, message: 'Le service et la description sont requis.' });
                return;
            }

            // Création d'une nouvelle instance d'Avis en spécifiant les propriétés requises
            const newService = await Service.create({ name, description } as ServiceAttributes);

            res.status(200).json({ success: true, message: 'Service créé avec succès.', avis: newService });
        } catch (error) {
            if (error instanceof ValidationError) {
                const errorMessages = error.errors.map((err) => err.message);
                res.status(400).json({ success: false, message: errorMessages.join(', ') });
            } else {
                console.error('Erreur lors de la création de services', error);
                res.status(500).json({ success: false, message: 'Échec de la création du service', error: String(error) });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Méthode ${req.method} non autorisée.`);
    }
}