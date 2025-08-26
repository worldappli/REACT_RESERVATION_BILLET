import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import jwtDecode from 'jwt-decode';
import Navbar from './Navbar';
import { Container, Row, Col, Modal, Button } from "react-bootstrap";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [trajets, setTrajets] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [selectedHoraire, setSelectedHoraire] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [horaires, setHoraires] = useState([]);
  const monnaie = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
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

  // Récupération de la liste des horaires
  useEffect(() => {
    api
      .get("/horaire")
      .then((res) => setHoraires(res.data))
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });
  }, [navigate]);

  // Fonction pour ouvrir le modal détail
  const handleShowDetail = (trajet, horaire) => {
    setSelectedTrajet(trajet);
    setSelectedHoraire(horaire);
    setShowDetail(true);
  };

  // Fonction pour fermer le modal détail
  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedTrajet(null);
    setSelectedHoraire(null);
  };

  return (
    <>
      <Navbar />

      {/* Modal Détail Trajet */}
      <Modal show={showDetail} onHide={handleCloseDetail} centered>
        <Modal.Header closeButton className='bg-secondary text-light'>
          <Modal.Title>Détail du trajet</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark text-light'>
          {selectedTrajet && selectedHoraire && (
            <div>
              <p><strong>Date de départ :</strong> {selectedHoraire.dateDepart ? new Date(selectedHoraire.dateDepart).toLocaleString() : "N/A"}</p>
              <p><strong>Départ :</strong> {selectedTrajet.gare_depart.nom} ({selectedTrajet.gare_depart.ville})</p>
              <p><strong>Arrivée :</strong> {selectedTrajet.gare_arrivee.nom} ({selectedTrajet.gare_arrivee.ville})</p>
              <p><strong>Prix :</strong> {monnaie.format(selectedTrajet.prix)}</p>
              <p><strong>Compagnie :</strong> {selectedTrajet.transport.compagnie.nom}</p>
              <p><strong>Transport :</strong> {selectedTrajet.transport.type} n°{selectedTrajet.transport.numero}</p>
              <p><strong>Durée :</strong> {selectedTrajet.duree} min</p>
              {selectedTrajet.arret && (
                <p><strong>Arrêts :</strong> {selectedTrajet.arret}</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className='bg-secondary'>
          <Button variant="secondary" onClick={handleCloseDetail}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Contenu principal */}
      <Container
        fluid
        className="py-5"
        style={{ background: "#181920", minHeight: "100vh" }}
      >
        <Row className="justify-content-center">
          <Col xs={12} md={12} lg={10} xl={8}>
            <div
              className="bg-dark rounded-4 shadow p-3 p-md-5"
              style={{
                background: 'rgba(30,30,30,0.95)',
                boxShadow: '0 4px 32px #000a',
              }}
            >
              {userInfo && (
                <h2 className="mb-4" style={{ fontWeight: 700, letterSpacing: 1 }}>
                   <span style={{ color: '#0ff' }}> {`Bienvenue ${userInfo.prenom}`}</span> 👋
                </h2>
              )}

              {userInfo && (
                <div className="mb-4" style={{ color: "#a4b0be", fontSize: 17 }}>
                  <h3 className="bg-danger text-light">INFO GENERALE</h3>
                  <h5>INFO :  {userInfo.prenom} {userInfo.nom}</h5>
                  <h5>Rôle : {userInfo.role}</h5>
                </div>
              )} 
              
              <h3 className="mb-3" style={{ borderBottom: '1px solid #333', paddingBottom: 8 , color: '#10bed4ff'}}>{`Liste des trajets disponibles`} 🚆</h3>
              
              <div className="table-responsive mb-4">
                <table className="table table-dark table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Départ</th>
                      <th>Arrivée</th>
                      <th>Date</th>
                      <th>Prix</th>
                      <th>Compagnie</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trajets.length === 0 || horaires.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-secondary">
                          Aucun trajet disponible pour le moment.
                        </td>
                      </tr>
                    ) : (
                      horaires.map((h) => {
                        const t = trajets.find(trajet => trajet.id === h.trajetId);
                        if (!t) return null;
                        return (
                          <tr key={h.id}>
                            <td>
                              <strong>
                                {t.gare_depart.nom} ({t.gare_depart.ville})
                              </strong>
                            </td>
                            <td>
                              <strong>
                                {t.gare_arrivee.nom} ({t.gare_arrivee.ville})
                              </strong>
                            </td>
                            <td>
                              {h.dateDepart && (
                                <>
                                  {new Date(h.dateDepart).toLocaleDateString()} <br />
                                  <span className="text-info">{new Date(h.dateDepart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </>
                              )}
                            </td>
                            <td>
                              <span className="badge bg-danger">
                                {monnaie.format(t.prix)}
                              </span>
                            </td>
                            <td>
                              {t.transport.compagnie.nom}
                            </td>
                            <td>
                              <div className="d-flex">
                                <button
                                  className="btn btn-outline-info btn-sm me-2"
                                  onClick={() => handleShowDetail(t, h)}
                                >
                                  Détail
                                </button>
                                <button className="btn btn-outline-info btn-sm" disabled>
                                  Réserver
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-secondary" style={{ fontStyle: 'italic' }}>
                Pour réserver un trajet, cliquez sur le bouton "Réserver" à côté du trajet souhaité.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;