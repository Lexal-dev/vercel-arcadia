"use client"
import React, { useEffect, useState } from 'react';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';
import { TbHandFinger } from "react-icons/tb";

export default function ShowAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [selectedHabitatName, setSelectedHabitatName] = useState<string | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [modal, setModal] = useState<boolean>(false);

  const fetchAnimals = async (additionalParam: string | number) => { 
    fetch(`/api/animals/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`)
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
  };

  useEffect(() => {
    fetchAnimals('animals');
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

  // Récupérer l'habitat sélectionné
  const selectedHabitat = habitats.find(habitat => habitat.name === selectedHabitatName);

  // URL de l'image de remplacement
  const defaultImageUrl = '/images/Tiger.png';

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
      {selectedHabitat && selectedHabitat.imageUrl && selectedHabitat.imageUrl.length > 0 && (
        <div className="w-full flex justify-center mb-4">
          <img src={selectedHabitat.imageUrl[0]} alt={selectedHabitat.name} className="w-[500px] h-auto rounded-md border-2 border-green-100" />
        </div>
      )}
      <div className='flex flex-col md:w-2/3 items-start text-start'>
        <div className=''>
          <h2 className='text-3xl font-bold mb-4'>Liste des animaux</h2>
          {selectedHabitatName ? (
            <p className='text-2xl font-bold mb-4'>[{selectedHabitatName}]</p>
          ) : (
            <p className='text-2xl font-bold mb-4'>[Complète]</p>
          )}
        </div>

        <ul className='flex flex-col gap-2'>
          {filteredAnimals.map(animal => (
            <li
              key={animal.id}
              value={animal.id}
              onClick={() => handleAnimalId(animal.id)}
              className='flex gap-2 items-center text-lg cursor-pointer hover:text-green-500'
            >
              <TbHandFinger /> {animal.name} : {animal.raceId}
            </li>
          ))}
        </ul>
      </div>

      {modal && selectedAnimal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='flex flex-col items-center bg-foreground text-secondary rounded-lg p-4 max-w-xl w-full text-black'>
            <div 
              className='h-[250px] w-full rounded-lg' 
              style={{ 
                backgroundImage: `url(${selectedAnimal.imageUrl && selectedAnimal.imageUrl.length > 0 ? selectedAnimal.imageUrl[0] : defaultImageUrl})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }}
            ></div>
            <h2 className='text-xl font-semibold mb-4 text-start w-full'>Détails sur {selectedAnimal.name}</h2>
            <div className='flex flex-col w-1/3 items-start justify-center'>
              <p>Race: {selectedAnimal.raceId}</p>
              <p>État: {selectedAnimal.etat}</p>
              <p>Habitat: {selectedAnimal.habitatId}</p>
            </div>

            <button className='w-full bg-muted hover:bg-muted-foreground text-white px-4 py-2 mt-4 rounded-md' onClick={() => setModal(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
}