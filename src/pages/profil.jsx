import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
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

    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);
    
    const userId = userInfo && userInfo.id ? userInfo.id : null;
    console.log("User ID:", userId); // Affiche l'ID utilisateur dans la console

    //recupere un utilisateur api
    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            const token = localStorage.getItem("token");
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
    };

    const handleSave = (e) => {
        e.preventDefault();
        setUser(form);
        setEdit(false);
    };

    return (

        <div className="bg-dark min-vh-100">
            <Navbar />
         
            <div className="row justify-content-center">
                <div className="col-md-4 d-flex align-items-center justify-content-center mb-4 mb-md-0">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/69/69906.png"
                        alt="Avion"
                        style={{ maxWidth: "200px", width: "100%" }}
                        className="img-fluid"
                    />
                </div>
                <div className="col-md-6 col-lg-5">
                    <div className="card bg-secondary text-dark ">
                        <div className="card-body">
                            <h2 className="card-title mb-4 text-center text-warning">Profil Utilisateur</h2>
                            <form onSubmit={handleSave}>
                                <div className="mb-3">
                                    <label className="form-label text-black">Nom</label>
                                    <input
                                        type="text"
                                        className="form-control bg-black text-light"
                                        name="nom"
                                        value={form.nom}
                                        onChange={handleChange}
                                        disabled={!edit}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Adresse</label>
                                    <input
                                        type="text"
                                        className="form-control bg-black text-light"
                                        name="adresse"
                                        value={form.adresse || ""}
                                        onChange={handleChange}
                                        disabled={!edit}
                                    />
                                    <label className="form-label">Mot de passe</label>
                                    <input
                                        type="password"
                                        className="form-control bg-black text-light"
                                        name="mot_de_passe"
                                        value={form.mot_de_passe || ""}
                                        onChange={handleChange}
                                        disabled={!edit}
                                    />
                                    <label className="form-label">Rôle</label>
                                    <input
                                        type="text"
                                        className="form-control bg-black text-light"
                                        name="role"
                                        value={form.role || ""}
                                        onChange={handleChange}
                                        disabled
                                    />
                                    <label className="form-label">Date d'inscription</label>
                                    <input
                                        type="text"
                                        className="form-control bg-black text-light"
                                        name="date_inscription"
                                        value={form.date_inscription || ""}
                                        onChange={handleChange}
                                        disabled
                                    />
                                    <label className="form-label">Statut</label>
                                    <input
                                        type="text"
                                        className="form-control bg-black text-light"
                                        name="statut"
                                        value={form.statut || ""}
                                        onChange={handleChange}
                                        disabled
                                    />
                                    <label className="form-label">Prénom</label>
                                    <input
                                        type="text"
                                        className="form-control bg-black text-light"
                                        name="prenom"
                                        value={form.prenom}
                                        onChange={handleChange}
                                        disabled={!edit}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control bg-black text-light"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        disabled={!edit}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Téléphone</label>
                                    <input
                                        type="tel"
                                        className="form-control bg-black text-light"
                                        name="telephone"
                                        value={form.telephone}
                                        onChange={handleChange}
                                        disabled={!edit}
                                    />
                                </div>
                                <div className="d-flex justify-content-between">
                                    {!edit ? (
                                        <button
                                            type="button"
                                            className="btn btn-outline-warning"
                                            onClick={handleEdit}
                                        >
                                            Modifier
                                        </button>
                                    ) : (
                                        <>
                                            <button type="submit" className="btn btn-success">
                                                Enregistrer
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={handleCancel}
                                            >
                                                Annuler
                                            </button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}