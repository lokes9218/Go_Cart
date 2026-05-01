import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
  SyncUserCreation,
  SyncUserUpdate,
  SyncUserDeletion,
  SyncStoreCreation,
  SyncStoreUpdate,
  SyncStoreDeletion,
} from "../../../inngest/function";
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
