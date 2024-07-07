"use client"
import React, { useEffect, useState } from 'react';
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';
import VetLog from '@/models/vetLogs';

export default function VetLogsAdminList() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [vetLogs, setVetLogs] = useState<VetLog[]>([]);
  const [selectedHabitatName, setSelectedHabitatName] = useState<string | null>(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/animals/read')
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
  }, []);

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

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-4 text-center">Consultations Vétérinaires</h1>

      <div className="flex gap-4 mb-4 justify-center text-black">
        <select
          onChange={handleHabitatChange}
          className="p-2 border rounded-md bg-gray-100 shadow-md">
          <option value="">Sélectionnez un habitat</option>
          {habitats.map(habitat => (
            <option key={habitat.id} value={habitat.name}>
              {habitat.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="p-2 border rounded-md bg-gray-100 shadow-md"
          onChange={handleDateFilterChange}
        />
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <h2 className="text-xl font-bold mb-2">Liste des Animaux</h2>
          <ul className="divide-y divide-gray-200">
            {filteredAnimals.map(animal => (
              <li
                key={animal.id}
                onClick={() => handleAnimalClick(animal.id)}
                className="cursor-pointer py-2 hover:bg-gray-50">
                {animal.name} - {animal.raceId}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2">
          <h2 className="text-xl font-bold mb-2">Détails des Consultations</h2>
          <div className="overflow-y-auto max-h-96 bg-gray-100 rounded-md p-4 shadow-md text-black">
            {filteredVetLogs.length === 0 ? (
              <p>Aucune consultation trouvée.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredVetLogs.map(vetLog => (
                  <li key={vetLog.id} className="py-2">
                    <p className="text-lg font-bold mb-1">{selectedAnimal ? selectedAnimal?.name : vetLog.animalId}</p>
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