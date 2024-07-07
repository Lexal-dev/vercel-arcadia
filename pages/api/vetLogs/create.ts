import { NextApiRequest, NextApiResponse } from 'next';
import VetLog from '@/models/vetLogs'; // Assurez-vous d'importer votre modèle VetLog

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { animalId, animalState, foodOffered, foodWeight } = req.body; // Récupérer les données depuis le corps de la requête

      // Validez les données si nécessaire (ex: vérifier que animalId existe, etc.)
      if (!animalId || !animalState || !foodOffered || !foodWeight) {
        return res.status(400).json({ success: false, message: 'Veuillez fournir tous les champs nécessaires.' });
      }

      // Créez un nouveau vetLog dans la base de données
      const newVetLog = await VetLog.create({
        animalId,
        animalState,
        foodOffered,
        foodWeight,
        createdAt: new Date(), // Vous pouvez ajuster la date ici si nécessaire
      });

      res.status(201).json({ success: true, message: 'VetLog créé avec succès.', vetLog: newVetLog });
    } catch (error) {
      console.error('Erreur lors de la création du vetLog:', error);
      res.status(500).json({ success: false, message: 'Échec de la création du vetLog.', error: String(error) });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}