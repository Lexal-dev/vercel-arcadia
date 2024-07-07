import { NextApiRequest, NextApiResponse } from 'next';
import Report from '@/models/report';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { food, quantity, createdAt, animalId } = req.body;

        // Vérifier que food, quantity, createdAt et animalId sont présents
        if (!food || !quantity || !createdAt || !animalId) {
            return res.status(400).json({ success: false, message: "Tous les champs sont requis pour créer un rapport." });
        }

        try {
            // Créer un nouveau rapport en base de données
            const newReport = await Report.create({
                food,
                quantity,
                createdAt,
                animalId,
            });

            // Envoyer une réponse avec le rapport créé
            return res.status(201).json({ success: true, message: "Rapport créé avec succès", report: newReport });
        } catch (error) {
            console.error("Erreur lors de la création du rapport:", error);
            return res.status(500).json({ success: false, message: "Erreur serveur lors de la création du rapport", error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}