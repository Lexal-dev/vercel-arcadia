"use client";
import React, { useEffect, useState } from 'react';
import FormCreate from '@/components/api/users/FormCreate';
import FormUpdate from '@/components/api/users/FormUpdate'; // Assurez-vous que le chemin vers FormUpdate est correct
import User from '@/models/user';
import { MdDelete, MdEdit } from 'react-icons/md';
import NekoToast from '@/components/ui/_partial/Toast';

export default function UsersManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false); // État pour contrôler l'affichage de la modal de création
    const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false); // État pour contrôler l'affichage du formulaire de mise à jour
    const [selectedUser, setSelectedUser] = useState<User | null>(null); // État pour stocker le user sélectionné pour la modification
    const [toast, setToast] = useState<{ type: 'Success' | 'Error' | 'Delete' | 'Update'; message: string } | null>(null);
    const fetchUsers = async (additionalParam: string | number) => {
        try {
            const response = await fetch(`/api/users/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`)
            const data = await response.json();
            if (data.success) {
                // Filtrer les utilisateurs pour exclure les administrateurs
                const filteredUsers = data.users.filter((user: User) => user.role !== 'ADMIN');
                setUsers(filteredUsers);
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
        fetchUsers('users');
    }, []);

    // Fonction pour supprimer un user
    const handleUserDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/users/delete?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                showToast('Delete', 'Utilisateur effacé avec succès.' );
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
        await fetchUsers("users"); // Rafraîchir la liste des users après création
        setShowForm(false); // Fermer la modal après création
        showToast('Success', 'Utilisateur créer avec succès.' );
    };

    // Fonction pour gérer la réussite de la mise à jour d'un user
    const handleUsersUpdated = async () => {
        await fetchUsers("users"); // Rafraîchir la liste des users après mise à jour
        setShowUpdateForm(false); // Fermer le formulaire de mise à jour après succès
        showToast('Update', 'Utilisateur mis à jour avec succès.' );
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

    const showToast = (type: 'Success' | 'Error' | 'Delete' | 'Update', message: string) => {
        setToast({ type, message });
        setTimeout(() => {
          setToast(null);
        }, 3000); // Masquer le toast après 3 secondes
      };

    return (
        <main className='flex flex-col items-center p-12'>
        {toast && <NekoToast toastType={toast.type} toastMessage={toast.message} timeSecond={3} onClose={() => setToast(null)} />}
            <h1 className='text-2xl mb-4 font-bold'>Utilisateurs</h1>
            <button
                onClick={openCreateForm}
                className='bg-foreground hover:bg-muted-foreground hover:text-white text-secondary py-1 px-3 rounded-md mb-6'>
                Ajouter un utilisateur
            </button>
            <div className="overflow-x-auto w-full flex flex-col items-center">

                <table className='shadow-md'>
                    <thead className='bg-muted-foreground'>
                        <tr>
                            <th className='py-3 px-6 text-left'>ID</th>
                            <th className='py-3 px-6 text-left'>Email</th>
                            <th className='py-3 px-6 text-left'>Role</th>
                            <th className='py-3 px-6 text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className='bg-muted hover:bg-background'>
                                <td className='py-3 px-6 border-b-2 border-background'>{user.id}</td>
                                <td className='py-3 px-6 border-b-2 border-background'>{user.email}</td>
                                <td className='py-3 px-6 border-b-2 border-background'>{user.role}</td>
                                <td className='py-3 px-6 border-b-2 border-background text-center flex justify-center gap-4'>
                                    <button
                                        className='text-red-500 hover:text-red-600'
                                        onClick={() => handleUserDelete(user.id)}
                                    >
                                        
                                        <MdDelete size={32} />
                                    </button>
                                    <button
                                        className='text-yellow-500 hover:text-yellow-600'
                                        onClick={() => openUpdateForm(user)}
                                    >
                                        <MdEdit size={32} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
