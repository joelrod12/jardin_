CREATE DATABASE Busqueda;
USE Busqueda;

CREATE TABLE plantas(
	idPlanta INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255),
    descripcion VARCHAR(255)
);

SELECT * FROM plantas;