import { NextApiRequest, NextApiResponse } from 'next';
import Hours from '@/models/hour';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { days, open, close } = req.body;

        if (!days || !open || !close) {
            return res.status(400).json({ success: false, message: "Tous les champs sont requis" });
        }

        try {
            const newHour = await Hours.create({ days, open, close });
            return res.status(201).json({ success: true, message: "Horaire créé avec succès", hour: newHour });
        } catch (error) {
            console.error("Erreur lors de la création de l'horaire:", error);
            return res.status(500).json({ success: false, message: "Erreur serveur", error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}