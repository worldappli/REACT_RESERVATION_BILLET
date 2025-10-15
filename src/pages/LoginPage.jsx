import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import api from "../services/api"; // ton fichier axios (baseURL)
import jwtDecode from "jwt-decode";

function LoginPage() {
  // Nettoyage du localStorage dès l'arrivée sur la page de login
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userInfo");
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // ✅ ajouter l'état utilisateur
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log({ email, password });
      
      // 🔹 appel au backend
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;
      
      // 🔹 stockage du token
      // localStorage.setItem("token", token);

      // Avant d'enregistrer le nouveau token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userInfo");

      // Ensuite, stocke le nouveau token et infos utilisateur
      localStorage.setItem("token", token);

      // 🔹 décodage du token (si tu veux récupérer l’email ou le rôle)
      const decoded = jwtDecode(token);
      console.log("Token décodé:", decoded);
      localStorage.setItem("user", JSON.stringify(decoded));

      // 🔹 récupération des infos utilisateur via /me
      
      const meRes = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Vérification du statut (insensible à la casse et aux espaces)
      if ((meRes.data.statut || '').trim().toLowerCase() !== 'actif') {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userInfo");
        alert("Votre compte n'est pas encore activé. Veuillez vérifier votre email. (statut actuel : " + meRes.data.statut + ")");
        return;
      } 
      setUser(meRes.data);
      localStorage.setItem("userInfo", JSON.stringify(meRes.data)); // Stockage des infos utilisateur
      console.log("Utilisateur connecté:", meRes.data);
      // 🔹 redirection
      navigate("/");
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
              <h3 className="text-center mb-4">Connexion</h3>
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
              <p className="text-center mt-3">
                Vous êtes une compagnie ?{" "}
                <a href="/compagnie-login" className="text-decoration-none">
                  Inscrivez votre compagnie
                </a>
              </p>
            </Card.Body>
          </Card>

          {/* ✅ affichage si utilisateur connecté */}
          {user && (
            <div className="mt-3 text-center">
              <h5>Bienvenue {meRes.prenom} {meRes.nom}</h5>
              <p>Rôle: {meRes.role}</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
