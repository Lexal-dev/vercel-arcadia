import { NextApiRequest, NextApiResponse } from 'next';
import Race from '@/models/race';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const races = await Race.findAll();
            if (!races) {
                res.status(404).json({ success: false, message: "La liste des races d'animaux n'a pas été trouvée" });
            } else {
                res.status(200).json({ success: true, message: "Liste des races d'animaux chargée", races });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des races d'animaux:", error);
            res.status(500).json({ success: false, message: "Échec de la synchronisation des races d'animaux.", error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Méthode ${req.method} non utilisée`);
    }
}