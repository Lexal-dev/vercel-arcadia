import FormContact from '@/components/pages/contact/FormContact'
import React from 'react'

export default function ContactPage() {
  return (
    <main className='flex flex-col items-center p-12 gap-6'>
        <h2 className='text-4xl font-bold'>Contact</h2>
        <p className='text-lg'>Ci-dessous, si vous avez besoin de nous contacter notre formulaire de contact :</p>
        <FormContact />
    </main>
  )
}
