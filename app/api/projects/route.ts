import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { triggerBuild } from "@/lib/builder";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const user = session.user;
    //@ts-ignore
    if (!user.id) {
      return NextResponse.json(
        { error: 'User ID not found' }, 
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' }, 
        { status: 400 }
      );
    }

    const { name, githubRepo } = body;

    if (!name || !githubRepo) {
      return NextResponse.json(
        { error: 'Name and GitHub repository are required' }, 
        { status: 400 }
      );
    }

    const githubUrlPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
    if (!githubUrlPattern.test(githubRepo)) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL format' }, 
        { status: 400 }
      );
    }

    if (name.length < 1 || name.length > 50) {
      return NextResponse.json(
        { error: 'Project name must be between 1 and 50 characters' }, 
        { status: 400 }
      );
    }

    const sanitizedName = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const subdomain = `${sanitizedName}-${Date.now().toString(36)}`;

    const existingProject = await prisma.project.findFirst({
      where: { subdomain }
    });

    if (existingProject) {
      return NextResponse.json(
        { error: 'Subdomain already exists, please try again' }, 
        { status: 409 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        githubRepo: githubRepo.trim(),
        subdomain,
        status: "Pending",
        //@ts-ignore
        userId: user.id
      }
    });

    try {
      await triggerBuild(project.id);
    } catch (buildError) {
      console.error('Build trigger failed:', buildError);

      await prisma.project.update({
        where: { id: project.id },
        data: { status: "Failed" }
      });

      return NextResponse.json(
        { 
          error: 'Project created but build failed to start',
          project: project 
        }, 
        { status: 500 }
      );
    }

    return NextResponse.json(project, { status: 201 });

  } catch (error) {
    console.error('POST /api/projects error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const user = session.user;
    
    //@ts-ignore
    if (!user.id) {
      return NextResponse.json(
        { error: 'User ID not found' }, 
        { status: 400 }
      );
    }

    const projects = await prisma.project.findMany({
      //@ts-ignore
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(projects, { status: 200 });

  } catch (error) {
    console.error('GET /api/projects error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}