"use client"
import SpaceNav from "@/components/ui/_partial/SpaceNav";

export default function NavigationLayout({ children }: { children: React.ReactNode }) {

    
    return (
            <section className="w-full">
                <SpaceNav role="VETERINARIAN"/>
                {children}
            </section>
    );
}