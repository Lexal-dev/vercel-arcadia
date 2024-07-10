"use client"
import React, { useState } from 'react';
import NekoToast from '@/components/ui/_partial/Toast'; // Assurez-vous que le chemin d'importation est correct

interface FormContactProps {}

const FormContact: React.FC<FormContactProps> = () => {
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastState, setToastState] = useState<{ type: 'Success' | 'Error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch('/api/gmail/gmailConnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setToastState({ type: 'Success', message: 'Envoi du contact réussi !' });
        setFormData({
          email: '',
          title: '',
          message: '',
        });
      } else {
        const error = await response.json();
        setToastState({ type: 'Error', message: `Échec de l'envoi du contact: ${error}` });
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      setToastState({ type: 'Error', message: 'Erreur réseau lors de l\'envoi du message.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeToast = () => {
    setToastState(null);
  };

  return (
    <>
      <form className="flex flex-col w-full md:min-w-[500px] border-2 border-slate-300 bg-muted rounded-md p-6 gap-6" onSubmit={handleSubmit}>
        <div className="flex gap-3 justify-center items-center">
          <label className="w-1/3 text-lg font-bold">Email : </label>
          <input
            type="email"
            name="email"
            placeholder="arcadia.zoo@yahoo.fr"
            className="w-2/3 p-2 rounded-md bg-background hover:bg-muted-foreground"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex gap-3 justify-center items-center">
          <label className="w-1/3 text-lg font-bold">Titre : </label>
          <input
            type="text"
            name="title"
            placeholder="Animaux sauvage..."
            className="w-2/3 p-2 rounded-md bg-background hover:bg-muted-foreground"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex gap-3 justify-center items-center">
          <label className="w-1/3 text-lg font-bold">Contact </label>
          <textarea
            name="message"
            placeholder="Insérez votre demande ici ..."
            className="w-2/3 p-2 rounded-md bg-background hover:bg-muted-foreground"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="border-2 border-green-400 bg-green-200 hover:bg-green-300 text-green-700 p-1 mt-2 rounded-md"
          disabled={isLoading}
        >
          {isLoading ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>
      {isSuccess && (
        <p className="text-green-700 text-center mt-4">Votre message a été envoyé avec succès !</p>
      )}
      {toastState && (
        <NekoToast toastType={toastState.type} toastMessage={toastState.message} timeSecond={3} onClose={closeToast} />
      )}
    </>
  );
};

export default FormContact;