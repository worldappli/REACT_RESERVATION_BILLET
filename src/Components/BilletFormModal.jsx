import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../services/api"; // Assurez-vous que le chemin est correct

// Modal pour publier un billet
function BilletFormModal({ show, handleClose, handleSave, listTransport, listGare }) {

    const [form, setForm] = useState({
        transportId: "",
        gareDepartId: "",
        gareArriveeId: "",
        duree: "",
        prix: "",
        arret: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        handleSave(form);
        setForm({
            transportId: "",
            gareDepartId: "",
            gareArriveeId: "",
            duree: "",
            prix: "",
            arret: "",
        });
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={onSubmit} style={{ background: "#232526", borderRadius: 12 }}>
                <Modal.Header closeButton style={{ borderBottom: "none", background: "#232526" }}>
                    <Modal.Title style={{ color: "#00b894", fontWeight: 700 }}>Creer un trajet</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>Transport</Form.Label>
                        <Form.Control
                            as="select"
                            name="transportId"
                            value={form.transportId}
                            onChange={handleChange}
                            required
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        >
                            <option value="">Sélectionnez un transport</option>
                            {listTransport.map((transport) => (
                                <option key={transport.id} value={transport.id}>
                                    {transport.type} → {transport.numero} → {transport.capacite} Places
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>Gare de départ</Form.Label>
                        <Form.Control
                            as="select"
                            name="gareDepartId"
                            value={form.gareDepartId}
                            onChange={handleChange}
                            required
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        >
                            <option value="">Sélectionnez une gare</option>
                            {listGare.map((gare) => (
                                <option key={gare.id} value={gare.id}>
                                    {gare.nom} - ({gare.ville})
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>Gare d'arrivée</Form.Label>
                        <Form.Control
                            as="select"
                            name="gareArriveeId"
                            value={form.gareArriveeId}
                            onChange={handleChange}
                            required
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        >
                            <option value="">Sélectionnez une gare</option>
                            {listGare.map((gare) => (
                                <option key={gare.id} value={gare.id}>
                                    {gare.nom} - ({gare.ville})
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>Durée (minutes)</Form.Label>
                        <Form.Control
                            type="number"
                            name="duree"
                            value={form.duree}
                            onChange={handleChange}
                            required
                            min={1}
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>Prix (€)</Form.Label>
                        <Form.Control
                            type="number"
                            name="prix"
                            value={form.prix}
                            onChange={handleChange}
                            required
                            min={0}
                            step="0.01"
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>Arrêts (séparés par virgule)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="arret"
                            value={form.arret}
                            onChange={handleChange}
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
                        Publier
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default BilletFormModal;