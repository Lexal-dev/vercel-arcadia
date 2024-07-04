"use client"
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';
import Race from '@/models/race';
import React, { useState, useEffect } from 'react';

const HabitatsPage: React.FC = () => {
    const [habitats, setHabitats] = useState<Habitat[]>([]);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [races, setRaces] = useState<Race[]>([]);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null); // État pour l'animal sélectionné

    useEffect(() => {
        const fetchHabitats = async () => {
            try {
                const response = await fetch('/api/habitats/read');
                if (!response.ok) {
                    throw new Error('Echec de la synchronisation des habitats');
                }

                const { success, habitats } = await response.json();
                if (success) {
                    setHabitats(habitats);
                } else {
                    console.error('Habitats non trouvés');
                }
            } catch (error) {
                console.error('Erreur dans la synchronisation des habitats:', error);
            }
        };

        fetchHabitats();
    }, []);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const response = await fetch('/api/animals/read');
                if (!response.ok) {
                    throw new Error('Echec de la synchronisation des animaux');
                }

                const { success, animals } = await response.json();
                if (success) {
                    setAnimals(animals);
                } else {
                    console.error('Animaux non trouvés');
                }
            } catch (error) {
                console.error('Erreur dans la synchronisation des animaux:', error);
            }
        };

        fetchAnimals();
    }, []);

    useEffect(() => {
        const fetchRaces = async () => {
            try {
                const response = await fetch('/api/races/read');
                if (!response.ok) {
                    throw new Error('Echec de la synchronisation des races');
                }

                const { success, races } = await response.json();
                if (success) {
                    setRaces(races);
                } else {
                    console.error('Races non trouvées');
                }
            } catch (error) {
                console.error('Erreur dans la synchronisation des races:', error);
            }
        };

        fetchRaces();
    }, []);

    const handleClickHabitat = (habitatId: number) => {
        // Filtrer les animaux par habitatId
        const animalsInHabitat = animals.filter((animal) => animal.habitatId === habitatId);

        // Sélectionner le premier animal trouvé dans cet habitat pour affichage
        if (animalsInHabitat.length > 0) {
            setSelectedAnimal(animalsInHabitat[0]); // Sélectionner le premier animal
        } else {
            setSelectedAnimal(null); // Réinitialiser l'état si aucun animal trouvé
        }
    };

    const closeModal = () => {
        setSelectedAnimal(null); // Fonction pour fermer la modal
    };

    return (
        <main className='flex flex-col items-center p-12'>
            <h2 className='text-4xl font-bold mb-12'>-- Habitats --</h2>
            <section className='grid grid-cols-3 gap-6'>
                {habitats.map((habitat) => (
                    <div key={habitat.id} className='border-2 border-gray-200 p-4 rounded-md cursor-pointer' onClick={() => handleClickHabitat(habitat.id)}>
                        <p className='text-xl font-bold mb-2'>{habitat.name}</p>
                        <p className='text-md'>{habitat.description}</p>
                    </div>
                ))}
            </section>

            {/* Modal pour afficher les détails de l'animal */}
            {selectedAnimal && (
                <div className='fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-slate-400 p-4 rounded-md'>
                        <p className='text-xl font-bold mb-2'>{selectedAnimal.name}</p>
                        <p className='text-md'>Race: {races.find((race) => race.id === selectedAnimal.raceId)?.name}</p> {/* Afficher le nom de la race correspondante */}
                        <p className='text-md'>État: {selectedAnimal.etat}</p>
                        <button className='mt-4 bg-red-400 px-4 py-2 rounded-md' onClick={closeModal}>Fermer</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default HabitatsPage;