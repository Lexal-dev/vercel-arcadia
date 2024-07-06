"use client";
import React, { useEffect, useState } from 'react';
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';
import FormUpdate from '@/components/api/animals/FormUpdate';
import FormCreate from '@/components/api/animals/FormCreate';

export default function AnimalsManager() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [selectedHabitatName, setSelectedHabitatName] = useState<string | null>(null); // State for selected habitat name
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showFormUpdate, setShowFormUpdate] = useState<boolean>(false); // State for update form visibility
  const [showFormCreate, setShowFormCreate] = useState<boolean>(false); // State for create form visibility

  useEffect(() => {
    fetchAnimals();
    fetchHabitats();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await fetch('/api/animals/read');
      const data = await response.json();
      if (data.success) {
        setAnimals(data.animals);
      } else {
        console.error('Failed to fetch animals:', data.message);
      }
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const fetchHabitats = async () => {
    try {
      const response = await fetch('/api/habitats/read');
      const data = await response.json();
      if (data.success) {
        setHabitats(data.habitats);
      } else {
        console.error('Failed to fetch habitats:', data.message);
      }
    } catch (error) {
      console.error('Error fetching habitats:', error);
    }
  };

  const handleHabitatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const habitatName = event.target.value;
    setSelectedHabitatName(habitatName !== "" ? habitatName : null);
  };

  const handleDeleteAnimal = async (id: number) => {
    try {
      const response = await fetch(`/api/animals/delete?id=${encodeURIComponent(id.toString())}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setAnimals(animals.filter(animal => animal.id !== id));
      } else {
        console.error('Error deleting animal:', data.message);
      }
    } catch (error) {
      console.error('Error deleting animal:', error);
    }
  };

  const handleUpdateSuccess = async () => {
    await fetchAnimals(); // Refresh animal list after update
    setShowFormUpdate(false); // Close update form after successful update
  };

  const handleCreateSuccess = async () => {
    await fetchAnimals(); // Refresh animal list after creation
    setShowFormCreate(false); // Close create form after successful creation
  };

  // Filter animals based on selected habitat name
  const filteredAnimals = selectedHabitatName
    ? animals.filter(animal => animal.habitatId.toString() === selectedHabitatName)
    : animals;

  return (
    <>
      <div className='w-full flex flex-col justify-center items-center py-4'>
        <select onChange={handleHabitatChange} className='text-black p-1 rounded-md bg-slate-300 h-[50px] w-[150px]'>
          <option value="">Tous les habitats</option>
          {habitats.map(habitat => (
            <option key={habitat.id} value={habitat.name}>
              {habitat.name}
            </option>
          ))}
        </select>
        {!showFormUpdate && (
          <button
            onClick={() => setShowFormCreate(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4 h-[50px] w-[150px]"
          >
            Créer Animal
          </button>
        )}
      </div>

      <div className='w-full'>
        <table className='min-w-full bg-white text-black shadow-md rounded-lg'>
          <thead className='bg-gray-200'>
            <tr>
              <th className='py-3 px-6 border-b text-left'>ID</th>
              <th className='py-3 px-6 border-b text-left'>Nom</th>
              <th className='py-3 px-6 border-b text-left'>Race</th>
              <th className='py-3 px-6 border-b text-left'>Habitat</th>
              <th className='py-3 px-6 border-b text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnimals.map(animal => (
              <tr key={animal.id} className='cursor-pointer hover:bg-gray-100'>
                <td className='py-3 px-6 border-b'>{animal.id}</td>
                <td className='py-3 px-6 border-b'>{animal.name}</td>
                <td className='py-3 px-6 border-b'>{animal.raceId}</td>
                <td className='py-3 px-6 border-b'>{animal.habitatId}</td>
                <td className='py-3 px-6 border-b flex'>
                  <button
                    className='bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded mx-1 w-1/2'
                    onClick={() => handleDeleteAnimal(animal.id)}
                  >
                    Supprimer
                  </button>
                  <button
                    className='bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mx-1 w-1/2'
                    onClick={() => {
                      setSelectedAnimal(animal);
                      setShowFormUpdate(true);
                    }}
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAnimal && showFormUpdate && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-lg z-50">
            <button
              onClick={() => setShowFormUpdate(false)}
              className="w-full text-end text-xl text-red-500 hover:text-red-600 hover:text-2xl"
            >
              X
            </button>
            <FormUpdate
              animal={selectedAnimal}
              onUpdateSuccess={handleUpdateSuccess}
              onClose={() => setShowFormUpdate(false)}
            />
          </div>
        </div>
      )}

      {showFormCreate && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-lg z-50">
            <button
              onClick={() => setShowFormCreate(false)}
              className="w-full text-end text-xl text-red-500 hover:text-red-600 hover:text-2xl"
            >
              X
            </button>
            <FormCreate onCreateSuccess={handleCreateSuccess} />
          </div>
        </div>
      )}
    </>
  );
}