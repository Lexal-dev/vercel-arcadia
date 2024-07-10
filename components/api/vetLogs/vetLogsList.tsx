"use client"
import React, { useEffect, useState } from 'react';
import Animal from '@/models/animal';
import Habitat from '@/models/habitat';
import VetLog from '@/models/vetLogs';
import FormCreate from '@/components/api/vetLogs/FormCreate';
import FormUpdate from '@/components/api/vetLogs/FormUpdate';
import { MdEdit, MdDelete } from 'react-icons/md';

export default function VetLogsList() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [vetLogs, setVetLogs] = useState<VetLog[]>([]);
  const [selectedHabitatName, setSelectedHabitatName] = useState<string | null>(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [choiceHabitat, setChoiceHabitat] = useState<boolean>(true);
  const [modal, setModal] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [updateModal, setUpdateModal] = useState<boolean>(false); // Etat pour contrôler l'ouverture de la modal de mise à jour

    const fetchAnimal = async (additionalParam: string | number) => {
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

  useEffect(() => {fetchAnimal('animals')}, []);

  const handleHabitatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const habitatName = event.target.value;
    setSelectedHabitatName(habitatName !== "" ? habitatName : null);
    setSelectedAnimalId(null);
    setSelectedAnimal(null);
  };

  const handleAnimalId = (animalId: number) => {
    const selected = animals.find(animal => animal.id === animalId);
    if (selected) {
      setSelectedAnimal(selected);
      setSelectedAnimalId(animalId);
      setModal(true);
    }
  };

  const handleCreateVetLog = (formData: any) => {
    fetch('/api/vetLogs/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          setVetLogs(prevVetLogs => [...prevVetLogs, data.vetLog]);
          alert('vetLog créé avec succès!');
          setShowCreateForm(false);
        } else {
          console.error('Failed to create vetLog:', data.message);
        }
      })
      .catch(error => console.error('Error creating vetLog:', error));
  };
  const handleDeleteVetLog = async (id: number) => {
    try {
      const response = await fetch(`/api/vetLogs/delete?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        // Mettre à jour l'état local des vetlogs après la suppression
        setVetLogs(prevVetLogs => prevVetLogs.filter(vetLog => vetLog.id !== id));
      } else {
        console.error('Error deleting vetLog:', data.message);
      }
    } catch (error) {
      console.error('Error deleting vetLog:', error);
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

  useEffect(() => {
    setChoiceHabitat(selectedHabitatName === "" || selectedHabitatName === null);
  }, [selectedHabitatName]);

  const filteredAnimals = selectedHabitatName
    ? animals.filter(animal => animal.habitatId.toString() === selectedHabitatName)
    : animals;

  const filteredVetLogs = selectedAnimalId
    ? vetLogs.filter(vetLog => vetLog.animalId === selectedAnimalId)
    : [];

  return (
    <>
      <h3 className='w-full text-3xl font-bold text-center mb-4'>Rapports vétérinaire</h3>
      <select onChange={handleHabitatChange} className='text-black p-1 rounded-md bg-slate-300 mb-6'>
        <option value="">Sélectionnez un habitat</option>
        {habitats.map(habitat => (
          <option key={habitat.id} value={habitat.name}>
            {habitat.name}
          </option>
        ))}
      </select>
      
      <div className='w-full flex flex-col items-center'>
        <div className='flex items-center items-center gap-3'>
          <h2 className='text-2xl font-bold mb-4'>Liste des animaux</h2> 
          {choiceHabitat ? (
            <p className='text-xl font-bold mb-4'> [Complète]:</p>
          ) : (
            <p className='text-xl font-bold mb-4'> [{selectedHabitatName}]:</p>
          )}                   
        </div>
       
        <table className='w-full bg-foreground text-secondary'>
          <thead>
            <tr className='bg-muted text-white'>
              <th className='p-2 border'>Nom de l&apos;animal</th>
              <th className='p-2 border'>Race</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnimals.map(animal => (
              <tr key={animal.id} className='cursor-pointer hover:bg-muted-foreground hover:text-white w-full' onClick={() => handleAnimalId(animal.id)}>
                <td className='p-2 border-b-2'>{animal.name}</td>
                <td className='p-2 border-b-2'>{animal.raceId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-1'>
          <div className='flex flex-col bg-foreground rounded-lg p-4 w-full md:w-2/3 text-secondary'>    
            <ul>
                <div className='flex justify-between w-full'>
                {showCreateForm && (
                    <button className='hover:text-red-600 text-xl hover:text-bold w-[100px]' onClick={() => setShowCreateForm(false)}>Annuler</button>
                )}
                    <button onClick={() => setModal(false)} className='w-full text-end text-red-600 hover:text-red-700 text-xl hover:text-bold'>Fermer</button>
                </div>
              {selectedAnimal && (
                <div className='mb-4 pb-6 border-b-2'>
                  {showCreateForm ? (
                    <div className='w-full flex justify-center'>
                        <FormCreate animalId={selectedAnimal.id} onCreate={handleCreateVetLog} />
                    </div>
                  ) : (
                    <div className='w-full flex justify-center mb-6'>
                            <button className="hover:text-red-600 text-xl hover:text-bold " onClick={() => setShowCreateForm(true)}>Créer un nouveau log</button>              
                    </div>
                  )}   
                </div>
              )}
              {filteredVetLogs.map(vetLog => (
                <li key={vetLog.id} className='flex mb-2 border-b-2 pb-2'>
                    <div className='w-2/3'>
                        <p className='text-bold text-xl mb-2'>{selectedAnimal?.name}</p>
                        <p className=''>Santé : {vetLog.animalState}</p>
                        <p className=''>Nourriture donnée : {vetLog.foodOffered}</p>
                        <p className=''>Quantité donnée : {vetLog.foodWeight}g</p>
                        <p>Date : {formatDateTime(vetLog.createdAt)}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center text-white'>
                        <div className='w-full flex justify-center items-center gap-4 md:gap-12'>
                            <button className='p-1 text-yellow-500 hover:text-yellow-600 bg-muted rounded-lg' onClick={()=> {setUpdateModal(true)}}>
                              <MdEdit className='w-[25px] h-[25px] md:w-[50px] md:h-[50px]' />
                            </button>
                            <button
                                className='p-1 text-red-500 hover:text-red-600 bg-muted rounded-lg'
                                onClick={() => handleDeleteVetLog(vetLog.id)} // Appel de handleDeleteVetLog avec l'ID du vetlog
                            >
                                <MdDelete  className='w-[25px] h-[25px] md:w-[50px] md:h-[50px]' />
                            </button>
                        </div>

                        {updateModal && (
                          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="fixed inset-0 z-10"></div>
                            <div className="flex items-center justify-center fixed inset-0 z-10">
                              <div className="absolute inset-0 flex items-center justify-center px-1">
                                <div className="bg-foreground p-6 rounded shadow-md w-full md:w-2/3">
                                    <div className='flex justify-end items-center'>
                                        <button
                                            onClick={() => setUpdateModal(false)}
                                            className="p-2 text-red-600 hover:text-red-700"
                                        >
                                            Fermer
                                        </button>                                       
                                    </div>
                                  <div className="mb-4 text-secondary">
                                    <p className="font-bold text-lg mb-2">{selectedAnimal?.name}</p>
                                    <p>Date : {formatDateTime(vetLog.createdAt)}</p>
                                  </div>
                                  <FormUpdate vetLogId={vetLog.id}  vetLog={vetLog}/>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}