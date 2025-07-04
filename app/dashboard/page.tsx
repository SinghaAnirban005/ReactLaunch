'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<null | {
    success: boolean;
    message: string;
    subdomain?: string;
  }>(null);

  useEffect(() => {
    console.log("Dashboard - Session status:", status);
    console.log("Dashboard - Session data:", session);
  }, [session, status]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      console.log("User is not authenticated, redirecting to login");
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2">Loading session...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setDeploymentStatus(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          githubRepo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Deployment failed');
      }

      setDeploymentStatus({
        success: true,
        message: 'Deployment started successfully!',
        subdomain: data.subdomain,
      });
    } catch (error) {
      setDeploymentStatus({
        success: false,
        message: error instanceof Error ? error.message : 'Deployment failed',
      });
    } finally {
      setIsDeploying(false);
      setProjectName('');
      setGithubRepo('');
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Project Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Deploy your React applications
          </p>

          <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
            <p><strong>Welcome:</strong> {session?.user?.email}</p>
            <p><strong>Status:</strong> {status}</p>
            <button
              onClick={handleSignOut}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Sign Out
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              required
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="my-awesome-project"
            />
          </div>

          <div>
            <label htmlFor="githubRepo" className="block text-sm font-medium text-gray-700">
              GitHub Repository URL
            </label>
            <input
              id="githubRepo"
              type="url"
              required
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isDeploying}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isDeploying 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isDeploying ? 'Deploying...' : 'Deploy Project'}
            </button>
          </div>
        </form>

        {deploymentStatus && (
          <div className={`mt-4 p-4 rounded-md ${
            deploymentStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <p>{deploymentStatus.message}</p>
            {deploymentStatus.success && deploymentStatus.subdomain && (
              <p className="mt-2">
                Your project will be available at:{' '}
                <a 
                  href={`http://${deploymentStatus.subdomain}.localhost`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  {deploymentStatus.subdomain}.localhost
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}