"use client";


// export const dynamic = 'force-dynamic';

// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { useRouter } from"next/navigation";
// import SignOutButton from "@/components/SignOutButton";

type Project = {
  id: string;
  name: string;
  githubRepo: string;
  status: "pending" | "building" | "live" | "failed";
  subdomain: string;
  lastDeployed?: string;
};

// export default function Dashboard() {
//   const router = useRouter()
//   const { data: session, status } = useSession();
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [newProject, setNewProject] = useState({
//     name: "",
//     githubRepo: ""
//   });
//   const [loading, setLoading] = useState(false);

//    useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/auth/login");
//     }
    
//     if (status === "authenticated") {
//       fetchProjects();
//     }
//   }, [status]);

//   const fetchProjects = async () => {
//     try {
//       const res = await fetch("/api/projects");
//       const data = await res.json();
//       setProjects(data);
//     } catch (error) {
//       console.error("Failed to fetch projects:", error);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const res = await fetch("/api/projects", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newProject),
//       });

//       if (res.ok) {
//         const project = await res.json();
//         setProjects([...projects, project]);
//         setNewProject({ name: "", githubRepo: "" });
//       }
//     } catch (error) {
//       console.error("Failed to create project:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!session) {
//     return <div className="p-4">Loading...</div>;
//   }

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold">Dashboard</h1>
//         {/* <SignOutButton /> */}
//         Sign Out
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow mb-8">
//         <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block mb-1">Project Name</label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded"
//               value={newProject.name}
//               onChange={(e) => setNewProject({...newProject, name: e.target.value})}
//               required
//             />
//           </div>
//           <div>
//             <label className="block mb-1">GitHub Repository URL</label>
//             <input
//               type="text"
//               className="w-full p-2 border rounded"
//               placeholder="https://github.com/username/repo"
//               value={newProject.githubRepo}
//               onChange={(e) => setNewProject({...newProject, githubRepo: e.target.value})}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? "Creating..." : "Create Project"}
//           </button>
//         </form>
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
//         {projects.length === 0 ? (
//           <p>No projects yet. Create your first project above.</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {projects.map((project) => (
//               <div key={project.id} className="border p-4 rounded-lg">
//                 <h3 className="font-medium">{project.name}</h3>
//                 <p className="text-sm text-gray-600 mb-2">{project.githubRepo}</p>
//                 <div className="flex items-center mb-2">
//                   <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
//                     project.status === 'live' ? 'bg-green-500' :
//                     project.status === 'failed' ? 'bg-red-500' :
//                     'bg-yellow-500'
//                   }`}></span>
//                   <span className="text-sm capitalize">{project.status}</span>
//                 </div>
//                 {project.status === 'live' && (
//                   <Link 
//                     href={`http://${project.subdomain}.localhost`} 
//                     target="_blank"
//                     className="text-blue-600 hover:underline text-sm"
//                   >
//                     View Deployment
//                   </Link>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

export default function Dashboard() {
  return (
    <>
      Dashboard
    </>
  )
}