import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ReservationPage from "./pages/ReservationPage";
import PaiementPage from "./pages/PaiementPage";
import MesReservations from "./pages/MesReservations";
import CompagnieLogin from "./pages/CompagnieLogin";
import HomeCompagnie from "./pages/HomeCompagnie";
import Profil from "./pages/profil";
import ConfirmationPage from "./pages/ConfirmationPage";
import Billets from "./pages/billets";
import MesBillets from "./pages/MesBillets";
import VerifyPage from "./pages/VerifyPage";
import RegisterCompagniePage from "./pages/RegisterCompagniePage";
import VerifyCompagniePage from "./pages/VerifyCompagniePage";
import CompagnieProfil from "./pages/CompagnieProfil";

function App() {
  return (
   
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/compagnie-login" element={<CompagnieLogin />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reservation/:id" element={<ReservationPage />} />
          <Route path="/paiement/" element={<PaiementPage />} />
          <Route path="/mes-reservations" element={<MesReservations />} />
          <Route path="/compagnie" element={<HomeCompagnie />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/billets" element={<Billets />} />
          <Route path="/mes-billets" element={<MesBillets />} />
          <Route path="/verification" element={<VerifyPage />} />
          <Route path="/register-compagnie" element={<RegisterCompagniePage />} />
          <Route path="/c/verification" element={<VerifyCompagniePage />} />
          <Route path="/compagnie-profil" element={<CompagnieProfil />} />
        </Routes>
      </Router>
  
  );
}

export default App;
