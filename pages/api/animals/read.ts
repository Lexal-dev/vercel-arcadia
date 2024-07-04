import { NextApiRequest, NextApiResponse } from 'next';
import Animal from '@/lib/models/animal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        try {
            const animal = await Animal.findAll();
            if (!animal) {
                res.status(404).json({ success: false, message: "La liste des animaux n'a pas été trouvé" });
            } else {
                res.status(200).json({ success: true, message:"Liste des animaux chargée", animal });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des animaux:', error);
            res.status(500).json({ success: false, message: 'echec de la synchronisation des animaux.', error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}