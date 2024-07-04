"use client";
import React, { useState, useEffect } from 'react';

interface Race {
    id: number;
    name: string;
}
interface Habitat {
    id: number;
    name: string;
}

export default function FormCreate() {
    const [name, setName] = useState('');
    const [etat, setEtat] = useState('');
    const [message, setMessage] = useState('');
    const [races, setRaces] = useState<Race[]>([]);
    const [habitats, setHabitats] = useState<Habitat[]>([]);
    const [selectedRace, setSelectedRace] = useState<number | undefined>(undefined);
    const [selectedHabitat, setSelectedHabitat] = useState<number | undefined>(undefined);

    useEffect(() => {
        const fetchRaces = async () => {
            try {
                const res = await fetch('/api/races/read');
                const data = await res.json();
                setRaces(data.races);
            } catch (error) {
                console.error('Erreur lors de la récupération des races:', error);
            }
        };

        const fetchHabitats = async () => {
            try {
                const res = await fetch('/api/habitats/read');
                const data = await res.json();
                setHabitats(data.habitats);
            } catch (error) {
                console.error('Erreur lors de la récupération des habitats:', error);
            }
        };

        fetchRaces();
        fetchHabitats();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/animals/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, etat, raceId: selectedRace, habitatId: selectedHabitat }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(`L'animal : ${data.animal.name} a bien été ajouté`);
                setName('');
                setEtat('');
                setSelectedRace(undefined);
                setSelectedHabitat(undefined);
            } else {
                setMessage(data.message || 'Une erreur est survenue lors de la création de l\'animal');
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'animal:', error);
            setMessage("Un problème est survenu lors de la création de l'animal");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className='flex flex-col w-[400px] items-center justify-around gap-4 bg-slate-300 rounded-md text-black p-6'>
                <div className='flex flex-col gap-6'>
                    <div className='flex justify-between w-full'>
                        <label>Nom:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            minLength={3}
                            maxLength={50}
                        />
                    </div>
                    <div className='flex justify-between w-full'>
                        <label>État:</label>
                        <input
                            type="text"
                            value={etat}
                            onChange={(e) => setEtat(e.target.value)}
                            required
                            minLength={3}
                            maxLength={100}
                        />
                    </div>
                    <div className='flex justify-between w-full'>
                        <label>Race:</label>
                        <select
                            value={selectedRace ?? ''}
                            onChange={(e) => setSelectedRace(parseInt(e.target.value))}
                            required
                        >
                            <option value='' disabled>Sélectionner une race</option>
                            {races.map((race) => (
                                <option key={race.id} value={race.id}>{race.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex justify-between w-full'>
                        <label>Habitat:</label>
                        <select
                            value={selectedHabitat ?? ''}
                            onChange={(e) => setSelectedHabitat(parseInt(e.target.value))}
                            required
                        >
                            <option value='' disabled>Sélectionner un habitat</option>
                            {habitats.map((habitat) => (
                                <option key={habitat.id} value={habitat.id}>{habitat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button type="submit" className='bg-green-200 hover:bg-green-300 border-2 border-green-300 p-2 text-green-700'>Ajouter un animal</button>
                {message && <p className='text-green-600'>{message}</p>}        
            </form>
        </>
    );
}