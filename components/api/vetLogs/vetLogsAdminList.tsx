"use client"
import React, { useEffect, useState } from 'react';
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';
import VetLog from '@/models/vetLogs';
import { TbHandFinger } from "react-icons/tb";
export default function VetLogsAdminList() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [vetLogs, setVetLogs] = useState<VetLog[]>([]);
  const [selectedHabitatName, setSelectedHabitatName] = useState<string | null>(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

    const fetchAnimals = async (additionalParam: string | number) => {
      fetch(`/api/animals/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.success) {
            setAnimals(data.animals);
            setHabitats(data.habitats);
            setVetLogs(data.vetLogs);
          } else {
            console.error('Failed to fetch data:', data.message);
          }
        })
        .catch(error => console.error('Error fetching data:', error));      
    }

  useEffect(() => {fetchAnimals('animals')}, []);

  const handleHabitatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const habitatName = event.target.value;
    setSelectedHabitatName(habitatName ? habitatName : null);
    setSelectedAnimalId(null);
    setSelectedAnimal(null);
  };

  const handleAnimalClick = (animalId: number) => {
    const selected = animals.find(animal => animal.id === animalId);
    if (selected) {
      setSelectedAnimal(selected);
      setSelectedAnimalId(animalId);
    }
  };

  const formatDateTime = (dateTime: Date | string | undefined): string => {
    if (!dateTime) return '';

    const date = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  };

  const handleDateFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateFilter = event.target.value;
    setSelectedDateFilter(dateFilter);
  };

  const filteredAnimals = selectedHabitatName
  ? animals.filter(animal => animal.habitatId.toString() === selectedHabitatName)
  : animals;

useEffect(() => {
  console.log("filteredAnimals:", filteredAnimals);
  console.log("selectedHabitatName:", selectedHabitatName);
}, [filteredAnimals, selectedHabitatName]);


  const filteredVetLogs = vetLogs
    .filter(vetLog => !selectedAnimalId || vetLog.animalId === selectedAnimalId)
    .filter(vetLog => !selectedDateFilter || new Date(vetLog.createdAt) >= new Date(selectedDateFilter))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());



    const getAnimalNameById = (id:number) => {
      const animal = animals.find(animal => animal.id === id);
      return animal ? animal.name : null;
    };
  return (
    <div className=''>
      <h1 className="text-3xl font-bold mb-12 text-center">Consultations Vétérinaires</h1>
      <div className="w-full flex flex-col md:flex-row gap-x-6">
        <div className="w-full flex flex-col items-center md:items-start mb-6  md:mb-0 items-start md:w-1/4">
          <div className="flex flex-col items-start">
            <h2 className="text-xl font-bold mb-2">Liste des Animaux</h2>
            <select
              onChange={handleHabitatChange}
              className="p-2 border rounded-md bg-gray-100 shadow-md text-secondary mb-2">
              <option value="">Sélectionnez un habitat</option>
              {habitats.map(habitat => (
                <option key={habitat.id} value={habitat.name}>
                  {habitat.name}
                </option>
              ))}
            </select>
          </div> 

          <ul>
            {filteredAnimals.map(animal => (
              <li
                key={animal.id}
                onClick={() => handleAnimalClick(animal.id)}
                className="cursor-pointer p-2 hover:bg-muted rounded-md hover:text-green-200">
                <div className='flex gap-2 items-center'>
                  <p>
                    {animal.name} - {animal.raceId} 
                  </p>
                   <TbHandFinger size={20}/>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-3/4">
          
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">Détails des Consultations</h2>
            <input
              type="date"
              className="p-2 border rounded-md bg-gray-100 shadow-md mb-2"
              onChange={handleDateFilterChange}
            />
          </div>
          <div className="overflow-y-auto max-h-96 bg-foreground text-secondary rounded-md p-4 shadow-mdk">
            {filteredVetLogs.length === 0 ? (
              <p>Aucune consultation trouvée.</p>
            ) : (
              <ul>
                {filteredVetLogs.map(vetLog => (
                  <li key={vetLog.id} className="py-2">
                    <p className="text-lg font-bold mb-1">{selectedAnimal ? selectedAnimal?.name : getAnimalNameById(vetLog.animalId)}</p>
                    <p>Santé: {vetLog.animalState}</p>
                    <p>Nourriture donnée: {vetLog.foodOffered}</p>
                    <p>Quantité: {vetLog.foodWeight}g</p>
                    <p>Date: {formatDateTime(vetLog.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}