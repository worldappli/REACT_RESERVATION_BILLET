import React, { useState } from 'react';

const RegisterPage = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password || !form.confirmPassword) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        // Simuler une inscription réussie
        setSuccess('Inscription réussie !');
        setForm({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
            <h2>Créer un compte</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label>Nom</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                        required
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                        required
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                        required
                    />
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>Confirmer le mot de passe</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        style={{ width: '100%', padding: 8, marginTop: 4 }}
                        required
                    />
                </div>
                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
                <button type="submit" style={{ width: '100%', padding: 10, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>
                    S'inscrire
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;