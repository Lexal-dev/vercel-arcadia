"use client";
import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import NekoToast from '@/components/ui/_partial/Toast'; // Assurez-vous que le chemin d'import est correct

interface Service {
  id: number;
  name: string;
  description: string;
}

interface ServiceUpdateFormProps {
  service: Service;
  onUpdateSuccess: () => void;
  onClose: () => void;
}

const FormUpdate: React.FC<ServiceUpdateFormProps> = ({ service, onUpdateSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: service.name,
    description: service.description,
  });

  const [toast, setToast] = useState<{ type: 'Success' | 'Error'; message: string } | null>(null);
  const [serverError, setServerError] = useState<string>('');

  const MAX_NAME_LENGTH = 30;
  const MAX_DESCRIPTION_LENGTH = 150;

  const handleUpdateService = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client pour la longueur des champs
    if (formData.name.length < 3 || formData.name.length > MAX_NAME_LENGTH) {
      setToast({ type: 'Error', message: `Le nom doit avoir entre 3 et ${MAX_NAME_LENGTH} caractères.` });
      return;
    }

    if (formData.description.length < 3 || formData.description.length > MAX_DESCRIPTION_LENGTH) {
      setToast({ type: 'Error', message: `La description doit avoir entre 3 et ${MAX_DESCRIPTION_LENGTH} caractères.` });
      return;
    }

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
        setToast({ type: 'Success', message: 'Service mis à jour avec succès.' });
        setTimeout(() => {
          setToast(null);
          onUpdateSuccess();
        }, 3000); // Masquer le toast après 3 secondes et appeler onUpdateSuccess
      } else {
        setServerError(data.message); // Capturer le message d'erreur du serveur
      }
    } catch (error) {
      console.error('Error updating service:', error);
      setToast({ type: 'Error', message: 'Erreur lors de la mise à jour du service.' });
    }
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
      {toast && <NekoToast toastType={toast.type} toastMessage={toast.message} />}
      <div className='flex flex-col justify-between bg-foreground p-6 rounded-lg text-secondary w-[600px] h-[400px]'>
        <button onClick={onClose} className="flex justify-end text-red-500 hover:text-red-700">
          <MdClose size={24} />
        </button>
        <form onSubmit={handleUpdateService} className="flex flex-col h-full">
          <div className="mb-4 flex-grow">
            <label className="block text-gray-700">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-background hover:bg-muted-foreground text-white p-2 border rounded"
              maxLength={MAX_NAME_LENGTH}
              required
            />
            <small className="text-red-500">
              {formData.name.length < 3 && 'Le nom doit avoir au moins 3 caractères.'}
              {formData.name.length > MAX_NAME_LENGTH && `Le nom ne doit pas dépasser ${MAX_NAME_LENGTH} caractères.`}
            </small>
          </div>
          <div className="mb-4 flex-grow">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-background hover:bg-muted-foreground text-white p-2 border rounded"
              maxLength={MAX_DESCRIPTION_LENGTH}
              required
            />
            <small className="text-red-500">
              {formData.description.length < 3 && 'La description doit avoir au moins 3 caractères.'}
              {formData.description.length > MAX_DESCRIPTION_LENGTH && `La description ne doit pas dépasser ${MAX_DESCRIPTION_LENGTH} caractères.`}
            </small>
          </div>
          {serverError && (
            <div className="text-red-500 mb-4" dangerouslySetInnerHTML={{ __html: serverError }} />
          )}
          <button
            type="submit"
            className="bg-muted hover:bg-muted-foreground text-white px-4 py-2 mt-4 rounded-md"
          >
            Mettre à Jour
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormUpdate;