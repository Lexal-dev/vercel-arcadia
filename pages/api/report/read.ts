import { NextApiRequest, NextApiResponse } from 'next';
import Report from '@/models/report';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const rapports = await Report.findAll();
            if (!rapports || rapports.length === 0) {
                res.status(404).json({ success: false, message: "La liste des rapports" });
            } else {
                res.status(200).json({ success: true, message: "Liste des rapports chargé", rapports });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des raports", error);
            res.status(500).json({ success: false, message: "Échec de la synchronisation des rapports", error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}