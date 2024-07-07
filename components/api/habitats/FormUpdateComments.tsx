"use client"
import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

interface FormUpdateProps {
  habitat: Habitat; // Habitat à mettre à jour
  onUpdateSuccess: () => void; // Callback après la mise à jour réussie
  onClose: () => void; // Callback pour fermer le formulaire
}

interface Habitat {
  id: number;
  name: string;
  description: string;
  comment: string;
}

const FormUpdate: React.FC<FormUpdateProps> = ({ habitat, onUpdateSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: habitat.name,
    description: habitat.description,
    comment: habitat.comment,
  });

  const handleUpdateHabitat = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/habitats/update?id=${habitat.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            comment: formData.comment,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onUpdateSuccess(); // Appeler la fonction de callback après la mise à jour réussie
      } else {
        console.error('Error updating habitat:', data.message);
      }
    } catch (error) {
      console.error('Error updating habitat:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <button onClick={onClose} className="w-full flex justify-end text-red-500 hover:text-red-700">
          <MdClose size={36} />
        </button>

        <form onSubmit={handleUpdateHabitat} className="text-black">
          <div className="mb-4">
            <label defaultValue={formData.name} className="block text-gray-700">{formData.name}</label>
          </div>
          <div className="mb-4">
            <label defaultValue={formData.description} className="block text-gray-700">{formData.description}</label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Commentaire</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 border border-yellow-600 hover:border-yellow-700 text-white py-2 px-4 rounded"
          >
            Mettre à Jour
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default FormUpdate;