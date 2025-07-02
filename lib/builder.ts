import { promisify } from "util"
import { exec } from "child_process"
import fs from "fs"
import path from "path"
import { prisma } from "./prisma"
import { NextResponse } from "next/server"

const execPromise = promisify(exec)
const BUILD_DIR = path.join(process.cwd(), 'builds')
const DEPLOY_DIR = path.join(process.cwd(), 'deployments')

export async function triggerBuild(projectId: string) {
    try {
        const project = await prisma.project.update({
            where: { id: projectId },
            data: {
                status: 'building'
            }
        })
    
        if(!project){
            return NextResponse.json({message: 'Project does not exist'})
        }
    
        const projectBuildDir = path.join(BUILD_DIR, project.id)
        const projectDeployDir = path.join(DEPLOY_DIR, project.subdomain)
        
        if (!fs.existsSync(projectBuildDir)) fs.mkdirSync(projectBuildDir, { recursive: true });
        if (!fs.existsSync(projectDeployDir)) fs.mkdirSync(projectDeployDir, { recursive: true });
    
        await execPromise(`git clone ${project.githubRepo} ${projectBuildDir}`);
        await execPromise(`npm install`, { cwd: projectBuildDir });
        await execPromise(`npm run build`, { cwd: projectBuildDir });

        const buildOutputDir = path.join(projectBuildDir, 'build');
        await execPromise(`cp -r ${buildOutputDir}/* ${projectDeployDir}/`);

    
        await prisma.project.update({
          where: { id: projectId },
          data: {
            status: 'live',
            lastDeployed: new Date() 
          }
        });
    
        console.log('Successfully built and deployed project')
    } catch (error) {
        console.log('Build failed for project')
        await prisma.project.update({
            where: { id: projectId},
            data: {
                status: 'failed'
            }
        })
    }
}