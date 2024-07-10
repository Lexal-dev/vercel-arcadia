"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage(){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Vérifier si un token est présent dans le localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Rediriger l'utilisateur vers '/login/auth'
            router.push('/login/auth');
        }
    }, []); // Effect ne dépend d'aucune variable, donc il se déclenchera seulement au montage

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const { message } = await response.json();
                throw new Error(message || 'Erreur lors de la connexion.');
            }

            const { token } = await response.json();

            // Enregistrer le token dans le localStorage
            localStorage.setItem('token', token);

            // Rediriger l'utilisateur vers '/login/auth'
            router.push('/login/auth');
        } catch (error:any) {
            setError(error.message || 'Erreur lors de la connexion.');
        }
    };

    return (
        <main className='flex flex-col w-full items-center justify-center py-12 px-2'>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} className='flex flex-col justify-around md:min-w-[500px] min-h-[350px]  p-4 rounded-lg gap-3 bg-muted shadow-md'>
                <h3 className='text-3xl text-center mb-6'>Connexion</h3>

                <div className='flex justify-center items-center'>
                    <label htmlFor="email" className='w-1/3 text-lg'>Email</label>
                    <input type="email" id="email" className='w-2/3 rounded-md p-1 text-md bg-background hover:bg-muted-foreground' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className='flex justify-center items-center'>
                    <label htmlFor="password" className='w-1/3 text-lg'>Mot de passe</label>
                    <input type="password" id="password"  className='w-2/3 rounded-md p-1 text-md bg-background hover:bg-muted-foreground'value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className='w-full flex'>
                    <button type="submit" className='w-full my-2 p-2 border border-slate-600 bg-green-500 hover:bg-green-600 rounded-md'>Se connecter</button>
                </div>
            </form>
        </main>
    );
};
