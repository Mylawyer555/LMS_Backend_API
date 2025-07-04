import { PrismaClient } from "@prisma/client";

// This code initializes a Prisma Client instance for database interactions.
let db = PrismaClient

// It checks if a global instance already exists to avoid creating multiple instances in development mode.
declare global{
    var __db : PrismaClient | undefined;
}

// If the global instance does not exist, it creates a new PrismaClient instance and assigns it to the global variable.
if(!global.__db){
    global.__db = new PrismaClient();
};

// Assign the global Prisma Client instance to the local variable `db`.
db = global.__db;

// Export the db instance for use in other parts of the application.
// This allows other modules to import and use the same Prisma Client instance.
export {db};