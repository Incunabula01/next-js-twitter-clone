import {prisma} from "@/prisma";

export const connectToDb = async () => {
    try {
        await prisma?.$connect()
    } catch (error: any) {
        return new Error('Can not connect to db', error.message);
    }
}