-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 19-05-2026 a las 19:24:42
-- Versión del servidor: 8.4.7
-- Versión de PHP: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestion_informatica`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

DROP TABLE IF EXISTS `empleados`;
CREATE TABLE IF NOT EXISTS `empleados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cedula` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo_corporativo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id`, `nombre`, `apellido`, `cedula`, `telefono`, `direccion`, `correo_corporativo`) VALUES
(2, 'Miguel', 'sepa', '2222222222', '0999317246', 'el carmne', 'miguel@gmail');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

DROP TABLE IF EXISTS `equipos`;
CREATE TABLE IF NOT EXISTS `equipos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marca` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modelo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_serie` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_equipo` enum('Laptop','Desktop','Servidor','Tablet','Impresora','Otro') COLLATE utf8mb4_unicode_ci DEFAULT 'Laptop',
  `fecha_compra` date DEFAULT NULL,
  `empleado_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_equipo_empleado` (`empleado_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id`, `marca`, `modelo`, `numero_serie`, `tipo_equipo`, `fecha_compra`, `empleado_id`) VALUES
(2, 'asu', '2302', '23', 'Laptop', '2026-05-13', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `licencias`
--

DROP TABLE IF EXISTS `licencias`;
CREATE TABLE IF NOT EXISTS `licencias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clave_producto` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_expiracion` date DEFAULT NULL,
  `software_id` int DEFAULT NULL,
  `equipo_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_licencia_software` (`software_id`),
  KEY `fk_licencia_equipo` (`equipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `software`
--

DROP TABLE IF EXISTS `software`;
CREATE TABLE IF NOT EXISTS `software` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_app` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desarrollador` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado_soporte` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnico`
--

DROP TABLE IF EXISTS `tecnico`;
CREATE TABLE IF NOT EXISTS `tecnico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre_completo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `especialidad` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tecnico`
--

INSERT INTO `tecnico` (`id`, `usuario`, `contrasena`, `nombre_completo`, `correo`, `telefono`, `especialidad`, `fecha_registro`) VALUES
(1, 'Daniela', '$2a$12$QpgkZZnSK7reU7iodyFkW.G6/kwHKyAb5gZrB2qdGzxMiUPj6MBNa', 'Daniela Maribel', 'daniela@gmail.com', '0999317246', 'tecnico', '2026-05-20 16:47:32'),
(2, 'Miguel', '9999 ', 'Miguel Angel', ' miguel@', ' 09099899', ' tecnico', '2026-05-04 16:31:31'),
(4, 'HOLA', '1256', 'Maribel betsy', 'betsy4@gmail.com', '0987654321', 'tecnico', '2026-05-04 16:31:31'),
(5, 'Danielapreuba', '1256', 'Maribel betsy', 'betsy4@gmail.com', '0987654321', 'tecnico', '2026-05-04 16:31:31'),
(6, 'miguel prueba 3', '1256', 'Maribel betsy', 'betsy4@gmail.com', '0987654321', 'tecnico', '2026-05-04 16:31:31'),
(7, 'miguel prueba 4', '1256', 'Maribel betsy', 'betsy4@gmail.com', '0987654321', 'tecnico', '2026-05-04 16:31:31'),
(8, 'miguel prueba 5', '1256', 'Maribel betsy', 'betsy4@gmail.com', '0987654321', 'tecnico', '2026-05-04 16:31:31'),
(10, 'miguel prueba 7', '1256', 'Maribel betsy', 'betsy4@gmail.com', '0987654321', 'tecnico', '2026-05-04 16:31:31'),
(11, 'miguel prueba 7', '1256', 'Maribel betsy', 'betsy4@gmail.com', '0987654321', 'tecnico', '2026-05-04 16:31:31'),
(12, 'miguelita', '1256', 'Maribel betsy', 'betsy4@gmail.com', '0987654321', 'tecnico', '2026-05-04 16:31:31'),
(13, 'miguelita', '1256', 'Maribel betsy', 'betsy4@gmail.com', '0987654321', 'tecnico', '2026-05-04 16:31:31'),
(14, 'miguelita 2', '$2b$12$hMRxpaauccS2H6xEvYs3z.0qcmKHlLhLOWXLXBqkHMTT04.bl.dyi', 'Maribel betsy', 'betsy4@gmail.com', '0987654321', 'tecnico', '2026-05-04 16:31:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tickets_mantenimientos`
--

DROP TABLE IF EXISTS `tickets_mantenimientos`;
CREATE TABLE IF NOT EXISTS `tickets_mantenimientos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equipo_id` int DEFAULT NULL,
  `tecnico_id` int DEFAULT NULL,
  `fecha_servicio` datetime DEFAULT NULL,
  `descripcion_tecnica` text COLLATE utf8mb4_unicode_ci,
  `costo` decimal(10,2) DEFAULT NULL,
  `asunto` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prioridad` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ticket_equipo` (`equipo_id`),
  KEY `fk_ticket_tecnico` (`tecnico_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tickets_mantenimientos`
--

INSERT INTO `tickets_mantenimientos` (`id`, `equipo_id`, `tecnico_id`, `fecha_servicio`, `descripcion_tecnica`, `costo`, `asunto`, `prioridad`, `estado`) VALUES
(2, 2, 2, '2026-05-20 16:55:36', 'fff', 23.00, 'ed', 'alala', 'mal');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD CONSTRAINT `fk_equipo_empleado` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `licencias`
--
ALTER TABLE `licencias`
  ADD CONSTRAINT `fk_licencia_equipo` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_licencia_software` FOREIGN KEY (`software_id`) REFERENCES `software` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Filtros para la tabla `tickets_mantenimientos`
--
ALTER TABLE `tickets_mantenimientos`
  ADD CONSTRAINT `fk_ticket_equipo` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `fk_ticket_tecnico` FOREIGN KEY (`tecnico_id`) REFERENCES `tecnico` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
