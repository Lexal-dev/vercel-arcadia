import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

interface FormUpdateProps {
  service: Service; // Service à mettre à jour
  onUpdateSuccess: () => void; // Callback après la mise à jour réussie
  onClose: () => void; // Callback pour fermer le formulaire
}

interface Service {
  id: number;
  name: string;
  description: string;
}

const FormUpdate: React.FC<FormUpdateProps> = ({ service, onUpdateSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: service.name,
    description: service.description,
  });

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/services/update?id=${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onUpdateSuccess(); // Appeler la fonction de callback après la mise à jour réussie
      } else {
        console.error('Error updating service:', data.message);
      }
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md w-1/3">
        <button onClick={onClose} className="w-full flex justify-end text-red-500 hover:text-red-700">
          <MdClose size={36} />
        </button>
        <form onSubmit={handleUpdateService} className="text-black">
          <div className="mb-4">
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
              required
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