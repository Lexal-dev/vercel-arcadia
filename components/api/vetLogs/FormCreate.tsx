import React, { useState } from 'react';

interface FormCreateProps {
  animalId: number; // Propriété pour stocker l'ID de l'animal associé
  onCreate: (formData: any) => void; // Callback pour gérer la création du vetLog
}

const FormCreate: React.FC<FormCreateProps> = ({ animalId, onCreate }) => {
  const [animalState, setAnimalState] = useState('');
  const [foodOffered, setFoodOffered] = useState('');
  const [foodWeight, setFoodWeight] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Vérifier que tous les champs sont remplis
    if (!animalState || !foodOffered || !foodWeight) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Créer l'objet formData à envoyer à l'API
    const formData = {
      animalId,
      animalState,
      foodOffered,
      foodWeight: parseInt(foodWeight), // Assurez-vous que foodWeight est un nombre
    };

    // Appeler la fonction de création passée en props
    onCreate(formData);

    // Réinitialiser les champs du formulaire après soumission
    setAnimalState('');
    setFoodOffered('');
    setFoodWeight('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">État de l&apos;animal</label>
        <input
          type="text"
          value={animalState}
          onChange={(e) => setAnimalState(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="État de l'animal"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">Nourriture proposée</label>
        <input
          type="text"
          value={foodOffered}
          onChange={(e) => setFoodOffered(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="Nourriture proposée"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Grammage de la nourriture (en g)</label>
        <input
          type="number"
          value={foodWeight}
          onChange={(e) => setFoodWeight(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full"
          placeholder="Grammage de la nourriture"
          required
        />
      </div>
      
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md w-full">Créer vetLog</button>
    </form>
  );
};

export default FormCreate;