"use client"
import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import NekoToast from '@/components/ui/_partial/Toast'; // Assurez-vous que le chemin d'import est correct

interface Avis {
    id: number;
    pseudo: string;
    comment: string;
    isValid: boolean;
}

export default function AvisManager() {
    const [avisList, setAvisList] = useState<Avis[]>([]);
    const [filter, setFilter] = useState<'all' | 'valid' | 'invalid'>('all');
    const [toast, setToast] = useState<{ type: 'Success' | 'Error' | 'Delete' | 'Update'; message: string } | null>(null);

    const fetchAvis = async (additionalParam: string | number) => {
        try {
            const response = await fetch(`/api/avis/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`);
            if (!response.ok) {
                throw new Error('Failed to fetch avis');
            }
            const data = await response.json();
            if (data.success) {
                setAvisList(data.avis);
            } else {
                throw new Error(data.message || 'Failed to fetch avis');
            }
        } catch (error) {
            console.error('Error fetching avis:', error);
        }
    };

    useEffect(() => {
        fetchAvis('avis');
    }, []);

    const handleUpdateSuccess = () => {
        fetchAvis('avis');
        showToast('Update', 'Avis mis à jour avec succès.');
    };

    const handleDeleteSuccess = (id: number) => {
        setAvisList(avisList.filter(a => a.id !== id));
        showToast('Delete', 'Avis supprimé avec succès.');
    };

    const showToast = (type: 'Success' | 'Error' | 'Delete' | 'Update', message: string) => {
        setToast({ type, message });
        setTimeout(() => {
            setToast(null);
        }, 3000); // Masquer le toast après 3 secondes
    };

    const filteredAvis = avisList.filter(a => {
        if (filter === 'all') return true;
        return filter === 'valid' ? a.isValid : !a.isValid;
    });

    const toggleAvisValidity = async (avis: Avis) => {
        try {
            const response = await fetch(`/api/avis/update?id=${avis.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isValid: !avis.isValid }),
            });

            const data = await response.json();
            if (data.success) {
                handleUpdateSuccess();
            } else {
                console.error('Error updating avis:', data.message);
                showToast('Error', 'Erreur lors de la mise à jour de l\'avis.');
            }
        } catch (error) {
            console.error('Error updating avis:', error);
            showToast('Error', 'Erreur réseau lors de la mise à jour de l\'avis.');
        }
    };

    const deleteAvis = async (avis: Avis) => {
        try {
            const response = await fetch(`/api/avis/delete?id=${avis.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();
            if (data.success) {
                handleDeleteSuccess(avis.id);
            } else {
                console.error('Error deleting avis:', data.message);
                showToast('Error', 'Erreur lors de la suppression de l\'avis.');
            }
        } catch (error) {
            console.error('Error deleting avis:', error);
            showToast('Error', 'Erreur réseau lors de la suppression de l\'avis.');
        }
    };

    return (
        <main className="w-full flex-col flex py-6 px-1 md:p-6 md:items-center">
            {toast && <NekoToast toastType={toast.type} toastMessage={toast.message} />}
            <div className="flex justify-between mb-1">
                <div>
                    <button className={`px-4 py-2 text-black md:rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('all')}>Tous</button>
                    <button className={`px-4 py-2 ml-2 md:rounded text-black ${filter === 'valid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('valid')}>Valides</button>
                    <button className={`px-4 py-2 ml-2 md:rounded text-black ${filter === 'invalid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('invalid')}>Invalides</button>
                </div>
            </div>
            <div className="lg:w-2/3 overflow-x-auto bg-white shadow-md md!rounded-lg">
                <table className="w-full table-auto text-black">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">Pseudo</th>
                            <th className="px-4 py-2 text-left">Commentaire</th>
                            <th className="px-4 py-2 text-left">Validité</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAvis.map(a => (
                            <tr key={a.id} className="border-t">
                                <td className="px-4 py-2">{a.pseudo}</td>
                                <td className="px-4 py-2">{a.comment}</td>
                                <td className="px-4 py-2">{a.isValid ? 'Valide' : 'Invalide'}</td>
                                <td className="px-4 py-2 flex justify-center items-center space-x-4">
                                    <button onClick={() => toggleAvisValidity(a)} className="text-yellow-500 hover:text-yellow-700">
                                        <MdEdit size={24} />
                                    </button>
                                    <button onClick={() => deleteAvis(a)} className="text-red-500 hover:text-red-600">
                                        <MdDelete size={24} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}