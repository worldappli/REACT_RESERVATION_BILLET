import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Modal } from "react-bootstrap";
import Navbar from "./Navbar";

export default function ConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { trajet, horaire } = location.state || {};

    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userId = userInfo.id;

    const [showModal, setShowModal] = React.useState(false);

    if (!trajet || !horaire) {
        return <div className="text-center text-danger mt-5">Aucune information de trajet sélectionnée.</div>;
    }

    return (
        <div>
            <Navbar />
        <Container className="py-5" style={{ minHeight: "100vh", background: "#181920" }}>
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <div className="bg-dark rounded-4 shadow p-4 text-light">
                        <h2 className="mb-4" style={{ color: "#0ff" }}>Confirmation de réservation</h2>
                        <ul className="list-group list-group-flush mb-4">
                            <li className="list-group-item bg-dark text-light">
                                <strong>Ville de départ :</strong> {trajet.gare_depart.nom} ({trajet.gare_depart.ville})
                            </li>
                            <li className="list-group-item bg-dark text-light">
                                <strong>Ville d'arrivée :</strong> {trajet.gare_arrivee.nom} ({trajet.gare_arrivee.ville})
                            </li>
                            <li className="list-group-item bg-dark text-light">
                                <strong>Date de départ :</strong> {horaire.dateDepart ? new Date(horaire.dateDepart).toLocaleString() : "N/A"}
                            </li>
                            <li className="list-group-item bg-dark text-light">
                                <strong>Date d'arrivée :</strong> {horaire.dateArrivee ? new Date(horaire.dateArrivee).toLocaleString() : "N/A"}
                            </li>
                            <li className="list-group-item bg-black text-light ">
                                <strong>Prix :</strong> <span style={{ backgroundColor: "#ad1313ff" }}>{trajet.prix} €</span>
                            </li>
                        </ul>
                        <Button
                            variant="warning"
                            className="w-50 fw-bold"
                            onClick={() => navigate("/")}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="info"
                            className="w-50 fw-bold"
                            onClick={() => setShowModal(true)}
                        >
                            Continuer
                        </Button>

                        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                            <Modal.Header closeButton className="bg-dark text-light">
                                <Modal.Title>Pour qui souhaitez-vous réserver ?</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="bg-dark text-light d-flex flex-column gap-3">
                                <Button
                                    variant="success"
                                    className="fw-bold"
                                    onClick={() => {
                                        setShowModal(false);
                                        navigate(`/paiement/`, { state: { trajet, horaire, pour: "moi" } });
                                    }}
                                >
                                    Pour moi
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="fw-bold"
                                    onClick={() => {
                                        setShowModal(false);
                                        navigate(`/paiement/`, { state: { trajet, horaire, pour: "autre" } });
                                    }}
                                >
                                    Pour une autre personne
                                </Button>
                            </Modal.Body>
                        </Modal>
                    </div>
                </Col>
            </Row>
        </Container>
        </div>
    );
}