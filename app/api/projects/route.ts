import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { triggerBuild } from "@/lib/builder";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
    const session = await auth()

    const user = session.user
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
                userId: user.id
            }
        })
    
        await triggerBuild(project.id)
        
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
        const session = await auth()

        const user = session.user
        if(!user) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        } 

        const projects = await prisma.project.findMany({
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