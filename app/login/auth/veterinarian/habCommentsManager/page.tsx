"use client"
import React, { useState, useEffect } from 'react';
import FormUpdate from '@/components/api/habitats/FormUpdateComments'; // Importer le composant FormUpdate
import Habitat from '@/models/habitat';

const HabitatsComments: React.FC = () => {
    const [habitats, setHabitats] = useState<Habitat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedHabitat, setSelectedHabitat] = useState<Habitat | null>(null); // State to hold selected habitat for update



    // Function to fetch habitats from API
    const fetchHabitats = async () => {
        try {
            const response = await fetch('/api/habitats/read');
            const data = await response.json();
            if (data.success) {
                setHabitats(data.habitats);
            } else {
                setError(data.message || 'Failed to fetch habitats');
            }
        } catch (error) {
            console.error('Error fetching habitats:', error);
            setError('An error occurred while fetching habitats');
        } finally {
            setLoading(false);
        }
    };



    // Function to open the update form
    const openUpdateForm = (habitat: Habitat) => {
        setSelectedHabitat(habitat);
    };

    // Function to close the update form
    const closeUpdateForm = () => {
        setSelectedHabitat(null);
    };

    // Fetch habitats when component mounts
    useEffect(() => {
        fetchHabitats();
    }, []);

 

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <main className='flex flex-col items-center p-12'>

            <h1 className='text-2xl mb-4 font-bold'>Habitats Management</h1>
            <div className="overflow-x-auto w-full max-w-4xl">

                <table className='min-w-full bg-white text-black shadow-md rounded-lg'>
                    <thead className='bg-gray-200'>
                        <tr>
                            <th className='py-3 px-6 border-b text-center'>ID</th>
                            <th className='py-3 px-6 border-b text-center'>Name</th>
                            <th className='py-3 px-6 border-b text-center'>Description</th>
                            <th className='py-3 px-6 border-b text-center'>Comment</th>
                            <th className='py-3 px-6 border-b text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habitats.map((habitat) => (
                            <tr key={habitat.id} className='even:bg-gray-100'>
                                <td className='py-3 px-6 border-b'>{habitat.id}</td>
                                <td className='py-3 px-6 border-b'>{habitat.name}</td>
                                <td className='py-3 px-6 border-b'>{habitat.description}</td>
                                <td className='py-3 px-6 border-b'>{habitat.comment}</td>
                                <td className='py-3 px-6 border-b text-center flex justify-center items-center'>
                                    <button
                                        className='bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded'
                                        onClick={() => openUpdateForm(habitat)}
                                    >
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* FormUpdate component */}
            {selectedHabitat && (
                <FormUpdate
                    habitat={selectedHabitat}
                    onUpdateSuccess={() => {
                        fetchHabitats(); // Refresh habitats list after update
                        closeUpdateForm(); // Close the update form after successful update
                    }}
                    onClose={closeUpdateForm}
                />
            )}
        </main>
    );
}

export default HabitatsComments;