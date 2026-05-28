-- AlterTable
ALTER TABLE `transaction_histories` ADD COLUMN `transaction_type_code` VARCHAR(50) NULL AFTER service_code;
