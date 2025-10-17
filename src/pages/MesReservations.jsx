import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import api from '../services/api';
import monnaie from '../services/variable';

const MesReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [horaires, setHoraires] = useState([]);
    const [trajets, setTrajets] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Récupère l'utilisateur connecté
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupère toutes les réservations
                const res = await api.get("/reservation", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                // Récupère tous les horaires
                const horairesRes = await api.get("/horaire", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                // Récupère tous les trajets
                const trajetsRes = await api.get("/trajet", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setHoraires(horairesRes.data);
                setTrajets(trajetsRes.data);

                // Filtrer les réservations de l'utilisateur connecté
                const userReservations = res.data.filter(
                    (r) => r.utilisateurId === userInfo.id
                );
                setReservations(userReservations);
            } catch (err) {
                console.error("Erreur lors du chargement des réservations, horaires ou trajets", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userInfo.id]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="d-flex justify-content-center align-items-center vh-100" style={{
                    background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)"
                }}>
                    <div className="text-center">
                        <div className="spinner-border text-info mb-3" style={{width: '3rem', height: '3rem'}} role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                        <h5 className="text-light">Chargement de vos réservations...</h5>
                    </div>
                </div>
            </>
        );
    }

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
                            <i className="fas fa-ticket-alt me-3 text-info"></i>
                            Mes Réservations
                        </h1>
                        <p className="text-light opacity-75">
                            Consultez l'état de toutes vos réservations de voyage
                        </p>
                    </div>
                </div>

                {/* Carte principale */}
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="card border-0 shadow-lg bg-dark">
                            <div className="card-body p-4">
                                {reservations.length === 0 ? (
                                    <div className="text-center py-5">
                                        <i className="fas fa-train fa-4x text-secondary mb-4"></i>
                                        <h4 className="text-light mb-3">Aucune réservation trouvée</h4>
                                        <p className="text-muted mb-4">
                                            Vous n'avez pas encore effectué de réservation.
                                        </p>
                                        <button 
                                            className="btn btn-info btn-lg"
                                            onClick={() => navigate('/')}
                                        >
                                            <i className="fas fa-search me-2"></i>
                                            Découvrir nos trajets
                                        </button>
                                    </div>
                                ) : (
                                    <div className="row g-4">
                                        {reservations.map((reservation) => {
                                            // Trouver l'horaire correspondant
                                            const horaire = horaires?.find(h => h.id === reservation?.horaireId);
                                            // Trouver le trajet correspondant à l'horaire
                                            const trajet = trajets?.find(t => t.id === horaire?.trajetId);
                                            
                                            return (
                                                <div key={reservation.id} className="col-12">
                                                    <div className="card bg-secondary border-0 hover-card">
                                                        <div className="card-body p-4">
                                                            <div className="row align-items-center">
                                                                {/* Itinéraire */}
                                                                <div className="col-md-6 mb-3 mb-md-0">
                                                                    <div className="d-flex align-items-center mb-3">
                                                                        <div className="bg-success rounded-circle p-2 me-3">
                                                                            <i className="fas fa-play text-white"></i>
                                                                        </div>
                                                                        <div>
                                                                            <small className="text-muted">Départ</small>
                                                                            <h6 className="mb-0 text-white fw-bold">
                                                                                {trajet ? trajet.gare_depart.ville : "Ville inconnue"}
                                                                            </h6>
                                                                            <small className="text-info">
                                                                                {trajet ? trajet.gare_depart.nom : "Gare inconnue"}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="bg-warning rounded-circle p-2 me-3">
                                                                            <i className="fas fa-flag-checkered text-white"></i>
                                                                        </div>
                                                                        <div>
                                                                            <small className="text-muted">Arrivée</small>
                                                                            <h6 className="mb-0 text-white fw-bold">
                                                                                {trajet ? trajet.gare_arrivee.ville : "Ville inconnue"}
                                                                            </h6>
                                                                            <small className="text-info">
                                                                                {trajet ? trajet.gare_arrivee.nom : "Gare inconnue"}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Informations détaillées */}
                                                                <div className="col-md-6">
                                                                    <div className="row g-3">
                                                                        <div className="col-6">
                                                                            <small className="text-muted">Date de départ</small>
                                                                            <p className="mb-0 text-white fw-bold">
                                                                                {horaire?.dateDepart
                                                                                    ? new Date(horaire.dateDepart).toLocaleDateString()
                                                                                    : "N/A"}
                                                                            </p>
                                                                            <small className="text-info">
                                                                                {horaire?.dateDepart
                                                                                    ? new Date(horaire.dateDepart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                                                    : ""}
                                                                            </small>
                                                                        </div>
                                                                        
                                                                        <div className="col-6">
                                                                            <small className="text-muted">Passager</small>
                                                                            <p className="mb-0 text-white fw-bold">
                                                                                {reservation.prenom_passager} {reservation.nom_passager}
                                                                            </p>
                                                                        </div>

                                                                        <div className="col-6">
                                                                            <small className="text-muted">Réservé le</small>
                                                                            <p className="mb-0 text-white">
                                                                                {reservation.dateReservation
                                                                                    ? new Date(reservation.dateReservation).toLocaleDateString()
                                                                                    : "N/A"}
                                                                            </p>
                                                                        </div>

                                                                        <div className="col-6">
                                                                            <small className="text-muted">Prix</small>
                                                                            <p className="mb-0 text-warning fw-bold fs-5">
                                                                                {trajet ? monnaie.format(trajet.prix) : "N/A"}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Statut et actions */}
                                                            <div className="row align-items-center mt-3 pt-3 border-top border-dark">
                                                                <div className="col-md-6 mb-2 mb-md-0">
                                                                    <span className={`badge px-3 py-2 fs-6 fw-bold
                                                                        ${reservation.statut === "Annulée" ? "bg-danger" : ""}
                                                                        ${reservation.statut === "Confirmée" ? "bg-success" : ""}
                                                                        ${reservation.statut === "En attente" ? "bg-warning text-dark" : ""}
                                                                        ${!["Annulée", "Confirmée", "En attente"].includes(reservation.statut) ? "bg-info text-dark" : ""}
                                                                    `}>
                                                                        <i className={`fas ${
                                                                            reservation.statut === "Annulée" ? "fa-times-circle" :
                                                                            reservation.statut === "Confirmée" ? "fa-check-circle" :
                                                                            reservation.statut === "En attente" ? "fa-clock" : "fa-info-circle"
                                                                        } me-2`}></i>
                                                                        {reservation.statut}
                                                                    </span>
                                                                </div>
                                                                
                                                                <div className="col-md-6 text-md-end">
                                                                    {reservation.statut === "En attente" && (
                                                                        <button
                                                                            className="btn btn-info btn-lg fw-bold px-4"
                                                                            onClick={() => {
                                                                                navigate('/paiement', {
                                                                                    state: {
                                                                                        reservationId: reservation.id,
                                                                                        montant: trajet ? trajet.prix : null,
                                                                                        nom: reservation.nom_passager,
                                                                                        prenom: reservation.prenom_passager
                                                                                    }
                                                                                });
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-credit-card me-2"></i>
                                                                            Payer maintenant
                                                                        </button>
                                                                    )}
                                                                    
                                                                    {reservation.statut === "Confirmée" && (
                                                                        <button
                                                                            className="btn btn-outline-success btn-lg px-4"
                                                                            onClick={() => {
                                                                                // Navigation vers les billets ou détails
                                                                                navigate('/mes-billets');
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-ticket-alt me-2"></i>
                                                                            Voir billet
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statistiques */}
                        {reservations.length > 0 && (
                            <div className="row mt-4">
                                <div className="col-12">
                                    <div className="card bg-dark border-info">
                                        <div className="card-body py-3">
                                            <div className="row text-center">
                                                <div className="col-md-3">
                                                    <h4 className="text-info fw-bold">{reservations.length}</h4>
                                                    <small className="text-muted">Total réservations</small>
                                                </div>
                                                <div className="col-md-3">
                                                    <h4 className="text-success fw-bold">
                                                        {reservations.filter(r => r.statut === "Confirmée").length}
                                                    </h4>
                                                    <small className="text-muted">Confirmées</small>
                                                </div>
                                                <div className="col-md-3">
                                                    <h4 className="text-warning fw-bold">
                                                        {reservations.filter(r => r.statut === "En attente").length}
                                                    </h4>
                                                    <small className="text-muted">En attente</small>
                                                </div>
                                                <div className="col-md-3">
                                                    <h4 className="text-danger fw-bold">
                                                        {reservations.filter(r => r.statut === "Annulée").length}
                                                    </h4>
                                                    <small className="text-muted">Annulées</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Styles CSS */}
            <style>
                {`
                    .hover-card:hover {
                        transform: translateY(-3px);
                        transition: all 0.3s ease;
                        box-shadow: 0 8px 25px rgba(0, 255, 255, 0.1) !important;
                    }
                    .border-info {
                        border-color: #0dcaf0 !important;
                    }
                `}
            </style>
        </div>
    );
};

export default MesReservations;