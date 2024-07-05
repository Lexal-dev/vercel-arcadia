"use client"
import Avis from '@/models/avis';
import { useEffect, useState } from 'react';

const AvisList: React.FC = () => {
    const [avisList, setAvisList] = useState<Avis[]>([]);
    const [randomAvis, setRandomAvis] = useState<Avis[]>([]);

    useEffect(() => {
        const fetchAvis = async () => {
            try {
                const response = await fetch('/api/avis/read'); // Assurez-vous que l'API est correctement exposée à cette URL
                if (!response.ok) {
                    throw new Error('Failed to fetch avis');
                }
                const data = await response.json();
                if (data.success) {
                    const avis = data.avis.filter((avis: Avis) => avis.isValid === true);
                    setAvisList(avis);
                } else {
                    throw new Error(data.message || 'Failed to fetch avis');
                }
            } catch (error) {
                console.error('Error fetching avis:', error);
            }
        };

        fetchAvis();
    }, []);

    useEffect(() => {
        if (avisList.length > 0) {
            const randomIndexes = generateRandomIndexes(avisList.length, 5);
            const randomAvisList = randomIndexes.map(index => avisList[index]);
            setRandomAvis(randomAvisList);
        }
    }, [avisList]);

    // Fonction pour générer des index aléatoires
    const generateRandomIndexes = (max: number, count: number): number[] => {
        const indexes: number[] = [];
        while (indexes.length < count) {
            const randomIndex = Math.floor(Math.random() * max);
            if (!indexes.includes(randomIndex)) {
                indexes.push(randomIndex);
            }
        }
        return indexes;
    };

    return (
        <div className="avis-list border-2 p-4 rounded-md">
            {randomAvis.length > 0 ? (
                <ul className='flex flex-wrap justify-around gap-4'>
                    {randomAvis.map((avis) => (
                        <li key={avis.id} className='border border-slate-200 p-2 rounded-lg max-w-[350px] bg-slate-500'>
                            <div className='flex gap-2 mb-4'>
                                <p className='text-lg font-bold'>Pseudo:</p>
                                <p className='text-md '>{avis.pseudo}</p>
                            </div>
                            <div className='flex flex-col gap-2'>
                                <p className='text-lg font-bold'>Commentaire:</p>
                                <p className='text-md'>{avis.comment}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun avis validé trouvé.</p>
            )}
        </div>
    );
};

export default AvisList;