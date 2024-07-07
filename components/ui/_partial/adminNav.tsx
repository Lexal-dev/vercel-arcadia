"use client";
import Link from "next/link";
import React from 'react';

export default function AdminNav() {
    const adminNav = [
        { name: "Compte rendu Vétérinaire", path: "/compagny/admin/vetLogRead", roles: ["ADMIN"] },
        { name: "Gestionnaire utilisateurs", path: "/compagny/admin/accountsManager", roles: ["ADMIN"] },
        { name: "Gestionnaire horaires", path: "/compagny/admin/hoursManager", roles: ["ADMIN"] },
        { name: "Gestionnaire service", path: "/compagny/admin/servicesManager", roles: ["ADMIN"] },  
    ];

    return (
        <nav className="w-full flex flex-col items-center justify-center border-b-2 border-green-200 pb-6 mb-6">
            <ul className="w-full max-w-4xl mx-auto space-y-4">
                {adminNav.map((navItem, index) => (
                    <li key={index} className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                        <Link href={navItem.path}>
                            <a className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded hover:bg-gray-100">
                                {navItem.name}
                            </a>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    ); 
}