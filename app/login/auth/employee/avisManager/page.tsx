"use client"
import React, { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';

interface Avis {
    id: number;
    pseudo: string;
    comment: string;
    isValid: boolean;
}

export default function AvisManager() {
    const [avis, setAvis] = useState<Avis[]>([]);
    const [selectedAvis, setSelectedAvis] = useState<Avis | null>(null);
    const [filter, setFilter] = useState<'all' | 'valid' | 'invalid'>('all');

    useEffect(() => {
        fetch('/api/avis/read')
            .then(response => response.json())
            .then(data => {
                if (data && data.success) {
                    setAvis(data.avis);
                } else {
                    console.error('Failed to fetch avis:', data.message);
                }
            })
            .catch(error => console.error('Error fetching avis:', error));
    }, []);

    const handleEditAvis = (avis: Avis) => {
        setSelectedAvis(avis);
    };

    const handleUpdateSuccess = () => {
        setSelectedAvis(null);
        fetch('/api/avis/read')
            .then(response => response.json())
            .then(data => {
                if (data && data.success) {
                    setAvis(data.avis);
                } else {
                    console.error('Failed to fetch avis:', data.message);
                }
            })
            .catch(error => console.error('Error fetching avis:', error));
    };

    const filteredAvis = avis.filter(a => {
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
            }
        } catch (error) {
            console.error('Error updating avis:', error);
        }
    };

    return (
        <div className="w-full p-6  min-h-screen">
            <div className="flex justify-between mb-4">
                <div>
                    <button className={`px-4 py-2 text-black rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('all')}>Tous</button>
                    <button className={`px-4 py-2 ml-2 rounded text-black ${filter === 'valid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('valid')}>Valides</button>
                    <button className={`px-4 py-2 ml-2 rounded text-black ${filter === 'invalid' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setFilter('invalid')}>Invalides</button>
                </div>
            </div>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
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
                                <td className="px-4 py-2">
                                    <button onClick={() => toggleAvisValidity(a)} className="flex justify-center items-center w-full text-yellow-500 hover:text-yellow-700">
                                        <MdEdit size={24} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}