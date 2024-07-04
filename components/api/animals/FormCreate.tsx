"use client";
import React, { useState, useEffect } from 'react';

interface Race {
    id: number;
    name: string;
}

export default function FormCreate() {
    const [name, setName] = useState('');
    const [etat, setEtat] = useState('');
    const [message, setMessage] = useState('');
    const [races, setRaces] = useState<Race[]>([]); // Définir le type des races comme un tableau d'objets Race
    const [selectedRace, setSelectedRace] = useState<number | undefined>(undefined); // Utiliser number ou undefined pour le selectedRace

    useEffect(() => {
        const fetchRaces = async () => {
            try {
                const res = await fetch('/api/races/read');
                const data = await res.json();
                setRaces(data.races); // Assurez-vous que votre API renvoie un objet avec une propriété races contenant le tableau de races
            } catch (error) {
                console.error('Erreur lors de la récupération des races:', error);
            }
        };

        fetchRaces();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/animals/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, etat, raceId: selectedRace }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage(`L'animal : ${data.animal.name} a bien été ajouté`);
                setName('');
                setEtat('');
                setSelectedRace(undefined);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
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
                </div>

                <button type="submit" className='bg-green-200 hover:bg-green-300 border-2 border-green-300 p-2 text-green-700'>Ajouter un animal</button>
                {message && <p className='text-green-600'>{message}</p>}        
            </form>
        </>
    );
}