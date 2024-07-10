"use client"
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { decodeToken } from '@/lib/decode'; // Assurez-vous d'importer correctement la fonction

interface User {
    id: string;
    email: string;
    role: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname() ?? '/';

    const authorizedRoutes = ['/', '/login', '/contact', '/services', '/habitats'];

    useEffect(() => {
        const fetchUserData = () => {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = decodeToken(token);
                if (decodedToken) {
                    const userData: User = {
                        id: decodedToken.userId,
                        role: decodedToken.userRole, // Ajoutez ici le rôle si nécessaire
                        email: decodedToken.userEmail // Assuming userEmail is present in the decodedToken
                    };
                    setUser(userData);
                } else {
                    localStorage.removeItem('token');
                    router.push('/login');
                }
            } else {
                setUser(null);
                router.push('/');
            }
            setLoading(false);
        };

        fetchUserData();

        const handleStorageChange = () => {
            fetchUserData();
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (loading) return; // Attendre que le chargement soit terminé

        if (!user && !authorizedRoutes.includes(pathname)) {
            router.push('/');
        } else if (user?.role !== "ADMIN" && pathname.includes("/admin")) {
            router.push('/');
        } else if ((user?.role !== "ADMIN" && user?.role !== "EMPLOYEE" && user?.role !== "VETERINARIAN") && pathname.includes("/auth")) {
            router.push('/');
        } else if (user?.role === "VETERINARIAN" && pathname.includes("/employee")) {
            router.push('/');
        } else if (user?.role === "EMPLOYEE" && pathname.includes("/veterinarian")) {
            router.push('/');
        } else if (user?.role !== "ADMIN" && pathname.includes("/api")) {
            router.push('/'); // Rediriger vers la page d'accueil si l'utilisateur n'est pas administrateur et essaie d'accéder à une route contenant "/api"
        }
    }, [user, pathname, router, loading]);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};