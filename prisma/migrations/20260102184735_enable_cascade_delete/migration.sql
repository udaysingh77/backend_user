-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sighting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Sighting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Sighting" ("createdAt", "dateTime", "description", "id", "location", "userId") SELECT "createdAt", "dateTime", "description", "id", "location", "userId" FROM "Sighting";
DROP TABLE "Sighting";
ALTER TABLE "new_Sighting" RENAME TO "Sighting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
