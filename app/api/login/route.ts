import { prisma } from "@/prisma";
import { connectToDb } from "@/utils";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
    try {
        const { email, password } = await req.json();

        if (!email && !password) {
            return NextResponse.json({ error: "Invalid Data" }, { status: 422 });
        }
        await connectToDb();
       
        const existingUser = await prisma.user.findFirst({where: { email}});

        if(!existingUser){
            return NextResponse.json({ message: "User not registered" }, { status: 401 });
        } 

        const checkPassword = await bcrypt.compare(password, existingUser.password);
        if(!checkPassword){
            return NextResponse.json({ message: "Invalid Password" }, { status: 403 });
        }

        return NextResponse.json({ message: "Logged in!" }, { status: 201 });

    } catch (error: any) {
        console.error(`An error has occured! ${error}`);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}