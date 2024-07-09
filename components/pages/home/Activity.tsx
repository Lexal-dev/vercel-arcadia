import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Activity() {
  return (
    <>
      <section className="w-full flex flex-col gap-5 w-full md:w-2/3 lg:w-3/4 text-start px-2">
        <h3 className="font-bold font-sans text-center text-start text-3xl">Les différentes activités du parc</h3>
        <p className="text-start text-lg">
          Arcadia vous propose une multitude d&apos;activités allant du visionnage des habitats au animaux qui y vivent.
          Aussi vous aurez accès à plusieurs services comprenant un train qui fait le tour du parc, un guide audio et bien d&apos;autres services.
        </p>
        <div className='w-full md:flex justify-between text-md'>

          <div className='flex flex-col items-center mb-6'>
              <div className='flex flex-col mb-6'>
              <p className='text-md min-h-[100px]'>Pour accéder à nos habitats et animaux</p> 
                <Link href="/habitats" className='text-center text-blue-300 hover:text-blue-400 hover:text-bold'>clickez ici</Link>
              </div>

              <div className="flex flex-wrap max-w-400 max-h-400 bg-black">
                <div className="w-1/2 border-2 border-green-300 flex items-center justify-center">
                  <Image src="/images/habitats/Marais.jpeg" width={200} height={200} alt="habitats&animaux" />
                </div>
                <div className="w-1/2 border-2 border-green-300 flex items-center justify-center">
                  <Image src="/images/lion.png" width={200} height={200} alt="habitats&animaux" />
                </div>
                <div className="w-1/2 border-2 border-green-300 flex items-center justify-center">
                  <Image src="/images/Tiger.png" width={200} height={200} alt="habitats&animaux" />
                </div>
                <div className="w-1/2 border-2 border-green-300 flex items-center justify-center">
                  <Image src="/images/habitats/Plaine.jpeg" width={200} height={200} alt="habitats&animaux" />
                </div>
              </div>      
            </div>
            <div className='px-3'></div>
            <div className='flex flex-col items-center mb-6'>
            <div className='flex flex-col mb-6'>
                  <p className='text-md min-h-[100px]'>Pour accéder à nos services</p>
                  <Link href="/service" className='text-center text-blue-300 hover:text-blue-400 hover:text-bold'>clickez ici</Link>  
              </div>

              <div className="flex flex-wrap max-w-400 max-h-400 bg-black">
                <div className="w-1/2 border-2 border-green-300 flex items-center justify-center">
                  <Image src="/images/habitats/Marais.jpeg" width={200} height={200} alt="habitats&animaux" />
                </div>
                <div className="w-1/2 border-2 border-green-300 flex items-center justify-center">
                  <Image src="/images/lion.png" width={200} height={200} alt="habitats&animaux" />
                </div>
                <div className="w-1/2 border-2 border-green-300 flex items-center justify-center">
                  <Image src="/images/Tiger.png" width={200} height={200} alt="habitats&animaux" />
                </div>
                <div className="w-1/2 border-2 border-green-300 flex items-center justify-center">
                  <Image src="/images/habitats/Plaine.jpeg" width={200} height={200} alt="habitats&animaux" />
                </div>
              </div> 
            </div>
          </div>
      </section>
    </>
  )
}