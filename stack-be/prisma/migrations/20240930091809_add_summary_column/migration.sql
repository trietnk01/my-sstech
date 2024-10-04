/*
  Warnings:

  - Added the required column `summary` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `posts` ADD COLUMN `summary` TINYTEXT NOT NULL;
