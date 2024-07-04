import { NextApiRequest, NextApiResponse } from 'next';
import Animal from '@/lib/models/animal'; 

export default async function createAnimal(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Synchroniser le modèle avec la base de données
            await Animal.sync({ alter: true });

            const { name, etat } = req.body;

            if (!name || !etat) {
                res.status(400).json({ success: false, message: 'Name and etat are required.' });
                return;
            }

            const newAnimal = await Animal.create({ name, etat });

            res.status(200).json({ success: true, message: 'Animal created successfully.', animal: newAnimal });
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ success: false, message: 'Failed to create animal.', error: String(error) });                
            }       
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}