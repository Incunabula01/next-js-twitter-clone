import { prisma } from "@/prisma";
import { connectToDb } from "@/utils";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export const POST = async (req: Request) => {
    try {
        const { name, email, password } = await req.json();

        if(!name && !email && !password) {
            return NextResponse.json({ error: "Invalid Data" }, { status: 422 });
        }
        await connectToDb();
        const existingUser = await prisma.user.findFirst({where: { email}});
        if(existingUser){
            return NextResponse.json({ error: "User is already registered, Please login" }, { status: 403 });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const users = await prisma?.user.create({ data: { name, email, password: hashPassword }});

        return NextResponse.json({ users }, { status: 201 });

    } catch (error: any) {
        console.error(`An error has occured! ${error}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}