import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

//Abies alba

function PlantaBuscador() {
    const apiKey = 'sk-jfXj656a2ec7362133260';
    const [busqueda, setSearchTerm] = useState('');
    const [plantaData, setPlantaData] = useState(null);
    const [obtainingData, setObtainingData] = useState(false);
    const [plantInfo, setPlantInfo] = useState(null);
    const [obtainingInfo, setObtainingInfo] = useState(false);

    const handleCloseModal = () => {
        setPlantInfo(null);
    };

    const getPlantInfo = async () => {

        if (!busqueda.trim()) {
            return Swal.fire({
                title: 'Campo vacío',
                icon: 'info',
                text: 'Por favor, ingrese un nombre de planta para buscar.',
            });
        }

        setObtainingData(true);

        try {
            const response = await axios.get(`https://perenual.com/api/species-list?key=${apiKey}&q=${busqueda}`);

            if (response.status !== 200) {
                console.log(response);
                return Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Ha ocurrido un error',
                });
            }

            if (response.data.data.length === 0) {
                return Swal.fire({
                    title: 'Planta no encontrada',
                    icon: 'info',
                    text: 'No se encontraron plantas con el nombre proporcionado',
                });
            }

            setPlantaData(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setObtainingData(false);
        }
    };

    const getPlantInfoByID = async (id) => {
        setObtainingInfo(true);

        try {
            const response = await axios.get(`https://perenual.com/api/species/details/${id}?key=${apiKey}`);

            if (response.status !== 200) {
                console.log(response);
                return Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Ha ocurrido un error al obtener la información por ID',
                });
            }

            setPlantInfo(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setObtainingInfo(false);
        }
    };

    return (
        
        <div className="container mt-5">
            <div className="row">
                <div className="col-12 text-center mb-4">
                    <h1 className="display-4">Búsqueda de Plantas</h1>
                </div>
                <Link to='/'>
                    <button className="btn btn-success mb-3 ms-2">
                        Crud de Plantas
                    </button>
                </Link>

            </div>
            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre de la planta"
                            value={busqueda}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-success"
                                onClick={getPlantInfo}
                                disabled={obtainingData}
                            >
                                Obtener información
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {obtainingData && <p className="text-center">Obteniendo información...</p>}

            {plantaData && plantaData.data.length > 0 && (
                <div className="row">
                    {plantaData.data.map((planta) => (
                        <div key={planta.id} className="col-md-4 mb-4">
                            <div className="card">
                                {planta.default_image && planta.default_image.thumbnail && (
                                    <img
                                        src={planta.default_image.thumbnail}
                                        className="card-img-top"
                                        alt={planta.common_name}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{planta.common_name}</h5>
                                    <p className="card-text">
                                        <strong>ID:</strong> {planta.id}
                                    </p>
                                    <p className="card-text">
                                        <strong>Nombre científico:</strong>{' '}
                                        {planta.scientific_name.join(', ')}
                                    </p>
                                    <button
                                        className="btn btn-info btn-sm"
                                        onClick={() => getPlantInfoByID(planta.id)}
                                    >
                                        Ver Detalles por ID
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {plantInfo && (
                <div className="row mt-4">
                    <div className="col-md-12">
                        {obtainingInfo ? (
                            <p className="text-center">Obteniendo información por ID...</p>
                        ) : (
                            <>
                                <Modal show={true} onHide={handleCloseModal}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Detalles de la Planta</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <p><strong>Nombre Común:</strong> {plantInfo.common_name}</p>
                                        <p><strong>Nombre Científico:</strong> {plantInfo.scientific_name.join(', ')}</p>
                                        <p><strong>Mantenimiento:</strong> {plantInfo.maintenance}</p>
                                        <p><strong>Medicinal:</strong> {plantInfo.medicinal ? 'Sí' : 'No'}</p>
                                        <p><strong>Veneno para Humanos:</strong> {plantInfo.poisonous_to_humans ? 'Sí' : 'No'}</p>
                                        <p><strong>Veneno para Mascotas:</strong> {plantInfo.poisonous_to_pets ? 'Sí' : 'No'}</p>
                                        <p><strong>Nivel de Cuidado:</strong> {plantInfo.care_level}</p>
                                        <p><strong>Descripción:</strong> {plantInfo.description}</p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseModal}>
                                            Cerrar
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlantaBuscador;