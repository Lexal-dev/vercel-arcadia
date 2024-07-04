import { NextApiRequest, NextApiResponse } from 'next';
import sequelizeInstance from "@/lib/sequelize"; // Ajustez le chemin selon la structure de votre projet

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await sequelizeInstance.authenticate();
        res.status(200).json({ success: true, message: 'Connection has been established successfully.' });
    } catch (error) {

        if (error instanceof Error) {
            res.status(500).json({ success: false, message: 'Unable to connect to the database.', error: error.message });
        } else {
            res.status(500).json({ success: false, message: 'Unable to connect to the database.', error: String(error) });
        }
    }
}