import React from 'react'
import Image from 'next/image'
export default function Presentation() {
  return (
    <>
      <section className="w-full flex flex-col gap-5 w-full md:w-2/3 lg:w-3/4 text-start ">
        <h1 className="font-bold font-sans text-center md:text-start text-2xl">Présentation du zoo</h1>
        <p className="text-start text-l">
          Bienvenue au Zoo Arcadia, un lieu de merveilles et de découvertes. Notre zoo offre une expérience unique avec une variété d&apos;animaux, de beaux paysages et des programmes éducatifs.
        </p>
        
        <div className="flex gap-6 justify-center">
        <Image src="/images/Lion.png" alt="Image du zoo 1" width={300} height={200} className="max-w-xs rounded-md shadow-md" />
        <Image src="/images/Lynx2.png" alt="Image du zoo 2" width={300} height={200} className="max-w-xs rounded-md shadow-md" />
        <Image src="/images/Tiger.png" alt="Image du zoo 3" width={300} height={200} className="max-w-xs rounded-md shadow-md" />
        </div>
      </section>
    </>
  )
}
