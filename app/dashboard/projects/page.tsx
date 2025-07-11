'use client';

import { DateTime } from 'next-auth/providers/kakao';
import { useEffect, useState } from 'react';

interface projectProps {
  id: string;
  createdAt: DateTime;
  githubRepo: string;
  lastDeployed: DateTime;
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
      const projects = await fetch('/api/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await projects.json();

      setUserProjects(data);
    };

    try {
      getUserProjects();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      <div className='flex flex-col items-center'>
        <h1>Projects</h1>
        {userProjects.map((item) => (
          <li key={item.id}>
            <a
              href={`http://${item.subdomain}.localhost`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-indigo-600 hover:text-indigo-500'
            >
              {item.subdomain}.localhost
            </a>
          </li>
        ))}
      </div>
    </>
  );
}
