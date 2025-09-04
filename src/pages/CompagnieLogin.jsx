import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import api from "../services/api"; // ton fichier axios (baseURL)
import jwtDecode from "jwt-decode";
import React from "react";

function CompagnieLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // ✅ ajouter l'état utilisateur
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log({ email, password });
      
      // 🔹 appel au backend
      const res = await api.post("/auth/c/login", { email, password });
      const token = res.data.token;
      
      // 🔹 stockage du token
      localStorage.setItem("token", token);

      // 🔹 décodage du token (si tu veux récupérer l’email ou le rôle)
      const decoded = jwtDecode(token);
      console.log("Token décodé:", decoded);
      localStorage.setItem("user", JSON.stringify(decoded));

      // 🔹 récupération des infos utilisateur via /me
      
      const meRes = await api.get("/auth/c/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

  // Ajout de la colonne type: compagnie
  const userInfoWithType = { ...meRes.data, type: "compagnie" };
  setUser(userInfoWithType);
  localStorage.setItem("userInfo", JSON.stringify(userInfoWithType)); // Stockage des infos utilisateur avec type
  console.log("Utilisateur connecté:", userInfoWithType);

      // 🔹 redirection
      navigate("/compagnie");
    } catch (err) {
      console.error(err);
      alert("Email ou mot de passe incorrect !");
    }
  };

  return (
    <Container
      fluid
      className="d-flex vh-100 justify-content-center align-items-center "
    >
      <Row className="w-100">
        <Col md={4} className="mx-auto">
          <Card className="shadow p-4 rounded-4 bg-dark text-light">
            <Card.Body>
              <h3 className="text-center mb-4">Connexion en tant que Compagnie</h3>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 rounded-pill"
                >
                  Se connecter
                </Button>
              </Form>
              <p className="text-center mt-3">
                Pas encore de compte ?{" "}
                <a href="/register" className="text-decoration-none">
                  Inscrivez-vous
                </a>
              </p>
            </Card.Body>
          </Card>

          {/* ✅ affichage si utilisateur connecté */}
          {user && (
            <div className="mt-3 text-center">
              <h5>Bienvenue {user.nom}</h5>
              <p>Rôle: {user.role}</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default CompagnieLogin;
