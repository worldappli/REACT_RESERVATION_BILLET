import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import api from "../services/api";

const MesBillets = () => {
        const [selectedBillet, setSelectedBillet] = useState(null);
        const [showModal, setShowModal] = useState(false);
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const location = useLocation();
    const reservationId = location.state?.reservationId;
    const [billets, setBillets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBillets = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            try {
                // Récupère toutes les réservations de l'utilisateur
                const resReservations = await api.get(`/reservation`, { headers });
                const userReservations = resReservations.data.filter(r => r.utilisateurId === userInfo.id);
                const userReservationIds = userReservations.map(r => r.id);

                // Récupère tous les billets
                const resBillets = await api.get(`/billet`, { headers });
                // Filtre les billets pour ceux liés aux réservations de l'utilisateur connecté
                let filtered = resBillets.data.filter(b => userReservationIds.includes(b.reservationId));

                // Pour chaque billet, récupère le trajet via la réservation et l'horaire
                const resHoraires = await api.get(`/horaire`, { headers });
                const resTrajets = await api.get(`/trajet`, { headers });

                filtered = filtered.map(billet => {
                    const reservation = userReservations.find(r => r.id === billet.reservationId);
                    const horaire = reservation ? resHoraires.data.find(h => h.id === reservation.horaireId) : null;
                    const trajet = horaire ? resTrajets.data.find(t => t.id === horaire.trajetId) : null;
                    return {
                        ...billet,
                        trajet,
                        nom_passager: reservation?.nom_passager,
                        prenom_passager: reservation?.prenom_passager,
                        dateDepart: horaire?.dateDepart,
                        dateArrivee : horaire?.dateArrivee
                    };
                });
                setBillets(filtered);
            } catch (err) {
                setError("Erreur lors de la récupération des billets.");
            } finally {
                setLoading(false);
            }
        };
        fetchBillets();
    }, [userInfo.id]);

    return (
        <div className="container-fluid bg-dark min-vh-100 text-light p-0">
            <Navbar />
            <div className="container py-5">
                <h2 className="text-center mb-4">Mes billets</h2>
                {loading && <div className="text-center py-5">Chargement...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {(!loading && billets.length === 0) && (
                    <div className="alert alert-warning text-center">Aucun billet trouvé pour cette réservation.</div>
                )}
                <div className="row justify-content-center">
                    {billets.map((billet) => (
                        <div className="col-md-6 mb-4" key={billet.id}>
                            <div className="card bg-dark text-light border-light shadow-lg">
                                <div className="card-body">
                                    <h5 className="card-title text-center">Billet #{billet.codeBillet}</h5>
                                    {/* <div className="mb-2 text-center">
                                        <QRCode value={billet.codeBillet} size={96} bgColor="#212529" fgColor="#fff" />
                                    </div> */}
                                    {/* Affichage du trajet */}
                                    {billet.trajet && (
                                        <div className="mb-2">
                                            <strong>Trajet :</strong> {billet.trajet.gare_depart?.nom} ({billet.trajet.gare_depart?.ville}) → {billet.trajet.gare_arrivee?.nom} ({billet.trajet.gare_arrivee?.ville})
                                        </div>
                                    )}
                                    {billet.dateDepart && (
                                        <div className="mb-2">
                                            <strong>Date de départ :</strong> {new Date(billet.dateDepart).toLocaleString()}
                                        </div>
                                    )}
                                    <div><strong>Date d'émission :</strong> {new Date(billet.dateEmission).toLocaleString()}</div>
                                    <div><strong>Format :</strong> {billet.format}</div>
                                    <div className="text-center mt-3">
                                        <button className="btn btn-outline-info" onClick={() => { setSelectedBillet(billet); setShowModal(true); }}>
                                            Voir le billet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Modale billet détail */}
            {showModal && selectedBillet && (
                <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.7)" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content bg-dark text-light">
                            <div className="modal-header">
                                <h5 className="modal-title">Détail du billet</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center mb-3">
                                    <QRCode value={selectedBillet.codeBillet} size={128} bgColor="#212529" fgColor="#fff" />
                                </div>
                                <div><strong>Code billet :</strong> <span className="text-primary">{selectedBillet.codeBillet}</span></div>
                                <div><strong>Date d'émission :</strong> {new Date(selectedBillet.dateEmission).toLocaleString()}</div>
                                <div><strong>Format :</strong> {selectedBillet.format}</div>
                                {selectedBillet.trajet && (
                                    <div className="mb-2">
                                        <strong>Trajet :</strong> {selectedBillet.trajet.gare_depart?.nom} ({selectedBillet.trajet.gare_depart?.ville}) → {selectedBillet.trajet.gare_arrivee?.nom} ({selectedBillet.trajet.gare_arrivee?.ville})
                                    </div>
                                )}
                                {selectedBillet.dateDepart && (
                                    <div className="mb-2">
                                        <strong>Date de départ :</strong> {new Date(selectedBillet.dateDepart).toLocaleString()}
                                    </div>
                                )}
                                {selectedBillet.dateArrivee && (
                                    <div className="mb-2">
                                        <strong>Date d'arrivée :</strong> {new Date(selectedBillet.dateArrivee).toLocaleString()}
                                    </div>
                                )}
                                {selectedBillet.nom_passager && (
                                    <div className="mb-2">
                                        <strong>Passager :</strong> {selectedBillet.nom_passager} {selectedBillet.prenom_passager}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Fermer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MesBillets;