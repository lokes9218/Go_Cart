import {inngest} from './client';
import {prisma} from '@lib/prisma';

export const SyncUserCreation = inngest.createFunction(
    {id: 'sync-user-creation'},
    {event:'clerk/user.created'},
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
    {id: 'sync-user-update'},
    {event:'clerk/user.updated'},
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
    {id: 'sync-user-deletion'},
    {event:'clerk/user.deleted'},
    async({event}) => {
        const {data}=event;
        await prisma.user.delete({
            where: {id: data.id},
        })
    }
)
