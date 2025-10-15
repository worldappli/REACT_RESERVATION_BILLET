import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCcVisa, FaCcMastercard, FaPaypal, FaMobileAlt, FaMoneyBillWave, FaMoneyCheckAlt, FaUser, FaCreditCard } from "react-icons/fa";
import Navbar from "./Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import monnaie from "../services/variable";
import { Button, Modal } from "react-bootstrap";

const paymentOptions = [
    {
        name: "Carte Bancaire",
        icon: <FaCcVisa size={32} className="me-2 text-primary" />,
        description: "Payer avec votre carte Visa ou Mastercard.",
        color: "primary"
    },
    {
        name: "PayPal",
        icon: <FaPaypal size={32} className="me-2 text-info" />,
        description: "Payer facilement via votre compte PayPal.",
        color: "info"
    },
    {
        name: "Mix by Yas",
        icon: <FaMobileAlt size={32} className="me-2 text-success" />,
        description: "Payer avec Mix by Yas (Mobile Money).",
        color: "success"
    },
    {
        name: "Flooz",
        icon: <FaMoneyBillWave size={32} className="me-2 text-warning" />,
        description: "Payer avec Flooz (Mobile Money).",
        color: "warning"
    },
    {
        name: "Espèces",
        icon: <FaMoneyCheckAlt size={32} className="me-2 text-secondary" />,
        description: "Payer en espèces au guichet ou à bord.",
        color: "secondary"
    },
];

const PaiementPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { trajet, horaire, pour } = location.state || {};
    
    // États pour la gestion du paiement
    const [showCashModal, setShowCashModal] = React.useState(false);
    const [montantRecu, setMontantRecu] = React.useState("");
    const montantTrajet = location.state?.montant || trajet?.prix || 0;
    const [cashError, setCashError] = React.useState("");
    const [reservationExists, setReservationExists] = React.useState(false);
    const [showReservationAlert, setShowReservationAlert] = React.useState(false);

    const handleCashClick = () => {
        setShowCashModal(true);
        setMontantRecu("");
        setCashError("");
    };

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

    // Gestion des informations passager
    const [nomPassager, setNomPassager] = React.useState(pour === "autre" ? "" : (userInfo.nom || ""));
    const [prenomPassager, setPrenomPassager] = React.useState(pour === "autre" ? "" : (userInfo.prenom || ""));
    const [loading, setLoading] = React.useState(false);

    // Filtrer les options de paiement selon le rôle
    const role = userInfo.role;
    const type = userInfo.type;
    const filteredPaymentOptions = paymentOptions.filter(option => {
        if (option.name === "Espèces") {
            return role === "admin" || type === "compagnie";
        }
        return true;
    });

    const handleCashValidation = async () => {
        if (parseFloat(montantRecu) < parseFloat(montantTrajet)) {
            setCashError("Le montant reçu est insuffisant !");
        } else if (parseFloat(montantRecu) > parseFloat(montantTrajet)) {
            setCashError("Le montant reçu est supérieur au montant du trajet !");
        } else {
            setCashError("");
            setShowCashModal(false);
            try {
                const token = localStorage.getItem("token");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const resPaiements = await api.get("/paiement", { headers });
                const exists = resPaiements.data.some(p => String(p.reservationId) === String(location.state?.reservationId));
                if (exists) {
                    setReservationExists(true);
                    setShowReservationAlert(true);
                } else {
                    await api.post("/paiement", {
                        reservationId: location.state?.reservationId,
                        montant: montantTrajet,
                        modePaiement: "Espèces",
                        statut: "Validé",
                    });
                    const resReservation = await api.get(`/reservation/${location.state?.reservationId}`, { headers });
                    const reservationBase = resReservation.data;
                    await api.put(`/reservation/${location.state?.reservationId}`, {
                        utilisateurId: reservationBase.utilisateurId,
                        horaireId: reservationBase.horaireId,
                        dateReservation: reservationBase.dateReservation,
                        statut: "Confirmé",
                        nom_passager: reservationBase.nom_passager,
                        prenom_passager: reservationBase.prenom_passager
                    }, { headers });
                    alert("Paiement effectué et réservation confirmée !");
                    navigate("/billets", { state: { reservationId: location.state?.reservationId } });
                }
            } catch (err) {
                alert("Erreur lors de l'enregistrement du paiement");
            }
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.post("/reservation", {
                utilisateurId: userInfo.id,
                horaireId: horaire.id,
                dateReservation: new Date().toISOString(),
                statut: "En attente",
                nom_passager: nomPassager,
                prenom_passager: prenomPassager,
            });
            alert("Réservation enregistrée !");
            navigate("/");
        } catch (err) {
            alert("Erreur lors de la réservation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
            minHeight: "100vh"
        }}>
            <Navbar />
            
            <div className="container py-5">
                {/* En-tête */}
                <div className="row justify-content-center mb-5">
                    <div className="col-12 text-center">
                        <h1 className="text-white fw-bold mb-3">
                            <i className="fas fa-credit-card me-3 text-info"></i>
                            Paiement Sécurisé
                        </h1>
                        <p className="text-light opacity-75">
                            Finalisez votre réservation en choisissant votre moyen de paiement
                        </p>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        {/* Carte Informations Passager */}
                        <div className="card border-0 shadow-lg bg-dark mb-5">
                            <div className="card-header bg-transparent border-info py-4">
                                <h3 className="text-info mb-0">
                                    <FaUser className="me-2" />
                                    Informations du Passager
                                </h3>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label text-light fw-semibold">
                                                <i className="fas fa-user me-2 text-info"></i>
                                                Nom du passager
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control bg-black text-light border-secondary"
                                                placeholder="Entrez le nom"
                                                value={nomPassager}
                                                onChange={e => setNomPassager(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label text-light fw-semibold">
                                                <i className="fas fa-user me-2 text-info"></i>
                                                Prénom du passager
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control bg-black text-light border-secondary"
                                                placeholder="Entrez le prénom"
                                                value={prenomPassager}
                                                onChange={e => setPrenomPassager(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="row mt-4 pt-3 border-top border-dark">
                                    <div className="col-12">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <button
                                                className="btn btn-outline-warning btn-lg px-4"
                                                onClick={() => navigate("/")}
                                                disabled={loading}
                                            >
                                                <i className="fas fa-arrow-left me-2"></i>
                                                Annuler
                                            </button>
                                            <button
                                                className="btn btn-success btn-lg px-4 fw-bold"
                                                onClick={handleSave}
                                                disabled={loading || !nomPassager || !prenomPassager}
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                                            <span className="visually-hidden">Chargement...</span>
                                                        </div>
                                                        Sauvegarde...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-save me-2"></i>
                                                        Sauvegarder les informations
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Carte Moyens de Paiement */}
                        <div className="card border-0 shadow-lg bg-dark">
                            <div className="card-header bg-transparent border-info py-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="text-info mb-0">
                                        <FaCreditCard className="me-2" />
                                        Moyens de Paiement
                                    </h3>
                                    <div className="badge bg-success fs-6">
                                        <i className="fas fa-shield-alt me-1"></i>
                                        Sécurisé
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-4">
                                <div className="row g-4">
                                    {filteredPaymentOptions.map((option, idx) => (
                                        <div className="col-md-6 col-lg-4" key={idx}>
                                            <div className={`card h-100 border-0 bg-secondary payment-card hover-card ${
                                                option.name === "Espèces" ? "border-warning" : "border-info"
                                            }`}>
                                                <div className="card-body p-4 text-center d-flex flex-column">
                                                    <div className="mb-3">
                                                        {option.icon}
                                                    </div>
                                                    <h5 className="card-title text-white mb-2">{option.name}</h5>
                                                    <p className="card-text text-light opacity-75 flex-grow-1">
                                                        {option.description}
                                                    </p>
                                                    {option.name === "Espèces" ? (
                                                        <button 
                                                            className="btn btn-warning mt-auto fw-bold"
                                                            onClick={handleCashClick}
                                                        >
                                                            <i className="fas fa-money-bill-wave me-2"></i>
                                                            Payer en espèces
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className="btn btn-outline-info mt-auto"
                                                            disabled
                                                        >
                                                            <i className="fas fa-lock me-2"></i>
                                                            Bientôt disponible
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Informations de sécurité */}
                                <div className="row mt-5">
                                    <div className="col-12">
                                        <div className="card bg-black border-info">
                                            <div className="card-body p-3">
                                                <div className="row align-items-center text-center">
                                                    <div className="col-md-4 mb-3 mb-md-0">
                                                        <i className="fas fa-shield-alt fa-2x text-success me-2"></i>
                                                        <small className="text-light">Paiement 100% Sécurisé</small>
                                                    </div>
                                                    <div className="col-md-4 mb-3 mb-md-0">
                                                        <i className="fas fa-lock fa-2x text-info me-2"></i>
                                                        <small className="text-light">Données Cryptées</small>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <i className="fas fa-headset fa-2x text-warning me-2"></i>
                                                        <small className="text-light">Support 24h/24</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Paiement Espèces */}
            <Modal show={showCashModal} onHide={() => setShowCashModal(false)} centered size="md">
                <Modal.Header closeButton className="bg-dark border-warning">
                    <Modal.Title className="text-warning fw-bold">
                        <i className="fas fa-money-bill-wave me-2"></i>
                        Paiement en Espèces
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light p-4">
                    <div className="text-center mb-4">
                        <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                             style={{ width: '80px', height: '80px' }}>
                            <FaMoneyCheckAlt size={32} className="text-white" />
                        </div>
                        <h5 className="text-white">Validation du paiement</h5>
                    </div>

                    <div className="mb-4">
                        <div className="card bg-black border-warning mb-3">
                            <div className="card-body text-center py-3">
                                <small className="text-muted">Montant à payer</small>
                                <h3 className="text-warning fw-bold mb-0">{monnaie.format(montantTrajet)}</h3>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label text-light fw-semibold">
                                <i className="fas fa-cash-register me-2"></i>
                                Montant reçu
                            </label>
                            <input
                                type="text"
                                className={`form-control bg-black text-light text-center fs-5 ${
                                    montantRecu && !/^\d+(\.\d{1,2})?$/.test(montantRecu) ? "is-invalid" : ""
                                }`}
                                value={montantRecu}
                                onChange={e => {
                                    const val = e.target.value;
                                    if (val === "" || /^\d+(\.\d{0,2})?$/.test(val)) {
                                        setMontantRecu(val);
                                    }
                                }}
                                placeholder="0.00"
                                style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                            />
                            {montantRecu && !/^\d+(\.\d{1,2})?$/.test(montantRecu) && (
                                <div className="invalid-feedback text-center">
                                    Format invalide. Ex: 1500.00
                                </div>
                            )}
                        </div>
                    </div>

                    {cashError && (
                        <div className="alert alert-danger d-flex align-items-center">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {cashError}
                        </div>
                    )}

                    {montantRecu && parseFloat(montantRecu) === parseFloat(montantTrajet) && (
                        <div className="alert alert-success d-flex align-items-center">
                            <i className="fas fa-check-circle me-2"></i>
                            Montant correct ! Prêt à valider.
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-warning">
                    <Button variant="outline-light" onClick={() => setShowCashModal(false)}>
                        <i className="fas fa-times me-2"></i>
                        Annuler
                    </Button>
                    <Button 
                        variant="warning" 
                        onClick={handleCashValidation}
                        disabled={!montantRecu || !/^\d+(\.\d{1,2})?$/.test(montantRecu)}
                        className="fw-bold"
                    >
                        <i className="fas fa-check me-2"></i>
                        Valider le Paiement
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Alerte Réservation Existante */}
            <Modal show={showReservationAlert} onHide={() => setShowReservationAlert(false)} centered>
                <Modal.Header closeButton className="bg-dark border-info">
                    <Modal.Title className="text-info fw-bold">
                        <i className="fas fa-info-circle me-2"></i>
                        Réservation Existante
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light text-center p-4">
                    <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                         style={{ width: '60px', height: '60px' }}>
                        <i className="fas fa-exclamation text-dark fa-2x"></i>
                    </div>
                    <h5 className="text-white mb-3">Paiement déjà effectué</h5>
                    <p className="text-light mb-0">
                        Une réservation existe déjà pour ce trajet avec un paiement validé.
                    </p>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-info justify-content-center">
                    <Button 
                        variant="info" 
                        onClick={() => { 
                            setShowReservationAlert(false); 
                            navigate('/mes-billets', { state: { reservationId: location.state?.reservationId } }); 
                        }}
                        className="px-4"
                    >
                        <i className="fas fa-ticket-alt me-2"></i>
                        Voir mes billets
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Styles CSS */}
            <style>
                {`
                    .payment-card {
                        transition: all 0.3s ease;
                    }
                    .hover-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 8px 25px rgba(0, 255, 255, 0.15) !important;
                    }
                    .form-control:focus {
                        border-color: #0dcaf0;
                        box-shadow: 0 0 0 0.2rem rgba(13, 202, 240, 0.25);
                    }
                `}
            </style>
        </div>
    );
};

export default PaiementPage;