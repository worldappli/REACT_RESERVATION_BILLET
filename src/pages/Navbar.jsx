import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  //Fonction pour verifier si un onglet est actif
  const isActive = (path) => {
    return location.pathname === path
  }

  //className={isActive("/") ? 'active fw-bold' : "nav-link" }  to="/"

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm mb-4">
      <div className="container">
        <Link className= "navbar-brand fw-bold" to="/">
          Réservation Billet
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={isActive("/") ? "nav-link active fw-bold text-white" : "nav-link text-light-emphasis"}  to="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/mes-reservations") ? "nav-link active fw-bold text-white" : "nav-link text-light-emphasis"} to="/mes-reservations">Mes réservations</Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/mes-billets") ? "nav-link active fw-bold text-white" : "nav-link text-light-emphasis"} to="/mes-billets">Mes billets</Link>
            </li>
            <li className="nav-item">
              <Link className={isActive("/profil") ? "nav-link active fw-bold text-white" : "nav-link text-light-emphasis"} to="/profil">Profil</Link>
            </li>
            <li className="nav-item">
              <button
                className="btn btn-outline-light btn-sm ms-2"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;