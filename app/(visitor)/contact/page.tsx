import FormContact from '@/components/pages/contact/FormContact'
import React from 'react'

export default function ContactPage() {
  return (
    <main className='flex flex-col items-center py-12 px-2 gap-6 md:p-12 '>
      <div className='flex flex-col text-center md:w-2/3 '>
          <h2 className='text-4xl font-bold mb-10'>Contact</h2>
          <p className='text-lg mb-6'>Ci-dessous, si vous avez besoin de nous contacter notre formulaire de contact :</p>
          <FormContact />        
      </div>

    </main>
  )
}
