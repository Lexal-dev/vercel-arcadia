import { NextApiRequest, NextApiResponse } from 'next';
import User from '@/models/user'; // Assurez-vous d'importer votre modèle User correctement
import { hashPassword } from '@/lib/passwordUtils'; // Importez la fonction hashPassword depuis votre utilitaire passwordUtils

interface UpdateBody {
  email: string;
  role: string;
  password?: string; // Ajoutez la possibilité de mettre à jour le mot de passe
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id } = req.query as { id: string }; // Assurez-vous que id est de type string
    const { email, role, password } = req.body as UpdateBody; // Assurez-vous que req.body est de type UpdateBody

    try {
      // Vérifier si l'utilisateur existe
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
      }

      // Mettre à jour les attributs de l'utilisateur
      user.email = email;
      user.role = role;

      // Si un nouveau mot de passe est fourni, le mettre à jour et le hasher
      if (password) {
        await user.setPassword(password); // Utilisez la méthode setPassword du modèle User pour hacher le mot de passe
      }

      // Sauvegarder les modifications
      await user.save();

      return res.status(200).json({ success: true, message: 'Utilisateur mis à jour avec succès.', user });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
      return res.status(500).json({ success: false, message: 'Erreur serveur. Veuillez réessayer plus tard.', error: String(error) });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}