import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import jwtDecode from 'jwt-decode';
import Navbar from './Navbar';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [trajets, setTrajets] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    } catch (err) {
      console.error("Token invalide", err);
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }

    api
      .get("/trajet")
      .then((res) => setTrajets(res.data))
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate]);

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Contenu principal */}
      <div
        className="min-vh-100 d-flex flex-column align-items-center justify-content-start"
        style={{
          background: 'linear-gradient(135deg, #000 80%, #222 100%)',
          color: '#fff',
          padding: '2rem',
        }}
      >
        <div
          className="w-100"
          style={{
            maxWidth: 700,
            background: 'rgba(30,30,30,0.95)',
            borderRadius: '18px',
            boxShadow: '0 4px 32px #000a',
            padding: '2rem',
          }}
        >
          {user && (
            <h2 className="mb-4" style={{ fontWeight: 700, letterSpacing: 1 }}>
              Bienvenue, <span style={{ color: '#0ff' }}>{userInfo.prenom}</span> 👋
            </h2>
          )}

          {userInfo && (
            <div className="mb-4 text-right">
              <h5>INFO :  {userInfo.prenom} {userInfo.nom}</h5>
              <p>Rôle : {userInfo.role}</p>
            </div>
          )}

          <h3 className="mb-3" style={{ borderBottom: '1px solid #333', paddingBottom: 8 }}>
            Liste des trajets disponibles
          </h3>
          <ul className="list-group mb-4" style={{ background: 'transparent' }}>
            {trajets.length === 0 && (
              <li className="list-group-item bg-dark text-secondary border-0">
                Aucun trajet disponible pour le moment.
              </li>
            )}
            {trajets.map((t) => (
              <li
                key={t.id}
                className="list-group-item d-flex justify-content-between align-items-center bg-dark text-light mb-2"
                style={{
                  border: '1px solid #222',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, #111 80%, #222 100%)',
                }}
              >
                <span>
                  <strong>{t.depart}</strong> <span style={{ color: '#0ff' }}>→</span> <strong>{t.arrivee}</strong>
                  <span className="ms-3 badge bg-secondary">{t.prix} €</span>
                </span>
                <button className="btn btn-outline-info btn-sm" disabled>
                  Réserver
                </button>
              </li>
            ))}
          </ul>
          <p className="text-secondary" style={{ fontStyle: 'italic' }}>
            Pour réserver un trajet, cliquez sur le bouton "Réserver" à côté du trajet souhaité.
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;