/*
  Warnings:

  - You are about to drop the `simulated_metrics` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "simulated_metrics" DROP CONSTRAINT "simulated_metrics_matchId_fkey";

-- DropForeignKey
ALTER TABLE "simulated_metrics" DROP CONSTRAINT "simulated_metrics_playerId_fkey";

-- DropTable
DROP TABLE "simulated_metrics";
