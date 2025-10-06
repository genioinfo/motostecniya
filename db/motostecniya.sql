-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3307
-- Tiempo de generación: 15-06-2021 a las 09:10:28
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `motostecniya`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblcliente`
--

DROP TABLE IF EXISTS tblcliente;

CREATE TABLE tblcliente (
  Id INT PRIMARY KEY AUTO_INCREMENT,
  Nombre VARCHAR(100) NOT NULL,
  Apellido VARCHAR(100) NOT NULL,
  Telefono VARCHAR(20),
  Correo VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblmantenimiento`
--

CREATE TABLE `tblmantenimiento` (
  `MantId` int(15) NOT NULL,
  `MantFecha` date NOT NULL,
  `MantRepuestos` text NOT NULL,
  `MantValor` int(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblmecanicoaux`
--

DROP TABLE IF EXISTS tblmecanicoaux;

CREATE TABLE tblmecanicoaux (
  Cedula INT PRIMARY KEY,
  Nombre VARCHAR(100) NOT NULL,
  Apellido VARCHAR(100) NOT NULL,
  Telefono VARCHAR(20),
  Correo VARCHAR(100) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL,
  FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblmotocicleta`
--

CREATE TABLE `tblmotocicleta` (
  `MotPlaca` varchar(10) NOT NULL,
  `motMarca` varchar(25) NOT NULL,
  `MotModelo` int(10) NOT NULL,
  `MotColor` varchar(30) NOT NULL,
  `MotPropietario` int(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tblpropietario`
--

CREATE TABLE `tblpropietario` (
  `ProCedula` int(15) NOT NULL,
  `ProNombre` varchar(40) NOT NULL,
  `ProApellido` varchar(40) NOT NULL,
  `ProTelefono` int(12) NOT NULL,
  `ProPassword` varchar(15) NOT NULL,
  `ProCorreo` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tblcliente`
--
ALTER TABLE `tblcliente`
  ADD PRIMARY KEY (`CliCedula`),
  ADD UNIQUE KEY `MotPlaca` (`CliPlaMoto`);

--
-- Indices de la tabla `tblmantenimiento`
--
ALTER TABLE `tblmantenimiento`
  ADD PRIMARY KEY (`MantId`);

--
-- Indices de la tabla `tblmecanicoaux`
--
ALTER TABLE `tblmecanicoaux`
  ADD PRIMARY KEY (`AuxCedula`);

--
-- Indices de la tabla `tblmotocicleta`
--
ALTER TABLE `tblmotocicleta`
  ADD PRIMARY KEY (`MotPlaca`),
  ADD UNIQUE KEY `CliCedula` (`MotPropietario`);

--
-- Indices de la tabla `tblpropietario`
--
ALTER TABLE `tblpropietario`
  ADD PRIMARY KEY (`ProCedula`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
