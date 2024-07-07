import React, { useState } from 'react';

interface VetLog {
  id: number;
  animalState: string;
  foodOffered: string;
  foodWeight: number;
  createdAt: Date;
}

interface FormUpdateProps {
  vetLogId: number;
  vetLog: VetLog;
}

const FormUpdate: React.FC<FormUpdateProps> = ({ vetLogId, vetLog }) => {
  const [formData, setFormData] = useState<VetLog>({
    id: vetLog.id,
    animalState: vetLog.animalState,
    foodOffered: vetLog.foodOffered,
    foodWeight: vetLog.foodWeight,
    createdAt: new Date(vetLog.createdAt),
  });

  const handleUpdateVetLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/vetLogs/update?id=${vetLogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animalState: formData.animalState,
          foodOffered: formData.foodOffered,
          foodWeight: formData.foodWeight,
          createdAt: formData.createdAt.toISOString(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('VetLog updated successfully');
      } else {
        console.error('Error updating vetLog:', data.message);
      }
    } catch (error) {
      console.error('Error updating vetLog:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white p-6">
        <form onSubmit={handleUpdateVetLog} className="text-black">
          <div className="mb-4">
            <label className="block text-gray-700">État de l&apos;animal</label>
            <input
              type="text"
              value={formData.animalState}
              onChange={(e) => setFormData({ ...formData, animalState: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nourriture offerte</label>
            <input
              type="text"
              value={formData.foodOffered}
              onChange={(e) => setFormData({ ...formData, foodOffered: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Poids de la nourriture (g)</label>
            <input
              type="number"
              value={formData.foodWeight}
              onChange={(e) => setFormData({ ...formData, foodWeight: Number(e.target.value) })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 border border-yellow-600 hover:border-yellow-700 text-white py-2 px-4 rounded"
          >
            Mettre à Jour
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormUpdate;