"use client";
import React, { useEffect, useState } from 'react';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '@/lib/firebaseConfig';
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';
import FormUpdate from '@/components/api/animals/FormUpdate';
import FormCreate from '@/components/api/animals/FormCreate';
import NekoToast from '@/components/ui/_partial/Toast';
import { MdDelete, MdEdit } from 'react-icons/md';

export default function AnimalsManager() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [selectedHabitatName, setSelectedHabitatName] = useState<string | null>(null); // State for selected habitat name
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showFormUpdate, setShowFormUpdate] = useState<boolean>(false); // State for update form visibility
  const [showFormCreate, setShowFormCreate] = useState<boolean>(false); // State for create form visibility
  const [toast, setToast] = useState<{ type: 'Success' | 'Error' | 'Delete' | 'Update'; message: string } | null>(null);

  useEffect(() => {
    fetchAnimals('animals');
  }, []);

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
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };


  const handleHabitatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const habitatName = event.target.value;
    setSelectedHabitatName(habitatName !== "" ? habitatName : null);
  };

  const handleDeleteAnimal = async (id: number) => {
    const animalToDelete = animals.find(animal => animal.id === id);
    const animalToDeleteUrl = animalToDelete?.imageUrl;
    if (!animalToDelete) {
        console.error('Animal not found for deletion:', id);
        return;
    }

    // Suppression des images associées
    try {
        if (animalToDeleteUrl && animalToDeleteUrl.length > 0) {
            for (const imageUrl of animalToDeleteUrl) {
                await deleteImageFromStorage(imageUrl);
            }
        }
    } catch (error) {
        console.error('Error deleting images from storage:', error);
        return; 
    }

    // Suppression de l'animal après suppression des images
    try {
        const response = await fetch(`/api/animals/delete?id=${encodeURIComponent(id.toString())}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
            setAnimals(animals.filter(animal => animal.id !== id));
            showToast('Delete', 'Animal effacé avec succès.');
        } else {
            console.error('Error deleting animal:', data.message);
        }
    } catch (error) {
        console.error('Error deleting animal:', error);
    }
};

  const deleteImageFromStorage = async (imageUrlToDelete: string) => {
    try {
        const storageRef = ref(storage, imageUrlToDelete);
        await deleteObject(storageRef);
        console.log('Successfully deleted image from storage:', imageUrlToDelete);
    } catch (error) {
        console.error('Error deleting image from storage:', error);
        throw new Error('Failed to delete image from storage');
    }
};

  const handleUpdateSuccess = async () => {
    await fetchAnimals('animals'); // Refresh animal list after update
    setShowFormUpdate(false); // Close update form after successful update
    showToast('Update', 'Animal modifié avec succès !');
  };

  const handleCreateSuccess = async () => {
    await fetchAnimals('animals'); // Refresh animal list after creation
    setShowFormCreate(false); // Close create form after successful creation
    showToast('Success', 'Animal créer avec succés !');
  };

  // Filter animals based on selected habitat name
  const filteredAnimals = selectedHabitatName
    ? animals.filter(animal => animal.habitatId.toString() === selectedHabitatName)
    : animals;

    const showToast = (type: 'Success' | 'Error' | 'Delete' | 'Update', message: string) => {
      setToast({ type, message });
      setTimeout(() => {
        setToast(null);
      }, 3000); // Masquer le toast après 3 secondes
    };

  return (
    <main className='w-full  py-12'>
      <div className='w-full flex flex-col justify-center items-center'>
      {toast && <NekoToast toastType={toast.type} toastMessage={toast.message} timeSecond={3} onClose={() => setToast(null)} />}

        {!showFormUpdate && (
          <button
            onClick={() => setShowFormCreate(true)}
            className="bg-foreground hover:bg-muted-foreground hover:text-white text-secondary py-1 px-3 rounded-md mb-6"
          >
            Créer Animal
          </button>
        )}
        <select onChange={handleHabitatChange} className='text-black p-1 rounded-md bg-slate-300 mb-2'>
          <option value="">Tous les habitats</option>
          {habitats.map(habitat => (
            <option key={habitat.id} value={habitat.name}>
              {habitat.name}
            </option>
          ))}
        </select>
      </div>

      <div className='overflow-x-auto w-full flex flex-col items-center'>
        <table className='shadow-md'>
          <thead className='bg-muted-foreground'>
            <tr>
              <th className='py-3 px-6 border-b text-left'>Nom</th>
              <th className='py-3 px-6 border-b text-left'>Race</th>
              <th className='py-3 px-6 border-b text-left'>Habitat</th>
              <th className='py-3 px-6 border-b text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnimals.map(animal => (
              <tr key={animal.id} className='bg-muted hover:bg-background'>
                <td className='py-3 px-6 border-b-2 border-background'>{animal.name}</td>
                <td className='py-3 px-6 border-b-2 border-background'>{animal.raceId}</td>
                <td className='py-3 px-6 border-b-2 border-background'>{animal.habitatId}</td>
                <td className='py-3 px-6 border-b-2 border-background'>
                  <div className="flex justify-center">
                    <button 
                      className='text-yellow-500 hover:text-yellow-600'
                      onClick={() => {
                        setSelectedAnimal(animal);
                        setShowFormUpdate(true);
                      }}
                    >
                      <MdEdit size={24} />
                    </button>                  
                    <button
                      className='text-red-500 hover:text-red-600'
                      onClick={() => handleDeleteAnimal(animal.id)}
                    >
                      <MdDelete size={24} />
                    </button>                    
                  </div>

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-1">
          <div className="bg-foreground text-secondary p-6 rounded shadow-md md:w-2/3 w-full">
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
    </main>
  );
}