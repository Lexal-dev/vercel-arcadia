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
    <section className='flex flex-col items-center w-full'>
      <table className="table-auto w-full border-collapse border border-gray-200 w-1/2">
        <thead>
          <tr className="bg-gray-100 border border-gray-200">
            <th className="border border-gray-200 px-4 py-2">Nom de l&apos;animal</th>
            <th className="border border-gray-200 px-4 py-2">Nombre de consultations</th>
          </tr>
        </thead>
        <tbody>
          {consultations.map((animal) => (
            <tr key={animal.id} className="border border-gray-200 bg-gray-100 bg-opacity-25 hover:bg-opacity-50">
              <td className="border border-gray-200 px-4 py-2">{animal.animalName}</td>
              <td className="border border-gray-200 px-4 py-2 text-center">{animal.consultations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ConsultationSummary;