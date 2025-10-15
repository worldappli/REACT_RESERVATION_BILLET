import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Modal, Card, Badge } from "react-bootstrap";
import Navbar from "./Navbar";

export default function ConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { trajet, horaire } = location.state || {};

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userId = userInfo.id;

    const [showModal, setShowModal] = React.useState(false);

    if (!trajet || !horaire) {
        return (
            <div style={{
                background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
                minHeight: "100vh"
            }}>
                <Navbar />
                <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                    <Card className="border-0 shadow-lg bg-dark text-center">
                        <Card.Body className="p-5">
                            <i className="fas fa-exclamation-triangle fa-4x text-warning mb-4"></i>
                            <h3 className="text-white mb-3">Information manquante</h3>
                            <p className="text-light mb-4">Aucune information de trajet sélectionnée.</p>
                            <Button 
                                variant="info" 
                                size="lg"
                                onClick={() => navigate("/")}
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Retour à l'accueil
                            </Button>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        );
    }

    const monnaie = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    });

    return (
        <div style={{
            background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
            minHeight: "100vh"
        }}>
            <Navbar />
            
            <Container className="py-5">
                {/* En-tête */}
                <Row className="justify-content-center mb-5">
                    <Col xs={12} className="text-center">
                        <h1 className="text-white fw-bold mb-3">
                            <i className="fas fa-check-circle me-3 text-success"></i>
                            Confirmation de Réservation
                        </h1>
                        <p className="text-light opacity-75">
                            Vérifiez les détails de votre voyage avant de finaliser
                        </p>
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    <Col xs={12} lg={10} xl={8}>
                        {/* Carte principale */}
                        <Card className="border-0 shadow-lg bg-dark mb-4">
                            <Card.Header className="bg-transparent border-info py-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="text-info mb-0">
                                        <i className="fas fa-train me-2"></i>
                                        Récapitulatif du Trajet
                                    </h3>
                                    <Badge bg="success" className="fs-6">
                                        <i className="fas fa-bolt me-1"></i>
                                        Disponible
                                    </Badge>
                                </div>
                            </Card.Header>
                            
                            <Card.Body className="p-4">
                                {/* Itinéraire visuel */}
                                <Row className="mb-4">
                                    <Col md={5}>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="bg-success rounded-circle p-2 me-3">
                                                <i className="fas fa-play text-white"></i>
                                            </div>
                                            <div>
                                                <small className="text-muted">Départ</small>
                                                <h5 className="mb-0 text-white fw-bold">{trajet.gare_depart.ville}</h5>
                                                <small className="text-info">{trajet.gare_depart.nom}</small>
                                            </div>
                                        </div>
                                    </Col>
                                    
                                    <Col md={2} className="text-center">
                                        <div className="position-relative" style={{ height: '60px' }}>
                                            <div className="bg-info rounded-pill" style={{ 
                                                height: '4px', 
                                                width: '100%', 
                                                position: 'absolute', 
                                                top: '50%', 
                                                transform: 'translateY(-50%)' 
                                            }}></div>
                                            <i className="fas fa-arrow-right text-info position-absolute" 
                                               style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.5rem' }}></i>
                                        </div>
                                    </Col>
                                    
                                    <Col md={5}>
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="bg-warning rounded-circle p-2 me-3">
                                                <i className="fas fa-flag-checkered text-white"></i>
                                            </div>
                                            <div>
                                                <small className="text-muted">Arrivée</small>
                                                <h5 className="mb-0 text-white fw-bold">{trajet.gare_arrivee.ville}</h5>
                                                <small className="text-info">{trajet.gare_arrivee.nom}</small>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Détails du trajet */}
                                <Row className="g-4">
                                    <Col md={6}>
                                        <Card className="bg-black border-secondary h-100">
                                            <Card.Body className="p-3">
                                                <div className="d-flex align-items-center mb-3">
                                                    <div className="bg-info rounded p-2 me-3">
                                                        <i className="fas fa-calendar text-white"></i>
                                                    </div>
                                                    <div>
                                                        <small className="text-muted">Date de départ</small>
                                                        <p className="mb-0 text-white fw-bold">
                                                            {horaire.dateDepart ? new Date(horaire.dateDepart).toLocaleDateString() : "N/A"}
                                                        </p>
                                                        <small className="text-info">
                                                            {horaire.dateDepart ? new Date(horaire.dateDepart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                        </small>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    
                                    <Col md={6}>
                                        <Card className="bg-black border-secondary h-100">
                                            <Card.Body className="p-3">
                                                <div className="d-flex align-items-center mb-3">
                                                    <div className="bg-success rounded p-2 me-3">
                                                        <i className="fas fa-clock text-white"></i>
                                                    </div>
                                                    <div>
                                                        <small className="text-muted">Date d'arrivée</small>
                                                        <p className="mb-0 text-white fw-bold">
                                                            {horaire.dateArrivee ? new Date(horaire.dateArrivee).toLocaleDateString() : "N/A"}
                                                        </p>
                                                        <small className="text-info">
                                                            {horaire.dateArrivee ? new Date(horaire.dateArrivee).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                        </small>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col md={6}>
                                        <Card className="bg-black border-secondary h-100">
                                            <Card.Body className="p-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-warning rounded p-2 me-3">
                                                        <i className="fas fa-train text-white"></i>
                                                    </div>
                                                    <div>
                                                        <small className="text-muted">Transport</small>
                                                        <p className="mb-0 text-white fw-bold">
                                                            {trajet.transport.type} n°{trajet.transport.numero}
                                                        </p>
                                                        <small className="text-info">
                                                            {trajet.transport.compagnie.nom}
                                                        </small>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    
                                    <Col md={6}>
                                        <Card className="bg-danger border-0 h-100">
                                            <Card.Body className="p-3 text-center">
                                                <small className="text-white">Prix total</small>
                                                <h3 className="text-white fw-bold mb-0">
                                                    {monnaie.format(trajet.prix)}
                                                </h3>
                                                <small className="text-light">Toutes taxes comprises</small>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Informations supplémentaires */}
                                <Row className="mt-4">
                                    <Col xs={12}>
                                        <Card className="bg-secondary border-0">
                                            <Card.Body className="p-3">
                                                <div className="row text-center g-3">
                                                    <div className="col-md={3}">
                                                        <i className="fas fa-clock text-info me-2"></i>
                                                        <small className="text-light">Durée: {trajet.duree} minutes</small>
                                                    </div>
                                                    <div className="col-md={3}">
                                                        <i className="fas fa-map-marker-alt text-info me-2"></i>
                                                        <small className="text-light">
                                                            Arrêts: {trajet.arret || "Aucun arrêt intermédiaire"}
                                                        </small>
                                                    </div>
                                                    <div className="col-md={3}">
                                                        <i className="fas fa-building text-info me-2"></i>
                                                        <small className="text-light">
                                                            Compagnie: {trajet.transport.compagnie.nom}
                                                        </small>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Actions */}
                        <Card className="border-0 shadow-lg bg-dark">
                            <Card.Body className="p-4">
                                <div className="row g-3">
                                    <Col md={6}>
                                        <Button
                                            variant="outline-warning"
                                            size="lg"
                                            className="w-100 fw-bold py-3"
                                            onClick={() => navigate("/")}
                                        >
                                            <i className="fas fa-arrow-left me-2"></i>
                                            Retour à l'accueil
                                        </Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button
                                            variant="info"
                                            size="lg"
                                            className="w-100 fw-bold py-3"
                                            onClick={() => setShowModal(true)}
                                        >
                                            <i className="fas fa-credit-card me-2"></i>
                                            Continuer vers le paiement
                                        </Button>
                                    </Col>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modal de sélection du passager */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton className="bg-dark border-info">
                    <Modal.Title className="text-info fw-bold">
                        <i className="fas fa-user-friends me-2"></i>
                        Pour qui réservez-vous ?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light p-4">
                    <Row className="g-4">
                        <Col md={6}>
                            <Card className="bg-secondary border-info h-100 hover-card text-center">
                                <Card.Body className="p-4" style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setShowModal(false);
                                        navigate(`/paiement/`, { state: { trajet, horaire, pour: "moi" } });
                                    }}>
                                    <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                         style={{ width: '80px', height: '80px' }}>
                                        <i className="fas fa-user fa-2x text-white"></i>
                                    </div>
                                    <h5 className="text-white mb-3">Pour moi</h5>
                                    <p className="text-light mb-0">
                                        Utiliser mes informations personnelles pour cette réservation
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="bg-secondary border-warning h-100 hover-card text-center">
                                <Card.Body className="p-4" style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        setShowModal(false);
                                        navigate(`/paiement/`, { state: { trajet, horaire, pour: "autre" } });
                                    }}>
                                    <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                         style={{ width: '80px', height: '80px' }}>
                                        <i className="fas fa-user-plus fa-2x text-white"></i>
                                    </div>
                                    <h5 className="text-white mb-3">Pour une autre personne</h5>
                                    <p className="text-light mb-0">
                                        Saisir les informations d'un autre passager pour cette réservation
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-info">
                    <Button variant="outline-light" onClick={() => setShowModal(false)}>
                        <i className="fas fa-times me-2"></i>
                        Annuler
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Styles CSS */}
            <style>
                {`
                    .hover-card:hover {
                        transform: translateY(-5px);
                        transition: all 0.3s ease;
                        box-shadow: 0 8px 25px rgba(0, 255, 255, 0.15) !important;
                    }
                    .card {
                        transition: transform 0.2s ease;
                    }
                    .card:hover {
                        transform: translateY(-2px);
                    }
                `}
            </style>
        </div>
    );
}