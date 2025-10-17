import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../services/api"; // Assurez-vous que le chemin est correct


// Modal pour ajouter un horaire
function HoraireFormModal({ show, handleClose, handleSave, trajets }) {
    const [form, setForm] = useState({
        trajetId: "",
        dateDepart: "",
        dateArrivee: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSave(form);
        setForm({ trajet_id: "", date_depart: "", date_arrivee: "" });
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton style={{ background: "#232526", color: "#fff" }}>
                <Modal.Title>Publier un Billet</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit} style={{ background: "#232526", color: "#fff" }}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Trajet</Form.Label>
                        <Form.Select
                            name="trajetId"
                            value={form.trajetId}
                            onChange={handleChange}
                            required
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        >
                            <option value="">Sélectionner un trajet</option>
                            {trajets.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.transport.type} : {t.transport.numero} - 
                                     {t.gare_depart.ville} ({t.gare_depart.nom}) → {t.gare_arrivee.ville} ({t.gare_arrivee.nom})
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Date de départ</Form.Label>
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
                        <Form.Label>Date d'arrivée</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            name="dateArrivee"
                            value={form.dateArrivee}
                            onChange={handleChange}
                            required
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer style={{ background: "#232526" }}>
                    <Button variant="secondary" onClick={handleClose}>
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        style={{
                            background: "linear-gradient(90deg, #00b894 60%, #0984e3 100%)",
                            color: "#fff",
                            fontWeight: 700,
                            border: "none",
                        }}
                    >
                        Enregistrer
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default HoraireFormModal;