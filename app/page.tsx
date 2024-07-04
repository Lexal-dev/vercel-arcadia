import FormCreate from '@/components/api/animals/FormCreate';
import ListAnimals from '@/components/api/animals/ListAnimals';
import React from 'react';
const HomePage = () => {


  return (
    <main className='flex flex-col items-center p-12'>
      <FormCreate />
      <div className='my-6'></div>
      <ListAnimals />
    </main>
  );
};

export default HomePage;
