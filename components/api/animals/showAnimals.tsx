"use client"
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';

export default function ShowAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [selectedHabitatName, setSelectedHabitatName] = useState<string | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/animals/read')
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          setAnimals(data.animals);
          setHabitats(data.habitats);
        } else {
          console.error('Failed to fetch data:', data.message);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleHabitatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const habitatName = event.target.value;
    setSelectedHabitatName(habitatName !== "" ? habitatName : null);
  };

  const handleAnimalId = async (animalId: number) => {
    const selected = animals.find(animal => animal.id === animalId);
    if (selected) {
      setSelectedAnimal(selected);
      setModal(true);
      await addOrUpdateConsultation(selected);
    }
  };

  const addOrUpdateConsultation = async (animal: Animal) => {
    const animalDocRef = doc(db, 'animals', animal.id.toString());

    try {
      const animalDocSnapshot = await getDoc(animalDocRef);

      if (animalDocSnapshot.exists()) {
        // L'animal existe, incrémenter le nombre de consultations
        await updateDoc(animalDocRef, {
          consultations: increment(1)
        });
      } else {
        // L'animal n'existe pas, créer un nouveau document avec consultations à 1
        await setDoc(animalDocRef, {
          animalName: animal.name,
          consultations: 1
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour ou de l\'ajout de la consultation :', error);
    }
  };

  const filteredAnimals = selectedHabitatName
    ? animals.filter(animal => animal.habitatId.toString() === selectedHabitatName)
    : animals;

  return (
    <>
      <select onChange={handleHabitatChange} className='text-black p-1 rounded-md bg-slate-300 mb-6'>
        <option value="">Sélectionnez un habitat</option>
        {habitats.map(habitat => (
          <option key={habitat.id} value={habitat.name}>
            {habitat.name}
          </option>
        ))}
      </select>
      <div className='w-full'>
        <div className='flex items-center items-center gap-3'>
          <h2 className='text-2xl font-bold mb-4'>Liste des animaux</h2>
          {selectedHabitatName ? (
            <p className='text-xl font-bold mb-4'>[{selectedHabitatName}]</p>
          ) : (
            <p className='text-xl font-bold mb-4'>[Complète]</p>
          )}
        </div>

        <ul className='flex flex-col gap-2'>
          {filteredAnimals.map(animal => (
            <li
              key={animal.id}
              value={animal.id}
              onClick={() => handleAnimalId(animal.id)}
              className='cursor-pointer hover:text-green-500'
            >
              {animal.name} : {animal.raceId}
            </li>
          ))}
        </ul>
      </div>

      {modal && selectedAnimal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg p-4 max-w-xl w-full text-black'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold mb-2'>Détails sur {selectedAnimal.name}</h2>
              <button onClick={() => setModal(false)} className='text-red-600 hover:text-red-700 text-xl hover:text-2xl'>
                X
              </button>
            </div>
            <p>Race: {selectedAnimal.raceId}</p>
            <p>État: {selectedAnimal.etat}</p>
            <p>Habitat: {selectedAnimal.habitatId}</p>
          </div>
        </div>
      )}
    </>
  );
}