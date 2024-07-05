import AvisList from '@/components/api/avis/ReadTrueAvis'
import React from 'react'

export default function Avis() {
  return (
    <>
      <section className="w-full flex flex-col gap-5 w-full md:w-2/3 lg:w-3/4 text-start ">
        <h4 className="font-bold font-sans text-center text-3xl">Laissez nous votre avis !</h4>
        <div className="text-start text-lg">
            <p>les avis laissez par nos clients :</p>
            <AvisList />
        </div>

      </section>
    </>
  )
}