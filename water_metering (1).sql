-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 14, 2025 at 12:40 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `water_metering`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `nipn` varchar(25) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `nohp` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `wilayah_kerja` text DEFAULT NULL,
  `token` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`nipn`, `nama`, `nohp`, `email`, `password`, `wilayah_kerja`, `token`, `created_at`, `updated_at`, `deleted_at`) VALUES
('111111', 'saya', '08123456', 'saya@mail.com', '94098d10afdeaf19011e7a074bb90b1e2f731ffa', 'bandung, dayeuhkolot', 'WzFXYfsXg7CeaOyJXb486bcRKrSoDb', '2025-03-04 16:45:24', '2025-03-04 16:45:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_category`
--

CREATE TABLE `customer_category` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_category`
--

INSERT INTO `customer_category` (`id`, `nama`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'SOSIAL 1A', '2025-06-25 01:05:21', '2025-07-03 15:52:47', NULL),
(2, 'SOSIAL 1B', '2025-07-03 16:01:52', '2025-07-04 02:18:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `data_device`
--

CREATE TABLE `data_device` (
  `id` int(10) UNSIGNED NOT NULL,
  `device` int(10) UNSIGNED DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `images_source` varchar(100) DEFAULT NULL,
  `is_paid` int(11) NOT NULL DEFAULT 0,
  `execution_time` float DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_device`
--

INSERT INTO `data_device` (`id`, `device`, `value`, `images_source`, `is_paid`, `execution_time`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 20986, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_13-23-59.jpg', 0, 5.30091, '2025-06-01 13:24:06', '2025-06-01 13:24:06', NULL),
(2, 1, 11789, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_13-46-51.jpg', 0, 5.34837, '2025-06-01 13:46:59', '2025-06-01 13:46:59', NULL),
(3, 1, 13562, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_13-58-21.jpg', 0, 5.89968, '2025-06-01 13:58:29', '2025-06-01 13:58:29', NULL),
(4, 1, 14310, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_14-04-11.jpg', 0, 4.95501, '2025-06-01 14:04:18', '2025-06-01 14:04:18', NULL),
(5, 1, 15876, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_14-16-57.jpg', 0, 4.95725, '2025-06-01 14:17:04', '2025-06-01 14:17:04', NULL),
(6, 1, 24532, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_14-24-30.jpg', 0, 4.88626, '2025-06-01 14:24:37', '2025-06-01 14:24:37', NULL),
(7, 1, 25301, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_14-28-28.jpg', 0, 4.0911, '2025-06-01 14:28:34', '2025-06-01 14:28:34', NULL),
(8, 1, 26890, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_14-37-09.jpg', 0, 5.04112, '2025-06-01 14:37:16', '2025-06-01 14:37:16', NULL),
(9, 1, 27567, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_14-50-48.jpg', 0, 6.82793, '2025-06-01 14:50:57', '2025-06-01 14:50:57', NULL),
(10, 1, 30781, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_14-57-50.jpg', 0, 5.2243, '2025-06-01 14:57:57', '2025-06-01 14:57:57', NULL),
(11, 1, 32456, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_15-03-07.jpg', 0, 5.74047, '2025-06-01 15:03:15', '2025-06-01 15:03:15', NULL),
(12, 1, 33214, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_15-11-57.jpg', 0, 4.78169, '2025-06-01 15:12:04', '2025-06-01 15:12:04', NULL),
(13, 1, 34923, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_15-31-39.jpg', 0, 5.87092, '2025-06-01 15:31:47', '2025-06-01 15:31:47', NULL),
(14, 1, 36201, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_15-39-48.jpg', 0, 5.398, '2025-06-01 15:39:56', '2025-06-01 15:39:56', NULL),
(15, 1, 37985, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_15-44-43.jpg', 0, 5.00151, '2025-06-01 15:44:50', '2025-06-01 15:44:50', NULL),
(16, 1, 38410, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_15-52-07.jpg', 0, 4.72989, '2025-06-01 15:52:14', '2025-06-01 15:52:14', NULL),
(17, 1, 39876, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_15-57-00.jpg', 0, 3.68276, '2025-06-01 15:57:05', '2025-06-01 15:57:05', NULL),
(18, 1, 41234, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-00-26.jpg', 0, 4.13338, '2025-06-01 16:00:32', '2025-06-01 16:00:32', NULL),
(19, 1, 42765, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-05-24.jpg', 0, 5.49595, '2025-06-01 16:05:31', '2025-06-01 16:05:31', NULL),
(20, 1, 43987, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-07-27.jpg', 0, 4.15798, '2025-06-01 16:07:33', '2025-06-01 16:07:33', NULL),
(21, 1, 45231, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-10-14.jpg', 0, 4.11988, '2025-06-01 16:10:20', '2025-06-01 16:10:20', NULL),
(22, 1, 46890, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-27-15.jpg', 0, 5.1023, '2025-06-01 16:27:21', '2025-06-01 16:27:21', NULL),
(23, 1, 47901, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-36-09.jpg', 0, 4.8492, '2025-06-01 16:36:16', '2025-06-01 16:36:16', NULL),
(24, 1, 48655, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-39-15.jpg', 0, 5.26898, '2025-06-01 16:39:22', '2025-06-01 16:39:22', NULL),
(25, 1, 50210, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-41-42.jpg', 0, 5.07736, '2025-06-01 16:41:49', '2025-06-01 16:41:49', NULL),
(26, 1, 51789, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-43-59.jpg', 0, 5.14393, '2025-06-01 16:44:06', '2025-06-01 16:44:06', NULL),
(27, 1, 52987, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-47-06.jpg', 0, 4.91485, '2025-06-01 16:47:12', '2025-06-01 16:47:12', NULL),
(28, 1, 54890, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-49-24.jpg', 0, 4.98258, '2025-06-01 16:49:31', '2025-06-01 16:49:31', NULL),
(29, 1, 56321, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-54-37.jpg', 0, 5.04924, '2025-06-01 16:54:44', '2025-06-01 16:54:44', NULL),
(30, 1, 57456, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_16-57-45.jpg', 0, 5.47425, '2025-06-01 16:57:52', '2025-06-01 16:57:52', NULL),
(31, 1, 58901, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_17-11-07.jpg', 0, 4.85595, '2025-06-01 17:11:14', '2025-06-01 17:11:14', NULL),
(32, 1, 60125, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_17-12-50.jpg', 0, 4.27588, '2025-06-01 17:12:56', '2025-06-01 17:12:56', NULL),
(33, 1, 60123, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_17-13-00.jpg', 1, 4.63637, '2025-06-01 17:13:07', '2025-06-01 17:13:07', NULL),
(34, 1, 61890, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_17-17-27.jpg', 0, 5.78084, '2025-06-01 17:17:35', '2025-06-01 17:17:35', NULL),
(35, 1, 63210, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-06-01_17-27-07.jpg', 0, 4.92213, '2025-06-01 17:27:14', '2025-06-01 17:27:14', NULL),
(36, 2, 11789, 'ne6UyghFZbqpcFjZkafZ2zOtEc1zed/2025-06-20_10-50-16.jpg', 1, 4.46079, '2025-06-20 10:50:24', '2025-06-20 10:50:24', NULL),
(37, 2, 13562, 'ne6UyghFZbqpcFjZkafZ2zOtEc1zed/2025-06-20_11-22-26.jpg', 0, 6.26241, '2025-06-20 11:22:35', '2025-06-20 18:27:28', NULL),
(38, 2, 14310, 'ne6UyghFZbqpcFjZkafZ2zOtEc1zed/2025-06-20_11-23-23.jpg', 0, 5.86101, '2025-06-20 11:23:31', '2025-06-20 11:23:31', NULL),
(39, 3, 73400, '3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ/2025-06-28_16-24-45.jpg', 0, 4.34327, '2025-06-28 16:24:51', '2025-06-28 16:24:51', NULL),
(40, 3, 73410, '3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ/2025-06-28_16-49-31.jpg', 0, 5.31804, '2025-06-28 16:49:38', '2025-06-28 16:49:38', NULL),
(41, 3, 73420, '3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ/2025-06-28_16-51-01.jpg', 0, 4.14194, '2025-06-28 16:51:06', '2025-06-28 16:51:06', NULL),
(42, 3, 73430, '3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ/2025-06-28_16-53-16.jpg', 0, 4.09203, '2025-06-28 16:53:22', '2025-06-28 16:53:22', NULL),
(43, 3, 73440, '3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ/2025-06-28_16-54-52.jpg', 0, 4.71192, '2025-06-28 16:54:58', '2025-06-28 16:54:58', NULL),
(44, 3, 73450, '3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ/2025-06-28_16-56-16.jpg', 0, 4.62463, '2025-06-28 16:56:22', '2025-06-28 16:56:22', NULL),
(45, 3, 73460, '3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ/2025-06-28_16-57-38.jpg', 0, 4.77399, '2025-06-28 16:57:45', '2025-06-28 16:57:45', NULL),
(46, 3, 73470, '3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ/2025-06-28_16-59-08.jpg', 0, 5.04955, '2025-06-28 16:59:15', '2025-06-28 16:59:15', NULL),
(47, 3, 73480, '3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ/2025-06-28_17-00-25.jpg', 0, 4.11484, '2025-06-28 17:00:31', '2025-06-28 17:00:31', NULL),
(48, 3, 73490, '3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ/2025-06-28_17-02-04.jpg', 0, 4.36232, '2025-06-28 17:02:10', '2025-06-28 17:02:10', NULL),
(49, 1, 73400, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-07-03_15-26-24.jpg', 1, 4.0652, '2025-07-03 15:26:32', '2025-07-03 15:26:32', NULL),
(50, 1, 73430, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP/2025-07-03_15-26-49.jpg', 0, 3.65659, '2025-07-03 15:26:54', '2025-07-03 15:26:54', NULL),
(51, 2, 73410, 'ne6UyghFZbqpcFjZkafZ2zOtEc1zed/2025-07-03_15-42-59.jpg', 1, 4.76606, '2025-07-03 15:43:05', '2025-07-03 15:43:05', NULL),
(52, 2, 73450, 'ne6UyghFZbqpcFjZkafZ2zOtEc1zed/2025-07-03_15-43-28.jpg', 1, 3.83666, '2025-07-03 15:43:34', '2025-07-04 10:22:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `device`
--

CREATE TABLE `device` (
  `id` int(10) UNSIGNED NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `nik` varchar(20) DEFAULT NULL,
  `category` int(10) UNSIGNED DEFAULT NULL,
  `token` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `device`
--

INSERT INTO `device` (`id`, `nama`, `alamat`, `nik`, `category`, `token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'sia', 'sukapura no 1', '0000001', 1, 'Rn1Ji2xt2dQE63xCBjmkDb25Qk6bLP', '2025-03-08 11:44:36', '2025-06-25 02:25:04', NULL),
(2, 'rumah b', 'kompleks disana', '000002', 1, 'ne6UyghFZbqpcFjZkafZ2zOtEc1zed', '2025-06-16 22:10:51', '2025-07-03 15:45:00', NULL),
(3, 'rumah rasuk', 'kompleks disitu', '000003', 2, '3rIR7dZh8QBIUIPQAkrE0kK1nv2nvJ', '2025-06-17 23:24:32', '2025-07-03 16:02:15', NULL),
(4, 'rumah c', 'Pesona Bali', '000003', 2, 'nO90SML4oKqHyJqJr9b2PkAyqTmPyR', '2025-06-21 01:29:59', '2025-07-03 16:02:24', NULL),
(5, 'kosan', 'gate 1', '000002', 2, 'WwNqFsqkOrawuIh7bNkxZpAIig6Wbn', '2025-06-21 10:49:46', '2025-07-03 16:02:34', NULL),
(6, 'kost', 'Sukapura no.5', '000002', 2, 'Fb6y9xyplPj33LV1EcfNs8ZXOEPw1Y', '2025-06-21 10:53:09', '2025-07-04 01:26:39', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `harga`
--

CREATE TABLE `harga` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `min` int(11) NOT NULL,
  `max` int(11) NOT NULL,
  `harga` int(11) NOT NULL,
  `customer_category` int(11) UNSIGNED NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `harga`
--

INSERT INTO `harga` (`id`, `min`, `max`, `harga`, `customer_category`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 10, 900, 1, '2025-06-25 01:05:21', '2025-06-25 01:29:06', '2025-06-25 01:29:06'),
(2, 1, 10, 900, 1, '2025-06-25 01:29:06', '2025-07-03 15:52:06', '2025-07-03 15:52:06'),
(3, 11, 20, 900, 1, '2025-06-25 01:29:06', '2025-07-03 15:52:06', '2025-07-03 15:52:06'),
(4, 1, 10, 900, 1, '2025-07-03 15:52:06', '2025-07-03 15:52:47', '2025-07-03 15:52:47'),
(5, 11, 20, 900, 1, '2025-07-03 15:52:06', '2025-07-03 15:52:47', '2025-07-03 15:52:47'),
(6, 21, 30, 900, 1, '2025-07-03 15:52:06', '2025-07-03 15:52:47', '2025-07-03 15:52:47'),
(7, 1, 10, 900, 1, '2025-07-03 15:52:47', '2025-07-03 15:52:47', NULL),
(8, 11, 20, 900, 1, '2025-07-03 15:52:47', '2025-07-03 15:52:47', NULL),
(9, 21, 30, 900, 1, '2025-07-03 15:52:47', '2025-07-03 15:52:47', NULL),
(10, 31, 99999, 1300, 1, '2025-07-03 15:52:47', '2025-07-03 15:52:47', NULL),
(11, 0, 10, 900, 2, '2025-07-03 16:01:52', '2025-07-04 02:10:08', '2025-07-04 02:10:08'),
(12, 11, 20, 900, 2, '2025-07-03 16:01:52', '2025-07-04 02:10:08', '2025-07-04 02:10:08'),
(13, 21, 30, 1400, 2, '2025-07-03 16:01:52', '2025-07-04 02:10:08', '2025-07-04 02:10:08'),
(14, 0, 10, 900, 2, '2025-07-04 02:10:08', '2025-07-04 02:18:53', '2025-07-04 02:18:53'),
(15, 11, 20, 900, 2, '2025-07-04 02:10:08', '2025-07-04 02:18:53', '2025-07-04 02:18:53'),
(16, 0, 10, 900, 2, '2025-07-04 02:18:53', '2025-07-04 02:18:53', NULL),
(17, 11, 20, 900, 2, '2025-07-04 02:18:53', '2025-07-04 02:18:53', NULL),
(18, 21, 30, 1400, 2, '2025-07-04 02:18:53', '2025-07-04 02:18:53', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pelanggan`
--

CREATE TABLE `pelanggan` (
  `nik` varchar(20) NOT NULL,
  `nama` varchar(50) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `no_hp` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `token` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pelanggan`
--

INSERT INTO `pelanggan` (`nik`, `nama`, `tanggal_lahir`, `alamat`, `no_hp`, `email`, `password`, `token`, `created_at`, `updated_at`, `deleted_at`) VALUES
('0000001', 'ramdi sai', '2001-01-24', 'adyaksa 1, dayeuhkolot', '081234', 'pelanggan1@mail.com', '8feca69431a21882b85efb635408f667e4a72589', 'rtR5jL6na3IO1UTheMUrKOIZxy13sz', '2025-03-07 06:19:06', '2025-03-07 06:19:06', NULL),
('000002', 'rachmad sukri', '2002-02-01', 'Sukapura', '082191901157', 'rachmadsukri@gmail.com', '94098d10afdeaf19011e7a074bb90b1e2f731ffa', 'Zl1dcN5FcgrlQROfFWb6CB2Su3nKwU', '2025-06-14 01:02:26', '2025-07-03 15:59:21', NULL),
('000003', 'rasuk', '2001-07-10', 'Sukabirus no.1', '085678910', 'rasuk@mail.com', '94098d10afdeaf19011e7a074bb90b1e2f731ffa', 'kGJzwrCskCwBLnTmjcslu93QCwhy6q', '2025-06-14 01:04:49', '2025-07-04 00:34:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('CrRj719al9soBenLjNCw06wAsMR6dI4uJy5zuMVu', NULL, '192.168.137.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiQmx3eEpYWTlVWXhkSGVyR3FWTjJ5UmxHVjNROVJDRUdiZ1l3dWRpSSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xOTIuMTY4LjEzNy4xOjgwMDAvdmlldyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748768389),
('eg9AqWsgiCgWc0f9LDwHAPPTpFD85ZPGEbe3MyA8', NULL, '192.168.137.17', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNmhlVTI0aXBxSjU0NzIxSWRMeDZoMFY3RWpGN3UzcHNLZ0dDZlRiVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xOTIuMTY4LjEzNy4xOjgwMDAvdmlldyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748687324),
('jgd6aEDdeobyxoZuTWsELqycJ7EkkZOp06U5BBOC', NULL, '192.168.137.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTEZtdHBYYWh6WDN0SzJvQzAyOG9USnZZMmttZDlkZGdTRW02OWJQSiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NjE6Imh0dHA6Ly8xOTIuMTY4LjEzNy4xOjgwMDAvdmlldy8zcklSN2RaaDhRQklVSVBRQWtyRTBrSzFudjJudkoiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1751102641),
('NIqNO22HCcveX5Y218svcTWyMW0nAJyhYj7MW9lQ', NULL, '192.168.137.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiRkdXdUFuejdHYjkzNU5kVUg0SXpRYjAweGNicmtXN1ZXbXJPb2xiQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xOTIuMTY4LjEzNy4xOjgwMDAvdmlldyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748760334),
('QFtxur0NLl2rWG5LDJ9dn9hDChe1qzGHkfJgcJzE', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNGlzM0N6VlhWMWw0cENqM09Ea0Z4YldFbnVaYk1XR0MyMG5FaEpXOSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC92aWV3L25lNlV5Z2hGWmJxcGNGalprYWZaMnpPdEVjMXplZCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1750586039),
('zNhnRyOAWTISXVt9lYGDKuyrAS8gGaBQcJjAxNuC', NULL, '192.168.137.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidUZmbVpyZ1pNRHptT29scEJrMVpzek5LcVhta0o4S1VvamJ2MVk1USI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xOTIuMTY4LjEzNy4xOjgwMDAvdmlldyI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1748681964);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`nipn`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `customer_category`
--
ALTER TABLE `customer_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_device`
--
ALTER TABLE `data_device`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `device`
--
ALTER TABLE `device`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `harga`
--
ALTER TABLE `harga`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD PRIMARY KEY (`nik`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer_category`
--
ALTER TABLE `customer_category`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `data_device`
--
ALTER TABLE `data_device`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `device`
--
ALTER TABLE `device`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `harga`
--
ALTER TABLE `harga`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
