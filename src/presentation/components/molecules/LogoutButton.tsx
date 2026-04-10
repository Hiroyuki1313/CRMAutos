"use client";

import { logoutAction } from "@/core/usecases/authService";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
            await logoutAction();
            router.push("/login");
            router.refresh();
        }
    };

    return (
        <button 
            onClick={handleLogout}
            className="flex items-center justify-center size-10 rounded-xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-colors text-zinc-500 hover:text-red-400"
            title="Cerrar Sesión"
        >
            <LogOut className="size-5" />
        </button>
    );
}
