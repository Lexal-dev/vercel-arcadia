"use client"
import { useState } from 'react';

export default function FormContact() {
    const [formData, setFormData] = useState({
        email: '',
        title: '',
        message: '',
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

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
                // Gérer ici ce que vous voulez faire après l'envoi réussi
            } else {
                const error = await response.json();
                console.error('Failed to send email:', error);
                // Gérer ici les erreurs d'envoi
            }
        } catch (error) {
            console.error('Failed to send email:', error);
            // Gérer ici les erreurs d'exception
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <h2>Contact</h2>
            <form className="flex flex-col min-w-[300px] border-2 border-slate-300 rounded-md p-6 gap-6" onSubmit={handleSubmit}>
                <div className="flex gap-3 justify-center items-center">
                    <label className="w-1/3">Email : </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="arcadia.zoo@yahoo.fr"
                        className="w-2/3 p-2 rounded-md"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex gap-3 justify-center items-center">
                    <label className="w-1/3">Titre : </label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Animaux sauvage..."
                        className="w-2/3 p-2 rounded-md"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex gap-3 justify-center items-center">
                    <label className="w-1/3">Contact </label>
                    <textarea
                        name="message"
                        placeholder="Insérez votre demande ici ..."
                        className="w-2/3 p-2 rounded-md"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="border-2 border-green-400 bg-green-200 hover:bg-green-300 text-green-700 self-center p-1 rounded-md">
                    Envoyer
                </button>
            </form>
        </>
    );
}