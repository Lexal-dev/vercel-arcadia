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
            <div className="bg-white p-6 rounded shadow-md w-1/3">
                <button onClick={onClose} className="w-full flex justify-end text-red-500 hover:text-red-700 "><MdClose size={36} /></button>
                <form onSubmit={handleUpdateUser} className='text-black'>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Rôle</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="EMPLOYEE">EMPLOYEE</option>
                            <option value="VETERINARIAN">VETERINARIAN</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 border border-yellow-600 hover:border-yellow-700 text-white py-2 px-4 rounded">
                        Mettre à Jour
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormUpdate;