import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    // Verificar si el usuario ha iniciado sesión
    const isLoggedIn = localStorage.getItem('userLoggedIn');

    const handleLogout = () => {
        // Limpiar el indicador de sesión en localStorage
        localStorage.removeItem('userLoggedIn');

        // Redirige al usuario a la página de inicio de sesión
        navigate('/');
    };

    return (
        <header>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <p className="navbar-brand">Jardin Polimizador</p>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        {/* Si el usuario ha iniciado sesión, muestra el botón de Cerrar Sesión */}
                        {isLoggedIn && (
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
