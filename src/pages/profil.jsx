import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Components/Navbar";
import api from "../services/api";

const mockUser = {
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    telephone: "0601020304",
};

export default function Profil() {
    const [user, setUser] = useState(mockUser);
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState(user);
    const [userInfo, setUserInfo] = useState(user);
    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);
    
    const userId = userInfo && userInfo.id ? userInfo.id : null;

    // Récupère un utilisateur via l'API
    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            const token = localStorage.getItem("token");
            setLoading(true);
            try {
                const response = await api.get(`/utilisateur/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
                setForm(response.data);
                console.log("Utilisateur récupéré :", response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = () => setEdit(true);

    const handleCancel = () => {
        setForm(user);
        setEdit(false);
        setSaveSuccess(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simuler un appel API
        setTimeout(() => {
            setUser(form);
            setEdit(false);
            setLoading(false);
            setSaveSuccess(true);
            
            // Cacher le message de succès après 3 secondes
            setTimeout(() => setSaveSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div style={{
            background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
            minHeight: "100vh"
        }}>
            <Navbar />
            
            <div className="container py-5">
                {/* En-tête */}
                <div className="row justify-content-center mb-5">
                    <div className="col-12 text-center">
                        <h1 className="text-white fw-bold mb-3">
                            <i className="fas fa-user-circle me-3 text-info"></i>
                            Mon Profil
                        </h1>
                        <p className="text-light opacity-75">
                            Gérez vos informations personnelles et vos préférences
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
                                    <strong>Succès !</strong> Vos informations ont été mises à jour.
                                </div>
                                <button type="button" className="btn-close" onClick={() => setSaveSuccess(false)}></button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row justify-content-center">
                    {/* Carte Profil */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-lg bg-dark">
                            <div className="card-header bg-transparent border-info py-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="text-info mb-0">
                                        <i className="fas fa-id-card me-2"></i>
                                        Informations Personnelles
                                    </h3>
                                    <div className={`badge fs-6 ${
                                        user.statut === "Actif" ? "bg-success" : 
                                        user.statut === "Inactif" ? "bg-danger" : "bg-secondary"
                                    }`}>
                                        {user.statut || "Actif"}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="card-body p-4">
                                {loading && !edit ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-info mb-3" role="status">
                                            <span className="visually-hidden">Chargement...</span>
                                        </div>
                                        <p className="text-light">Chargement de vos informations...</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSave}>
                                        <div className="row g-4">
                                            {/* Informations de base */}
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label text-light fw-semibold">
                                                        <i className="fas fa-user me-2 text-info"></i>
                                                        Nom
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-black text-light border-secondary"
                                                        name="nom"
                                                        value={form.nom || ""}
                                                        onChange={handleChange}
                                                        disabled={!edit}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label text-light fw-semibold">
                                                        <i className="fas fa-user me-2 text-info"></i>
                                                        Prénom
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-black text-light border-secondary"
                                                        name="prenom"
                                                        value={form.prenom || ""}
                                                        onChange={handleChange}
                                                        disabled={!edit}
                                                    />
                                                </div>
                                            </div>

                                            {/* Contact */}
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label text-light fw-semibold">
                                                        <i className="fas fa-envelope me-2 text-info"></i>
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="form-control bg-black text-light border-secondary"
                                                        name="email"
                                                        value={form.email || ""}
                                                        onChange={handleChange}
                                                        disabled={!edit}
                                                    />
                                                </div>
                                            </div>
                                            
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

                                            {/* Adresse */}
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <label className="form-label text-light fw-semibold">
                                                        <i className="fas fa-home me-2 text-info"></i>
                                                        Adresse
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-black text-light border-secondary"
                                                        name="adresse"
                                                        value={form.adresse || ""}
                                                        onChange={handleChange}
                                                        disabled={!edit}
                                                        placeholder="Votre adresse complète"
                                                    />
                                                </div>
                                            </div>

                                            {/* Informations système (lecture seule) */}
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label text-light fw-semibold">
                                                        <i className="fas fa-shield-alt me-2 text-info"></i>
                                                        Rôle
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-dark text-muted border-dark"
                                                        name="role"
                                                        value={form.role || "Utilisateur"}
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label text-light fw-semibold">
                                                        <i className="fas fa-calendar-plus me-2 text-info"></i>
                                                        Date d'inscription
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control bg-dark text-muted border-dark"
                                                        name="date_inscription"
                                                        value={form.date_inscription ? new Date(form.date_inscription).toLocaleDateString('fr-FR') : "Non disponible"}
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
                                                        name="mot_de_passe"
                                                        value={form.mot_de_passe || ""}
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
                                                    
                                                    {/* Statistiques rapides */}
                                                    {!edit && (
                                                        <div className="text-end">
                                                            <small className="text-muted">
                                                                Membre depuis {form.date_inscription ? new Date(form.date_inscription).toLocaleDateString('fr-FR') : "récemment"}
                                                            </small>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Carte Avatar et Stats */}
                    <div className="col-lg-4 mt-4 mt-lg-0">
                        <div className="card border-0 shadow-lg bg-dark mb-4">
                            <div className="card-body text-center p-4">
                                <div className="mb-4">
                                    <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center"
                                         style={{ width: '120px', height: '120px' }}>
                                        <i className="fas fa-user fa-3x text-black"></i>
                                    </div>
                                </div>
                                <h4 className="text-white mb-2">{form.prenom} {form.nom}</h4>
                                <p className="text-muted mb-3">{form.email}</p>
                                <div className="badge bg-info fs-6 px-3 py-2">
                                    <i className="fas fa-star me-2"></i>
                                    {form.role || "Utilisateur"}
                                </div>
                            </div>
                        </div>

                        {/* Carte Informations rapides */}
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
                                        <div className="border rounded p-3 bg-black">
                                            <i className="fas fa-ticket-alt fa-2x text-warning mb-2"></i>
                                            <h5 className="text-white mb-1">12</h5>
                                            <small className="text-muted">Réservations</small>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="border rounded p-3 bg-black">
                                            <i className="fas fa-train fa-2x text-info mb-2"></i>
                                            <h5 className="text-white mb-1">8</h5>
                                            <small className="text-muted">Voyages</small>
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
                `}
            </style>
        </div>
    );
}