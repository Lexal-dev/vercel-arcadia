"use client";
import React, { useState, useEffect } from 'react';
import Habitat from '@/models/habitat';
import Race from '@/models/race'; // Assurez-vous d'importer le modèle Race

interface FormCreateProps {
  onCreateSuccess: () => void; // Callback après la création réussie
}

const FormCreate: React.FC<FormCreateProps> = ({ onCreateSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    raceId: '',
    habitatId: '',
    etat: 'Bonne santé' // Définir une valeur par défaut pour 'etat'
  });


  const [races, setRaces] = useState<Race[]>([]);
  const [habitats, setHabitats] = useState<Habitat[]>([]);

    const fetchAnimals = async (additionalParam: string | number) => {
      fetch(`/api/animals/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.success) {
            setRaces(data.races);
            setHabitats(data.habitats);
          } else {
            console.error('Failed to fetch data:', data.message);
          }
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  useEffect(() => {fetchAnimals('animals')}, []);

  const handleCreateAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      if (!formData.name || !formData.raceId || !formData.habitatId || !formData.etat) {
        console.error('Le nom, raceId, habitatId et l\'état sont requis.');
        return;
      }

      const response = await fetch('/api/animals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          raceId: parseInt(formData.raceId, 10),
          habitatId: parseInt(formData.habitatId, 10),
          etat: formData.etat
        }),
      });

      const data = await response.json();
      if (data.success) {
        onCreateSuccess();
        setFormData({
          name: '',
          raceId: '',
          habitatId: '',
          etat: 'Bonne santé' 
        });
      } else {
        console.error('Erreur lors de la création de l\'animal:', data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'animal:', error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleRaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, raceId: e.target.value });
  };

  const handleHabitatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, habitatId: e.target.value });
  };


  return (
    <div>
      <form onSubmit={handleCreateAnimal} className='text-white'>
        <div className="mb-4">
          <label className="block text-secondary">Nom</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            className="w-full p-2 border rounded w-full p-2 border rounded text-white bg-muted hover:bg-background mb-6"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary">Race</label>
          <select
            value={formData.raceId}
            onChange={handleRaceChange}
            className="w-full p-2 border rounded text-white bg-muted hover:bg-background mb-6"
            required
          >
            <option value="">Sélectionnez une race</option>
            {races.map(race => (
              <option key={race.id} value={race.id}>
                {race.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-secondary">Habitat</label>
          <select
            value={formData.habitatId}
            onChange={handleHabitatChange}
            className="w-full p-2 border rounded text-white bg-muted hover:bg-background mb-6"
            required
          >
            <option value="">Sélectionnez un habitat</option>
            {habitats.map(habitat => (
              <option key={habitat.id} value={habitat.id.toString()}>
                {habitat.name}
              </option>
            ))}
          </select>
        </div>
        {/* Champ 'etat' avec une valeur par défaut et désactivé */}
        <div className="mb-4">
          <input
            type="text"
            value={formData.etat}
            className="w-full p-2 border rounded text-white bg-muted hover:bg-background mb-6"
            disabled // Désactiver l'édition du champ 'etat'
            hidden
          />
        </div>
        <button
          type="submit"
          className="w-full bg-muted hover:bg-background text-white py-2 px-4 rounded"
        >
          Créer Animal
        </button>
      </form>
    </div>
  );
};

export default FormCreate;