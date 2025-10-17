import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

// Modal pour créer une gare
function GareFormModal({ show, handleClose, handleSave, compagnieId }) {

    const [form, setForm] = useState({
        nom: "",
        ville: "",
        pays: "",
        localisation: "",
        compagnie: {
            id: compagnieId
        }
    });

    const handleChange = (e) => {
        setForm({ 
            ...form, 
            [e.target.name]: e.target.value 
        });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        
        const gareData = {
            nom: form.nom,
            ville: form.ville,
            pays: form.pays,
            localisation: form.localisation,
            compagnie: {
                id: compagnieId
            }
        };
        
        handleSave(gareData);
        
        // Réinitialisation du formulaire
        setForm({
            nom: "",
            ville: "",
            pays: "",
            localisation: "",
            compagnie: {
                id: compagnieId
            }
        });
    };

    // Liste des pays pour le select
    const paysListe = [
        "France",
        "Belgique", 
        "Suisse",
        "Luxembourg",
        "Allemagne",
        "Espagne",
        "Italie",
        "Portugal",
        "Royaume-Uni",
        "Pays-Bas"
    ];

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Form onSubmit={onSubmit} style={{ background: "#232526", borderRadius: 12 }}>
                <Modal.Header closeButton style={{ borderBottom: "none", background: "#232526" }}>
                    <Modal.Title style={{ color: "#00b894", fontWeight: 700 }}>
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Ajouter une nouvelle gare
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {/* Nom de la gare */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>
                            <i className="fas fa-signature me-2"></i>
                            Nom de la gare
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="nom"
                            value={form.nom}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Gare du Nord, Gare de Lyon..."
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        />
                        <Form.Text style={{ color: "#b2bec3" }}>
                            Nom officiel de la gare
                        </Form.Text>
                    </Form.Group>

                    {/* Ville */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>
                            <i className="fas fa-city me-2"></i>
                            Ville
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="ville"
                            value={form.ville}
                            onChange={handleChange}
                            required
                            placeholder="Ex: Paris, Lyon, Marseille..."
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        />
                    </Form.Group>

                    {/* Pays */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>
                            <i className="fas fa-flag me-2"></i>
                            Pays
                        </Form.Label>
                        <Form.Control
                            as="select"
                            name="pays"
                            value={form.pays}
                            onChange={handleChange}
                            required
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        >
                            <option value="">Sélectionnez un pays</option>
                            {paysListe.map((pays, index) => (
                                <option key={index} value={pays}>
                                    {pays}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    {/* Localisation/Adresse */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>
                            <i className="fas fa-map-pin me-2"></i>
                            Localisation (Adresse)
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="localisation"
                            value={form.localisation}
                            onChange={handleChange}
                            required
                            placeholder="Ex: 18 rue de Dunkerque, 75010 Paris"
                            style={{ background: "#181920", color: "#fff", border: "1px solid #636e72" }}
                        />
                        <Form.Text style={{ color: "#b2bec3" }}>
                            Adresse complète de la gare
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
                            Cette gare sera automatiquement associée à votre compagnie
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
                        Créer la gare
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default GareFormModal;