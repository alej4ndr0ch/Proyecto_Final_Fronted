import { useState } from "react";
import { usePendingHour } from "../../shared/hooks/usePendingHour";
import { SidebarAdmin } from "../sidebar/sidebarAdmin";
import { SidebarUsers } from "../sidebar/sidebarUser";

const formatPerson = (person) => {
  if (!person) return "Sin asignar";
  if (typeof person === "string") return person;

  return (
    [person.name, person.surname].filter(Boolean).join(" ") ||
    person.carne ||
    "Sin asignar"
  );
};

const HoursBecaPending = ({ onHoursBecaSelect }) => {
  const { hoursBecas, loading, error, refresh } = usePendingHour();
  const role = localStorage.getItem("roleUser");
  const [searchTerm, setSearchTerm] = useState("");

  const records = Array.isArray(hoursBecas) ? hoursBecas : [];
  const query = searchTerm.trim().toLowerCase();

  const filteredHoursBeca = records.filter((activity) => {
    const text = [
      activity.name,
      activity.hour,
      activity.day,
      activity.place,
      activity.status,
      formatPerson(activity.managerID),
      formatPerson(activity.studentID),
    ]
      .map((value) => String(value ?? "").toLowerCase())
      .join(" ");

    return text.includes(query);
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-800">
        <p>{error}</p>
        <button
          type="button"
          onClick={refresh}
          className="mt-3 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
    {role === "ADMIN" ? <SidebarAdmin /> : <SidebarUsers />}
      <div className="ml-64 min-h-screen min-w-0 bg-slate-50 p-6 md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          aria-label="Buscar horas beca"
          placeholder="Buscar por actividad, día, lugar o persona..."
          className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <button
          type="button"
          onClick={refresh}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Actualizar lista
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Mostrando {filteredHoursBeca.length} de {records.length} actividades
      </p>

      {filteredHoursBeca.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center shadow">
          <p className="font-medium text-gray-900">
            {query
              ? "No se encontraron actividades."
              : "No hay horas beca pendientes."}
          </p>

          {query && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader>Actividad</TableHeader>
                <TableHeader>Horas</TableHeader>
                <TableHeader>Día</TableHeader>
                <TableHeader>Lugar</TableHeader>
                <TableHeader>Encargado</TableHeader>
                <TableHeader>Estudiante</TableHeader>
                <TableHeader>Estado</TableHeader>
                {onHoursBecaSelect && <TableHeader>Acción</TableHeader>}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredHoursBeca.map((activity) => (
                <tr
                  key={activity._id ?? activity.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {activity.name || "Sin descripción"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {activity.hour ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {activity.day ? String(activity.day) : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {activity.place || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatPerson(activity.managerID)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatPerson(activity.studentID)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {activity.status || "N/A"}
                  </td>

                  {onHoursBecaSelect && (
                    <td className="px-6 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => onHoursBecaSelect(activity)}
                        className="font-medium text-blue-600 hover:text-blue-900"
                      >
                        Ver detalles
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
};

const TableHeader = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
    {children}
  </th>
);

export default HoursBecaPending;