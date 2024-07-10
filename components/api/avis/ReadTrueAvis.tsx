"use client"
import React, { useEffect, useState } from 'react';
import Avis from '@/models/avis';

const AvisList: React.FC = () => {
  const [avisList, setAvisList] = useState<Avis[]>([]);

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const response = await fetch('/api/avis/read?additionalParam=avis');
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

  // Fonction pour générer des index aléatoires
  const generateRandomIndexes = (max: number, count: number): number[] => {
    const indexes: number[] = [];
    while (indexes.length < count && indexes.length < max) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indexes.includes(randomIndex)) {
        indexes.push(randomIndex);
      }
    }
    return indexes;
  };

  return (
    <div className="avis-list border-2 p-4 rounded-md bg-muted">
      {avisList.length > 0 ? (
        <ul className="flex flex-wrap justify-center h-[500px] gap-4 overflow-y-auto">
          {generateRandomIndexes(avisList.length, 20).map((index) => (
            <li key={avisList[index].id} className="border border-slate-200 p-2 rounded-lg bg-muted-foreground w-[350px]">
              <div className="flex items-center gap-2 mb-12 pt-2">
                <p className="text-sm font-bold">Pseudo:</p>
                <p className="text-xl">{avisList[index].pseudo}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold">Commentaire:</p>
                <p className="text-md">{avisList[index].comment}</p>
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