"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Animal {
  id: number;
  name: string;
  etat: string;
}

export default function ListAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    fetch('/api/animals/read')
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          setAnimals(data.animal); // Assurez-vous que le nom du tableau correspond à celui de l'API
          console.log(data.message); // Affiche le message de succès de l'API dans la console
        } else {
          console.error('Failed to fetch animals:', data.message);
        }
      })
      .catch(error => console.error('Error fetching animals:', error));
  }, []);

  return (
    <>
      <ul className='flex flex-col gap-6 text-xl'>
        {animals.map(animal => (
            <li key={animal.id} className='border-2 border-slate-300 p-2 rounded-md'>
                <p>nom: {animal.name}</p>
                <p>etat: {animal.etat}</p>
                <Link href={`/animals/${animal.id}` }>Détails</Link>
            </li>
        ))}
      </ul>
    </>
  );
}