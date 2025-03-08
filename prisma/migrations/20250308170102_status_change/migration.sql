/*
  Warnings:

  - The values [SUPER_ADMIN] on the enum `User_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [SUPER_ADMIN] on the enum `User_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Company` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('USER', 'ADMIN', 'MANAGER', 'SUPER_ADMIN') NOT NULL DEFAULT 'USER',
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';
