import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/user';
import { hashPassword } from '@/lib/passwordUtils'; // Assurez-vous d'avoir cette fonction de hachage

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Tous les champs sont requis.' });
        }

        try {
            // Vérifiez si l'utilisateur existe déjà
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'L\'email est déjà utilisé.' });
            }

            // Hachez le mot de passe avant de le stocker
            const hashedPassword = await hashPassword(password);

            // Créez un nouvel utilisateur
            const newUser = await User.create({ email, password: hashedPassword, role });

            return res.status(201).json({ success: true, message: 'Utilisateur créé avec succès.', user: newUser });
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error);
            return res.status(500).json({ success: false, message: 'Erreur serveur. Veuillez réessayer plus tard.', error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}