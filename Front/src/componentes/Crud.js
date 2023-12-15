
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';


const Cuadricula = ({ plantas, onSelectCelda, celdaSeleccionada }) => {
  let celdas = new Array(169).fill(null);

  plantas.forEach(planta => {
    if (planta.ubicacion && planta.ubicacion.x != null && planta.ubicacion.y != null) {
      const index = planta.ubicacion.y * 13 + planta.ubicacion.x;
      if (index < 169) {
        celdas[index] = planta;
      }
    }
  });

  return (
    <div className="cuadricula">
      {celdas.map((planta, index) => (
        <div
          key={index}
          className={`celda ${planta ? 'celda-con-info' : ''} ${celdaSeleccionada === index ? 'seleccionada' : ''}`}
          onClick={() => onSelectCelda(index)}
        >
          {planta && <div>{planta.nombre}</div>}
        </div>
      ))}
    </div>
  );
};


function PlantCRUD() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [crearPlantas, setCrearPlantas] = useState({ nombre: '', descripcion: '' });
  const [llamarPlantas, setLlamarPlantas] = useState([]);
  const [updatePlant, setUpdatePlant] = useState({ idPlanta: '', nombre: '', descripcion: '' });
  const [celdaSeleccionada, setCeldaSeleccionada] = useState(null);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
const [plantaSeleccionada, setPlantaSeleccionada] = useState(null);
const [showGridLocationModal, setShowGridLocationModal] = useState(false);
const [gridLocation, setGridLocation] = useState({ x: 0, y: 0 });

const [selectedPlantForLocation, setSelectedPlantForLocation] = useState(null);
const handleGridLocationChange = (e, axis) => {
  setGridLocation({ ...gridLocation, [axis]: parseInt(e.target.value) });
};

  
  useEffect(() => {
    llamarPlants();
  }, []);

  const handleSelectCelda = (indexCelda) => {
    const planta = llamarPlantas[indexCelda];
    if (planta) {
      setPlantaSeleccionada(planta);
      setShowDescriptionModal(true);
    }
  };
  
  

  const llamarPlants = async () => {
    const URL = 'http://localhost:8082/plantas';
    const requestOptionsLlamar = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const respuesta = await fetch(URL, requestOptionsLlamar);
      const listadoPlantas = await respuesta.json();
      setLlamarPlantas(listadoPlantas);
      if (respuesta.ok) {
        console.log('Exitosa', respuesta);
      } else {
        console.error('Hubo un error');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const crearPlants = async (e) => {
    e.preventDefault();
    
    if (!crearPlantas.nombre.trim() || !crearPlantas.descripcion.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, completa todos los campos y evita espacios en blanco.',
      });
      return;
    }

    const URL = 'http://localhost:8082/addPlantas';
    const requestOptionsAgregar = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(crearPlantas),
    };

    try {
      const respuesta = await fetch(URL, requestOptionsAgregar);
      const data = await respuesta.json();
      console.log('Agregado:', data);

      setShowAddModal(false);
      llamarPlants();

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'La planta se ha creado correctamente.',
      });
      
    } catch (error) {
      console.log('Hubo algún error en crear:', error);
    }
  };

  const actualizarPlants = async (e) => {
    e.preventDefault();

    if (!updatePlant.nombre.trim() || !updatePlant.descripcion.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, completa todos los campos y evita espacios en blanco.',
      });
      return;
    }

    const URL = 'http://localhost:8082/updatePlantas';
    const requestOptionsActualizar = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idPlanta: updatePlant.idPlanta,
        nombre: updatePlant.nombre,
        descripcion: updatePlant.descripcion,
      }), 
    };

    try {
      const respuesta = await fetch(URL, requestOptionsActualizar);
      const data = await respuesta.json();
      console.log('Actualizado: ', data);

      llamarPlants();
      setEditModalVisible(false);

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'La planta se ha actualizado correctamente.',
      });

    } catch (error) {
      console.log('Hubo algún error en actualizar', error);
    }
  };

  const eliminarPlants = async (id) => {
    const URL = 'http://localhost:8082/deletePlantas';
    const requestOptionsEliminar = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idPlanta: id }),
    };
  
    try {
      const respuesta = await fetch(URL, requestOptionsEliminar);
  
      if (!respuesta.ok) {
        throw new Error(`Error al eliminar la planta. Código: ${respuesta.status}`);
      }
  
      const data = await respuesta.json();
      console.log('Eliminado: ', data);
  
      llamarPlants();
      console.log('llamarPlantas después de eliminar:', llamarPlantas);
    } catch (error) {
      console.log('Hubo algún error en eliminar', error);
      // Puedes recargar la página aquí
      window.location.reload();
    }
  };
  

  const editarPlanta = (plant) => {
    setUpdatePlant({
      idPlanta: plant.idPlanta,
      nombre: plant.nombre,
      descripcion: plant.descripcion,
    });

    setEditModalVisible(true);
  };

  const openGridLocationModal = (planta) => {
    setSelectedPlantForLocation(planta);
    setShowGridLocationModal(true);
  };

  // Función para manejar el cambio de ubicación de las plantas
  const handleGridLocationSubmit = () => {
    const plantasActualizadas = llamarPlantas.map(planta =>
      planta.idPlanta === selectedPlantForLocation.idPlanta
        ? { ...planta, ubicacion: gridLocation }
        : planta
    );
    setLlamarPlantas(plantasActualizadas);
    setShowGridLocationModal(false);
  };
  
  

  return (
    <div className="container-fluid">
      <h1>CRUD de plantas</h1>

      <button className="btn btn-success mb-3" onClick={() => setShowAddModal(true)}>
        Añadir Planta
      </button>

    <Link to='/search'>
    <button className="btn btn-success mb-3 ms-2">
        Busqueda de Planta
      </button>
    </Link>

      <div className="table-responsive">
        <table className="table table-xl">
          <thead className="table-dark">
            <tr>
              <th scope="col">Nombre común</th>
              <th scope="col">Descripción</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {llamarPlantas?.map((plant) => (
              <tr key={plant.idPlanta}>
                <td>{plant.nombre}</td>
                <td>{plant.descripcion}</td>
                <td>
                  <div className="btn-group">
                    <button
                      className="btn btn-warning"
                      onClick={() => editarPlanta(plant)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => eliminarPlants(plant.idPlanta)}
                    >
                      Eliminar
                    </button>
                    <button className="btn btn-info" onClick={() => openGridLocationModal(plant)}>
                    Ubicación
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      
            {/* ... cuadriculas y su modal ... */}


      <Cuadricula
        plantas={llamarPlantas}
        onSelectCelda={handleSelectCelda}
        celdaSeleccionada={celdaSeleccionada}
      />
      {/* Modal para seleccionar ubicación en la cuadrícula */}
      {showGridLocationModal && (
        <div className="modal" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Seleccionar Ubicación en Cuadrícula</h5>
                <button type="button" className="close" onClick={() => setShowGridLocationModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <label>Coordenada X:</label>
                  <input
                    type="number"
                    value={gridLocation.x}
                    onChange={(e) => handleGridLocationChange(e, 'x')}
                    className="form-control"
                    placeholder="Ingresa la coordenada X"
                  />
                </div>
                <div>
                  <label>Coordenada Y:</label>
                  <input
                    type="number"
                    value={gridLocation.y}
                    onChange={(e) => handleGridLocationChange(e, 'y')}
                    className="form-control"
                    placeholder="Ingresa la coordenada Y"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleGridLocationSubmit}>
                  Guardar Ubicación
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowGridLocationModal(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    {showDescriptionModal && (
      <div
        className="modal"
        tabIndex="-1"
        role="dialog"
        style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Descripción de la Planta</h5>
              <button
                type="button"
                className="close"
                onClick={() => setShowDescriptionModal(false)}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Nombre: {plantaSeleccionada.nombre}</p>
              <p>Descripción: {plantaSeleccionada.descripcion}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDescriptionModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
);

      {/* ... modal del crud ... */}


      {editModalVisible && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Planta</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setEditModalVisible(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="col-auto">
                  <label className="form-label">Nuevo nombre de la planta</label>
                  <input
                    className="form-control"
                    type="text"
                    value={updatePlant.nombre}
                    name="common_name"
                    onChange={(e) =>
                      setUpdatePlant({
                        ...updatePlant,
                        nombre: e.target.value,
                      })
                    }
                    placeholder="Nuevo nombre de la planta"
                  />
                </div>
                <div className="col-auto">
                  <label className="form-label">Nueva descripción</label>
                  <input
                    className="form-control"
                    type="text"
                    value={updatePlant.descripcion}
                    name="description"
                    onChange={(e) =>
                      setUpdatePlant({
                        ...updatePlant,
                        descripcion: e.target.value,
                      })
                    }
                    placeholder="Nueva descripción"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={actualizarPlants}
                >
                  Actualizar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setEditModalVisible(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Añadir Planta</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowAddModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label className="form-label">Nombre de la planta</label>
                <input
                  className="form-control"
                  type="text"
                  value={crearPlantas.nombre}
                  name="common_name"
                  onChange={(e) =>
                    setCrearPlantas({
                      ...crearPlantas,
                      nombre: e.target.value,
                    })
                  }
                  placeholder="Ingresa el nombre de la planta"
                />
                <label className="form-label">Descripción</label>
                <input
                  className="form-control"
                  type="text"
                  value={crearPlantas.descripcion}
                  name="description"
                  onChange={(e) =>
                    setCrearPlantas({
                      ...crearPlantas,
                      descripcion: e.target.value,
                    })
                  }
                  placeholder="Ingresa la descripción"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={crearPlants}
                >
                  Añadir
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default PlantCRUD;