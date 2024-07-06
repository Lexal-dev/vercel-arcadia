"use client"
import React, { useEffect, useState } from 'react';
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';
import Report from '@/models/report';

export default function ListAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedHabitatName, setSelectedHabitatName] = useState<string | null>(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null); 
  const [choiceHabitat, setchoiceHabitat] = useState<boolean>(true);
  const [modal, setModal] =  useState<boolean>(false);

  useEffect(() => {
    fetch('/api/animals/read')
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          setAnimals(data.animals);
          setHabitats(data.habitats);
          setReports(data.reports);
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

  const handleAnimalId = (animalId: number) => {
    const selected = animals.find(animal => animal.id === animalId);
    if (selected) {
      setSelectedAnimal(selected); // Stocker l'animal sélectionné
      setSelectedAnimalId(animalId);
      setModal(true);
    }
  };
  // Filter animals based on selected habitat
  const filteredAnimals = selectedHabitatName
    ? animals.filter(animal => animal.habitatId.toString() === selectedHabitatName)
    : animals;

  // Filter reports based on selected animal ID
  const filteredReport = selectedAnimalId
    ? reports.filter(report => report.animalId === selectedAnimalId)
    : [];

    function formatDateTime(dateTime: Date | string | undefined): string {
      if (!dateTime) return ''; // Gérer le cas où dateTime est indéfini ou nul
  
      const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
  
      return `${day}/${month}/${year} à ${hours}:${minutes}`;
  }

  useEffect(() => {
    if(selectedHabitatName === "" || selectedHabitatName === null){
      setchoiceHabitat(true)
    } else {
      setchoiceHabitat(false)
    }
  }, [selectedHabitatName])
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
          <h2 className='text-2xl font-bold mb-4'>liste des animaux </h2> 
          {choiceHabitat ? (<p className='text-xl font-bold mb-4'> [Complète]:</p>) : (<p className='text-xl font-bold mb-4'> [{selectedHabitatName}]:</p>)}                   
        </div>
       
        <ul className='flex flex-col gap-2'>
        {filteredAnimals.map(animal => (
          <li key={animal.id} value={animal.id} onClick={() => handleAnimalId(animal.id)} className='cursor-pointer hover:text-green-500'>
            {animal.name} : {animal.raceId}
          </li>
        ))}
        </ul>        
      </div>

      {modal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg p-4 max-w-xl w-full text-black'>
            <div className='flex justify-between items-center'>
              <h2 className='text-xl font-semibold mb-2'>Détails du rapport pour {selectedAnimal?.name}</h2>
              <button onClick={() => {setModal(false)}} className='text-red-600 hover:text-red-700 text-xl hover:text-2xl'>X</button>
            </div>
            
            <ul>
              {filteredReport.map(report => (
                <li key={report.id} className='mb-2 border-b-2 pb-2'>
                  <p>Nourriture donnée : {report.food}</p>
                  <p>quantitée donnée : {report.quantity}g</p>
                  <p>Date : {formatDateTime(report.createdAt)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}