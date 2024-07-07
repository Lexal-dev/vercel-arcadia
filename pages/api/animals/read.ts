import { NextApiRequest, NextApiResponse } from 'next';
import Animal from '@/models/animal';
import Race from '@/models/race';
import Report from '@/models/report';
import Habitat from '@/models/habitat';
import VetLog from '@/models/vetLogs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const animals = await Animal.findAll({});
            const races = await Race.findAll({});
            const reports = await Report.findAll({});
            const vetLogs = await VetLog.findAll({});
            const habitats = await Habitat.findAll({});

            if (!animals || !races || !reports || !habitats || !vetLogs) {
                res.status(404).json({ success: false, message: "La liste des animaux, des races, des rapports ou des habitats n'a pas été trouvée" });
            } else {
                const animalsWithDetails = animals.map(animal => {
                    const race = races.find(race => race.id === animal.raceId);
                    const habitat = habitats.find(habitat => habitat.id === animal.habitatId);
                    


                    return {
                        ...animal.toJSON(),
                        raceId: race ? race.name : 'N/A', // Remplace raceId par le nom de la race
                        habitatId: habitat ? habitat.name : 'N/A', // Remplace habitatId par le nom de l'habitat   

                    };
                });

                res.status(200).json({ success: true, message: "Liste des animaux chargée", animals: animalsWithDetails, races, habitats, reports, vetLogs });
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des animaux:', error);
            res.status(500).json({ success: false, message: 'Échec de la synchronisation des animaux.', error: String(error) });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Méthode ${req.method} non autorisée`);
    }
}