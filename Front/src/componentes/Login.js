import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Instancia de useNavigate

  useEffect(() => {
    const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
    setUsuarios(usuariosRegistrados);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Aquí iría tu lógica de inicio de sesión
    const usuarioEncontrado = usuarios.find(usuario => usuario.email === email && usuario.password === password);
    if (usuarioEncontrado) {
      // Usuario encontrado y contraseña correcta
      // Redirigir al usuario a otra ruta, por ejemplo '/main'
      navigate('/main'); // Cambiar '/main' por la ruta deseada
    } else {
      // Usuario no encontrado o contraseña incorrecta
      setError('Correo electrónico o contraseña incorrectos.');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Aquí iría la lógica para registrar un nuevo usuario
    // Por ejemplo, agregar el usuario al array `usuarios` y guardarlo en localStorage
    const nuevoUsuario = { email, password };
    const nuevosUsuarios = [...usuarios, nuevoUsuario];
    setUsuarios(nuevosUsuarios);
    localStorage.setItem('usuarios', JSON.stringify(nuevosUsuarios));
    setIsLogin(true);
    setEmail('');
    setPassword('');
    setError('');
  };
  // En tu función de manejo de inicio de sesión
localStorage.setItem('userLoggedIn', 'true');
// Redirigir a la página principal o donde necesites


  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">
                {isLogin ? 'Login' : 'Registro'}
              </Card.Title>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                {isLogin ? (
                  <Button variant="primary" type="submit" onClick={handleLogin} block>
                    Iniciar Sesión
                  </Button>
                ) : (
                  <Button variant="primary" type="submit" onClick={handleRegister} block>
                    Registrarse
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="justify-content-center mt-3">
        <Col xs={12} md={6} lg={4}>
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
