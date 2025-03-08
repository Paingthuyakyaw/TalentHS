/*
  Warnings:

  - The values [ACTIVE] on the enum `User_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `email` on the `CompanyProfile` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `CompanyProfile` table. All the data in the column will be lost.
  - The values [ACTIVE] on the enum `User_status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Company` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Company` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUPER_ADMIN') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `CompanyProfile` DROP COLUMN `email`,
    DROP COLUMN `phone`;

-- AlterTable
ALTER TABLE `User` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'SUPER_ADMIN') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX `Company_email_key` ON `Company`(`email`);
