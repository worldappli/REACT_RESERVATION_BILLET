import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../services/api"; // Assurez-vous que le chemin est correct

// Modal pour créer un transport
function TransportFormModal({ show, handleClose, handleSave, compagnieId }) {

    const [form, setForm] = useState({
        type: "",
        numero: "",
        capacite: "",
        compagnie: {
            id: compagnieId // Utilise l'ID de la compagnie connectée
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "type" || name === "numero" || name === "capacite") {
            setForm({ 
                ...form, 
                [name]: name === "capacite" ? parseInt(value) || "" : value 
            });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        
        // Validation des données
        const transportData = {
            type: form.type,
            numero: form.numero,
            capacite: parseInt(form.capacite),
            compagnie: {
                id: compagnieId
            }
        };
        
        handleSave(transportData);
        
        // Réinitialisation du formulaire
        setForm({
            type: "",
            numero: "",
            capacite: "",
            compagnie: {
                id: compagnieId
            }
        });
    };

    // Options pour le type de transport
    const typesTransport = [
        "TGV",
        "TER", 
        "Intercités",
        "Train Corail",
        "Train Grande Ligne",
        "Train Régional",
        "Autocar",
        "Métro",
        "Tramway",
        "Bus"
    ];

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={onSubmit} style={{ background: "#232526", borderRadius: 12 }}>
                <Modal.Header closeButton style={{ borderBottom: "none", background: "#232526" }}>
                    <Modal.Title style={{ color: "#00b894", fontWeight: 700 }}>
                        <i className="fas fa-bus me-2"></i>
                        Ajouter un nouveau transport
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {/* Type de transport */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>
                            <i className="fas fa-train me-2"></i>
                            Type de transport
                        </Form.Label>
                        <Form.Control
                            as="select"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            required
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        >
                            <option value="">Sélectionnez un type</option>
                            {typesTransport.map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Form.Control>
                        <Form.Text style={{ color: "#b2bec3" }}>
                            Choisissez le type de véhicule
                        </Form.Text>
                    </Form.Group>

                    {/* Numéro du transport */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>
                            <i className="fas fa-hashtag me-2"></i>
                            Numéro d'identification
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="numero"
                            value={form.numero}
                            onChange={handleChange}
                            required
                            placeholder="Ex: TGV8542, TER123, BUS456"
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        />
                        <Form.Text style={{ color: "#b2bec3" }}>
                            Numéro unique identifiant le transport
                        </Form.Text>
                    </Form.Group>

                    {/* Capacité */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>
                            <i className="fas fa-users me-2"></i>
                            Capacité (nombre de places)
                        </Form.Label>
                        <Form.Control
                            type="number"
                            name="capacite"
                            value={form.capacite}
                            onChange={handleChange}
                            required
                            min="1"
                            max="1000"
                            placeholder="Ex: 150, 300, 45"
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        />
                        <Form.Text style={{ color: "#b2bec3" }}>
                            Nombre total de places disponibles
                        </Form.Text>
                    </Form.Group>

                    {/* Informations sur la compagnie (lecture seule) */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>
                            <i className="fas fa-building me-2"></i>
                            Compagnie
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value="Votre compagnie (auto-assigné)"
                            disabled
                            style={{ background: "#2d3436", color: "#b2bec3", border: "1px solid #636e72" }}
                        />
                        <Form.Text style={{ color: "#74b9ff" }}>
                            Ce transport sera automatiquement associé à votre compagnie
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                
                <Modal.Footer style={{ borderTop: "none", background: "#232526" }}>
                    <Button 
                        variant="secondary" 
                        onClick={handleClose} 
                        style={{ borderRadius: 8 }}
                    >
                        <i className="fas fa-times me-2"></i>
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
                        <i className="fas fa-save me-2"></i>
                        Créer le transport
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default TransportFormModal;