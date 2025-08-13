-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 13, 2025 at 09:50 PM
-- Server version: 5.7.24
-- PHP Version: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `pseudo` text NOT NULL,
  `mail` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `pseudo`, `mail`) VALUES
(1, 'dadrice', 'dadrice@test.fr'),
(2, 'Adam', 'adam@test.fr'),
(3, 'Fantine', 'fantine@test.fr'),
(4, 'Clement', 'clement@test.fr'),
(5, 'Test3', 'test3@gmail.com'),
(6, 'Test3', 'test3@gmail.com'),
(7, 'Test3', 'test3@gmail.com'),
(8, 'Test4', 'test4@gmail.com'),
(9, 'Lalalala', 'lalalala@mail.fr'),
(10, 'TestMoiCa', 'DeTest@test.fr'),
(11, 'NouvelleCarte', 'NouvelleCarte@test.fr'),
(12, 'Adam', 'youhou@test67.fr');

-- --------------------------------------------------------

--
-- Table structure for table `yugidb`
--

CREATE TABLE `yugidb` (
  `id` int(11) NOT NULL,
  `name_fr` text NOT NULL,
  `name_en` text NOT NULL,
  `reference` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `yugidb`
--

INSERT INTO `yugidb` (`id`, `name_fr`, `name_en`, `reference`) VALUES
(1, 'Héros Vivant', 'A Hero Lives', 'LED6-FR022'),
(2, 'Dharc la Charmeuse des Ténèbres Obscures', 'Dharc the Dark Charmer, Gloomy', 'RA03-FR048'),
(3, 'Âme Désenchaînée de la Rage', 'Unchained Soul of Rage', 'RA02-FR041');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `yugidb`
--
ALTER TABLE `yugidb`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `yugidb`
--
ALTER TABLE `yugidb`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
