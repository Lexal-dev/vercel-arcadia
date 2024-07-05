"use client"
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';
import Race from '@/models/race';
import React, { useState, useEffect } from 'react';

const HabitatsPage: React.FC = () => {
    const [habitats, setHabitats] = useState<Habitat[]>([]);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [races, setRaces] = useState<Race[]>([]);
    const [selectedHabitatId, setSelectedHabitatId] = useState<number | null>(null); // État pour l'habitat sélectionné
    const [animalsInSelectedHabitat, setAnimalsInSelectedHabitat] = useState<Animal[]>([]); // État pour les animaux dans l'habitat sélectionné
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

        // Mettre à jour l'habitat sélectionné et réinitialiser l'animal sélectionné
        setSelectedHabitatId(habitatId);
        setSelectedAnimal(null);

        // Mettre à jour la liste des animaux dans cet habitat
        setAnimalsInSelectedHabitat(animalsInHabitat);
    };

    const handleClickAnimal = (animal: Animal) => {
        // Mettre à jour l'animal sélectionné
        setSelectedAnimal(animal);
    };

    const closeModal = () => {
        setSelectedAnimal(null); // Fonction pour fermer la modal
    };

    return (
        <main className='flex flex-col items-center p-12'>
            <h2 className='text-4xl font-bold mb-12'>Habitats</h2>
            <section className='grid grid-cols-3 gap-6'>
                {habitats.map((habitat) => (
                    <div key={habitat.id} className='border-2 border-gray-200 p-4 rounded-md cursor-pointer' onClick={() => handleClickHabitat(habitat.id)}>
                        <p className='text-xl font-bold mb-2'>{habitat.name}</p>
                        <p className='text-md'>{habitat.description}</p>
                    </div>
                ))}
            </section>

            {/* Liste des animaux dans l'habitat sélectionné */}
            {selectedHabitatId && (
                <section className='mt-8'>
                    <h3 className='text-3xl font-bold mb-6 text-center'>Animaux dans cet habitat :</h3>
                    <div className='flex justify-around'>
                        {animalsInSelectedHabitat.map((animal) => (
                            <div key={animal.id} className='cursor-pointer' onClick={() => handleClickAnimal(animal)}>
                                <p className='text-xl font-bold mb-2 hover:text-green-400'>{animal.name}</p>
                                <p className='text-md'>{races.find((race) => race.id === animal.raceId)?.name}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Modal pour afficher les détails de l'animal sélectionné */}
            {selectedAnimal && (
                <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
                    <div className='flex flex-col justify-between bg-white p-6 rounded-lg w-[600px] h-[400px]'>
                        <p className='text-3xl text-black text-center font-bold mb-2'>{selectedAnimal.name}</p>
                        <div className='h-1/3 text-xl text-black tracking-wide leading-6'>
                            <p className='text-xl text-black'>Race: {races.find((race) => race.id === selectedAnimal.raceId)?.name}</p> {/* Afficher le nom de la race correspondante */}
                            <p className='text-xl text-black'>État: {selectedAnimal.etat}</p>
                        </div>
                        <button className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 mt-4 rounded-md' onClick={closeModal}>Fermer</button>
                    </div>
                </div>
            )}
        </main>
    );
};

export default HabitatsPage;