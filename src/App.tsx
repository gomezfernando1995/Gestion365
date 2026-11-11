import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Register from './pages/register'
import Fondo from '../src/assets/fondo1.jpg'
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Users from "./pages/users";
import LayoutDashboard from "./components/LayoutDashboard";
import Incidents from "./pages/incidents";
import { Reports } from "./pages/reports";
import Settings from "./pages/settings";
import IncidentDetails from "./pages/incidentDatails"
import Establishment from "./pages/establishment";
import UserDetails from "./pages/userDetails";
import EstablishmentDetails from "./pages/establishmentDetails";
import ContactUs from "./pages/contact";
import MyIncidents from "./pages/myIncidents";

export default function App() {

  const bgImagen = {
    backgroundImage: `url(${Fondo})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom",
    backgroundSize: "cover",
    position: "relative",
  } as const;

  const userLogin = localStorage.getItem("currentUser")

  return (
    <Router>
      <div style={bgImagen} className="overflow-hidden min-h-screen">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" ></div> {/* capa oscura */}
        <div className="relative">
          {!userLogin && <Navbar />}

          <Routes>
            {!userLogin ? (
              // USUARIO NO LOGEADO
              <>
                <Route path="/" element={<Hero />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<ContactUs />} />
                {/* Si intenta ir al dashboard sin login → redirige a "/" */}
                <Route path="/dashboard" element={<Navigate to="/" />} />
              </>
            ) : (
              // USUARIO LOGEADO
              <>
                {/* Si está logueado y entra a "/", "/login" o "/register" → redirige al dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/login" element={<Navigate to="/dashboard" />} />
                <Route path="/register" element={<Navigate to="/dashboard" />} />

                <Route path="/" element={<LayoutDashboard />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/incidents" element={<Incidents />} />
                  <Route path="/myIncidents" element={<MyIncidents/>}/>
                  <Route path="/incidents/:id" element={<IncidentDetails />} />
                  <Route path="/establishment" element={<Establishment />} />
                  <Route path="/establishment/:id" element={<EstablishmentDetails />} />

                  <Route path="/reports" element={<Reports />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/users/:id" element={<UserDetails />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  )
}
