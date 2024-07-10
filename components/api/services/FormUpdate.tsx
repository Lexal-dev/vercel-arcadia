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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="w-full md:w-2/3 bg-foreground p-4">
        <button onClick={onClose} className="w-full flex justify-end text-red-500 hover:text-red-700">
          <MdClose size={36} />
        </button>
        <form onSubmit={handleUpdateService} className="text-secondary">
          <div className="mb-4">
            <label className="block">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded bg-muted hover:bg-background text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded bg-muted hover:bg-background text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-muted hover:bg-background text-white p-2 rounded mt-6"
          >
            Mettre à Jour
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormUpdate;