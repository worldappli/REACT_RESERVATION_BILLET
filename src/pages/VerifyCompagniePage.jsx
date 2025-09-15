import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const VerifyCompagniePage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Vérification en cours...');
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage('Aucun token fourni.');
      return;
    }
    api.get(`/c/verification?token=${token}`)
      .then(res => {
        setMessage(res.data || 'Votre compte compagnie a été activé !');
        setTimeout(() => {
          navigate('/compagnie-login');
        }, 2000);
      })
      .catch(err => {
        setMessage(err.response?.data || 'Erreur de vérification.');
      });
  }, [token, navigate]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="card shadow-lg p-4" style={{ maxWidth: 440, width: '100%', background: '#232837', borderRadius: 14 }}>
        <h2 className="text-center mb-4 text-light">Vérification du compte Compagnie</h2>
        <div className="text-center text-light">{message}</div>
      </div>
    </div>
  );
};

export default VerifyCompagniePage;
