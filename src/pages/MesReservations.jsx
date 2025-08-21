import React, { useEffect, useState } from 'react';

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
        return <div>Chargement des réservations...</div>;
    }

    return (
        <div>
            <h1>Mes Réservations</h1>
            {reservations.length === 0 ? (
                <p>Aucune réservation trouvée.</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => (
                        <li key={reservation.id}>
                            <strong>{reservation.titre}</strong> <br />
                            Date: {reservation.date} <br />
                            Statut: {reservation.statut}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MesReservations;
