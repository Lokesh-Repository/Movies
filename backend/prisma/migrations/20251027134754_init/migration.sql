CREATE TYPE "EntryType" AS ENUM ('MOVIE', 'TV_SHOW');

CREATE TABLE "entries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "EntryType" NOT NULL,
    "director" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);
