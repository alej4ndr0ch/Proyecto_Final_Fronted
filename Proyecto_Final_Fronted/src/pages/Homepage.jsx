import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SidebarAdmin } from "../components/Sidebar/SidebarAdmin.jsx"
import { SidebarUsers } from "../components/Sidebar/SidebarUser.jsx"
import { getHoursBeca } from "../services/api.jsx";


export const HomePage = () => {
  const [hoursBeca, setHoursBeca] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const role = localStorage.getItem("roleUser");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilter = async () => {
    if (!startDate || !endDate) return alert("Selecciona ambas fechas");

    try {
      const res = await filterLapsedByDate(startDate, endDate);
      setLapseds(res.lapseds);
    } catch (error) {
      console.error("Error al filtrar reportes:", error);
      setErrorMsg("No se pudieron filtrar los reportes.");
    }
  };

  const fetchHoursBecas = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await getHoursBeca();
      const fetchedHoursBecas = Array.isArray(res.hoursBeca) ? res.hoursBeca : [];
      setHoursBeca(fetchedHoursBecas);
    } catch (error) {
      console.error("Error al obtener reportes:", error);
      setErrorMsg("No se pudieron cargar los reportes.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchHoursBecas();
  }, []);

  return (
    <>
      {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUsers />}

      <div className="ml-64 min-h-screen min-w-0 bg-slate-50 p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 rounded-2xl bg-gradient-to-r from-emerald-800 to-green-600 p-8 text-white shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
              Panel principal
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Control de Horas beca
            </h1>
            <p className="mt-2 text-green-50">
              Bienvenido. Aquí puedes consultar tus horas beca.
            </p>
          </header>

          {loading && (
            <p className="text-center text-gray-600 text-lg py-6">
              Cargando reportes...
            </p>
          )}
          {errorMsg && (
            <p className="text-center text-red-600 text-lg py-6">{errorMsg}</p>
          )}
          {!loading && hoursBeca.length === 0 && (
            <p className="text-center text-gray-600 text-lg py-6">
              No hay reportes registrados aún.
            </p>
          )}

          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
            {hoursBeca.map((hourBeca) => {
              const id = hourBeca.id ?? hourBeca._id;

              return (
                <article
                  key={id}
                  className="rounded-xl border border-slate-200 border-l-4 border-l-emerald-600 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="mt-4 space-y-3">
                    {hourBeca.image && (
                      <div className="h-40 w-full overflow-hidden">
                        <img
                          src={hourBeca.image}
                          alt={hourBeca.nameBranch}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <p className="text-xl font-bold text-slate-900">
                      {hourBeca.name || "Registro sin descripción"}
                    </p>
                    <p>
                      <span className="font-medium text-slate-500">Horas: </span>
                      {hourBeca.hour ?? "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-slate-500">Día: </span>
                      {hourBeca.day || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium text-slate-500">Lugar: </span>
                      {hourBeca.place || "N/A"}
                    </p>
                  </div>

                  <div className="mt-9 flex gap-1">
                    <Link
                      to={`/assignUser/${id}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >Asignar</Link>
                  </div>

                  {role === "ADMIN" && (
                    <div className="mt-5 flex gap-2">
                      <Link
                        to={`/LapsedUpdate/${id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};


export default HomePage;  