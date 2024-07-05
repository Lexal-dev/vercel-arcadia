import Link from 'next/link'
import React from 'react'

export default function Activity() {
  return (
    <>
      <section className="w-full flex flex-col gap-5 w-full md:w-2/3 lg:w-3/4 text-start ">
        <h3 className="font-bold font-sans text-center md:text-start text-3xl">Les différentes activités du parc</h3>
        <p className="text-start text-lg">
          Arcadia vous propose une mutlitudes d'activités allant de visionnage des habitats au animaux qui y vivent.
          Aussi vous aurez accès à plusieur service comprennant un train qui fait le tour du parc, un guide audio est bien d'autre service.
        </p>
        <div className='flex justify-between text-md'>
            <p>Pour accéder à nos habitats et animaux <Link href="/habitats" className='text-blue-300 hover:text-blue-400 hover:text-bold'>clickez ici</Link></p>
            <p>Pour accéder à nos service <Link href="/service" className='text-blue-300 hover:text-blue-400 hover:text-bold'>clickez ici</Link></p>
        </div>
      </section>
    </>
  )
}