import { useCallback, useEffect, useState } from "react";
import { getHoursBecaPending, activeHoursBeca } from "../../services/api";

export const usePendingHour = () => {
    const [hoursBecas, setHoursBecas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPendingHours = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await getHoursBecaPending();

            if (result?.error) {
                throw new Error(result.message || "No se pudieron cargar las horas beca.");
            }
            const list = Array.isArray(result) ? result : result?.hoursBeca;
            setHoursBecas(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingHours();
    }, [fetchPendingHours]);

    const changeHoursBecasStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "Active" ? "Pending" : "Active";

        try {
            setLoading(true);

            const result = await activeHoursBeca(id, { status: newStatus });

            if (result?.error) {
                throw new Error(result.message || "No se pudo cambiar el estado.");
            }
            setHoursBecas((previous) =>
                newStatus === "Active"
                    ? previous.filter((activity) => String(activity._id) !== String(id))
                    : previous.map((activity) =>
                        String(activity._id) === String(id)
                            ? { ...activity, status: newStatus }
                            : activity
                    )
            );

            return {
                success: true,
                message: result.message || result.msg || "Estado actualizado.",
            };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || err.message,
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        hoursBecas,
        loading,
        error,
        refresh: fetchPendingHours,
        changeHoursBecasStatus,
    };
};