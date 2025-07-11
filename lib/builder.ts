import { promisify } from 'util';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from './prisma';

const execPromise = promisify(exec);
const BUILD_DIR = path.join(process.cwd(), 'builds');
const DEPLOY_DIR = path.join(process.cwd(), 'deployments');

export async function triggerBuild(projectId: string) {
  try {
    console.log(`Starting build for project ${projectId}`);

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { status: 'building' },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const projectBuildDir = path.join(BUILD_DIR, project.id);
    const projectDeployDir = path.join(DEPLOY_DIR, project.subdomain);

    // Ensure directories exist
    fs.mkdirSync(projectBuildDir, { recursive: true });
    fs.mkdirSync(projectDeployDir, { recursive: true });

    // Clone repository
    console.log(`Cloning repository: ${project.githubRepo}`);
    await execPromise(`git clone ${project.githubRepo} ${projectBuildDir}`);

    // Install dependencies
    console.log(projectBuildDir);
    console.log('Installing dependencies...');
    const { stdout, stderr } = await execPromise(
      'npm install --legacy-peer-deps --no-audit --loglevel warn',
      {
        cwd: projectBuildDir,
        env: {
          ...process.env,
          NODE_ENV: 'development',
        },
      }
    );
    console.log(stdout);
    console.error(stderr);

    const pkgJson = fs.readFileSync(
      path.join(projectBuildDir, 'package.json'),
      'utf-8'
    );
    console.log('=== package.json ===');
    console.log(pkgJson);

    // Build project
    console.log('Building project...');
    try {
      const { stdout, stderr } = await execPromise('npm run build', {
        cwd: projectBuildDir,
      });
      console.log('Build stdout:', stdout);
      console.error('Build stderr:', stderr);
    } catch (error: any) {
      console.error(
        'Build failed with:',
        error.stdout || '',
        error.stderr || '',
        error.message
      );
      throw error;
    }

    // Copy build artifacts
    console.log('Copying build artifacts...');
    const buildOutputDir = path.join(projectBuildDir, 'dist');
    await execPromise(`cp -r ${buildOutputDir}/* ${projectDeployDir}/`);

    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'live',
        lastDeployed: new Date(),
      },
    });

    console.log('Successfully built and deployed project');
    return { success: true };
  } catch (error) {
    console.error('Build failed:', error);

    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'failed' },
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Build failed',
    };
  }
}

export async function startBuilder() {
  console.log('Builder service started');

  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

startBuilder();
