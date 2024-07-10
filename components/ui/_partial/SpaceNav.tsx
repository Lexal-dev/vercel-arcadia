import Link from "next/link";
import React from 'react';

interface NavItem {
    name: string;
    path: string;
    roles: string[];
}

interface SpaceNavProps {
    role: string; // Role de l'utilisateur, à passer depuis le parent
}

const SpaceNav: React.FC<SpaceNavProps> = ({ role }) => {

    const spaceNav: NavItem[] = [
        { name: "Dashboard", path: "/login/auth/admin/dashboard", roles: ["ADMIN"] },
        { name: "Utilisateurs", path: "/login/auth/admin/usersManager", roles: ["ADMIN"] },
        { name: "Animaux", path: "/login/auth/admin/animalsManager", roles: ["ADMIN"] },
        { name: "Rapports-Vétérinaire", path: "/login/auth/admin/showVetLogs", roles: ["ADMIN"] },
        { name: "Habitats", path: "/login/auth/admin/habitatsManager", roles: ["ADMIN"] },
        { name: "Services", path: "/login/auth/admin/servicesManager", roles: ["ADMIN"] },
        { name: "horraires", path: "/login/auth/admin/hoursManager", roles: ["ADMIN"] },

        { name: "Avis", path: "/login/auth/employee/avisManager", roles: ["EMPLOYEE", "ADMIN"] },
        { name: "Services", path: "/login/auth/employee/servicesManager", roles: ["EMPLOYEE", "ADMIN"] },
        { name: "Nourritures-rapports", path: "/login/auth/employee/foodConsumptionManager", roles: ["EMPLOYEE", "ADMIN"] },

        { name: "Rapports-animalié", path: "/login/auth/veterinarian/vetLogsManager", roles: ["VETERINARIAN", "ADMIN"] },
        { name: "Habitats-commentaire", path: "/login/auth/veterinarian/habCommentsManager", roles: ["VETERINARIAN", "ADMIN"] },
        
    ];

    
    const filteredNavItems = spaceNav.filter(navItem => navItem.roles.includes(role));

    return (
        <nav className="px-4">
            <div className="bg-muted rounded-b-lg py-2">
                <ul className="flex flex-wrap items-center justify-center gap-6">
                    {filteredNavItems.map((navItem, index) => (
                        <li key={index} className="text-lg font-semibold hover:text-secondary">
                            <Link href={navItem.path}>
                                    {navItem.name}    
                            </Link>
                        </li>
                    ))}
                </ul>                
            </div>

        </nav>
    );
};

export default SpaceNav;