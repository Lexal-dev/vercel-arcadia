import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import User from '@/models/user';
import { comparePasswords } from '@/lib/passwordUtils';

// Assurez-vous d'avoir configuré votre dotenv correctement
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
}

// Fonction pour générer un token JWT
const generateToken = (userId: string) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' }); // Vous pouvez ajuster l'expiration selon vos besoins
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            // Vérifier si l'utilisateur existe dans la base de données
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ success: false, message: 'Adresse email ou mot de passe incorrect.' });
            }

            // Vérifier si le mot de passe est correct en utilisant comparePasswords
            const isPasswordValid = await comparePasswords(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Adresse email ou mot de passe incorrect.' });
            }

            // Générer un token JWT valide
            const userIdAsString = user.id.toString();
            const token = generateToken(userIdAsString);

            // Vous pouvez ajouter d'autres informations utilisateur à la réponse si nécessaire
            const userData = {
                id: user.id,
                email: user.email,
                role: user.role,
            };

            // Répondre avec le token JWT et les informations utilisateur
            return res.status(200).json({ success: true, token, user: userData });
        } catch (error) {
            console.error('Erreur lors de l\'authentification :', error);
            return res.status(500).json({ success: false, message: 'Erreur serveur. Veuillez réessayer plus tard.', error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}