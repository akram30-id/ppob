/*
  Warnings:

  - You are about to drop the column `userId` on the `user_balances` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `user_balances_userId_idx` ON `user_balances`;

-- AlterTable
ALTER TABLE `user_balances` DROP COLUMN `userId`,
    ADD COLUMN `user_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `user_balances_user_id_idx` ON `user_balances`(`user_id`);
