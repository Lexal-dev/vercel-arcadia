"use client"
import FormUpdate from '@/components/api/animals/FormUpdate';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Animal {
    id: number;
    name: string;
    etat: string;
}

export default function AnimalPage() {
    const [animal, setAnimal] = useState<Animal | null>(null);
    const path = usePathname();

    useEffect(() => {
        if (path) {
            const parts = path.split('/');
            const id = parts[parts.length - 1]; // Dernier segment de l'URL, supposé être l'ID

            const fetchAnimal = async () => {
                try {
                    const response = await fetch(`/api/animals/readId?id=${id}`)
                    if (!response.ok) {
                        throw new Error('Failed to fetch animal');
                    }

                    const { success, animal } = await response.json();
                    if (success) {
                        setAnimal(animal);
                    } else {
                        console.error('Animal not found');
                    }
                } catch (error) {
                    console.error('Error fetching animal:', error);
                }
            };

            fetchAnimal();
        }
    }, [path]);

    return (
        <main className='flex flex-col items-center w-full p-12'>
            {animal ? (
                <div className='p-4 border-2 border-slate-300 rounded-md'>
                    <p>Animal ID: {animal.id}</p>
                    <p>Name: {animal.name}</p>
                    <p>etat: {animal.etat}</p>
                    <div>
                        <FormUpdate animalId={animal.id} animalName={animal.name} animalEtat={animal.etat} />                    
                    </div>

                </div>
            ) : (
                <p>Loading...</p>
            )}
        </main>
    );
};