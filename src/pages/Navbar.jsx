import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
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
              <Link className="nav-link" to="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mes-reservations">Mes réservations</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mes-billets">Mes billets</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profil">Profil</Link>
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