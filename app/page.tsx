'use client';
import { useState, useEffect } from 'react';
import {
  Rocket,
  Zap,
  Code,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Github,
  Play,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [deployCount, setDeployCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setDeployCount((prev) => (prev < 12847 ? prev + 1 : 12847));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className='w-6 h-6' />,
      title: 'Lightning Fast',
      description:
        'Deploy your React apps in seconds with our optimized build pipeline',
    },
    {
      icon: <Globe className='w-6 h-6' />,
      title: 'Global CDN',
      description:
        'Instant worldwide distribution with edge caching for maximum performance',
    },
    {
      icon: <Code className='w-6 h-6' />,
      title: 'Zero Config',
      description:
        'Just push your code. We handle the rest with intelligent auto-detection',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Frontend Developer',
      text: 'Deployment has never been this smooth. Love it!',
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Tech Lead',
      text: 'Our team productivity increased by 40% after switching.',
    },
    {
      name: 'Emily Watson',
      role: 'Indie Hacker',
      text: 'Perfect for rapid prototyping and testing ideas.',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden'>
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
        <div className='absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000'></div>
        <div className='absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000'></div>
      </div>

      <nav className='relative z-10 px-6 py-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center'>
              <Rocket className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent'>
              ReactLaunch
            </span>
          </div>
          <div className='hidden md:flex items-center space-x-8'>
            <a
              href='#'
              className='text-gray-300 hover:text-white transition-colors'
            >
              Features
            </a>
            <a
              href='#'
              className='text-gray-300 hover:text-white transition-colors'
            >
              Pricing
            </a>
            <a
              href='#'
              className='text-gray-300 hover:text-white transition-colors'
            >
              Docs
            </a>
            <button
              className='bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105'
              onClick={() => router.push('/auth/login')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className='relative z-10 px-6 py-20'>
        <div className='max-w-7xl mx-auto text-center'>
          <div
            className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          >
            <h1 className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent'>
              Deploy React Apps
              <br />
              <span className='bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent'>
                Like Magic
              </span>
            </h1>
            <p className='text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto'>
              The fastest way to deploy your static React applications. Start
              Dep Zero configuration, infinite possibilities.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-12'>
              <button
                className='group bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2'
                onClick={() => router.push('/auth/login')}
              >
                <span>Start Deploying</span>
                <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </button>
              <button className='group border border-gray-600 hover:border-gray-400 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center space-x-2'>
                <Play className='w-5 h-5' />
                <span>Watch Demo</span>
              </button>
            </div>
            <div className='flex items-center justify-center space-x-8 text-sm text-gray-400'>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='w-4 h-4 text-green-500' />
                <span>Free tier available</span>
              </div>
              <div className='flex items-center space-x-2'>
                <CheckCircle className='w-4 h-4 text-green-500' />
                <span>No credit card required</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Star className='w-4 h-4 text-yellow-500' />
                <span>{deployCount.toLocaleString()}+ deployments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='relative z-10 px-6 py-20'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              Why Choose ReactLaunch?
            </h2>
            <p className='text-xl text-gray-400 max-w-2xl mx-auto'>
              Built by developers, for developers. Experience the future of
              React deployment.
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 hover:border-purple-500 transition-all duration-500 transform hover:scale-105 cursor-pointer ${activeFeature === index ? 'border-purple-500 bg-gradient-to-b from-purple-900/30 to-slate-900/50' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                  {feature.icon}
                </div>
                <h3 className='text-xl font-semibold mb-4'>{feature.title}</h3>
                <p className='text-gray-400 group-hover:text-gray-300 transition-colors'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative z-10 px-6 py-20'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              Deploy in 3 Simple Steps
            </h2>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                step: '01',
                title: 'Connect Repository',
                code: 'git clone your-repo',
              },
              { step: '02', title: 'Build & Deploy', code: 'npm run build' },
              { step: '03', title: 'Go Live', code: '🚀 Live in seconds' },
            ].map((item, index) => (
              <div key={index} className='relative'>
                <div className='bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-700'>
                  <div className='text-6xl font-bold text-purple-500/30 mb-4'>
                    {item.step}
                  </div>
                  <h3 className='text-xl font-semibold mb-4'>{item.title}</h3>
                  <div className='bg-slate-950 rounded-lg p-4 font-mono text-sm text-green-400'>
                    {item.code}
                  </div>
                </div>
                {index < 2 && (
                  <div className='hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2'>
                    <ArrowRight className='w-6 h-6 text-purple-500' />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative z-10 px-6 py-20'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              Loved by Developers
            </h2>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className='bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700'
              >
                <div className='flex items-center space-x-1 mb-4'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 text-yellow-500 fill-current'
                    />
                  ))}
                </div>
                <p className='text-gray-300 mb-6 italic'>
                  "{testimonial.text}"
                </p>
                <div>
                  <div className='font-semibold'>{testimonial.name}</div>
                  <div className='text-sm text-gray-400'>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative z-10 px-6 py-20'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/30'>
            <h2 className='text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
              Ready to Deploy?
            </h2>
            <p className='text-xl text-gray-300 mb-8'>
              Join thousands of developers who trust ReactLaunch for their
              projects.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button className='group bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2'>
                <Github className='w-5 h-5' />
                <span>Connect with GitHub</span>
              </button>
              <button className='border border-gray-600 hover:border-gray-400 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300'>
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className='relative z-10 px-6 py-12 border-t border-slate-800'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center space-x-2 mb-4 md:mb-0'>
              <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center'>
                <Rocket className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent'>
                ReactLaunch
              </span>
            </div>
            <div className='flex space-x-8 text-sm text-gray-400'>
              <a href='#' className='hover:text-white transition-colors'>
                Privacy
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                Terms
              </a>
              <a href='#' className='hover:text-white transition-colors'>
                Support
              </a>
            </div>
          </div>
          <div className='mt-8 pt-8 border-t border-slate-800 text-center text-gray-400'>
            <p>© 2025 ReactLaunch. Built with ❤️ for the React community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
