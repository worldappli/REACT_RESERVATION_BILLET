import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // Fonction pour vérifier si un onglet est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Fonction pour toggle le menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fonction pour fermer le menu après clic sur un lien
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Récupérer les informations utilisateur pour l'affichage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{
      background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%)",
      borderBottom: "1px solid rgba(13, 202, 240, 0.2)",
      backdropFilter: "blur(10px)"
    }}>
      <div className="container">
        {/* Brand avec style moderne */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/" style={{
          fontSize: '1.5rem',
          background: 'linear-gradient(90deg, #0dcaf0 0%, #00b894 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          <i className="fas fa-train me-2"></i>
          Réservation Billet
        </Link>

        {/* Bouton toggle pour mobile */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          style={{
            boxShadow: 'none !important',
            border: '1px solid rgba(13, 202, 240, 0.3)'
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu de navigation avec contrôle manuel */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* Accueil */}
            <li className="nav-item mx-1">
              <Link 
                className={`nav-link position-relative px-3 py-2 rounded-pill ${
                  isActive("/") 
                    ? "active fw-bold text-white" 
                    : "text-light-emphasis"
                }`}
                to="/"
                onClick={closeMenu}
                style={{
                  transition: 'all 0.3s ease',
                  background: isActive("/") 
                    ? 'linear-gradient(135deg, #0dcaf0 0%, #0099cc 100%)' 
                    : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive("/")) {
                    e.target.style.background = 'rgba(13, 202, 240, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/")) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <i className="fas fa-home me-2"></i>
                Accueil
                {isActive("/") && (
                  <span className="position-absolute bottom-0 start-50 translate-middle-x bg-warning rounded-pill"
                    style={{ width: '6px', height: '6px' }}></span>
                )}
              </Link>
            </li>

            {/* Mes réservations */}
            <li className="nav-item mx-1">
              <Link 
                className={`nav-link position-relative px-3 py-2 rounded-pill ${
                  isActive("/mes-reservations") 
                    ? "active fw-bold text-white" 
                    : "text-light-emphasis"
                }`}
                to="/mes-reservations"
                onClick={closeMenu}
                style={{
                  transition: 'all 0.3s ease',
                  background: isActive("/mes-reservations") 
                    ? 'linear-gradient(135deg, #0dcaf0 0%, #0099cc 100%)' 
                    : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive("/mes-reservations")) {
                    e.target.style.background = 'rgba(13, 202, 240, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/mes-reservations")) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <i className="fas fa-calendar-check me-2"></i>
                Mes réservations
                {isActive("/mes-reservations") && (
                  <span className="position-absolute bottom-0 start-50 translate-middle-x bg-warning rounded-pill"
                    style={{ width: '6px', height: '6px' }}></span>
                )}
              </Link>
            </li>

            {/* Mes billets */}
            <li className="nav-item mx-1">
              <Link 
                className={`nav-link position-relative px-3 py-2 rounded-pill ${
                  isActive("/mes-billets") 
                    ? "active fw-bold text-white" 
                    : "text-light-emphasis"
                }`}
                to="/mes-billets"
                onClick={closeMenu}
                style={{
                  transition: 'all 0.3s ease',
                  background: isActive("/mes-billets") 
                    ? 'linear-gradient(135deg, #0dcaf0 0%, #0099cc 100%)' 
                    : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive("/mes-billets")) {
                    e.target.style.background = 'rgba(13, 202, 240, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/mes-billets")) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <i className="fas fa-ticket-alt me-2"></i>
                Mes billets
                {isActive("/mes-billets") && (
                  <span className="position-absolute bottom-0 start-50 translate-middle-x bg-warning rounded-pill"
                    style={{ width: '6px', height: '6px' }}></span>
                )}
              </Link>
            </li>

            {/* Profil */}
            <li className="nav-item mx-1">
              <Link 
                className={`nav-link position-relative px-3 py-2 rounded-pill ${
                  isActive("/profil") 
                    ? "active fw-bold text-white" 
                    : "text-light-emphasis"
                }`}
                to="/profil"
                onClick={closeMenu}
                style={{
                  transition: 'all 0.3s ease',
                  background: isActive("/profil") 
                    ? 'linear-gradient(135deg, #0dcaf0 0%, #0099cc 100%)' 
                    : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive("/profil")) {
                    e.target.style.background = 'rgba(13, 202, 240, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive("/profil")) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <i className="fas fa-user me-2"></i>
                Profil
                {isActive("/profil") && (
                  <span className="position-absolute bottom-0 start-50 translate-middle-x bg-warning rounded-pill"
                    style={{ width: '6px', height: '6px' }}></span>
                )}
              </Link>
            </li>

            {/* Badge utilisateur - visible seulement sur desktop */}
            {/* {userInfo && userInfo.prenom && (
              <li className="nav-item mx-2 d-none d-lg-block">
                <div className="d-flex align-items-center text-light bg-dark rounded-pill px-3 py-1">
                  <i className="fas fa-user-circle me-2 text-info"></i>
                  <small className="fw-semibold">
                    {userInfo.prenom}
                  </small>
                </div>
              </li>
            )} */}

            {/* Bouton déconnexion */}
            <li className="nav-item ms-2">
              <button
                className="btn btn-outline-light btn-sm rounded-pill px-3 fw-semibold"
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                style={{
                  transition: 'all 0.3s ease',
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#ff6b6b';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#ff6b6b';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <i className="fas fa-sign-out-alt me-1"></i>
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Styles CSS supplémentaires */}
      <style>
        {`
          .navbar-nav .nav-link {
            position: relative;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .navbar-nav .nav-link:hover {
            transform: translateY(-2px);
          }

          .navbar-brand:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease;
          }

          @media (max-width: 991.98px) {
            .navbar-nav .nav-link {
              margin: 0.5rem 0;
              text-align: center;
              justify-content: center;
            }
            
            .navbar-collapse {
              background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 100%);
              border-radius: 1rem;
              margin-top: 1rem;
              padding: 1rem;
              border: 1px solid rgba(13, 202, 240, 0.2);
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }

            .navbar-nav {
              align-items: center !important;
            }

            .nav-item {
              width: 100%;
              display: flex;
              justify-content: center;
            }

            .nav-link {
              width: 90%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }

          /* Animation pour l'indicateur actif */
          @keyframes pulse {
            0% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.2); }
            100% { transform: translateX(-50%) scale(1); }
          }

          .position-absolute.bg-warning {
            animation: pulse 2s infinite;
          }

          /* Transition pour l'ouverture/fermeture du menu */
          .navbar-collapse {
            transition: all 0.3s ease-in-out;
          }
        `}
      </style>
    </nav>
  );
};

export default Navbar;