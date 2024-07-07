"use client"
import React, { useEffect, useState } from 'react';
import FormCreate from '@/components/api/users/FormCreate';
import FormUpdate from '@/components/api/users/FormUpdate'; // Assurez-vous que le chemin vers FormUpdate est correct
import User from '@/models/user';

export default function UsersManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false); // État pour contrôler l'affichage de la modal de création
    const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false); // État pour contrôler l'affichage du formulaire de mise à jour
    const [selectedUser, setSelectedUser] = useState<User | null>(null); // État pour stocker le user sélectionné pour la modification

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users/read');
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            } else {
                setError(data.message || 'Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('An error occurred while fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fonction pour supprimer un user
    const handleUserDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/users/delete?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                setUsers(users.filter(user => user.id !== id));
            } else {
                console.error('Error deleting users:', data.message);
            }
        } catch (error) {
            console.error('Error deleting users:', error);
        }
    };

    // Fonction pour gérer la réussite de la création d'un user
    const handleUsersCreated = async () => {
        await fetchUsers(); // Rafraîchir la liste des users après création
        setShowForm(false); // Fermer la modal après création
    };

    // Fonction pour gérer la réussite de la mise à jour d'un user
    const handleUsersUpdated = async () => {
        await fetchUsers(); // Rafraîchir la liste des users après mise à jour
        setShowUpdateForm(false); // Fermer le formulaire de mise à jour après succès
    };

    // Fonction pour ouvrir le formulaire de création
    const openCreateForm = () => {
        setShowForm(true);
    };

    // Fonction pour ouvrir le formulaire de mise à jour
    const openUpdateForm = (user: User) => {
        setSelectedUser(user); // Définir le user sélectionné pour la modification
        setShowUpdateForm(true); // Afficher le formulaire de mise à jour
    };

    // Si le chargement est en cours, afficher un message de chargement
    if (loading) {
        return <p>Loading...</p>;
    }

    // Si une erreur s'est produite, afficher un message d'erreur
    if (error) {
        return <p>Error: {error}</p>;
    }

    // Rendu du composant principal
    return (
        <main className='flex flex-col items-center p-12'>
            <h1 className='text-2xl mb-4 font-bold'>Users Management</h1>
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className='min-w-full bg-white text-black shadow-md rounded-lg'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='py-3 px-6 border-b text-left'>ID</th>
                            <th className='py-3 px-6 border-b text-left'>Name</th>
                            <th className='py-3 px-6 border-b text-left'>Description</th>
                            <th className='py-3 px-6 border-b text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className='even:bg-gray-100'>
                                <td className='py-3 px-6 border-b'>{user.id}</td>
                                <td className='py-3 px-6 border-b'>{user.email}</td>
                                <td className='py-3 px-6 border-b'>{user.role}</td>
                                <td className='py-3 px-6 border-b text-center flex justify-center'>
                                    <button
                                        className='bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded mx-1 w-1/2'
                                        onClick={() => handleUserDelete(user.id)}
                                    >
                                        Supprimer
                                    </button>
                                    <button
                                        className='bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mx-1 w-1/2'
                                        onClick={() => openUpdateForm(user)}
                                    >
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={openCreateForm}
                className='bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md mt-4'>
                Ajouter un utilisateur
            </button>

            {/* Afficher le formulaire de création */}
            {showForm && (
                <FormCreate
                    onCreateSuccess={handleUsersCreated}
                    onClose={() => setShowForm(false)}
                />
            )}

            {/* Afficher le formulaire de mise à jour */}
            {showUpdateForm && selectedUser && (
                <FormUpdate
                    user={selectedUser}
                    onUpdateSuccess={handleUsersUpdated}
                    onClose={() => setShowUpdateForm(false)}
                />
            )}
        </main>
    );
}