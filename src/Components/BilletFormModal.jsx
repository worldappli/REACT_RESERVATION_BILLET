import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";

function BilletFormModal({ show, handleClose, handleSave, reservations }) {

    const [form, setForm] = useState({
        reservationId: "",
        codeBillet: "",
        format: "PDF"
    });

    const [errors, setErrors] = useState({});

    // Génère un code de billet automatique
    const generateCodeBillet = () => {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `BLT-${timestamp}-${random}`;
    };

    // Remplit automatiquement le code billet à l'ouverture
    useEffect(() => {
        if (show) {
            setForm(prev => ({
                ...prev,
                codeBillet: generateCodeBillet()
            }));
        }
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ 
            ...form, 
            [name]: value 
        });
        
        // Efface l'erreur du champ quand l'utilisateur tape
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.reservationId) {
            newErrors.reservationId = "Veuillez sélectionner une réservation";
        }
        
        if (!form.codeBillet.trim()) {
            newErrors.codeBillet = "Le code billet est requis";
        } else if (form.codeBillet.length < 5) {
            newErrors.codeBillet = "Le code billet doit faire au moins 5 caractères";
        }
        
        if (!form.format) {
            newErrors.format = "Veuillez sélectionner un format";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Ajoute la date d'émission automatique
            const billetData = {
                ...form,
                dateEmission: new Date().toISOString()
            };
            
            handleSave(billetData);
            
            // Réinitialise le formulaire
            setForm({
                reservationId: "",
                codeBillet: generateCodeBillet(),
                format: "PDF"
            });
            setErrors({});
        }
    };

    const handleRegenerateCode = () => {
        setForm(prev => ({
            ...prev,
            codeBillet: generateCodeBillet()
        }));
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Form onSubmit={onSubmit} style={{ background: "#232526", borderRadius: 12 }}>
                <Modal.Header closeButton style={{ borderBottom: "none", background: "#232526" }}>
                    <Modal.Title style={{ color: "#00b894", fontWeight: 700 }}>
                        <i className="fas fa-ticket-alt me-2"></i>
                        Enregistrer un nouveau billet
                    </Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    {/* Réservation */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>
                            <i className="fas fa-calendar-check me-2"></i>
                            Réservation *
                        </Form.Label>
                        <Form.Control
                            as="select"
                            name="reservationId"
                            value={form.reservationId}
                            onChange={handleChange}
                            required
                            style={{ 
                                background: "#181920", 
                                color: "#fff", 
                                border: errors.reservationId ? "1px solid #dc3545" : "1px solid #636e72" 
                            }}
                        >
                            <option value="">Sélectionnez une réservation</option>
                            {reservations && reservations.map((reservation) => (
                                <option key={reservation.id} value={reservation.id}>
                                    Réservation #{reservation.id} - 
                                    {reservation.passagerNom || "Sans nom"} - 
                                    {reservation.statut || "Non défini"}
                                </option>
                            ))}
                        </Form.Control>
                        {errors.reservationId && (
                            <Form.Text style={{ color: "#dc3545" }}>
                                {errors.reservationId}
                            </Form.Text>
                        )}
                        <Form.Text style={{ color: "#b2bec3" }}>
                            Sélectionnez la réservation associée à ce billet
                        </Form.Text>
                    </Form.Group>

                    {/* Code Billet */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>
                            <i className="fas fa-barcode me-2"></i>
                            Code Billet *
                        </Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Control
                                type="text"
                                name="codeBillet"
                                value={form.codeBillet}
                                onChange={handleChange}
                                required
                                placeholder="Code unique du billet"
                                style={{ 
                                    background: "#181920", 
                                    color: "#fff", 
                                    border: errors.codeBillet ? "1px solid #dc3545" : "1px solid #636e72" 
                                }}
                            />
                            <Button
                                variant="outline-info"
                                onClick={handleRegenerateCode}
                                style={{ whiteSpace: "nowrap" }}
                            >
                                <i className="fas fa-sync-alt me-1"></i>
                                Régénérer
                            </Button>
                        </div>
                        {errors.codeBillet && (
                            <Form.Text style={{ color: "#dc3545" }}>
                                {errors.codeBillet}
                            </Form.Text>
                        )}
                        <Form.Text style={{ color: "#b2bec3" }}>
                            Code unique d'identification du billet (généré automatiquement)
                        </Form.Text>
                    </Form.Group>

                    {/* Format */}
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#fff" }}>
                            <i className="fas fa-file me-2"></i>
                            Format *
                        </Form.Label>
                        <Form.Control
                            as="select"
                            name="format"
                            value={form.format}
                            onChange={handleChange}
                            required
                            style={{ 
                                background: "#181920", 
                                color: "#fff", 
                                border: errors.format ? "1px solid #dc3545" : "1px solid #636e72" 
                            }}
                        >
                            <option value="PDF">PDF</option>
                            <option value="QR_CODE">QR Code</option>
                            <option value="NUMERIQUE">Numérique</option>
                            <option value="PAPIER">Papier</option>
                        </Form.Control>
                        {errors.format && (
                            <Form.Text style={{ color: "#dc3545" }}>
                                {errors.format}
                            </Form.Text>
                        )}
                        <Form.Text style={{ color: "#b2bec3" }}>
                            Format de délivrance du billet
                        </Form.Text>
                    </Form.Group>

                    {/* Informations automatiques */}
                    <Alert variant="info" style={{ background: "rgba(0, 184, 148, 0.1)", border: "1px solid #00b894", color: "#00b894" }}>
                        <i className="fas fa-info-circle me-2"></i>
                        <strong>Informations automatiques :</strong>
                        <div className="mt-2">
                            <small>
                                • Date d'émission : {new Date().toLocaleString('fr-FR')}<br/>
                                • Le code billet est généré automatiquement
                            </small>
                        </div>
                    </Alert>
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
                        Enregistrer le billet
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default BilletFormModal;