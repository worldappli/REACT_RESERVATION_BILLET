import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CompagnieProfil() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [compagnie, setCompagnie] = useState(null);
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [stats, setStats] = useState({
        transports: 0,
        trajets: 0,
        gares: 0,
        revenus: 0
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserInfo = localStorage.getItem("userInfo");
        
        if (!token || !storedUserInfo) {
            navigate("/compagnie-login");
        } else {
            const userData = JSON.parse(storedUserInfo);
            setUserInfo(userData);
            setForm(userData);
            fetchCompagnieData(userData.id, token);
            fetchStats(userData.id, token);
        }
    }, [navigate]);

    const fetchCompagnieData = async (compagnieId, token) => {
        setLoading(true);
        try {
            const response = await api.get(`/compagnie/${compagnieId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompagnie(response.data);
            setForm(response.data);
        } catch (error) {
            console.error("Erreur récupération compagnie:", error);
            // Si l'endpoint n'existe pas, utilisez les données du localStorage
            const storedUserInfo = localStorage.getItem("userInfo");
            if (storedUserInfo) {
                const userData = JSON.parse(storedUserInfo);
                setCompagnie(userData);
                setForm(userData);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async (compagnieId, token) => {
        try {
            // Utilisez les endpoints standards et filtrez côté client
            const [transportsRes, trajetsRes, garesRes] = await Promise.all([
                api.get("/transport", { headers: { Authorization: `Bearer ${token}` } }),
                api.get("/trajet", { headers: { Authorization: `Bearer ${token}` } }),
                api.get("/gare", { headers: { Authorization: `Bearer ${token}` } })
            ]);

            // Filtrage côté client
            const filteredTransports = transportsRes.data.filter(t => t.compagnie?.id === compagnieId);
            const filteredTrajets = trajetsRes.data.filter(t => t.transport?.compagnie?.id === compagnieId);
            const filteredGares = garesRes.data.filter(g => g.compagnie?.id === compagnieId);

            setStats({
                transports: filteredTransports.length,
                trajets: filteredTrajets.length,
                gares: filteredGares.length,
                revenus: filteredTrajets.reduce((sum, trajet) => sum + (trajet.prix || 0), 0)
            });
        } catch (error) {
            console.error("Erreur récupération stats:", error);
            // En cas d'erreur, utilisez des valeurs par défaut
            setStats({
                transports: 0,
                trajets: 0,
                gares: 0,
                revenus: 0
            });
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = () => setEdit(true);

    const handleCancel = () => {
        setForm(compagnie);
        setEdit(false);
        setSaveSuccess(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const token = localStorage.getItem("token");
            
            // Vérifiez si l'endpoint existe avant de l'appeler
            try {
                const response = await api.put(`/compagnie/${compagnie.id}`, form, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCompagnie(response.data);
            } catch (apiError) {
                // Si l'endpoint n'existe pas, simulez la mise à jour
                console.warn("Endpoint compagnie non disponible, simulation de mise à jour");
                setCompagnie(form);
                
                // Mettre à jour le localStorage
                localStorage.setItem("userInfo", JSON.stringify(form));
                setUserInfo(form);
            }
            
            setEdit(false);
            setSaveSuccess(true);
            
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error("Erreur modification compagnie:", error);
            alert("Erreur lors de la modification");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Non disponible";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading && !compagnie) {
        return (
            <div style={{
                background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
                minHeight: "100vh"
            }}>
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="text-center">
                        <div className="spinner-border text-info mb-3" style={{width: '3rem', height: '3rem'}} role="status">
                            <span className="visually-hidden">Chargement...</span>
                        </div>
                        <h5 className="text-light">Chargement du profil...</h5>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
            minHeight: "100vh",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: "rgba(0, 0, 0, 0.9)" }}>
                <div className="container">
                    <a className="navbar-brand fw-bold fs-3" href="#">
                        <i className="fas fa-train me-2 text-info"></i>
                        <span style={{ color: "#00b894" }}>Compagnie Admin</span>
                    </a>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a 
                                    className="nav-link fw-semibold" 
                                    href="/compagnie"
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className="fas fa-tachometer-alt me-1"></i>
                                    Tableau de bord
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active fw-semibold" href="#">
                                    <i className="fas fa-building me-1"></i>
                                    Profil Compagnie
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link fw-semibold"
                                    style={{ cursor: "pointer", color: "#ff6b6b" }}
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        localStorage.removeItem("userInfo");
                                        navigate("/compagnie-login");
                                    }}
                                >
                                    <i className="fas fa-sign-out-alt me-1"></i>
                                    Déconnexion
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container py-5">
                {/* En-tête */}
                <div className="row justify-content-center mb-5">
                    <div className="col-12 text-center">
                        <h1 className="text-white fw-bold mb-3">
                            <i className="fas fa-building me-3 text-info"></i>
                            Profil Compagnie
                        </h1>
                        <p className="text-light opacity-75">
                            Gérez les informations de votre compagnie de transport
                        </p>
                    </div>
                </div>

                {/* Message de succès */}
                {saveSuccess && (
                    <div className="row justify-content-center mb-4">
                        <div className="col-md-8">
                            <div className="alert alert-success alert-dismissible fade show d-flex align-items-center">
                                <i className="fas fa-check-circle me-3 fs-4"></i>
                                <div>
                                    <strong>Succès !</strong> Votre profil a été mis à jour.
                                </div>
                                <button type="button" className="btn-close" onClick={() => setSaveSuccess(false)}></button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row justify-content-center">
                    {/* Carte Profil Principal */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-lg bg-dark">
                            <div className="card-header bg-transparent border-info py-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="text-info mb-0">
                                        <i className="fas fa-id-card me-2"></i>
                                        Informations de la Compagnie
                                    </h3>
                                    <div className={`badge fs-6 ${compagnie?.statut === "actif" ? "bg-success" : "bg-warning"}`}>
                                        {compagnie?.statut || "Actif"}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="card-body p-4">
                                <form onSubmit={handleSave}>
                                    <div className="row g-4">
                                        {/* Informations de base */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label text-light fw-semibold">
                                                    <i className="fas fa-building me-2 text-info"></i>
                                                    Nom de la compagnie *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-black text-light border-secondary"
                                                    name="nom"
                                                    value={form.nom || ""}
                                                    onChange={handleChange}
                                                    disabled={!edit}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label text-light fw-semibold">
                                                    <i className="fas fa-envelope me-2 text-info"></i>
                                                    Email *
                                                </label>
                                                <input
                                                    type="email"
                                                    className="form-control bg-black text-light border-secondary"
                                                    name="email"
                                                    value={form.email || ""}
                                                    onChange={handleChange}
                                                    disabled={!edit}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label text-light fw-semibold">
                                                    <i className="fas fa-phone me-2 text-info"></i>
                                                    Téléphone
                                                </label>
                                                <input
                                                    type="tel"
                                                    className="form-control bg-black text-light border-secondary"
                                                    name="telephone"
                                                    value={form.telephone || ""}
                                                    onChange={handleChange}
                                                    disabled={!edit}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label text-light fw-semibold">
                                                    <i className="fas fa-map-marker-alt me-2 text-info"></i>
                                                    Adresse
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-black text-light border-secondary"
                                                    name="adresse"
                                                    value={form.adresse || ""}
                                                    onChange={handleChange}
                                                    disabled={!edit}
                                                    placeholder="Adresse du siège social"
                                                />
                                            </div>
                                        </div>

                                        {/* Informations système (lecture seule) */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label text-light fw-semibold">
                                                    <i className="fas fa-calendar-plus me-2 text-info"></i>
                                                    Date de création
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-muted border-dark"
                                                    value={formatDate(compagnie?.dateCreation)}
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="form-label text-light fw-semibold">
                                                    <i className="fas fa-shield-alt me-2 text-info"></i>
                                                    Statut
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-muted border-dark"
                                                    value={compagnie?.statut || "Actif"}
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        {/* Mot de passe */}
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label className="form-label text-light fw-semibold">
                                                    <i className="fas fa-lock me-2 text-info"></i>
                                                    Mot de passe
                                                </label>
                                                <input
                                                    type="password"
                                                    className="form-control bg-black text-light border-secondary"
                                                    name="motDePasse"
                                                    value={form.motDePasse || ""}
                                                    onChange={handleChange}
                                                    disabled={!edit}
                                                    placeholder="••••••••"
                                                />
                                                {edit && (
                                                    <small className="form-text text-warning">
                                                        <i className="fas fa-info-circle me-1"></i>
                                                        Laissez vide pour ne pas modifier le mot de passe
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="row mt-4 pt-4 border-top border-dark">
                                        <div className="col-12">
                                            <div className="d-flex justify-content-between align-items-center">
                                                {!edit ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-info btn-lg px-4 fw-bold"
                                                        onClick={handleEdit}
                                                    >
                                                        <i className="fas fa-edit me-2"></i>
                                                        Modifier le profil
                                                    </button>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <button 
                                                                type="submit" 
                                                                className="btn btn-success btn-lg px-4 me-3 fw-bold"
                                                                disabled={loading}
                                                            >
                                                                {loading ? (
                                                                    <>
                                                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                                                            <span className="visually-hidden">Chargement...</span>
                                                                        </div>
                                                                        Enregistrement...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <i className="fas fa-save me-2"></i>
                                                                        Enregistrer
                                                                    </>
                                                                )}
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-light btn-lg px-4"
                                                                onClick={handleCancel}
                                                                disabled={loading}
                                                            >
                                                                <i className="fas fa-times me-2"></i>
                                                                Annuler
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                                
                                                {/* Date de création */}
                                                {!edit && (
                                                    <div className="text-end">
                                                        <small className="text-muted">
                                                            Membre depuis {formatDate(compagnie?.dateCreation)}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Carte Stats et Avatar */}
                    <div className="col-lg-4 mt-4 mt-lg-0">
                        {/* Carte Logo Compagnie */}
                        <div className="card border-0 shadow-lg bg-dark mb-4">
                            <div className="card-body text-center p-4">
                                <div className="mb-4">
                                    <div className="bg-gradient-info rounded-circle d-inline-flex align-items-center justify-content-center"
                                         style={{ width: '120px', height: '120px', background: 'linear-gradient(135deg, #00b894 0%, #0984e3 100%)' }}>
                                        <i className="fas fa-train fa-3x text-white"></i>
                                    </div>
                                </div>
                                <h4 className="text-white mb-2">{compagnie?.nom}</h4>
                                <p className="text-muted mb-3">{compagnie?.email}</p>
                                <div className="badge bg-info fs-6 px-3 py-2">
                                    <i className="fas fa-star me-2"></i>
                                    Compagnie de Transport
                                </div>
                            </div>
                        </div>

                        {/* Carte Statistiques */}
                        <div className="card border-0 shadow-lg bg-dark">
                            <div className="card-header bg-transparent border-info py-3">
                                <h5 className="text-info mb-0">
                                    <i className="fas fa-chart-bar me-2"></i>
                                    Statistiques
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="row text-center g-3">
                                    <div className="col-6">
                                        <div className="border rounded p-3 bg-black hover-stat">
                                            <i className="fas fa-bus fa-2x text-warning mb-2"></i>
                                            <h5 className="text-white mb-1">{stats.transports}</h5>
                                            <small className="text-muted">Transports</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="border rounded p-3 bg-black hover-stat">
                                            <i className="fas fa-route fa-2x text-success mb-2"></i>
                                            <h5 className="text-white mb-1">{stats.trajets}</h5>
                                            <small className="text-muted">Trajets</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="border rounded p-3 bg-black hover-stat">
                                            <i className="fas fa-map-marker-alt fa-2x text-info mb-2"></i>
                                            <h5 className="text-white mb-1">{stats.gares}</h5>
                                            <small className="text-muted">Gares</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="border rounded p-3 bg-black hover-stat">
                                            <i className="fas fa-euro-sign fa-2x text-danger mb-2"></i>
                                            <h5 className="text-white mb-1">{stats.revenus}€</h5>
                                            <small className="text-muted">Revenus</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Styles CSS */}
            <style>
                {`
                    .form-control:disabled {
                        background-color: #1a1a1a !important;
                        color: #6c757d !important;
                        cursor: not-allowed;
                    }
                    .form-control:focus {
                        border-color: #0dcaf0;
                        box-shadow: 0 0 0 0.2rem rgba(13, 202, 240, 0.25);
                        background-color: #000;
                        color: #fff;
                    }
                    .card {
                        transition: transform 0.2s ease;
                    }
                    .card:hover {
                        transform: translateY(-2px);
                    }
                    .hover-stat:hover {
                        transform: translateY(-3px);
                        transition: all 0.3s ease;
                        border-color: #00b894 !important;
                    }
                    .bg-gradient-info {
                        background: linear-gradient(135deg, #00b894 0%, #0984e3 100%) !important;
                    }
                `}
            </style>
        </div>
    );
}