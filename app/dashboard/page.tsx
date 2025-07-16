'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState('deploy');
  const [deploymentStatus, setDeploymentStatus] = useState<null | {
    success: boolean;
    message: string;
    subdomain?: string;
  }>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <motion.div
          className='text-center'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className='w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4'
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className='text-gray-600 font-medium'>Loading session...</p>
        </motion.div>
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
        credentials: 'include',
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

  const handleProjectsNavigation = () => {
    router.push('/dashboard/projects');
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          className='absolute w-96 h-96 bg-blue-50 rounded-full opacity-50 blur-3xl'
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className='absolute w-80 h-80 bg-indigo-50 rounded-full opacity-40 blur-3xl'
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse' }}
          style={{ top: '60%', right: '10%' }}
        />
      </div>

      <div className='relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
              <p className='text-gray-600 mt-1'>
                Welcome back, {session?.user?.email}
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-sm font-medium text-green-800'>
                  Online
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className='text-sm font-medium text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors'
              >
                Sign Out
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='mb-8'
        >
          <div className='border-b border-gray-200'>
            <nav className='flex space-x-8'>
              <button
                onClick={() => setActiveTab('deploy')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'deploy'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Deploy New Project
              </button>
              <button
                onClick={handleProjectsNavigation}
                className='py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm transition-colors'
              >
                My Projects
              </button>
            </nav>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className='max-w-2xl'>
            <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
              <div className='mb-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-2'>
                  Deploy New Project
                </h2>
                <p className='text-gray-600'>
                  Deploy your React projects with ease
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label
                    htmlFor='projectName'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Project Name
                  </label>
                  <input
                    id='projectName'
                    type='text'
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                    placeholder='my-awesome-project'
                    disabled={isDeploying}
                  />
                </div>

                <div>
                  <label
                    htmlFor='githubRepo'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    GitHub Repository URL
                  </label>
                  <input
                    id='githubRepo'
                    type='url'
                    required
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
                    placeholder='https://github.com/username/repo'
                    disabled={isDeploying}
                  />
                </div>

                <motion.button
                  type='submit'
                  disabled={isDeploying}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    isDeploying
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                  }`}
                  whileHover={!isDeploying ? { scale: 1.01 } : {}}
                  whileTap={!isDeploying ? { scale: 0.99 } : {}}
                >
                  {isDeploying ? (
                    <div className='flex items-center justify-center'>
                      <motion.div
                        className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2'
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                      Deploying...
                    </div>
                  ) : (
                    'Deploy Project'
                  )}
                </motion.button>
              </form>

              {deploymentStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 p-4 rounded-lg border ${
                    deploymentStatus.success
                      ? 'bg-green-50 text-green-800 border-green-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  <p className='font-medium'>{deploymentStatus.message}</p>
                  {deploymentStatus.success && deploymentStatus.subdomain && (
                    <p className='mt-2 text-sm'>
                      Your project will be available at:{' '}
                      <a
                        href={`http://${deploymentStatus.subdomain}.localhost`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 hover:text-blue-800 font-medium underline'
                      >
                        {deploymentStatus.subdomain}.localhost
                      </a>
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
