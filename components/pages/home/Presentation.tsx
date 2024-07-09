"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

interface Animal {
  id: number;
  name: string;
  etat: string;
  imageUrl: string[];
}

export default function Presentation() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const fetchAnimals = async (additionalParam: string | number) => {
      setLoading(true);
      try {
        const response = await fetch(`/api/animals/read?additionalParam=${encodeURIComponent(additionalParam.toString())}`);
        const data = await response.json();
        if (response.ok) {
          setAnimals(data.animals);

          const urls = data.animals.flatMap((animal: Animal) => {
            if (animal.imageUrl) {
              return animal.imageUrl.filter(url => url); // Filtrer les valeurs non vides
            }
            return [];
          });
          setImageUrls(urls);
        } else {
          setError(data.message || 'Échec de la récupération des animaux');
        }
      } catch (error) {
        console.error('Erreur de récupération des animaux', error);
        setError('Une erreur est survenue lors de la récupération des animaux');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals('animals');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 20000);

    return () => clearInterval(interval);
  }, [currentIndex, imageUrls]);

  const nextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
    setDirection('right');
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
    setDirection('left');
  };

  return (
    <section className="w-full flex flex-col gap-6 w-full md:w-2/3 lg:w-3/4 text-start px-2">
      <h1 className="font-bold font-sans text-center md:text-start text-4xl">Présentation du zoo</h1>
      <p className="text-start text-lg">
        Bienvenue au Zoo Arcadia, un lieu de merveilles et de découvertes. Notre zoo offre une expérience unique avec une
        variété d&apos;animaux, de beaux paysages et des programmes éducatifs.
      </p>

      {loading ? (
        <p className="text-center">Chargement des images...</p>
      ) : (
        <div className="flex flex-col gap-6">
          {imageUrls.length > 0 ? (
            <motion.div
              key={currentIndex}
              className="relative overflow-hidden border-2 bg-black"
              style={{ paddingBottom: '50%' }} // Aspect ratio 2:1
            >
              <motion.div
                className="absolute inset-0 flex justify-center items-center"
                initial={{ opacity: 0, x: direction === 'left' ? '-100%' : '100%' }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, type: 'tween' }}
              >
                <Image
                  src={imageUrls[currentIndex]}
                  layout="fill"
                  objectFit="cover"
                  alt={`Image ${currentIndex}`}
                  className="object-center object-cover"
                />
              </motion.div>
            </motion.div>
          ) : (
            <p>Aucune image disponible.</p>
          )}
          <div className="w-full flex justify-between mt-4">
            <motion.button
              onClick={prevSlide}
              className="text-white text-4xl font-bold px-4 rounded hover:text-green-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <FaAngleLeft />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              className="text-white text-4xl font-bold px-4 rounded hover:text-green-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <FaAngleRight />
            </motion.button>
          </div>
        </div>
      )}

      {error && <p>Erreur : {error}</p>}
      {animals.length === 0 && !loading && !error && <p>Aucun animal trouvé.</p>}
    </section>
  );
}