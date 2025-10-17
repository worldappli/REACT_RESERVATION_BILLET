import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import BilletFormModal from "../Components/BilletFormModal";
import api from "../services/api";
import { Modal, Button, Form, Container, Row, Col, Card, Badge } from "react-bootstrap";
import HoraireFormModal from "../Components/HoraireFormModal";
import { useNavigate } from "react-router-dom";
import TransportFormModal from "../Components/TransportFormModal";
import GareFormModal from "../Components/GareFormModal";

export default function HomeCompagnie() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showHoraireModal, setShowHoraireModal] = useState(false);
    const [transports, setTransports] = useState([]);
    const [gare, setGare] = useState([]);
    const [trajets, setTrajets] = useState([]);
    const [horaires, setHoraires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTransportModal, setShowTransportModal] = useState(false);
    const handleOpenTransportModal = () => setShowTransportModal(true);
    const handleCloseTransportModal = () => setShowTransportModal(false);
    const [showGareModal, setShowGareModal] = useState(false);
    const handleOpenGareModal = () => setShowGareModal(true);
    const handleCloseGareModal = () => setShowGareModal(false);

    const monnaie = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    });

    // Vérification de l'authentification au chargement
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserInfo = localStorage.getItem("userInfo");
        if (!token || !storedUserInfo) {
            navigate("/compagnie-login");
        } else {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, [navigate]);

    // Récupération des données
    // Récupération des données
useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            
            // Vérifier si le token existe
            if (!token) {
                console.error("Aucun token trouvé");
                navigate("/compagnie-login");
                return;
            }

            const headers = { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            console.log("Token utilisé:", token); // Pour debug

            const [transportsRes, garesRes, trajetsRes, horairesRes] = await Promise.all([
                api.get("/transport", { headers }),
                api.get("/gare", { headers }),
                api.get("/trajet", { headers }),
                api.get("/horaire", { headers })
            ]);

            setTransports(transportsRes.data);
            setGare(garesRes.data);
            setTrajets(trajetsRes.data);
            setHoraires(horairesRes.data);
            
        } catch (error) {
            console.error("Erreur détaillée:", error.response?.data || error.message);
            
            // Si erreur 401, déconnecter l'utilisateur
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("userInfo");
                navigate("/compagnie-login");
            }
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [navigate]);

    // Filtrage des données selon userInfo.id
    const filteredTransports = userInfo
        ? transports.filter((t) => t.compagnie && t.compagnie.id === userInfo.id)
        : [];

    const filteredGares = userInfo
        ? gare.filter((g) => g.compagnie && g.compagnie.id === userInfo.id)
        : [];

    const filteredTrajets = userInfo
        ? trajets.filter((trajet) =>
            filteredTransports.some((t) => t.id === trajet.transport.id)
        )
        : [];

    const filteredHoraires = userInfo
        ? horaires.filter((h) => filteredTrajets.some((t) => t.id === h.trajetId))
        : [];

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleOpenHoraireModal = () => setShowHoraireModal(true);
    const handleCloseHoraireModal = () => setShowHoraireModal(false);

    // Fonction pour enregistrer un Trajet
    const handleSaveTrajet = (data) => {
        const token = localStorage.getItem("token");
        api.post("/trajet", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                setTrajets((prevTrajets) => [...prevTrajets, response.data]);
                alert("Trajet Enregistré avec succès !");
            })
            .catch((error) => {
                console.error("Erreur lors de la publication du trajet", error);
            });
        setShowModal(false);
    };

    // Fonction pour enregistrer un Horaire
    const handleSaveHoraire = (data) => {
        api.post("/horaire", data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                setHoraires((prevHoraires) => [...prevHoraires, response.data]);
                alert("Billet publié avec succès !");
            })
            .catch((error) => {
                console.error("Erreur lors de l'enregistrement de l'horaire", error);
            });
        setShowHoraireModal(false);
    };

    // fonction pour enregistrer un Transport
    const handleSaveTransport = (data) => {
    const token = localStorage.getItem("token");
    
    // Vérifier le token
    if (!token) {
        alert("Session expirée, veuillez vous reconnecter");
        navigate("/compagnie-login");
        return;
    }

    console.log("Données envoyées:", data); // Pour debug

    api.post("/transport", data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
    .then((response) => {
        setTransports((prevTransports) => [...prevTransports, response.data]);
        alert("Transport créé avec succès !");
    })
    .catch((error) => {
        console.error("Erreur détaillée création transport:", error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            alert("Session expirée, veuillez vous reconnecter");
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            navigate("/compagnie-login");
        } else {
            alert("Erreur lors de la création du transport: " + (error.response?.data?.message || error.message));
        }
    });
    
    setShowTransportModal(false);
};

// fonction pour enregistrer une Gare
const handleSaveGare = (data) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        alert("Session expirée, veuillez vous reconnecter");
        navigate("/compagnie-login");
        return;
    }

    api.post("/gare", data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
    .then((response) => {
        setGare((prevGares) => [...prevGares, response.data]);
        alert("Gare créée avec succès !");
    })
    .catch((error) => {
        console.error("Erreur création gare:", error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            alert("Session expirée, veuillez vous reconnecter");
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            navigate("/compagnie-login");
        } else {
            alert("Erreur lors de la création de la gare: " + (error.response?.data?.message || error.message));
        }
    });
    
    setShowGareModal(false);
};

    if (loading) {
        return (
            <div style={{
                background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
                minHeight: "100vh"
            }}>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="text-center">
                        <div className="spinner-border text-info mb-3" style={{width: '3rem', height: '3rem'}} role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                        <h5 className="text-light">Chargement du tableau de bord...</h5>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
            minHeight: "100vh",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "rgba(0, 0, 0, 0.9)" }}>
                <div className="container">
                    <a className="navbar-brand fw-bold fs-3" href="#">
                        <i className="fas fa-train me-2 text-info"></i>
                        <span style={{ color: "#00b894" }}>Compagnie Admin</span>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link active fw-semibold" href="#">
                                    <i className="fas fa-tachometer-alt me-1"></i>
                                    Tableau de bord
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link fw-semibold" href="#">
                                    <i className="fas fa-ticket-alt me-1"></i>
                                    Billets
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link fw-semibold" href="#">
                                    <i className="fas fa-user me-1"></i>
                                    Profil
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link fw-semibold"
                                    style={{ cursor: "pointer", color: "#ff6b6b" }}
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        localStorage.removeItem("userInfo");
                                        setUserInfo(null);
                                        navigate("/compagnie-login");
                                    }}
                                >
                                    <i className="fas fa-sign-out-alt me-1"></i>
                                    Déconnexion
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Modal formulaire billet */}
            <BilletFormModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSaveTrajet}
                listTransport={filteredTransports}
                listGare={filteredGares}
            />

            {/* Modal formulaire horaire */}
            <HoraireFormModal
                show={showHoraireModal}
                handleClose={handleCloseHoraireModal}
                handleSave={handleSaveHoraire}
                trajets={filteredTrajets}
            />

            {/* Modal formulaire transport */}
            <TransportFormModal
                show={showTransportModal}
                handleClose={handleCloseTransportModal}
                handleSave={handleSaveTransport}
                compagnieId={userInfo?.id} // Passe l'ID de la compagnie connectée
            />

<GareFormModal
    show={showGareModal}
    handleClose={handleCloseGareModal}
    handleSave={handleSaveGare}
    compagnieId={userInfo?.id}
/>
            <Container className="py-5">
                {/* En-tête */}
                <Row className="justify-content-center mb-5">
                    <Col xs={12} className="text-center">
                        <h1 className="text-white fw-bold mb-3">
                            <i className="fas fa-tachometer-alt me-3 text-info"></i>
                            Tableau de Bord Compagnie
                        </h1>
                        <p className="text-light opacity-75 fs-5">
                            Gérez vos trajets, publiez des billets et surveillez votre activité
                        </p>
                    </Col>
                </Row>

                <Row className="justify-content-center">
                    <Col xs={12} lg={11} xl={10}>
                        {/* Cartes de statistiques */}
                        <Row className="g-4 mb-5">
                            <Col md={3}>
                                <Card className="border-0 shadow-lg bg-dark text-center hover-card">
                                    <Card.Body className="p-4">
                                        <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                             style={{ width: '70px', height: '70px' }}>
                                            <i className="fas fa-train fa-2x text-white"></i>
                                        </div>
                                        <h3 className="text-white fw-bold">{filteredTransports.length}</h3>
                                        <p className="text-light mb-0">Transports</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="border-0 shadow-lg bg-dark text-center hover-card">
                                    <Card.Body className="p-4">
                                        <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                             style={{ width: '70px', height: '70px' }}>
                                            <i className="fas fa-route fa-2x text-white"></i>
                                        </div>
                                        <h3 className="text-white fw-bold">{filteredTrajets.length}</h3>
                                        <p className="text-light mb-0">Trajets</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="border-0 shadow-lg bg-dark text-center hover-card">
                                    <Card.Body className="p-4">
                                        <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                             style={{ width: '70px', height: '70px' }}>
                                            <i className="fas fa-ticket-alt fa-2x text-white"></i>
                                        </div>
                                        <h3 className="text-white fw-bold">{filteredHoraires.length}</h3>
                                        <p className="text-light mb-0">Billets Publiés</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card className="border-0 shadow-lg bg-dark text-center hover-card">
                                    <Card.Body className="p-4">
                                        <div className="bg-purple rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                             style={{ width: '70px', height: '70px' }}>
                                            <i className="fas fa-map-marker-alt fa-2x text-white"></i>
                                        </div>
                                        <h3 className="text-white fw-bold">{filteredGares.length}</h3>
                                        <p className="text-light mb-0">Gares</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Actions rapides */}
                        <Card className="border-0 shadow-lg bg-dark mb-5">
                            <Card.Header className="bg-transparent border-info py-4">
                                <h3 className="text-info mb-0">
                                    <i className="fas fa-bolt me-2"></i>
                                    Actions Rapides
                                </h3>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Row className="g-4">
                                    <Col md={6}>
                                        <Button
                                            variant="warning"
                                            size="lg"
                                            className="w-100 fw-bold py-3 fs-5"
                                            onClick={handleOpenHoraireModal }
                                        >
                                            <i className="fas fa-plus-circle me-2"></i>
                                            Publier un Billet
                                        </Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button
                                            variant="success"
                                            size="lg"
                                            className="w-100 fw-bold py-3 fs-5"
                                            onClick={handleOpenModal}
                                        >
                                            <i className="fas fa-route me-2"></i>
                                            Créer un Trajet
                                        </Button>
                                    </Col>
                                </Row>

                                <Row className="g-4 mt-3">
                                    <Col md={6}>
                                        <Button
                                            variant="info"
                                            size="lg"
                                            className="w-100 fw-bold py-3 fs-5"
                                            onClick={handleOpenGareModal}
                                        >
                                            <i className="fas fa-plus-circle me-2"></i>
                                            enregistrer une gare
                                        </Button>
                                    </Col>
                                    <Col md={6}>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="w-100 fw-bold py-3 fs-5"
                                            onClick={handleOpenTransportModal}
                                        >
                                            <i className="fas fa-route me-2"></i>
                                            enregistrer un transport
                                        </Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Billets publiés */}
                        <Card className="border-0 shadow-lg bg-dark mb-5">
                            <Card.Header className="bg-transparent border-info py-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="text-info mb-0">
                                        <i className="fas fa-ticket-alt me-2"></i>
                                        Billets Publiés
                                    </h3>
                                    <Badge bg="info" className="fs-6">
                                        {filteredHoraires.length} billets
                                    </Badge>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-0">
                                {filteredHoraires.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="fas fa-ticket-alt fa-4x text-secondary mb-4"></i>
                                        <h5 className="text-light mb-3">Aucun billet publié</h5>
                                        <p className="text-muted">Commencez par publier votre premier billet</p>
                                        <Button variant="info" onClick={handleOpenHoraireModal}>
                                            <i className="fas fa-plus me-2"></i>
                                            Publier un billet
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-dark table-hover align-middle mb-0">
                                            <thead className="bg-black">
                                                <tr>
                                                    <th className="border-0 ps-4">
                                                        <i className="fas fa-route me-2"></i>
                                                        Trajet
                                                    </th>
                                                    <th className="border-0">
                                                        <i className="fas fa-calendar me-2"></i>
                                                        Date Départ
                                                    </th>
                                                    <th className="border-0">
                                                        <i className="fas fa-euro-sign me-2"></i>
                                                        Prix
                                                    </th>
                                                    <th className="border-0 text-end pe-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredHoraires.map((billet) => {
                                                    const trajet = filteredTrajets.find(t => t.id === billet.trajetId);
                                                    return (
                                                        <tr key={billet.id} className="hover-row">
                                                            <td className="ps-4">
                                                                {trajet ? (
                                                                    <div>
                                                                        <div className="fw-bold text-white">
                                                                            {trajet.gare_depart.nom} → {trajet.gare_arrivee.nom}
                                                                        </div>
                                                                        <small className="text-info">
                                                                            {trajet.transport.type} n°{trajet.transport.numero}
                                                                        </small>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-warning">Trajet non trouvé</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="fw-bold">
                                                                    {billet.dateDepart ? new Date(billet.dateDepart).toLocaleDateString() : "N/A"}
                                                                </div>
                                                                <small className="text-muted">
                                                                    {billet.dateDepart ? new Date(billet.dateDepart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                                </small>
                                                            </td>
                                                            <td>
                                                                <Badge bg="danger" className="fs-6">
                                                                    {trajet ? monnaie.format(trajet.prix) : "N/A"}
                                                                </Badge>
                                                            </td>
                                                            <td className="text-end pe-4">
                                                                <div className="d-flex justify-content-end gap-2">
                                                                    <Button variant="outline-info" size="sm">
                                                                        <i className="fas fa-edit me-1"></i>
                                                                        Modifier
                                                                    </Button>
                                                                    <Button variant="outline-danger" size="sm">
                                                                        <i className="fas fa-trash me-1"></i>
                                                                        Supprimer
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>

                        {/* Informations Compagnie et Transports */}
                        <Row className="g-4">
                            <Col lg={6}>
                                <Card className="border-0 shadow-lg bg-dark h-100">
                                    <Card.Header className="bg-transparent border-info py-4">
                                        <h3 className="text-info mb-0">
                                            <i className="fas fa-building me-2"></i>
                                            Informations Compagnie
                                        </h3>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        <div className="d-flex align-items-center mb-4">
                                            <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                                                 style={{ width: '60px', height: '60px' }}>
                                                <i className="fas fa-train text-white fa-lg"></i>
                                            </div>
                                            <div>
                                                <h5 className="text-white mb-1">{userInfo?.nom || "Nom de la compagnie"}</h5>
                                                <p className="text-muted mb-0">{userInfo?.email || "email@compagnie.com"}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mb-3">
                                            <Badge bg={userInfo?.statut === "actif" ? "success" : "danger"} className="fs-6">
                                                <i className={`fas ${userInfo?.statut === "actif" ? "fa-check-circle" : "fa-times-circle"} me-1`}></i>
                                                {userInfo?.statut === "actif" ? "Actif" : "Inactif"}
                                            </Badge>
                                        </div>
                                        
                                        <Button variant="outline-info" className="w-100">
                                            <i className="fas fa-edit me-2"></i>
                                            Modifier les informations
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            
                            <Col lg={6}>
                                <Card className="border-0 shadow-lg bg-dark h-100">
                                    <Card.Header className="bg-transparent border-info py-4">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h3 className="text-info mb-0">
                                                <i className="fas fa-bus me-2"></i>
                                                Vos Transports
                                            </h3>
                                            <Badge bg="info" className="fs-6">
                                                {filteredTransports.length}
                                            </Badge>
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="p-4">
                                        {filteredTransports.length === 0 ? (
                                            <div className="text-center py-3">
                                                <i className="fas fa-train fa-3x text-secondary mb-3"></i>
                                                <p className="text-muted">Aucun transport enregistré</p>
                                            </div>
                                        ) : (
                                            <div className="row g-3">
                                                {filteredTransports.map((transport) => (
                                                    <div key={transport.id} className="col-12">
                                                        <div className="bg-black rounded p-3 d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <h6 className="text-white mb-1">
                                                                    {transport.type} n°{transport.numero}
                                                                </h6>
                                                                <small className="text-muted">
                                                                    {transport.capacite} places disponibles
                                                                </small>
                                                            </div>
                                                            <Badge bg="secondary">
                                                                {transport.compagnie?.nom}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

            {/* Styles CSS */}
            <style>
                {`
                    .hover-card:hover {
                        transform: translateY(-5px);
                        transition: all 0.3s ease;
                        box-shadow: 0 8px 25px rgba(0, 255, 255, 0.15) !important;
                    }
                    .hover-row:hover {
                        background-color: rgba(255, 255, 255, 0.05) !important;
                        transition: background-color 0.2s ease;
                    }
                    .bg-purple {
                        background-color: #6f42c1 !important;
                    }
                    .table > :not(caption) > * > * {
                        background-color: transparent;
                    }
                `}
            </style>
        </div>
    );
}