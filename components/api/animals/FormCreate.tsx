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
    etat: 'bon' // Définir une valeur par défaut pour 'etat'
  });

  const [habitats, setHabitats] = useState<Habitat[]>([]);
  const [races, setRaces] = useState<Race[]>([]); // État pour stocker les races disponibles

  useEffect(() => {
    // Fetch des habitats
    fetch('/api/habitats/read')
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          setHabitats(data.habitats);
        } else {
          console.error('Failed to fetch habitats:', data.message);
        }
      })
      .catch(error => console.error('Error fetching habitats:', error));

    // Fetch des races
    fetch('/api/races/read')
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          setRaces(data.races);
        } else {
          console.error('Failed to fetch races:', data.message);
        }
      })
      .catch(error => console.error('Error fetching races:', error));
  }, []);

  const handleCreateAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Vérifier si les champs requis sont remplis
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
        onCreateSuccess(); // Appeler la fonction de succès pour fermer la modal
        setFormData({
          name: '',
          raceId: '',
          habitatId: '',
          etat: 'bon' // Réinitialiser l'état à sa valeur par défaut après la création
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

  // Étant donné que 'etat' est défini par défaut à 'bon', il n'est pas nécessaire de changer sa valeur

  return (
    <div className="">
      <form onSubmit={handleCreateAnimal} className="text-black">
        <div className="mb-4">
          <label className="block text-gray-700">Nom</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Race</label>
          <select
            value={formData.raceId}
            onChange={handleRaceChange}
            className="w-full p-2 border rounded"
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
          <label className="block text-gray-700">Habitat</label>
          <select
            value={formData.habitatId}
            onChange={handleHabitatChange}
            className="w-full p-2 border rounded"
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
            className="w-full p-2 border rounded"
            disabled // Désactiver l'édition du champ 'etat'
            hidden
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Créer Animal
        </button>
      </form>
    </div>
  );
};

export default FormCreate;