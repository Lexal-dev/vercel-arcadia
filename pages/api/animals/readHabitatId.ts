import { NextApiRequest, NextApiResponse } from 'next';
import Animal from '@/models/animal';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { habitatId } = req.query;

  if (!habitatId || isNaN(Number(habitatId))) {
    return res.status(400).json({ success: false, message: 'Invalid habitatId' });
  }

  try {
    const animals = await Animal.findAll({
      where: {
        habitatId: Number(habitatId),
      },
    });

    res.status(200).json({ success: true, animals });
  } catch (error: any) {
    console.error('Error fetching animals by habitatId:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch animals by habitatId', error: error.message });
  }
};