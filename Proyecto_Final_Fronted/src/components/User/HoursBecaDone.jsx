import { useState } from "react";
import { SidebarAdmin } from "../sidebar/sidebarAdmin";
import { SidebarUsers } from "../sidebar/sidebarUser";

export const HoursBecaDone = () => {
    const role = localStorage.getItem("roleUser");

    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch {
            return null;
        }
    });

    if (!user) {
        return <p className="p-6">Inicia sesión para ver tu información.</p>;
    }

    return (
        <>
            {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUsers />}
            <div className="ml-64 min-h-screen min-w-0 bg-slate-50 p-6 md:p-8">
                <section className="mx-auto max-w-xl overflow-hidden rounded-2xl bg-white shadow-lg">
                    <div className="bg-gradient-to-r from-emerald-800 to-green-600 px-6 py-8 text-center text-white">
                        <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
                            Horas beca completadas
                        </p>
                        <p className="mt-2 text-6xl font-extrabold">
                            {user.horasBecaDone ?? 0}
                        </p>
                        <p className="mt-1 text-green-100">horas</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Nombre</p>
                            <p className="font-semibold text-slate-900">{user.name || "No disponible"}</p>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500">Apellido</p>
                            <p className="font-semibold text-slate-900">{user.surname || "No disponible"}</p>
                        </div>

                        <div className="sm:col-span-2">
                            <p className="text-sm font-medium text-slate-500">Carné</p>
                            <p className="font-semibold text-slate-900">{user.carne || "No disponible"}</p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};