"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
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
        <main className='min-h-[500px] flex flex-col items-center justify-center'>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} className='flex flex-col justify-around min-w-[3/4] min-h-[200px] bg-slate-500 p-4 rounded-lg gap-3'>
                <h3 className='text-3xl text-center mb-6'>Connexion</h3>

                <div className='flex justify-center items-center'>
                    <label htmlFor="email" className='w-1/2 text-lg'>Email</label>
                    <input type="email" id="email" className='w-1/2 rounded-md p-1 text-md text-slate-600' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className='flex justify-center items-center'>
                    <label htmlFor="password" className='w-1/2 text-lg'>Mot de passe</label>
                    <input type="password" id="password"  className='w-1/2 rounded-md p-1 text-md text-slate-600'value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className='w-full flex justify-center'>
                    <button type="submit" className='my-2 p-2 border border-slate-600 bg-green-500 hover:bg-green-600 rounded-md'>Se connecter</button>
                </div>
            </form>
        </main>
    );
};

export default LoginPage;