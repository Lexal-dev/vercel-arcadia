
"use client";
import React, { useEffect, useState } from 'react';
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';

export default function AnimalsManager() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [selectedHabitatName, setSelectedHabitatName] = useState<string | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showFormUpdate, setShowFormUpdate] = useState<boolean>(false);
  const [showFormCreate, setShowFormCreate] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false); // State for modal visibility
  const [food, setFood] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

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

  const openModal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFood('');
    setQuantity(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAnimal) {
      alert('Animal non sélectionné.');
      return;
    }

    const createdAt = new Date().toISOString();

    try {
      const response = await fetch('/api/report/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          food,
          quantity,
          createdAt,
          animalId: selectedAnimal.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Consommation de nourriture ajoutée avec succès.');
        closeModal();
      } else {
        console.error('Error adding food consumption:', data.message);
      }
    } catch (error) {
      console.error('Error adding food consumption:', error);
    }
  };

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
                <td className='py-3 px-6 border-b flex justify-center'>
                  <button
                    onClick={() => openModal(animal)}
                    className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                  >
                    Faire un rapport de consommation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedAnimal && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4'>Ajouter un rapport de consommation pour {selectedAnimal.name}</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-gray-700'>Nourriture</label>
                <input
                  type="text"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  className='w-full p-2 border rounded text-black' // Updated text color to black
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700'>Quantité</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className='w-full p-2 border rounded text-black' // Updated text color to black
                  required
                  min={1}
                />
              </div>
              <button
                type="submit"
                className='w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded'
              >
                Ajouter
              </button>
            </form>
            <button
              onClick={closeModal}
              className='w-full mt-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded'
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </>
  );
}