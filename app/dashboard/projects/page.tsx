'use client';
import { useEffect, useState } from 'react';

interface projectProps {
  id: string;
  createdAt: string;
  githubRepo: string;
  lastDeployed: string;
  name: string;
  status: string;
  subdomain: string;
  updatedAt: string;
  userId: string;
}

export default function Projects() {
  const [userProjects, setUserProjects] = useState<projectProps[]>([]);

  useEffect(() => {
    const getUserProjects = async () => {
      try {
        const projects = await fetch('/api/projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const data = await projects.json();
        setUserProjects(data);
      } catch (error) {
        console.error(error);
      }
    };
    getUserProjects();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto px-6 py-12'>
        <div className='border-b border-gray-200 pb-8 mb-8'>
          <h1 className='text-4xl font-serif text-gray-900 mb-2'>
            Project Portfolio
          </h1>
          <p className='text-gray-600 text-lg'>
            A comprehensive overview of deployed applications
          </p>
        </div>

        {userProjects.length === 0 ? (
          <div className='text-center py-16'>
            <div className='bg-white border border-gray-200 rounded-lg shadow-sm p-12'>
              <h2 className='text-xl font-serif text-gray-700 mb-2'>
                No Projects Available
              </h2>
              <p className='text-gray-500'>
                Your project portfolio is currently empty.
              </p>
            </div>
          </div>
        ) : (
          <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
            <div className='bg-gray-50 border-b border-gray-200 px-6 py-4'>
              <div className='grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 uppercase tracking-wide'>
                <div className='col-span-3'>Project Name</div>
                <div className='col-span-3'>Deployment URL</div>
                <div className='col-span-2'>Status</div>
                <div className='col-span-2'>Last Deployed</div>
                <div className='col-span-2'>Created</div>
              </div>
            </div>

            <div className='divide-y divide-gray-200'>
              {userProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`px-6 py-5 hover:bg-gray-50 transition-colors duration-150 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <div className='grid grid-cols-12 gap-4 items-center'>
                    <div className='col-span-3'>
                      <h3 className='font-serif text-lg text-gray-900 mb-1'>
                        {project.name}
                      </h3>
                      <p className='text-sm text-gray-500 font-mono'>
                        {project.id}
                      </p>
                    </div>

                    <div className='col-span-3'>
                      <a
                        href={`http://${project.subdomain}.react-launch.duckdns.org`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-700 hover:text-blue-800 underline decoration-1 underline-offset-2 font-mono text-sm'
                      >
                        {project.subdomain}.react-launch.duckdns.org
                      </a>
                    </div>

                    <div className='col-span-2'>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          project.status === 'deployed'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            project.status === 'deployed'
                              ? 'bg-green-400'
                              : 'bg-yellow-400'
                          }`}
                        />
                        {project.status.charAt(0).toUpperCase() +
                          project.status.slice(1)}
                      </span>
                    </div>

                    <div className='col-span-2'>
                      <p className='text-sm text-gray-600'>
                        {formatDate(project.lastDeployed)}
                      </p>
                    </div>

                    <div className='col-span-2'>
                      <p className='text-sm text-gray-600'>
                        {formatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='mt-8 pt-6 border-t border-gray-200'>
          <p className='text-center text-gray-500 text-sm'>
            Total Projects: {userProjects.length}
          </p>
        </div>
      </div>
    </div>
  );
}
