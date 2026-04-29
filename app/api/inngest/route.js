import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { SyncUserCreation, SyncUserUpdate, SyncUserDeletion } from "../../../inngest/function";
import { SyncStoreCreation, SyncStoreUpdate, SyncStoreDeletion } from "../../../inngest/storeFunctions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    SyncUserCreation,
    SyncUserUpdate,
    SyncUserDeletion,
    SyncStoreCreation,
    SyncStoreUpdate,
    SyncStoreDeletion
  ],
});
