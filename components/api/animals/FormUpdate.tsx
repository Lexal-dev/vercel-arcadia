"use client"
import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import Animal from '@/models/animal';
import Race from '@/models/race';
import Habitat from '@/models/habitat';

interface FormUpdateProps {
  animal: Animal; // Animal à mettre à jour
  onUpdateSuccess: () => void; // Callback après la mise à jour réussie
  onClose: () => void; // Callback pour fermer le formulaire
}

const FormUpdate: React.FC<FormUpdateProps> = ({ animal, onUpdateSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: animal.name,
    raceId: animal.raceId.toString(),
    habitatId: animal.habitatId.toString(),
    etat: animal.etat // Conserver la valeur d'origine de l'état
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

  const handleUpdateAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Vérifier si les champs requis sont remplis
      if (!formData.name || !formData.raceId || !formData.habitatId) {
        console.error('Le nom, raceId et habitatId sont requis.');
        return;
      }

      const response = await fetch(`/api/animals/update?id=${animal.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          raceId: parseInt(formData.raceId, 10), // Utiliser l'ID de la race
          habitatId: parseInt(formData.habitatId, 10), // Utiliser l'ID de l'habitat
          etat: formData.etat // Envoyer l'état d'origine
        }),
      });

      const data = await response.json();
      if (data.success) {
        onUpdateSuccess();
      } else {
        console.error('Erreur lors de la mise à jour de l\'animal:', data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'animal:', error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Vérifie si la valeur a été modifiée avant de mettre à jour l'état
    if (e.target.value !== animal.name) {
      setFormData({ ...formData, name: e.target.value });
    }
  };

  const handleRaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Mettre à jour avec l'ID de la race sélectionnée
    if (e.target.value !== animal.raceId.toString()) {
      setFormData({ ...formData, raceId: e.target.value });
    }
  };

  const handleHabitatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Mettre à jour avec l'ID de l'habitat sélectionné
    if (e.target.value !== animal.habitatId.toString()) {
      setFormData({ ...formData, habitatId: e.target.value });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-1">
      <div className="bg-foreground text-secondary p-6 rounded shadow-md md:w-2/3 w-full">
        <button onClick={onClose} className="w-full flex justify-end text-red-500 hover:text-red-700">
          <MdClose size={36} />
        </button>
        <form onSubmit={handleUpdateAnimal}>
          <div className="mb-4">
            <label className="block text-text-secondary">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              className="w-full p-2 border rounded text-white bg-muted hover:bg-background"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-text-secondary">Race</label>
            <select
              value={formData.raceId}
              onChange={handleRaceChange}
              className="w-full p-2 border rounded text-white bg-muted hover:bg-background"
              required
            >
              <option value="">Sélectionnez une race</option>
              {races.map(race => (
                <option key={race.id} value={race.id.toString()}>
                  {race.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-text-secondary">Habitat</label>
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
          {/* Champ caché pour maintenir l'état d'origine */}
          <input type="hidden" name="etat" defaultValue={animal.etat} />
          <button
            type="submit"
            className="w-full bg-muted hover:bg-background text-white py-2 px-4 rounded"
          >
            Mettre à Jour
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormUpdate;