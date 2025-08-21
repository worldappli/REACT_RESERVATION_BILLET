import React, { useState } from "react";

const PaiementPage = () => {
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simuler le paiement
        setSuccess(true);
    };

    return (
        <div style={{ maxWidth: 400, margin: "40px auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
            <h2>Paiement</h2>
            {success ? (
                <div style={{ color: "green", marginTop: 20 }}>
                    Paiement réussi ! Merci pour votre réservation.
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label>Nom sur la carte</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            style={{ width: "100%", padding: 8, marginTop: 4 }}
                        />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label>Numéro de carte</label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            maxLength={16}
                            required
                            style={{ width: "100%", padding: 8, marginTop: 4 }}
                            pattern="\d{16}"
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label>Expiration</label>
                            <input
                                type="text"
                                value={expiry}
                                onChange={e => setExpiry(e.target.value)}
                                maxLength={5}
                                required
                                style={{ width: "100%", padding: 8, marginTop: 4 }}
                                placeholder="MM/AA"
                                pattern="\d{2}/\d{2}"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>CVC</label>
                            <input
                                type="text"
                                value={cvc}
                                onChange={e => setCvc(e.target.value)}
                                maxLength={4}
                                required
                                style={{ width: "100%", padding: 8, marginTop: 4 }}
                                pattern="\d{3,4}"
                                placeholder="123"
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label>Montant (€)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                            style={{ width: "100%", padding: 8, marginTop: 4 }}
                            min={1}
                        />
                    </div>
                    <button type="submit" style={{ width: "100%", padding: 10, background: "#007bff", color: "#fff", border: "none", borderRadius: 4 }}>
                        Payer
                    </button>
                </form>
            )}
        </div>
    );
};

export default PaiementPage;