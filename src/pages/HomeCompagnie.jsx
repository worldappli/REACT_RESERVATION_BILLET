import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import BilletFormModal from "./BilletFormModal";
import api from "../services/api";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import HoraireFormModal from "./HoraireFormModal";
import { useNavigate } from "react-router-dom";

export default function HomeCompagnie() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showHoraireModal, setShowHoraireModal] = useState(false);
    const [transports, setTransports] = useState([]);
    const [gare, setGare] = useState([]);
    const [trajets, setTrajets] = useState([]);
    const [horaires, setHoraires] = useState([]); // <-- AJOUT ICI
    const monnaie = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });

    // Vérification de l'authentification au chargement
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserInfo = localStorage.getItem("userInfo");
        if (!token || !storedUserInfo) {
            navigate("/compagnie-login");
        } else {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, [navigate]);

    // Récupération des transports
    useEffect(() => {
        api.get("/transport", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                setTransports(response.data);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des informations sur le transport", error);
            });
    }, []);

    // Filtrage des transports selon userInfo.id
    const filteredTransports = userInfo
        ? transports.filter((t) => t.compagnie && t.compagnie.id === userInfo.id)
        : [];

    // Récupération des gares
    useEffect(() => {
        api.get("/gare", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                setGare(response.data);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des informations sur les gares", error);
            });
    }, []);

    // Filtrage des gares selon userInfo.id
    const filteredGares = userInfo
        ? gare.filter((g) => g.compagnie && g.compagnie.id === userInfo.id)
        : [];

    // Récupération des trajets
    useEffect(() => {
        api.get("/trajet", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                setTrajets(response.data);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des informations sur les trajets", error);
            });
    }, []);

    //Filtrage des trajets selon userInfo.id
    const filteredTrajets = userInfo
        ? trajets.filter((trajet) =>
            filteredTransports.some((t) => t.id === trajet.transport.id)
        )
        : []
    console.log("Trajets filtrés :", filteredTrajets);

    // récupération des Horaires
    useEffect(() => {
        api.get("/horaire", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                setHoraires(response.data);
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des informations sur les horaires", error);
            });
    }, []);

    // Filtrage des horaires selon trajet.id
    const filteredHoraires = userInfo
        ? horaires.filter((h) => filteredTrajets.some((t) => t.id === h.trajetId))
        : [];
    console.log("Horaires filtrés :", filteredHoraires);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleOpenHoraireModal = () => setShowHoraireModal(true);
    const handleCloseHoraireModal = () => setShowHoraireModal(false);



    // Fonction pour enregistrer un Trajet
    const handleSaveTrajet = (data) => {
        const token = localStorage.getItem("token");
        api.post("/trajet", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log("Billet publié avec succès", response);
                // Optionnel: mettre à jour l'état local ici
                setTrajets((prevTrajets) => [...prevTrajets, response.data]);
                alert("Trajet Enregistré avec succès !");
            })
            .catch((error) => {
                console.error("Erreur lors de la publication du trajet", error);
            });
        setShowModal(false);
    };

    //Fonction pour enregistrer un Horaire
    const handleSaveHoraire = (data) => {
        api.post("/horaire", data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((response) => {
                console.log("Horaire enregistré avec succès", response);
                // setShowHoraireModal(false);
                // Optionnel: mettre à jour l'état local ici
                setHoraires((prevHoraires) => [...prevHoraires, response.data]);
                alert("Billet publié avec succès !");
            })
            .catch((error) => {
                console.error("Erreur lors de l'enregistrement de l'horaire", error);
            });
        setShowHoraireModal(false);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(120deg, #181920 0%, #232526 100%)",
                color: "#f1f2f6",
                fontFamily: "Segoe UI, Arial, sans-serif",
                paddingTop: 0,
            }}
        >
            {/* Navbar Bootstrap */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ background: "#181920" }}>
                <div className="container">
                    <a className="navbar-brand" href="#">
                        <span style={{ color: "#00b894", fontWeight: 700 }}>Compagnie Admin</span>
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link active" href="#">Tableau de bord</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Billets</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Profil</a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        localStorage.removeItem("userInfo");
                                        setUserInfo(null);
                                        navigate("/compagnie-login");
                                    }}
                                >
                                    Déconnexion
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Modal formulaire billet */}
            <BilletFormModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSaveTrajet}
                listTransport={filteredTransports}
                listGare={filteredGares}
            />

            {/* Modal formulaire horaire */}
            <HoraireFormModal
                show={showHoraireModal}
                handleClose={handleCloseHoraireModal}
                handleSave={handleSaveHoraire}
                trajets={filteredTrajets}
            />

            <Container fluid className="py-5">
                <Row className="justify-content-center">
                    <Col xs={12} md={12} lg={10} xl={8}>
                        <div className="bg-dark rounded-4 shadow p-3 p-md-5">
                            <h1 className="mb-2" style={{ fontWeight: 700, fontSize: 34, color: "#00b894", letterSpacing: 1 }}>
                                Tableau de bord Compagnie
                            </h1>
                            <p className="mb-4" style={{ color: "#a4b0be", fontSize: 17 }}>
                                Gérez vos billets et trajets, publiez de nouveaux billets, et modifiez vos informations de compagnie.
                            </p>
                            <div className="container d-flex flex-column flex-md-row ">
                                <div className="col-md-6 mb-4">
                                    <button
                                        className="btn"
                                        style={{
                                            background: "linear-gradient(90deg, #00b894 60%, #0984e3 100%)",
                                            color: "#fff",
                                            fontWeight: 700,
                                            fontSize: 17,
                                            borderRadius: 10,
                                            padding: "14px 32px",
                                            letterSpacing: 0.5,
                                            boxShadow: "0 2px 12px rgba(9,132,227,0.10)",
                                            border: "none",
                                        }}
                                        onClick={handleOpenHoraireModal}
                                    >
                                        + Publier un billet
                                    </button>
                                </div>
                                <div className="col-md-6 mb-4">
                                    <button
                                        className="btn"
                                        style={{
                                            background: "linear-gradient(90deg, #b80009ff 60%, #0ce4ecff 100%)",
                                            color: "#fff",
                                            fontWeight: 700,
                                            fontSize: 17,
                                            borderRadius: 10,
                                            padding: "14px 32px",
                                            letterSpacing: 0.5,
                                            boxShadow: "0 2px 12px rgba(9,132,227,0.10)",
                                            border: "none",
                                        }}
                                        onClick={handleOpenModal}
                                    >
                                        + Enregistrer un Trajet
                                    </button>
                                </div>
                            </div>
                            <h2 style={{ color: "#00cec9", fontSize: 22, marginBottom: 18, fontWeight: 600 }}>
                                Vos billets publiés
                            </h2>
                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle" style={{ borderRadius: 10, overflow: "hidden" }}>
                                    <thead>
                                        <tr>
                                            <th>Trajet</th>
                                            <th>Date</th>
                                            <th>Prix</th>
                                            {/* <th>Statut</th> */}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredHoraires.map((billet) => (
                                            <tr key={billet.id}>
                                                <td>
                                                    {
                                                        (() => {
                                                            const trajet = filteredTrajets.find(t => t.id === billet.trajetId);
                                                            // if (!trajet) return billet.trajetId;
                                                            // const gareDepart = filteredGares.find(g => g.id === trajet.gareDepartId);
                                                            // const gareArrivee = filteredGares.find(g => g.id === trajet.gareArriveeId);
                                                            return (
                                                                <>
                                                                    {trajet.gare_depart.nom} → {trajet.gare_arrivee.nom}
                                                                </>
                                                            );
                                                        })()
                                                    }
                                                </td>
                                                {/* <td>{billet.trajetId}</td> */}
                                                <td>{billet.dateDepart}</td>
                                                <td>
                                                    {
                                                        (() => {
                                                            const trajet = filteredTrajets.find(t => t.id === billet.trajetId);
                                                            // if (!trajet) return billet.trajetId;
                                                            // const gareDepart = filteredGares.find(g => g.id === trajet.gareDepartId);
                                                            // const gareArrivee = filteredGares.find(g => g.id === trajet.gareArriveeId);
                                                            return (
                                                                <>
                                                                    {monnaie.format(trajet.prix)}
                                                                </>
                                                            );
                                                        })()
                                                    }
                                                </td>
                                                {/* <td>
                                                    <span
                                                        className={`badge px-3 py-2 rounded-pill fw-semibold`}
                                                        style={{
                                                            background:
                                                                billet.statut === "Publié"
                                                                    ? "#00b894"
                                                                    : "#636e72",
                                                            color: "#fff",
                                                            fontSize: 15,
                                                            letterSpacing: 0.5,
                                                        }}
                                                    >
                                                        {billet.statut}
                                                    </span>
                                                </td> */}
                                                <td className="">
                                                    <button className="btn btn-secondary btn-sm mx-2 mb-2">Modifier</button>
                                                        <button className="btn btn-sm mb-2" style={{ background: "#d63031", color: "#fff" }}>
                                                            Supprimer
                                                         </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-5">
                                <h2 style={{ color: "#00cec9", fontSize: 22, marginBottom: 18, fontWeight: 600 }}>
                                    Informations de la compagnie
                                </h2>
                                <div
                                    className="mb-3"
                                    style={{
                                        background: "#232526",
                                        borderRadius: 10,
                                        padding: "24px 32px",
                                        color: "#f1f2f6",
                                        fontSize: 17,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                    }}
                                >
                                    <div className="mb-2">
                                        <strong>Nom :</strong> {userInfo ? userInfo.nom : "Air France"}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Email :</strong> {userInfo ? userInfo.email : "contact@airfrance.com"}
                                    </div>
                                    <div>
                                        <strong>Statut :</strong>{" "}
                                        {userInfo && userInfo.statut === "actif" ? (
                                            <span
                                                className="badge px-3 py-2 rounded-pill fw-semibold"
                                                style={{
                                                    background: "#00b894",
                                                    color: "#fff",
                                                    fontSize: 15,
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                Actif
                                            </span>
                                        ) : (
                                            <span
                                                className="badge px-3 py-2 rounded-pill fw-semibold"
                                                style={{
                                                    background: "#d63031",
                                                    color: "#fff",
                                                    fontSize: 15,
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                Inactif
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button className="btn" style={{ background: "#0984e3", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                                    Modifier mes informations
                                </button>
                            </div>
                            <div className="mt-5">
                                <h2 style={{ color: "#00cec9", fontSize: 22, marginBottom: 18, fontWeight: 600 }}>
                                    Vos transports
                                </h2>
                                <ul>
                                    {filteredTransports.map((t) => (
                                        <li key={t.id}>
                                            {t.type} → {t.numero} → {t.capacite} Places
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
