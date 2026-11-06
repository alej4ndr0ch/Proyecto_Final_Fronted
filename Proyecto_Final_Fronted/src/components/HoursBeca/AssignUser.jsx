import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assignUser as assignUserRequest, getHoursBecaById } from "../../services/index.js";
import { SidebarAdmin } from "../Sidebar/SidebarAdmin.jsx"
import { SidebarUsers } from "../Sidebar/SidebarUser.jsx"

export const AssignUser = () => {
    const { id } = useParams();
    const role = localStorage.getItem("roleUser");
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadActivity = async () => {
            try {
                const data = await getHoursBecaById(id);
                setActivity(data.hoursBeca ?? data);
            } catch (err) {
                setError(err.response?.data?.message || "No se pudo cargar la actividad.");
            } finally {
                setLoading(false);
            }
        };

        loadActivity();
    }, [id]);

    const handleAssign = async () => {
        setSaving(true);
        setError("");
        setMessage("");

        try {
            const user = JSON.parse(localStorage.getItem("user") || "null");
            const userId = user?._id ?? user?.id;
            const carne = user?.carne;

            const identity = userId
                ? { userId }
                : carne
                    ? { carne }
                    : null;

            if (!identity) {
                throw new Error("No se encontró tu ID ni tu carné en la sesión.");
            }

            const result = await assignUserRequest({
                hoursBecaId: id,
                target: "studentID",
                ...identity,
            });

            setActivity(result.hoursBeca ?? activity);
            setMessage(result.message || "Te asignaste a la actividad.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "No se pudo realizar la asignación."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="p-8">Cargando actividad...</p>;
    if (error && !activity) return <p className="p-8 text-red-600">{error}</p>;
    if (!activity) return <p className="p-8">No se encontró la actividad.</p>;

    return (
        <>
            {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUsers />}
            <div className="ml-64 min-h-screen min-w-0 bg-slate-50 p-6 md:p-8">
                <div>
                    <header className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-800 to-green-600 p-8 text-white shadow-lg">
                        <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
                            Panel principal
                        </p>
                        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                            Asignacion de horas beca
                        </h1>
                        <p className="mt-2 text-green-50">
                            Bienvenido. Aquí puedes asignarte tus horas beca.
                        </p>
                    </header>
                    <section className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow">
                        <h1 className="text-2xl font-bold">{activity.name}</h1>

                        <dl className="mt-5 space-y-3 text-slate-700">
                            <div><dt className="font-semibold">Horas</dt><dd>{activity.hour}</dd></div>
                            <div><dt className="font-semibold">Día</dt><dd>{activity.day || "N/A"}</dd></div>
                            <div><dt className="font-semibold">Lugar</dt><dd>{activity.place || "N/A"}</dd></div>
                        </dl>

                        {message && <p className="mt-4 text-green-700">{message}</p>}
                        {error && <p className="mt-4 text-red-600">{error}</p>}

                        <button
                            type="button"
                            onClick={handleAssign}
                            disabled={saving}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? "Asignando..." : "Asignarme a esta actividad"}
                        </button>
                    </section>
                </div>
            </div>
        </>
    );
};

export default AssignUser;