/*
  Warnings:

  - You are about to drop the `club_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `player_match_stats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "player_match_stats" DROP CONSTRAINT "player_match_stats_matchId_fkey";

-- DropForeignKey
ALTER TABLE "player_match_stats" DROP CONSTRAINT "player_match_stats_playerId_fkey";

-- DropTable
DROP TABLE "club_history";

-- DropTable
DROP TABLE "player_match_stats";
