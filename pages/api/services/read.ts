import { NextApiRequest, NextApiResponse } from 'next';
import Service from '@/models/service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const services = await Service.findAll({ order: [['id', 'ASC']] });
            if (!services || services.length === 0) {
                res.status(404).json({ success: false, message: "La liste des services n'a pas été trouvée" });
            } else {
                res.status(200).json({ success: true, message: "Liste services chargée", services });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des services", error);
            res.status(500).json({ success: false, message: "Échec de la synchronisation des services", error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}