import axios from "axios";
import { data } from "react-router-dom";

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:3000/HB',
  timeout: 5000
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export const login = async (data) => {
  try {
    const response = await apiClient.post('/v1/auth/login', data);
    console.log("Respuesta completa del backend:", response.data);

    const userDetails = response.data.userDetails;

    if (!userDetails) {
      throw new Error("No se encontró userDetails en la respuesta del backend");
    }

    console.log("Token recibido del backend:", userDetails.token);

    localStorage.setItem("token", userDetails.token);
    localStorage.setItem("branchId", userDetails.branchId);
    localStorage.setItem("user", JSON.stringify(userDetails));
    localStorage.setItem("roleUser", userDetails.role);

    return userDetails;
  } catch (e) {
    console.error({
      status: e.response?.status,
      method: e.config?.method,
      url: `${e.config?.baseURL}${e.config?.url}`,
      response: e.response?.data,
    });
    return { error: true, e };
  }
};

export const register = async (data) => {
  try {
    const response = await apiClient.post('/auth/register', data);
    return response.data
  } catch (e) {
    console.log(e)
    return {  
      error: true,
      message: e.response?.data?.error || e.message || "Error desconocido",
      e
    };
  }
};

export const getHoursBeca = async () => {
  try {
    const response = await apiClient.get('/v1/hoursBeca/getHoursBeca');
    return response.data;
  } catch (e) {
    return {
      error: true,
      e: e.response?.data?.error || e.message
      
    };
  }
};

export const assignUser = async(data) => {
  try {
    const response = await apiClient.post(`/v1/hoursBeca/assingUser`, data);
    return response.data
  } catch (e) {
    return {
      error: true,
      message: e.response?.data?.error || e.message,
    }
  }
}

export const getHoursBecaById = async (id) => {
  try {
    const response = await apiClient.get(`/v1/hoursBeca/getHoursBecaById/${id}`);
    return response.data;
  } catch (e) {
    console.log(e)
    console.error("Error al obtener reporte por ID:", e.response?.data || e.message);
    return {
      error: true,
      message: e.response?.data?.msg || "Error desconocido al obtener reporte.",
      status: e.response?.status,
    };
  }
};

export const getHoursBecaPending = async () => {
  try {
    const response = await apiClient.get(`/v1/hoursBeca/pending`);
    return response.data;
  } catch (e) {
    console.log(e)
    console.error("Error al obtener reporte por ID:", e.response?.data || e.message);
    return {
      error: true,
      message: e.response?.data?.msg || "Error desconocido al obtener reporte.",
      status: e.response?.status,
    };
  }
};

export const activeHoursBeca = async (id) => {
  try {
    const response = await apiClient.post(`v1/hoursBeca/activate/${id}`);
    return response
  } catch (e) {
    console.log(e)
    return {
      error: true,
      message: e.response?.data.error || e.message
    }
  }
};