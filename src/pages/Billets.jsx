import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import monnaie from "../services/variable";
import QRCode from "react-qr-code";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";


const Billets = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const reservationId = location.state?.reservationId;
    const [billet, setBillet] = useState(null);
    const [reservation, setReservation] = useState(null);
    const [horaire, setHoraire] = useState(null);
    const [trajet, setTrajet] = useState(null);
    const [compagnie, setCompagnie] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (!reservationId) return;
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            try {
                    // Récupère tous les billets
                    const resBillets = await api.get("/billet", { headers });
                    const existingBillet = resBillets.data.find(b => String(b.reservationId) === String(reservationId));
                    let billetData = null;
                    if (existingBillet) {
                        billetData = existingBillet;
                        setError("Un billet existe déjà pour cette réservation.");
                    } else {
                        // Si le billet n'existe pas, on le crée
                        const billetRes = await api.post("/billet", {
                            reservationId: reservationId,
                            format: "PDF",
                        });
                        billetData = billetRes.data;
                    }
                    setBillet(billetData);

                // Récupère la réservation
                const resRes = await api.get(`/reservation/${reservationId}`, { headers });
                setReservation(resRes.data);

                // Récupère l'horaire
                const horaireRes = await api.get(`/horaire/${resRes.data.horaireId}`, { headers });
                setHoraire(horaireRes.data);

                // Récupère le trajet
                const trajetRes = await api.get(`/trajet/${horaireRes.data.trajetId}`, { headers });
                setTrajet(trajetRes.data);

                // Récupère la compagnie
                if (trajetRes.data.compagnieId) {
                    const compagnieRes = await api.get(`/compagnie/${trajetRes.data.compagnieId}`, { headers });
                    setCompagnie(compagnieRes.data);
                }
            } catch (err) {
                setError("Erreur lors de la génération ou récupération du billet.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [reservationId]);

    if (!reservationId) {
        return <div className="alert alert-danger">Aucune réservation sélectionnée.</div>;
    }

    if (loading) {
        return <div className="text-center py-5">Chargement du billet...</div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex flex-column align-items-center">
                <div>{error}</div>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/mes-billets', { state: { reservationId } })}>
                    OK
                </button>
            </div>
        );
    }

    return (
        <div className="container-fluid bg-dark min-vh-100 text-light p-0">
            <Navbar />
            <div className="container py-5">
                <div className="card shadow-lg mx-auto bg-dark text-light border-light" style={{ maxWidth: 600 }}>
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Billet numérique</h2>
                        {billet && (
                                        <>
                                            <div className="mb-3">
                                                <strong>Code billet :</strong> <span className="text-primary">{billet.codeBillet}</span>
                                            </div>
                                            <div className="mb-3">
                                                <strong>Date d'émission :</strong> {new Date(billet.dateEmission).toLocaleString()}
                                            </div>
                                            <div className="mb-3">
                                                <strong>Format :</strong> {billet.format}
                                            </div>
                                            <div className="mb-3 text-center">
                                                <QRCode value={billet.codeBillet} size={128} bgColor="#212529" fgColor="#fff" />
                                                <div className="mt-2 text-muted" style={{fontSize: "0.9em"}}>QR code à scanner pour valider le billet</div>
                                            </div>
                                        </>
                        )}
                        {reservation && (
                            <>
                                <div className="mb-3">
                                    <strong>Nom du passager :</strong> {reservation.nom_passager}
                                </div>
                                <div className="mb-3">
                                    <strong>Prénom du passager :</strong> {reservation.prenom_passager}
                                </div>
                            </>
                        )}
                        {trajet && (
                            <>
                                <div className="mb-3">
                                    <strong>Trajet :</strong> {trajet.gare_depart?.nom} ({trajet.gare_depart?.ville}) → {trajet.gare_arrivee?.nom} ({trajet.gare_arrivee?.ville})
                                </div>
                                <div className="mb-3">
                                    <strong>Prix :</strong> {monnaie.format(trajet.prix)}
                                </div>
                            </>
                        )}
                        {horaire && (
                            <div className="mb-3">
                                <strong>Date de départ :</strong> {new Date(horaire.dateDepart).toLocaleString()}
                            </div>
                        )}
                        {compagnie && (
                            <div className="mb-3">
                                <strong>Compagnie :</strong> {compagnie.nom}
                            </div>
                        )}
                        <div className="text-center mt-4">
                            <span className="badge bg-success fs-5">Billet numérique PDF</span>
                        </div>
                        <div className="d-flex justify-content-center gap-3 mt-4">
                            <button className="btn btn-outline-light" onClick={() => window.print()}>
                                Exporter en PDF
                            </button>
                            <button className="btn btn-success" onClick={() => {
                                navigate('/mes-billets', { state: { reservationId } });
                            }}>
                                Mes billets
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billets;
