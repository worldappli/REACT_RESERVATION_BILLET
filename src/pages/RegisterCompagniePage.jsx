import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../services/api';

const RegisterCompagniePage = () => {
    const [form, setForm] = useState({
        nom: '',
        email: '',
        motDePasse: '',
        confirmPassword: '',
        telephone: '',
        adresse: '',
        statut: 'desactivé'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nom || !form.email || !form.motDePasse || !form.confirmPassword || !form.telephone || !form.adresse) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        if (form.motDePasse !== form.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        try {
            const toSend = { ...form };
            delete toSend.confirmPassword;
            const res = await api.post("/compagnie", toSend);
            setSuccess('Inscription réussie ! Un email de vérification a été envoyé.');
            setError('');
            setForm({
                nom: '',
                email: '',
                motDePasse: '',
                confirmPassword: '',
                telephone: '',
                adresse: '',
                statut: 'desactivé'
            });
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription");
            setSuccess('');
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
            <div className="card shadow-lg p-4" style={{ maxWidth: 440, width: '100%', background: '#232837', borderRadius: 14 }}>
                <h2 className="text-center mb-4 text-light">Créer un compte Compagnie</h2>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-3">
                        <label className="form-label text-secondary">Nom</label>
                        <input type="text" name="nom" value={form.nom} onChange={handleChange} className="form-control bg-dark text-light border-secondary" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-secondary">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control bg-dark text-light border-secondary" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-secondary">Téléphone</label>
                        <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} className="form-control bg-dark text-light border-secondary" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-secondary">Adresse</label>
                        <input type="text" name="adresse" value={form.adresse} onChange={handleChange} className="form-control bg-dark text-light border-secondary" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-secondary">Mot de passe</label>
                        <input type="password" name="motDePasse" value={form.motDePasse} onChange={handleChange} className="form-control bg-dark text-light border-secondary" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-secondary">Confirmer le mot de passe</label>
                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="form-control bg-dark text-light border-secondary" required />
                    </div>
                    {error && <div className="alert alert-danger text-center py-2 mb-3">{error}</div>}
                    {success && <div className="alert alert-success text-center py-2 mb-3">{success}</div>}
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mt-2">S'inscrire</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterCompagniePage;
