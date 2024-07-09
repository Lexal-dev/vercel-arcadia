import type { NextApiRequest, NextApiResponse } from 'next';
import Animal from '@/models/animal';
import sequelizeInstance from '@/lib/sequelize';

// Initialisation de Sequelize si nécessaire (optionnel)
(async () => {
    await sequelizeInstance.sync(); // Synchronisation avec la base de données
})();

type Data = {
    message: string;
    animal?: Animal;
} | {
    error: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'PUT') {
        const { id, imageUrl } = req.body;

        if (typeof id !== 'number' || !Array.isArray(imageUrl) || !imageUrl.every(url => typeof url === 'string')) {
            res.status(400).json({ error: 'Invalid input' });
            return;
        }

        try {
            const animal = await Animal.findByPk(id);

            if (!animal) {
                res.status(404).json({ error: 'Animal not found' });
                return;
            }

            animal.imageUrl = imageUrl;
            await animal.save();

            res.status(200).json({ message: 'Image URLs updated successfully.', animal });
        } catch (error) {
            console.error('Error updating image URLs:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}