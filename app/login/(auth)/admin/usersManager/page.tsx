"use client"
import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import FormCreate from '@/components/api/users/FormCreate';
import FormUpdate from '@/components/api/users/FormUpdate';

interface User {
    id: number;
    email: string;
    role: string;
    password: string; // Ajout du champ password
}

export default function UsersManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null); // État pour stocker l'utilisateur sélectionné pour la modification

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
    }, []); // Empty dependency array ensures useEffect runs only once on component mount

    const handleUserCreated = async () => {
        await fetchUsers();
        setShowForm(false);
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const response = await fetch(`/api/users/delete?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                await fetchUsers(); // Refresh the user list after deletion
            } else {
                console.error('Error deleting user:', data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUpdateSuccess = async () => {
        await fetchUsers(); // Refresh the user list after successful update
        setSelectedUser(null); // Définir selectedUser à null après la mise à jour
        setShowForm(false); // Ferme la modal après mise à jour
    };

    const openUpdateModal = (user: User) => {
        setSelectedUser(user); // Set the selected user for modification
        setShowForm(true); // Open the modal
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <main className='flex flex-col items-center p-12'>
            <h1 className='text-2xl mb-4 font-bold'>User Management</h1>
            <div className="overflow-x-auto w-full max-w-4xl">
                <table className='min-w-full bg-white text-black shadow-md rounded-lg'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='py-3 px-6 border-b text-left'>ID</th>
                            <th className='py-3 px-6 border-b text-left'>Email</th>
                            <th className='py-3 px-6 border-b text-center'>role</th>
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
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Supprimer
                                    </button>
                                    <button
                                        className='bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mx-1 w-1/2'
                                        onClick={() => openUpdateModal(user)}
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
                onClick={() => setShowForm(true)}
                className='bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md mt-4'>
                Ajouter Utilisateur
            </button>
            {showForm && selectedUser && (
                <FormUpdate user={selectedUser} onUpdateSuccess={handleUpdateSuccess} onClose={() => { setSelectedUser(null); setShowForm(false); }} />
            )}
            {showForm && !selectedUser && (
                <FormCreate onCreateSuccess={handleUserCreated} onClose={() => setShowForm(false)} />
            )}
        </main>
    );
}