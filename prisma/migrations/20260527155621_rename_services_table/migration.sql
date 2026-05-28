/*
  Warnings:

  - You are about to drop the `serices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
-- DROP TABLE `serices`;

-- CreateTable
-- CREATE TABLE `services` (
--     `id` INTEGER NOT NULL AUTO_INCREMENT,
--     `service_code` VARCHAR(50) NULL,
--     `service_name` VARCHAR(100) NULL,
--     `icon_path` VARCHAR(250) NULL,
--     `service_fee` BIGINT NULL,
--     `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
--     `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

--     INDEX `services_service_code_idx`(`service_code`),
--     PRIMARY KEY (`id`)
-- ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


RENAME TABLE `serices` to `services`