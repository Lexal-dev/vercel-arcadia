import { NextApiRequest, NextApiResponse } from 'next';
import Habitat from '@/models/habitat';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { id } = req.query as { id: string };

        try {
            const habitat = await Habitat.findByPk(id);

            if (!habitat) {
                return res.status(404).json({ success: false, message: 'Habitat not found.' });
            }

            await habitat.destroy();

            return res.status(200).json({ success: true, message: 'Habitat deleted successfully.' });
        } catch (error) {
            console.error('Error deleting habitat:', error);
            return res.status(500).json({ success: false, message: 'Server error. Please try again later.', error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).end(`Method ${req.method} not allowed.`);
    }
}