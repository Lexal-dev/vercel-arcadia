"use client"
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';

interface ConsultationSummaryProps {}

const ConsultationSummary: React.FC<ConsultationSummaryProps> = () => {
  const [consultations, setConsultations] = useState<any[]>([]);

  useEffect(() => {
    async function fetchConsultations() {
      try {
        const querySnapshot = await getDocs(collection(db, 'animals'));
        const consultationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConsultations(consultationsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des consultations :', error);
      }
    }

    fetchConsultations();
  }, []);

  return (
      <table className="table-auto w-full md:w-2/3 border-collapse border border-background w-1/2 rounded-lg">
        <thead>
          <tr className="bg-muted border border-background">
            <th className="border border-background px-4 py-2">Nom de l&apos;animal</th>
            <th className="border border-background px-4 py-2">Nombre de consultations</th>
          </tr>
        </thead>
        <tbody>
          {consultations.map((animal) => (
            <tr key={animal.id} className="border border-background bg-foreground hover:bg-opacity-50 text-secondary hover:bg-muted hover:text-white">
              <td className="border border-background px-4 py-2">{animal.animalName}</td>
              <td className="border border-background px-4 py-2 text-center">{animal.consultations}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
  );
};

export default ConsultationSummary;