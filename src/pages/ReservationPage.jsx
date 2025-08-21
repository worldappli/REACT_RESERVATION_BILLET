import React, { useState } from 'react';

const ReservationPage = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        date: '',
        seats: 1,
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ici, vous pouvez envoyer les données à une API ou les traiter
        setSubmitted(true);
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
            <h2>Réserver un billet</h2>
            {submitted ? (
                <div>
                    <h3>Merci pour votre réservation, {form.name} !</h3>
                    <p>
                        Un email de confirmation a été envoyé à {form.email}.<br />
                        Date : {form.date}<br />
                        Nombre de places : {form.seats}
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nom :</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email :</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Date :</label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Nombre de places :</label>
                        <input
                            type="number"
                            name="seats"
                            min="1"
                            max="10"
                            value={form.seats}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Réserver</button>
                </form>
            )}
        </div>
    );
};

export default ReservationPage;