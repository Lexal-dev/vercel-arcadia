"use client"
import { useState } from 'react';

export default function FormContact() {
    const [formData, setFormData] = useState({
        email: '',
        title: '',
        message: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

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
                const data = await response.json();
                console.log('Email sent successfully:', data);
                setIsSuccess(true);
                // Réinitialiser le formulaire après un envoi réussi si nécessaire
                setFormData({
                    email: '',
                    title: '',
                    message: '',
                });
            } else {
                const error = await response.json();
                console.error('Failed to send email:', error);
                // Gérer ici les erreurs d'envoi
            }
        } catch (error) {
            console.error('Failed to send email:', error);
            // Gérer ici les erreurs d'exception
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <form className="flex flex-col min-w-[300px] border-2 border-slate-300 rounded-md p-6 gap-6" onSubmit={handleSubmit}>
                <div className="flex gap-3 justify-center items-center">
                    <label className="w-1/3 text-lg font-bold">Email : </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="arcadia.zoo@yahoo.fr"
                        className="w-2/3 p-2 rounded-md text-black"
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
                        className="w-2/3 p-2 rounded-md text-black"
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
                        className="w-2/3 p-2 rounded-md text-black"
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
        </>
    );
}