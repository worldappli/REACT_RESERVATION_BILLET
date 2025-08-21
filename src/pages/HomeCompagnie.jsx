import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const billets = [
    {
        id: 1,
        trajet: "Paris → Lyon",
        date: "2024-07-01",
        prix: "120 €",
        statut: "Publié",
    },
    {
        id: 2,
        trajet: "Lyon → Marseille",
        date: "2024-07-05",
        prix: "90 €",
        statut: "Brouillon",
    },
];

export default function HomeCompagnie() {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

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
                                <a className="nav-link" href="#">Déconnexion</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container py-5">
                <div
                    className="mx-auto"
                    style={{
                        maxWidth: 950,
                        background: "rgba(28, 30, 38, 0.98)",
                        borderRadius: 18,
                        boxShadow: "0 10px 40px 0 rgba(0,0,0,0.45)",
                        padding: "40px 48px",
                        border: "1px solid #232526",
                    }}
                >
                    <h1 className="mb-2" style={{ fontWeight: 700, fontSize: 34, color: "#00b894", letterSpacing: 1 }}>
                        Tableau de bord Compagnie
                    </h1>
                    <p className="mb-4" style={{ color: "#a4b0be", fontSize: 17 }}>
                        Gérez vos billets et trajets, publiez de nouveaux billets, et modifiez vos informations de compagnie.
                    </p>
                    <div className="mb-4">
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
                        >
                            + Publier un billet
                        </button>
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
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billets.map((billet) => (
                                    <tr key={billet.id}>
                                        <td>{billet.trajet}</td>
                                        <td>{billet.date}</td>
                                        <td>{billet.prix}</td>
                                        <td>
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
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-secondary me-2">Modifier</button>
                                            <button className="btn btn-sm" style={{ background: "#d63031", color: "#fff" }}>
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
                </div>
            </div>
        </div>
    );
}
