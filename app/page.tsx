import Activity from '@/components/pages/home/Activity';
import Presentation from '@/components/pages/home/Presentation';
import Avis from '@/components/pages/home/Avis';
import React from 'react';
import FormCreate from '@/components/api/avis/FormCreate';
const HomePage = () => {

  return (
    <main className='flex flex-col items-center py-12'>
      <Presentation />
      <div className='my-12'></div>
      <Activity />
      <div className='my-12'></div>
      <Avis />
      <div className='my-12'></div>
      <FormCreate />
    </main>
  );
};

export default HomePage;
