import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import jwtDecode from 'jwt-decode';
import Navbar from '../Components/Navbar';
import { Container, Row, Col, Modal, Button, Card, Badge } from "react-bootstrap";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [trajets, setTrajets] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [selectedHoraire, setSelectedHoraire] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [horaires, setHoraires] = useState([]);
  const [filterDepart, setFilterDepart] = useState('');
  const [filterArrivee, setFilterArrivee] = useState('');
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
      <Modal show={showDetail} onHide={handleCloseDetail} centered size="lg">
        <Modal.Header closeButton className='bg-dark border-secondary'>
          <Modal.Title className="text-info fw-bold">🚄 Détails du trajet</Modal.Title>
        </Modal.Header>
        <Modal.Body className='bg-dark text-light'>
          {selectedTrajet && selectedHoraire && (
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-info rounded p-2 me-3">
                    <i className="fas fa-calendar text-white"></i>
                  </div>
                  <div>
                    <small className="text-muted">Date de départ</small>
                    <p className="mb-0 fw-bold">{selectedHoraire.dateDepart ? new Date(selectedHoraire.dateDepart).toLocaleString() : "N/A"}</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-success rounded p-2 me-3">
                    <i className="fas fa-map-marker-alt text-white"></i>
                  </div>
                  <div>
                    <small className="text-muted">Départ</small>
                    <p className="mb-0 fw-bold">{selectedTrajet.gare_depart.nom} ({selectedTrajet.gare_depart.ville})</p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="bg-warning rounded p-2 me-3">
                    <i className="fas fa-flag-checkered text-white"></i>
                  </div>
                  <div>
                    <small className="text-muted">Arrivée</small>
                    <p className="mb-0 fw-bold">{selectedTrajet.gare_arrivee.nom} ({selectedTrajet.gare_arrivee.ville})</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex align-items-center mb-3">
                  <div className="bg-danger rounded p-2 me-3">
                    <i className="fas fa-euro-sign text-white"></i>
                  </div>
                  <div>
                    <small className="text-muted">Prix</small>
                    <p className="mb-0 fw-bold text-warning">{monnaie.format(selectedTrajet.prix)}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="bg-primary rounded p-2 me-3">
                    <i className="fas fa-building text-white"></i>
                  </div>
                  <div>
                    <small className="text-muted">Compagnie</small>
                    <p className="mb-0 fw-bold">{selectedTrajet.transport.compagnie.nom}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="bg-secondary rounded p-2 me-3">
                    <i className="fas fa-train text-white"></i>
                  </div>
                  <div>
                    <small className="text-muted">Transport</small>
                    <p className="mb-0 fw-bold">{selectedTrajet.transport.type} n°{selectedTrajet.transport.numero}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <div className="bg-purple rounded p-2 me-3">
                    <i className="fas fa-clock text-white"></i>
                  </div>
                  <div>
                    <small className="text-muted">Durée</small>
                    <p className="mb-0 fw-bold">{selectedTrajet.duree} minutes</p>
                  </div>
                </div>
              </div>

              {selectedTrajet.arret && (
                <div className="col-12 mt-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-info rounded p-2 me-3">
                      <i className="fas fa-map-pin text-white"></i>
                    </div>
                    <div>
                      <small className="text-muted">Arrêts intermédiaires</small>
                      <p className="mb-0 fw-bold">{selectedTrajet.arret}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className='bg-dark border-secondary'>
          <Button 
            variant="outline-info" 
            onClick={handleCloseDetail}
            className="fw-bold"
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Contenu principal */}
      <Container fluid className="py-5" style={{ 
        background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
        minHeight: "100vh"
      }}>
        <Row className="justify-content-center">
          <Col xs={12} lg={11} xl={10}>
            {/* Carte de bienvenue */}
            <Card className="border-0 shadow-lg mb-4 bg-dark">
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col md={8}>
                    {userInfo && (
                      <div>
                        <h2 className="text-white fw-bold mb-2">
                          <span style={{ color: '#0ff' }}>Bonjour {userInfo.prenom}</span> 👋
                        </h2>
                        <p className="text-light mb-0">
                          Découvrez nos trajets disponibles et réservez votre prochain voyage
                        </p>
                      </div>
                    )}
                  </Col>
                  <Col md={4} className="text-end">
                    {userInfo && (
                      <Badge bg="outline-info" className="fs-6 p-2 border border-info">
                        {userInfo.role}
                      </Badge>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Filtres */}
            <Card className="border-0 shadow-lg mb-4 bg-dark">
              <Card.Body className="p-4">
                <h4 className="text-info mb-4 fw-bold">
                  <i className="fas fa-filter me-2"></i>
                  Filtres de recherche
                </h4>
                
                <Row className="g-3">
                  <Col md={4}>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-black text-info border-info">
                        <i className="fas fa-map-marker-alt"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-info"
                        placeholder="Ville de départ..."
                        value={filterDepart}
                        onChange={e => setFilterDepart(e.target.value)}
                      />
                    </div>
                  </Col>
                  
                  <Col md={4}>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-black text-info border-info">
                        <i className="fas fa-flag-checkered"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-info"
                        placeholder="Ville d'arrivée..."
                        value={filterArrivee}
                        onChange={e => setFilterArrivee(e.target.value)}
                      />
                    </div>
                  </Col>
                  
                  <Col md={4}>
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-black text-info border-info">
                        <i className="fas fa-calendar"></i>
                      </span>
                      <input
                        type="date"
                        className="form-control bg-dark text-light border-info"
                        value={selectedHoraire?.dateDepart ? selectedHoraire.dateDepart.split('T')[0] : ''}
                        onChange={e => {
                          const value = e.target.value;
                          if (!value) {
                            setHoraires(prev => [...prev]);
                            setSelectedHoraire(null);
                            return;
                          }
                          setSelectedHoraire({ dateDepart: value });
                          setHoraires(prev =>
                            prev.filter(h =>
                              h.dateDepart && h.dateDepart.startsWith(value)
                            )
                          );
                        }}
                      />
                    </div>
                  </Col>
                </Row>
                
                <div className="text-end mt-3">
                  <button
                    className="btn btn-outline-warning btn-lg"
                    onClick={() => {
                      setFilterDepart('');
                      setFilterArrivee('');
                      setSelectedHoraire(null);
                    }}
                  >
                    <i className="fas fa-redo me-2"></i>
                    Réinitialiser
                  </button>
                </div>
              </Card.Body>
            </Card>

            {/* Liste des trajets */}
            <Card className="border-0 shadow-lg bg-dark">
              <Card.Body className="p-4">
                <h4 className="text-info mb-4 fw-bold">
                  <i className="fas fa-train me-2"></i>
                  Trajets disponibles
                  <Badge bg="info" className="ms-2 fs-6">
                    {horaires.filter(h => {
                      const t = trajets.find(trajet => trajet.id === h.trajetId);
                      if (!t) return false;
                      const departOk = filterDepart === '' || t.gare_depart.ville.toLowerCase().includes(filterDepart.toLowerCase());
                      const arriveeOk = filterArrivee === '' || t.gare_arrivee.ville.toLowerCase().includes(filterArrivee.toLowerCase());
                      return departOk && arriveeOk;
                    }).length}
                  </Badge>
                </h4>

                {trajets.length === 0 || horaires.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-train fa-3x text-secondary mb-3"></i>
                    <h5 className="text-secondary">Aucun trajet disponible pour le moment</h5>
                    <p className="text-muted">Veuillez réessayer ultérieurement</p>
                  </div>
                ) : (
                  <div className="row g-4">
                    {horaires
                      .filter((h) => {
                        const t = trajets.find(trajet => trajet.id === h.trajetId);
                        if (!t) return false;
                        const departOk = filterDepart === '' || t.gare_depart.ville.toLowerCase().includes(filterDepart.toLowerCase());
                        const arriveeOk = filterArrivee === '' || t.gare_arrivee.ville.toLowerCase().includes(filterArrivee.toLowerCase());
                        return departOk && arriveeOk;
                      })
                      .map((h) => {
                        const t = trajets.find(trajet => trajet.id === h.trajetId);
                        if (!t) return null;
                        
                        return (
                          <Col key={h.id} md={6} lg={4}>
                            <Card className="h-100 bg-secondary border-info hover-shadow">
                              <Card.Body className="p-3">
                                {/* En-tête avec prix */}
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <Badge bg="danger" className="fs-6">
                                    {monnaie.format(t.prix)}
                                  </Badge>
                                  <Badge bg="outline-info" className="border border-info">
                                    {t.transport.compagnie.nom}
                                  </Badge>
                                </div>

                                {/* Itinéraire */}
                                <div className="mb-3">
                                  <div className="d-flex align-items-center mb-2">
                                    <div className="bg-success rounded-circle p-1 me-2">
                                      <i className="fas fa-play text-white" style={{fontSize: '12px'}}></i>
                                    </div>
                                    <div>
                                      <small className="text-muted">Départ</small>
                                      <p className="mb-0 fw-bold text-light">{t.gare_depart.ville}</p>
                                      <small className="text-info">{t.gare_depart.nom}</small>
                                    </div>
                                  </div>

                                  <div className="d-flex align-items-center mb-2">
                                    <div className="bg-warning rounded-circle p-1 me-2">
                                      <i className="fas fa-stop text-white" style={{fontSize: '12px'}}></i>
                                    </div>
                                    <div>
                                      <small className="text-muted">Arrivée</small>
                                      <p className="mb-0 fw-bold text-light">{t.gare_arrivee.ville}</p>
                                      <small className="text-info">{t.gare_arrivee.nom}</small>
                                    </div>
                                  </div>
                                </div>

                                {/* Date et heure */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <div>
                                    <small className="text-muted">Date</small>
                                    <p className="mb-0 fw-bold text-light">
                                      {h.dateDepart ? new Date(h.dateDepart).toLocaleDateString() : "N/A"}
                                    </p>
                                  </div>
                                  <div className="text-end">
                                    <small className="text-muted">Heure</small>
                                    <p className="mb-0 fw-bold text-info">
                                      {h.dateDepart ? new Date(h.dateDepart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                    </p>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="d-grid gap-2">
                                  <button
                                    className="btn btn-outline-info btn-sm"
                                    onClick={() => handleShowDetail(t, h)}
                                  >
                                    <i className="fas fa-eye me-2"></i>
                                    Détails
                                  </button>
                                  <button
                                    className="btn btn-info btn-sm fw-bold"
                                    onClick={() => navigate("/confirmation", { state: { trajet: t, horaire: h } })}
                                  >
                                    <i className="fas fa-ticket-alt me-2"></i>
                                    Réserver
                                  </button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })
                    }
                  </div>
                )}

                <div className="text-center mt-4">
                  <p className="text-muted">
                    <i className="fas fa-info-circle me-2"></i>
                    Pour réserver un trajet, cliquez sur le bouton "Réserver" de votre choix
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Styles CSS pour les effets */}
      <style>
        {`
          .hover-shadow:hover {
            transform: translateY(-5px);
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(0, 255, 255, 0.15) !important;
          }
          .bg-purple {
            background-color: #6f42c1 !important;
          }
          .badge.bg-outline-info {
            background-color: transparent !important;
            color: #0dcaf0;
          }
        `}
      </style>
    </>
  );
};

export default HomePage;