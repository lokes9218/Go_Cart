import {inngest} from './client';
import prisma from '@/lib/prisma';

export const SyncUserCreation = inngest.createFunction(
    {
        id: 'sync-user-creation',
        triggers: { event: 'clerk/user.created' }
    },
    async({event}) => {
        const {data}=event;
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.emailAddresses[0].emailAddress,
                name:`${data.firstName} ${data.lastName}`,
                image: data.profileImageUrl,
            }
        })
    }   
)

// #inngests to update user data on clerk user update events, and to delete user data on clerk user delete events can be added similarly
export const SyncUserUpdate = inngest.createFunction(
    {
        id: 'sync-user-update',
        triggers: { event: 'clerk/user.updated' }
    },
    async({event}) => {
        const {data}=event;
        await prisma.user.update({
            where: {id: data.id},
            data: {
                email: data.emailAddresses[0].emailAddress,
                name:`${data.firstName} ${data.lastName}`,
                image: data.profileImageUrl,
            }
        })
    }       
)
// next deletion of user data on clerk user delete events
export const SyncUserDeletion = inngest.createFunction(
    {
        id: 'sync-user-deletion',
        triggers: { event: 'clerk/user.deleted' }
    },
    async({event}) => {
        const {data}=event;
        await prisma.user.delete({
            where: {id: data.id},
        })
    }
)


//ingestion of events related to store creation, update and deletion can be added similarly, with appropriate triggers and database operations. 
export const SyncStoreCreation = inngest.createFunction(
    {
        id: 'sync-store-creation',  
        triggers: { event: 'store.created' }
    },
    async({event}) => {
        const {data}=event;
        await prisma.store.create({
            data: {
                id: data.id,
                name: data.name,
                ownerId: data.ownerId,
                isActive: data.isActive,
            }
        })
    }
)

export const SyncStoreUpdate = inngest.createFunction(  
    {
        id: 'sync-store-update',
        triggers: { event: 'store.updated' }
    },
    async({event}) => {
        const {data}=event;     
        await prisma.store.update({
            where: {id: data.id},
            data: {
                name: data.name,
                isActive: data.isActive,
            }
        })
    }
)

export const SyncStoreDeletion = inngest.createFunction(
    {
        id: 'sync-store-deletion',
        triggers: { event: 'store.deleted' }
    },
    async({event}) => {
        const {data}=event;
        await prisma.store.delete({
            where: {id: data.id},
        })
    }   
)

