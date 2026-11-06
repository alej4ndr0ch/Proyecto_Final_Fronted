import { Navigate } from "react-router-dom";
import { Login } from "./components/Login";
import { HomePage } from "./pages/Homepage"
import AssignUser  from "./components/HoursBeca/AssignUser";
import  HoursBecaPending  from "./components/HoursBeca/HoursBecaPending"
import { HoursBecaDone } from "./components/User/HoursBecaDone";

const routes = [
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/Homepage", element: <HomePage /> },
  { path: "/assignUser/:id", element: <AssignUser  /> },
  { path: "/HoursBecaPending", element: <HoursBecaPending  /> },
  { path: "/hoursBecaDone", element: <HoursBecaDone  /> },
];

export default routes;