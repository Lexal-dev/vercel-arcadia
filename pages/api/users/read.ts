import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const users = await User.findAll({ order: [['id', 'ASC']] });
            if (!users || users.length === 0) {
                res.status(404).json({ success: false, message: "La liste des utilisateurs n'a pas été trouvée" });
            } else {
                res.status(200).json({ success: true, message: "Liste d'utilisateur chargée", users });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs", error);
            res.status(500).json({ success: false, message: "Échec de la synchronisation des utilisateurs", error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}