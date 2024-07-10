import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

interface FormUpdateProps {
  user: User; // Utilisateur à mettre à jour
  onUpdateSuccess: () => void; // Callback après la mise à jour réussie
  onClose: () => void; // Callback pour fermer le formulaire
}

interface User {
  id: number;
  email: string;
  role: string;
}

const FormUpdate: React.FC<FormUpdateProps> = ({ user, onUpdateSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    email: user.email,
    role: user.role,
    password: '', // Champ pour le nouveau mot de passe
  });

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/update?id=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
          password: formData.password, // Inclure le champ password dans la requête
        }),
      });

      const data = await response.json();
      if (data.success) {
        onUpdateSuccess(); // Appeler la fonction de callback après la mise à jour réussie
      } else {
        console.error('Error updating user:', data.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-foreground p-6 rounded shadow-md w-1/2 text-secondary">
        <div className='flex w-full justify-between mb-6'>
            <h1 className='w-3/4 text-3xl font-bold'>Mise à jour utilisateurs</h1>
            <button onClick={onClose} className="text-red-500 hover:text-red-700"><MdClose size={36} /></button>
        </div>
        <form onSubmit={handleUpdateUser}>
          <div className="mb-4">
            <label className="block">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded bg-muted hover:bg-background text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Rôle</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2 border rounded bg-muted hover:bg-background text-white"
              required
            >
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="VETERINARIAN">VETERINARIAN</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block">Nouveau Mot de Passe</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-2 border rounded bg-muted hover:bg-background text-white mb-6"
            />
          </div>
          <button type="submit" className="w-full bg-muted hover:bg-background text-white py-2 px-4 rounded">
            Mettre à Jour
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormUpdate;