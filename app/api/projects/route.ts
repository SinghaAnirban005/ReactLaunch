import { prisma } from "@/lib/prisma";
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const session = useSession()

    const user = session.data?.user
    if(!user){
        return NextResponse.json(
            {error: 'Unauthorized'}, {status: 401}
        )
    }

    try {
        const { name , githubRepo } = await request.json()
    
        const project = await prisma.project.create({
            data: {
                name: name,
                githubRepo: githubRepo,
                subdomain: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString(36)}`,
                status: "Pending",
                //@ts-ignore
                userId: user.id
            }
        })
    
        // i need to trigger the build here
        
        return NextResponse.json(project, { status: 200 })
    } catch (error) {
        return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    }
}

export async function GET() {
    try {
        const session = useSession()
        const user = await session.data?.user

        if(!user) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        } 

        const projects = await prisma.project.findMany({
            //@ts-ignore
            where: { userId: user.id }
        })

        return NextResponse.json(projects, {status: 200})
    } catch (error) {
        return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    }
}