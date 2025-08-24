import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import Navbar from './Navbar';

const MesReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Remplacez cette URL par votre API réelle
        fetch('/api/mes-reservations')
            .then((res) => res.json())
            .then((data) => {
                setReservations(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

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
                <div className="card bg-secondary text-light shadow-lg mx-auto" style={{ maxWidth: 700 }}>
                    <div className="card-body">
                        <h1 className="card-title text-center mb-4 fw-bold" style={{ letterSpacing: 1 }}>Mes Réservations</h1>
                        {reservations.length === 0 ? (
                            <p className="text-center">Aucune réservation trouvée.</p>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {reservations.map((reservation) => (
                                    <li key={reservation.id} className="list-group-item bg-dark text-light mb-3 rounded">
                                        <div className="fw-semibold fs-5">{reservation.titre}</div>
                                        <div className="text-muted">Date : {reservation.date}</div>
                                        <span
                                            className={`badge mt-2 px-3 py-2 fs-6
                                                ${reservation.statut === "Annulée" ? "bg-danger" : ""}
                                                ${reservation.statut === "Confirmée" ? "bg-success" : ""}
                                                ${reservation.statut !== "Annulée" && reservation.statut !== "Confirmée" ? "bg-info text-dark" : ""}
                                            `}
                                        >
                                            {reservation.statut}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MesReservations;
