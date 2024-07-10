import React from 'react';

interface NekoToastProps {
  toastType: 'Success' | 'Error' | 'Delete' | 'Update'; // Ajout des types Delete et Update
  toastMessage: string;
}

export 
const NekoToast: React.FC<NekoToastProps> = ({ toastType, toastMessage }) => {
  const getToastStyle = () => {
    switch (toastType) {
      case 'Success':
        return 'bg-green-500 text-white';
      case 'Error':
        return 'bg-red-500 text-white';
      case 'Delete': 
        return 'bg-red-600 text-white';
      case 'Update':
        return 'bg-yellow-500 text-white';
      default:
        return '';
    }
  };

  

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${getToastStyle()} z-50`}>
      <p className='text-xl'>{toastType === 'Success' ? 'Success' : toastType === 'Error' ? 'Error' : 'Notification'}</p>
      <p className='text-lg'>{toastMessage}</p>
    </div>
  );
};

export default NekoToast;