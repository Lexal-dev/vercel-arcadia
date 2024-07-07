"use client"
import React, { useEffect, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import FormUpdate from '@/components/api/services/employeeFormUpdate';

interface Service {
  id: number;
  name: string;
  description: string;
}

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetch('/api/services/read')
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          setServices(data.services);
        } else {
          console.error('Failed to fetch services:', data.message);
        }
      })
      .catch(error => console.error('Error fetching services:', error));
  }, []);

  const handleEditService = (service: Service) => {
    setSelectedService(service);
  };

  const handleUpdateSuccess = () => {
    setSelectedService(null);
    fetch('/api/services/read')
      .then(response => response.json())
      .then(data => {
        if (data && data.success) {
          setServices(data.services);
        } else {
          console.error('Failed to fetch services:', data.message);
        }
      })
      .catch(error => console.error('Error fetching services:', error));
  };

  return (
    <div className=' flex flex-col items-center w-full p-6'>
      <div className="overflow-x-auto shadow-md sm:rounded-lg w-2/3">
        <table className="min-w-full bg-white text-black">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map(service => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">{service.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.description}</td>
                <td className="px-6 py-4 whitespace-nowrap flex justify-center">
                  <button onClick={() => handleEditService(service)} className="text-blue-500 hover:text-blue-700">
                    <MdEdit size={24} color='green'/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedService && (
        <FormUpdate
          service={selectedService}
          onUpdateSuccess={handleUpdateSuccess}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}