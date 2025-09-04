import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCcVisa, FaCcMastercard, FaPaypal, FaMobileAlt, FaMoneyBillWave, FaMoneyCheckAlt } from "react-icons/fa";
import Navbar from "./Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import monnaie from "../services/variable";

const paymentOptions = [
    {
        name: "Carte Bancaire",
        icon: <FaCcVisa size={32} className="me-2 text-primary" />,
        description: "Payer avec votre carte Visa ou Mastercard.",
    },
    {
        name: "PayPal",
        icon: <FaPaypal size={32} className="me-2 text-info" />,
        description: "Payer facilement via votre compte PayPal.",
    },
    {
        name: "Mix by Yas",
        icon: <FaMobileAlt size={32} className="me-2 text-success" />,
        description: "Payer avec Mix by Yas (Mobile Money).",
    },
    {
        name: "Flooz",
        icon: <FaMoneyBillWave size={32} className="me-2 text-warning" />,
        description: "Payer avec Flooz (Mobile Money).",
    },
    {
        name: "Espèces",
        icon: <FaMoneyCheckAlt size={32} className="me-2 text-success" />,
        description: "Payer en espèces au guichet ou à bord.",
    },
];


const PaiementPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { trajet, horaire, pour } = location.state || {};
    // Gestion de la modale pour paiement en espèces
    const [showCashModal, setShowCashModal] = React.useState(false);
    const [montantRecu, setMontantRecu] = React.useState("");
    const montantTrajet = location.state?.montant || trajet?.prix || 0;
    const [cashError, setCashError] = React.useState("");

    const handleCashClick = () => {
        setShowCashModal(true);
        setMontantRecu("");
        setCashError("");
    };

    const [reservationExists, setReservationExists] = React.useState(false);
    const [showReservationAlert, setShowReservationAlert] = React.useState(false);

    const handleCashValidation = async () => {
        if (parseFloat(montantRecu) < parseFloat(montantTrajet)) {
            setCashError("Le montant reçu est insuffisant !");
        } else if (parseFloat(montantRecu) > parseFloat(montantTrajet)) {
            setCashError("Le montant reçu est supérieur au montant du trajet !");
        } else {
            setCashError("");
            setShowCashModal(false);
            // Vérifie si le paiement existe déjà pour cette réservation
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
                    // Récupère la réservation existante pour obtenir tous les champs
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
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

    // Si "pour" vaut "autre", initialise les champs vides, sinon avec les infos utilisateur
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
        <div className="bg-dark min-vh-100" style={{ minHeight: "100vh" }}>
            <Navbar />
            <div className=" ">
                <div className="mt-5 text-center">
                    <h5 className="text-light mb-3">Informations du passager</h5>
                    <div className="justify-content-center mb-3">
                        <div className="row justify-content-center mb-3">
                            <div className="col-auto">
                                <div className="input-group mb-1">
                                    <span className="text-light input-group-text bg-secondary">Nom</span>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Nom du passager"
                                        value={nomPassager}
                                        onChange={e => setNomPassager(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-auto">
                                <div className="input-group">
                                    <span className="text-light input-group-text bg-secondary">Prénom</span>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Prénom du passager"
                                        value={prenomPassager}
                                        onChange={e => setPrenomPassager(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        className="btn btn-success me-3"
                        onClick={handleSave}
                        disabled={loading || !nomPassager || !prenomPassager}
                    >
                        {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </button>
                    <button
                        className="btn btn-warning"
                        onClick={() => navigate("/")}
                        disabled={loading}
                    >
                        Annuler
                    </button>
                </div>
            </div>
            <div className="container py-5">
                <h2 className="mb-4 text-center text-light">Choisissez un moyen de Paiement</h2>
                <div className="row justify-content-center">
                    {filteredPaymentOptions.map((option, idx) => (
                        <div className="col-md-4 mb-4 " key={idx}>
                            <div className="card h-100 shadow-sm bg-black text-light">
                                <div className="card-body d-flex flex-column align-items-center">
                                    {option.icon}
                                    <h5 className="card-title mt-3 ">{option.name}</h5>
                                    <p className="card-text text-center">{option.description}</p>
                                    {option.name === "Espèces" ? (
                                        <button className="btn btn-info mt-auto w-100" onClick={handleCashClick}>
                                            Règlement en espèces
                                        </button>
                                    ) : (
                                        <button className="btn btn-info mt-auto w-100" disabled>
                                            Sélectionner
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                {/* Modale de vérification paiement espèces */}
                {showCashModal && (
                    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content bg-dark text-light">
                                <div className="modal-header">
                                    <h5 className="modal-title">Vérification paiement en espèces</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowCashModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Montant du trajet en {monnaie.format("")} :</label>
                                        <input type="text" className="form-control bg-dark text-warning text-center" value={montantTrajet} disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Montant reçu :</label>
                                        <input
                                            type="text"
                                            className={`form-control ${montantRecu && !/^\d+(\.\d{1,2})?$/.test(montantRecu) ? "is-invalid" : ""}`}
                                            value={montantRecu}
                                            onChange={e => {
                                                const val = e.target.value;
                                                // Autorise uniquement les floats positifs avec max 2 décimales
                                                if (val === "" || /^\d+(\.\d{0,2})?$/.test(val)) {
                                                    setMontantRecu(val);
                                                }
                                            }}
                                            pattern="^\d+(\.\d{1,2})?$"
                                            inputMode="decimal"
                                            min="0"
                                            max="999999"
                                            placeholder="Ex: 1500.00"
                                        />
                                        {montantRecu && !/^\d+(\.\d{1,2})?$/.test(montantRecu) && (
                                            <div className="invalid-feedback">
                                                Veuillez entrer un montant valide (max 2 décimales).
                                            </div>
                                        )}
                                    </div>
                                    {cashError && <div className="alert alert-danger py-2">{cashError}</div>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowCashModal(false)}>Annuler</button>
                                    <button type="button" className="btn btn-success" onClick={handleCashValidation}>Valider</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modale d'alerte si réservation existe déjà */}
                {showReservationAlert && (
                    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.7)" }} tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content bg-dark text-light">
                                <div className="modal-header">
                                    <h5 className="modal-title">Réservation déjà enregistrée</h5>
                                </div>
                                <div className="modal-body">
                                    <div className="alert alert-warning text-center">
                                        Une réservation existe déjà pour ce trajet.
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={() => { setShowReservationAlert(false); navigate('/mes-billets', { state: { reservationId: location.state?.reservationId } }); }}>
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                    <small className="text-muted">
                        * Sélectionnez une option pour continuer le paiement.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default PaiementPage;