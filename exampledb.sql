SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;

--
-- Veritabanı: `chat`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `room-messages`
--

CREATE TABLE `room-messages` (
    `id` int(11) NOT NULL,
    `message` varchar(2000) DEFAULT NULL,
    `room_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COLLATE = utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `rooms`
--

CREATE TABLE `rooms` (
    `id` int(11) NOT NULL,
    `name` varchar(255) NOT NULL,
    `status` tinyint(1) NOT NULL DEFAULT 0,
    `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COLLATE = utf8mb3_general_ci;

--
-- Tablo döküm verisi `rooms`
--

INSERT INTO
    `rooms` (
        `id`,
        `name`,
        `status`,
        `created_at`
    )
VALUES (
        1,
        'Oda 1',
        0,
        '2024-09-03 23:20:54'
    ),
    (
        2,
        'Oda 2',
        1,
        '2024-09-03 23:21:05'
    ),
    (
        3,
        'Oda 3',
        1,
        '2024-09-03 23:21:13'
    );

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `users`
--

CREATE TABLE `users` (
    `id` int(11) NOT NULL,
    `username` varchar(25) NOT NULL,
    `nickname` varchar(50) DEFAULT NULL,
    `password` varchar(32) DEFAULT NULL,
    `token` varchar(255) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb3 COLLATE = utf8mb3_general_ci;

--
-- Tablo döküm verisi `users`
--

INSERT INTO
    `users` (
        `id`,
        `username`,
        `nickname`,
        `password`,
        `token`
    )
VALUES (
        1,
        'test',
        'Test User',
        'e10adc3949ba59abbe56e057f20f883e',
        '5953bc04ed97e5d86de29d6863bf869d300d80721cb25ce9417bd0a961f11d6863601adf4de5d11665602c2c240db460210ecaa13cc398498c47d4a3eed0c829'
    );

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `room-messages`
--
ALTER TABLE `room-messages`
ADD PRIMARY KEY (`id`),
ADD KEY `id` (`id`);

--
-- Tablo için indeksler `rooms`
--
ALTER TABLE `rooms` ADD PRIMARY KEY (`id`), ADD KEY `id` (`id`);

--
-- Tablo için indeksler `users`
--
ALTER TABLE `users` ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `room-messages`
--
ALTER TABLE `room-messages`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Tablo için AUTO_INCREMENT değeri `rooms`
--
ALTER TABLE `rooms`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 5;

--
-- Tablo için AUTO_INCREMENT değeri `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 2;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;