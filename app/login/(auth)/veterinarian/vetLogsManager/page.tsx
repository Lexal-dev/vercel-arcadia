"use client"
import React, { useState, useEffect } from 'react';
import Animal from '@/models/animal';
import VetLog from '@/models/vetLogs';
import VetLogList from '@/components/api/vetLogs/vetLogsList'

export default function VetLogsManager() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [vetLogs, setVetLogs] = useState<VetLog[]>([]);
    const [filteredVetLogs, setFilteredVetLogs] = useState<VetLog[]>([]);
    const [modal, setModal] = useState<boolean>(false); // Gestion du modal

    useEffect(() => {
        // Charger la liste des animaux depuis l'API (GET request)
        fetch('/api/animals/read')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setAnimals(data.animals);
                } else {
                    console.error('Failed to fetch animals:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching animals:', error);
            });
    }, []);

    useEffect(() => {
        // Charger les vetLogs de l'animal sélectionné
        if (selectedAnimal) {
            fetch(`/api/vetLogs/read?animalId=${selectedAnimal.id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setVetLogs(data.vetLogs);
                        setFilteredVetLogs(data.vetLogs.filter((log: VetLog) => log.animalId === 5)); // Spécifiez le type de log comme VetLog
                    } else {
                        console.error('Failed to fetch vetLogs:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error fetching vetLogs:', error);
                });
        } else {
            setVetLogs([]);
            setFilteredVetLogs([]);
        }
    }, [selectedAnimal]);

    const handleAnimalClick = (animal: Animal) => {
        setSelectedAnimal(animal);
        setModal(false); // Assurez-vous que la modal est fermée lorsqu'un animal est sélectionné
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = event.target.value.toLowerCase();
        // Filtrer les vetLogs par rapport à la recherche
        const filtered = vetLogs.filter((log: VetLog) =>
            log.foodOffered.toLowerCase().includes(searchText) ||
            log.animalState.toLowerCase().includes(searchText)
        );
        setFilteredVetLogs(filtered);
    };

    function openModal() {
        setModal(true); // Fonction pour ouvrir le modal
    }

    function closeModal() {
        setModal(false); // Fonction pour fermer le modal
    }

    return (
        <main className="container mx-auto p-4">
            <VetLogList />
        </main>
    );
}