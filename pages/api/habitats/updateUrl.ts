import type { NextApiRequest, NextApiResponse } from 'next';
import Habitat from '@/models/habitat';
import sequelizeInstance from '@/lib/sequelize';

// Initialisation de Sequelize si nécessaire (optionnel)
(async () => {
    await sequelizeInstance.sync();
})();

type Data = {
    message: string;
    habitat?: Habitat;
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
            const habitat = await Habitat.findByPk(id);

            if (!habitat) {
                res.status(404).json({ error: 'Habitat not found' });
                return;
            }

            habitat.imageUrl = imageUrl;
            await habitat.save();

            res.status(200).json({ message: 'Image URLs updated successfully.', habitat });
        } catch (error) {
            console.error('Error updating image URLs:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}