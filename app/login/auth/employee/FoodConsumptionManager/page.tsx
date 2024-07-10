"use client";
import React, { useEffect, useState } from 'react';
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';
import { MdEdit } from 'react-icons/md';
import { NekoToast } from '@/components/ui/_partial/Toast';

const AnimalsManager = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [selectedHabitatName, setSelectedHabitatName] = useState<string | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false); // State for modal visibility
  const [food, setFood] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [toast, setToast] = useState<{ type: 'Success' | 'Error' | 'Delete' | 'Update'; message: string } | null>(null);
  
  const fetchAnimals = async (additionalParam: string | number) => {
    try {
      const response = await fetch(`/api/animals/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`);
      const data = await response.json();
      if (data.success) {
        setAnimals(data.animals);
        setHabitats(data.habitats);
      } else {
        console.error('Failed to fetch animals:', data.message);
      }
    } catch(error) {
      console.error('Error fetching animals:', error);
    }
  };

  const handleHabitatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const habitatName = event.target.value;
    setSelectedHabitatName(habitatName !== "" ? habitatName : null);
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
      showToast('Update', `Animal non sélectionné.`);
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
        showToast('Success', `Consommation de nourriture ajoutée avec succès.`);
        closeModal();
      } else {
        console.error('Error adding food consumption:', data.message);
        showToast('Error', `Erreur lors de l'ajout de la consommation de nourriture: ${data.message}`);
      }
    } catch (error:any) {
      console.error('Error adding food consumption:', error);
      showToast('Error', `Erreur lors de l'ajout de la consommation de nourriture: ${error.message}`);
    }
  };

  const showToast = (type: 'Success' | 'Error' | 'Delete' | 'Update', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
        setToast(null);
    }, 3000); // Masquer le toast après 3 secondes
  };
  
  useEffect(() => {
    fetchAnimals('animals');
  }, []);
  const filteredAnimals = selectedHabitatName
    ? animals.filter(animal => animal.habitatId.toString() === selectedHabitatName)
    : animals;


  return (
    <main className='w-full flex flex-col justify-center px-2 items-center py-6'>

      <div className='mb-4'>
        {toast && <NekoToast toastType={toast.type} toastMessage={toast.message} timeSecond={3} onClose={() => setToast(null)}/>}
        <select onChange={handleHabitatChange} className='text-black p-1 rounded-md bg-slate-300 h-[50px] w-[150px]'>
          <option value="">Tous les habitats</option>
          {habitats.map(habitat => (
            <option key={habitat.id} value={habitat.name}>
              {habitat.name}
            </option>
          ))}
        </select>
      </div>

      <div className='w-full md:w-2/3 overflow-x-auto'>
        <table className='w-full table-auto bg-white shadow-md md:rounded-lg'>
          <thead>
            <tr className="bg-muted-foreground">
              <th className='py-3 px-6 border-b text-left'>Nom</th>
              <th className='py-3 px-6 border-b text-left'>Race</th>
              <th className='py-3 px-6 border-b text-left'>Habitat</th>
              <th className='px-4 py-2 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnimals.map(animal => (
              <tr key={animal.id} className='border-t bg-foreground text-secondary hover:bg-muted hover:text-white'>
                <td className='px-4 py-2'>{animal.name}</td>
                <td className='px-4 py-2'>{animal.raceId}</td>
                <td className='px-4 py-2'>{animal.habitatId}</td>
                <td className='px-4 py-2 flex justify-center items-center space-x-4'>
                  <button
                    onClick={() => openModal(animal)}
                    className='text-green-600 hover:text-green-700'
                  >
                    <MdEdit size={24} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedAnimal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75'>
          <div className='bg-foreground text-secondary p-6 rounded-lg shadow-lg md:w-[600px] md:h-[400px]'>
            <h2 className='text-xl font-semibold mb-6'>Ajouter un rapport de consommation pour {selectedAnimal.name}</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-gray-700'>Nourriture</label>
                <input
                  type="text"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  className='w-full p-2 border rounded bg-muted hover:bg-muted-foreground text-white'
                  required
                />
              </div>
              <div>
                <label className='block text-gray-700'>Quantité</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className='w-full p-2 border rounded bg-muted hover:bg-muted-foreground text-white'
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
    </main>
  );
}

export default AnimalsManager;