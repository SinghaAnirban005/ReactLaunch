import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { triggerBuild } from '@/lib/builder';

export async function POST(request: Request) {
  const signature = request.headers.get('x-hub-signature-256') || '';

  const payload = await request.text();

  const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET!);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');

  if (digest != signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = request.headers.get('x-github-event');
  const body = JSON.parse(payload);

  if (event === 'push') {
    try {
      const repoUrl = body.repository.html_url;
      const project = await prisma.project.findFirst({
        where: { githubRepo: repoUrl },
      });

      if (project) {
        await triggerBuild(project.id);
        console.log('Build triggered for project');
      }

      return NextResponse.json({ message: 'Webhook received' });
    } catch (error) {
      console.error('Error handling webhook:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: 'Event  not handled' });
}

export const dynamic = 'force-dynamic';
