import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../Components/Navbar";
import api from "../services/api";

export default function Profil() {
    const [user, setUser] = useState({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        role: "Utilisateur",
        date_inscription: "",
        statut: "Actif"
    });
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState({ ...user });
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Initialisation depuis le localStorage
    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            try {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                setUserInfo(parsedUserInfo);
                
                // Initialiser le form avec les données du localStorage
                const initialForm = {
                    nom: parsedUserInfo.nom || "",
                    prenom: parsedUserInfo.prenom || "",
                    email: parsedUserInfo.email || "",
                    telephone: parsedUserInfo.telephone || "",
                    adresse: parsedUserInfo.adresse || "",
                    role: parsedUserInfo.role || "Utilisateur",
                    date_inscription: parsedUserInfo.date_inscription || "",
                    statut: parsedUserInfo.statut || "Actif",
                    mot_de_passe: ""
                };
                
                setUser(initialForm);
                setForm(initialForm);
            } catch (error) {
                console.error("Erreur parsing userInfo:", error);
            }
        }
    }, []);
    
    const userId = userInfo?.id;

    // Récupère un utilisateur via l'API
    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            
            const token = localStorage.getItem("token");
            if (!token) return;
            
            setLoading(true);
            try {
                const response = await api.get(`/utilisateur/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                const userData = {
                    nom: response.data.nom || "",
                    prenom: response.data.prenom || "",
                    email: response.data.email || "",
                    telephone: response.data.telephone || "",
                    adresse: response.data.adresse || "",
                    role: response.data.role || "Utilisateur",
                    date_inscription: response.data.date_inscription || "",
                    statut: response.data.statut || "Actif",
                    mot_de_passe: ""
                };
                
                setUser(userData);
                setForm(userData);
                console.log("Utilisateur récupéré :", response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur :", error);
                // En cas d'erreur, on garde les données du localStorage
            } finally {
                setLoading(false);
            }
        };
        
        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setEdit(true);
        // S'assurer que le formulaire a les dernières données
        setForm({ ...user, mot_de_passe: "" });
    };

    const handleCancel = () => {
        setForm({ ...user, mot_de_passe: "" });
        setEdit(false);
        setSaveSuccess(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const token = localStorage.getItem("token");
            const updateData = { ...form };
            
            // Ne pas envoyer le mot de passe s'il est vide
            if (!updateData.mot_de_passe) {
                delete updateData.mot_de_passe;
            }
            
            // Appel API réel
            if (userId && token) {
                try {
                    const response = await api.put(`/utilisateur/${userId}`, updateData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    
                    // Mettre à jour les données locales
                    const updatedUser = {
                        ...user,
                        nom: response.data.nom || user.nom,
                        prenom: response.data.prenom || user.prenom,
                        email: response.data.email || user.email,
                        telephone: response.data.telephone || user.telephone,
                        adresse: response.data.adresse || user.adresse
                    };
                    
                    setUser(updatedUser);
                    setForm({ ...updatedUser, mot_de_passe: "" });
                    
                    // Mettre à jour le localStorage
                    const updatedUserInfo = {
                        ...userInfo,
                        ...updatedUser
                    };
                    localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
                    setUserInfo(updatedUserInfo);
                    
                } catch (apiError) {
                    console.error("Erreur API lors de la mise à jour:", apiError);
                    // Fallback: mise à jour locale seulement
                    setUser(form);
                }
            } else {
                // Fallback: mise à jour locale seulement
                setUser(form);
            }
            
            setEdit(false);
            setSaveSuccess(true);
            
            // Cacher le message de succès après 3 secondes
            setTimeout(() => setSaveSuccess(false), 3000);
            
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            alert("Erreur lors de la mise à jour du profil");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Non disponible";
        try {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return "Date invalide";
        }
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
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setSaveSuccess(false)}
                                    aria-label="Fermer"
                                ></button>
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
                                                        value={user.role || "Utilisateur"}
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
                                                        value={formatDate(user.date_inscription)}
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
                                                    )}
                                                    
                                                    {/* Statistiques rapides */}
                                                    {!edit && (
                                                        <div className="text-end">
                                                            <small className="text-muted">
                                                                Membre depuis {formatDate(user.date_inscription)}
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
                                        <i className="fas fa-user fa-3x text-white"></i>
                                    </div>
                                </div>
                                <h4 className="text-white mb-2">{user.prenom} {user.nom}</h4>
                                <p className="text-muted mb-3">{user.email}</p>
                                <div className="badge bg-info fs-6 px-3 py-2">
                                    <i className="fas fa-star me-2"></i>
                                    {user.role || "Utilisateur"}
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