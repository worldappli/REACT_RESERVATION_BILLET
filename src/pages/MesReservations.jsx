import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
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
            <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-dark min-vh-100">
            <Navbar />
            <div className="container py-5">
                <div className="card bg-secondary text-light shadow-lg mx-auto" style={{ maxWidth: 800 }}>
                    <div className="card-body">
                        <h1 className="card-title text-black bg-warning text-center mb-4 fw-bold" style={{ letterSpacing: 1 }}>Mes Réservations</h1>
                        {reservations.length === 0 ? (
                            <p className="text-center">Aucune réservation trouvée.</p>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {reservations.map((reservation) => {
                                    // Trouver l'horaire correspondant
                                    const horaire = horaires?.find(h => h.id === reservation?.horaireId);
                                    console.log(horaire)
                                    // Trouver le trajet correspondant à l'horaire
                                    const trajet = trajets?.find(t => t.id === horaire?.trajetId);
                                    console.log(trajet)
                                    return (
                                        <li key={reservation.id} className="list-group-item bg-black text-light mb-3 rounded">
                                            <div className="fw-semibold fs-5">
                                                {trajet
                                                    ? <>
                                                        {trajet?.gare_depart?.nom} ({trajet?.gare_depart?.ville})
                                                        {" → "}
                                                        {trajet?.gare_arrivee?.nom} ({trajet?.gare_arrivee?.ville})
                                                    </>
                                                    : <span className="text-warning">Trajet inconnu</span>
                                                }
                                            </div>
                                            <div>
                                                <span className="me-3">
                                                    <strong>Date départ :</strong>{" "}
                                                    {horaire?.dateDepart
                                                        ? new Date(horaire.dateDepart).toLocaleString()
                                                        : "N/A"}
                                                </span>
                                                <span className="me-3">
                                                    <strong>Passager :</strong> {reservation.prenom_passager} {reservation.nom_passager}
                                                </span>
                                                <span className="me-3">
                                                    <strong>Réservé le :</strong>{" "}
                                                    {reservation.dateReservation
                                                        ? new Date(reservation.dateReservation).toLocaleString()
                                                        : "N/A"}
                                                </span>
                                                <span className="me-3 bg-danger">
                                                    <strong>Prix :</strong>{" "}
                                                    {trajet ? monnaie.format(trajet.prix) : "N/A"}
                                                </span>
                                            </div>
                                            <div className="d-flex align-items-center gap-2 mt-2">
                                                <span
                                                    className={`badge px-3 py-2 fs-6
                                                        ${reservation.statut === "Annulée" ? "bg-danger" : ""}
                                                        ${reservation.statut === "Confirmée" ? "bg-success" : ""}
                                                        ${reservation.statut !== "Annulée" && reservation.statut !== "Confirmée" ? "bg-info text-dark" : ""}
                                                    `}
                                                >
                                                    {reservation.statut}
                                                </span>
                                                {reservation.statut === "En attente" && (
                                                    <button
                                                        className="btn btn-outline-warning btn-sm"
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
                                                        Continuer
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MesReservations;
