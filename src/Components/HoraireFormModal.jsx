import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

function HoraireFormModal({ show, handleClose, handleSave, trajets, horaireToEdit, isEditing = false }) {

    const [form, setForm] = useState({
        trajetId: "",
        dateDepart: "",
        dateArrivee: "",
        placesDisponibles: ""
    });

    // remplit le formulaire avec les données existantes
    useEffect(() => {
        if (isEditing && horaireToEdit) {
            setForm({
                trajetId: horaireToEdit.trajetId || "",
                dateDepart: horaireToEdit.dateDepart ? 
                    new Date(horaireToEdit.dateDepart).toISOString().slice(0, 16) : "",
                dateArrivee: horaireToEdit.dateArrivee ? 
                    new Date(horaireToEdit.dateArrivee).toISOString().slice(0, 16) : "",
                placesDisponibles: horaireToEdit.placesDisponibles || ""
            });
        } else {
            // Réinitialise le formulaire pour une nouvelle création
            setForm({
                trajetId: "",
                dateDepart: "",
                dateArrivee: "",
                placesDisponibles: ""
            });
        }
    }, [horaireToEdit, isEditing, show]); //Déclenché à chaque ouverture

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    //juste pour push
    const onSubmit = (e) => {
        e.preventDefault();
        handleSave(form);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={onSubmit} style={{ background: "#232526", borderRadius: 12 }}>
                <Modal.Header closeButton style={{ borderBottom: "none", background: "#232526" }}>
                    <Modal.Title style={{ color: "#00b894", fontWeight: 700 }}>
                        {isEditing ? "Modifier le billet" : "Publier un nouveau billet"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>Trajet</Form.Label>
                        <Form.Control
                            as="select"
                            name="trajetId"
                            value={form.trajetId}
                            onChange={handleChange}
                            required
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        >
                            <option value="">Sélectionnez un trajet</option>
                            {trajets.map((trajet) => (
                                <option key={trajet.id} value={trajet.id}>
                                    {trajet.gare_depart.nom} → {trajet.gare_arrivee.nom} 
                                    ({trajet.transport.type} n°{trajet.transport.numero})
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>Date et heure de départ</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="dateDepart"
                            value={form.dateDepart}
                            onChange={handleChange}
                            required
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>Date et heure d'arrivée</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="dateArrivee"
                            value={form.dateArrivee}
                            onChange={handleChange}
                            required
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>Places disponibles</Form.Label>
                        <Form.Control
                            type="number"
                            name="placesDisponibles"
                            value={form.placesDisponibles}
                            onChange={handleChange}
                            required
                            min="1"
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: "none", background: "#232526" }}>
                    <Button variant="secondary" onClick={handleClose} style={{ borderRadius: 8 }}>
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        style={{
                            background: "linear-gradient(90deg, #00b894 60%, #0984e3 100%)",
                            color: "#fff",
                            fontWeight: 700,
                            border: "none",
                            borderRadius: 8,
                        }}
                    >
                        {isEditing ? "Modifier" : "Publier"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default HoraireFormModal;